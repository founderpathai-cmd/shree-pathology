import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star,
  MapPin,
  Phone,
  Clock,
  Shield,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Calendar,
  AlertCircle
} from "lucide-react";

interface LabData {
  id: string;
  _id?: string;
  name: string;
  rating: number;
  reviews?: number;
  reviewsCount?: number;
  address: string;
  city: string;
  phone: string;
  timings?: string;
  features?: string[];
  about?: string;
  popularTests?: Array<{
    id: string;
    _id?: string;
    name: string;
    price: number;
    originalPrice?: number;
    fastingRequired?: boolean;
    reportTime?: string;
  }>;
}

const LABS_REGISTRY: Record<string, LabData> = {
  l1: {
    id: "l1",
    name: "Diagnopein Diagnostics",
    rating: 4.8,
    reviews: 1240,
    address: "Prime Square, Near Balewadi High Street, Baner, Pune, Maharashtra 411045",
    city: "Pune",
    phone: "+91 020 6720 1200",
    timings: "06:30 AM - 08:30 PM (All 7 Days)",
    features: ["NABL Accredited", "ISO 9001:2015", "Free Doorstep Home Collection", "Digital Reports in 24 Hrs", "Automated Analyzers"],
    about: "Diagnopein Diagnostics is a premier NABL and CAP accredited pathology network. Equipped with high-throughput Roche Cobas & Beckman Coulter analyzers, offering over 400 specialized tests and routine pathology panels.",
    popularTests: [
      { id: "t1", name: "Complete Blood Count (CBC)", price: 399, originalPrice: 500, fastingRequired: false, reportTime: "24 Hours" },
      { id: "t3", name: "Thyroid Profile (T3, T4, TSH)", price: 499, originalPrice: 700, fastingRequired: false, reportTime: "24 Hours" },
      { id: "pkg1", name: "Comprehensive Full Body Checkup", price: 2499, originalPrice: 4999, fastingRequired: true, reportTime: "36 Hours" }
    ]
  },
  l2: {
    id: "l2",
    name: "Krsnaa Diagnostics",
    rating: 4.6,
    reviews: 850,
    address: "Hinjawadi IT Park Phase 1, Wakad Road, Pune, Maharashtra 411057",
    city: "Pune",
    phone: "+91 020 2740 5500",
    timings: "07:00 AM - 09:00 PM (Mon-Sun)",
    features: ["NABL Accredited", "Barcoded Sample Vials", "Home Sample Pickup", "Doctor Consultation Available"],
    about: "Krsnaa Diagnostics operates state-of-the-art diagnostic facilities nationwide, delivering affordable and clinically precise pathology and teleradiology solutions.",
    popularTests: [
      { id: "t2", name: "Lipid Profile (Cholesterol)", price: 599, originalPrice: 800, fastingRequired: true, reportTime: "24 Hours" },
      { id: "t5", name: "Liver Function Test (LFT)", price: 650, originalPrice: 900, fastingRequired: true, reportTime: "24 Hours" },
      { id: "pkg3", name: "Women's Health & Wellness Package", price: 2999, originalPrice: 6000, fastingRequired: true, reportTime: "36 Hours" }
    ]
  },
  l3: {
    id: "l3",
    name: "General Diagnostics International",
    rating: 4.7,
    reviews: 2100,
    address: "Karve Road, Near Paud Phata, Kothrud, Pune, Maharashtra 411038",
    city: "Pune",
    phone: "+91 020 2544 3322",
    timings: "06:00 AM - 08:00 PM (Mon-Sat)",
    features: ["NABL & CAP Certified", "AI-assisted Analysis", "Same-Day Reports", "Certified Phlebotomists"],
    about: "General Diagnostics International provides advanced immunodiagnostics, clinical biochemistry, and preventive molecular screenings with global quality benchmarks.",
    popularTests: [
      { id: "t4", name: "HbA1c (Glycated Hemoglobin)", price: 450, originalPrice: 650, fastingRequired: false, reportTime: "24 Hours" },
      { id: "pkg2", name: "Advanced Heart Care Package", price: 1999, originalPrice: 3500, fastingRequired: true, reportTime: "24 Hours" },
      { id: "t1", name: "Complete Blood Count (CBC)", price: 420, originalPrice: 500, fastingRequired: false, reportTime: "24 Hours" }
    ]
  },
  l4: {
    id: "l4",
    name: "Agilus Diagnostics",
    rating: 4.9,
    reviews: 3400,
    address: "Old Mumbai-Pune Highway, Pimpri-Chinchwad, Pune, Maharashtra 411018",
    city: "Pune",
    phone: "+91 020 3060 4050",
    timings: "07:00 AM - 08:00 PM (All 7 Days)",
    features: ["Hospital Grade", "NABL & CAP Accredited", "Senior Pathologist Signed", "Temperature Controlled Cold Chain"],
    about: "One of India's largest pathology networks delivering hospital-grade diagnostics and specialized genomic panels with cold-chain sample transport.",
    popularTests: [
      { id: "t1", name: "Complete Blood Count (CBC)", price: 499, originalPrice: 600, fastingRequired: false, reportTime: "18 Hours" },
      { id: "t2", name: "Lipid Profile (Cholesterol)", price: 699, originalPrice: 900, fastingRequired: true, reportTime: "24 Hours" },
      { id: "pkg1", name: "Comprehensive Full Body Checkup", price: 2799, originalPrice: 5500, fastingRequired: true, reportTime: "24 Hours" }
    ]
  }
};

