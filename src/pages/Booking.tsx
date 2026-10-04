import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  MapPin,
  Star,
  Clock,
  CheckCircle2,
  Calendar as CalendarIcon,
  Shield,
  CreditCard,
  Smartphone,
  AlertCircle,
  User,
  Mail,
  Phone,
  Home as HomeIcon,
  FileText,
  Check,
  ArrowRight,
  ArrowLeft,
  Building2,
  Sparkles,
  Upload,
  X,
  Printer,
  Info,
  HeartPulse,
  Banknote
} from "lucide-react";

interface LabOption {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  distance: string;
  address: string;
  price: number;
  features: string[];
}

interface TestInfo {
  id: string;
  name: string;
  type: string;
  price: number;
  originalPrice?: number;
  fastingRequired: boolean;
  reportTime: string;
  parameters?: string[];
  description?: string;
}

const DEFAULT_LABS: LabOption[] = [
  {
    id: "l1",
    name: "Diagnopein Diagnostics",
    rating: 4.8,
    reviews: 1240,
    distance: "1.8 km away",
    address: "Prime Square, Near Balewadi High Street, Baner, Pune",
    price: 399,
    features: ["NABL Accredited", "Free Home Collection", "Digital Report in 24h", "Barcoded Vials"]
  },
  {
    id: "l2",
    name: "Krsnaa Diagnostics",
    rating: 4.6,
    reviews: 850,
    distance: "2.5 km away",
    address: "Hinjawadi IT Park Phase 1, Wakad Road, Pune",
    price: 450,
    features: ["NABL Accredited", "Home Sample Pickup", "Automated Analyzers"]
  },
  {
    id: "l3",
    name: "General Diagnostics International",
    rating: 4.7,
    reviews: 2100,
    distance: "3.2 km away",
    address: "Karve Road, Near Paud Phata, Kothrud, Pune",
    price: 420,
    features: ["NABL & CAP Certified", "E-Reports", "Doctor Consultation"]
  },
  {
    id: "l4",
    name: "Agilus Diagnostics",
    rating: 4.9,
    reviews: 3400,
    distance: "4.1 km away",
    address: "Old Mumbai-Pune Highway, Pimpri-Chinchwad, Pune",
    price: 499,
    features: ["Hospital Grade", "NABL Certified", "Priority Processing"]
  }
];

const TIME_SLOTS = [
  {
    category: "Morning Fasting Slots (Recommended)",
    isFastingIdeal: true,
    slots: [
      { time: "06:30 AM - 07:30 AM", tag: "Early Bird", available: true },
      { time: "07:30 AM - 08:30 AM", tag: "Most Popular", available: true },
      { time: "08:30 AM - 09:30 AM", tag: "Available", available: true },
      { time: "09:30 AM - 10:30 AM", tag: "Available", available: true }
    ]
  },
  {
    category: "Daytime & Afternoon Slots",
    isFastingIdeal: false,
    slots: [
      { time: "11:00 AM - 12:00 PM", tag: "Available", available: true },
      { time: "02:00 PM - 03:00 PM", tag: "Available", available: true },
      { time: "04:00 PM - 05:00 PM", tag: "Available", available: true },
      { time: "05:30 PM - 06:30 PM", tag: "Evening", available: true }
    ]
  }
];

