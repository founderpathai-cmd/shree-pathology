import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

// Initialize GoogleGenAI SDK with server-side API key and User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

interface BiomarkerParam {
  name: string;
  value: string;
  unit: string;
  range: string;
  status: "Normal" | "High" | "Low" | "Borderline";
}

interface ReportAnalysisPayload {
  reportId?: string;
  testName: string;
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  parameters: BiomarkerParam[];
  clinicalImpression?: string;
  userQuestion?: string;
  customReportText?: string;
}

// Fallback rule-based clinical explainer when Gemini API key is not configured or offline
function generateFallbackAnalysis(payload: ReportAnalysisPayload) {
  const { testName, parameters, patientName, patientAge, patientGender } = payload;
  const abnormal = parameters.filter((p) => p.status !== "Normal");
  const normal = parameters.filter((p) => p.status === "Normal");

  const abnormalFindings = abnormal.map((p) => {
    let explanation = `The observed value of ${p.value} ${p.unit} is outside the typical biological reference range (${p.range}).`;
    let whatItDoes = `This biomarker measures metabolic or cellular activity related to ${p.name}.`;

    const lower = p.name.toLowerCase();
    if (lower.includes("cholesterol") || lower.includes("triglyceride") || lower.includes("lipid")) {
      whatItDoes = "Circulating blood lipids that affect heart and arterial vascular wellness.";
      explanation =
        p.status === "High"
          ? "Mild elevation in circulating blood lipids. Often improves with dietary fiber, reduced saturated fats, and regular physical activity."
          : "Value is below standard range; clinical evaluation recommended.";
    } else if (lower.includes("glucose") || lower.includes("sugar") || lower.includes("hba1c")) {
      whatItDoes = "Reflects how your body processes dietary sugars and insulin regulation.";
      explanation = "Indicator of glycemic balance. Maintain steady complex carbohydrates and monitor fasting levels.";
    } else if (lower.includes("hemoglobin") || lower.includes("rbc")) {
      whatItDoes = "Carries vital oxygen from lungs through the bloodstream to body tissues and brain.";
      explanation = "Essential for cellular energy, physical endurance, and combating daytime fatigue.";
    } else if (lower.includes("platelet")) {
      whatItDoes = "Specialized cellular fragments responsible for normal blood clotting and wound recovery.";
      explanation = "Important for vascular integrity and stopping minor bleeding.";
    }

    return {
      parameter: p.name,
      value: `${p.value} ${p.unit}`,
      status: p.status,
      explanation,
      whatItDoes,
    };
  });

  const normalHighlights = normal.slice(0, 4).map((p) => ({
    parameter: p.name,
    value: `${p.value} ${p.unit}`,
    status: "Normal",
    explanation: `Your reading is well within the healthy standard interval (${p.range}).`,
    whatItDoes: `Indicates stable baseline physiological function for ${p.name}.`,
  }));

  const summary = abnormal.length === 0
    ? `Great news! All ${parameters.length} evaluated clinical parameters in your ${testName} are within the optimal biological reference ranges.`
    : `Your ${testName} demonstrates good general baseline health, with ${normal.length} parameters in the normal range and ${abnormal.length} parameter${abnormal.length > 1 ? "s" : ""} slightly outside reference thresholds that warrant routine discussion with your doctor.`;

  const lifestyleTips = [
    "Stay hydrated with 2.5 to 3 liters of water daily to support physiological blood filtration.",
    "Include antioxidant-rich leafy greens, seasonal fruits, and whole grains in your daily meals.",
    "Engage in 30 minutes of moderate aerobic movement (such as brisk walking) at least 5 days a week.",
    "Prioritize 7-8 hours of uninterrupted nocturnal sleep for cellular recovery and hormonal balance.",
  ];

  const questionsForDoctor = [
    `Do the observed findings in my ${testName} require any follow-up blood tests in 3 to 6 months?`,
    "Are there specific dietary or lifestyle modifications you recommend based on my current results?",
    "Should I continue my existing supplements or routine medications?",
  ];

  return {
    summary,
    keyFindings: [...abnormalFindings, ...normalHighlights],
    lifestyleTips,
    questionsForDoctor,
    disclaimer:
      "This AI analysis is provided for educational empowerment and informational clarity. It is not a substitute for professional medical diagnosis or personalized treatment advice. Always review laboratory reports with your qualified physician.",
    rawAnalysisText: summary,
  };
}

