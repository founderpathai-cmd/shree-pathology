import express from "express";
import mongoose from "mongoose";
import { Test } from "../models/Test";

const router = express.Router();

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
}

export interface TestWithPricing {
  _id: string;
  id: string;
  name: string;
  description: string;
  type: "test" | "package";
  category: string;
  fastingRequired: boolean;
  parameters: string[];
  isActive: boolean;
  // Primary default lab info
  lab: {
    _id: string;
    id: string;
    name: string;
    rating: number;
    address: string;
    city: string;
  };
  price: number;
  originalPrice: number;
  reportTime: string;
  // Multi-lab pricing list
  labPricing: LabPriceEntry[];
}

const FALLBACK_TESTS: TestWithPricing[] = [
  {
    _id: "t1",
    id: "t1",
    name: "Complete Blood Count (CBC)",
    description: "Measures RBC, WBC, Hemoglobin, Hematocrit, and Platelets to evaluate cellular immunity, anemia, and infections.",
    type: "test",
    category: "Hematology & Routine",
    price: 349,
    originalPrice: 500,
    fastingRequired: false,
    reportTime: "24 Hours",
    parameters: ["Red Blood Cells (RBC)", "White Blood Cells (WBC)", "Hemoglobin", "Hematocrit (PCV)", "Platelet Count", "MCV, MCH, MCHC"],
    isActive: true,
    lab: {
      _id: "l1",
      id: "l1",
      name: "Diagnopein Diagnostics",
      rating: 4.8,
      address: "Baner & Aundh, Pune",
      city: "Pune"
    },
    labPricing: [
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
        notes: "NABL Accredited · Roche Cobas analyzer"
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
        notes: "Robotic barcode handling"
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
        notes: "Express turnaround available"
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
        notes: "Hospital grade CAP accredited"
      }
    ]
  },
  {
    _id: "t2",
    id: "t2",
    name: "Lipid Profile (Cholesterol)",
    description: "Evaluates Total Cholesterol, HDL, LDL, VLDL, and Triglycerides to calculate cardiovascular risk indices.",
    type: "test",
    category: "Cardiology & Lipids",
    price: 549,
    originalPrice: 800,
    fastingRequired: true,
    reportTime: "24 Hours",
    parameters: ["Total Cholesterol", "HDL (Good Cholesterol)", "LDL (Bad Cholesterol)", "Triglycerides", "VLDL Cholesterol", "Cholesterol/HDL Ratio"],
    isActive: true,
    lab: {
      _id: "l2",
      id: "l2",
      name: "Krsnaa Diagnostics",
      rating: 4.6,
      address: "Wakad & Hinjawadi, Pune",
      city: "Pune"
    },
    labPricing: [
      {
        labId: "l1",
        labName: "Diagnopein Diagnostics",
        labRating: 4.8,
        labAddress: "Baner & Aundh, Pune",
        price: 599,
        originalPrice: 850,
        reportTime: "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "High accuracy enzymatic assay"
      },
      {
        labId: "l2",
        labName: "Krsnaa Diagnostics",
        labRating: 4.6,
        labAddress: "Wakad & Hinjawadi, Pune",
        price: 549,
        originalPrice: 800,
        reportTime: "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Best Value Cardiac Screen"
      },
      {
        labId: "l3",
        labName: "General Diagnostics International",
        labRating: 4.7,
        labAddress: "Kothrud & Deccan, Pune",
        price: 649,
        originalPrice: 900,
        reportTime: "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Includes extended lipid ratios"
      },
      {
        labId: "l4",
        labName: "Agilus Diagnostics",
        labRating: 4.9,
        labAddress: "Pimpri-Chinchwad, Pune",
        price: 699,
        originalPrice: 950,
        reportTime: "18 Hours",
        homeCollectionFee: 50,
        homeCollectionAvailable: true,
        notes: "Direct LDL enzymatic measurement"
      }
    ]
  },
  {
    _id: "t3",
    id: "t3",
    name: "Thyroid Profile (T3, T4, TSH)",
    description: "Evaluates thyroid gland hormone secretion to detect hyperthyroidism, hypothyroidism, and endocrine fatigue.",
    type: "test",
    category: "Endocrinology",
    price: 449,
    originalPrice: 700,
    fastingRequired: false,
    reportTime: "24 Hours",
    parameters: ["Total Triiodothyronine (T3)", "Total Thyroxine (T4)", "Thyroid Stimulating Hormone (TSH)"],
    isActive: true,
    lab: {
      _id: "l1",
      id: "l1",
      name: "Diagnopein Diagnostics",
      rating: 4.8,
      address: "Baner & Aundh, Pune",
      city: "Pune"
    },
    labPricing: [
      {
        labId: "l1",
        labName: "Diagnopein Diagnostics",
        labRating: 4.8,
        labAddress: "Baner & Aundh, Pune",
        price: 449,
        originalPrice: 700,
        reportTime: "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Chemiluminescence Immunoassay (CLIA)"
      },
      {
        labId: "l2",
        labName: "Krsnaa Diagnostics",
        labRating: 4.6,
        labAddress: "Wakad & Hinjawadi, Pune",
        price: 499,
        originalPrice: 750,
        reportTime: "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Automated ultrasensitive TSH"
      },
      {
        labId: "l3",
        labName: "General Diagnostics International",
        labRating: 4.7,
        labAddress: "Kothrud & Deccan, Pune",
        price: 520,
        originalPrice: 800,
        reportTime: "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Same day result options"
      },
      {
        labId: "l4",
        labName: "Agilus Diagnostics",
        labRating: 4.9,
        labAddress: "Pimpri-Chinchwad, Pune",
        price: 599,
        originalPrice: 850,
        reportTime: "18 Hours",
        homeCollectionFee: 50,
        homeCollectionAvailable: true,
        notes: "3rd generation high-sensitivity assay"
      }
    ]
  },
  {
    _id: "t4",
    id: "t4",
    name: "HbA1c (Glycated Hemoglobin)",
    description: "Assesses average 3-month blood sugar control for diabetic monitoring and pre-diabetes screening.",
    type: "test",
    category: "Diabetes Care",
    price: 399,
    originalPrice: 650,
    fastingRequired: false,
    reportTime: "24 Hours",
    parameters: ["HbA1c Percentage", "Estimated Average Glucose (eAG)"],
    isActive: true,
    lab: {
      _id: "l3",
      id: "l3",
      name: "General Diagnostics",
      rating: 4.7,
      address: "Kothrud & Deccan, Pune",
      city: "Pune"
    },
    labPricing: [
      {
        labId: "l1",
        labName: "Diagnopein Diagnostics",
        labRating: 4.8,
        labAddress: "Baner & Aundh, Pune",
        price: 450,
        originalPrice: 650,
        reportTime: "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "HPLC gold standard method"
      },
      {
        labId: "l2",
        labName: "Krsnaa Diagnostics",
        labRating: 4.6,
        labAddress: "Wakad & Hinjawadi, Pune",
        price: 420,
        originalPrice: 600,
        reportTime: "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Ion-exchange HPLC"
      },
      {
        labId: "l3",
        labName: "General Diagnostics International",
        labRating: 4.7,
        labAddress: "Kothrud & Deccan, Pune",
        price: 399,
        originalPrice: 650,
        reportTime: "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "NGSP & IFCC certified standard"
      },
      {
        labId: "l4",
        labName: "Agilus Diagnostics",
        labRating: 4.9,
        labAddress: "Pimpri-Chinchwad, Pune",
        price: 499,
        originalPrice: 700,
        reportTime: "18 Hours",
        homeCollectionFee: 50,
        homeCollectionAvailable: true,
        notes: "Bio-Rad D-10 HPLC methodology"
      }
    ]
  },
  {
    _id: "t5",
    id: "t5",
    name: "Liver Function Test (LFT)",
    description: "Measures enzymes, proteins, and bilirubin to screen for liver inflammation, drug toxicity, or hepatitis.",
    type: "test",
    category: "Hepatic & Digestive",
    price: 599,
    originalPrice: 900,
    fastingRequired: true,
    reportTime: "24 Hours",
    parameters: ["SGOT/AST", "SGPT/ALT", "Bilirubin Total/Direct", "Alkaline Phosphatase", "Total Protein", "Albumin/Globulin Ratio"],
    isActive: true,
    lab: {
      _id: "l2",
      id: "l2",
      name: "Krsnaa Diagnostics",
      rating: 4.6,
      address: "Wakad & Hinjawadi, Pune",
      city: "Pune"
    },
    labPricing: [
      {
        labId: "l1",
        labName: "Diagnopein Diagnostics",
        labRating: 4.8,
        labAddress: "Baner & Aundh, Pune",
        price: 650,
        originalPrice: 900,
        reportTime: "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "11 parameter liver breakdown"
      },
      {
        labId: "l2",
        labName: "Krsnaa Diagnostics",
        labRating: 4.6,
        labAddress: "Wakad & Hinjawadi, Pune",
        price: 599,
        originalPrice: 850,
        reportTime: "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Automated Roche dual verify"
      },
      {
        labId: "l3",
        labName: "General Diagnostics International",
        labRating: 4.7,
        labAddress: "Kothrud & Deccan, Pune",
        price: 640,
        originalPrice: 900,
        reportTime: "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Includes gamma-GT"
      },
      {
        labId: "l4",
        labName: "Agilus Diagnostics",
        labRating: 4.9,
        labAddress: "Pimpri-Chinchwad, Pune",
        price: 749,
        originalPrice: 1000,
        reportTime: "18 Hours",
        homeCollectionFee: 50,
        homeCollectionAvailable: true,
        notes: "Comprehensive hepatic biochemistry"
      }
    ]
  },
  {
    _id: "t6",
    id: "t6",
    name: "Vitamin D3 (25-OH) & B12 Combo",
    description: "Measures 25-Hydroxy Vitamin D and Cyanocobalamin B12 to identify fatigue, bone pain, and nerve tingling.",
    type: "test",
    category: "Vitamins & Fatigue",
    price: 899,
    originalPrice: 1600,
    fastingRequired: false,
    reportTime: "24 Hours",
    parameters: ["25-Hydroxy Vitamin D3", "Vitamin B12 (Cyanocobalamin)"],
    isActive: true,
    lab: {
      _id: "l1",
      id: "l1",
      name: "Diagnopein Diagnostics",
      rating: 4.8,
      address: "Baner & Aundh, Pune",
      city: "Pune"
    },
    labPricing: [
      {
        labId: "l1",
        labName: "Diagnopein Diagnostics",
        labRating: 4.8,
        labAddress: "Baner & Aundh, Pune",
        price: 899,
        originalPrice: 1600,
        reportTime: "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Best seller combo offer"
      },
      {
        labId: "l2",
        labName: "Krsnaa Diagnostics",
        labRating: 4.6,
        labAddress: "Wakad & Hinjawadi, Pune",
        price: 949,
        originalPrice: 1700,
        reportTime: "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "ECLIA Chemiluminescence"
      },
      {
        labId: "l3",
        labName: "General Diagnostics International",
        labRating: 4.7,
        labAddress: "Kothrud & Deccan, Pune",
        price: 999,
        originalPrice: 1800,
        reportTime: "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Standard reference methodology"
      },
      {
        labId: "l4",
        labName: "Agilus Diagnostics",
        labRating: 4.9,
        labAddress: "Pimpri-Chinchwad, Pune",
        price: 1199,
        originalPrice: 2000,
        reportTime: "24 Hours",
        homeCollectionFee: 50,
        homeCollectionAvailable: true,
        notes: "High precision tandem mass spec"
      }
    ]
  },
  {
    _id: "pkg1",
    id: "pkg1",
    name: "Comprehensive Full Body Checkup",
    description: "Complete 85-parameter health assessment including heart, liver, kidney, thyroid, sugar, and hemogram.",
    type: "package",
    category: "Preventive Health",
    price: 2199,
    originalPrice: 4999,
    fastingRequired: true,
    reportTime: "36 Hours",
    parameters: ["Complete Hemogram (24)", "Lipid Profile (8)", "Liver Function (11)", "Kidney Function (10)", "Thyroid Profile (3)", "Diabetic Screen (2)", "Urine Routine (20)", "Electrolytes (7)"],
    isActive: true,
    lab: {
      _id: "l1",
      id: "l1",
      name: "Diagnopein Diagnostics",
      rating: 4.8,
      address: "Baner & Aundh, Pune",
      city: "Pune"
    },
    labPricing: [
      {
        labId: "l1",
        labName: "Diagnopein Diagnostics",
        labRating: 4.8,
        labAddress: "Baner & Aundh, Pune",
        price: 2199,
        originalPrice: 4999,
        reportTime: "24-36 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Includes 85 Vital Biomarkers"
      },
      {
        labId: "l2",
        labName: "Krsnaa Diagnostics",
        labRating: 4.6,
        labAddress: "Wakad & Hinjawadi, Pune",
        price: 2499,
        originalPrice: 5200,
        reportTime: "36 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Includes Doctor consultation"
      },
      {
        labId: "l3",
        labName: "General Diagnostics International",
        labRating: 4.7,
        labAddress: "Kothrud & Deccan, Pune",
        price: 2599,
        originalPrice: 5500,
        reportTime: "36 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Includes Vitamin D & B12 addon"
      },
      {
        labId: "l4",
        labName: "Agilus Diagnostics",
        labRating: 4.9,
        labAddress: "Pimpri-Chinchwad, Pune",
        price: 2799,
        originalPrice: 6000,
        reportTime: "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Hospital grade comprehensive panel"
      }
    ]
  },
  {
    _id: "pkg2",
    id: "pkg2",
    name: "Advanced Heart Care Package",
    description: "Tailored cardiac screening with high-sensitivity CRP, lipid panel, blood sugar, and kidney parameters.",
    type: "package",
    category: "Cardiac Health",
    price: 1899,
    originalPrice: 3500,
    fastingRequired: true,
    reportTime: "24 Hours",
    parameters: ["High-Sensitivity CRP (hs-CRP)", "Lipid Profile Extended", "HbA1c", "Serum Creatinine", "Apolipoprotein A1 & B"],
    isActive: true,
    lab: {
      _id: "l3",
      id: "l3",
      name: "General Diagnostics",
      rating: 4.7,
      address: "Kothrud & Deccan, Pune",
      city: "Pune"
    },
    labPricing: [
      {
        labId: "l1",
        labName: "Diagnopein Diagnostics",
        labRating: 4.8,
        labAddress: "Baner & Aundh, Pune",
        price: 1999,
        originalPrice: 3500,
        reportTime: "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Full lipid & inflammation index"
      },
      {
        labId: "l2",
        labName: "Krsnaa Diagnostics",
        labRating: 4.6,
        labAddress: "Wakad & Hinjawadi, Pune",
        price: 1899,
        originalPrice: 3400,
        reportTime: "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Best value cardiac evaluation"
      },
      {
        labId: "l3",
        labName: "General Diagnostics International",
        labRating: 4.7,
        labAddress: "Kothrud & Deccan, Pune",
        price: 2099,
        originalPrice: 3800,
        reportTime: "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Includes Homocysteine assessment"
      },
      {
        labId: "l4",
        labName: "Agilus Diagnostics",
        labRating: 4.9,
        labAddress: "Pimpri-Chinchwad, Pune",
        price: 2399,
        originalPrice: 4200,
        reportTime: "24 Hours",
        homeCollectionFee: 50,
        homeCollectionAvailable: true,
        notes: "Includes ECG & Cardiologist review"
      }
    ]
  },
  {
    _id: "pkg3",
    id: "pkg3",
    name: "Women's Health & Wellness Package",
    description: "Targeted tests for hormonal balance, bone density markers, iron deficiency, thyroid, and vitamin levels.",
    type: "package",
    category: "Women's Health",
    price: 2699,
    originalPrice: 6000,
    fastingRequired: true,
    reportTime: "36 Hours",
    parameters: ["Vitamin D3 (25-OH)", "Vitamin B12", "Ferritin & Iron Studies", "TSH", "Calcium & Phosphorus", "CBC", "Urine Routine"],
    isActive: true,
    lab: {
      _id: "l2",
      id: "l2",
      name: "Krsnaa Diagnostics",
      rating: 4.6,
      address: "Wakad & Hinjawadi, Pune",
      city: "Pune"
    },
    labPricing: [
      {
        labId: "l1",
        labName: "Diagnopein Diagnostics",
        labRating: 4.8,
        labAddress: "Baner & Aundh, Pune",
        price: 2799,
        originalPrice: 5800,
        reportTime: "36 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Women's hormonal & bone panel"
      },
      {
        labId: "l2",
        labName: "Krsnaa Diagnostics",
        labRating: 4.6,
        labAddress: "Wakad & Hinjawadi, Pune",
        price: 2699,
        originalPrice: 6000,
        reportTime: "36 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Includes Iron & Ferritin studies"
      },
      {
        labId: "l3",
        labName: "General Diagnostics International",
        labRating: 4.7,
        labAddress: "Kothrud & Deccan, Pune",
        price: 2999,
        originalPrice: 6200,
        reportTime: "36 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "With reproductive hormone screen"
      },
      {
        labId: "l4",
        labName: "Agilus Diagnostics",
        labRating: 4.9,
        labAddress: "Pimpri-Chinchwad, Pune",
        price: 3299,
        originalPrice: 6800,
        reportTime: "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Comprehensive female vitality"
      }
    ]
  }
];

