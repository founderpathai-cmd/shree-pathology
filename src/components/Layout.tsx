import { Outlet, Link, useNavigate } from "react-router-dom";
import { Activity, User, Menu, X, Shield, Phone, MapPin, HeartPulse, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = true;
  const isAdmin = true;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Clinical Announcement Strip */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <MapPin className="h-3 w-3" /> Serving Pune & Pimpri-Chinchwad (PCMC)
            </span>
            <span className="text-slate-500">·</span>
            <span>Free Doorstep Sample Collection Available</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-emerald-400" /> NABL & CAP Accredited Infrastructure
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3 text-cyan-400" /> Helpline: 020-2553-9000
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Primary Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="bg-gradient-to-br from-blue-700 to-cyan-600 p-2 rounded-xl text-white shadow-xs group-hover:scale-105 transition-transform">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                    <span>Shree</span>
                    <span className="text-blue-700">Healthcare</span>
                    <span className="text-slate-500 font-medium text-xs hidden sm:inline">Diagnostics</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">
                    Trusted Diagnostic Service · Pune
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation as requested: Tests & Packages, Home Collection, Partner Labs, Medical Records, About Us */}
            <nav className="hidden lg:flex items-center gap-7">
              <Link
                to="/search"
                className="text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                Tests & Packages
              </Link>
              <Link
                to="/search?type=packages"
                className="text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                Home Collection
              </Link>
              <Link
                to="/search?type=labs"
                className="text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                Partner Labs
              </Link>
              <Link
                to="/compare"
                className="text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50/80 px-2.5 py-1 rounded-md transition-colors uppercase tracking-wider border border-blue-200/50"
              >
                Compare Labs
              </Link>
              <Link
                to="/records"
                className="text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                Medical Records
              </Link>
              <a
                href="#about-shree"
                className="text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                About Us
              </a>

              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200">
                <Link
                  to="/dashboard"
                  className="text-xs font-bold text-slate-800 hover:text-blue-600 flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <User className="h-3.5 w-3.5 text-blue-600" />
                  My Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Admin Portal
                  </Link>
                )}
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 hover:text-slate-900 p-2"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 py-3 px-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
            <Link
              to="/search"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50"
            >
              Tests & Packages
            </Link>
            <Link
              to="/search?type=packages"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50"
            >
              Home Collection
            </Link>
            <Link
              to="/search?type=labs"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50"
            >
              Partner Labs
            </Link>
            <Link
              to="/compare"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-blue-700 bg-blue-50/60 hover:bg-blue-50"
            >
              Compare Labs Side-by-Side
            </Link>
            <Link
              to="/records"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50"
            >
              Medical Records & Reports
            </Link>
            <a
              href="#about-shree"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50"
            >
              About Shree Healthcare
            </a>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="text-xs font-bold text-slate-800 flex items-center gap-1.5"
              >
                <User className="h-4 w-4 text-blue-600" /> Patient Dashboard
              </Link>
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg"
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main App Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer with Shree Healthcare Diagnostics Branding */}
      <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xl font-black text-white tracking-tight">
                    Shree <span className="text-blue-400">Healthcare</span> Diagnostics
                  </span>
                  <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                    Pune · Pimpri-Chinchwad
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Shree Healthcare Diagnostics is Pune's trusted diagnostic service. We provide certified laboratory
                investigations, gentle doorstep home collection, and verified doctor-signed digital reports.
              </p>
              <div className="text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-blue-400" />
                  <span>FC Road, Shivaji Nagar, Pune, Maharashtra 411005</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-blue-400" />
                  <span>+91 20 2553 9000 · +91 98220 12345</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Diagnostics</h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><Link to="/search?q=CBC" className="hover:text-white transition-colors">Complete Blood Count (CBC)</Link></li>
                <li><Link to="/search?q=Lipid" className="hover:text-white transition-colors">Lipid Profile (Cholesterol)</Link></li>
                <li><Link to="/search?q=Thyroid" className="hover:text-white transition-colors">Thyroid Profile (T3, T4, TSH)</Link></li>
                <li><Link to="/search?q=Diabetes" className="hover:text-white transition-colors">HbA1c & Blood Sugar</Link></li>
                <li><Link to="/search?type=packages" className="hover:text-white transition-colors">Full Body Checkups</Link></li>
              </ul>
            </div>

            {/* Service Areas */}
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Service Areas (Pune)</h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><span>Kothrud & Deccan</span></li>
                <li><span>Baner, Aundh & Balewadi</span></li>
                <li><span>Wakad & Hinjawadi IT Park</span></li>
                <li><span>Pimpri-Chinchwad (PCMC)</span></li>
                <li><span>Viman Nagar, Kalyani Nagar & Kharadi</span></li>
              </ul>
            </div>

            {/* Trust & Certifications */}
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Quality Standards</h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> NABL Accredited Partner Labs
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Free Home Sample Pickup
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Same-Day Digital Reports
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 100% Transparent Pricing
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <div>
              &copy; {new Date().getFullYear()} Shree Healthcare Diagnostics. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span className="text-slate-400">Accredited Laboratory Infrastructure</span>
              <span>·</span>
              <Link to="/records" className="hover:text-white">Patient Vault</Link>
              <span>·</span>
              <Link to="/search" className="hover:text-white">Find Tests</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
