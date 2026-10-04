import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Bot,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Send,
  RefreshCw,
  FileText,
  ShieldAlert,
  Apple,
  MessageSquare,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink
} from "lucide-react";

export interface BiomarkerItem {
  name: string;
  value: string;
  unit: string;
  range: string;
  status: "Normal" | "High" | "Low" | "Borderline";
}

export interface ReportDataForAI {
  reportId?: string;
  bookingRef?: string;
  testName: string;
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  labName?: string;
  parameters: BiomarkerItem[];
  clinicalImpression?: string;
}

export interface AIAnalysisResult {
  summary: string;
  keyFindings: Array<{
    parameter: string;
    value: string;
    status: string;
    explanation: string;
    whatItDoes: string;
  }>;
  lifestyleTips: string[];
  questionsForDoctor: string[];
  disclaimer: string;
}

interface AIReportAnalyzerProps {
  report?: ReportDataForAI | null;
  onClose?: () => void;
  isModal?: boolean;
}

const SAMPLE_REPORTS: Array<{ label: string; data: ReportDataForAI }> = [
  {
    label: "Lipid Profile (Cholesterol Panel)",
    data: {
      testName: "Lipid Profile",
      patientName: "Sunita Deshmukh",
      patientAge: 48,
      patientGender: "Female",
      labName: "Diagnopein Diagnostics, Pune",
      parameters: [
        { name: "Total Cholesterol", value: "215", unit: "mg/dL", range: "< 200", status: "High" },
        { name: "Triglycerides", value: "162", unit: "mg/dL", range: "< 150", status: "High" },
        { name: "HDL (Good) Cholesterol", value: "46", unit: "mg/dL", range: "> 40", status: "Normal" },
        { name: "LDL (Bad) Cholesterol", value: "138", unit: "mg/dL", range: "< 100", status: "High" },
        { name: "VLDL Cholesterol", value: "31", unit: "mg/dL", range: "5 - 30", status: "High" },
      ],
      clinicalImpression: "Mild dyslipidemia with elevated LDL and total cholesterol.",
    },
  },
  {
    label: "Complete Blood Count (CBC)",
    data: {
      testName: "Complete Blood Count (CBC)",
      patientName: "Rahul Kulkarni",
      patientAge: 34,
      patientGender: "Male",
      labName: "Krsnaa Diagnostics, Pune",
      parameters: [
        { name: "Hemoglobin", value: "14.2", unit: "g/dL", range: "13.0 - 17.0", status: "Normal" },
        { name: "WBC Count", value: "7,400", unit: "/cu.mm", range: "4,000 - 11,000", status: "Normal" },
        { name: "Platelet Count", value: "245,000", unit: "/cu.mm", range: "150,000 - 450,000", status: "Normal" },
        { name: "RBC Count", value: "4.8", unit: "mil/cu.mm", range: "4.5 - 5.5", status: "Normal" },
        { name: "Packed Cell Volume (PCV)", value: "43.1", unit: "%", range: "40.0 - 50.0", status: "Normal" },
      ],
      clinicalImpression: "Healthy hematological parameters. Normal cellular indices.",
    },
  },
  {
    label: "Thyroid Profile (T3, T4, TSH)",
    data: {
      testName: "Thyroid Profile Total",
      patientName: "Pooja Patil",
      patientAge: 29,
      patientGender: "Female",
      labName: "General Diagnostics, Pune",
      parameters: [
        { name: "Total Triiodothyronine (T3)", value: "1.2", unit: "ng/mL", range: "0.8 - 2.0", status: "Normal" },
        { name: "Total Thyroxine (T4)", value: "7.8", unit: "μg/dL", range: "5.1 - 14.1", status: "Normal" },
        { name: "Thyroid Stimulating Hormone (TSH)", value: "4.85", unit: "μIU/mL", range: "0.27 - 4.20", status: "High" },
      ],
      clinicalImpression: "Mildly elevated TSH with normal circulating peripheral T3 and T4 levels (Subclinical).",
    },
  },
];

