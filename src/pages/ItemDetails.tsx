import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, MapPin, CheckCircle2, Shield, ArrowRight, Beaker, FileText, Activity } from "lucide-react";

// Mock Data
export const MOCK_ITEMS = [
  {
    id: "t1",
    type: "test",
    name: "Complete Blood Count (CBC)",
    description: "Measures different components of blood to evaluate overall health. Includes RBC, WBC, Platelets, and more.",
    longDescription: "A complete blood count (CBC) is a blood test used to evaluate your overall health and detect a wide range of disorders, including anemia, infection and leukemia. A complete blood count test measures several components and features of your blood, including red blood cells, which carry oxygen, white blood cells, which fight infection, hemoglobin, the oxygen-carrying protein in red blood cells, hematocrit, the proportion of red blood cells to the fluid component, or plasma, in your blood, and platelets, which help with blood clotting.",
    price: 399,
    originalPrice: 500,
    labsCount: 12,
    fastingRequired: false,
    reportTime: "24 Hrs",
    sampleType: "Blood",
    parameters: 24
  },
  {
    id: "t2",
    type: "test",
    name: "Lipid Profile",
    description: "Measures cholesterol levels to assess risk of heart disease.",
    longDescription: "A lipid panel is a blood test that measures the amount of certain fat molecules called lipids in your blood. In most cases, the panel includes four different cholesterol measurements and a measurement of your triglycerides. An excess of lipids in your blood can cause plaque buildup in your blood vessels and arteries.",
    price: 599,
    originalPrice: 800,
    labsCount: 8,
    fastingRequired: true,
    reportTime: "24 Hrs",
    sampleType: "Blood",
    parameters: 8
  },
  {
    id: "p1",
    type: "package",
    name: "Comprehensive Full Body Checkup",
    description: "Includes 85 tests covering vital organs and health parameters.",
    longDescription: "Our comprehensive full body checkup includes tests for your heart, liver, kidney, thyroid, blood sugar, lipid profile, and more. Regular health checkups can identify any early signs of health issues and managing them optimally.",
    price: 2499,
    originalPrice: 4999,
    labsCount: 5,
    fastingRequired: true,
    reportTime: "48 Hrs",
    sampleType: "Blood & Urine",
    parameters: 85
  }
];

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const item = MOCK_ITEMS.find((t) => t.id === id);

  if (!item) {
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
            &larr; Back to Results
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    item.type === 'package' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.type.toUpperCase()}
                  </span>
                  {item.fastingRequired && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                      Fasting Required
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">{item.name}</h1>
                <p className="text-slate-600 text-base leading-relaxed mb-6">{item.description}</p>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Available in {item.labsCount} Labs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Reports in {item.reportTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Sample: {item.sampleType}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 min-w-[280px]">
                <div className="text-sm text-slate-500 mb-1">Best Price Starting From</div>
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-4xl font-black text-slate-900">₹{item.price}</span>
                  <span className="text-lg text-slate-400 line-through mb-1">₹{item.originalPrice}</span>
                </div>
                <button 
                  onClick={() => navigate(`/book/${item.id}`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-sm hover:shadow active:scale-95 flex items-center justify-center gap-2"
                >
                  Book Now <ArrowRight className="h-5 w-5" />
                </button>
                <div className="flex items-center justify-center gap-1 text-xs text-emerald-600 font-medium mt-4">
                  <CheckCircle2 className="h-4 w-4" /> Free home sample collection
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-400" /> Overview
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {item.longDescription}
              </p>
              
              <h3 className="font-semibold text-slate-900 mb-3 text-sm">Pre-test Information</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  {item.fastingRequired ? "10-12 hours of fasting is required." : "No special preparation or fasting is required."}
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  Consumption of water is permitted.
                </li>
              </ul>
            </div>

            <div>
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" /> Parameters Covered ({item.parameters})
                </h3>
                {item.id === 'p1' ? (
                  <div className="text-sm text-slate-700 space-y-2">
                    <p className="font-medium">Includes 85 essential tests such as:</p>
                    <ul className="list-disc list-inside text-slate-600 ml-1 space-y-1">
                      <li>Complete Blood Count (24)</li>
                      <li>Lipid Profile (8)</li>
                      <li>Liver Function Test (11)</li>
                      <li>Kidney Function Test (10)</li>
                      <li>Thyroid Profile (3)</li>
                      <li>Diabetes Screening (2)</li>
                    </ul>
                    <button className="text-blue-600 font-medium mt-2 text-sm hover:underline">View all parameters</button>
                  </div>
                ) : (
                  <div className="text-sm text-slate-700 space-y-2">
                    <p className="font-medium">Key parameters include:</p>
                    {item.id === 't1' && (
                      <ul className="list-disc list-inside text-slate-600 ml-1 space-y-1">
                        <li>Red Blood Cell (RBC) Count</li>
                        <li>White Blood Cell (WBC) Count</li>
                        <li>Hemoglobin</li>
                        <li>Hematocrit</li>
                        <li>Platelet Count</li>
                      </ul>
                    )}
                    {item.id === 't2' && (
                      <ul className="list-disc list-inside text-slate-600 ml-1 space-y-1">
                        <li>Total Cholesterol</li>
                        <li>HDL (Good) Cholesterol</li>
                        <li>LDL (Bad) Cholesterol</li>
                        <li>Triglycerides</li>
                        <li>VLDL Cholesterol</li>
                      </ul>
                    )}
                    <button className="text-blue-600 font-medium mt-2 text-sm hover:underline">View all parameters</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 md:p-8 border-t border-slate-100 flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">100% Safe & Secure</h4>
                <p className="text-xs text-slate-500">NABL certified partner labs</p>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/book/${item.id}`)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-all w-full md:w-auto"
            >
              Choose Lab & Book
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
