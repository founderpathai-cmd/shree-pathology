import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, MapPin, CheckCircle2, Shield, ArrowRight, Beaker, FileText, Activity, Scale, Sparkles } from "lucide-react";
import LabComparisonTable, { LabPriceEntry } from "../components/LabComparisonTable";

// Mock Data
export const MOCK_ITEMS = [
  {
    id: "t1",
    type: "test",
    name: "Complete Blood Count (CBC)",
    description: "Measures different components of blood to evaluate overall health. Includes RBC, WBC, Platelets, and more.",
    longDescription: "A complete blood count (CBC) is a blood test used to evaluate your overall health and detect a wide range of disorders, including anemia, infection and leukemia. A complete blood count test measures several components and features of your blood, including red blood cells, which carry oxygen, white blood cells, which fight infection, hemoglobin, the oxygen-carrying protein in red blood cells, hematocrit, the proportion of red blood cells to the fluid component, or plasma, in your blood, and platelets, which help with blood clotting.",
    price: 349,
    originalPrice: 500,
    labsCount: 4,
    fastingRequired: false,
    reportTime: "24 Hours",
    sampleType: "Blood",
    parameters: 24,
    labPricing: [] as LabPriceEntry[],
  },
  {
    id: "t2",
    type: "test",
    name: "Lipid Profile",
    description: "Measures cholesterol levels to assess risk of heart disease.",
    longDescription: "A lipid panel is a blood test that measures the amount of certain fat molecules called lipids in your blood. In most cases, the panel includes four different cholesterol measurements and a measurement of your triglycerides. An excess of lipids in your blood can cause plaque buildup in your blood vessels and arteries.",
    price: 499,
    originalPrice: 750,
    labsCount: 4,
    fastingRequired: true,
    reportTime: "24 Hours",
    sampleType: "Blood",
    parameters: 8,
    labPricing: [] as LabPriceEntry[],
  },
  {
    id: "p1",
    type: "package",
    name: "Comprehensive Full Body Checkup",
    description: "Includes 85 tests covering vital organs and health parameters.",
    longDescription: "Our comprehensive full body checkup includes tests for your heart, liver, kidney, thyroid, blood sugar, lipid profile, and more. Regular health checkups can identify any early signs of health issues and managing them optimally.",
    price: 2199,
    originalPrice: 4500,
    labsCount: 4,
    fastingRequired: true,
    reportTime: "24-36 Hours",
    sampleType: "Blood & Urine",
    parameters: 85,
    labPricing: [] as LabPriceEntry[],
  }
];

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(() => {
    const fallback = MOCK_ITEMS.find((t) => t.id === id);
    return fallback || null;
  });
  const [loading, setLoading] = useState(false);

  // Fetch live test details if available
  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/tests/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data) {
            setItem((prev) => ({
              ...(prev || {}),
              id: data.id || data._id || id,
              name: data.name,
              type: data.type || "test",
              description: data.description,
              longDescription: data.description || prev?.longDescription,
              price: data.price,
              originalPrice: data.originalPrice,
              fastingRequired: data.fastingRequired,
              reportTime: data.reportTime,
              sampleType: (data.parameters && data.parameters.some((p: string) => p.toLowerCase().includes("urine"))) ? "Blood & Urine" : "Blood",
              parameters: Array.isArray(data.parameters) ? data.parameters.length : 12,
              labsCount: data.labPricing ? data.labPricing.length : 4,
              labPricing: data.labPricing || [],
            }));
          }
        }
      } catch (err) {
        console.warn("Could not fetch test from API, using fallback", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const scrollToComparison = () => {
    const el = document.getElementById("lab-comparison-table");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!item && !loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Item not found</h2>
        <p className="text-slate-500 mb-6">The test or package you are looking for does not exist.</p>
        <button onClick={() => navigate('/search')} className="bg-blue-600 text-white px-6 py-2 rounded-xl">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5"
          >
            &larr; Back to Results
          </button>

          <button
            onClick={scrollToComparison}
            className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Scale className="h-3.5 w-3.5 text-blue-600" />
            <span>Compare Partner Labs Side-by-Side</span>
          </button>
        </div>

        {/* Main Test Summary Card */}
        {item && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="p-6 md:p-8 border-b border-slate-100">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        item.type === "package"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {item.type.toUpperCase()}
                    </span>
                    {item.fastingRequired && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                        Fasting Required
                      </span>
                    )}
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      NABL Verified
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">{item.name}</h1>
                  <p className="text-slate-600 text-base leading-relaxed mb-6">{item.description}</p>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Available in {item.labsCount || 4} Certified Labs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Reports in {item.reportTime || "24 Hours"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Beaker className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Sample: {item.sampleType || "Blood"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 min-w-[280px] border border-slate-200/80">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Best Price Starting From
                  </div>
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-4xl font-black text-slate-900">₹{item.price}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-lg text-slate-400 line-through mb-1">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate(`/book/${item.id}`)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-sm hover:shadow active:scale-95 flex items-center justify-center gap-2"
                    >
                      Book Now <ArrowRight className="h-5 w-5" />
                    </button>
                    <button
                      onClick={scrollToComparison}
                      className="w-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Scale className="h-3.5 w-3.5 text-blue-600" /> Compare All Lab Prices
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs text-emerald-600 font-medium mt-4">
                    <CheckCircle2 className="h-4 w-4" /> Free home sample collection across Pune
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-400" /> Overview & Purpose
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {item.longDescription || item.description}
                </p>

                <h3 className="font-semibold text-slate-900 mb-3 text-sm">Pre-test Guidelines</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    {item.fastingRequired
                      ? "10-12 hours of overnight fasting is required before sample collection."
                      : "No special preparation or fasting is required for this diagnostic test."}
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    Water intake is allowed and encouraged to stay hydrated.
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    Inform the visiting phlebotomist about any regular medication.
                  </li>
                </ul>
              </div>

              <div>
                <div className="bg-blue-50/70 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" /> Parameters Covered ({item.parameters})
                  </h3>
                  <div className="text-sm text-slate-700 space-y-2">
                    <p className="font-medium text-slate-800">Key diagnostic biomarkers included:</p>
                    {item.id === "t1" ? (
                      <ul className="list-disc list-inside text-slate-600 ml-1 space-y-1">
                        <li>Red Blood Cell (RBC) Count & Hemoglobin</li>
                        <li>White Blood Cell (WBC) Total & Differential</li>
                        <li>Platelet Count & Mean Platelet Volume (MPV)</li>
                        <li>Hematocrit / Packed Cell Volume (PCV)</li>
                        <li>RBC Indices (MCV, MCH, MCHC, RDW)</li>
                      </ul>
                    ) : item.id === "t2" ? (
                      <ul className="list-disc list-inside text-slate-600 ml-1 space-y-1">
                        <li>Total Cholesterol & Triglycerides</li>
                        <li>High-Density Lipoprotein (HDL - Good Cholesterol)</li>
                        <li>Low-Density Lipoprotein (LDL - Bad Cholesterol)</li>
                        <li>Very Low-Density Lipoprotein (VLDL)</li>
                        <li>Cholesterol / HDL Risk Ratio</li>
                      </ul>
                    ) : (
                      <ul className="list-disc list-inside text-slate-600 ml-1 space-y-1">
                        <li>Comprehensive Blood & Metabolic Count</li>
                        <li>Liver Function Panel (Bilirubin, SGOT, SGPT)</li>
                        <li>Kidney Function Panel (Creatinine, Urea, Uric Acid)</li>
                        <li>Lipid & Cardiac Risk Profile</li>
                        <li>Fasting Blood Sugar & Routine Microscopy</li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Embedded Lab Comparison Table */}
        {item && (
          <div className="mb-12">
            <LabComparisonTable
              testId={item.id}
              testName={item.name}
              labPricing={item.labPricing && item.labPricing.length > 0 ? item.labPricing : undefined}
              title={`Compare Partner Labs for ${item.name}`}
              description="Choose multiple NABL-certified laboratories in Pune below to see an exact side-by-side breakdown of test price, report delivery speed, and home sample collection."
            />
          </div>
        )}
      </div>
    </div>
  );
}
