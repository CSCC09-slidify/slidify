const SLIDE_WIDTH = 720;
const SLIDE_HEIGHT = 405;
const HEADER_FONT_SIZE = 38;
const HEADER_FONT_FAMILY = "Montserrat";
const BULLET_FONT_SIZE = 14;
const BULLET_FONT_FAMILY = "Montserrat";

export const convertTitleToSlides = (slideBuilder, config, title) => {
  slideBuilder.addText({
    id: "presentationHeader",
    text: title,
    style: {
      fontSize: HEADER_FONT_SIZE,
      fontFamily: config.headingFontFamily ?? HEADER_FONT_FAMILY,
      foreground: config.headingFontColour ?? null,
    },
    paragraphStyle: {
      alignment: "CENTER",
    },
    width: SLIDE_WIDTH - 40,
    height: 80,
    x: 15,
    y: 40,
    pageId: "p",
  });
  if (!config.positioning || config.positioning == "default") {
    slideBuilder.setBackground({
      id: "p",
      colour: config.backgroundColour
    })
  }
};
export const convertSummaryToSlides = (slideBuilder, config, summary) => {
  // summary = [{sectionTitle: string, bullets: [string], startTime: float, endTime: float, transcription: string}]
  summary.forEach((section, index) => {
    const slideId = "slide" + index;
    slideBuilder.createSlide({ id: slideId });
    const { sectionTitle, bullets } = section;
    slideBuilder.addText({
      id: "header" + index,
      text: sectionTitle,
      style: {
        fontSize: HEADER_FONT_SIZE,
        fontFamily: config.headingFontFamily ?? HEADER_FONT_FAMILY,
        foreground: config.headingFontColour
      },
      paragraphStyle: {
        alignment: "CENTER",
      },
      width: SLIDE_WIDTH - 40,
      height: 80,
      x: 20,
      y: 40,
      pageId: slideId,
    });
    slideBuilder.addBulletsText({
      id: "bullets" + index,
      text: bullets.join("\n"),
      style: {
        fontSize: BULLET_FONT_SIZE,
        fontFamily: config.bodyFontFamily ?? BULLET_FONT_FAMILY,
        foreground: config.bodyFontColour ?? null
      },
      paragraphStyle: {
        alignment: "START",
      },
      width: (SLIDE_WIDTH - 40) / 2,
      height: 300,
      x: 20,
      y: 150,
      pageId: slideId,
    });
  });
};

export const convertSummaryToSlide = (
  slideBuilder,
  config,
  section,
  slideId,
  index,
) => {
  // summary = [{sectionTitle: string, bullets: [string], startTime: float, endTime: float, transcription: string}]
  slideBuilder.createSlide({ id: slideId });
  if (!config.positioning || config.positioning == "default") {
    slideBuilder.setBackground({
      id: slideId,
      colour: config.backgroundColour
    })
  }
  const { sectionTitle, bullets } = section;
  slideBuilder.addText({
    id: "header" + index,
    text: sectionTitle,
    style: {
      fontSize: HEADER_FONT_SIZE,
      fontFamily: config.headingFontFamily ?? HEADER_FONT_FAMILY,
      foreground: config.headingFontColour ?? null,
      background: config.positioning != "full" ? null : { red: 255, green: 255, blue: 255}
    },
    paragraphStyle: {
      alignment: "CENTER",
    },
    width: SLIDE_WIDTH - 40,
    height: 80,
    x: 20,
    y: 40,
    pageId: slideId,
  });
  if (bullets && bullets.length > 0) {
    slideBuilder.addBulletsText({
      id: "bullets" + index,
      text: bullets.join("\n"),
      style: {
        fontSize: bullets.length <= 6 ?
         BULLET_FONT_SIZE : 
         Math.max(8, 20 - bullets.length),
        fontFamily: config.bodyFontFamily ?? BULLET_FONT_FAMILY,
        foreground: config.bodyFontColour,
        background: config.positioning != "full" ? null : { red: 255, green: 255, blue: 255}
      },
      paragraphStyle: {
        alignment: "START",
      },
      width: (SLIDE_WIDTH - 40) / 2,
      height: 300,
      x: 20,
      y: 150,
      pageId: slideId,
    });
  }
};

export const convertSummaryToSpeakerNotes = (
  slideBuilder,
  section,
  speakerNotesObjectId,
) => {
  const script = section.transcription;
  slideBuilder.addSpeakerNotes({
    id: speakerNotesObjectId,
    text: script,
  });
  return script;
};

export const addImagesToSlides = (slideBuilder, config, pageId, images) => {
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    if (!img.image) {
      continue;
    }
    const { width, height } = img.image;
    if (!config.positioning || config.positioning == "default" ) {
      const displayWidth = (SLIDE_WIDTH - 40) / 2;
      const displayHeight = SLIDE_HEIGHT - 150 - 20;
      const useHeight = height / displayHeight > width / displayWidth;
      slideBuilder.addImage({
        pageId,
        url: img.link,
        width: useHeight ? width / (height / displayHeight) : displayWidth,
        height: useHeight ? displayHeight : height / (width / displayWidth),
        x: 30 + (SLIDE_WIDTH - 40) / 2,
        y: 150,
      });
    } else {
      slideBuilder.setBackground({
        id: pageId,
        image: img
      })
    }
    break;
  }
};

export const addImagesReferenceList = (slideBuilder, images, slideId) => {
  slideBuilder.createSlide({ id: slideId });
  slideBuilder.addText({
    id: "imageReferencesHeader",
    text: "Images Reference List",
    style: {
      fontSize: HEADER_FONT_SIZE,
      fontFamily: HEADER_FONT_FAMILY,
    },
    paragraphStyle: {
      alignment: "CENTER",
    },
    width: SLIDE_WIDTH - 40,
    height: 60,
    x: 20,
    y: 20,
    pageId: slideId,
  });
  const italicized = [];
  const referenceTextList = images
    .reduce((acc, img) => {
      const title = img.title;
      const url = img.link;
      italicized.push({ start: acc.length, end: acc.length + title.length });
      return acc + `${title} [Digital Image]. ${url}\n`;
    }, "")
    .trim();
  slideBuilder.addText({
    id: "imageReferences",
    text: referenceTextList,
    style: {
      fontSize: 12,
      fontFamily: BULLET_FONT_FAMILY,
    },
    paragraphStyle: {
      alignment: "START",
    },
    width: SLIDE_WIDTH - 40,
    height: SLIDE_HEIGHT - 80,
    x: 20,
    y: 80,
    pageId: slideId,
  });

  italicized.forEach((item) =>
    slideBuilder.changeTextStyle({
      id: "imageReferences",
      style: {
        italic: true,
        fontSize: 12,
        fontFamily: BULLET_FONT_FAMILY,
      },
      textRange: {
        startIndex: item.start,
        endIndex: item.end,
        type: "FIXED_RANGE",
      },
    }),
  );
};
