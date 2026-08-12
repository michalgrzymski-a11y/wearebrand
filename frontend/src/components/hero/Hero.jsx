import React, { useEffect, useRef } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { ArrowRight } from "lucide-react";
import NeuralNodeNetwork from "@/components/fx/NeuralNodeNetwork";

/**
 * Hero — cinematic datacenter photograph as full-bleed background.
 *  Multi-layer parallax (mouse + scroll):
 *    - L0 photo (Ken-Burns + mouse drift + scroll 0.35x)
 *    - L1 neon horizon lines (scroll 0.55x)
 *    - L2 sweep light (mouse 0.6x)
 *    - L3 particles (scroll 0.75x + drift)
 *    - L4 corner brackets (scroll -0.10x — anti-parallax, fixed feel)
 *    - L5 copy (scroll -0.20x — floats up slightly on scroll)
 */
const Hero = () => {
  const { t } = useLang();
  const heroRef = useRef(null);
  const imgRef = useRef(null);
  const videoRef = useRef(null);
  const neonRef = useRef(null);
  const partRef = useRef(null);
  const bracketsRef = useRef(null);
  const copyRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const img = imgRef.current;
    if (!hero || !img) return;

    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let scrollY = 0;

    /* --- Scroll-linked video intro playback --- */
    const video = videoRef.current;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let videoRaf = 0;
    let targetTime = 0;
    let currentTime = 0;

    const updateVideoTime = () => {
      if (!video || !video.duration || isNaN(video.duration)) return;
      // Two-phase pin: outer scroller = SCRUB (200vh) + REVEAL (100vh) + sticky (100vh).
      // The scrub phase spans the FIRST (hero.offsetHeight - innerHeight - revealPx)
      // pixels of scroll through the pinned range. After that, the video sits at
      // its last frame while the next section (#values) slides up over it.
      const rect = hero.getBoundingClientRect();
      const revealPx = window.innerHeight; // 100vh reveal cover phase
      const scrubLen = hero.offsetHeight - window.innerHeight - revealPx;
      if (scrubLen <= 0) { targetTime = 0; return; }
      const currentScroll = Math.min(scrubLen, Math.max(0, -rect.top));
      const progress = currentScroll / scrubLen;
      targetTime = progress * video.duration;
    };

    const seekLoop = () => {
      if (!video || !video.duration) {
        videoRaf = requestAnimationFrame(seekLoop);
        return;
      }
      // Critically-damped ease toward target — faster catch-up than plain lerp,
      // smoother than instant seek. 0.22 gives ~5-frame time-to-target at 60fps.
      const diff = targetTime - currentTime;
      currentTime += diff * 0.22;
      if (Math.abs(diff) < 0.004) currentTime = targetTime;
      // With all-keyframe MP4 the browser can seek to ANY currentTime cheaply.
      try {
        if (Math.abs(video.currentTime - currentTime) > 0.008) {
          video.currentTime = currentTime;
        }
      } catch (_) { /* seeking races — ignore */ }
      videoRaf = requestAnimationFrame(seekLoop);
    };

    if (video && !prefersReducedMotion) {
      const startLoop = () => {
        updateVideoTime();
        currentTime = targetTime;
        try { video.pause(); } catch (_) {}
        cancelAnimationFrame(videoRaf);
        videoRaf = requestAnimationFrame(seekLoop);
      };
      if (video.readyState >= 1) startLoop();
      else video.addEventListener("loadedmetadata", startLoop, { once: true });
      window.addEventListener("scroll", updateVideoTime, { passive: true });
    }
    /* --- End scroll-linked video --- */

    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => { tx = 0; ty = 0; };
    const onScroll = () => {
      // Parallax bound to SCRUB progress (0..1) × 80px — matches the video's
      // scrub range so hero layers stay in view while scrubbing, and freeze
      // once the reveal phase starts (video done, next section covers hero).
      const rect = hero.getBoundingClientRect();
      const revealPx = window.innerHeight;
      const scrubLen = hero.offsetHeight - window.innerHeight - revealPx;
      const currentScroll = Math.min(scrubLen, Math.max(0, -rect.top));
      const progress = scrubLen > 0 ? currentScroll / scrubLen : 0;
      scrollY = progress * 80;
    };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const loop = () => {
      cx += (tx - cx) * 0.04;
      cy += (ty - cy) * 0.04;

      // Mouse parallax on the photo
      img.style.setProperty("--sc-px", `${(-cx * 12).toFixed(2)}px`);
      img.style.setProperty("--sc-py", `${(-cy * 8).toFixed(2)}px`);

      // Scroll parallax — each layer at a different speed
      img.style.setProperty("--sc-scroll", `${(scrollY * 0.35).toFixed(1)}px`);
      if (neonRef.current)
        neonRef.current.style.transform = `translate3d(${(cx * -6).toFixed(2)}px, ${(scrollY * 0.55).toFixed(1)}px, 0)`;
      if (partRef.current)
        partRef.current.style.transform = `translate3d(${(cx * -8).toFixed(2)}px, ${(scrollY * 0.75).toFixed(1)}px, 0)`;
      if (bracketsRef.current)
        bracketsRef.current.style.transform = `translate3d(0, ${(scrollY * -0.10).toFixed(1)}px, 0)`;

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(videoRaf);
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", updateVideoTime);
    };
  }, []);

  return (
    <section
      id="top"
      ref={heroRef}
      data-testid="hero-section"
      className="sc-hero-scroller"
      style={{ background: "#040709" }}
    >
      <div className="sc-hero-sticky sc-hero">
      {/* L0 — scroll-linked video intro (fallback: background photo) */}
      <div className="absolute inset-0 sc-hero-photo-wrap" data-testid="hero-photo">
        <video
          ref={videoRef}
          className="sc-hero-video"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          poster={`${process.env.PUBLIC_URL}/video/intro-poster.jpg`}
          data-testid="hero-video"
          aria-hidden="true"
        >
          <source src={`${process.env.PUBLIC_URL}/video/intro.mp4`} type="video/mp4" />
        </video>
        {/* Photo remains as ultimate fallback (behind video, visible only if video fails) */}
        <div
          ref={imgRef}
          className="sc-hero-photo sc-hero-photo--fallback"
          style={{ backgroundImage: `url("${process.env.PUBLIC_URL}/hero-datacenter.jpg")` }}
        />
      </div>

      {/* L1 — neon horizon lines (mid-depth) */}
      <div
        ref={neonRef}
        className="pointer-events-none absolute inset-0 sc-hero-neon"
        aria-hidden="true"
      >
        <span className="sc-hero-neon__line sc-hero-neon__line--a" />
        <span className="sc-hero-neon__line sc-hero-neon__line--b" />
        <span className="sc-hero-neon__line sc-hero-neon__line--c" />
      </div>

      {/* L2 — sweep light */}
      <div className="pointer-events-none absolute inset-0 sc-hero-sweep" aria-hidden="true" />

      {/* L3 — floating data particles */}
      <div
        ref={partRef}
        className="pointer-events-none absolute inset-0 sc-hero-particles"
        aria-hidden="true"
      >
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

      {/* Neural Node Network — cursor-reactive particle web on top of the photo */}
      <NeuralNodeNetwork color="#49ADA5" density={90} interactive opacity={0.6} />

      {/* L4 — corner tech brackets */}
      <div ref={bracketsRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="sc-hero-bracket sc-hero-bracket--tl" />
        <div className="sc-hero-bracket sc-hero-bracket--tr" />
        <div className="sc-hero-bracket sc-hero-bracket--bl" />
        <div className="sc-hero-bracket sc-hero-bracket--br" />
      </div>

      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 sc-hero-scan" aria-hidden="true" />

      {/* L5 — copy (absolute-centered, floats up slightly on scroll) */}
      <div
        ref={copyRef}
        className="sc-hero-copy"
      >
        <div className="mx-auto w-full max-w-7xl">
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
              <a href="#contact" data-testid="hero-cta-primary" className="sc-btn-primary">
                {t.hero.cta_primary}
                <ArrowRight size={16} className="transition-transform duration-300" />
              </a>
              <a href="#portfolio" data-testid="hero-cta-secondary" className="sc-btn-ghost">
                {t.hero.cta_secondary}
              </a>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Hero;
