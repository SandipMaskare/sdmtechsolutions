import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Suspense, lazy } from "react";

const queryClient = new QueryClient();

/* ========= LAZY LOADED PAGES ========= */

// Public Pages
const Index = lazy(() => import("./pages/Index"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

// CRM Pages
const CRMDashboard = lazy(() => import("./pages/crm/CRMDashboard"));
const EmployeesPage = lazy(() => import("./pages/crm/EmployeesPage"));
const TasksPage = lazy(() => import("./pages/crm/TasksPage"));
const SubmissionsPage = lazy(() => import("./pages/crm/SubmissionsPage"));
const AnalyticsPage = lazy(() => import("./pages/crm/AnalyticsPage"));
const SettingsPage = lazy(() => import("./pages/crm/SettingsPage"));
const MyTasksPage = lazy(() => import("./pages/crm/MyTasksPage"));
const MySubmissionsPage = lazy(() => import("./pages/crm/MySubmissionsPage"));
const PerformancePage = lazy(() => import("./pages/crm/PerformancePage"));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>

          {/* Suspense Wrapper */}
          <Suspense fallback={<div style={{padding: "20px"}}>Loading...</div>}>

            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />

              {/* CRM Routes */}
              <Route path="/crm/dashboard" element={<CRMDashboard />} />
              <Route path="/crm/employees" element={<EmployeesPage />} />
              <Route path="/crm/tasks" element={<TasksPage />} />
              <Route path="/crm/submissions" element={<SubmissionsPage />} />
              <Route path="/crm/analytics" element={<AnalyticsPage />} />
              <Route path="/crm/settings" element={<SettingsPage />} />
              <Route path="/crm/my-tasks" element={<MyTasksPage />} />
              <Route path="/crm/my-submissions" element={<MySubmissionsPage />} />
              <Route path="/crm/performance" element={<PerformancePage />} />

              <Route path="*" element={<NotFound />} />
            </Routes>

          </Suspense>

        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
