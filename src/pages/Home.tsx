import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Shield,
  Clock,
  FileText,
  Star,
  ArrowRight,
  Activity,
  Sparkles,
  X,
  Upload,
  Home as HomeIcon,
  Heart,
  Droplet,
  Brain,
  Building2,
  ChevronRight,
  Beaker,
  CheckCircle2,
  Check,
  Phone,
  HeartPulse,
  Award,
  Sparkle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SearchSuggestionTest {
  id: string;
  name: string;
  type: "test" | "package";
  price: number;
  fastingRequired: boolean;
  labsAvailable: number;
  reportTime: string;
  category: string;
}

interface SearchSuggestionLab {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  area: string;
  city: string;
  tag: string;
}

const SEARCHABLE_TESTS: SearchSuggestionTest[] = [
  {
    id: "t1",
    name: "Complete Blood Count (CBC)",
    type: "test",
    price: 399,
    fastingRequired: false,
    labsAvailable: 4,
    reportTime: "24 Hours",
    category: "Hematology & Routine"
  },
  {
    id: "t2",
    name: "Lipid Profile (Cholesterol & Triglycerides)",
    type: "test",
    price: 599,
    fastingRequired: true,
    labsAvailable: 4,
    reportTime: "24 Hours",
    category: "Cardiology"
  },
  {
    id: "t3",
    name: "Thyroid Profile (T3, T4, TSH)",
    type: "test",
    price: 499,
    fastingRequired: false,
    labsAvailable: 3,
    reportTime: "24 Hours",
    category: "Endocrinology"
  },
  {
    id: "t4",
    name: "HbA1c (Glycated Hemoglobin - Diabetes)",
    type: "test",
    price: 450,
    fastingRequired: false,
    labsAvailable: 4,
    reportTime: "24 Hours",
    category: "Diabetes Screening"
  },
  {
    id: "t5",
    name: "Vitamin D3 (25-OH) & B12 Combo",
    type: "test",
    price: 999,
    fastingRequired: false,
    labsAvailable: 4,
    reportTime: "24 Hours",
    category: "Vitamins & Fatigue"
  },
  {
    id: "pkg1",
    name: "Comprehensive Full Body Checkup (85 Tests)",
    type: "package",
    price: 2499,
    fastingRequired: true,
    labsAvailable: 4,
    reportTime: "36 Hours",
    category: "Preventive Health"
  },
  {
    id: "pkg2",
    name: "Advanced Heart Care Package",
    type: "package",
    price: 1999,
    fastingRequired: true,
    labsAvailable: 3,
    reportTime: "24 Hours",
    category: "Cardiac Screening"
  },
  {
    id: "pkg3",
    name: "Women's Health & Wellness Package",
    type: "package",
    price: 2999,
    fastingRequired: true,
    labsAvailable: 3,
    reportTime: "36 Hours",
    category: "Women's Health"
  }
];

const SEARCHABLE_LABS: SearchSuggestionLab[] = [
  {
    id: "l1",
    name: "Diagnopein Diagnostics",
    rating: 4.8,
    reviews: 1240,
    area: "Baner & Aundh",
    city: "Pune",
    tag: "NABL Accredited Infrastructure"
  },
  {
    id: "l2",
    name: "Krsnaa Diagnostics",
    rating: 4.6,
    reviews: 850,
    area: "Wakad & Hinjawadi",
    city: "Pune",
    tag: "Automated Robotic Sample Analyzers"
  },
  {
    id: "l3",
    name: "General Diagnostics International",
    rating: 4.7,
    reviews: 2100,
    area: "Kothrud & Deccan",
    city: "Pune",
    tag: "NABL & CAP Certified"
  },
  {
    id: "l4",
    name: "Agilus Diagnostics",
    rating: 4.9,
    reviews: 3400,
    area: "Pimpri-Chinchwad",
    city: "Pune",
    tag: "Hospital Grade · Rapid Turnaround"
  }
];

