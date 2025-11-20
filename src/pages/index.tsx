// import { useState } from 'react';
// import Link from 'next/link';
// import Layout from '@/components/layout/Layout';

import CTA from "@/components/homepage/CTA";
import Features from "@/components/homepage/features";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/homepage/hero";
import HowItWorks from "@/components/homepage/howitWorks";
import Pricing from "@/components/homepage/pricing";
import Testimonials from "@/components/homepage/testimonials";
import Header from "@/components/layout/Header";





export default function Home () {
  return (
    <div className="min-h-screen playfair-display overflow-x-hidden">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};



