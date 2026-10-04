import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import LabDetails from "./pages/LabDetails";
import ItemDetails from "./pages/ItemDetails";
import Booking from "./pages/Booking";
import Dashboard from "./pages/Dashboard";
import MedicalRecords from "./pages/MedicalRecords";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="item/:id" element={<ItemDetails />} />
          <Route path="labs/:id" element={<LabDetails />} />
          <Route path="book/:testId" element={<Booking />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="records" element={<MedicalRecords />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