export default function Booking() {
  const { testId } = useParams();
  const [searchParams] = useSearchParams();
  const initialLabId = searchParams.get("labId");
  const navigate = useNavigate();

  // Multi-step form state
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Lab, 2: Form, 3: Review & Payment, 4: Confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Test information state
  const [testData, setTestData] = useState<TestInfo>({
    id: testId || "t1",
    name: "Diagnostic Health Test",
    type: "test",
    price: 399,
    originalPrice: 500,
    fastingRequired: false,
    reportTime: "24 Hours",
    description: "Standard diagnostic screening test"
  });

  // Selected Lab & Service Mode
  const [selectedLabId, setSelectedLabId] = useState<string>(initialLabId || "l1");
  const [labOptions, setLabOptions] = useState<LabOption[]>(DEFAULT_LABS);
  const [collectionType, setCollectionType] = useState<"home" | "lab">("home");

  // Booking Form State: Patient Details
  const [bookingFor, setBookingFor] = useState<string>("Myself");
  const [patientName, setPatientName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [medicalNotes, setMedicalNotes] = useState<string>("");
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);

  // Booking Form State: Preferred Slot
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [fastingConfirmed, setFastingConfirmed] = useState<boolean>(false);

  // Booking Form State: Contact & Location Information
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [altPhone, setAltPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [landmark, setLandmark] = useState<string>("");
  const [city, setCity] = useState<string>("Pune");
  const [pincode, setPincode] = useState<string>("411045");

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<"pay_on_collection" | "online">("online");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentGatewayStatus, setPaymentGatewayStatus] = useState<"idle" | "processing" | "success">("idle");
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Form Validation State
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Helper date calculations
  const todayStr = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 14);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  const dayAfterStr = dayAfter.toISOString().split("T")[0];

  // Fetch test details on mount
  useEffect(() => {
    let isMounted = true;
    if (testId) {
      fetch(`/api/tests/${testId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then((data) => {
          if (isMounted && data) {
            setTestData({
              id: data.id || data._id || testId,
              name: data.name,
              type: data.type || "test",
              price: data.price || 399,
              originalPrice: data.originalPrice || Math.round(data.price * 1.3),
              fastingRequired: Boolean(data.fastingRequired),
              reportTime: data.reportTime || "24 Hours",
              description: data.description
            });
            if (data.labPricing && Array.isArray(data.labPricing)) {
              setLabOptions((prev) =>
                prev.map((lab) => {
                  const entry = data.labPricing.find((lp: any) => lp.labId === lab.id);
                  if (entry) {
                    return {
                      ...lab,
                      price: entry.price,
                      features: [
                        ...lab.features.filter((f: string) => !f.toLowerCase().includes("report in")),
                        `Digital Report in ${entry.reportTime}`
                      ]
                    };
                  }
                  return lab;
                })
              );
            }
            if (initialLabId) {
              setSelectedLabId(initialLabId);
            } else if (data.lab?._id || data.lab?.id) {
              setSelectedLabId(data.lab._id || data.lab.id);
            }
          }
        })
        .catch(() => {
          // If fetching fails or test is custom, try mock test lookup
          if (testId === "pkg1" || testId.includes("pkg") || testId.includes("body")) {
            setTestData({
              id: "pkg1",
              name: "Comprehensive Full Body Checkup",
              type: "package",
              price: 2499,
              originalPrice: 4999,
              fastingRequired: true,
              reportTime: "36 Hours",
              description: "Complete 85-parameter health assessment including heart, liver, kidney, and thyroid"
            });
          } else if (testId === "t2" || testId.includes("lipid")) {
            setTestData({
              id: "t2",
              name: "Lipid Profile (Cholesterol)",
              type: "test",
              price: 599,
              originalPrice: 800,
              fastingRequired: true,
              reportTime: "24 Hours",
              description: "Measures cholesterol and triglyceride levels to assess heart health"
            });
          } else {
            setTestData({
              id: testId,
              name: "Complete Blood Count (CBC)",
              type: "test",
              price: 399,
              originalPrice: 500,
              fastingRequired: false,
              reportTime: "24 Hours",
              description: "Measures RBC, WBC, Hemoglobin, and Platelet count"
            });
          }
        });
    }

    // Default preferred date to tomorrow
    if (!selectedDate) {
      setSelectedDate(tomorrowStr);
    }
    if (!selectedTimeSlot) {
      setSelectedTimeSlot("07:30 AM - 08:30 AM");
    }

    return () => {
      isMounted = false;
    };
  }, [testId, tomorrowStr]);

  // Validation function
  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Patient Name
    if (!patientName.trim()) {
      errors.patientName = "Patient full name is required";
    } else if (patientName.trim().length < 2) {
      errors.patientName = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s.'-]+$/.test(patientName.trim())) {
      errors.patientName = "Name should contain only valid letters";
    }

    // Age
    const parsedAge = parseInt(age, 10);
    if (!age || isNaN(parsedAge)) {
      errors.age = "Valid age is required";
    } else if (parsedAge < 1 || parsedAge > 120) {
      errors.age = "Age must be between 1 and 120";
    }

    // Phone (10 digits Indian mobile validation)
    const cleanPhone = phone.replace(/\D/g, "");
    if (!phone.trim()) {
      errors.phone = "Mobile phone number is required";
    } else if (cleanPhone.length !== 10 && !(cleanPhone.length === 12 && cleanPhone.startsWith("91"))) {
      errors.phone = "Enter a valid 10-digit mobile number";
    }

    // Email
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address (e.g. name@example.com)";
    }

    // Slot Date
    if (!selectedDate) {
      errors.selectedDate = "Please choose a booking date";
    } else if (selectedDate < todayStr) {
      errors.selectedDate = "Appointment date cannot be in the past";
    }

    // Slot Time
    if (!selectedTimeSlot) {
      errors.selectedTimeSlot = "Please choose a preferred time slot";
    }

    // Home Collection Address
    if (collectionType === "home") {
      if (!address.trim()) {
        errors.address = "Street address and house/flat number is required for home collection";
      } else if (address.trim().length < 8) {
        errors.address = "Please provide complete street & flat address (at least 8 chars)";
      }

      if (!pincode.trim()) {
        errors.pincode = "6-digit postal pincode is required";
      } else if (!/^\d{6}$/.test(pincode.trim())) {
        errors.pincode = "Enter a valid 6-digit postal pincode";
      }
    }

    // Fasting Confirmation
    if (testData.fastingRequired && !fastingConfirmed) {
      errors.fastingConfirmed = "Please confirm that the patient will adhere to 10-12 hours fasting requirement";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  // Lab calculation
  const selectedLab = labOptions.find((l) => l.id === selectedLabId) || labOptions[0];
  const basePrice = selectedLab ? selectedLab.price : testData.price;
  const isSenior = parseInt(age, 10) >= 60;
  const seniorDiscount = isSenior ? Math.round(basePrice * 0.1) : 0;
  const homeCollectionFee = 0; // Free home collection promotion
  const finalAmount = Math.max(0, basePrice - seniorDiscount + homeCollectionFee);

  // Handler for form progression
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    // Mark all fields as touched
    setTouched({
      patientName: true,
      age: true,
      phone: true,
      email: true,
      selectedDate: true,
      selectedTimeSlot: true,
      address: true,
      pincode: true,
      fastingConfirmed: true
    });

    if (validateForm()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Submit to Database
  const submitBookingToDatabase = async (paymentRef?: string, finalPayStatus?: string) => {
    setIsSubmitting(true);
    setServerError(null);

    const payload = {
      testId: testData.id,
      testName: testData.name,
      labId: selectedLab.id,
      labName: selectedLab.name,
      patientName: patientName.trim(),
      age: parseInt(age, 10),
      gender,
      phone: phone.trim(),
      email: email.trim(),
      altPhone: altPhone.trim(),
      address: collectionType === "home" ? address.trim() : `${selectedLab.name} Center Visit, ${selectedLab.address}`,
      landmark: landmark.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
      collectionType,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      amount: finalAmount,
      bookingFor,
      notes: medicalNotes.trim(),
      fastingConfirmed,
      paymentStatus: finalPayStatus || (paymentMethod === "pay_on_collection" ? "Pending (Pay on Visit)" : "Paid"),
      paymentId: paymentRef || (paymentMethod === "online" ? `TXN_${Date.now()}` : "CASH_ON_COLLECTION"),
      prescriptionAttached: Boolean(prescriptionFile)
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit booking to database.");
      }

      const savedData = await response.json();
      setConfirmedBooking(savedData);

      // Save to localStorage as well so it's readily accessible in user history
      try {
        const existingStored = JSON.parse(localStorage.getItem("shree_user_bookings") || "[]");
        localStorage.setItem("shree_user_bookings", JSON.stringify([savedData, ...existingStored]));
      } catch (err) {
        console.warn("Could not cache to localStorage", err);
      }

      setIsSubmitting(false);
      setStep(4); // Move to confirmation
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Booking error:", err);
      setServerError(err.message || "An unexpected error occurred while saving your booking. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Online Payment Simulation Handler
  const handleStartOnlinePayment = () => {
    setShowPaymentModal(true);
    setPaymentGatewayStatus("idle");
  };

  const processSimulatedPayment = () => {
    setPaymentGatewayStatus("processing");
    setTimeout(() => {
      setPaymentGatewayStatus("success");
      setTimeout(async () => {
        setShowPaymentModal(false);
        await submitBookingToDatabase(`RZP_${Math.floor(10000000 + Math.random() * 90000000)}`, "Paid");
      }, 1200);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Indicator Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
              Shree Diagnostics Online Booking
            </span>
            <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
              Step {step} of 4
            </span>
          </div>

          <div className="relative">
            <div className="overflow-hidden h-2 flex rounded-full bg-slate-200">
              <div
                style={{ width: `${((step - 1) / 3) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
              />
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-600 mt-2.5">
              <button
                type="button"
                onClick={() => step > 1 && setStep(1)}
                className={`flex items-center gap-1 ${step >= 1 ? "text-blue-700 font-semibold" : "text-slate-400"}`}
              >
                1. Select Lab
              </button>
              <button
                type="button"
                onClick={() => step > 2 && setStep(2)}
                className={`flex items-center gap-1 ${step >= 2 ? "text-blue-700 font-semibold" : "text-slate-400"}`}
              >
                2. Details & Slot
              </button>
              <button
                type="button"
                onClick={() => step > 3 && setStep(3)}
                className={`flex items-center gap-1 ${step >= 3 ? "text-blue-700 font-semibold" : "text-slate-400"}`}
              >
                3. Review Order
              </button>
              <span className={step === 4 ? "text-blue-700 font-semibold" : "text-slate-400"}>
                4. Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* Selected Test Card Banner */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <span>{testData.type === "package" ? "Health Package" : "Diagnostic Test"}</span>
                <span>·</span>
                <span className="text-emerald-700 font-medium">Home Collection Available</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 mt-0.5">{testData.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-1.5">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" /> Reports in {testData.reportTime}
                </span>
                {testData.fastingRequired ? (
                  <span className="text-amber-700 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> 10-12 hrs Fasting Required
                  </span>
                ) : (
                  <span className="text-slate-500">No Fasting Required</span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6 shrink-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
            <div className="text-xs text-slate-500">Starts from</div>
            <div className="text-2xl font-bold text-slate-900">₹{selectedLab.price}</div>
            {testData.originalPrice && (
              <div className="text-xs text-slate-400 line-through">₹{testData.originalPrice}</div>
            )}
          </div>
        </div>

        {/* ================= STEP 1: SELECT LAB & SERVICE TYPE ================= */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Service Delivery Mode */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-1">Choose Service Delivery Mode</h2>
              <p className="text-xs text-slate-500 mb-4">
                Select whether our trained phlebotomist visits your doorstep or you visit the lab center.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setCollectionType("home")}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                    collectionType === "home"
                      ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-lg shrink-0 ${
                      collectionType === "home" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <HomeIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">Home Sample Collection</span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        FREE
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Certified phlebotomist collects blood / urine sample in safe sterile containers at your address.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCollectionType("lab")}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                    collectionType === "lab"
                      ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-lg shrink-0 ${
                      collectionType === "lab" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Visit Diagnostic Center</div>
                    <p className="text-xs text-slate-500 mt-1">
                      Walk in at the partner lab location at your scheduled time slot with zero waiting queue.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Partner Labs List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Select Accredited Partner Lab</h2>
                  <p className="text-xs text-slate-500">
                    Compare certified laboratories offering tests in your region.
                  </p>
                </div>
              </div>

              {labOptions.map((lab) => {
                const isSelected = selectedLabId === lab.id;
                return (
                  <div
                    key={lab.id}
                    onClick={() => setSelectedLabId(lab.id)}
                    className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer ${
                      isSelected
                        ? "border-blue-600 ring-2 ring-blue-500/20 shadow-md"
                        : "border-slate-200 hover:border-slate-300 shadow-xs"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <h3 className="font-bold text-slate-900 text-base">{lab.name}</h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 ml-6">
                          <span className="flex items-center font-semibold text-amber-600">
                            <Star className="h-3.5 w-3.5 fill-current mr-1" />
                            {lab.rating} ({lab.reviews} reviews)
                          </span>
                          <span>·</span>
                          <span className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 text-slate-400 mr-1" />
                            {lab.distance} · {lab.address}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 ml-6 pt-1">
                          {lab.features.map((feature) => (
                            <span
                              key={feature}
                              className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-6 shrink-0">
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Total Price</div>
                          <div className="text-2xl font-bold text-slate-900">₹{lab.price}</div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLabId(lab.id);
                            setStep(2);
                          }}
                          className={`mt-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {isSelected ? "Selected · Next" : "Select Lab"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm"
              >
                Proceed to Patient Details & Slot <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: ROBUST BOOKING FORM ================= */}
        {step === 2 && (
          <form onSubmit={handleProceedToReview} className="space-y-6" noValidate>
            {/* Header with Lab Summary & Change Option */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex justify-between items-center">
              <div>
                <div className="text-xs text-slate-500 font-medium">Selected Partner Lab:</div>
                <div className="text-base font-bold text-slate-900">{selectedLab.name}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="h-3 w-3" /> {selectedLab.address}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline px-3 py-1.5 border border-blue-200 rounded-lg bg-blue-50/50"
              >
                Change Lab
              </button>
            </div>

            {/* SECTION 1: PATIENT DETAILS */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" /> 1. Patient Details
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Accurate details are vital for generating your doctor-approved diagnostic report.
                </p>
              </div>

              {/* Booking For segmented control */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Who is this booking for? <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {["Myself", "Parent / Senior", "Spouse", "Child", "Other"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setBookingFor(option)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                        bookingFor === option
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name & Age & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Patient Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={patientName}
                    onChange={(e) => {
                      setPatientName(e.target.value);
                      if (formErrors.patientName) validateForm();
                    }}
                    onBlur={() => handleBlur("patientName")}
                    className={`w-full px-4 py-2.5 text-sm bg-slate-50/50 border rounded-xl outline-none transition-all ${
                      touched.patientName && formErrors.patientName
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/10"
                        : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 bg-white"
                    }`}
                  />
                  {touched.patientName && formErrors.patientName && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" /> {formErrors.patientName}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Age (Years) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    required
                    placeholder="35"
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value);
                      if (formErrors.age) validateForm();
                    }}
                    onBlur={() => handleBlur("age")}
                    className={`w-full px-4 py-2.5 text-sm bg-slate-50/50 border rounded-xl outline-none transition-all ${
                      touched.age && formErrors.age
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 bg-white"
                    }`}
                  />
                  {isSenior && (
                    <p className="text-[11px] text-emerald-700 font-medium mt-1">
                      🎉 10% Senior Citizen Discount Applied!
                    </p>
                  )}
                  {touched.age && formErrors.age && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" /> {formErrors.age}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex rounded-xl border border-slate-300 overflow-hidden bg-white p-1 gap-1">
                    {(["Male", "Female", "Other"] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          gender === g ? "bg-blue-600 text-white font-bold" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Optional Medical Notes & Phlebotomist Instructions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Medical Notes / Phlebotomist Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Patient has difficulty with veins, wheelchair assistance needed, or on blood thinner medication..."
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                />
              </div>

              {/* Optional Prescription Upload */}
              <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/60">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Upload className="h-4 w-4 text-blue-600" /> Doctor Prescription (Optional)
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Upload doctor's prescription slip (PDF, JPG, PNG up to 5MB) for phlebotomist reference.
                    </p>
                  </div>
                  <div>
                    {prescriptionFile ? (
                      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-800">
                        <FileText className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[150px]">{prescriptionFile.name}</span>
                        <button
                          type="button"
                          onClick={() => setPrescriptionFile(null)}
                          className="text-slate-400 hover:text-rose-600 ml-1"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:border-slate-400 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 shadow-xs transition-colors">
                        <Upload className="h-3.5 w-3.5" /> Attach File
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setPrescriptionFile(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: PREFERRED SLOT & APPOINTMENT TIME */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600" /> 2. Preferred Appointment Slot
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your convenient date and 1-hour time window for sample collection.
                </p>
              </div>

              {/* Fasting Notice Banner (if test requires fasting) */}
              {testData.fastingRequired && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Important Medical Preparation Notice:</span> This test requires{" "}
                      <span className="font-bold underline">10-12 hours of overnight fasting</span>. Morning slots between
                      06:30 AM and 09:30 AM are strongly recommended. Only plain water is permitted before sample collection.
                    </div>
                  </div>

                  <label className="flex items-center gap-2 pt-1 font-medium cursor-pointer text-amber-950">
                    <input
                      type="checkbox"
                      checked={fastingConfirmed}
                      onChange={(e) => {
                        setFastingConfirmed(e.target.checked);
                        if (formErrors.fastingConfirmed) validateForm();
                      }}
                      className="w-4 h-4 text-blue-600 rounded border-amber-300 focus:ring-blue-500"
                    />
                    <span>I confirm the patient will adhere to 10-12 hours fasting requirement.</span>
                  </label>
                  {touched.fastingConfirmed && formErrors.fastingConfirmed && (
                    <p className="text-xs text-rose-600 mt-1 font-semibold">{formErrors.fastingConfirmed}</p>
                  )}
                </div>
              )}

              {/* Date Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Date <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDate(todayStr);
                      if (formErrors.selectedDate) validateForm();
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedDate === todayStr
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDate(tomorrowStr);
                      if (formErrors.selectedDate) validateForm();
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedDate === tomorrowStr
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDate(dayAfterStr);
                      if (formErrors.selectedDate) validateForm();
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedDate === dayAfterStr
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Day After Tomorrow
                  </button>
                </div>

                <div className="max-w-xs">
                  <input
                    type="date"
                    required
                    min={todayStr}
                    max={maxDateStr}
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      if (formErrors.selectedDate) validateForm();
                    }}
                    onBlur={() => handleBlur("selectedDate")}
                    className={`w-full px-4 py-2 text-sm bg-slate-50/50 border rounded-xl outline-none transition-all ${
                      touched.selectedDate && formErrors.selectedDate
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-300 focus:border-blue-600 bg-white"
                    }`}
                  />
                  {touched.selectedDate && formErrors.selectedDate && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" /> {formErrors.selectedDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Time Slot Selection Categories */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Preferred Time Slot <span className="text-rose-500">*</span>
                </label>

                <div className="space-y-4">
                  {TIME_SLOTS.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-2">
                      <div className="text-xs font-bold text-slate-600 flex items-center justify-between">
                        <span>{group.category}</span>
                        {group.isFastingIdeal && (
                          <span className="text-[11px] font-semibold text-emerald-700">Ideal for blood sugar & lipids</span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        {group.slots.map((slot) => {
                          const isSlotSelected = selectedTimeSlot === slot.time;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              onClick={() => {
                                setSelectedTimeSlot(slot.time);
                                if (formErrors.selectedTimeSlot) validateForm();
                              }}
                              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                                isSlotSelected
                                  ? "border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs"
                                  : "border-slate-200 hover:border-slate-300 bg-white"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-bold ${isSlotSelected ? "text-blue-900" : "text-slate-800"}`}>
                                  {slot.time}
                                </span>
                                {isSlotSelected && <Check className="h-4 w-4 text-blue-600" />}
                              </div>
                              <span
                                className={`text-[10px] font-medium mt-1 ${
                                  isSlotSelected
                                    ? "text-blue-700 font-semibold"
                                    : slot.tag.includes("Popular")
                                    ? "text-amber-700"
                                    : "text-slate-500"
                                }`}
                              >
                                {slot.tag}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {touched.selectedTimeSlot && formErrors.selectedTimeSlot && (
                  <p className="text-xs text-rose-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {formErrors.selectedTimeSlot}
                  </p>
                )}
              </div>
            </div>

            {/* SECTION 3: CONTACT & COLLECTION LOCATION */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" /> 3. Contact & Address Details
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  We send SMS status alerts, OTP, and PDF reports directly to these contact coordinates.
                </p>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Primary Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      maxLength={12}
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (formErrors.phone) validateForm();
                      }}
                      onBlur={() => handleBlur("phone")}
                      className={`w-full pl-12 pr-4 py-2.5 text-sm bg-slate-50/50 border rounded-xl outline-none transition-all ${
                        touched.phone && formErrors.phone
                          ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                          : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 bg-white"
                      }`}
                    />
                  </div>
                  {touched.phone && formErrors.phone && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" /> {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address (For Digital E-Reports)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="patient@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (formErrors.email) validateForm();
                      }}
                      onBlur={() => handleBlur("email")}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border rounded-xl outline-none transition-all ${
                        touched.email && formErrors.email
                          ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                          : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 bg-white"
                      }`}
                    />
                  </div>
                  {touched.email && formErrors.email && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" /> {formErrors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Alternate Phone Number */}
              <div className="sm:max-w-xs">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Alternate Contact Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="Optional alternate mobile"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
                />
              </div>

              {/* Address Section based on Collection Type */}
              {collectionType === "home" ? (
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Home Sample Collection Address <span className="text-rose-500">*</span>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Flat / House No., Building Name & Street Address
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. Flat 302, Building 4B, Harmony Heights, Link Road..."
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (formErrors.address) validateForm();
                      }}
                      onBlur={() => handleBlur("address")}
                      className={`w-full px-4 py-2.5 text-sm bg-slate-50/50 border rounded-xl outline-none transition-all resize-none ${
                        touched.address && formErrors.address
                          ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                          : "border-slate-300 focus:border-blue-600 bg-white"
                      }`}
                    />
                    {touched.address && formErrors.address && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" /> {formErrors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Landmark (Optional)</label>
                      <input
                        type="text"
                        placeholder="Near Metro Station"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-xl outline-none focus:border-blue-600 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-600 mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-xl outline-none focus:border-blue-600 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-600 mb-1">
                        Postal Pincode <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="400069"
                        value={pincode}
                        onChange={(e) => {
                          setPincode(e.target.value);
                          if (formErrors.pincode) validateForm();
                        }}
                        onBlur={() => handleBlur("pincode")}
                        className={`w-full px-3.5 py-2 text-sm bg-slate-50/50 border rounded-xl outline-none transition-all ${
                          touched.pincode && formErrors.pincode
                            ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                            : "border-slate-300 focus:border-blue-600 bg-white"
                        }`}
                      />
                      {touched.pincode && formErrors.pincode && (
                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5" /> {formErrors.pincode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Center Walk-In Location:</div>
                    <div className="mt-1 font-medium">{selectedLab.name}</div>
                    <div className="text-slate-500">{selectedLab.address}</div>
                    <div className="text-slate-500 mt-1">Please show your Booking SMS/ID at reception. Zero waiting queue.</div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700 text-sm transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Lab Selection
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                Review Order & Submit <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 3: REVIEW & PAYMENT ================= */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900">Review Your Booking Details</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Please review the patient details and appointment slot before confirming your order.
                </p>
              </div>

              {serverError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Submission Error:</span> {serverError}
                  </div>
                </div>
              )}

              {/* Order Overview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Summary */}
                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Summary</span>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs text-blue-600 font-semibold hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Name:</span>
                      <span className="font-bold text-slate-900">{patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Age & Gender:</span>
                      <span className="font-semibold text-slate-800">
                        {age} Yrs · {gender} {isSenior && "(Senior Citizen)"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Booking For:</span>
                      <span className="font-medium text-slate-800">{bookingFor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-medium text-slate-800">+91 {phone}</span>
                    </div>
                    {email && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Email:</span>
                        <span className="font-medium text-slate-800">{email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Slot & Service Summary */}
                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Appointment Slot</span>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs text-blue-600 font-semibold hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Service:</span>
                      <span className="font-bold text-blue-700">
                        {collectionType === "home" ? "Home Sample Collection" : "Center Walk-In"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date:</span>
                      <span className="font-bold text-slate-900">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Time Window:</span>
                      <span className="font-semibold text-slate-800">{selectedTimeSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Lab Partner:</span>
                      <span className="font-medium text-slate-800">{selectedLab.name}</span>
                    </div>
                    {collectionType === "home" ? (
                      <div className="text-xs text-slate-600 pt-1 border-t border-slate-200">
                        <span className="font-medium text-slate-800">Address: </span>
                        {address}, {landmark && `${landmark}, `}{city} - {pincode}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-600 pt-1 border-t border-slate-200">
                        <span className="font-medium text-slate-800">Lab Location: </span>
                        {selectedLab.address}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bill Details Breakdown */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price Breakdown</div>
                <div className="flex justify-between text-sm text-slate-700">
                  <span>{testData.name} (Partner Lab Fee)</span>
                  <span className="font-semibold">₹{basePrice}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-700">
                  <span className="flex items-center gap-1.5">
                    Doorstep Home Sample Pickup
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                      Promo
                    </span>
                  </span>
                  <span className="font-semibold text-emerald-600">FREE (₹0)</span>
                </div>
                {isSenior && (
                  <div className="flex justify-between text-sm text-emerald-700 font-medium">
                    <span>Senior Citizen Welfare Discount (10%)</span>
                    <span>-₹{seniorDiscount}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-lg font-bold text-slate-900">
                  <span>Total Amount Payable</span>
                  <span className="text-2xl text-blue-700">₹{finalAmount}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Choose Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("online")}
                    className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      paymentMethod === "online"
                        ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        paymentMethod === "online" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">Pay Online Securely</div>
                      <div className="text-xs text-slate-500 mt-0.5">UPI, Debit/Credit Card, Net Banking</div>
                      <div className="text-[11px] text-blue-700 font-semibold mt-1">Instant confirmation & priority queue</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("pay_on_collection")}
                    className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      paymentMethod === "pay_on_collection"
                        ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        paymentMethod === "pay_on_collection" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Banknote className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">Pay on Collection (Cash/UPI)</div>
                      <div className="text-xs text-slate-500 mt-0.5">Pay phlebotomist directly at doorstep</div>
                      <div className="text-[11px] text-slate-600 mt-1">Zero advance payment required</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700 text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Edit Details
                </button>

                {paymentMethod === "online" ? (
                  <button
                    type="button"
                    onClick={handleStartOnlinePayment}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    Pay ₹{finalAmount} & Confirm Booking <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => submitBookingToDatabase("CASH_ON_DELIVERY", "Pending (Pay on Visit)")}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting to Database...
                      </>
                    ) : (
                      <>
                        Confirm Booking (Pay ₹{finalAmount} on Visit) <Check className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: SUCCESS CONFIRMATION ================= */}
        {step === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md text-center max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Booking Successfully Confirmed
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">Your Diagnostic Test is Booked!</h2>
              <p className="text-slate-600 text-sm mt-1">
                A confirmation SMS & email have been dispatched with tracking link.
              </p>
            </div>

            {/* Reference Badge */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <span className="text-xs text-slate-500 font-semibold">Booking Reference ID:</span>
                <span className="font-mono text-base font-bold text-blue-700">
                  {confirmedBooking?.bookingRef || confirmedBooking?.id || confirmedBooking?._id || "SHR-CONFIRMED"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-slate-700">
                <div>
                  <div className="text-slate-400 font-medium">Patient Name</div>
                  <div className="font-bold text-slate-900 mt-0.5">{confirmedBooking?.patientName || patientName}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Scheduled Date</div>
                  <div className="font-bold text-slate-900 mt-0.5">{confirmedBooking?.date || selectedDate}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Time Slot</div>
                  <div className="font-bold text-slate-900 mt-0.5">{confirmedBooking?.timeSlot || selectedTimeSlot}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Payment Status</div>
                  <div className="font-bold text-emerald-700 mt-0.5">
                    {confirmedBooking?.paymentStatus || (paymentMethod === "online" ? "Paid Online" : "Pay on Collection")}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-slate-400 font-medium">Service Mode</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {collectionType === "home" ? `Home Sample Collection (${address})` : `Center Walk-In at ${selectedLab.name}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps note */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-900 text-left space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <Info className="h-4 w-4 text-blue-600" /> What happens next?
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 ml-1">
                <li>
                  {collectionType === "home"
                    ? "Our certified phlebotomist will call 30 minutes prior to arrival."
                    : `Please visit ${selectedLab.name} during your booked slot.`}
                </li>
                {testData.fastingRequired && (
                  <li className="text-amber-800 font-medium">
                    Reminder: Maintain 10-12 hours fasting before your slot.
                  </li>
                )}
                <li>Digital test report will be delivered within {testData.reportTime} to your email & dashboard.</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-bold text-sm transition-all shadow-sm"
              >
                View in My Dashboard
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700 text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="h-4 w-4" /> Print Booking Slip
              </button>
              <Link
                to="/search"
                className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700 text-sm transition-colors flex items-center justify-center"
              >
                Book Another Test
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ================= SIMULATED PAYMENT GATEWAY MODAL ================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col pt-2 animate-in fade-in zoom-in-95 duration-200">
            {/* Fake Gateway Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-800">
                <Shield className="h-5 w-5 text-emerald-500" />
                <span className="tracking-tight text-blue-900 font-black text-lg flex items-center">
                  Secure<span className="text-slate-600 font-normal">Pay</span>
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Test Mode</div>
            </div>

            {/* Gateway Body */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-black text-slate-900">₹{finalAmount}</div>
                <div className="text-xs text-slate-500 mt-1">Shree Diagnostics Booking</div>
                <div className="text-[11px] text-slate-400">Patient: {patientName}</div>
              </div>

              {paymentGatewayStatus === "idle" && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Select Payment Method</p>

                  <button
                    type="button"
                    onClick={processSimulatedPayment}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">Instant UPI</div>
                        <div className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </button>

                  <button
                    type="button"
                    onClick={processSimulatedPayment}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">Credit / Debit Card</div>
                        <div className="text-[11px] text-slate-500">Visa, MasterCard, RuPay</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              )}

              {paymentGatewayStatus === "processing" && (
                <div className="flex flex-col flex-1 py-10 items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
                  <p className="font-bold text-slate-800 text-sm">Authorizing Payment...</p>
                  <p className="text-xs text-slate-400 text-center">Contacting bank gateway securely.</p>
                </div>
              )}

              {paymentGatewayStatus === "success" && (
                <div className="flex flex-col flex-1 py-8 items-center justify-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Payment Successful</h3>
                  <p className="text-xs text-slate-500 text-center">Saving booking to database...</p>
                </div>
              )}
            </div>

            {/* Gateway Footer */}
            <div className="bg-slate-50 p-4 flex justify-between items-center text-xs text-slate-400 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-emerald-600" /> 256-Bit Encrypted
              </span>
              {paymentGatewayStatus === "idle" && (
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="text-slate-500 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
