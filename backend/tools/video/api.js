import * as fs from "fs";

const module = {};

const config = (type) =>
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
  });

const sendVideoRequest = (authToken, form) => {
  form.append("config", config("enhanced"));
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
        form.append("config", config("standard"));
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

module.sendVideoFromPath = (fileName, path, authToken) => {
  const form = new FormData();
  const file = fs.readFileSync(path);
  const blob = new Blob([file]);
  form.append("data_file", blob, fileName);
  return sendVideoRequest(authToken, form);
};

module.sendVideoFromFile = (file, authToken) => {
  const form = new FormData();
  form.append("data_file", file);
  form.append("config", JSON.stringify(config("enhanced")));
  return sendVideoRequest(authToken, form);
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
