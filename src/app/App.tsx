import { useEffect, useRef, useState } from "react";
import Blisswork from "@/imports/Blisswork/index";

const NAV_SECTIONS = [
  { label: "Overview", dataName: "Header" },
  { label: "Opportunity", dataName: "Section" },
  { label: "Project Goal", dataName: "Section1" },
  { label: "Process", dataName: "Section2" },
  { label: "01 Discover", dataName: "Section3" },
  { label: "02 Research", dataName: "Section4" },
  { label: "03 Journey", dataName: "Section5" },
  { label: "04 Synthesis", dataName: "Section6" },
  { label: "Define", dataName: "Section7" },
  { label: "05 Solution", dataName: "Section8" },
  { label: "Blisswork", dataName: "Section9" },
];

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(Element | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Find all named sections in the rendered Blisswork component
    const root = containerRef.current;
    sectionRefs.current = NAV_SECTIONS.map((s) =>
      root.querySelector(`[data-name="${s.dataName}"]`)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.findIndex(
              (el) => el === entry.target
            );
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (idx: number) => {
    const el = sectionRefs.current[idx];
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 56;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Sticky navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#e4e3de]"
        style={{ height: "56px" }}
      >
        <div className="max-w-[1180px] mx-auto px-6 h-full flex items-center justify-between">
          <span
            className="font-semibold text-[#1a1b17] text-sm tracking-wide cursor-pointer select-none"
            style={{ fontFamily: "'Inter', sans-serif" }}
            onClick={() => scrollToSection(0)}
          >
            Blisswork
          </span>
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            {NAV_SECTIONS.map((section, i) => (
              <button
                key={section.dataName}
                onClick={() => scrollToSection(i)}
                className={[
                  "px-3 py-1.5 text-xs whitespace-nowrap transition-all duration-200 rounded-full",
                  "hover:bg-[#f0efea]",
                  activeIndex === i
                    ? "text-[#1a1b17] font-semibold bg-[#5e67e6] text-white hover:bg-[#5e67e6]"
                    : "text-[#6b6b5e] font-normal",
                ].join(" ")}
                style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.02em" }}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content — padded for sticky nav */}
      <div ref={containerRef} style={{ paddingTop: "56px" }}>
        {/*
          Blisswork's inner Body div is h-[594px] but App inside is h-[9975px].
          Since Body has no overflow:hidden, App's content overflows visually.
          We set the outer wrapper to min-h of the full design to create scroll space.
        */}
        <div style={{ minHeight: "9975px", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Blisswork />
          </div>
        </div>
      </div>
    </div>
  );
}
