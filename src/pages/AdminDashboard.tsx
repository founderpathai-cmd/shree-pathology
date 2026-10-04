import React, { useState, useEffect } from "react";
import {
  Users,
  Activity,
  Calendar,
  FileText,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Search,
  Upload,
  ChevronUp,
  ChevronDown,
  Building2,
  Shield,
  Clock,
  CheckCircle2,
  Star,
  DollarSign,
  Filter,
  ArrowRight,
  Download,
  AlertCircle,
  X,
  Sparkles,
  Save,
  Tag,
  Phone,
  MessageSquare,
  ExternalLink,
  Eye,
  RefreshCw,
  MapPin
} from "lucide-react";

interface LabPriceEntry {
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

interface TestItem {
  _id: string;
  id: string;
  name: string;
  description: string;
  type: "test" | "package";
  category: string;
  price: number;
  originalPrice: number;
  fastingRequired: boolean;
  reportTime: string;
  parameters: string[];
  isActive: boolean;
  lab: {
    _id: string;
    id: string;
    name: string;
    rating: number;
    address: string;
    city: string;
  };
  labPricing: LabPriceEntry[];
}

interface LabItem {
  _id?: string;
  id: string;
  name: string;
  rating: number;
  reviewsCount?: number;
  distance?: string;
  address: string;
  city: string;
  phone?: string;
  features?: string[];
}

const PARTNER_LABS_METADATA = [
  {
    id: "l1",
    name: "Diagnopein Diagnostics",
    rating: 4.8,
    area: "Baner & Aundh",
    address: "Prime Square, Near Balewadi High Street, Baner, Pune",
    phone: "+91 020 6720 1200",
    accreditation: "NABL & CAP Certified",
    equipment: "Roche Cobas 8000 & Beckman Coulter"
  },
  {
    id: "l2",
    name: "Krsnaa Diagnostics",
    rating: 4.6,
    area: "Wakad & Hinjawadi",
    address: "Hinjawadi IT Park Phase 1, Wakad Road, Pune",
    phone: "+91 020 2740 5500",
    accreditation: "NABL Accredited",
    equipment: "Abbott Alinity & Sysmex XN-1000"
  },
  {
    id: "l3",
    name: "General Diagnostics International",
    rating: 4.7,
    area: "Kothrud & Deccan",
    address: "Karve Road, Near Paud Phata, Kothrud, Pune",
    phone: "+91 020 2544 3322",
    accreditation: "NABL & CAP Certified",
    equipment: "Siemens Atellica Solution"
  },
  {
    id: "l4",
    name: "Agilus Diagnostics",
    rating: 4.9,
    area: "Pimpri-Chinchwad",
    address: "Old Mumbai-Pune Highway, Pimpri-Chinchwad, Pune",
    phone: "+91 020 3060 4050",
    accreditation: "NABL & CAP Accredited",
    equipment: "Hospital Grade Multi-Specialty Core Lab"
  }
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "labs" | "tests" | "settings">("tests");

  // Tests & Multi-Lab Pricing State
  const [tests, setTests] = useState<TestItem[]>([]);
  const [isLoadingTests, setIsLoadingTests] = useState(true);
  const [testSearchTerm, setTestSearchTerm] = useState("");
  const [selectedLabFilter, setSelectedLabFilter] = useState("all");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Edit Single Lab Pricing Modal
  const [editingPriceModal, setEditingPriceModal] = useState<{
    isOpen: boolean;
    test: TestItem | null;
    lab: { id: string; name: string } | null;
    currentPrice: number;
    currentOriginalPrice: number;
    currentReportTime: string;
    currentHomeFee: number;
    notes: string;
  }>({
    isOpen: false,
    test: null,
    lab: null,
    currentPrice: 0,
    currentOriginalPrice: 0,
    currentReportTime: "24 Hours",
    currentHomeFee: 0,
    notes: ""
  });

  // Add New Test & Pricing Modal
  const [isAddTestModalOpen, setIsAddTestModalOpen] = useState(false);
  const [newTestForm, setNewTestForm] = useState({
    name: "",
    category: "Hematology & Routine",
    type: "test" as "test" | "package",
    description: "",
    fastingRequired: false,
    reportTime: "24 Hours",
    parameters: "",
    // Lab Prices
    l1Price: "349",
    l2Price: "399",
    l3Price: "420",
    l4Price: "499"
  });

  // Lab Price List View Modal
  const [viewLabPriceListModal, setViewLabPriceListModal] = useState<{
    isOpen: boolean;
    lab: (typeof PARTNER_LABS_METADATA)[0] | null;
  }>({
    isOpen: false,
    lab: null
  });

  // Toast notification
  const [notification, setNotification] = useState<string | null>(null);

  // Bookings state
  interface BookingRecord {
    id: string;
    bookingRef: string;
    patient: string;
    age?: number;
    gender?: string;
    phone: string;
    email?: string;
    address?: string;
    landmark?: string;
    city?: string;
    pincode?: string;
    collectionType?: string;
    test: string;
    lab: string;
    status: string;
    date: string;
    timeSlot?: string;
    amount: string;
    paymentStatus?: string;
    fastingConfirmed?: boolean;
    createdAt?: string;
    notes?: string;
  }

  const [bookings, setBookings] = useState<BookingRecord[]>([
    {
      id: "SHR-1029",
      bookingRef: "SHR-1029",
      patient: "Amit Sharma",
      age: 38,
      gender: "Male",
      test: "Comprehensive Full Body Checkup",
      lab: "Diagnopein Diagnostics",
      status: "Completed",
      date: "2026-10-01",
      timeSlot: "08:00 AM - 09:00 AM",
      amount: "₹2,499",
      phone: "+91 98201 23456",
      email: "amit.sharma@gmail.com",
      address: "Flat 402, Baner Road, Near High Street",
      city: "Pune",
      pincode: "411045",
      collectionType: "home",
      paymentStatus: "Paid",
      fastingConfirmed: true
    },
    {
      id: "SHR-1030",
      bookingRef: "SHR-1030",
      patient: "Pooja Patil",
      age: 29,
      gender: "Female",
      test: "Thyroid Profile (T3, T4, TSH)",
      lab: "Krsnaa Diagnostics",
      status: "Confirmed",
      date: "2026-10-04",
      timeSlot: "07:30 AM - 08:30 AM",
      amount: "₹499",
      phone: "+91 98112 23344",
      email: "pooja.patil@yahoo.com",
      address: "B-12, Green Park Avenue, Kothrud",
      city: "Pune",
      pincode: "411038",
      collectionType: "home",
      paymentStatus: "Pending",
      fastingConfirmed: true
    },
    {
      id: "SHR-1031",
      bookingRef: "SHR-1031",
      patient: "Rajesh Joshi",
      age: 45,
      gender: "Male",
      test: "Lipid Profile (Cholesterol)",
      lab: "General Diagnostics",
      status: "Pending",
      date: "2026-10-05",
      timeSlot: "09:00 AM - 10:00 AM",
      amount: "₹649",
      phone: "+91 98765 43210",
      email: "rajesh.joshi@gmail.com",
      address: "Sector 24, Pradhikaran, Nigdi",
      city: "Pune",
      pincode: "411044",
      collectionType: "home",
      paymentStatus: "Pending",
      fastingConfirmed: true
    },
    {
      id: "SHR-1032",
      bookingRef: "SHR-1032",
      patient: "Sunita Deshmukh",
      age: 52,
      gender: "Female",
      test: "HbA1c & Fasting Sugar",
      lab: "Agilus Diagnostics",
      status: "Completed",
      date: "2026-10-02",
      timeSlot: "08:00 AM - 09:00 AM",
      amount: "₹499",
      phone: "+91 99200 33445",
      email: "sunita.d@outlook.com",
      address: "EON Free Zone Road, Kharadi",
      city: "Pune",
      pincode: "411014",
      collectionType: "home",
      paymentStatus: "Paid",
      fastingConfirmed: true
    }
  ]);
  const [bookingFilterStatus, setBookingFilterStatus] = useState("All");
  const [searchBookingPatient, setSearchBookingPatient] = useState("");
  const [selectedBookingModal, setSelectedBookingModal] = useState<BookingRecord | null>(null);
  const [isFetchingBookings, setIsFetchingBookings] = useState(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch live bookings from API
  const fetchBookings = async () => {
    try {
      setIsFetchingBookings(true);
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setBookings(
            data.map((b: any) => ({
              id: b.id || b._id || b.bookingRef || "SHR-1000",
              bookingRef: b.bookingRef || b.id || b._id,
              patient: b.patientName || b.patient || "Patient",
              age: b.age || 35,
              gender: b.gender || "Not specified",
              phone: b.phone || "+91 98000 00000",
              email: b.email || "",
              address: b.address || "Pune Center Visit",
              landmark: b.landmark || "",
              city: b.city || "Pune",
              pincode: b.pincode || "411045",
              collectionType: b.collectionType || "home",
              test: b.testName || b.test?.name || b.test || "Diagnostic Test",
              lab: b.labName || b.lab?.name || b.lab || "Diagnopein Diagnostics",
              date: b.date || "Scheduled",
              timeSlot: b.timeSlot || "08:00 AM - 09:00 AM",
              status: b.status || "Confirmed",
              amount: typeof b.amount === "number" ? `₹${b.amount}` : (b.amount || "₹0"),
              paymentStatus: b.paymentStatus || "Pending",
              fastingConfirmed: Boolean(b.fastingConfirmed),
              createdAt: b.createdAt,
              notes: b.notes || ""
            }))
          );
        }
      }
    } catch (err) {
      console.warn("Could not fetch bookings from API:", err);
    } finally {
      setIsFetchingBookings(false);
    }
  };

