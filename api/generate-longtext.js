export default async function handler(req, res) {
    const { prompt } = req.body;

    // KERNEL_RULES: Instruksi rahasia agar AI mengikuti gaya Kelvin
    const systemInstruction = `
        Tulis longtext dalam Bahasa Indonesia mix English.
        ATURAN KETIKAN:
        1. Gunakan lowercase (huruf kecil) semua.
        2. Akhiran kata yang vokal harus didouble (contoh: 'kamuu', 'sekolahh').
        3. Campur dengan bahasa Inggris gaul (Indo-English mix).
        4. Tujuannya bikin dia salting brutal.
        5. Jangan kaku, harus terlihat cool dan ganteng.
    `;

    try {
        // Kita menggunakan API eksternal untuk generate teks
        // Disini kamu bisa menggunakan API Key Gemini atau provider lain
        const response = await fetch("https://api.paxsenix.biz.id/ai/gemini?text=" + encodeURIComponent(systemInstruction + " PERINTAH: " + prompt));
        const data = await response.json();

        if (data.message) {
            return res.status(200).json({ result: data.message });
        } else {
            return res.status(500).json({ error: "FAILED_TO_GENERATE_NEURAL_DATA" });
        }
    } catch (error) {
        return res.status(500).json({ error: "INTERNAL_KERNEL_ERROR" });
    }
}
