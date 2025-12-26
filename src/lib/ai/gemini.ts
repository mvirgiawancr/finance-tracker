import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
});

export interface FinancialSummary {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    topExpenseCategories: { category: string; amount: number }[];
    monthlyComparison?: {
        currentMonth: number;
        previousMonth: number;
        percentageChange: number;
    };
}

export async function generateFinancialInsight(
    summary: FinancialSummary,
    type: "monthly_summary" | "spending_alert" | "saving_tip"
): Promise<{ title: string; content: string }> {
    const prompt = buildPrompt(summary, type);

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response
    const lines = text.split("\n").filter((line) => line.trim());
    const title = lines[0]?.replace(/^#*\s*/, "").trim() || "Financial Insight";
    const content = lines.slice(1).join("\n").trim() || text;

    return { title, content };
}

function buildPrompt(
    summary: FinancialSummary,
    type: "monthly_summary" | "spending_alert" | "saving_tip"
): string {
    const baseContext = `
Kamu adalah asisten keuangan personal yang membantu pengguna Indonesia (usia 18-35 tahun) memahami kondisi keuangan mereka.
Gunakan bahasa Indonesia yang santai tapi tetap informatif.
Format output: Baris pertama adalah judul singkat, diikuti dengan konten penjelasan.

Data Keuangan Pengguna:
- Total Pemasukan: Rp ${summary.totalIncome.toLocaleString("id-ID")}
- Total Pengeluaran: Rp ${summary.totalExpense.toLocaleString("id-ID")}
- Saldo: Rp ${summary.balance.toLocaleString("id-ID")}
- Top Kategori Pengeluaran: ${summary.topExpenseCategories
            .map((c) => `${c.category} (Rp ${c.amount.toLocaleString("id-ID")})`)
            .join(", ")}
`;

    switch (type) {
        case "monthly_summary":
            return `${baseContext}
      
Tugas: Berikan ringkasan keuangan bulanan yang informatif dan mudah dipahami.
Jelaskan pola pengeluaran, apakah sehat atau perlu perhatian, dan berikan 1-2 tips singkat.
Maksimal 3 paragraf.`;

        case "spending_alert":
            const comparison = summary.monthlyComparison;
            const changeInfo = comparison
                ? `Pengeluaran bulan ini ${comparison.percentageChange > 0 ? "naik" : "turun"} ${Math.abs(comparison.percentageChange).toFixed(1)}% dibanding bulan lalu.`
                : "";
            return `${baseContext}
${changeInfo}

Tugas: Berikan peringatan tentang pengeluaran yang perlu diperhatikan.
Fokus pada kategori yang paling boros dan berikan saran konkret untuk menguranginya.
Gunakan tone yang supportive, bukan menghakimi. Maksimal 2 paragraf.`;

        case "saving_tip":
            return `${baseContext}

Tugas: Berikan 2-3 tips penghematan yang relevan berdasarkan pola pengeluaran pengguna.
Tips harus spesifik dan actionable, bukan generic.
Contoh: jika pengeluaran makanan tinggi, sarankan meal prep atau promo yang sering tersedia.
Maksimal 3 poin dengan penjelasan singkat.`;

        default:
            return baseContext;
    }
}
