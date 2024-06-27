import * as fs from "fs"

const module = {}

module.sendVideoFromPath = (fileName, path, authToken) => {
    const form = new FormData();
    const file = fs.readFileSync(path);
    const blob = new Blob([file])
    form.append("data_file", blob, fileName)
    form.append("config", JSON.stringify({
        "type": "transcription",
        "transcription_config": { 
            "operating_point":"enhanced", 
            "language": "en" 
        },
        "auto_chapters_config": {},
        "summarization_config": {
          "content_type": "informative",
          "summary_length": "detailed",
          "summary_type": "bullets"
        }
      }))

    return  fetch("https://asr.api.speechmatics.com/v2/jobs/", 
        {
            method: "POST",
            headers: {
                Authorization: "Bearer " + authToken
            },
            body: form
        }
    ).then(res => res.json())
}


module.sendVideoFromFile = (file, authToken) => {
    const form = new FormData();
    const blob = new Blob([file])
    form.append("data_file", blob, fileName)
    form.append("config", JSON.stringify({
        "type": "transcription",
        "transcription_config": { 
            "operating_point":"enhanced", 
            "language": "en" 
        },
        "auto_chapters_config": {},
        "summarization_config": {
          "content_type": "informative",
          "summary_length": "detailed",
          "summary_type": "bullets"
        }
      }))

    return  fetch("https://asr.api.speechmatics.com/v2/jobs/", 
        {
            method: "POST",
            headers: {
                Authorization: "Bearer " + authToken
            },
            body: form
        }
    ).then(res => res.json())
}

module.checkVideoStatus = (id, authToken) => {
    const url = `https://asr.api.speechmatics.com/v2/jobs/${id}`

    return fetch(url,
        {
            method: "GET",
            headers: {
                Authorization: "Bearer " + authToken
            }
        }
    ).then(res => res.json()) 
}

module.getVideoSummary = (id, authToken) => {
    const url = `https://asr.api.speechmatics.com/v2/jobs/${id}/transcript`
    return fetch(url,
        {
            method: "GET",
            headers: {
                Authorization: "Bearer " + authToken
            }
        }
    ).then(res => res.json()) 
}
export default module;