const PUNE_AREAS = [
  "Pune, Maharashtra",
  "Pimpri-Chinchwad (PCMC)",
  "Kothrud & Deccan",
  "Baner & Aundh",
  "Wakad & Hinjawadi",
  "Viman Nagar & Kalyani Nagar",
  "Hadapsar & Magarpatta",
  "Swargate & Katraj"
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Pune, Maharashtra");
  const [customLocationInput, setCustomLocationInput] = useState("");
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // AI Modal states
  const [showAiModal, setShowAiModal] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setShowLocationPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered Tests
  const matchingTests = searchQuery.trim()
    ? SEARCHABLE_TESTS.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCHABLE_TESTS.slice(0, 4);

  // Filtered Laboratories
  const matchingLabs = searchQuery.trim()
    ? SEARCHABLE_LABS.filter((l) =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        matchingTests.length > 0
      )
    : SEARCHABLE_LABS;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    const city = selectedLocation.split(",")[0].trim();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&city=${encodeURIComponent(city)}`);
    } else {
      navigate(`/search?city=${encodeURIComponent(city)}`);
    }
  };

  const handleSelectTest = (test: SearchSuggestionTest) => {
    setShowSuggestions(false);
    setSearchQuery(test.name);
    navigate(`/search?q=${encodeURIComponent(test.name)}`);
  };

  const handleSelectLab = (lab: SearchSuggestionLab) => {
    setShowSuggestions(false);
    navigate(`/labs/${lab.id}`);
  };

  const handleAiSuggest = () => {
    const lowerSymptoms = symptoms.toLowerCase();
    let suggestion = "Comprehensive Full Body Checkup";

    if (lowerSymptoms.includes("fever") || lowerSymptoms.includes("weakness")) {
      suggestion = "Complete Blood Count (CBC) & Dengue NS1";
    } else if (lowerSymptoms.includes("chest") || lowerSymptoms.includes("heart")) {
      suggestion = "Advanced Heart Care Package & Lipid Profile";
    } else if (lowerSymptoms.includes("stomach") || lowerSymptoms.includes("digestion")) {
      suggestion = "Liver Function Test (LFT) & Ultrasound";
    } else if (lowerSymptoms.includes("sugar") || lowerSymptoms.includes("thirst")) {
      suggestion = "HbA1c & Fasting Blood Sugar";
    } else if (lowerSymptoms.includes("bone") || lowerSymptoms.includes("tired")) {
      suggestion = "Vitamin D3 & Vitamin B12 Screening";
    }

    setAiSuggestion(suggestion);
  };

  const quickSearches = [
    { label: "CBC", query: "Complete Blood Count (CBC)" },
    { label: "Thyroid", query: "Thyroid Profile (T3, T4, TSH)" },
    { label: "Vitamin D", query: "Vitamin D3 (25-OH)" },
    { label: "HbA1c", query: "HbA1c (Glycated Hemoglobin)" },
    { label: "Full Body Checkup", query: "Comprehensive Full Body Checkup" }
  ];

  const featuredPackages = [
    {
      id: "pkg1",
      name: "Comprehensive Full Body Checkup",
      tests: 85,
      price: 2499,
      originalPrice: 4999,
      discount: "50% OFF",
      tags: ["Most Popular", "10-12h Fasting"]
    },
    {
      id: "pkg2",
      name: "Advanced Heart Care Package",
      tests: 42,
      price: 1999,
      originalPrice: 3500,
      discount: "42% OFF",
      tags: ["Cardiology Panel", "ECG Included"]
    },
    {
      id: "pkg3",
      name: "Women's Health & Wellness",
      tests: 64,
      price: 2999,
      originalPrice: 6000,
      discount: "50% OFF",
      tags: ["Hormonal Screen", "Vitamins & Calcium"]
    }
  ];

  return (
    <div className="flex flex-col bg-white">
      {/* ================= HERO SECTION ================= */}
      {/* Upgraded background: Dark royal blue -> deep navy with microscopic/cellular light texture & cyan luminescence */}
      <section className="relative bg-gradient-to-b from-[#07162c] via-[#051122] to-[#030914] text-white pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-visible border-b border-slate-800/80">
        {/* Subtle Microscopic Cellular & Molecular Structure SVG Pattern */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[radial-gradient(#38bdf8_1.5px,transparent_1.5px)] [background-size:28px_28px]" />

        {/* Subtle Microscopic / Cellular Background Image Overlay */}
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-screen pointer-events-none filter blur-[0.5px]"
          style={{ backgroundImage: "url('/hero_clinical_bg.jpg')" }}
        />

        {/* Subtle Cyan and Deep Blue Clinical Luminescence */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[450px] h-[350px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="max-w-3xl space-y-6">
            {/* Shree Diagnostics Service Kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-semibold shadow-xs">
              <HeartPulse className="h-4 w-4 text-cyan-400" />
              <span>Shree Healthcare Diagnostics · Trusted Pune Diagnostic Service</span>
            </div>

            {/* Headline Option A: Trusted Diagnostics. Better Health Decisions. */}
            <div className="space-y-2.5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Trusted Diagnostics. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-200">
                  Better Health Decisions.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed pt-1">
                Find diagnostic tests from trusted laboratories, book home sample collection, and receive your reports
                digitally.
              </p>
            </div>

            {/* ================= IMPROVED HIGH-UTILITY SEARCH BAR ================= */}
            <div ref={searchContainerRef} className="relative z-30 pt-2">
              <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-2xl flex flex-col md:flex-row gap-2 border border-slate-200/50">
                {/* 📍 Location Picker: Dynamic / Pune / Enter your location */}
                <div className="relative md:w-60">
                  <div
                    onClick={() => setShowLocationPicker(!showLocationPicker)}
                    className="h-full flex items-center justify-between px-3.5 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center min-w-0">
                      <MapPin className="h-4 w-4 text-blue-600 mr-2 shrink-0" />
                      <span className="text-xs font-bold text-slate-800 truncate select-none">
                        {selectedLocation.split(",")[0]}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold ml-1">▼</span>
                  </div>

                  {showLocationPicker && (
                    <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
                      <div className="text-[10px] font-bold text-slate-400 px-1 py-1 uppercase tracking-wider">
                        Service Area / Location
                      </div>

                      {/* Custom Location Input */}
                      <div className="my-1.5 relative">
                        <input
                          type="text"
                          placeholder="Enter your location or area..."
                          value={customLocationInput}
                          onChange={(e) => setCustomLocationInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && customLocationInput.trim()) {
                              setSelectedLocation(customLocationInput.trim());
                              setShowLocationPicker(false);
                            }
                          }}
                          className="w-full text-xs px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-blue-500 font-medium"
                        />
                      </div>

                      <div className="max-h-52 overflow-y-auto space-y-0.5 mt-1">
                        {PUNE_AREAS.map((city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() => {
                              setSelectedLocation(city);
                              setShowLocationPicker(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                              selectedLocation === city
                                ? "bg-blue-50 text-blue-700 font-bold"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            📍 {city}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 🔍 Search Input */}
                <div className="flex-[2] flex items-center px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white transition-all">
                  <Search className="h-4 w-4 text-slate-400 mr-3 shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search tests, packages or health concerns..."
                    className="bg-transparent border-none outline-none w-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-medium"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearchSubmit();
                      else if (e.key === "Escape") setShowSuggestions(false);
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        searchInputRef.current?.focus();
                      }}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Find Tests Button */}
                <button
                  type="button"
                  onClick={() => handleSearchSubmit()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap shadow-md flex items-center justify-center gap-2"
                >
                  <Search className="h-4 w-4" /> Find Tests
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 max-h-[440px] overflow-y-auto text-slate-900">
                  <div className="p-4 space-y-4">
                    {/* Matching Tests */}
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                        Matching Medical Tests
                      </div>
                      <div className="space-y-1">
                        {matchingTests.map((test) => (
                          <div
                            key={test.id}
                            onClick={() => handleSelectTest(test)}
                            className="p-2.5 rounded-xl hover:bg-blue-50/70 cursor-pointer transition-colors flex items-center justify-between group"
                          >
                            <div>
                              <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-700">
                                {test.name}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {test.category} · Reports in {test.reportTime}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-slate-900">From ₹{test.price}</span>
                              <div className="text-[10px] text-blue-600 font-semibold group-hover:underline">
                                View Labs →
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Infrastructure Labs */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                        Accredited Partner Lab Infrastructure
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {matchingLabs.slice(0, 4).map((lab) => (
                          <div
                            key={lab.id}
                            onClick={() => handleSelectLab(lab)}
                            className="p-2.5 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/40 cursor-pointer transition-all flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-xs text-slate-900">{lab.name}</div>
                              <div className="text-[10px] text-slate-500">{lab.area}, {lab.city}</div>
                            </div>
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                              ★ {lab.rating}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 px-4 border-t border-slate-100 text-right">
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit()}
                      className="text-xs font-bold text-blue-700 hover:underline"
                    >
                      See all laboratory results for "{searchQuery || "all"}" →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Test Links underneath search bar */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-xs text-slate-300 pt-1">
              <span className="text-slate-400 font-semibold">Quick tests:</span>
              {quickSearches.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSearchQuery(item.query);
                    navigate(`/search?q=${encodeURIComponent(item.query)}`);
                  }}
                  className="hover:text-cyan-300 font-medium transition-colors"
                >
                  {item.label}
                  {idx < quickSearches.length - 1 && <span className="text-slate-600 ml-2.5" aria-hidden="true">•</span>}
                </button>
              ))}
            </div>

            {/* ================= PROMINENT SECONDARY FEATURE: AI SYMPTOM CHECKER ================= */}
            <div className="pt-2">
              <div
                onClick={() => setShowAiModal(true)}
                className="bg-gradient-to-r from-blue-950/90 to-indigo-950/80 border border-cyan-500/30 hover:border-cyan-400/60 rounded-2xl p-4 shadow-lg cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group backdrop-blur-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-cyan-500/20 text-cyan-300 p-2 rounded-xl mt-0.5 group-hover:scale-105 transition-transform">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Not sure which test you need?
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Describe your symptoms and get guidance on relevant tests.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 group-hover:text-white shrink-0 sm:self-center">
                  <span>Ask AI →</span>
                </div>
              </div>
            </div>

            {/* ================= TRUST SIGNALS STRIP WITH BADGES & ICONS ================= */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 hover:border-cyan-500/40 text-slate-200 transition-colors shadow-xs">
                  <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Shield className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold leading-tight text-white">
                    NABL-Accredited <span className="hidden lg:inline text-slate-400 font-normal">Labs</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 hover:border-cyan-500/40 text-slate-200 transition-colors shadow-xs">
                  <div className="p-1 rounded-md bg-cyan-500/20 text-cyan-400 shrink-0">
                    <HomeIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold leading-tight text-white">
                    Home Collection <span className="hidden lg:inline text-slate-400 font-normal">Free</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 hover:border-cyan-500/40 text-slate-200 transition-colors shadow-xs">
                  <div className="p-1 rounded-md bg-blue-500/20 text-blue-400 shrink-0">
                    <FileText className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold leading-tight text-white">
                    Digital Reports <span className="hidden lg:inline text-slate-400 font-normal">in 24h</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 hover:border-cyan-500/40 text-slate-200 transition-colors shadow-xs">
                  <div className="p-1 rounded-md bg-amber-500/20 text-amber-400 shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold leading-tight text-white">
                    Transparent Pricing <span className="hidden lg:inline text-slate-400 font-normal">Zero Hidden</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUICK SERVICE BAR ================= */}
      {/* Light clinical base (White + Light Slate) */}
      <section className="relative -mt-6 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 md:p-6 flex flex-col md:flex-row justify-around items-center gap-4 md:gap-8">
          <div
            className="flex items-center gap-4 cursor-pointer group w-full md:w-auto justify-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="bg-blue-50 p-3.5 rounded-2xl text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                Upload Prescription
              </h3>
              <p className="text-xs text-slate-500">We verify & schedule required tests</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  alert(`Prescription ${e.target.files[0].name} uploaded successfully! Our team in Pune will coordinate your sample collection.`);
                  e.target.value = "";
                }
              }}
            />
          </div>

          <div className="hidden md:block w-px h-10 bg-slate-200" />

          <div
            className="flex items-center gap-4 cursor-pointer group w-full md:w-auto justify-center"
            onClick={() => navigate("/search?type=packages")}
          >
            <div className="bg-emerald-50 p-3.5 rounded-2xl text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <HomeIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-sm">
                Home Sample Collection
              </h3>
              <p className="text-xs text-slate-500">Free door-step sample pickup in Pune</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-slate-200" />

          <div
            className="flex items-center gap-4 cursor-pointer group w-full md:w-auto justify-center"
            onClick={() => navigate("/records")}
          >
            <div className="bg-cyan-50 p-3.5 rounded-2xl text-cyan-800 group-hover:bg-cyan-700 group-hover:text-white transition-colors">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-cyan-800 transition-colors text-sm">
                Download E-Reports
              </h3>
              <p className="text-xs text-slate-500">Authenticated MD-signed PDF records</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CLINICAL QUALITY PILLARS ================= */}
      <section className="py-16 bg-slate-50/60 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-blue-700 uppercase tracking-widest">Clinical Quality Standards</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Why Pune Families Trust Shree Healthcare
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Every sample undergoes automated dual-analyzer verification with senior pathologist sign-off.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Shield className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Accredited Laboratory Infrastructure</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Partnered exclusively with NABL & CAP certified laboratories operating high-throughput Roche & Beckman
                Coulter systems.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
                <Clock className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Free Doorstep Collection</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trained phlebotomists collect blood & urine samples in sterile vacuum vials with temperature-controlled cold
                chain.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <Award className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Doctor-Signed Digital Reports</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fast digital report turnaround delivered straight to your email, WhatsApp, and patient records vault.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED HEALTH PACKAGES ================= */}
      <section className="py-16 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="text-xs font-bold text-blue-700 uppercase tracking-widest">Preventive Health</div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Featured Health Packages</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Full-body diagnostic screenings designed for every age group in your family.
              </p>
            </div>
            <Link
              to="/search?type=packages"
              className="hidden md:flex items-center text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              View All Packages <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    {pkg.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h4 className="text-lg font-bold text-slate-900">{pkg.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-blue-600" /> Includes {pkg.tests} Clinical Biomarkers
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">₹{pkg.price}</span>
                      <span className="text-xs text-slate-400 line-through">₹{pkg.originalPrice}</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700">{pkg.discount}</span>
                  </div>

                  <Link
                    to={`/book/${pkg.id}`}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ABOUT SHREE HEALTHCARE DIAGNOSTICS ================= */}
      <section id="about-shree" className="py-20 bg-slate-50/80 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <Shield className="h-3.5 w-3.5" /> About Shree Healthcare Diagnostics
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Pune's Dedicated Partner for Timely, Clinically Exact Diagnostics.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Founded with a commitment to bridge patient convenience and clinical precision,{" "}
                <strong>Shree Healthcare Diagnostics</strong> provides comprehensive pathology, biochemistry, and
                preventive health screenings across Pune, Pimpri-Chinchwad, and Western Maharashtra.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                We believe that reliable diagnostic reports are the foundation of sound medical decisions. Our services
                combine certified phlebotomy at your doorstep, cold-chain sample preservation, and automated analysis
                powered by audited partner laboratories.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                  <div className="font-extrabold text-slate-900 text-base">50,000+</div>
                  <div className="text-slate-500 font-medium">Patients Served in Pune</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                  <div className="font-extrabold text-slate-900 text-base">100%</div>
                  <div className="text-slate-500 font-medium">Accredited Infrastructure</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" /> The Shree Healthcare Commitment
              </h3>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Gentle, Certified Phlebotomists</h4>
                    <p className="mt-0.5">Every sample is drawn using single-use vacuum vials with barcoding at bedside.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Direct Pathologist Review</h4>
                    <p className="mt-0.5">Clinical correlations reviewed and signed by MD Pathologists before release.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Transparent & Fair Pricing</h4>
                    <p className="mt-0.5">No hidden charges. Senior citizen benefits and free home collection across Pune.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Need support? Call 020-2553-9000</span>
                <Link
                  to="/search"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs"
                >
                  Explore All Tests
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ACCREDITED PARTNER LABS INFRASTRUCTURE ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            Infrastructure Network
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-8">
            Audited Partner Laboratories in Pune & PCMC
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {SEARCHABLE_LABS.map((lab) => (
              <div
                key={lab.id}
                onClick={() => navigate(`/labs/${lab.id}`)}
                className="p-5 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer bg-slate-50/50 flex flex-col items-center justify-between text-center space-y-2 group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base group-hover:scale-105 transition-transform">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {lab.name}
                  </h4>
                  <div className="flex items-center justify-center gap-1 text-xs text-amber-500 font-semibold mt-1">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>{lab.rating}</span>
                    <span className="text-slate-400">({lab.reviews})</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{lab.area}, {lab.city}</p>
                </div>
                <span className="text-xs font-bold text-blue-600 group-hover:underline pt-2">
                  View Laboratory & Tests →
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= AI SUGGESTION MODAL ================= */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 text-slate-900"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
                <div className="flex items-center gap-2 font-bold text-base">
                  <Sparkles className="h-5 w-5 text-cyan-300" />
                  AI Clinical Guidance Checker
                </div>
                <button
                  onClick={() => {
                    setShowAiModal(false);
                    setAiSuggestion(null);
                    setSymptoms("");
                  }}
                  className="text-slate-300 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-slate-600 text-xs sm:text-sm">
                  Describe what symptoms or concerns you or your family member are experiencing. Our intelligent clinical
                  guide will suggest relevant diagnostic panels.
                </p>

                <textarea
                  className="w-full border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-xs sm:text-sm"
                  rows={4}
                  placeholder="E.g., Feeling constant fatigue, muscle aches, mild fever, and increased thirst for 4 days..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />

                {aiSuggestion && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 border border-blue-200 rounded-2xl p-4"
                  >
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                      Recommended Diagnostic Investigation:
                    </span>
                    <div className="text-base font-extrabold text-slate-900">{aiSuggestion}</div>
                  </motion.div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  {aiSuggestion ? (
                    <button
                      onClick={() => {
                        setShowAiModal(false);
                        navigate(`/search?q=${encodeURIComponent(aiSuggestion)}`);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors text-xs sm:text-sm flex items-center gap-1.5"
                    >
                      Search this Test & Book <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleAiSuggest}
                      disabled={!symptoms.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold transition-colors text-xs sm:text-sm"
                    >
                      Get Test Recommendation
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
