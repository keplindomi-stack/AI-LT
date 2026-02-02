export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });

    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "PROMPT_REQUIRED" });

    // Instruksi Gaya Ketikan Kelvin
    const systemPrompt = "Tulis longtext gaul, lowercase semua, huruf belakang double, mix English-Indo, bikin salting brutal.";

    try {
        // Menggunakan backup bridge yang lebih kencang
        const response = await fetch(`https://api.paxsenix.biz.id/ai/gpt4o?text=${encodeURIComponent(systemPrompt + " PERINTAH: " + prompt)}`);
        const data = await response.json();

        if (data.status === true || data.message) {
            return res.status(200).json({ result: data.message || data.result });
        } else {
            return res.status(500).json({ error: "NEURAL_BRIDGE_OFFLINE" });
        }
    } catch (error) {
        return res.status(500).json({ error: "CONNECTION_LOST_RETRY_AGAIN" });
    }
}
