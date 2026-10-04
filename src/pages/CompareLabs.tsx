import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Scale, ArrowLeft, Shield, Clock, CheckCircle2, Building2 } from "lucide-react";
import LabComparisonTable from "../components/LabComparisonTable";

export default function CompareLabs() {
  const { testId } = useParams<{ testId?: string }>();
  const activeTestId = testId || "t1";

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/search"
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Tests & Packages
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <Shield className="h-3.5 w-3.5 text-emerald-600" />
            <span>NABL Accredited Diagnostics · Pune</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 text-xs font-bold uppercase tracking-wider mb-2">
            <Scale className="h-4 w-4 text-blue-600" />
            <span>Multi-Lab Diagnostics Comparison</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Compare Diagnostic Labs Side-by-Side
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Select 2 or more accredited Pune partner laboratories to compare test pricing, report turnaround times, home sample collection availability, and patient ratings side-by-side.
          </p>
        </div>

        {/* Comparison Table Component */}
        <LabComparisonTable
          testId={activeTestId}
          allowTestSwitch={true}
          title="Side-by-Side Laboratory Price & Speed Matrix"
          description="Click checkboxes on partner laboratories to customize your side-by-side comparison. Transparent pricing with no hidden charges."
        />

        {/* Trust & Guarantee Banner */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Standardized Calibration</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                All partnered laboratories comply with NABL and ISO 15189 reference pathology standards.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Turnaround Time Guarantee</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive certified digital test reports on WhatsApp and email strictly within the committed hours.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 shrink-0">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Pune Doorstep Phlebotomy</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Certified phlebotomists visit your home or office in Baner, Kothrud, Wakad, Hinjawadi, and PCMC.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
