export default async function handler(req, res) {
    // 1. SET HEADER: Mengizinkan akses dari frontend (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request dari browser
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. VALIDASI METHOD: Hanya menerima POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    }

    const { prompt } = req.body;

    // 3. VALIDASI INPUT
    if (!prompt) {
        return res.status(400).json({ error: "PROMPT_REQUIRED" });
    }

    /**
     * KERNEL_INSTRUCTIONS:
     * Mengatur kepribadian AI agar sesuai dengan keinginan Kelvin:
     * - Lowercase (huruf kecil semua)
     * - Huruf belakang double (sekolahh, kamuu)
     * - Indo-English Mix (ganteng style)
     * - Salting brutal context
     */
    const identityPrompt = `
        Tulis pesan longtext dalam Bahasa Indonesia mix English.
        WAJIB IKUTI ATURAN INI:
        1. Ketikan harus lowercase (huruf kecil) semua.
        2. Setiap akhiran kata yang vokal harus didouble atau ditambahkan huruf belakangnya (contoh: 'kamuu', 'sekolahh', 'lagii').
        3. Gunakan gaya bahasa anak Jaksel (Indo-English mix) yang terlihat cool.
        4. Isi pesan harus bikin salting brutal dan sangat romantis tapi tetap ganteng.
        5. Jangan gunakan tanda baca formal yang berlebihan.
        
        PERINTAH USER: ${prompt}
    `;

    try {
        // 4. EXECUTE AI: Memanggil Neural Bridge (API Gemini via Proxy)
        const response = await fetch("https://api.paxsenix.biz.id/ai/gemini?text=" + encodeURIComponent(identityPrompt));
        const data = await response.json();

        if (data.status === true || data.message) {
            // Berhasil mendapatkan data dari AI
            return res.status(200).json({ 
                result: data.message || data.result 
            });
        } else {
            return res.status(500).json({ error: "AI_EXTRACTION_FAILED" });
        }
    } catch (error) {
        // Handle jika server AI down atau timeout
        return res.status(500).json({ error: "CORE_KERNEL_PANIC: CONNECTION_LOST" });
    }
}
