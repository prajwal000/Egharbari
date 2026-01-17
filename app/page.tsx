import Image from "next/image";
import Herobanner from "./components/UI/herobanner";
import AboutUs from "./components/UI/Aboutus";
import LatestProperties from "./components/UI/LatestProperties";
import PropertyVideos from "./components/UI/PropertyVideos";
import Blogs from "./components/UI/blogs";
import Testimonials from "./components/UI/Testimonial";
import FAQ from "./components/UI/faq";
import Contact from "./components/UI/Contact";

export default function Home() {
  return (
    <main>
      <Herobanner />
      <LatestProperties />
      <PropertyVideos />
      <AboutUs />
      <Testimonials />
      <Contact />
      <FAQ />
      <Blogs />
    </main>
  );
}
