import 'dotenv/config';
import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { niche, style, count } = req.body;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
        console.error("GROQ_API_KEY is missing!");
        return res.status(500).json({ error: "Missing GROQ API key" });
    }

    try {
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: "You are a creative TikTok content strategist. Return numbered ideas only." },
                        { role: "user", content: `Generate ${count} TikTok ideas for ${niche} in ${style} style` }
                    ],
                    temperature: 0.8,
                    max_tokens: 2000
                })
            }
        );

        if (!response.ok) {
            const text = await response.text();
            console.error("Groq API error:", text);
            return res.status(500).json({ error: "Groq API request failed" });
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (err) {
        console.error("Server crashed:", err);
        res.status(500).json({ error: "Server crashed" });
    }
}