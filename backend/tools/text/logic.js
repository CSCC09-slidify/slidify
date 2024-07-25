export const convertOpenAiSummary = (summary) => {
    /*
    ### Chapter 1: Title
    - bullet
    - bullet
    */

    const lines = summary.split("\n")
    const sectionHeaderRegex1 = new RegExp(".*# Chapter \\d: .*")
    const sectionHeaderRegex2 = new RegExp("(#)+")

    const bulletRegex = new RegExp("- .*")

    const convertedSummary = lines.reduce((acc, line) => {
        const trimmed = line.trim();
        if (trimmed != "") {
            if (sectionHeaderRegex1.test(trimmed) || sectionHeaderRegex2.test(trimmed)) {
                acc.push({
                    sectionTitle: trimmed.slice(
                        trimmed.indexOf(":") != -1 ?
                        trimmed.indexOf(":") + 1
                        : trimmed.split(" ").slice(1).join(" ")
                    ),
                    bullets: [],
                    transcription: "No text"
                })
            } else if (bulletRegex.test(trimmed)) {
                acc[acc.length - 1].bullets.push(trimmed.slice(2));
            }
        }
        return acc
    }, [])

    return convertedSummary;
}