export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });

    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "PROMPT_REQUIRED" });

    const identity = "Tulis longtext gaul, lowercase semua, huruf belakang double, mix English-Indo, bikin salting brutal.";

    try {
        // Bridge Utama: GPT-4o
        const response = await fetch(`https://api.paxsenix.biz.id/ai/gpt4o?text=${encodeURIComponent(identity + " PERINTAH: " + prompt)}`);
        const data = await response.json();

        if (data.status || data.message) {
            return res.status(200).json({ result: data.message || data.result });
        } else {
            throw new Error("RETRY");
        }
    } catch (e) {
        try {
            // Backup Bridge: Gemini
            const backup = await fetch(`https://api.paxsenix.biz.id/ai/gemini?text=${encodeURIComponent(identity + " PERINTAH: " + prompt)}`);
            const backData = await backup.json();
            return res.status(200).json({ result: backData.message || backData.result });
        } catch (err) {
            return res.status(500).json({ error: "CORE_SYSTEM_OVERLOAD" });
        }
    }
}
