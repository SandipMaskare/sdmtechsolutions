import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import CareersPage from "./pages/CareersPage";
import ContactPage from "./pages/ContactPage";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// CRM Pages
import CRMDashboard from "./pages/crm/CRMDashboard";
import EmployeesPage from "./pages/crm/EmployeesPage";
import TasksPage from "./pages/crm/TasksPage";
import SubmissionsPage from "./pages/crm/SubmissionsPage";
import AnalyticsPage from "./pages/crm/AnalyticsPage";
import SettingsPage from "./pages/crm/SettingsPage";
import MyTasksPage from "./pages/crm/MyTasksPage";
import MySubmissionsPage from "./pages/crm/MySubmissionsPage";
import PerformancePage from "./pages/crm/PerformancePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
