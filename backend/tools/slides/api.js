const module = {};

// returns { presentationId }
module.createPresentation = async ({ authToken, title }) => {
  const url = "https://slides.googleapis.com/v1/presentations";

  return fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      title: title,
    }),
  }).then((res) => res.json());
};

// updates presentation based on requests made by the slideBuilder
module.updatePresentation = async (authToken, presentationId, requests) => {
  const url = `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`;

  return fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      requests,
    }),
  }).then((res) => res.json());
};

// updates presentation based on requests made by the slideBuilder
module.getPage = async (authToken, presentationId, pageId) => {
  const url = `https://slides.googleapis.com/v1/presentations/${presentationId}/pages/${pageId}`;

  return fetch(url, {
    method: "GET",
    headers: {
      authorization: `Bearer ${authToken}`,
    },
  }).then((res) => res.json());
};

// get slides page object
module.getPresentationSlideIds = async (authToken, presentationId) => {
  const url = `https://slides.googleapis.com/v1/presentations/${presentationId}?fields=slides.objectId`;

  return fetch(url, {
    method: "GET",
    headers: {
      authorization: `Bearer ${authToken}`,
    },
  })
    .then((res) => res.json())
    .then((data) => (data.slides ? data.slides.map((s) => s.objectId) : []));
};

// get slide speaker notes object id
module.getSlideSpeakerNotesId = async (authToken, presentationId, pageId) => {
  const url = `https://slides.googleapis.com/v1/presentations/${presentationId}/pages/${pageId}`;

  return fetch(url, {
    method: "GET",
    headers: {
      authorization: `Bearer ${authToken}`,
    },
  })
    .then((res) => res.json())
    .then((data) => ({
      id: data.slideProperties.notesPage.notesProperties.speakerNotesObjectId,
    }));
};

// get slide speaker notes text
module.getSlideSpeakerNotesText = async (authToken, presentationId, pageId) => {
  const url = `https://slides.googleapis.com/v1/presentations/${presentationId}/pages/${pageId}`;

  return fetch(url, {
    method: "GET",
    headers: {
      authorization: `Bearer ${authToken}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const id =
        data.slideProperties.notesPage.notesProperties.speakerNotesObjectId;
      const speakerNotesElement = id
        ? data.slideProperties.notesPage.pageElements.find(
            (p) => p.objectId == id,
          )
        : null;
      const text =
        speakerNotesElement && speakerNotesElement.shape.text
          ? speakerNotesElement.shape.text.textElements[1].textRun.content
          : "";
      return text;
    });
};

export default module;
