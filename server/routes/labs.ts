import express from "express";
import mongoose from "mongoose";
import { Lab } from "../models/Lab";

const router = express.Router();

const FALLBACK_LABS = [
  {
    _id: "l1",
    id: "l1",
    name: "Diagnopein Diagnostics",
    rating: 4.8,
    reviewsCount: 1240,
    distance: "1.8 km",
    address: "Prime Square, Near Balewadi High Street, Baner",
    city: "Pune",
    phone: "+91 020 6720 1200",
    partnerStatus: "active",
    features: ["NABL Accredited", "Free Home Collection", "Digital Reports in 24h", "ISO 9001:2015"],
    about: "Diagnopein is a premier CAP and NABL accredited pathology network equipped with automated Roche and Beckman Coulter analyzers."
  },
  {
    _id: "l2",
    id: "l2",
    name: "Krsnaa Diagnostics",
    rating: 4.6,
    reviewsCount: 850,
    distance: "2.5 km",
    address: "Hinjawadi IT Park Phase 1, Wakad Road",
    city: "Pune",
    phone: "+91 020 2740 5500",
    partnerStatus: "active",
    features: ["NABL Accredited", "Home Collection", "Specialist Doctor Consult", "Barcoded Samples"],
    about: "Krsnaa Diagnostics operates state-of-the-art diagnostic labs nationwide with precision robotic sample processing."
  },
  {
    _id: "l3",
    id: "l3",
    name: "General Diagnostics International",
    rating: 4.7,
    reviewsCount: 2100,
    distance: "3.2 km",
    address: "Karve Road, Near Paud Phata, Kothrud",
    city: "Pune",
    phone: "+91 020 2544 3322",
    partnerStatus: "active",
    features: ["NABL Accredited", "AI-assisted Analysis", "E-Reports", "Same-Day Results"],
    about: "General Diagnostics International provides advanced immunodiagnostics, molecular genetics, and regular preventive checkups."
  },
  {
    _id: "l4",
    id: "l4",
    name: "Agilus Diagnostics",
    rating: 4.9,
    reviewsCount: 3400,
    distance: "4.1 km",
    address: "Old Mumbai-Pune Highway, Pimpri-Chinchwad",
    city: "Pune",
    phone: "+91 020 3060 4050",
    partnerStatus: "active",
    features: ["NABL & CAP Accredited", "Fast Turnaround", "Home Sample Pickup", "Doctor Signed Reports"],
    about: "One of India's largest pathology networks delivering hospital-grade diagnostics and specialized genomic panels."
  }
];

router.get("/", async (req, res) => {
  try {
    const { city, q } = req.query;

    if (mongoose.connection.readyState === 1) {
      try {
        let filter: any = { isActive: true, partnerStatus: "active" };
        if (city) filter.city = new RegExp(String(city), "i");
        if (q) filter.$text = { $search: String(q) };

        const labs = await Lab.find(filter).sort({ rating: -1 });
        return res.json(labs);
      } catch (dbErr) {
        console.warn("MongoDB labs fetch failed, using fallback:", dbErr);
      }
    }

    let filtered = [...FALLBACK_LABS];
    if (city) {
      const cityLower = String(city).toLowerCase();
      filtered = filtered.filter(l => l.city.toLowerCase().includes(cityLower));
    }
    if (q) {
      const queryLower = String(q).toLowerCase();
      filtered = filtered.filter(l => 
        l.name.toLowerCase().includes(queryLower) || 
        l.address.toLowerCase().includes(queryLower)
      );
    }

    res.json(filtered);
  } catch (error) {
    console.error("Fetch Labs Error:", error);
    res.status(500).json({ message: "Server error fetching labs" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (mongoose.connection.readyState === 1) {
      try {
        const lab = await Lab.findById(id);
        if (lab) return res.json(lab);
      } catch {
        // Fallback
      }
    }

    const found = FALLBACK_LABS.find(l => l.id === id || l._id === id);
    if (!found) return res.status(404).json({ message: "Lab not found" });

    res.json(found);
  } catch (error) {
    console.error("Fetch Lab Detail Error:", error);
    res.status(500).json({ message: "Server error fetching lab details" });
  }
});

export default router;