// GET: Multi-Lab Pricing Matrix
router.get("/pricing-matrix", (req, res) => {
  try {
    const { labId, q, type } = req.query;
    let list = [...FALLBACK_TESTS];

    if (q) {
      const qLower = String(q).toLowerCase();
      list = list.filter(t => t.name.toLowerCase().includes(qLower) || t.category.toLowerCase().includes(qLower));
    }

    if (type && type !== "all") {
      const cleanType = String(type).replace(/s$/, "");
      list = list.filter(t => t.type === cleanType);
    }

    // If filtered by specific lab, return test info along with that lab's specific price
    if (labId) {
      const labSpecificList = list.map(test => {
        const labEntry = test.labPricing.find(p => p.labId === labId);
        return {
          ...test,
          selectedLabPricing: labEntry || null,
          price: labEntry ? labEntry.price : test.price,
          originalPrice: labEntry ? labEntry.originalPrice : test.originalPrice,
          reportTime: labEntry ? labEntry.reportTime : test.reportTime
        };
      });
      return res.json(labSpecificList);
    }

    res.json(list);
  } catch (error) {
    console.error("Error fetching pricing matrix:", error);
    res.status(500).json({ message: "Error fetching pricing matrix" });
  }
});

// GET: All tests
router.get("/", async (req, res) => {
  try {
    const { q, type, labId } = req.query;

    if (mongoose.connection.readyState === 1) {
      try {
        let filter: any = { isActive: true };
        if (q) filter.$text = { $search: String(q) };
        if (type && type !== "all") filter.type = String(type).replace('s', '');
        if (labId) filter.lab = labId;

        const results = await Test.find(filter)
          .populate("lab", "name rating address city")
          .sort({ createdAt: -1 });
        return res.json(results);
      } catch (dbErr) {
        console.warn("MongoDB tests fetch failed, using fallback:", dbErr);
      }
    }

    let filtered = [...FALLBACK_TESTS];
    if (q) {
      const queryLower = String(q).toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(queryLower) || 
        t.description.toLowerCase().includes(queryLower) ||
        t.category.toLowerCase().includes(queryLower)
      );
    }
    if (type && type !== "all") {
      const cleanType = String(type).replace(/s$/, "");
      filtered = filtered.filter(t => t.type === cleanType);
    }
    if (labId) {
      filtered = filtered.filter(t => 
        t.lab?._id === labId || 
        t.lab?.id === labId ||
        t.labPricing?.some(p => p.labId === labId)
      );
    }

    res.json(filtered);
  } catch (error) {
    console.error("Fetch Tests Error:", error);
    res.status(500).json({ message: "Server error fetching tests" });
  }
});

