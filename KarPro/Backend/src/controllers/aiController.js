import { askGemini } from "../services/geminiService.js";

export const parseExpenseFromText = async (req, res) => {
    console.log("Received parse request:", req.body);
  const { text, participants } = req.body;

  if (!text || !participants?.length) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const prompt = `
Convert this sentence into a JSON expense.

Participants: ${participants.join(", ")}

Sentence:
"${text}"

Return ONLY valid JSON:
{
  "amount": number,
  "description": string,
  "payer": string,
  "splitType": "equal" | "custom",
  "participants": string[]
}
`;

  try {
    const response = await askGemini(prompt);

    const jsonStart = response.indexOf("{");
    const jsonEnd = response.lastIndexOf("}");
    const parsed = JSON.parse(response.slice(jsonStart, jsonEnd + 1));

    res.json(parsed);
  } catch (err) {
    console.error("AI parse error", err);
    res.status(500).json({ message: "AI parsing failed" });
  }
};

export const categorizeExpense = async (description) => {
  const prompt = `
Categorize this expense into ONE word only:
Food, Travel, Rent, Entertainment, Utilities, Shopping, Other

Expense: "${description}"

Return only the category name.
`;

  const response = await askGemini(prompt);

  const category = response
    .replace(/[^a-zA-Z]/g, "")
    .trim();

  const allowed = [
    "Food",
    "Travel",
    "Rent",
    "Entertainment",
    "Utilities",
    "Shopping",
    "Other"
  ];

  return allowed.includes(category) ? category : "Other";
};





export const generateGroupSummary = async (req, res) => {
  const { balances, totalSpent } = req.body;

  const prompt = `
Generate a friendly group expense summary.

Total spent: ₹${totalSpent}

Balances:
${balances.map(b => `${b.name}: ₹${b.balance}`).join("\n")}
`;

  const summary = await askGemini(prompt);
  res.json({ summary });
};



export const explainSettlements = async (req, res) => {
  try {
    const { settlements } = req.body;

    if (!Array.isArray(settlements) || settlements.length === 0) {
      return res.status(400).json({
        message: "Settlements data is required"
      });
    }

    const prompt = `
Explain these settlements in simple, friendly language.
Do not use bullet points. Write in 1–2 sentences.

Settlements:
${settlements
  .map(
    (s) => `${s.fromName} pays ${s.toName} ₹${s.amount}`
  )
  .join("\n")}
`;

    const explanation = await askGemini(prompt);

    res.json({
      explanation: explanation.trim()
    });
  } catch (err) {
    console.error("AI settlement explain error:", err);
    res.status(500).json({
      message: "Failed to generate settlement explanation"
    });
  }
};