import React, { useEffect, useRef } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { ArrowRight } from "lucide-react";

/**
 * Hero — corridor "walk-in" effect.
 *
 * The section is intentionally taller than the viewport. Inside a sticky
 * viewport we render the datacenter corridor photograph and the hero copy.
 * As the user scrolls the section, the background image scales up (as if
 * we were walking down the corridor) and the copy fades slightly. When the
 * section ends, the natural page flow takes over — the next section takes
 * over the viewport without a hard cut.
 */
const HeroSection = () => {
  const { t } = useLang();
  const heroRef = useRef(null);
  const photoRef = useRef(null);
  const copyRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const photo = photoRef.current;
    const copy = copyRef.current;
    if (!hero || !photo) return;

    let raf = 0;
    let progress = 0;
    let target = 0;

    const compute = () => {
      const rect = hero.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return 0;
      const scrolled = -rect.top;
      return Math.max(0, Math.min(1, scrolled / total));
    };

    const onScroll = () => {
      target = compute();
    };
    onScroll();

    const loop = () => {
      progress += (target - progress) * 0.12;
      // Zoom from 1.0 → 2.4 as user "walks" through the corridor
      const scale = 1 + progress * 1.4;
      // Slight vertical drift for parallax depth
      const ty = progress * -40;
      photo.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
      // Copy fades out in the second half of the walk
      if (copy) {
        const copyOpacity = progress < 0.55 ? 1 : Math.max(0, 1 - (progress - 0.55) / 0.35);
        const copyLift = -progress * 60;
        copy.style.opacity = copyOpacity.toFixed(3);
        copy.style.transform = `translate3d(0, ${copyLift.toFixed(1)}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      id="top"
      ref={heroRef}
      data-testid="hero-section"
      className="relative w-full sc-hero sc-hero--corridor"
      style={{ background: "#040709" }}
    >
      {/* Sticky viewport captures the visible frame while user scrolls */}
      <div className="sc-hero__viewport">
        {/* Corridor photograph — scales up with scroll to simulate walking in */}
        <div
          ref={photoRef}
          className="sc-hero__photo"
          data-testid="hero-photo"
          style={{ backgroundImage: `url("${process.env.PUBLIC_URL}/hero-corridor.jpg")` }}
        />

        {/* Vignette for readability at any zoom level */}
        <div className="sc-hero__vignette" aria-hidden="true" />

        {/* Neon light sweep synced with the corridor perspective */}
        <div className="sc-hero__sweep" aria-hidden="true" />

        {/* Corner tech brackets */}
        <div className="sc-hero__brackets" aria-hidden="true">
          <span className="sc-hero-bracket sc-hero-bracket--tl" />
          <span className="sc-hero-bracket sc-hero-bracket--tr" />
          <span className="sc-hero-bracket sc-hero-bracket--bl" />
          <span className="sc-hero-bracket sc-hero-bracket--br" />
        </div>

        {/* Copy — stays centered, fades as user walks deeper */}
        <div ref={copyRef} className="sc-hero__copy">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
            <div className="flex max-w-2xl flex-col">
              <h1 data-testid="hero-title" className="sc-hero-title text-white">
                {t.hero.title_pre}{" "}
                <span className="sc-hero-accent">{t.hero.title_accent}</span>{" "}
                {t.hero.title_post}
              </h1>

              <p
                data-testid="hero-subtitle"
                className="mt-6 max-w-xl text-base md:text-lg text-white/85"
              >
                {t.hero.subtitle}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#contact" data-testid="hero-cta-primary" className="sc-btn-glass sc-btn-glass--primary">
                  {t.hero.cta_primary}
                  <ArrowRight size={16} className="transition-transform duration-300" />
                </a>
                <a href="#values" data-testid="hero-cta-secondary" className="sc-btn-glass">
                  {t.hero.cta_secondary}
                </a>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="sc-hero__scroll-hint" aria-hidden="true">
            <span className="sc-hero__scroll-line" />
            <span className="sc-hero__scroll-label">SCROLL</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
