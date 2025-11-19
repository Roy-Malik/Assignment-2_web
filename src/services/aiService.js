export async function sendMessageToAI(message) {
    try {
        const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: message }]
                        }
                    ]
                })
            }
        );

        const data = await response.json();
        console.log("FULL RESPONSE:", data);

        const aiReply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "AI could not generate a response.";

        return aiReply;

    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error: Could not reach AI service.";
    }
}