  // Update a booking status
  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );
        if (selectedBookingModal && selectedBookingModal.id === bookingId) {
          setSelectedBookingModal({ ...selectedBookingModal, status: newStatus });
        }
        showToast(`Order ${bookingId} status updated to ${newStatus}`);
      } else {
        // Fallback local update
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );
        showToast(`Order ${bookingId} status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // Export all bookings as CSV
  const handleExportCSV = () => {
    if (bookings.length === 0) {
      alert("No bookings to export");
      return;
    }

    const headers = [
      "Booking Ref",
      "Date",
      "Time Slot",
      "Patient Name",
      "Age",
      "Gender",
      "Phone",
      "Email",
      "Address",
      "City",
      "Pincode",
      "Collection Type",
      "Test Name",
      "Partner Lab",
      "Amount",
      "Payment Status",
      "Status",
      "Fasting Confirmed"
    ];

    const rows = bookings.map((b) => [
      `"${b.bookingRef || b.id}"`,
      `"${b.date}"`,
      `"${b.timeSlot || ""}"`,
      `"${b.patient}"`,
      `"${b.age || ""}"`,
      `"${b.gender || ""}"`,
      `"${b.phone}"`,
      `"${b.email || ""}"`,
      `"${(b.address || "").replace(/"/g, '""')}"`,
      `"${b.city || "Pune"}"`,
      `"${b.pincode || ""}"`,
      `"${b.collectionType || "home"}"`,
      `"${(b.test || "").replace(/"/g, '""')}"`,
      `"${(b.lab || "").replace(/"/g, '""')}"`,
      `"${b.amount}"`,
      `"${b.paymentStatus || "Pending"}"`,
      `"${b.status}"`,
      `"${b.fastingConfirmed ? "Yes" : "No"}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Shree_Diagnostics_Orders_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported orders CSV successfully!");
  };

  // WhatsApp order dispatch helper
  const handleOpenWhatsApp = (b: BookingRecord) => {
    const cleanPhone = b.phone.replace(/[^0-9]/g, "");
    const msg = `*Shree Healthcare Diagnostics - Order Booking Confirmation*\n\n` +
      `📋 *Booking ID:* ${b.bookingRef || b.id}\n` +
      `👤 *Patient:* ${b.patient} (${b.age || 35} yrs, ${b.gender || "M/F"})\n` +
      `🔬 *Test:* ${b.test}\n` +
      `🏥 *Partner Lab:* ${b.lab}\n` +
      `📅 *Date & Slot:* ${b.date}, ${b.timeSlot || "Morning"}\n` +
      `📍 *Collection Address:* ${b.address || "Pune Center Visit"}, ${b.city || "Pune"} - ${b.pincode || "411045"}\n` +
      `💰 *Amount:* ${b.amount} (${b.paymentStatus || "Pending"})\n` +
      `🩸 *Fasting:* ${b.fastingConfirmed ? "Required 10-12 hrs" : "Not Required"}\n\n` +
      `Our certified phlebotomist will arrive with sterilized vacutainer kits. For queries, contact Shree Support.`;

    const targetNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://api.whatsapp.com/send?phone=${targetNumber}&text=${encodeURIComponent(msg)}`, "_blank");
  };

  // Fetch tests with multi-lab pricing matrix
  const fetchPricingMatrix = async () => {
    try {
      setIsLoadingTests(true);
      const res = await fetch("/api/tests/pricing-matrix");
      if (res.ok) {
        const data = await res.json();
        setTests(data);
      }
    } catch (err) {
      console.error("Error loading pricing matrix:", err);
    } finally {
      setIsLoadingTests(false);
    }
  };

  useEffect(() => {
    fetchPricingMatrix();
    fetchBookings();
  }, []);

  // Handle saving an individual lab price update
  const handleSaveLabPrice = async () => {
    if (!editingPriceModal.test || !editingPriceModal.lab) return;

    try {
      const testId = editingPriceModal.test.id;
      const labId = editingPriceModal.lab.id;

      const payload = {
        price: editingPriceModal.currentPrice,
        originalPrice: editingPriceModal.currentOriginalPrice,
        reportTime: editingPriceModal.currentReportTime,
        homeCollectionFee: editingPriceModal.currentHomeFee,
        notes: editingPriceModal.notes
      };

      const res = await fetch(`/api/tests/${testId}/lab-pricing/${labId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        // Update state locally
        setTests((prev) =>
          prev.map((t) => {
            if (t.id === testId) {
              const updatedPricing = t.labPricing.map((lp) => {
                if (lp.labId === labId) {
                  return {
                    ...lp,
                    price: editingPriceModal.currentPrice,
                    originalPrice: editingPriceModal.currentOriginalPrice,
                    reportTime: editingPriceModal.currentReportTime,
                    homeCollectionFee: editingPriceModal.currentHomeFee,
                    notes: editingPriceModal.notes
                  };
                }
                return lp;
              });

              // If entry didn't exist, add it
              if (!updatedPricing.some((lp) => lp.labId === labId)) {
                updatedPricing.push({
                  labId,
                  labName: editingPriceModal.lab!.name,
                  labRating: 4.8,
                  labAddress: "Pune",
                  price: editingPriceModal.currentPrice,
                  originalPrice: editingPriceModal.currentOriginalPrice,
                  reportTime: editingPriceModal.currentReportTime,
                  homeCollectionFee: editingPriceModal.currentHomeFee,
                  homeCollectionAvailable: true,
                  notes: editingPriceModal.notes
                });
              }

              const newMin = Math.min(...updatedPricing.map((p) => p.price));
              return { ...t, price: newMin, labPricing: updatedPricing };
            }
            return t;
          })
        );

        showToast(
          `Price updated: ${editingPriceModal.test.name} at ${editingPriceModal.lab.name} set to ₹${editingPriceModal.currentPrice}`
        );
        setEditingPriceModal({ ...editingPriceModal, isOpen: false });
      }
    } catch (err) {
      console.error("Error saving lab price:", err);
      alert("Failed to update lab price. Please try again.");
    }
  };

  // Handle adding a brand new test with multi-lab pricing
  const handleAddNewTestWithPricing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestForm.name.trim()) return;

    try {
      const parsedParams = newTestForm.parameters
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

      const labPricing = [
        {
          labId: "l1",
          labName: "Diagnopein Diagnostics",
          labRating: 4.8,
          labAddress: "Baner & Aundh, Pune",
          price: Number(newTestForm.l1Price) || 399,
          originalPrice: (Number(newTestForm.l1Price) || 399) * 1.3,
          reportTime: newTestForm.reportTime,
          homeCollectionFee: 0,
          homeCollectionAvailable: true,
          notes: "NABL accredited Roche Cobas"
        },
        {
          labId: "l2",
          labName: "Krsnaa Diagnostics",
          labRating: 4.6,
          labAddress: "Wakad & Hinjawadi, Pune",
          price: Number(newTestForm.l2Price) || 449,
          originalPrice: (Number(newTestForm.l2Price) || 449) * 1.3,
          reportTime: newTestForm.reportTime,
          homeCollectionFee: 0,
          homeCollectionAvailable: true,
          notes: "Automated robotic analyzer"
        },
        {
          labId: "l3",
          labName: "General Diagnostics International",
          labRating: 4.7,
          labAddress: "Kothrud & Deccan, Pune",
          price: Number(newTestForm.l3Price) || 480,
          originalPrice: (Number(newTestForm.l3Price) || 480) * 1.3,
          reportTime: newTestForm.reportTime,
          homeCollectionFee: 0,
          homeCollectionAvailable: true,
          notes: "Express same-day reporting"
        },
        {
          labId: "l4",
          labName: "Agilus Diagnostics",
          labRating: 4.9,
          labAddress: "Pimpri-Chinchwad, Pune",
          price: Number(newTestForm.l4Price) || 549,
          originalPrice: (Number(newTestForm.l4Price) || 549) * 1.3,
          reportTime: newTestForm.reportTime,
          homeCollectionFee: 50,
          homeCollectionAvailable: true,
          notes: "Hospital grade CAP accredited"
        }
      ];

      const minPrice = Math.min(...labPricing.map((p) => p.price));

      const payload = {
        name: newTestForm.name,
        category: newTestForm.category,
        type: newTestForm.type,
        description: newTestForm.description || `Diagnostic test panel for ${newTestForm.name}`,
        fastingRequired: newTestForm.fastingRequired,
        reportTime: newTestForm.reportTime,
        parameters: parsedParams.length ? parsedParams : ["Clinical Biomarker 1", "Clinical Biomarker 2"],
        price: minPrice,
        originalPrice: Math.round(minPrice * 1.35),
        labPricing
      };

      const res = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const created = await res.json();
        setTests((prev) => [created, ...prev]);
        setIsAddTestModalOpen(false);
        setNewTestForm({
          name: "",
          category: "Hematology & Routine",
          type: "test",
          description: "",
          fastingRequired: false,
          reportTime: "24 Hours",
          parameters: "",
          l1Price: "349",
          l2Price: "399",
          l3Price: "420",
          l4Price: "499"
        });
        showToast(`Added test "${created.name}" with custom pricing across 4 partner laboratories!`);
      }
    } catch (err) {
      console.error("Error creating test with pricing:", err);
      alert("Error adding test");
    }
  };

  // Filter tests for display
  const filteredTests = tests.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(testSearchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(testSearchTerm.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === "all" ||
      (selectedCategoryFilter === "packages" && t.type === "package") ||
      (selectedCategoryFilter === "tests" && t.type === "test") ||
      t.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase());

    const matchesLab =
      selectedLabFilter === "all" ||
      t.labPricing?.some((lp) => lp.labId === selectedLabFilter);

    return matchesSearch && matchesCategory && matchesLab;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden md:flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-600 text-white font-black text-sm">SD</div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Shree Diagnostics</h2>
                <div className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">
                  Admin & Lab Manager
                </div>
              </div>
            </div>
          </div>
          <nav className="p-3 space-y-1">
            {[
              { id: "tests", label: "Tests & Pricing Matrix", icon: FileText, badge: `${tests.length}` },
              { id: "labs", label: "Partner Laboratories", icon: Building2, badge: "4" },
              { id: "bookings", label: "Bookings & Reports", icon: Calendar, badge: `${bookings.length}` },
              { id: "overview", label: "Platform Overview", icon: Activity },
              { id: "settings", label: "Settings", icon: Settings }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      activeTab === item.id ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          <div>Service Area: <span className="text-slate-300 font-semibold">Pune & PCMC</span></div>
          <div className="text-[11px] mt-0.5">Multi-Lab Pricing Mode: <span className="text-emerald-400 font-bold">Enabled</span></div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeTab === "tests" && "Diagnostic Tests & Multi-Lab Pricing Matrix"}
              {activeTab === "labs" && "Accredited Partner Laboratories & Custom Price Lists"}
              {activeTab === "bookings" && "Patient Bookings & E-Report Vault"}
              {activeTab === "overview" && "Platform Operations & Analytics"}
              {activeTab === "settings" && "Platform Configuration"}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure different test prices, margins, turnaround times, and home sample collection for each laboratory.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {activeTab === "tests" && (
              <button
                onClick={() => setIsAddTestModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4" /> Add Test with Lab Prices
              </button>
            )}
            {activeTab === "labs" && (
              <button
                onClick={() => alert("Partner Lab onboarding wizard will open. All 4 Pune core laboratories are active.")}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" /> Register New Lab
              </button>
            )}
          </div>
        </div>

        {/* ================= TAB 1: TESTS & MULTI-LAB PRICING MATRIX ================= */}
        {activeTab === "tests" && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-slate-400 text-xs font-semibold">Total Tests / Panels</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{tests.length}</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">Active across Pune network</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-slate-400 text-xs font-semibold">Partner Labs With Custom Pricing</div>
                <div className="text-2xl font-black text-slate-900 mt-1">4 Labs</div>
                <div className="text-[11px] text-blue-600 font-semibold mt-1">Diagnopein, Krsnaa, GD, Agilus</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-slate-400 text-xs font-semibold">Average Price Variance</div>
                <div className="text-2xl font-black text-slate-900 mt-1">28%</div>
                <div className="text-[11px] text-slate-500 font-medium mt-1">Patients compare & choose</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-slate-400 text-xs font-semibold">Home Collection Coverage</div>
                <div className="text-2xl font-black text-emerald-600 mt-1">100%</div>
                <div className="text-[11px] text-slate-500 font-medium mt-1">Pune & PCMC doorstep service</div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search test name, category, or parameter..."
                  value={testSearchTerm}
                  onChange={(e) => setTestSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Lab Filter */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="font-semibold text-slate-500 hidden sm:inline">Lab View:</span>
                  <select
                    value={selectedLabFilter}
                    onChange={(e) => setSelectedLabFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All 4 Partner Labs (Matrix View)</option>
                    <option value="l1">Diagnopein Diagnostics Price List</option>
                    <option value="l2">Krsnaa Diagnostics Price List</option>
                    <option value="l3">General Diagnostics Price List</option>
                    <option value="l4">Agilus Diagnostics Price List</option>
                  </select>
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="tests">Single Tests</option>
                  <option value="packages">Health Packages</option>
                  <option value="hematology">Hematology</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="endocrinology">Thyroid & Hormones</option>
                  <option value="diabetes">Diabetes Care</option>
                  <option value="vitamins">Vitamins & Fatigue</option>
                </select>
              </div>
            </div>

            {/* Pricing Matrix Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {selectedLabFilter === "all"
                      ? "Multi-Lab Price Comparison Matrix"
                      : `Price List for ${PARTNER_LABS_METADATA.find((l) => l.id === selectedLabFilter)?.name}`}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Click any price cell to update rates, turnaround times, or home collection fees for that specific laboratory.
                  </p>
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  Showing {filteredTests.length} of {tests.length} tests
                </div>
              </div>

              {isLoadingTests ? (
                <div className="p-12 text-center text-slate-500 text-xs">Loading pricing lists...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-5 py-3.5 min-w-[220px]">Medical Test / Package</th>
                        <th className="px-4 py-3.5 min-w-[130px]">
                          <div>Diagnopein</div>
                          <div className="text-[10px] text-slate-400 font-normal">Baner & Aundh</div>
                        </th>
                        <th className="px-4 py-3.5 min-w-[130px]">
                          <div>Krsnaa Diagnostics</div>
                          <div className="text-[10px] text-slate-400 font-normal">Wakad & Hinjawadi</div>
                        </th>
                        <th className="px-4 py-3.5 min-w-[130px]">
                          <div>General Diagnostics</div>
                          <div className="text-[10px] text-slate-400 font-normal">Kothrud & Deccan</div>
                        </th>
                        <th className="px-4 py-3.5 min-w-[130px]">
                          <div>Agilus Diagnostics</div>
                          <div className="text-[10px] text-slate-400 font-normal">Pimpri-Chinchwad</div>
                        </th>
                        <th className="px-4 py-3.5 text-center min-w-[110px]">Lowest Price</th>
                        <th className="px-4 py-3.5 text-right min-w-[100px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTests.map((test) => {
                        const l1Price = test.labPricing?.find((lp) => lp.labId === "l1");
                        const l2Price = test.labPricing?.find((lp) => lp.labId === "l2");
                        const l3Price = test.labPricing?.find((lp) => lp.labId === "l3");
                        const l4Price = test.labPricing?.find((lp) => lp.labId === "l4");

                        const allPrices = [l1Price?.price, l2Price?.price, l3Price?.price, l4Price?.price].filter(
                          (p): p is number => typeof p === "number"
                        );
                        const lowestPrice = allPrices.length ? Math.min(...allPrices) : test.price;

                        return (
                          <tr key={test.id} className="hover:bg-blue-50/30 transition-colors">
                            {/* Test Info */}
                            <td className="px-5 py-4">
                              <div className="font-bold text-slate-900 text-sm">{test.name}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    test.type === "package" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {test.type.toUpperCase()}
                                </span>
                                <span className="text-[11px] text-slate-500">{test.category}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {test.parameters?.length || 1} Biomarkers · {test.fastingRequired ? "10h Fasting" : "No Fasting"}
                              </div>
                            </td>

                            {/* Diagnopein (l1) Price Cell */}
                            <td className="px-4 py-4">
                              {l1Price ? (
                                <button
                                  onClick={() =>
                                    setEditingPriceModal({
                                      isOpen: true,
                                      test,
                                      lab: { id: "l1", name: "Diagnopein Diagnostics" },
                                      currentPrice: l1Price.price,
                                      currentOriginalPrice: l1Price.originalPrice,
                                      currentReportTime: l1Price.reportTime,
                                      currentHomeFee: l1Price.homeCollectionFee,
                                      notes: l1Price.notes || ""
                                    })
                                  }
                                  className={`text-left p-2 rounded-xl border w-full group transition-all ${
                                    l1Price.price === lowestPrice
                                      ? "bg-emerald-50/80 border-emerald-300 hover:border-emerald-500"
                                      : "bg-white border-slate-200 hover:border-blue-400"
                                  }`}
                                >
                                  <div className="flex items-baseline justify-between">
                                    <span className="font-bold text-slate-900 text-sm">₹{l1Price.price}</span>
                                    <Edit2 className="h-3 w-3 text-slate-400 group-hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100" />
                                  </div>
                                  <div className="text-[10px] text-slate-400 line-through">₹{l1Price.originalPrice}</div>
                                  <div className="text-[10px] text-slate-500 mt-0.5">{l1Price.reportTime}</div>
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    setEditingPriceModal({
                                      isOpen: true,
                                      test,
                                      lab: { id: "l1", name: "Diagnopein Diagnostics" },
                                      currentPrice: test.price,
                                      currentOriginalPrice: test.originalPrice,
                                      currentReportTime: "24 Hours",
                                      currentHomeFee: 0,
                                      notes: ""
                                    })
                                  }
                                  className="text-slate-400 hover:text-blue-600 text-xs font-semibold p-2 border border-dashed border-slate-200 hover:border-blue-400 rounded-xl w-full text-center"
                                >
                                  + Set Price
                                </button>
                              )}
                            </td>

                            {/* Krsnaa Diagnostics (l2) Price Cell */}
                            <td className="px-4 py-4">
                              {l2Price ? (
                                <button
                                  onClick={() =>
                                    setEditingPriceModal({
                                      isOpen: true,
                                      test,
                                      lab: { id: "l2", name: "Krsnaa Diagnostics" },
                                      currentPrice: l2Price.price,
                                      currentOriginalPrice: l2Price.originalPrice,
                                      currentReportTime: l2Price.reportTime,
                                      currentHomeFee: l2Price.homeCollectionFee,
                                      notes: l2Price.notes || ""
                                    })
                                  }
                                  className={`text-left p-2 rounded-xl border w-full group transition-all ${
                                    l2Price.price === lowestPrice
                                      ? "bg-emerald-50/80 border-emerald-300 hover:border-emerald-500"
                                      : "bg-white border-slate-200 hover:border-blue-400"
                                  }`}
                                >
                                  <div className="flex items-baseline justify-between">
                                    <span className="font-bold text-slate-900 text-sm">₹{l2Price.price}</span>
                                    <Edit2 className="h-3 w-3 text-slate-400 group-hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100" />
                                  </div>
                                  <div className="text-[10px] text-slate-400 line-through">₹{l2Price.originalPrice}</div>
                                  <div className="text-[10px] text-slate-500 mt-0.5">{l2Price.reportTime}</div>
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    setEditingPriceModal({
                                      isOpen: true,
                                      test,
                                      lab: { id: "l2", name: "Krsnaa Diagnostics" },
                                      currentPrice: test.price,
                                      currentOriginalPrice: test.originalPrice,
                                      currentReportTime: "24 Hours",
                                      currentHomeFee: 0,
                                      notes: ""
                                    })
                                  }
                                  className="text-slate-400 hover:text-blue-600 text-xs font-semibold p-2 border border-dashed border-slate-200 hover:border-blue-400 rounded-xl w-full text-center"
                                >
                                  + Set Price
                                </button>
                              )}
                            </td>

                            {/* General Diagnostics (l3) Price Cell */}
                            <td className="px-4 py-4">
                              {l3Price ? (
                                <button
                                  onClick={() =>
                                    setEditingPriceModal({
                                      isOpen: true,
                                      test,
                                      lab: { id: "l3", name: "General Diagnostics International" },
                                      currentPrice: l3Price.price,
                                      currentOriginalPrice: l3Price.originalPrice,
                                      currentReportTime: l3Price.reportTime,
                                      currentHomeFee: l3Price.homeCollectionFee,
                                      notes: l3Price.notes || ""
                                    })
                                  }
                                  className={`text-left p-2 rounded-xl border w-full group transition-all ${
                                    l3Price.price === lowestPrice
                                      ? "bg-emerald-50/80 border-emerald-300 hover:border-emerald-500"
                                      : "bg-white border-slate-200 hover:border-blue-400"
                                  }`}
                                >
                                  <div className="flex items-baseline justify-between">
                                    <span className="font-bold text-slate-900 text-sm">₹{l3Price.price}</span>
                                    <Edit2 className="h-3 w-3 text-slate-400 group-hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100" />
                                  </div>
                                  <div className="text-[10px] text-slate-400 line-through">₹{l3Price.originalPrice}</div>
                                  <div className="text-[10px] text-slate-500 mt-0.5">{l3Price.reportTime}</div>
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    setEditingPriceModal({
                                      isOpen: true,
                                      test,
                                      lab: { id: "l3", name: "General Diagnostics International" },
                                      currentPrice: test.price,
                                      currentOriginalPrice: test.originalPrice,
                                      currentReportTime: "24 Hours",
                                      currentHomeFee: 0,
                                      notes: ""
                                    })
                                  }
                                  className="text-slate-400 hover:text-blue-600 text-xs font-semibold p-2 border border-dashed border-slate-200 hover:border-blue-400 rounded-xl w-full text-center"
                                >
                                  + Set Price
                                </button>
                              )}
                            </td>

                            {/* Agilus Diagnostics (l4) Price Cell */}
                            <td className="px-4 py-4">
                              {l4Price ? (
                                <button
                                  onClick={() =>
                                    setEditingPriceModal({
                                      isOpen: true,
                                      test,
                                      lab: { id: "l4", name: "Agilus Diagnostics" },
                                      currentPrice: l4Price.price,
                                      currentOriginalPrice: l4Price.originalPrice,
                                      currentReportTime: l4Price.reportTime,
                                      currentHomeFee: l4Price.homeCollectionFee,
                                      notes: l4Price.notes || ""
                                    })
                                  }
                                  className={`text-left p-2 rounded-xl border w-full group transition-all ${
                                    l4Price.price === lowestPrice
                                      ? "bg-emerald-50/80 border-emerald-300 hover:border-emerald-500"
                                      : "bg-white border-slate-200 hover:border-blue-400"
                                  }`}
                                >
                                  <div className="flex items-baseline justify-between">
                                    <span className="font-bold text-slate-900 text-sm">₹{l4Price.price}</span>
                                    <Edit2 className="h-3 w-3 text-slate-400 group-hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100" />
                                  </div>
                                  <div className="text-[10px] text-slate-400 line-through">₹{l4Price.originalPrice}</div>
                                  <div className="text-[10px] text-slate-500 mt-0.5">{l4Price.reportTime}</div>
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    setEditingPriceModal({
                                      isOpen: true,
                                      test,
                                      lab: { id: "l4", name: "Agilus Diagnostics" },
                                      currentPrice: test.price,
                                      currentOriginalPrice: test.originalPrice,
                                      currentReportTime: "18 Hours",
                                      currentHomeFee: 50,
                                      notes: ""
                                    })
                                  }
                                  className="text-slate-400 hover:text-blue-600 text-xs font-semibold p-2 border border-dashed border-slate-200 hover:border-blue-400 rounded-xl w-full text-center"
                                >
                                  + Set Price
                                </button>
                              )}
                            </td>

                            {/* Best / Lowest Price Indicator */}
                            <td className="px-4 py-4 text-center">
                              <span className="inline-flex flex-col items-center">
                                <span className="text-base font-black text-emerald-600">₹{lowestPrice}</span>
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mt-0.5">
                                  Best Offer
                                </span>
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-4 text-right">
                              <button
                                onClick={() =>
                                  setEditingPriceModal({
                                    isOpen: true,
                                    test,
                                    lab: { id: "l1", name: "Diagnopein Diagnostics" },
                                    currentPrice: l1Price?.price || test.price,
                                    currentOriginalPrice: l1Price?.originalPrice || test.originalPrice,
                                    currentReportTime: l1Price?.reportTime || "24 Hours",
                                    currentHomeFee: l1Price?.homeCollectionFee || 0,
                                    notes: l1Price?.notes || ""
                                  })
                                }
                                className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors"
                              >
                                Edit Rates
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: PARTNER LABORATORIES ================= */}
        {activeTab === "labs" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PARTNER_LABS_METADATA.map((lab) => {
                // Calculate tests count and average price for this lab
                const labTests = tests.filter((t) => t.labPricing?.some((lp) => lp.labId === lab.id));
                const totalPrices = labTests.reduce((acc, t) => {
                  const p = t.labPricing.find((lp) => lp.labId === lab.id);
                  return acc + (p?.price || 0);
                }, 0);
                const avgPrice = labTests.length ? Math.round(totalPrices / labTests.length) : 0;

                return (
                  <div key={lab.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-slate-900 text-base">{lab.name}</h3>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            Active
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                          <Shield className="h-3.5 w-3.5 text-blue-600" />
                          <span>{lab.accreditation}</span>
                          <span>·</span>
                          <span className="text-amber-600 font-bold flex items-center">
                            ★ {lab.rating}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 text-blue-700 rounded-xl font-black text-sm">
                        {lab.id.toUpperCase()}
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1 text-slate-600">
                      <div>
                        <strong className="text-slate-700">Service Facility:</strong> {lab.address}
                      </div>
                      <div>
                        <strong className="text-slate-700">Contact / Helpline:</strong> {lab.phone}
                      </div>
                      <div>
                        <strong className="text-slate-700">Instrumentation:</strong> {lab.equipment}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100">
                      <div>
                        <div className="text-slate-400 font-medium">Mapped Tests & Packages</div>
                        <div className="text-lg font-black text-slate-900 mt-0.5">{labTests.length} Items</div>
                      </div>
                      <div>
                        <div className="text-slate-400 font-medium">Average Price Point</div>
                        <div className="text-lg font-black text-slate-900 mt-0.5">₹{avgPrice}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => {
                          setSelectedLabFilter(lab.id);
                          setActiveTab("tests");
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Filter in Pricing Matrix →
                      </button>

                      <button
                        onClick={() => setViewLabPriceListModal({ isOpen: true, lab })}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <FileText className="h-3.5 w-3.5" /> View Full Price Menu
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 3: BOOKINGS & REPORTS ================= */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-50">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <span>Pune & PCMC Doorstep Phlebotomy</span>
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Patient Bookings, Order Records & Home Dispatch
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Receive orders, dispatch certified phlebotomists, view patient details, and manage digital lab reports.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                {/* Search */}
                <div className="relative flex-1 sm:w-60">
                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search patient, phone, ID..."
                    value={searchBookingPatient}
                    onChange={(e) => setSearchBookingPatient(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Filter */}
                <select
                  value={bookingFilterStatus}
                  onChange={(e) => setBookingFilterStatus(e.target.value)}
                  className="bg-white border border-slate-200 text-xs rounded-xl px-3 py-1.5 font-bold text-slate-700 outline-none"
                >
                  <option value="All">All Statuses ({bookings.length})</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {/* Live Refresh */}
                <button
                  onClick={fetchBookings}
                  disabled={isFetchingBookings}
                  className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
                  title="Refresh Live Orders"
                >
                  <RefreshCw className={`h-4 w-4 ${isFetchingBookings ? "animate-spin text-blue-600" : ""}`} />
                </button>

                {/* Export CSV */}
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Booking Ref</th>
                    <th className="px-5 py-3.5">Patient Details</th>
                    <th className="px-5 py-3.5">Address / Area</th>
                    <th className="px-5 py-3.5">Test & Partner Lab</th>
                    <th className="px-5 py-3.5">Date & Slot</th>
                    <th className="px-5 py-3.5">Amount</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings
                    .filter((b) => {
                      const matchesStatus =
                        bookingFilterStatus === "All" || b.status === bookingFilterStatus;
                      const q = searchBookingPatient.toLowerCase();
                      const matchesSearch =
                        !q ||
                        b.patient.toLowerCase().includes(q) ||
                        b.phone.includes(q) ||
                        b.id.toLowerCase().includes(q) ||
                        (b.address && b.address.toLowerCase().includes(q));
                      return matchesStatus && matchesSearch;
                    })
                    .map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <span>{booking.id}</span>
                            {booking.collectionType === "home" ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                                Home
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                                Lab
                              </span>
                            )}
                          </div>
                          {booking.fastingConfirmed && (
                            <span className="text-[10px] text-amber-700 block mt-0.5">
                              • Fasting Confirmed
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900">{booking.patient}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <a
                              href={`tel:${booking.phone}`}
                              className="hover:text-blue-600 font-medium"
                            >
                              {booking.phone}
                            </a>
                            {booking.age && <span>• {booking.age}y/{booking.gender?.slice(0, 1) || "M"}</span>}
                          </div>
                        </td>

                        <td className="px-5 py-4 max-w-[200px]">
                          <div className="font-medium text-slate-800 truncate" title={booking.address}>
                            {booking.address || "Pune Center Visit"}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            <span>{booking.city || "Pune"} {booking.pincode ? `(${booking.pincode})` : ""}</span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-900">{booking.test}</div>
                          <div className="text-[11px] font-semibold text-blue-700 mt-0.5">
                            {booking.lab}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          <div className="font-semibold text-slate-900">{booking.date}</div>
                          <div className="text-[11px] text-slate-500">{booking.timeSlot || "Morning"}</div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-black text-slate-900">{booking.amount}</div>
                          <span
                            className={`text-[10px] font-bold ${
                              booking.paymentStatus === "Paid" ? "text-emerald-700" : "text-amber-700"
                            }`}
                          >
                            {booking.paymentStatus || "Pending"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <select
                            value={booking.status}
                            onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors outline-none cursor-pointer ${
                              booking.status === "Completed"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : booking.status === "Confirmed"
                                ? "bg-blue-50 text-blue-800 border-blue-300"
                                : booking.status === "Cancelled"
                                ? "bg-rose-50 text-rose-800 border-rose-300"
                                : "bg-amber-50 text-amber-800 border-amber-300"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Sample Collected">Sample Collected</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Full Order Details */}
                            <button
                              onClick={() => setSelectedBookingModal(booking)}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-slate-600 hover:text-blue-700 transition-colors"
                              title="View Full Order & Patient Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* WhatsApp Dispatch Button */}
                            <button
                              onClick={() => handleOpenWhatsApp(booking)}
                              className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                              title="Send WhatsApp Order Confirmation / Dispatch"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </button>

                            {/* Call Patient */}
                            <a
                              href={`tel:${booking.phone}`}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                              title="Call Patient"
                            >
                              <Phone className="h-4 w-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {bookings.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No orders recorded yet. When patients book diagnostic tests, they will appear here in real time.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 4: PLATFORM OVERVIEW ================= */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "Total Bookings", value: "1,482", trend: "+14%" },
                { label: "Partner Laboratories", value: "4", trend: "Pune Active" },
                { label: "Diagnostic Tests", value: `${tests.length}`, trend: "Multi-Price" },
                { label: "Total Billing Volume", value: "₹5.8L", trend: "+22%" }
              ].map((s, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold">{s.label}</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{s.value}</div>
                  <div className="text-[11px] font-bold text-emerald-600 mt-1">{s.trend}</div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">How Multi-Lab Pricing Works on Shree Diagnostics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                1. <strong>Independent Laboratory Pricing:</strong> Each accredited lab partner sets its own custom price list,
                discounts, turnaround times, and sample processing policies for every diagnostic test and package.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                2. <strong>Patient Transparency:</strong> When patients search for tests in Pune (e.g. CBC, HbA1c, Full Body Checkup),
                they see the starting price and can compare offerings from Diagnopein, Krsnaa, General Diagnostics, and Agilus.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                3. <strong>Immediate Admin Control:</strong> Lab managers and admins can adjust prices instantly using the
                Matrix Table above or upload custom Excel/JSON price menus per laboratory.
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 5: SETTINGS ================= */}
        {activeTab === "settings" && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs max-w-2xl space-y-6">
            <h3 className="text-base font-bold text-slate-900">Platform & Pricing Engine Configuration</h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-bold text-slate-800">Multi-Lab Pricing Display</div>
                  <div className="text-slate-500 text-[11px]">Show price comparison matrix to patients in search results</div>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-bold text-slate-800">Dynamic Free Home Collection</div>
                  <div className="text-slate-500 text-[11px]">Waive sample pickup charge for orders over ₹499</div>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-bold text-slate-800">Senior Citizen 10% Discount</div>
                  <div className="text-slate-500 text-[11px]">Automatically apply senior citizen benefit across all labs</div>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
              </div>
            </div>

            <button
              onClick={() => showToast("Settings saved successfully!")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs"
            >
              Save Configuration
            </button>
          </div>
        )}
      </main>

      {/* ================= MODAL: EDIT LAB PRICE ================= */}
      {editingPriceModal.isOpen && editingPriceModal.test && editingPriceModal.lab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Modify Laboratory Rate
                </span>
                <h3 className="text-base font-bold mt-0.5">{editingPriceModal.test.name}</h3>
                <div className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{editingPriceModal.lab.name}</span>
                </div>
              </div>
              <button
                onClick={() => setEditingPriceModal({ ...editingPriceModal, isOpen: false })}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={editingPriceModal.currentPrice}
                      onChange={(e) =>
                        setEditingPriceModal({
                          ...editingPriceModal,
                          currentPrice: Number(e.target.value) || 0
                        })
                      }
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">MRP / Original Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={editingPriceModal.currentOriginalPrice}
                      onChange={(e) =>
                        setEditingPriceModal({
                          ...editingPriceModal,
                          currentOriginalPrice: Number(e.target.value) || 0
                        })
                      }
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Report Turnaround Time</label>
                  <select
                    value={editingPriceModal.currentReportTime}
                    onChange={(e) =>
                      setEditingPriceModal({
                        ...editingPriceModal,
                        currentReportTime: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none"
                  >
                    <option value="12 Hours (Same Day)">12 Hours (Same Day)</option>
                    <option value="18 Hours">18 Hours</option>
                    <option value="24 Hours">24 Hours</option>
                    <option value="36 Hours">36 Hours</option>
                    <option value="48 Hours">48 Hours</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Home Collection Fee</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={editingPriceModal.currentHomeFee}
                      onChange={(e) =>
                        setEditingPriceModal({
                          ...editingPriceModal,
                          currentHomeFee: Number(e.target.value) || 0
                        })
                      }
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">Set 0 for Free Home Collection</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Lab Note / Clinical Spec</label>
                <input
                  type="text"
                  placeholder="e.g. Roche Cobas 8000 analyzer, includes extended ratio..."
                  value={editingPriceModal.notes}
                  onChange={(e) =>
                    setEditingPriceModal({
                      ...editingPriceModal,
                      notes: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPriceModal({ ...editingPriceModal, isOpen: false })}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveLabPrice}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save & Update Rate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD NEW TEST WITH LAB PRICES ================= */}
      {isAddTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="p-6 bg-gradient-to-r from-slate-900 to-blue-900 text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  New Diagnostic Offering
                </span>
                <h3 className="text-base font-bold">Add Test & Set Lab Pricing List</h3>
              </div>
              <button
                onClick={() => setIsAddTestModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewTestWithPricing} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Medical Test / Package Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vitamin B12 Screening, Renal Function Test (RFT)..."
                  value={newTestForm.name}
                  onChange={(e) => setNewTestForm({ ...newTestForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newTestForm.category}
                    onChange={(e) => setNewTestForm({ ...newTestForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none"
                  >
                    <option value="Hematology & Routine">Hematology & Routine</option>
                    <option value="Cardiology & Lipids">Cardiology & Lipids</option>
                    <option value="Endocrinology">Endocrinology & Thyroid</option>
                    <option value="Diabetes Care">Diabetes Care</option>
                    <option value="Hepatic & Digestive">Liver & Digestive</option>
                    <option value="Renal Function">Kidney / Renal Function</option>
                    <option value="Vitamins & Fatigue">Vitamins & Fatigue</option>
                    <option value="Preventive Health">Full Body Health Package</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Type</label>
                  <select
                    value={newTestForm.type}
                    onChange={(e: any) => setNewTestForm({ ...newTestForm, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none"
                  >
                    <option value="test">Single Test</option>
                    <option value="package">Health Package</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief clinical purpose of this screening..."
                  value={newTestForm.description}
                  onChange={(e) => setNewTestForm({ ...newTestForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Parameters (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Hemoglobin, RBC, WBC, Platelets, Hematocrit..."
                  value={newTestForm.parameters}
                  onChange={(e) => setNewTestForm({ ...newTestForm, parameters: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none"
                />
              </div>

              {/* Lab Pricing List inputs */}
              <div className="pt-2 border-t border-slate-100">
                <div className="font-bold text-slate-900 mb-2 flex items-center justify-between">
                  <span>Set Different Price for Each Partner Lab:</span>
                  <span className="text-[10px] text-slate-500">Each lab can charge different rates</span>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Diagnopein (Baner)</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        value={newTestForm.l1Price}
                        onChange={(e) => setNewTestForm({ ...newTestForm, l1Price: e.target.value })}
                        className="w-full pl-7 pr-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Krsnaa (Wakad)</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        value={newTestForm.l2Price}
                        onChange={(e) => setNewTestForm({ ...newTestForm, l2Price: e.target.value })}
                        className="w-full pl-7 pr-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-0.5">General Diagnostics (Kothrud)</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        value={newTestForm.l3Price}
                        onChange={(e) => setNewTestForm({ ...newTestForm, l3Price: e.target.value })}
                        className="w-full pl-7 pr-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Agilus (Pimpri)</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        value={newTestForm.l4Price}
                        onChange={(e) => setNewTestForm({ ...newTestForm, l4Price: e.target.value })}
                        className="w-full pl-7 pr-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddTestModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Save Test & Lab Rates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: VIEW INDIVIDUAL LAB FULL PRICE LIST ================= */}
      {viewLabPriceListModal.isOpen && viewLabPriceListModal.lab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Laboratory Price Menu
                </span>
                <h3 className="text-base font-bold">{viewLabPriceListModal.lab.name}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{viewLabPriceListModal.lab.address}</p>
              </div>
              <button
                onClick={() => setViewLabPriceListModal({ isOpen: false, lab: null })}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-600">
                  All tests priced specifically by {viewLabPriceListModal.lab.name}
                </span>
                <button
                  onClick={() => alert(`Price list for ${viewLabPriceListModal.lab?.name} exported as CSV`)}
                  className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                >
                  <Download className="h-3.5 w-3.5" /> Export CSV
                </button>
              </div>

              <div className="space-y-2">
                {tests.map((test) => {
                  const entry = test.labPricing?.find((lp) => lp.labId === viewLabPriceListModal.lab?.id);
                  if (!entry) return null;
                  return (
                    <div
                      key={test.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{test.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {test.category} · Turnaround: {entry.reportTime}
                        </div>
                        {entry.notes && (
                          <div className="text-[10px] text-blue-600 font-medium mt-0.5">{entry.notes}</div>
                        )}
                      </div>

                      <div className="text-right flex items-center gap-4">
                        <div>
                          <div className="text-base font-black text-slate-900">₹{entry.price}</div>
                          <div className="text-[10px] text-slate-400 line-through">₹{entry.originalPrice}</div>
                        </div>

                        <button
                          onClick={() => {
                            setViewLabPriceListModal({ isOpen: false, lab: null });
                            setEditingPriceModal({
                              isOpen: true,
                              test,
                              lab: viewLabPriceListModal.lab!,
                              currentPrice: entry.price,
                              currentOriginalPrice: entry.originalPrice,
                              currentReportTime: entry.reportTime,
                              currentHomeFee: entry.homeCollectionFee,
                              notes: entry.notes || ""
                            });
                          }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Rate"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewLabPriceListModal({ isOpen: false, lab: null })}
                className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold"
              >
                Close Price Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ORDER DETAILS & DISPATCH ================= */}
      {selectedBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Patient Order & Phlebotomy Dispatch
                </span>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <span>Order Ref: {selectedBookingModal.bookingRef || selectedBookingModal.id}</span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      selectedBookingModal.status === "Completed"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                        : "bg-blue-500/20 text-cyan-300 border border-cyan-400/40"
                    }`}
                  >
                    {selectedBookingModal.status}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingModal(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
              {/* Patient Profile */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Patient Information
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Full Name</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedBookingModal.patient}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Age / Gender</span>
                    <span className="font-bold text-slate-900">
                      {selectedBookingModal.age || 35} Years · {selectedBookingModal.gender || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Contact Mobile</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-bold text-slate-900">{selectedBookingModal.phone}</span>
                      <a
                        href={`tel:${selectedBookingModal.phone}`}
                        className="text-blue-600 hover:underline inline-flex items-center gap-0.5"
                      >
                        <Phone className="h-3 w-3" /> Call
                      </a>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email Address</span>
                    <span className="font-medium text-slate-700">{selectedBookingModal.email || "Not provided"}</span>
                  </div>
                </div>
              </div>

              {/* Sample Collection & Pune Address */}
              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100">
                <div className="text-[11px] font-bold uppercase tracking-wider text-blue-900 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-600" /> Doorstep Collection Details
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {selectedBookingModal.collectionType === "home" ? "Home Visit" : "Lab Visit"}
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Address & Landmark:</span>
                    <span className="font-semibold text-slate-900 leading-snug">
                      {selectedBookingModal.address || "Pune Center Visit"}
                    </span>
                    {selectedBookingModal.landmark && (
                      <span className="text-slate-500 block mt-0.5">
                        Landmark: {selectedBookingModal.landmark}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-blue-100 text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[10px]">City & Pincode</span>
                      <span className="font-bold text-slate-900">
                        {selectedBookingModal.city || "Pune"}, Maharashtra - {selectedBookingModal.pincode || "411045"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Scheduled Slot</span>
                      <span className="font-bold text-slate-900">
                        {selectedBookingModal.date} ({selectedBookingModal.timeSlot || "Morning"})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Test & Lab Order */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Diagnostic Order
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{selectedBookingModal.test}</div>
                    <div className="text-blue-700 font-semibold mt-0.5 flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>Assigned to: {selectedBookingModal.lab}</span>
                    </div>
                    {selectedBookingModal.fastingConfirmed && (
                      <div className="inline-flex items-center gap-1 text-[10px] text-amber-800 font-bold bg-amber-100/70 px-2 py-0.5 rounded-md mt-2">
                        <AlertCircle className="h-3 w-3 text-amber-600" />
                        <span>Fasting Protocol Confirmed (10-12 hours)</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-slate-900">{selectedBookingModal.amount}</div>
                    <span
                      className={`text-[10px] font-bold ${
                        selectedBookingModal.paymentStatus === "Paid" ? "text-emerald-700" : "text-amber-700"
                      }`}
                    >
                      {selectedBookingModal.paymentStatus || "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Operational Status Updater */}
              <div className="pt-2 border-t border-slate-200">
                <label className="font-bold text-slate-700 block mb-1.5">
                  Update Phlebotomy / Report Status:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Confirmed", "Sample Collected", "Completed"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateBookingStatus(selectedBookingModal.id, st)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs transition-all border ${
                        selectedBookingModal.status === st
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleOpenWhatsApp(selectedBookingModal)}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Send WhatsApp Dispatch Details</span>
              </button>

              <button
                onClick={() => setSelectedBookingModal(null)}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
