import Navbar from "@/components/Navbar";
import HeroUpload from "@/components/HeroUpload";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroUpload />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
