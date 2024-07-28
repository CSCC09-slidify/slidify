export function SlideBuilder() {
  const requests = [];

  const transform = ({ x, y, scaleX = 1, scaleY = 1}) => {
    return {
      scaleX,
      scaleY,
      shearX: 0,
      shearY: 0,
      translateX: x,
      translateY: y,
      unit: "PT",
    };
  };

  const size = ({ width, height }) => {
    return {
      width: {
        magnitude: width,
        unit: "PT",
      },
      height: {
        magnitude: height,
        unit: "PT",
      },
    };
  };

  const font = ({
    foreground,
    background,
    fontSize = 16,
    fontFamily = "Arial",
    bold = false,
    italic = false,
    link = null,
    underline = false,
  }) => {
    return {
      foregroundColor: {
        opaqueColor: {
          rgbColor: foreground ? {red: foreground.r / 255, blue: foreground.b / 255, green: foreground.g / 255} : { red: 0, blue: 0, green: 0 },
        },
      },
      backgroundColor: background ? {
        opaqueColor: {
          rgbColor: { red: 1, blue: 1, green: 1 },
        },
      } : null,
      fontSize: {
        magnitude: fontSize,
        unit: "PT",
      },
      link: link
        ? {
            url: link,
          }
        : null,
      fontFamily,
      underline,
      bold,
      italic,
    };
  };

  const paragraph = ({
    lineSpacing = 100,
    alignment = "ALIGNMENT_UNSPECIFIED",
    indentStart = 0,
    indentEnd = 0,
    spaceAbove = 0,
    spaceBelow = 0,
    indentFirstLine = 0,
    direction = "TEXT_DIRECTION_UNSPECIFIED",
    spacingMode = "SPACING_MODE_UNSPECIFIED",
  }) => {
    return {
      lineSpacing,
      alignment,
      indentStart: {
        magnitude: indentStart,
        unit: "PT",
      },
      indentEnd: {
        magnitude: indentEnd,
        unit: "PT",
      },
      spaceAbove: {
        magnitude: spaceAbove,
        unit: "PT",
      },
      spaceBelow: {
        magnitude: spaceBelow,
        unit: "PT",
      },
      indentFirstLine: {
        magnitude: indentFirstLine,
        unit: "PT",
      },
      direction,
      spacingMode,
    };
  };

  const createSlide = ({ id, index }) => {
    requests.push({
      createSlide: {
        objectId: id,
        insertionIndex: index,
      },
    });
  };

  const addShape = ({
    id = "a" + parseInt(Math.random().toString() * 1000000),
    shapeType,
    pageId,
    width,
    height,
    x,
    y,
  }) => {
    requests.push({
      createShape: {
        objectId: id,
        shapeType,
        elementProperties: {
          pageObjectId: pageId,
          size: size({ width, height }),
          transform: transform({ x, y }),
        },
      },
    });
  };

  const addImage = ({
    id = "a" + parseInt(Math.random().toString() * 1000000),
    url,
    pageId,
    width,
    height,
    x,
    y,
    scaleX,
    scaleY
  }) => {
    requests.push({
      createImage: {
        objectId: id,
        url,
        elementProperties: {
          pageObjectId: pageId,
          size: size({ width, height, scaleX, scaleY }),
          transform: transform({ x, y }),
        },
      },
    });
  };

  const addText = ({
    id = "a" + parseInt(Math.random().toString() * 1000000),
    text,
    style,
    paragraphStyle,
    pageId,
    width,
    height,
    x,
    y,
  }) => {
    addShape({ id, shapeType: "TEXT_BOX", pageId, width, height, x, y });
    requests.push({
      insertText: {
        objectId: id,
        text,
      },
    });
    requests.push({
      updateTextStyle: {
        objectId: id,
        style: font(style),
        fields: "*",
      },
    });
    requests.push({
      updateParagraphStyle: {
        objectId: id,
        style: paragraph(paragraphStyle),
        fields: "*",
      },
    });
  };

  const addBulletsText = ({
    id = "a" + parseInt(Math.random().toString() * 1000000),
    text,
    style,
    paragraphStyle,
    pageId,
    width,
    height,
    x,
    y,
    bulletType = "BULLET_DISC_CIRCLE_SQUARE",
  }) => {
    addText({ id, text, style, paragraphStyle, pageId, width, height, x, y });
    requests.push({
      createParagraphBullets: {
        objectId: id,
        bulletPreset: bulletType,
      },
    });
  };

  const changeTextStyle = ({
    id = "a" + parseInt(Math.random().toString() * 1000000),
    style,
    textRange,
  }) => {
    requests.push({
      updateTextStyle: {
        objectId: id,
        style: font(style),
        textRange,
        fields: "*",
      },
    });
  };

  const addSpeakerNotes = ({
    id = "a" + parseInt(Math.random().toString() * 1000000),
    text,
  }) => {
    requests.push({
      insertText: {
        objectId: id,
        text,
      },
    });
  };

  const setBackground = ({
    id = "a" + parseInt(Math.random().toString() * 1000000),
    colour,
    image
  }) => {
    requests.push({
      updatePageProperties: {
        objectId: id,
        pageProperties: {
          pageBackgroundFill: {
            propertyState: "RENDERED",
            solidFill: colour ? {
                color: {
                  rgbColor: {red: colour.r / 255, blue: colour.b / 255, green: colour.g / 255}
                }
              } : null,
            stretchedPictureFill: image ? {
              contentUrl: image.link
            } : null
          },
        },
        fields: colour ? "pageBackgroundFill.solidFill.color" : "pageBackgroundFill.stretchedPictureFill"
      },
    });
  }

  return {
    createSlide,
    addImage,
    addShape,
    addText,
    addBulletsText,
    addSpeakerNotes,
    changeTextStyle,
    setBackground,
    addVideo: () => {},
    addLine: () => {},
    buildRequests: () => {
      console.log(requests);
      return requests;
    },
  };
}
