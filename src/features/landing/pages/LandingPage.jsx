import { 
    Box
} from "@chakra-ui/react";
import { C } from "../components/Tokens";

import Navbar from '../components/Navbar';
import Hero from "../components/Hero";
import About from "../components/About";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import CTA from '../components/Cta';
import Footer from "../components/Footer";

const LandingPage = () => {
    return (
    <Box fontFamily="'DM Sans',sans-serif" bg={C.bg0}>
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(74,158,255,0.3); }
        a { text-decoration: none; }
      `}</style>
 
      <Navbar />
      <Hero />
      <About />
      <HowItWorks />
      <Features />
      <CTA />
      <Footer />
    </Box>
    )
}

export default LandingPage