export default function AIReportAnalyzer({
  report: initialReport,
  onClose,
  isModal = false,
}: AIReportAnalyzerProps) {
  const [activeReport, setActiveReport] = useState<ReportDataForAI | null>(
    initialReport || SAMPLE_REPORTS[0].data
  );
  const [customText, setCustomText] = useState("");
  const [inputMode, setInputMode] = useState<"preset" | "custom">(initialReport ? "preset" : "preset");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  // Q&A state
  const [userQuestion, setUserQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ q: string; a: string }>>([]);
  const [isAsking, setIsAsking] = useState(false);

  // Sync if prop changes
  useEffect(() => {
    if (initialReport) {
      setActiveReport(initialReport);
      setAnalysisResult(null);
      setChatHistory([]);
    }
  }, [initialReport]);

  // Run analysis function
  const runAnalysis = async (reportToAnalyze = activeReport, customReportString = "") => {
    setIsAnalyzing(true);
    try {
      const payload = customReportString
        ? {
            testName: "Custom Medical Lab Report",
            customReportText: customReportString,
            parameters: [],
          }
        : {
            testName: reportToAnalyze?.testName || "Diagnostic Pathology Test",
            patientName: reportToAnalyze?.patientName,
            patientAge: reportToAnalyze?.patientAge,
            patientGender: reportToAnalyze?.patientGender,
            parameters: reportToAnalyze?.parameters || [],
            clinicalImpression: reportToAnalyze?.clinicalImpression || "",
          };

      const res = await fetch("/api/ai/analyze-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
      } else {
        throw new Error("Analysis failed");
      }
    } catch (err) {
      console.error("AI Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Ask follow-up question
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    const q = userQuestion.trim();
    setUserQuestion("");
    setIsAsking(true);

    try {
      const res = await fetch("/api/ai/ask-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          testName: activeReport?.testName,
          parameters: activeReport?.parameters,
        }),
      });

      let answer = "Please consult your doctor for medical clarification.";
      if (res.ok) {
        const data = await res.json();
        answer = data.answer || answer;
      }

      setChatHistory((prev) => [...prev, { q, a: answer }]);
    } catch (err) {
      console.error("Q&A Error:", err);
      setChatHistory((prev) => [
        ...prev,
        {
          q,
          a: "We recommend reviewing this specific query directly with your physician for tailored advice.",
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  // Auto-analyze when opened with a report
  useEffect(() => {
    if (activeReport && !analysisResult) {
      runAnalysis(activeReport);
    }
  }, [activeReport]);

  const content = (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
      {/* Header bar */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                AI Diagnostic Report Explainer
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                Patient Friendly
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Translates complex medical parameters & ranges into clear, reassuring insights.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
        {/* Report Selector or Custom Paste Option (if not locked to one initial report) */}
        {!initialReport && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-blue-600" />
                Select a Report to Explain:
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setInputMode("preset")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    inputMode === "preset"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  Sample Reports
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("custom")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    inputMode === "custom"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  Paste Your Report
                </button>
              </div>
            </div>

            {inputMode === "preset" ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {SAMPLE_REPORTS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveReport(s.data);
                      setAnalysisResult(null);
                      runAnalysis(s.data);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      activeReport?.testName === s.data.testName
                        ? "bg-blue-50 border-blue-400 text-blue-900 shadow-2xs"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <textarea
                  rows={3}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Paste parameters from your lab report here (e.g. Hemoglobin: 11.2 g/dL, Total Cholesterol: 220 mg/dL, Fasting Sugar: 105 mg/dL)..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 font-mono"
                />
                <button
                  onClick={() => runAnalysis(null, customText)}
                  disabled={!customText.trim() || isAnalyzing}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Analyze Pasted Values</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Selected Test Badge */}
        {activeReport && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{activeReport.testName}</span>
              {activeReport.patientName && (
                <span className="text-slate-500">
                  · Patient: <strong>{activeReport.patientName}</strong>
                </span>
              )}
            </div>

            <button
              onClick={() => runAnalysis(activeReport)}
              disabled={isAnalyzing}
              className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 text-[11px]"
            >
              <RefreshCw className={`h-3 w-3 ${isAnalyzing ? "animate-spin text-blue-600" : ""}`} />
              <span>Re-analyze</span>
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {isAnalyzing && (
          <div className="p-12 text-center space-y-3">
            <div className="h-10 w-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-sm font-bold text-slate-900">
              Analyzing Biomarkers with Medical AI...
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Synthesizing biological reference ranges into clear, layman terms with dietary and wellness insights.
            </p>
          </div>
        )}

        {/* Analysis Results Display */}
        {!isAnalyzing && analysisResult && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 1. Executive Plain-English Summary */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-200/80 space-y-2">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
                <Bot className="h-4 w-4 text-blue-600" />
                <span>Overall Clinical Summary</span>
              </div>
              <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
                {analysisResult.summary}
              </p>
            </div>

            {/* 2. Key Findings & What Numbers Mean */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Stethoscope className="h-4 w-4 text-blue-600" />
                  What Your Specific Test Numbers Mean:
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  {analysisResult.keyFindings.length} parameters analyzed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {analysisResult.keyFindings.map((finding, idx) => {
                  const isNormal = finding.status === "Normal";

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all text-xs space-y-2 ${
                        isNormal
                          ? "bg-white border-slate-200/90 shadow-2xs"
                          : "bg-amber-50/40 border-amber-200/90 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-bold text-slate-900 text-sm block">
                            {finding.parameter}
                          </span>
                          <span className="font-extrabold text-blue-700 text-xs mt-0.5 block">
                            Observed: {finding.value}
                          </span>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                            isNormal
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          {isNormal ? "Optimal" : finding.status}
                        </span>
                      </div>

                      {/* What it does in body */}
                      {finding.whatItDoes && (
                        <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl">
                          <strong className="text-slate-700 font-semibold">Body Function: </strong>
                          {finding.whatItDoes}
                        </div>
                      )}

                      {/* Plain english explanation */}
                      <p className="text-slate-700 text-xs leading-relaxed font-medium">
                        {finding.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Actionable Dietary & Lifestyle Tips */}
            {analysisResult.lifestyleTips && analysisResult.lifestyleTips.length > 0 && (
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                  <Apple className="h-4 w-4 text-emerald-600" />
                  <span>Personalized Wellness & Nutrition Suggestions:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {analysisResult.lifestyleTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 4. Suggested Questions to Ask Your Doctor */}
            {analysisResult.questionsForDoctor && analysisResult.questionsForDoctor.length > 0 && (
              <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2.5">
                <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase tracking-wider">
                  <HelpCircle className="h-4 w-4 text-purple-600" />
                  <span>Helpful Questions for Your Doctor's Visit:</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  You can ask these specific questions during your follow-up consultation:
                </p>
                <div className="space-y-1.5">
                  {analysisResult.questionsForDoctor.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white border border-purple-100 text-xs font-medium text-slate-800 flex items-start gap-2 shadow-2xs"
                    >
                      <span className="font-bold text-purple-600 shrink-0">{idx + 1}.</span>
                      <span>"{q}"</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Interactive Patient Follow-Up Questions */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <span>Have a question about these test results?</span>
              </div>

              {/* Chat thread */}
              {chatHistory.length > 0 && (
                <div className="space-y-2.5 max-h-48 overflow-y-auto pt-1">
                  {chatHistory.map((item, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="bg-blue-100 text-blue-900 font-semibold p-2.5 rounded-xl max-w-[85%] ml-auto text-right">
                        {item.q}
                      </div>
                      <div className="bg-white border border-slate-200 p-2.5 rounded-xl text-slate-800 max-w-[90%] mr-auto shadow-2xs">
                        {item.a}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleAskQuestion} className="flex gap-2">
                <input
                  type="text"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="e.g. Can I exercise with these results? What foods should I avoid?"
                  className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!userQuestion.trim() || isAsking}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Ask AI</span>
                </button>
              </form>
            </div>

            {/* 6. Medical Disclaimer */}
            <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2.5 leading-relaxed">
              <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Medical Notice:</strong> This interpretation is generated by Google Gemini AI
                for patient health literacy and educational context. It does not constitute medical advice,
                clinical diagnosis, or prescription. Please consult your physician at Shree Healthcare Diagnostics
                or your family doctor before initiating any medication or treatment changes.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
        {onClose ? (
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Close Explainer
          </button>
        ) : null}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="w-full max-w-3xl">{content}</div>
      </div>
    );
  }

  return content;
}
