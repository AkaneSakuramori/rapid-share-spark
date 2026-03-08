import Navbar from "@/components/Navbar";
import HeroUpload from "@/components/HeroUpload";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <div className="flex-1">
      <HeroUpload />
    </div>
    <Footer />
  </div>
);

export default Index;
