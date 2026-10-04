import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  ArrowRight,
  Shield,
  Building2,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Beaker,
  ChevronRight
} from "lucide-react";

interface TestItem {
  id: string;
  _id?: string;
  type: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  labsCount?: number;
  fastingRequired?: boolean;
  reportTime?: string;
  parameters?: string[] | number;
  labPricing?: {
    labId: string;
    labName: string;
    price: number;
    originalPrice: number;
    reportTime: string;
  }[];
  lab?: {
    id?: string;
    _id?: string;
    name: string;
    rating: number;
    address: string;
    city: string;
  };
}

interface LabItem {
  id: string;
  _id?: string;
  name: string;
  rating: number;
  reviews?: number;
  reviewsCount?: number;
  distance?: string;
  address: string;
  city: string;
  phone?: string;
  features?: string[];
  testsOfferedCount?: number;
}

const DEFAULT_LABS: LabItem[] = [
  {
    id: "l1",
    name: "Diagnopein Diagnostics",
    rating: 4.8,
    reviewsCount: 1240,
    distance: "1.8 km away",
    address: "Prime Square, Near Balewadi High Street, Baner, Pune",
    city: "Pune",
    features: ["NABL Accredited", "Free Home Collection", "E-Reports in 24h"],
    testsOfferedCount: 180
  },
  {
    id: "l2",
    name: "Krsnaa Diagnostics",
    rating: 4.6,
    reviewsCount: 850,
    distance: "2.5 km away",
    address: "Hinjawadi IT Park Phase 1, Wakad Road, Pune",
    city: "Pune",
    features: ["NABL Accredited", "Home Sample Pickup", "Automated Analyzers"],
    testsOfferedCount: 140
  },
  {
    id: "l3",
    name: "General Diagnostics International",
    rating: 4.7,
    reviewsCount: 2100,
    distance: "3.2 km away",
    address: "Karve Road, Near Paud Phata, Kothrud, Pune",
    city: "Pune",
    features: ["NABL & CAP Certified", "AI-assisted Analysis", "Same-Day Results"],
    testsOfferedCount: 210
  },
  {
    id: "l4",
    name: "Agilus Diagnostics",
    rating: 4.9,
    reviewsCount: 3400,
    distance: "4.1 km away",
    address: "Old Mumbai-Pune Highway, Pimpri-Chinchwad, Pune",
    city: "Pune",
    features: ["Hospital Grade", "NABL Certified", "Priority Processing"],
    testsOfferedCount: 350
  }
];

