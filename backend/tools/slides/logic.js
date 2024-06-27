const SLIDE_WIDTH = 720;
const SLIDE_HEIGHT = 405;
const HEADER_FONT_SIZE = 40;
const HEADER_FONT_FAMILY = "Montserrat"
const BULLET_FONT_SIZE = 18;
const BULLET_FONT_FAMILY = "Montserrat"

export const convertTitleToSlides = (slideBuilder, title) => {
    slideBuilder.addText({
        id: "presentationHeader",
        text: title,
        style: {
           fontSize: HEADER_FONT_SIZE,
           fontFamily: HEADER_FONT_FAMILY,
        },
        paragraphStyle: {
            alignment: "CENTER"
        },
        width: SLIDE_WIDTH - 40,
        height: 80,
        x: 15,
        y: 40,
        pageId: "p"
    })
}
export const convertSummaryToSlides = (slideBuilder, summary) => {
    // summary = [{sectionTitle: string, bullets: [string], startTime: float, endTime: float, transcription: string}]
    summary.forEach((section, index) => {
        const slideId = "slide" + index;
        slideBuilder.createSlide({id: slideId});
        const { sectionTitle, bullets } = section;
        slideBuilder.addText({
            id: "header" + index,
            text: sectionTitle,
            style: {
               fontSize: HEADER_FONT_SIZE,
               fontFamily: HEADER_FONT_FAMILY,
            },
            paragraphStyle: {
                alignment: "CENTER"
            },
            width: SLIDE_WIDTH - 40,
            height: 80,
            x: 20,
            y: 40,
            pageId: slideId
        })
        slideBuilder.addBulletsText({
            id: "bullets" + index,
            text: bullets.join("\n"),
            style: {
               fontSize: BULLET_FONT_SIZE,
               fontFamily: BULLET_FONT_FAMILY,
            },
            paragraphStyle: {
                alignment: "CENTER"
            },
            width: SLIDE_WIDTH - 40,
            height: 300,
            x: 20,
            y: 150,
            pageId: slideId
        })
    })
}

export const convertSummaryToSlide = (slideBuilder, section, slideId, index) => {
    // summary = [{sectionTitle: string, bullets: [string], startTime: float, endTime: float, transcription: string}]
    slideBuilder.createSlide({id: slideId});
    const { sectionTitle, bullets } = section;
    slideBuilder.addText({
        id: "header" + index,
        text: sectionTitle,
        style: {
            fontSize: HEADER_FONT_SIZE,
            fontFamily: HEADER_FONT_FAMILY,
        },
        paragraphStyle: {
            alignment: "CENTER"
        },
        width: SLIDE_WIDTH - 40,
        height: 80,
        x: 20,
        y: 40,
        pageId: slideId
    })
    slideBuilder.addBulletsText({
        id: "bullets" + index,
        text: bullets.join("\n"),
        style: {
            fontSize: BULLET_FONT_SIZE,
            fontFamily: BULLET_FONT_FAMILY,
        },
        paragraphStyle: {
            alignment: "CENTER"
        },
        width: SLIDE_WIDTH - 40,
        height: 300,
        x: 20,
        y: 150,
        pageId: slideId
    })
    
}

export const convertSummaryToSpeakerNotes = (slideBuilder, section, speakerNotesObjectId) => {
    const script = section.transcription;
    slideBuilder.addSpeakerNotes({
        id: speakerNotesObjectId,
        text: script
    })
}

export const addImagesToSlides = (slideBuilder, pageId, images) => {
    images.forEach((img) => {
        slideBuilder.addImage({
            pageId,
            url: img.link,
            width: 150,
            height: 80,
            x: 0,
            y: 0
        })
    })
}