export default function LabDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState<LabData>(LABS_REGISTRY[id || "l1"] || LABS_REGISTRY.l1);

  useEffect(() => {
    if (!id) return;

    if (LABS_REGISTRY[id]) {
      setLab(LABS_REGISTRY[id]);
    }

    fetch(`/api/labs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Lab not found");
        return res.json();
      })
      .then((data) => {
        if (data) {
          setLab((prev) => ({
            ...prev,
            ...data,
            id: data.id || data._id || id,
            name: data.name || prev.name,
            address: data.address || prev.address,
            phone: data.phone || prev.phone,
            rating: data.rating || prev.rating,
            reviews: data.reviewsCount || prev.reviews
          }));
        }
      })
      .catch((err) => {
        console.warn("Could not fetch remote lab details, using registry fallback", err);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Search Results
          </button>
        </div>

        {/* Lab Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                  Certified Partner Laboratory
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Active Partner
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{lab.name}</h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-600">
                <div className="flex items-center font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                  <Star className="h-3.5 w-3.5 fill-current mr-1 text-amber-500" />
                  {lab.rating} ({lab.reviews || lab.reviewsCount || 1000}+ Verified Reviews)
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                  {lab.address}
                </div>
                {lab.timings && (
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1 text-slate-400" />
                    {lab.timings}
                  </div>
                )}
                {lab.phone && (
                  <div className="flex items-center">
                    <Phone className="h-3.5 w-3.5 mr-1 text-slate-400" />
                    {lab.phone}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {(lab.features || ["NABL Accredited", "Home Sample Pickup", "E-Reports"]).map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/60"
                  >
                    <Shield className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="shrink-0 flex md:flex-col justify-between items-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
              <div className="text-left md:text-right">
                <div className="text-xs text-slate-500">Home Collection</div>
                <div className="text-base font-bold text-emerald-600">Available · FREE</div>
              </div>
              <Link
                to={`/search?labId=${lab.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Browse All Tests at this Lab
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200 space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" /> About {lab.name}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {lab.about ||
                  "State-of-the-art accredited laboratory facility offering trusted diagnostic testing and verified e-reports."}
              </p>
            </div>

            {/* Popular Tests & Packages Offered by this Lab */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Available Tests & Health Packages</h2>
                  <p className="text-xs text-slate-500">Direct booking with sample collection for this laboratory.</p>
                </div>
              </div>

              <div className="space-y-3">
                {(lab.popularTests || []).map((test) => (
                  <div
                    key={test.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 transition-all gap-4"
                  >
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{test.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Reports in {test.reportTime || "24 Hours"}
                        </span>
                        {test.fastingRequired && (
                          <span className="text-amber-700 font-medium">10-12 hrs Fasting</span>
                        )}
                        <span className="text-emerald-700 font-medium">Free Doorstep Pickup</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">₹{test.price}</div>
                        {test.originalPrice && (
                          <div className="text-xs text-slate-400 line-through">₹{test.originalPrice}</div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate(`/book/${test.id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                      >
                        Book Now <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 sticky top-24 space-y-6">
              <h3 className="font-bold text-slate-900 text-base">Accreditation & Standards</h3>
              <ul className="space-y-3.5 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>NABL Certified:</strong> Compliant with ISO 15189 standards for medical testing.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>MD Pathologist Signed:</strong> Every report is verified and authenticated by senior clinical pathologists.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Barcoded Vacuum Vials:</strong> Complete sample identity tracking with zero risk of mix-ups.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Digital Smart Reports:</strong> Downloadable PDF reports delivered directly to email and SMS.</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  to="/search"
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-bold text-xs transition-colors shadow-xs"
                >
                  Compare with Other Labs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
