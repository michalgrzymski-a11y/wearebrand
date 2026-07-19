import React, { useEffect, useRef } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { ArrowRight } from "lucide-react";

/**
 * Hero — cinematic datacenter photograph as full-bleed background.
 *  Animations:
 *    - Ken-Burns slow zoom + drift on the image
 *    - Mouse parallax (translates the image by a few px in the opposite direction)
 *    - Sweep light gradient traversing the image
 *    - Floating data-packet dots overlay drifting to the right
 *    - Scanline overlay + corner brackets
 */
const HeroSection = () => {
  const { t } = useLang();
  const imgRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const img = imgRef.current;
    if (!hero || !img) return;

    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;

    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);

    const loop = () => {
      cx += (tx - cx) * 0.04;
      cy += (ty - cy) * 0.04;
      // Parallax translation on top of the CSS keyframe animation.
      img.style.setProperty("--sc-px", `${(-cx * 12).toFixed(2)}px`);
      img.style.setProperty("--sc-py", `${(-cy * 8).toFixed(2)}px`);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      id="top"
      ref={heroRef}
      data-testid="hero-section"
      className="relative w-full overflow-hidden sc-hero"
      style={{ background: "#040709" }}
    >
      {/* Background image — animated Ken Burns + parallax */}
      <div className="absolute inset-0 sc-hero-photo-wrap" data-testid="hero-photo">
        <div
          ref={imgRef}
          className="sc-hero-photo"
          style={{ backgroundImage: `url("${process.env.PUBLIC_URL}/hero-datacenter.jpg")` }}
        />
      </div>

      {/* Sweep light + floating particles overlay */}
      <div className="pointer-events-none absolute inset-0 sc-hero-sweep" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 sc-hero-particles" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="sc-hero-particle" style={{
            top: `${(i * 4.13) % 100}%`,
            left: `${(i * 7.7) % 100}%`,
            animationDelay: `${(i * 0.4) % 8}s`,
            animationDuration: `${9 + (i % 5) * 1.5}s`,
            opacity: 0.3 + (i % 4) * 0.15,
          }} />
        ))}
      </div>

      {/* Readability gradient over the whole scene */}
      <div className="pointer-events-none absolute inset-0 sc-hero-photo-readable" aria-hidden="true" />

      {/* Corner tech brackets */}
      <div className="sc-hero-bracket sc-hero-bracket--tl" aria-hidden="true" />
      <div className="sc-hero-bracket sc-hero-bracket--tr" aria-hidden="true" />
      <div className="sc-hero-bracket sc-hero-bracket--bl" aria-hidden="true" />
      <div className="sc-hero-bracket sc-hero-bracket--br" aria-hidden="true" />

      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 sc-hero-scan" aria-hidden="true" />

      {/* Copy */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-6 pb-16 pt-16 md:px-10 md:pt-20">
        <div className="flex max-w-2xl flex-col">
          <h1 data-testid="hero-title" className="sc-hero-title text-white">
            {t.hero.title_pre}{" "}
            <span className="sc-hero-accent">{t.hero.title_accent}</span>{" "}
            {t.hero.title_post}
          </h1>

          <p
            data-testid="hero-subtitle"
            className="mt-6 max-w-xl text-base md:text-lg text-white/80"
          >
            {t.hero.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#contact" data-testid="hero-cta-primary" className="sc-btn-glass sc-btn-glass--primary">
              {t.hero.cta_primary}
              <ArrowRight size={16} className="transition-transform duration-300" />
            </a>
            <a href="#portfolio" data-testid="hero-cta-secondary" className="sc-btn-glass">
              {t.hero.cta_secondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
