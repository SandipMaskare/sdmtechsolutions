import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Suspense, lazy } from "react";
import RequireRole from "@/components/portal/RequireRole";
import PageNav from "@/components/PageNav";

const ChatWidget = lazy(() => import("@/components/ChatWidget"));

const queryClient = new QueryClient();

/* ========= LAZY LOADED PAGES ========= */

// Public Pages
const Index = lazy(() => import("./pages/Index"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const JobDetailPage = lazy(() => import("./pages/JobDetailPage"));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage"));
const InternshipsPage = lazy(() => import("./pages/InternshipsPage"));
const AccountPage = lazy(() => import("./pages/account/AccountPage"));

// Employee and intern portals
const PortalLogin = lazy(() => import("./pages/portal/PortalLogin"));
const PortalDashboard = lazy(() => import("./pages/portal/PortalDashboard"));
const PortalWork = lazy(() => import("./pages/portal/PortalWork"));
const PortalSubmissions = lazy(() => import("./pages/portal/PortalSubmissions"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

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
              <Route path="/internships" element={<InternshipsPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/careers/:id" element={<JobDetailPage />} />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/profile" element={<ProfilePage />} />

              <Route path="/account" element={<AccountPage />} />

              {/* Employee portal */}
              <Route path="/employee/login" element={<PortalLogin kind="employee" />} />
              <Route path="/employee" element={<RequireRole role="employee"><PortalDashboard kind="employee" /></RequireRole>} />
              <Route path="/employee/work" element={<RequireRole role="employee"><PortalWork kind="employee" /></RequireRole>} />
              <Route path="/employee/submissions" element={<RequireRole role="employee"><PortalSubmissions kind="employee" /></RequireRole>} />

              {/* Intern portal */}
              <Route path="/intern/login" element={<PortalLogin kind="intern" />} />
              <Route path="/intern" element={<RequireRole role="intern"><PortalDashboard kind="intern" /></RequireRole>} />
              <Route path="/intern/work" element={<RequireRole role="intern"><PortalWork kind="intern" /></RequireRole>} />
              <Route path="/intern/submissions" element={<RequireRole role="intern"><PortalSubmissions kind="intern" /></RequireRole>} />

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

            <ChatWidget />
          </Suspense>
          <PageNav />

        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
