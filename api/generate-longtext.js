export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });

    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "PROMPT_REQUIRED" });

    const identity = "Tulis longtext sangat romantis, lowercase semua, huruf belakang double (contoh: kamuu, sekolahh), mix English-Indo gaul Jaksel, bikin salting brutal, jangan kaku.";

    const apis = [
        `https://api.vreden.web.id/api/ai/gpt4?text=${encodeURIComponent(identity + " PERINTAH: " + prompt)}`,
        `https://api.paxsenix.biz.id/ai/gpt4o?text=${encodeURIComponent(identity + " PERINTAH: " + prompt)}`,
        `https://api.paxsenix.biz.id/ai/gemini?text=${encodeURIComponent(identity + " PERINTAH: " + prompt)}`
    ];

    for (const api of apis) {
        try {
            const response = await fetch(api);
            const data = await response.json();
            const result = data.result || data.message;
            if (result) return res.status(200).json({ result });
        } catch (e) {
            continue; // Coba API berikutnya jika gagal
        }
    }

    return res.status(500).json({ error: "ALL_NEURAL_BRIDGES_SATURED" });
}
