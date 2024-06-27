import dotenv from "dotenv";
import { SlideBuilder } from "./slides/builder.js";
import slidesApi from "./slides/api.js";
import { convertTitleToSlides, convertSummaryToSlide, convertSummaryToSpeakerNotes } from "./slides/logic.js";
import { convertSpeechmaticsSummary } from "./video/logic.js";
import videoApi from "./video/api.js";
import oauthApi from "./oauth/api.js";

dotenv.config();

// returns { presentationId, numSlides }
export const convertVideoToSlides = async ({filePath, fileName, title, slidesOAuthToken}, next) => {

    const checkJobStatus = (id, videoToken, onFinish) => {
        console.log("Job id is " + id)
        const timeout = setInterval(() => {
            console.log("Checking job " + id)
            videoApi.checkVideoStatus(id, videoToken)
            .then(data => {
                const job = data.job
                if (!job) {
                    return;
                }
                if (job.status == "running") {
                    console.log("Job is still running");
                    return;
                } else if (job.status == "done") {
                    console.log("Job is done")
                    clearInterval(timeout);
                    videoApi.getVideoSummary(id, videoToken)
                    .then(results => {
                        const summary = results.summary.content;
                        console.log("Summary is:")
                        console.log(summary);
                        onFinish(results)
                    })
                } else {
                    console.log("Job rejected")
                    clearInterval(timeout)
                }
            })
            .catch(e => console.log(e))
        }, 5000);
    }

    const parseSummary = async (data) => {
        const summary = convertSpeechmaticsSummary(data);
        const {presentationId} = await slidesApi.createPresentation({
            authToken: slidesOAuthToken,
            title: title
        });
        console.log("Presentation id is " + presentationId )
        const slideBuilder = SlideBuilder();
        convertTitleToSlides(slideBuilder, title)
        await slidesApi.updatePresentation(slidesOAuthToken, presentationId, slideBuilder.buildRequests());
        for (let i = 0; i < summary.length; i++) {
            const s = summary[i];
            const summarySlideBuilder = SlideBuilder();
            const slideId = `slide${i}`;
            convertSummaryToSlide(summarySlideBuilder, s, slideId, i);
            const requests = summarySlideBuilder.buildRequests();
            console.log("Calling Slides API to build slides from summary")
            await slidesApi.updatePresentation(slidesOAuthToken, presentationId, requests);
            console.log("Done slide request " + i)
            const {id} = await slidesApi.getSlideSpeakerNotesId(slidesOAuthToken, presentationId, slideId)
            const speakerNotesSlideBuilder = SlideBuilder();
            convertSummaryToSpeakerNotes(speakerNotesSlideBuilder, s, id)
            await slidesApi.updatePresentation(slidesOAuthToken, presentationId, speakerNotesSlideBuilder.buildRequests());
            console.log("Done speaker notes request " + i);

        }

        next({
            presentationId,
            numSlides: summary.length + 1
        });
        
    }

    const isValid = await oauthApi.validateToken({authToken: slidesOAuthToken});
    const speechmaticsToken = process.env.SPEECHMATICS_API_KEY;
    if (isValid && speechmaticsToken) {
        const jobData = await videoApi.sendVideoFromPath(fileName, filePath, speechmaticsToken);
        if (jobData.id) {
            checkJobStatus(jobData.id, speechmaticsToken, parseSummary);
        }
    }

}


