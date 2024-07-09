import { SlideBuilder } from "./slides/builder.js";
import slidesApi from "./slides/api.js";
import { convertTitleToSlides, 
    convertSummaryToSlide, convertSummaryToSpeakerNotes, 
    addImagesReferenceList, addImagesToSlides } from "./slides/logic.js";
import { convertSpeechmaticsSummary } from "./video/logic.js";
import videoApi from "./video/api.js";
import oauthApi from "./oauth/api.js";
import imagesApi from "./images/api.js";

// returns { presentationId, numSlides }
export const convertVideoToSlides = async (
    {filePath, fileName, file, title, slidesOAuthToken}, updateStatus, presentationIdReady, slideReady, next) => {

    // Polling to check job status
    const checkJobStatus = (id, videoToken) => {
        updateStatus("Processing Video");
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
                        parseSummary(results, slidesOAuthToken, title, updateStatus, presentationIdReady, slideReady, next);
                    })
                } else {
                    console.log("Job rejected")
                    clearInterval(timeout)
                }
            })
            .catch(e => console.log(e))
        }, 5000);
    }
    updateStatus("Checking Google Slides Credentials");
    const isValid = await oauthApi.validateToken({authToken: slidesOAuthToken});
    const speechmaticsToken = process.env.SPEECHMATICS_API_KEY;
    if (isValid && speechmaticsToken) {
        updateStatus("Starting Video Processing");
        const jobData = !file ? 
            await videoApi.sendVideoFromPath(fileName, filePath, speechmaticsToken) 
            : await videoApi.sendVideoFromFile(file, speechmaticsToken);
        if (jobData.id) {
            console.log("Speechmatics job id is " + jobData.id)
            checkJobStatus(jobData.id, speechmaticsToken, parseSummary);
        } else {
            next({error: jobData.error})
        }
    } else {
        next({error: "Invalid token"})
    }

}

export const parseSummary = async (data, slidesOAuthToken, title, updateStatus, presentationIdReady, slideReady, next) => {
    const summary = convertSpeechmaticsSummary(data);
    const {presentationId} = await slidesApi.createPresentation({
        authToken: slidesOAuthToken,
        title: title
    });
    if (!presentationId) {
        return next({error: "Error creating presentation"});
    }
    try {
        presentationIdReady(presentationId);
        console.log("Presentation id is " + presentationId )
        updateStatus("Building Slides");
        const slideBuilder = SlideBuilder();
        convertTitleToSlides(slideBuilder, title)
        await slidesApi.updatePresentation(slidesOAuthToken, presentationId, slideBuilder.buildRequests());
        slideReady("p");
        const imagesUsed = []
        for (let i = 0; i < summary.length; i++) {
            updateStatus("Building Slide #" + (i+1));
            const s = summary[i];
            const summarySlideBuilder = SlideBuilder();
            const slideId = `slide${i}`;
            convertSummaryToSlide(summarySlideBuilder, s, slideId, i);
            const requests = summarySlideBuilder.buildRequests();
            await slidesApi.updatePresentation(slidesOAuthToken, presentationId, requests);
    
            const images = await imagesApi.searchImages({
                apiKey: process.env.CUSTOM_SEARCH_API_KEY,
                searchEngineId: process.env.CUSTOM_SEARCH_ENGINE_ID,
                query: s.sectionTitle.slice(2)
            });
            for (let im = 0; im < images.length; im++) {
                const imagesSlideBuilder = SlideBuilder();
                addImagesToSlides(imagesSlideBuilder, slideId, [images[0]]);
                const requests = imagesSlideBuilder.buildRequests();
                const imgRes = await slidesApi.updatePresentation(slidesOAuthToken, presentationId, requests);
                if (!imgRes.error) {
                    imagesUsed.push(images[0]);
                    break;
                }
            }
            console.log("Calling Slides API to build slides from summary")
            console.log("Done slide request " + i)
            try {
                const {id} = await slidesApi.getSlideSpeakerNotesId(slidesOAuthToken, presentationId, slideId)
                const speakerNotesSlideBuilder = SlideBuilder();
                convertSummaryToSpeakerNotes(speakerNotesSlideBuilder, s, id)
                await slidesApi.updatePresentation(slidesOAuthToken, presentationId, speakerNotesSlideBuilder.buildRequests());
            } catch (e) {
                console.log(e);
            }
            slideReady(slideId);
            console.log("Done speaker notes request " + i);
    
        }
        const imageReferencesBuilder = SlideBuilder();
        addImagesReferenceList(imageReferencesBuilder, imagesUsed, "imageReferencesSlide");
        await slidesApi.updatePresentation(slidesOAuthToken, presentationId, imageReferencesBuilder.buildRequests());
        slideReady("imageReferencesSlide");
        updateStatus("Finishing");
        next({
            presentationId,
            numSlides: summary.length + 1
        });
    } catch (e) {
        console.log(e);
        next({error: "There was an error building the slides"})
    }
    
}

