import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  Shield,
  Star,
  Zap,
  ArrowRight,
  Beaker,
  Building2,
  Sparkles,
  RefreshCw,
  Scale,
  Award
} from "lucide-react";

export interface LabPriceEntry {
  labId: string;
  labName: string;
  labRating: number;
  labAddress: string;
  price: number;
  originalPrice: number;
  reportTime: string;
  homeCollectionFee: number;
  homeCollectionAvailable: boolean;
  notes?: string;
  accreditation?: string;
}

export interface LabComparisonTableProps {
  testId?: string;
  testName?: string;
  labPricing?: LabPriceEntry[];
  initialSelectedLabIds?: string[];
  allowTestSwitch?: boolean;
  onBookLab?: (labId: string, testId: string) => void;
  className?: string;
  title?: string;
  description?: string;
}

interface TestOption {
  id: string;
  name: string;
  category: string;
  basePrice: number;
}

const DEFAULT_LAB_PRICING: LabPriceEntry[] = [
  {
    labId: "l1",
    labName: "Diagnopein Diagnostics",
    labRating: 4.8,
    labAddress: "Baner & Aundh, Pune",
    price: 349,
    originalPrice: 500,
    reportTime: "24 Hours",
    homeCollectionFee: 0,
    homeCollectionAvailable: true,
    notes: "NABL Accredited · Roche Cobas 6000 Analyzer",
    accreditation: "NABL Accredited",
  },
  {
    labId: "l2",
    labName: "Krsnaa Diagnostics",
    labRating: 4.6,
    labAddress: "Wakad & Hinjawadi, Pune",
    price: 399,
    originalPrice: 550,
    reportTime: "24 Hours",
    homeCollectionFee: 0,
    homeCollectionAvailable: true,
    notes: "Robotic Barcode Handling · High throughput",
    accreditation: "NABL Certified",
  },
  {
    labId: "l3",
    labName: "General Diagnostics International",
    labRating: 4.7,
    labAddress: "Kothrud & Deccan, Pune",
    price: 420,
    originalPrice: 600,
    reportTime: "12 Hours (Same Day)",
    homeCollectionFee: 0,
    homeCollectionAvailable: true,
    notes: "Express Same-Day Turnaround · Abbott Architect",
    accreditation: "NABL & CAP Certified",
  },
  {
    labId: "l4",
    labName: "Agilus Diagnostics",
    labRating: 4.9,
    labAddress: "Pimpri-Chinchwad, Pune",
    price: 499,
    originalPrice: 650,
    reportTime: "18 Hours",
    homeCollectionFee: 50,
    homeCollectionAvailable: true,
    notes: "Gold Standard Pathology · Automated track systems",
    accreditation: "NABL & CAP Accredited",
  },
];

const POPULAR_TESTS: TestOption[] = [
  { id: "t1", name: "Complete Blood Count (CBC)", category: "Hematology", basePrice: 349 },
  { id: "t2", name: "Lipid Profile (Cholesterol Panel)", category: "Cardiology", basePrice: 499 },
  { id: "t3", name: "Thyroid Profile (T3, T4, TSH)", category: "Endocrinology", basePrice: 449 },
  { id: "t4", name: "Diabetes Screening (HbA1c & Fasting)", category: "Diabetology", basePrice: 420 },
  { id: "t5", name: "Liver Function Test (LFT)", category: "Biochemistry", basePrice: 599 },
  { id: "p1", name: "Comprehensive Full Body Checkup (85+ Tests)", category: "Preventive Care", basePrice: 2199 },
];

