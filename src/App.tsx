import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Suspense, lazy } from "react";
import RequireRole from "@/components/portal/RequireRole";
import AppEntry from "@/components/portal/AppEntry";
import AppTabBar from "@/components/app/AppTabBar";
import AdminTabBar from "@/components/app/AdminTabBar";
const AppServices = lazy(() => import("./pages/app/AppServices"));
const AppServiceDetail = lazy(() => import("./pages/app/AppServiceDetail"));
const AppInternships = lazy(() => import("./pages/app/AppInternships"));
const AppCareers = lazy(() => import("./pages/app/AppCareers"));
const AppJobDetail = lazy(() => import("./pages/app/AppJobDetail"));
const AppBlog = lazy(() => import("./pages/app/AppBlog"));
const AppBlogPost = lazy(() => import("./pages/app/AppBlogPost"));
const AppAbout = lazy(() => import("./pages/app/AppAbout"));
const AppContact = lazy(() => import("./pages/app/AppContact"));
const AppAdminHub = lazy(() => import("./pages/app/AppAdminHub"));
import AdBanner from "@/components/app/AdBanner";
const AppHome = lazy(() => import("./pages/AppHome"));
import { isAppMode } from "@/lib/appMode";

import MotionLayer from "@/components/MotionLayer";
const ChatWidget = lazy(() => import("@/components/ChatWidget"));
const CookieConsent = lazy(() => import("@/components/CookieConsent"));

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
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const VerifyPage = lazy(() => import("./pages/VerifyPage"));
const AccountPage = lazy(() => import("./pages/account/AccountPage"));

// Employee and intern portals
const PortalLogin = lazy(() => import("./pages/portal/PortalLogin"));
const PortalDashboard = lazy(() => import("./pages/portal/PortalDashboard"));
const PortalWork = lazy(() => import("./pages/portal/PortalWork"));
const PortalSubmissions = lazy(() => import("./pages/portal/PortalSubmissions"));
const PortalLearn = lazy(() => import("./pages/portal/PortalLearn"));
const PortalProfile = lazy(() => import("./pages/portal/PortalProfile"));
const PortalAnalytics = lazy(() => import("./pages/portal/PortalAnalytics"));
const PortalPayments = lazy(() => import("./pages/portal/PortalPayments"));
const PortalLetters = lazy(() => import("./pages/portal/PortalLetters"));
const PersonProfilePage = lazy(() => import("./pages/crm/PersonProfilePage"));
const TaskLibraryPage = lazy(() => import("./pages/crm/TaskLibraryPage"));
const PaymentsAdminPage = lazy(() => import("./pages/crm/PaymentsAdminPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const Auth = lazy(() => import("./pages/Auth"));
const ForgotAccount = lazy(() => import("./pages/ForgotAccount"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
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

            <MotionLayer>
            <Routes>
              <Route path="/" element={isAppMode() ? <AppHome /> : <Index />} />
              <Route path="/enter" element={<AppEntry />} />
              <Route path="/app/admin" element={<AppAdminHub />} />
              <Route path="/about" element={isAppMode() ? <AppAbout /> : <AboutPage />} />
              <Route path="/services" element={isAppMode() ? <AppServices /> : <ServicesPage />} />
              <Route path="/internships" element={isAppMode() ? <AppInternships /> : <InternshipsPage />} />
              <Route path="/careers" element={isAppMode() ? <AppCareers /> : <CareersPage />} />
              <Route path="/careers/:id" element={isAppMode() ? <AppJobDetail /> : <JobDetailPage />} />
              <Route path="/services/:slug" element={isAppMode() ? <AppServiceDetail /> : <ServiceDetailPage />} />
              <Route path="/contact" element={isAppMode() ? <AppContact /> : <ContactPage />} />
              <Route path="/blog" element={isAppMode() ? <AppBlog /> : <BlogPage />} />
              <Route path="/blog/:slug" element={isAppMode() ? <AppBlogPost /> : <BlogPostPage />} />
              <Route path="/verify" element={<VerifyPage />} />
              <Route path="/privacy-policy" element={<LegalPage kind="privacy" />} />
              <Route path="/terms" element={<LegalPage kind="terms" />} />
              <Route path="/disclaimer" element={<LegalPage kind="disclaimer" />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/forgot" element={<ForgotAccount />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/profile" element={<ProfilePage />} />

              <Route path="/account" element={<AccountPage />} />

              {/* Employee portal */}
              <Route path="/employee/login" element={<PortalLogin kind="employee" />} />
              <Route path="/employee" element={<RequireRole role="employee"><PortalDashboard kind="employee" /></RequireRole>} />
              <Route path="/employee/work" element={<RequireRole role="employee"><PortalWork kind="employee" /></RequireRole>} />
              <Route path="/employee/analytics" element={<RequireRole role="employee"><PortalAnalytics kind="employee" /></RequireRole>} />
              <Route path="/employee/profile" element={<RequireRole role="employee"><PortalProfile kind="employee" /></RequireRole>} />
              <Route path="/employee/learn" element={<RequireRole role="employee"><PortalLearn kind="employee" /></RequireRole>} />
              <Route path="/employee/submissions" element={<RequireRole role="employee"><PortalSubmissions kind="employee" /></RequireRole>} />

              {/* Intern portal */}
              <Route path="/intern/login" element={<PortalLogin kind="intern" />} />
              <Route path="/intern" element={<RequireRole role="intern"><PortalDashboard kind="intern" /></RequireRole>} />
              <Route path="/intern/work" element={<RequireRole role="intern"><PortalWork kind="intern" /></RequireRole>} />
              <Route path="/intern/analytics" element={<RequireRole role="intern"><PortalAnalytics kind="intern" /></RequireRole>} />
              <Route path="/intern/profile" element={<RequireRole role="intern"><PortalProfile kind="intern" /></RequireRole>} />
              <Route path="/intern/payments" element={<RequireRole role="intern"><PortalPayments kind="intern" /></RequireRole>} />
              <Route path="/intern/letters" element={<RequireRole role="intern"><PortalLetters kind="intern" /></RequireRole>} />
              <Route path="/intern/learn" element={<RequireRole role="intern"><PortalLearn kind="intern" /></RequireRole>} />
              <Route path="/intern/submissions" element={<RequireRole role="intern"><PortalSubmissions kind="intern" /></RequireRole>} />

              {/* CRM Routes */}
              <Route path="/crm/dashboard" element={<CRMDashboard />} />
              <Route path="/crm/employees" element={<EmployeesPage />} />
              <Route path="/crm/people/:userId" element={<PersonProfilePage />} />
              <Route path="/crm/task-library" element={<TaskLibraryPage />} />
              <Route path="/crm/payments" element={<PaymentsAdminPage />} />
              <Route path="/crm/tasks" element={<TasksPage />} />
              <Route path="/crm/submissions" element={<SubmissionsPage />} />
              <Route path="/crm/analytics" element={<AnalyticsPage />} />
              <Route path="/crm/settings" element={<SettingsPage />} />
              <Route path="/crm/my-tasks" element={<MyTasksPage />} />
              <Route path="/crm/my-submissions" element={<MySubmissionsPage />} />
              <Route path="/crm/performance" element={<PerformancePage />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
            </MotionLayer>

            <ChatWidget />
            <CookieConsent />
            {isAppMode() && <AppTabBar />}
            {isAppMode() && <AdminTabBar />}
            {isAppMode() && <AdBanner />}
          </Suspense>

        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
