export const convertSpeechmaticsSummary = (resp) => {
    /*
        Speechmatics summary is of the form:

        1. title1
        - bullet1
        - bullet2

        2. title2
        - bullet1
        - bullet2
    */
    const summary = resp.summary.content;
    const lines = summary.split("\n")
    const sectionHeaderRegex = new RegExp("\\d\\. .*")
    const bulletRegex = new RegExp("- .*")

    const convertedSummary = lines.reduce((acc, line) => {
        const trimmed = line.trim();
        if (trimmed != "") {
            if (sectionHeaderRegex.test(trimmed)) {
                acc.push({
                    sectionTitle: trimmed,
                    bullets: []
                })
            } else if (bulletRegex.test(trimmed)) {
                acc[acc.length - 1].bullets.push(trimmed.slice(2));
            }
        }
        return acc
    }, [])

    /*
        "chapters": [
    {
        "end_time": 28.97,
        "start_time": 0.0,
        "summary": "The speaker introduces a groundbreaking initiative in Brazil where a mosquito factory is set to release 5 billion infected mosquitoes. This approach is not the plot of a science fiction movie but an ingenious scientific strategy to combat diseases spread by mosquitoes, which are the deadliest animals to humans due to their role in disease transmission.",
        "title": "Introduction to the Mosquito Factory Initiative"
    },
    
    "results": [
        {
            "alternatives": [
                {
                    "confidence": 1.0,
                    "content": "A",
                    "language": "en",
                    "speaker": "UU"
                }
            ],
            "end_time": 0.2,
            "start_time": 0.08,
            "type": "word"
        },
    */

    const chapters = resp.chapters;
    console.log("Returned chapters are:")
    console.log(chapters)
    if (convertedSummary.length < chapters.length) {
        const extra = chapters.length - convertedSummary.length;
        console.log("there is " + extra + " extra")
        const mergeLength = Math.ceil(convertedSummary.length / extra);
        for (let i = 0; i < extra; i++) {
            chapters[i].end_time = chapters[i + mergeLength].end_time;
            chapters.splice(i + 1, 1);
        }
    }
    const transcription = resp.results;
    const fullScript = transcription.reduce((acc, cur) => {
        if (cur.alternatives.length > 0) {
            const content = cur.alternatives[0].content;
            if (cur.type == "word") {
                return acc + " " + content;
            } else if (cur.type == "punctuation") {
                return acc + content;
            }
        }
        return acc;
    }, "");
    console.log("Full script is")
    console.log(fullScript)
    for (let i = 0; i < Math.min(convertedSummary.length, chapters.length); i++) {
        const chapter = chapters[i];
        const start = chapter["start_time"];
        const end = chapter["end_time"];
        convertedSummary[i].startTime = start;
        convertedSummary[i].endTime = end;
        const interval = transcription.filter(t => t.start_time >= start && t.end_time <= end);
        const script = interval.reduce((acc, cur) => {
            if (cur.alternatives.length > 0) {
                const content = cur.alternatives[0].content;
                if (cur.type == "word") {
                    return acc + " " + content;
                } else if (cur.type == "punctuation") {
                    return acc + content;
                }
            }
            return acc;
        }, "");
        convertedSummary[i].transcription = script;
    }

    return convertedSummary;
}