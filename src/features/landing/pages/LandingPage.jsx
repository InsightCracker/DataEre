import '../styles/landing.css'

import { 
    Box
} from "@chakra-ui/react";

import Navbar from '../components/Navbar';
import Hero from "../components/Hero";
import About from "../components/About";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Footer from "../components/Footer";

const LandingPage = () => {
    return (
    <Box>
      <Navbar />
      <Hero />
      <About />
      <HowItWorks />
      <Features />
      <Footer />
    </Box>
    )
}

export default LandingPage