const DEFAULT_TESTS: TestItem[] = [
  {
    id: "t1",
    type: "test",
    name: "Complete Blood Count (CBC)",
    description: "Measures RBC, WBC, Hemoglobin, Hematocrit, and Platelets to evaluate overall cellular health and detect anemia or infection.",
    price: 399,
    originalPrice: 500,
    labsCount: 4,
    fastingRequired: false,
    reportTime: "24 Hours",
    parameters: 24,
    lab: { id: "l1", name: "Diagnopein Diagnostics", rating: 4.8, address: "Baner & Aundh, Pune", city: "Pune" }
  },
  {
    id: "t2",
    type: "test",
    name: "Lipid Profile (Cholesterol)",
    description: "Measures Total Cholesterol, HDL, LDL, VLDL, and Triglycerides to evaluate heart disease and stroke risk.",
    price: 599,
    originalPrice: 800,
    labsCount: 4,
    fastingRequired: true,
    reportTime: "24 Hours",
    parameters: 8,
    lab: { id: "l2", name: "Krsnaa Diagnostics", rating: 4.6, address: "Wakad & Hinjawadi, Pune", city: "Pune" }
  },
  {
    id: "t3",
    type: "test",
    name: "Thyroid Profile (T3, T4, TSH)",
    description: "Assesses thyroid hormone regulation to detect hypo- and hyper-thyroidism and metabolic concerns.",
    price: 499,
    originalPrice: 700,
    labsCount: 3,
    fastingRequired: false,
    reportTime: "24 Hours",
    parameters: 3,
    lab: { id: "l1", name: "Diagnopein Diagnostics", rating: 4.8, address: "Baner & Aundh, Pune", city: "Pune" }
  },
  {
    id: "t4",
    type: "test",
    name: "HbA1c (Glycated Hemoglobin)",
    description: "Evaluates average 3-month blood sugar control for diabetic monitoring and pre-diabetes screening.",
    price: 450,
    originalPrice: 650,
    labsCount: 4,
    fastingRequired: false,
    reportTime: "24 Hours",
    parameters: 2,
    lab: { id: "l3", name: "General Diagnostics", rating: 4.7, address: "Kothrud & Deccan, Pune", city: "Pune" }
  },
  {
    id: "t5",
    type: "test",
    name: "Liver Function Test (LFT)",
    description: "Screens for liver inflammation, damage, and bile flow with SGOT, SGPT, Bilirubin, and Albumin.",
    price: 650,
    originalPrice: 900,
    labsCount: 3,
    fastingRequired: true,
    reportTime: "24 Hours",
    parameters: 11,
    lab: { id: "l2", name: "Krsnaa Diagnostics", rating: 4.6, address: "Wakad & Hinjawadi, Pune", city: "Pune" }
  },
  {
    id: "pkg1",
    type: "package",
    name: "Comprehensive Full Body Checkup",
    description: "Complete 85-parameter health evaluation covering cardiac, hepatic, renal, thyroid, and diabetic profiles.",
    price: 2499,
    originalPrice: 4999,
    labsCount: 4,
    fastingRequired: true,
    reportTime: "36 Hours",
    parameters: 85,
    lab: { id: "l1", name: "Diagnopein Diagnostics", rating: 4.8, address: "Baner & Aundh, Pune", city: "Pune" }
  },
  {
    id: "pkg2",
    type: "package",
    name: "Advanced Heart Care Package",
    description: "Tailored cardiac screening with high-sensitivity CRP, extended lipid panel, HbA1c, and electrolytes.",
    price: 1999,
    originalPrice: 3500,
    labsCount: 3,
    fastingRequired: true,
    reportTime: "24 Hours",
    parameters: 42,
    lab: { id: "l3", name: "General Diagnostics", rating: 4.7, address: "Kothrud & Deccan, Pune", city: "Pune" }
  },
  {
    id: "pkg3",
    type: "package",
    name: "Women's Health & Wellness Package",
    description: "Specialized screenings for vitamin D, B12, iron deficiency, thyroid markers, calcium, and bone health.",
    price: 2999,
    originalPrice: 6000,
    labsCount: 3,
    fastingRequired: true,
    reportTime: "36 Hours",
    parameters: 64,
    lab: { id: "l2", name: "Krsnaa Diagnostics", rating: 4.6, address: "Wakad & Hinjawadi, Pune", city: "Pune" }
  }
];

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const cityParam = searchParams.get("city") || "";
  const typeFilter = searchParams.get("type") || "all";
  const labIdFilter = searchParams.get("labId") || "";

  const [searchTerm, setSearchTerm] = useState(query);
  const [locationTerm, setLocationTerm] = useState(cityParam || "Pune");
  const [activeView, setActiveView] = useState<"all" | "tests" | "labs">(
    labIdFilter ? "labs" : typeFilter === "packages" ? "tests" : "all"
  );
  const [results, setResults] = useState<TestItem[]>(DEFAULT_TESTS);
  const [matchingLabs, setMatchingLabs] = useState<LabItem[]>(DEFAULT_LABS);
  const [sortBy, setSortBy] = useState<"relevance" | "price_asc" | "price_desc">("relevance");

  const navigate = useNavigate();

  // Fetch tests and labs
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      let baseTests = DEFAULT_TESTS;
      try {
        const res = await fetch("/api/tests/pricing-matrix");
        if (res.ok) {
          const apiTests = await res.json();
          if (Array.isArray(apiTests) && apiTests.length > 0) {
            baseTests = apiTests;
          }
        }
      } catch {
        // use DEFAULT_TESTS
      }

      if (!isMounted) return;

      let filteredTests = [...baseTests];
      let filteredLabs = [...DEFAULT_LABS];

      // Filter by search query
      if (query.trim()) {
        const qLower = query.toLowerCase();
        filteredTests = filteredTests.filter(
          (item) =>
            item.name.toLowerCase().includes(qLower) ||
            item.description.toLowerCase().includes(qLower) ||
            (item.lab?.name && item.lab.name.toLowerCase().includes(qLower))
        );

        filteredLabs = filteredLabs.filter(
          (lab) =>
            lab.name.toLowerCase().includes(qLower) ||
            lab.address.toLowerCase().includes(qLower) ||
            lab.city.toLowerCase().includes(qLower) ||
            filteredTests.length > 0
        );
      }

      // Filter by type
      if (typeFilter !== "all") {
        const clean = typeFilter.replace(/s$/, "");
        filteredTests = filteredTests.filter((t) => t.type === clean);
      }

      // Filter by Lab ID if specified
      if (labIdFilter) {
        filteredTests = filteredTests.filter(
          (t) =>
            t.lab?.id === labIdFilter ||
            t.lab?._id === labIdFilter ||
            t.labPricing?.some((lp) => lp.labId === labIdFilter)
        );
        filteredLabs = filteredLabs.filter(
          (l) => l.id === labIdFilter || l._id === labIdFilter
        );
      }

      // Sorting
      if (sortBy === "price_asc") {
        filteredTests.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price_desc") {
        filteredTests.sort((a, b) => b.price - a.price);
      }

      setResults(filteredTests);
      setMatchingLabs(filteredLabs);
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [query, typeFilter, labIdFilter, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams: Record<string, string> = {};
    if (searchTerm.trim()) newParams.q = searchTerm.trim();
    if (locationTerm.trim()) newParams.city = locationTerm.trim();
    if (typeFilter !== "all") newParams.type = typeFilter;
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header Bar */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            {/* Location Input */}
            <div className="md:w-64 flex items-center px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <MapPin className="h-4 w-4 text-blue-600 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="City / Region"
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-xs font-medium text-slate-900 placeholder-slate-400"
              />
            </div>

            {/* Test / Lab Name Input */}
            <div className="flex-1 flex items-center px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <Search className="h-4 w-4 text-slate-400 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Search medical test (e.g. CBC, Lipid, HbA1c, Thyroid) or laboratory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-xs sm:text-sm text-slate-900 placeholder-slate-400"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-xs shrink-0 flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" /> Find Tests & Labs
            </button>
          </form>
        </div>

        {/* Tab switcher: All, Tests, Relevant Laboratories */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center gap-2 p-1 bg-slate-200/60 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveView("all")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Matches ({results.length + matchingLabs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveView("tests")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === "tests" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Medical Tests ({results.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveView("labs")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === "labs" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Partner Laboratories ({matchingLabs.length})
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-700 outline-none"
            >
              <option value="relevance">Most Relevant</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Search Results Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Filter Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-blue-600" /> Filter Criteria
                </span>
                {(query || typeFilter !== "all" || labIdFilter) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setSearchParams({});
                    }}
                    className="text-[11px] text-rose-600 font-semibold hover:underline"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Category */}
              <div>
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">Category</div>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: "all", label: "All Tests & Packages" },
                    { id: "tests", label: "Single Diagnostic Tests" },
                    { id: "packages", label: "Health Packages" }
                  ].map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900"
                    >
                      <input
                        type="radio"
                        name="typeFilter"
                        checked={typeFilter === cat.id}
                        onChange={() => {
                          const p: Record<string, string> = {};
                          if (query) p.q = query;
                          if (cat.id !== "all") p.type = cat.id;
                          setSearchParams(p);
                        }}
                        className="text-blue-600"
                      />
                      <span>{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Partner Laboratories Direct Filter */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Filter by Lab Partner
                </div>
                <div className="space-y-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      const p: Record<string, string> = {};
                      if (query) p.q = query;
                      if (typeFilter !== "all") p.type = typeFilter;
                      setSearchParams(p);
                    }}
                    className={`w-full text-left py-1 px-2 rounded-md ${
                      !labIdFilter ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    All Partner Labs
                  </button>
                  {DEFAULT_LABS.map((lab) => (
                    <button
                      key={lab.id}
                      type="button"
                      onClick={() => {
                        const p: Record<string, string> = { labId: lab.id };
                        if (query) p.q = query;
                        if (typeFilter !== "all") p.type = typeFilter;
                        setSearchParams(p);
                      }}
                      className={`w-full text-left py-1 px-2 rounded-md truncate ${
                        labIdFilter === lab.id
                          ? "bg-blue-50 text-blue-700 font-bold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {lab.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-blue-600" /> NABL & CAP Accredited
                </div>
                <p className="text-[11px] text-slate-600">
                  Every partner laboratory on Shree Diagnostics undergoes stringent quality verification.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Search Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* If searching for a test, show a banner showing which laboratories perform it */}
            {query && (
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  Showing diagnostic tests matching <strong className="text-slate-900">"{query}"</strong> and{" "}
                  <strong className="text-slate-900">{matchingLabs.length} accredited laboratories</strong> equipped for this screening.
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView(activeView === "labs" ? "tests" : "labs")}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 underline shrink-0"
                >
                  {activeView === "labs" ? "View Matching Tests" : "View Relevant Laboratories"}
                </button>
              </div>
            )}

            {/* RELEVANT LABORATORIES CARDS (Shown in 'all' or 'labs' view) */}
            {(activeView === "all" || activeView === "labs") && matchingLabs.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <Building2 className="h-4 w-4 text-blue-600" /> Relevant Accredited Laboratories ({matchingLabs.length})
                  </h3>
                  <span className="text-xs text-slate-500">Certified for pathology testing & home collection</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {matchingLabs.map((lab) => (
                    <div
                      key={lab.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{lab.name}</h4>
                          <span className="inline-flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md shrink-0">
                            <Star className="h-3 w-3 fill-current mr-1 text-amber-500" />
                            {lab.rating}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate">{lab.address}</span>
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(lab.features || ["NABL Accredited", "Free Home Collection"]).slice(0, 2).map((feat) => (
                            <span
                              key={feat}
                              className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100">
                        <span className="text-xs font-semibold text-emerald-600">Home Collection Available</span>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/labs/${lab.id}`}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline px-2.5 py-1.5"
                          >
                            View Lab Profile
                          </Link>
                          <Link
                            to={`/book/${results[0]?.id || "t1"}`}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors"
                          >
                            Book at this Lab
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MEDICAL TESTS LIST (Shown in 'all' or 'tests' view) */}
            {(activeView === "all" || activeView === "tests") && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <Beaker className="h-4 w-4 text-blue-600" /> Diagnostic Tests & Packages ({results.length})
                  </h3>
                  <span className="text-xs text-slate-500">Compare pricing across partner labs</span>
                </div>

                {results.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                    <Search className="h-10 w-10 text-slate-300 mx-auto" />
                    <h4 className="text-base font-bold text-slate-800">No medical tests matched your search</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Try searching for a test like CBC, Lipid Profile, Thyroid, Full Body Checkup, or browse partner laboratories.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm("");
                        setSearchParams({});
                      }}
                      className="bg-blue-600 text-white text-xs font-bold px-5 py-2 rounded-xl"
                    >
                      Clear Search Filters
                    </button>
                  </div>
                ) : (
                  results.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all space-y-4"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                item.type === "package"
                                  ? "bg-purple-50 text-purple-700 border border-purple-200/50"
                                  : "bg-blue-50 text-blue-700 border border-blue-200/50"
                              }`}
                            >
                              {item.type.toUpperCase()}
                            </span>
                            {item.fastingRequired && (
                              <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                                10-12 hrs Fasting
                              </span>
                            )}
                            <span className="text-xs text-slate-400">·</span>
                            <span className="text-xs text-slate-500">
                              Reports in {item.reportTime || "24 Hours"}
                            </span>
                          </div>

                          <h4 className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors">
                            <Link to={`/item/${item.id}`}>{item.name}</Link>
                          </h4>

                          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{item.description}</p>
                        </div>

                        {/* Price and CTA */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-6 shrink-0">
                          <div className="text-right">
                            <div className="text-[11px] text-slate-400">Starts from</div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-2xl font-black text-slate-900">₹{item.price}</span>
                              {item.originalPrice && (
                                <span className="text-xs text-slate-400 line-through">₹{item.originalPrice}</span>
                              )}
                            </div>
                          </div>

                          <Link
                            to={`/book/${item.id}`}
                            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
                          >
                            Book Test <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>

                      {/* Multi-Lab Price Comparison Strip */}
                      <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 mb-3">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Building2 className="h-4 w-4 text-blue-600" />
                            Compare Lab Pricing & Turnaround Times ({DEFAULT_LABS.length} Certified Labs):
                          </span>
                          <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                            Free Doorstep Sample Collection
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                          {DEFAULT_LABS.map((partnerLab) => {
                            // Calculate lab specific price
                            let labPrice = item.price;
                            let reportTime = item.reportTime || "24 Hours";
                            if (item.labPricing && item.labPricing.length > 0) {
                              const found = item.labPricing.find((lp) => lp.labId === partnerLab.id);
                              if (found) {
                                labPrice = found.price;
                                reportTime = found.reportTime;
                              }
                            } else {
                              if (partnerLab.id === "l1") labPrice = item.price;
                              else if (partnerLab.id === "l2") labPrice = Math.round(item.price * 1.12);
                              else if (partnerLab.id === "l3") labPrice = Math.round(item.price * 1.18);
                              else if (partnerLab.id === "l4") labPrice = Math.round(item.price * 1.25);
                            }

                            const isLowest = labPrice === item.price;

                            return (
                              <div
                                key={partnerLab.id}
                                className={`p-3 rounded-xl border text-xs flex flex-col justify-between space-y-2 transition-all ${
                                  isLowest
                                    ? "bg-white border-emerald-300 shadow-xs ring-1 ring-emerald-500/20"
                                    : "bg-white border-slate-200 hover:border-blue-300"
                                }`}
                              >
                                <div>
                                  <div className="flex items-start justify-between gap-1">
                                    <div className="font-bold text-slate-900 truncate text-xs">{partnerLab.name}</div>
                                    {isLowest && (
                                      <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                        BEST
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-slate-500 text-[10px] flex items-center gap-1 mt-0.5">
                                    <Star className="h-3 w-3 fill-current text-amber-500" />
                                    <span>{partnerLab.rating}</span>
                                    <span>·</span>
                                    <span className="truncate">{partnerLab.address.split(",")[0]}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">Reports in {reportTime}</div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                  <span className="font-black text-slate-900 text-sm">₹{labPrice}</span>
                                  <Link
                                    to={`/book/${item.id}?labId=${partnerLab.id}`}
                                    className="bg-slate-900 hover:bg-blue-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors shadow-xs"
                                  >
                                    Book Here →
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