export default function LabComparisonTable({
  testId = "t1",
  testName: initialTestName,
  labPricing: initialLabPricing,
  initialSelectedLabIds,
  allowTestSwitch = false,
  onBookLab,
  className = "",
  title = "Compare Partner Laboratories",
  description = "Select multiple labs below to compare real-time test pricing, report turnaround times, and home sample collection fees side-by-side.",
}: LabComparisonTableProps) {
  const navigate = useNavigate();

  const [currentTestId, setCurrentTestId] = useState(testId);
  const [currentTestName, setCurrentTestName] = useState(
    initialTestName || POPULAR_TESTS.find((t) => t.id === testId)?.name || "Diagnostic Test"
  );
  const [allLabs, setAllLabs] = useState<LabPriceEntry[]>(initialLabPricing || DEFAULT_LAB_PRICING);
  const [selectedLabIds, setSelectedLabIds] = useState<string[]>(
    initialSelectedLabIds || (initialLabPricing || DEFAULT_LAB_PRICING).map((l) => l.labId)
  );
  const [loading, setLoading] = useState(false);
  const [highlightDiff, setHighlightDiff] = useState(true);

  // Sync when prop testId or initialLabPricing changes
  useEffect(() => {
    if (testId) {
      setCurrentTestId(testId);
    }
  }, [testId]);

  useEffect(() => {
    if (initialTestName) {
      setCurrentTestName(initialTestName);
    }
  }, [initialTestName]);

  // Fetch live pricing data when currentTestId changes
  useEffect(() => {
    let isMounted = true;

    const fetchTestData = async () => {
      // If caller provided labPricing and testId hasn't changed from original, respect it
      if (initialLabPricing && currentTestId === testId) {
        setAllLabs(initialLabPricing);
        if (!initialSelectedLabIds) {
          setSelectedLabIds(initialLabPricing.map((l) => l.labId));
        }
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/tests/${currentTestId}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            if (data.name) setCurrentTestName(data.name);
            if (data.labPricing && Array.isArray(data.labPricing) && data.labPricing.length > 0) {
              setAllLabs(data.labPricing);
              setSelectedLabIds((prev) => {
                // Keep previously selected labs if still valid, or select all
                const validIds = data.labPricing.map((l: LabPriceEntry) => l.labId);
                const kept = prev.filter((id) => validIds.includes(id));
                return kept.length >= 2 ? kept : validIds;
              });
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch test details for comparison, using fallback", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTestData();

    return () => {
      isMounted = false;
    };
  }, [currentTestId, initialLabPricing, testId]);

  // Toggle selection for a lab
  const toggleLab = (labId: string) => {
    setSelectedLabIds((prev) => {
      if (prev.includes(labId)) {
        return prev.filter((id) => id !== labId);
      } else {
        return [...prev, labId];
      }
    });
  };

  const selectAll = () => {
    setSelectedLabIds(allLabs.map((l) => l.labId));
  };

  const selectCheapestAndFastest = () => {
    if (allLabs.length === 0) return;
    const sortedByPrice = [...allLabs].sort((a, b) => a.price - b.price);
    const sortedByTime = [...allLabs].sort((a, b) => {
      const getHours = (str: string) => {
        const m = str.match(/(\d+)/);
        return m ? parseInt(m[1], 10) : 99;
      };
      return getHours(a.reportTime) - getHours(b.reportTime);
    });

    const cheapest = sortedByPrice[0]?.labId;
    const fastest = sortedByTime[0]?.labId;

    const set = new Set<string>();
    if (cheapest) set.add(cheapest);
    if (fastest) set.add(fastest);

    // If cheapest and fastest are the same lab, pick second cheapest too so we have at least 2
    if (set.size < 2 && sortedByPrice.length > 1) {
      set.add(sortedByPrice[1].labId);
    }

    setSelectedLabIds(Array.from(set));
  };

  // Filter selected labs
  const selectedLabs = useMemo(() => {
    return allLabs.filter((lab) => selectedLabIds.includes(lab.labId));
  }, [allLabs, selectedLabIds]);

  // Calculate lowest price and fastest report time among all labs
  const { lowestPriceLabId, fastestLabId, maxSavings } = useMemo(() => {
    if (allLabs.length === 0) {
      return { lowestPriceLabId: null, fastestLabId: null, maxSavings: 0 };
    }

    let minPrice = Infinity;
    let minPriceId = "";
    let maxPrice = 0;

    let minHours = Infinity;
    let fastestId = "";

    allLabs.forEach((l) => {
      if (l.price < minPrice) {
        minPrice = l.price;
        minPriceId = l.labId;
      }
      if (l.price > maxPrice) {
        maxPrice = l.price;
      }

      const match = l.reportTime.match(/(\d+)/);
      const hours = match ? parseInt(match[1], 10) : 99;
      if (hours < minHours) {
        minHours = hours;
        fastestId = l.labId;
      }
    });

    return {
      lowestPriceLabId: minPriceId,
      fastestLabId: fastestId,
      maxSavings: maxPrice - minPrice,
    };
  }, [allLabs]);

  const handleBook = (labId: string) => {
    if (onBookLab) {
      onBookLab(labId, currentTestId);
    } else {
      navigate(`/book/${currentTestId}?labId=${labId}`);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden ${className}`}
      id="lab-comparison-table"
    >
      {/* Header bar */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-400/30 text-xs font-semibold mb-2">
              <Scale className="h-3.5 w-3.5 text-cyan-400" />
              <span>Multi-Lab Price & Speed Transparency</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              {title}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>

          {/* Quick Stat Pill */}
          {maxSavings > 0 && (
            <div className="bg-emerald-500/15 border border-emerald-400/40 rounded-xl px-4 py-2.5 flex items-center gap-3 shrink-0">
              <Sparkles className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs text-emerald-200 font-medium">Potential Price Difference</div>
                <div className="text-base font-bold text-white">
                  Save up to <span className="text-emerald-300 font-extrabold">₹{maxSavings}</span> for {currentTestName.split(" ")[0]}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Optional Test Selector */}
        {allowTestSwitch && (
          <div className="mt-6 pt-5 border-t border-slate-700/60 flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Beaker className="h-3.5 w-3.5 text-blue-400" /> Select Test:
            </span>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TESTS.map((test) => (
                <button
                  key={test.id}
                  onClick={() => {
                    setCurrentTestId(test.id);
                    setCurrentTestName(test.name);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currentTestId === test.id
                      ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                  }`}
                >
                  {test.name.split("(")[0]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lab Selection Controls */}
      <div className="p-5 md:p-6 bg-slate-50/80 border-b border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Select Laboratories to Compare ({selectedLabs.length} of {allLabs.length} selected):
            </span>
          </div>

          {/* Quick Selection Actions */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={selectAll}
              className="px-2.5 py-1 rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 font-semibold border border-blue-200 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={selectCheapestAndFastest}
              className="px-2.5 py-1 rounded-md text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-semibold border border-emerald-200 transition-colors flex items-center gap-1"
            >
              <Zap className="h-3 w-3 text-emerald-600" /> Compare Best Price vs Speed
            </button>
            <button
              onClick={() => setSelectedLabIds([])}
              className="px-2.5 py-1 rounded-md text-slate-600 hover:bg-slate-200 font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Lab Toggle Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {allLabs.map((lab) => {
            const isSelected = selectedLabIds.includes(lab.labId);
            const isLowestPrice = lab.labId === lowestPriceLabId;
            const isFastest = lab.labId === fastestLabId;

            return (
              <button
                key={lab.labId}
                onClick={() => toggleLab(lab.labId)}
                className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? "bg-white border-blue-500 shadow-sm ring-1 ring-blue-500"
                    : "bg-white/60 border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <div
                  className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-bold truncate ${
                        isSelected ? "text-slate-900" : "text-slate-500"
                      }`}
                    >
                      {lab.labName}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700 shrink-0">
                      ₹{lab.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                    <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-500" />
                      {lab.labRating}
                    </span>
                    <span>•</span>
                    <span className="truncate">{lab.reportTime}</span>
                  </div>

                  {/* Micro highlight badges */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {isLowestPrice && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 leading-none">
                        Lowest Price
                      </span>
                    )}
                    {isFastest && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 leading-none">
                        Fastest
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table / Comparison Content */}
      {selectedLabs.length === 0 ? (
        <div className="p-12 text-center bg-white">
          <div className="h-12 w-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-3">
            <Building2 className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">No laboratories selected</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Select at least 2 labs using the checkboxes above to compare pricing and turnaround times side-by-side.
          </p>
          <button
            onClick={selectAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <CheckCircle2 className="h-4 w-4" /> Select All Labs
          </button>
        </div>
      ) : selectedLabs.length === 1 ? (
        <div className="p-8 text-center bg-blue-50/40 border-b border-blue-100">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-900 bg-blue-100/80 px-3 py-1.5 rounded-full mb-3">
            <Scale className="h-4 w-4 text-blue-600" /> 1 Lab Selected
          </div>
          <p className="text-xs text-slate-600 max-w-md mx-auto mb-3">
            You currently have <strong>{selectedLabs[0].labName}</strong> selected. Add at least one more lab above to view side-by-side comparison differences.
          </p>
          <button
            onClick={selectCheapestAndFastest}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
          >
            <Zap className="h-3.5 w-3.5" /> Compare with Fastest & Lowest Price Labs
          </button>
        </div>
      ) : null}

      {/* Side-by-Side Comparison Table */}
      {selectedLabs.length >= 1 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-700 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 sm:p-5 w-48 sm:w-56 sticky left-0 bg-slate-50/95 z-10 border-r border-slate-200/80 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                    <span>Diagnostic Parameters</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal lowercase tracking-normal mt-0.5">
                    For {currentTestName}
                  </div>
                </th>

                {selectedLabs.map((lab) => {
                  const isLowestPrice = lab.labId === lowestPriceLabId;
                  const isFastest = lab.labId === fastestLabId;

                  return (
                    <th
                      key={lab.labId}
                      className={`p-4 sm:p-5 min-w-[220px] sm:min-w-[250px] align-top transition-colors border-r border-slate-200/80 last:border-r-0 ${
                        isLowestPrice && highlightDiff
                          ? "bg-emerald-50/40"
                          : isFastest && highlightDiff
                          ? "bg-blue-50/40"
                          : "bg-white"
                      }`}
                    >
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              {lab.accreditation || "NABL Verified"}
                            </span>
                            <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                              {lab.labRating}
                            </div>
                          </div>

                          <div className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                            {lab.labName}
                          </div>

                          <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="truncate">{lab.labAddress}</span>
                          </div>
                        </div>

                        {/* Top Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {isLowestPrice && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Best Price
                            </span>
                          )}
                          {isFastest && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                              <Zap className="h-3 w-3 text-blue-600" /> Fastest Delivery
                            </span>
                          )}
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 text-slate-700 text-xs sm:text-sm">
              {/* ROW 1: Test Price */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 sm:p-5 font-bold text-slate-900 sticky left-0 bg-white/95 z-10 border-r border-slate-200/80 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Test Price</span>
                  </div>
                  <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                    Lab specific pricing
                  </span>
                </td>

                {selectedLabs.map((lab) => {
                  const isLowestPrice = lab.labId === lowestPriceLabId;
                  const discount =
                    lab.originalPrice && lab.originalPrice > lab.price
                      ? Math.round(((lab.originalPrice - lab.price) / lab.originalPrice) * 100)
                      : 0;

                  return (
                    <td
                      key={lab.labId}
                      className={`p-4 sm:p-5 border-r border-slate-200/80 last:border-r-0 ${
                        isLowestPrice && highlightDiff ? "bg-emerald-50/30" : ""
                      }`}
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-black text-slate-900">
                          ₹{lab.price}
                        </span>
                        {lab.originalPrice > lab.price && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{lab.originalPrice}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mt-1">
                        {discount > 0 && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {discount}% OFF
                          </span>
                        )}
                        {lab.originalPrice > lab.price && (
                          <span className="text-[11px] text-emerald-700 font-semibold">
                            Save ₹{lab.originalPrice - lab.price}
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* ROW 2: Report Turnaround Time */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 sm:p-5 font-bold text-slate-900 sticky left-0 bg-white/95 z-10 border-r border-slate-200/80 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>Turnaround Time</span>
                  </div>
                  <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                    Report delivery guarantee
                  </span>
                </td>

                {selectedLabs.map((lab) => {
                  const isFastest = lab.labId === fastestLabId;

                  return (
                    <td
                      key={lab.labId}
                      className={`p-4 sm:p-5 border-r border-slate-200/80 last:border-r-0 ${
                        isFastest && highlightDiff ? "bg-blue-50/30" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-black text-sm sm:text-base ${
                            isFastest ? "text-blue-700" : "text-slate-800"
                          }`}
                        >
                          {lab.reportTime}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                        <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                        <span>Digital PDF + WhatsApp delivery</span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* ROW 3: Home Sample Collection */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 sm:p-5 font-bold text-slate-900 sticky left-0 bg-white/95 z-10 border-r border-slate-200/80 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-purple-600" />
                    <span>Home Sample Collection</span>
                  </div>
                  <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                    Doorstep phlebotomist visit
                  </span>
                </td>

                {selectedLabs.map((lab) => (
                  <td key={lab.labId} className="p-4 sm:p-5 border-r border-slate-200/80 last:border-r-0">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      {lab.homeCollectionFee === 0 ? (
                        <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded text-xs font-black">
                          FREE Doorstep Pickup
                        </span>
                      ) : (
                        <span className="text-slate-700 text-xs font-semibold">
                          ₹{lab.homeCollectionFee} Convenience Fee
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Available across Pune & PCMC
                    </div>
                  </td>
                ))}
              </tr>

              {/* ROW 4: Quality & Technology Notes */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 sm:p-5 font-bold text-slate-900 sticky left-0 bg-white/95 z-10 border-r border-slate-200/80 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-cyan-600" />
                    <span>Quality & Technology</span>
                  </div>
                  <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                    Equipment & certifications
                  </span>
                </td>

                {selectedLabs.map((lab) => (
                  <td key={lab.labId} className="p-4 sm:p-5 border-r border-slate-200/80 last:border-r-0">
                    <div className="text-xs font-medium text-slate-700 leading-snug">
                      {lab.notes || "High precision automated testing protocol with barcoded vacutainers."}
                    </div>
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 mt-1.5">
                      <Award className="h-3 w-3" /> NABL Quality Calibrated
                    </div>
                  </td>
                ))}
              </tr>

              {/* ROW 5: Lab Rating & Customer Reviews */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 sm:p-5 font-bold text-slate-900 sticky left-0 bg-white/95 z-10 border-r border-slate-200/80 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
                    <span>Patient Rating</span>
                  </div>
                  <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                    Verified Pune patient reviews
                  </span>
                </td>

                {selectedLabs.map((lab) => (
                  <td key={lab.labId} className="p-4 sm:p-5 border-r border-slate-200/80 last:border-r-0">
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < Math.floor(lab.labRating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-extrabold text-slate-900 text-xs">
                        {lab.labRating} / 5.0
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Painless phlebotomy verified
                    </div>
                  </td>
                ))}
              </tr>

              {/* ROW 6: Direct Booking Action */}
              <tr className="bg-slate-50/80">
                <td className="p-4 sm:p-5 font-bold text-slate-900 sticky left-0 bg-slate-50/95 z-10 border-r border-slate-200/80 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)]">
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-extrabold">
                    Select & Reserve
                  </span>
                </td>

                {selectedLabs.map((lab) => {
                  const isLowestPrice = lab.labId === lowestPriceLabId;

                  return (
                    <td key={lab.labId} className="p-4 sm:p-5 border-r border-slate-200/80 last:border-r-0">
                      <button
                        onClick={() => handleBook(lab.labId)}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 ${
                          isLowestPrice
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
                        }`}
                      >
                        <span>Book at {lab.labName.split(" ")[0]}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <div className="text-[10px] text-center text-slate-500 mt-1.5">
                        Pre-selects {lab.labName} in checkout
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Comparison Summary & Insights */}
      {selectedLabs.length >= 2 && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-blue-50/40 border-t border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              All partner laboratories are <strong>NABL-accredited</strong> and operate under Shree Healthcare Diagnostics quality guidelines.
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setHighlightDiff(!highlightDiff)}
              className="font-semibold text-blue-700 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              {highlightDiff ? "Hide Color Highlights" : "Show Best Highlights"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