// GET: Single test by ID with full lab-by-lab price comparison
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (mongoose.connection.readyState === 1) {
      try {
        const test = await Test.findById(id).populate("lab");
        if (test) return res.json(test);
      } catch {
        // Fallback
      }
    }

    const found = FALLBACK_TESTS.find(t => t.id === id || t._id === id);
    if (!found) return res.status(404).json({ message: "Test not found" });

    res.json(found);
  } catch (error) {
    console.error("Fetch Test Detail Error:", error);
    res.status(500).json({ message: "Server error fetching test details" });
  }
});

// GET: Lab-specific price list for a specific test
router.get("/:id/lab-pricing", (req, res) => {
  const id = req.params.id;
  const test = FALLBACK_TESTS.find(t => t.id === id || t._id === id);
  if (!test) return res.status(404).json({ message: "Test not found" });
  res.json({
    testId: test.id,
    testName: test.name,
    category: test.category,
    labPricing: test.labPricing
  });
});

// PUT: Update or add a lab's price for a specific test
router.put("/:testId/lab-pricing/:labId", (req, res) => {
  try {
    const { testId, labId } = req.params;
    const { price, originalPrice, reportTime, homeCollectionFee, notes, labName, labRating, labAddress } = req.body;

    const test = FALLBACK_TESTS.find(t => t.id === testId || t._id === testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    let labEntry = test.labPricing.find(p => p.labId === labId);

    if (labEntry) {
      // Update existing lab pricing
      if (price !== undefined) labEntry.price = Number(price);
      if (originalPrice !== undefined) labEntry.originalPrice = Number(originalPrice);
      if (reportTime !== undefined) labEntry.reportTime = String(reportTime);
      if (homeCollectionFee !== undefined) labEntry.homeCollectionFee = Number(homeCollectionFee);
      if (notes !== undefined) labEntry.notes = String(notes);
    } else {
      // Add new lab pricing entry for this test
      labEntry = {
        labId,
        labName: labName || "Partner Laboratory",
        labRating: labRating || 4.7,
        labAddress: labAddress || "Pune, Maharashtra",
        price: Number(price) || test.price,
        originalPrice: Number(originalPrice) || (Number(price) ? Number(price) * 1.3 : test.originalPrice),
        reportTime: reportTime || "24 Hours",
        homeCollectionFee: Number(homeCollectionFee) || 0,
        homeCollectionAvailable: true,
        notes: notes || "Configured by Admin"
      };
      test.labPricing.push(labEntry);
    }

    // Keep base price in sync with lowest price
    const minPrice = Math.min(...test.labPricing.map(p => p.price));
    test.price = minPrice;

    res.json({
      message: `Updated pricing for ${test.name} at lab ${labId}`,
      test
    });
  } catch (error) {
    console.error("Error updating lab pricing:", error);
    res.status(500).json({ message: "Server error updating lab pricing" });
  }
});

// POST: Add new test with lab pricing list
router.post("/", async (req, res) => {
  try {
    const { name, description, type, category, price, originalPrice, parameters, fastingRequired, reportTime, labPricing, lab } = req.body;

    const newId = `t_${Date.now()}`;
    const defaultLabPricing = labPricing && labPricing.length > 0 ? labPricing : [
      {
        labId: lab?.id || "l1",
        labName: lab?.name || "Diagnopein Diagnostics",
        labRating: lab?.rating || 4.8,
        labAddress: lab?.address || "Baner, Pune",
        price: Number(price) || 499,
        originalPrice: Number(originalPrice) || 750,
        reportTime: reportTime || "24 Hours",
        homeCollectionFee: 0,
        homeCollectionAvailable: true,
        notes: "Primary listing"
      }
    ];

    const newTest: TestWithPricing = {
      _id: newId,
      id: newId,
      name: name || "New Medical Test",
      description: description || "Diagnostic screening parameter",
      type: type || "test",
      category: category || "Routine Pathology",
      price: Number(price) || defaultLabPricing[0].price,
      originalPrice: Number(originalPrice) || defaultLabPricing[0].originalPrice,
      fastingRequired: Boolean(fastingRequired),
      reportTime: reportTime || "24 Hours",
      parameters: Array.isArray(parameters) ? parameters : (parameters ? [parameters] : ["Standard Parameter"]),
      isActive: true,
      lab: lab || {
        _id: "l1",
        id: "l1",
        name: "Diagnopein Diagnostics",
        rating: 4.8,
        address: "Baner & Aundh, Pune",
        city: "Pune"
      },
      labPricing: defaultLabPricing
    };

    FALLBACK_TESTS.unshift(newTest);
    res.status(201).json(newTest);
  } catch (error) {
    console.error("Error creating test:", error);
    res.status(400).json({ message: "Error creating test" });
  }
});

export default router;
