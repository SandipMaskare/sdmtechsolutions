import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  MessageSquare,
  Settings,
  Star,
  LogOut,
  ChevronLeft,
  FileText,
  ClipboardList,
  Mail,
  MessagesSquare,
  FileSignature,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobsManager from "@/components/admin/JobsManager";
import ServicesManager from "@/components/admin/ServicesManager";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import ContactSubmissions from "@/components/admin/ContactSubmissions";
import ContentManager from "@/components/admin/ContentManager";
import ApplicationsManager from "@/components/admin/ApplicationsManager";
import CompletionLetters from "@/components/admin/CompletionLetters";
import PeopleManager from "@/components/admin/PeopleManager";
import AnalyticsSettings from "@/components/admin/AnalyticsSettings";
import { Users } from "lucide-react";
import EmailCenter from "@/components/admin/EmailCenter";
import ChatInbox from "@/components/admin/ChatInbox";
import OfferLetters from "@/components/admin/OfferLetters";
import MailInbox from "@/components/admin/MailInbox";
import PageNav from "@/components/PageNav";
import sdmLogo from "@/assets/sdm-logo.webp";
import AppTopBar from "@/components/app/AppTopBar";
import { isAppMode } from "@/lib/appMode";

const Admin = () => {
  const navigate = useNavigate();
  const { user, role, signOut, loading } = useAuth();

  const isAdmin = role === "admin";

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    if (!loading && role !== "admin") {
      navigate("/");
    }
  }, [user, role, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Access Denied
          </h1>
          <p className="text-muted-foreground mb-6">
            You don't have admin privileges.
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {isAppMode() && <AppTopBar />}
      <header className={isAppMode() ? "hidden" : "bg-card border-b border-border sticky top-0 z-50"}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <PageNav />
            <a href="/">
              <img src={sdmLogo} alt="SDM Technology" className="h-10" />
            </a>
            <span className="text-muted-foreground">|</span>
            <h1 className="text-lg font-semibold text-foreground">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Site
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8" style={isAppMode() ? { paddingTop: "calc(3.5rem + env(safe-area-inset-top) + 1rem)", paddingBottom: "6rem" } : undefined}>
        <Tabs defaultValue={new URLSearchParams(window.location.search).get("tab") || "jobs"} className="space-y-6">
          <TabsList className="flex flex-wrap w-full max-w-6xl h-auto gap-1">
            <TabsTrigger value="jobs">
              <Briefcase className="w-4 h-4" /> Jobs
            </TabsTrigger>
            <TabsTrigger value="applications">
              <ClipboardList className="w-4 h-4" /> Applications
            </TabsTrigger>
            <TabsTrigger value="people">
              <Users className="w-4 h-4" /> People
            </TabsTrigger>
            <TabsTrigger value="services">
              <Settings className="w-4 h-4" /> Services
            </TabsTrigger>
            <TabsTrigger value="testimonials">
              <Star className="w-4 h-4" /> Testimonials
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="w-4 h-4" /> Messages
            </TabsTrigger>
            <TabsTrigger value="inbox">
              <Inbox className="w-4 h-4" /> Inbox
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="w-4 h-4" /> Email
            </TabsTrigger>
            <TabsTrigger value="chat">
              <MessagesSquare className="w-4 h-4" /> Chat
            </TabsTrigger>
            <TabsTrigger value="offers">
              <FileSignature className="w-4 h-4" /> Offers
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <ClipboardList className="w-4 h-4" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="completion">
              <FileSignature className="w-4 h-4" /> Completion
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText className="w-4 h-4" /> Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <JobsManager />
          </TabsContent>
          <TabsContent value="applications">
            <ApplicationsManager />
          </TabsContent>
          <TabsContent value="people">
            <PeopleManager />
          </TabsContent>
          <TabsContent value="services">
            <ServicesManager />
          </TabsContent>
          <TabsContent value="testimonials">
            <TestimonialsManager />
          </TabsContent>
          <TabsContent value="messages">
            <ContactSubmissions />
          </TabsContent>
          <TabsContent value="inbox">
            <MailInbox />
          </TabsContent>
          <TabsContent value="email">
            <EmailCenter />
          </TabsContent>
          <TabsContent value="chat">
            <ChatInbox />
          </TabsContent>
          <TabsContent value="offers">
            <OfferLetters />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsSettings />
          </TabsContent>
          <TabsContent value="completion">
            <CompletionLetters />
          </TabsContent>
          <TabsContent value="content">
            <ContentManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
