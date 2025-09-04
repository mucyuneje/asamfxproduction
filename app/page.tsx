import Hero from "@/components/sections/Hero";
import Mentorship from "@/components/sections/Mentorship";
import Roadmap from "@/components/sections/Roadmap";
import Proven from "@/components/sections/Proven";
import Courses from "@/components/sections/Courses";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/Navbar";



export default function Home() {
  return (
    <main className="bg-background text-foreground transition-colors duration-500">
      {/* Navbar stays full width */}
      <Navbar />

      {/* Content wrapper */}
      <div className="w-full xl:max-w-7xl 2xl:max-w-[1600px] mx-auto flex flex-col items-center">
        <Hero />
        <Proven />
        <Mentorship />
        <Courses />
        <Roadmap/>
        <Footer />
      </div>
    </main>
  );
}
