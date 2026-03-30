import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Gallery from "../components/Gallery";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import InstagramSection from "../components/InstagramSection";
import WhatsAppFloat from "../components/WhatsAppFloat";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Gallery />
      <Testimonials />
      <Contact />
      <InstagramSection />
      <WhatsAppFloat/>
      <Footer />
    </>
  );
}

export default Home;