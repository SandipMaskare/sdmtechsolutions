import { Suspense, lazy } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";

// Everything below the fold is loaded after the first screen so the page appears faster.
const About = lazy(() => import("@/components/About"));
const Services = lazy(() => import("@/components/Services"));
const InternshipHighlights = lazy(() => import("@/components/InternshipHighlights"));
const TechStack = lazy(() => import("@/components/TechStack"));
const WhyChooseUs = lazy(() => import("@/components/WhyChooseUs"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const CareersTeaser = lazy(() => import("@/components/CareersTeaser"));
const InsightsStrip = lazy(() => import("@/components/InsightsStrip"));
const WorkProcess = lazy(() => import("@/components/WorkProcess"));
const CareersBand = lazy(() => import("@/components/CareersBand"));
const HomeFAQ = lazy(() => import("@/components/HomeFAQ"));
const Contact = lazy(() => import("@/components/Contact"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Stats />
      <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
        <About />
        <Services />
        <InternshipHighlights />
        <TechStack />
        <WorkProcess />
        <WhyChooseUs />
        <Testimonials />
        <InsightsStrip />
        <CareersBand />
        <CareersTeaser />
        <HomeFAQ />
        <Contact />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
