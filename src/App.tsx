
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientDetails from "./pages/PatientDetails";
import Diagnose from "./pages/Diagnose";
import Models from "./pages/Models";
import PatientPortal from "./pages/PatientPortal";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patients" 
              element={
                <ProtectedRoute>
                  <Patients />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patients/:id" 
              element={
                <ProtectedRoute>
                  <PatientDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/diagnose" 
              element={
                <ProtectedRoute>
                  <Diagnose />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/models" 
              element={
                <ProtectedRoute>
                  <Models />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient-portal" 
              element={
                <ProtectedRoute>
                  <PatientPortal />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
        
        {/* UI components */}
        <Toaster />
        <Sonner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