// POST /api/ai/analyze-report
router.post("/analyze-report", async (req, res) => {
  try {
    const payload: ReportAnalysisPayload = req.body;

    if (!payload.testName && !payload.customReportText) {
      return res.status(400).json({ message: "Test details or report text are required for AI analysis." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.log("No GEMINI_API_KEY configured, using clinical fallback engine");
      const fallbackResult = generateFallbackAnalysis(payload);
      return res.json(fallbackResult);
    }

    // Prepare prompt for Gemini
    const reportDataString = payload.customReportText
      ? payload.customReportText
      : `
Diagnostic Test: ${payload.testName}
Patient: ${payload.patientName || "Patient"} (${payload.patientAge || 35} yrs, ${payload.patientGender || "Adult"})
Biomarker Results:
${payload.parameters
  .map((p) => `- ${p.name}: ${p.value} ${p.unit} (Reference Range: ${p.range}, Status: ${p.status})`)
  .join("\n")}
Clinical Pathologist Impression: ${payload.clinicalImpression || "Standard routine pathology analysis."}
${payload.userQuestion ? `Specific Patient Question: "${payload.userQuestion}"` : ""}
`;

    const systemInstruction = `
You are an empathetic, clinical diagnostics communicator at Shree Healthcare Diagnostics in Pune, India.
Your mission is to help patients understand their medical test results in simple, reassuring, plain English without medical jargon.

Please return a valid JSON object matching this schema:
{
  "summary": "2-3 clear reassuring sentences summarizing the overall report findings in simple language.",
  "keyFindings": [
    {
      "parameter": "Name of biomarker",
      "value": "Value with unit",
      "status": "Normal | High | Low | Borderline",
      "explanation": "What this reading means in plain language for a non-medical person.",
      "whatItDoes": "Simple explanation of what this test or organ does in the human body."
    }
  ],
  "lifestyleTips": [
    "Practical, safe dietary or lifestyle habit 1",
    "Practical, safe habit 2",
    "Practical, safe habit 3"
  ],
  "questionsForDoctor": [
    "Suggested question 1 the patient can ask their consulting physician",
    "Suggested question 2",
    "Suggested question 3"
  ],
  "disclaimer": "Educational AI analysis. Please consult your doctor for formal clinical diagnosis."
}

Important guidelines:
- Never be alarmist. Use calm, supportive language.
- Explain medical terms (e.g. explain what hemoglobin or LDL does).
- Always include helpful questions to ask a doctor.
- Output ONLY valid JSON. No markdown backticks if possible, or standard json object.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: reportDataString,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "";
    try {
      const parsed = JSON.parse(responseText);
      return res.json({
        ...parsed,
        rawAnalysisText: parsed.summary || responseText,
      });
    } catch {
      // If parsing failed, format into response
      return res.json({
        summary: responseText.slice(0, 300),
        rawAnalysisText: responseText,
        keyFindings: payload.parameters.map((p) => ({
          parameter: p.name,
          value: `${p.value} ${p.unit}`,
          status: p.status,
          explanation: `Observed value is ${p.status}.`,
          whatItDoes: "Biomarker parameter.",
        })),
        lifestyleTips: [
          "Follow a balanced diet rich in leafy vegetables and whole foods.",
          "Keep adequately hydrated throughout the day.",
          "Discuss any out-of-range parameters with your physician.",
        ],
        questionsForDoctor: ["What do these parameters mean for my overall health?"],
        disclaimer: "Educational AI analysis. Please consult your physician.",
      });
    }
  } catch (error) {
    console.error("AI Report Analysis Error:", error);
    // Graceful fallback on API error
    const fallback = generateFallbackAnalysis(req.body);
    return res.json(fallback);
  }
});

// POST /api/ai/ask-question - Patient follow-up Q&A
router.post("/ask-question", async (req, res) => {
  try {
    const { question, testName, parameters } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Question is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        answer: `Regarding your question about ${testName || "your diagnostic test"}: In general, test results should be interpreted within your overall clinical context. Maintaining a balanced diet, proper sleep, and hydration supports healthy test ranges. Please discuss this specific symptom or question with your healthcare provider for clinical guidance.`,
      });
    }

    const context = `
Diagnostic Test: ${testName || "Laboratory Analysis"}
Key Parameters: ${Array.isArray(parameters) ? parameters.map((p: any) => `${p.name}: ${p.value} (${p.status})`).join(", ") : "Standard Profile"}
Patient Question: ${question}
`;

    const systemInstruction = `
You are a knowledgeable diagnostic health educator at Shree Healthcare Diagnostics.
Answer the patient's question empathetically, accurately, and in simple terms.
Provide helpful lifestyle or contextual background while reminding them to verify with their doctor for medication or clinical diagnosis.
Keep responses concise (3-4 sentences).
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: context,
      config: { systemInstruction },
    });

    return res.json({ answer: response.text || "Please consult your doctor for personalized advice." });
  } catch (error) {
    console.error("AI Q&A Error:", error);
    return res.json({
      answer: "We recommend reviewing this specific question with your healthcare provider during your consultation.",
    });
  }
});

export default router;
