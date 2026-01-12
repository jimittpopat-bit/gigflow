import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import SidebarLayout from "./components/SidebarLayout";
import Gigs from "./pages/Gigs";
import Settings from "./pages/Settings";
import CreateGig from "./pages/CreateGig";
import GigDetails from "./pages/GigDetails";
import Applications from "./pages/Applications";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <SidebarLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/gigs" element={<Gigs />} />
        <Route path="/create-gig" element={<CreateGig />} />
        <Route path="/gigs/:id" element={<GigDetails />} />
        <Route path="/applications" element={<Applications />} />

        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
