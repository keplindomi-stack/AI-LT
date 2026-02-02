export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });

    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "PROMPT_REQUIRED" });

    // KERNEL_RULES: Instruksi gaya ketikan Kelvin
    const systemInstruction = "Tulis longtext romantis, lowercase semua, huruf belakang double (contoh: kamuu, sekolahh), mix English-Indo gaul Jaksel, bikin salting brutal, jangan kaku.";

    try {
        // Menggunakan Neural Bridge yang paling stabil saat ini
        const response = await fetch(`https://api.vreden.web.id/api/ai/gemini?text=${encodeURIComponent(systemInstruction + " PERINTAH: " + prompt)}`);
        const data = await response.json();

        // Validasi hasil dari server AI
        const finalResult = data.result || data.message;

        if (finalResult) {
            return res.status(200).json({ result: finalResult });
        } else {
            throw new Error("RETRY_BACKUP");
        }
    } catch (error) {
        return res.status(500).json({ error: "CORE_SYSTEM_OVERLOAD: Silakan coba lagi dalam 3 detik." });
    }
}
