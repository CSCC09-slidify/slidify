import * as fs from "fs";

const module = {};

const config = (type, callback) =>
  JSON.stringify({
    type: "transcription",
    transcription_config: {
      operating_point: type,
      language: "en",
    },
    auto_chapters_config: {},
    summarization_config: {
      content_type: "informative",
      summary_length: "detailed",
      summary_type: "bullets",
    },
    "notification_config": callback ? [
      {
        "url": callback,
        "contents": ["transcript"],
      }
    ] : []
  });

const sendVideoRequest = (authToken, form, callbackUrl) => {
  form.append("config", config("enhanced", callbackUrl));
  return fetch("https://asr.api.speechmatics.com/v2/jobs/", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + authToken,
    },
    body: form,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.error) {
        form.delete("config");
        form.append("config", config("standard", callbackUrl));
        return fetch("https://asr.api.speechmatics.com/v2/jobs/", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + authToken,
          },
          body: form,
        }).then((res) => res.json());
      } else {
        return data;
      }
    });
};

module.sendVideoFromBuffer = (fileName, buffer, authToken, callbackUrl) => {
  const form = new FormData();
  //const file = fs.readFile(path);
  const blob = new Blob([buffer]);
  form.append("data_file", blob, fileName);
  return sendVideoRequest(authToken, form, callbackUrl);
};

module.sendVideoFromFile = (file, authToken, callbackUrl, callbackHeaders) => {
  const form = new FormData();
  form.append("data_file", file);
  return sendVideoRequest(authToken, form, callbackUrl, callbackHeaders);
};

module.checkVideoStatus = (id, authToken) => {
  const url = `https://asr.api.speechmatics.com/v2/jobs/${id}`;

  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  }).then((res) => res.json());
};

module.getVideoSummary = (id, authToken) => {
  const url = `https://asr.api.speechmatics.com/v2/jobs/${id}/transcript`;
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  }).then((res) => res.json());
};
export default module;
