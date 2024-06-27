const response = {
    "summary_id": "yX2aa5tjRl2qtJqjJ3oY",
    "video_id": "4LiUUDYeJws",
    "type": "youtube",
    "video_title": "Using Ozempic Is Cheating?!",
    "language_code": "en-US",
    "summary_type": "default",
    "summary_segments": [
        {
            "id": "e856b0e6-c936-4b47-9096-5dac77c07a19",
            "segment": "#  New Section",
            "start_time": 0.0,
            "index": 0
        },
        {
            "id": "6e76f48c-ae45-4ac1-8315-4f0dbc836ba5",
            "segment": "The discussion delves into the complexity of weight gain, obesity, and the use of tools like medication to address related health issues.",
            "start_time": -1.0,
            "index": 1
        },
        {
            "id": "d6805ebd-3dc6-432e-a624-8e2ccd3f5f61",
            "segment": "## Weight Gain and Obesity",
            "start_time": -1.0,
            "index": 2
        },
        {
            "id": "09e04eff-8a41-4b7a-b76f-bc9ccb9267c0",
            "segment": "-  Weight gain is a multifaceted issue influenced by genetics, psychology, microbiome makeup, food accessibility, chronic conditions, finances, and more.",
            "start_time": 0.0,
            "index": 3
        },
        {
            "id": "98867c94-a8e7-4661-a972-2f479b57f439",
            "segment": "-  Obesity is a metabolic condition that increases the risk of diabetes, various cancers, and cardiovascular diseases.",
            "start_time": 25.0,
            "index": 4
        },
        {
            "id": "cb08c438-f534-47d0-bd2b-c584d83b9707",
            "segment": "-  Medication like Azenic can be a valuable tool in improving weight-related health outcomes and preventing serious metabolic consequences associated with excess fat.",
            "start_time": 43.0,
            "index": 5
        },
        {
            "id": "0028f06c-a0cd-4214-aa35-614ef52137a5",
            "segment": "-  Azenic should not be seen as cheating but rather as a potential game-changer for selected individuals at risk. The focus should be on addressing social determinants of weight gain and challenging the food industry's role in promoting unhealthy products.",
            "start_time": 60.0,
            "index": 6
        }
    ],
    "version": 1
} 

const module = {}

const parseApiResponse = (response) => {
    const sectionRegex = new RegExp("## .*");
    const bulletRegex = new RegExp("- .*");

    const parsedInfo = response.summary_segments.reduce((acc, cur) => {
        if (sectionRegex.test(cur.segment)) {
            acc.push({
                section: cur.segment.slice(3),
                bullets: []
            })
        } else if (bulletRegex.test(cur.segment)) {
            acc[0].bullets.push(cur.segment.slice(2))
        }
        return acc
    }, [])
    return parsedInfo
}

module.summarizeVideo = async () => {
    return parseApiResponse(response)
}



export default module;