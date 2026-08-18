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
  const canvasRef = useRef(null);
  const neonRef = useRef(null);
  const partRef = useRef(null);
  const bracketsRef = useRef(null);
  const copyRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const img = imgRef.current;
    if (!hero || !img) return;

    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let scrollY = 0;

    /* --- Scroll-linked WebP / AVIF frame sequence (Apple-style scrub) ---
       DESKTOP: 193 pre-rendered 4K frames — AVIF (~15 MB) if supported,
                otherwise WebP (~25 MB) fallback.
       MOBILE : 30 pre-rendered 1080p frames — same AVIF/WebP fallback.
       Frames are preloaded on mount, then drawn to a <canvas> at the
       current scrub progress. */
    const canvas = canvasRef.current;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(max-width: 767px)").matches;

    const TOTAL_FRAMES = isMobile ? 30 : 193;

    // AVIF feature detection — decode a tiny 1x1 AVIF via Image().decode().
    // Resolves quickly (< 50 ms). Falls back to WebP if decode fails.
    const detectAvif = () =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img.width > 0 && img.height > 0);
        img.onerror = () => resolve(false);
        img.src =
          "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=";
      });

    const images = new Array(TOTAL_FRAMES);
    let ctx = null;
    let currentIdx = -1;
    let framesLoaded = 0;
    let frameRaf = 0;

    const drawFrameAt = (idx) => {
      const img = images[idx];
      if (!ctx || !img || !img.complete || !img.naturalWidth) return false;
      if (canvas.width !== img.naturalWidth) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      currentIdx = idx;
      return true;
    };

    const scheduleDraw = () => {
      if (frameRaf) return;
      frameRaf = requestAnimationFrame(() => {
        frameRaf = 0;
        if (!hero) return;
        const rect = hero.getBoundingClientRect();
        const scrubLen = hero.offsetHeight - window.innerHeight;
        if (scrubLen <= 0) return;
        const currentScroll = Math.min(scrubLen, Math.max(0, -rect.top));
        const progress = currentScroll / scrubLen;
        let idx = Math.round(progress * (TOTAL_FRAMES - 1));
        if (idx === currentIdx) return;
        if (!drawFrameAt(idx)) {
          for (let d = 1; d < TOTAL_FRAMES; d++) {
            if (idx - d >= 0 && drawFrameAt(idx - d)) break;
            if (idx + d < TOTAL_FRAMES && drawFrameAt(idx + d)) break;
          }
        }
      });
    };

    if (canvas && !prefersReducedMotion) {
      ctx = canvas.getContext("2d", { alpha: true });
      // Async feature-detect then kick off the parallel preload.
      detectAvif().then((avif) => {
        // If AVIF frames haven't finished encoding yet, the .avif requests will
        // 404 and the image will fire onerror — we fall back to WebP per-image.
        const ext = avif ? "avif" : "webp";
        const dir = avif
          ? isMobile ? "frames-m-avif" : "frames-avif"
          : isMobile ? "frames-m" : "frames";
        for (let i = 0; i < TOTAL_FRAMES; i++) {
          const img = new Image();
          img.decoding = "async";
          img.onload = () => {
            framesLoaded += 1;
            scheduleDraw();
          };
          img.onerror = () => {
            // Per-frame WebP fallback if a specific AVIF is missing (mid-deploy).
            if (avif) {
              img.onerror = () => { framesLoaded += 1; };
              img.src = `${process.env.PUBLIC_URL}/video/${isMobile ? "frames-m" : "frames"}/f_${String(i + 1).padStart(3, "0")}.webp`;
            } else {
              framesLoaded += 1;
            }
          };
          img.src = `${process.env.PUBLIC_URL}/video/${dir}/f_${String(i + 1).padStart(3, "0")}.${ext}`;
          images[i] = img;
        }
      });
      window.addEventListener("scroll", scheduleDraw, { passive: true });
      window.addEventListener("resize", scheduleDraw);
      scheduleDraw();
    } else if (canvas && prefersReducedMotion) {
      ctx = canvas.getContext("2d", { alpha: true });
      const img = new Image();
      img.onload = () => drawFrameAt(0);
      img.src = `${process.env.PUBLIC_URL}/video/${isMobile ? "frames-m" : "frames"}/f_${String(TOTAL_FRAMES).padStart(3, "0")}.webp`;
      images[TOTAL_FRAMES - 1] = img;
    }
    /* --- End frame sequence --- */

    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      // Cursor-following soft cyan glow (subtle, no dots)
      const glow = glowRef.current;
      if (glow) {
        glow.style.setProperty("--sc-gx", `${e.clientX - r.left}px`);
        glow.style.setProperty("--sc-gy", `${e.clientY - r.top}px`);
        glow.style.opacity = "1";
      }
    };
    const onLeave = () => {
      tx = 0; ty = 0;
      if (glowRef.current) glowRef.current.style.opacity = "0";
    };
    const onScroll = () => {
      // Parallax bound to scrub progress (0..1) × 80px — layers stay in view
      // through the whole pin range and freeze once Hero un-pins.
      const rect = hero.getBoundingClientRect();
      const scrubLen = hero.offsetHeight - window.innerHeight;
      const currentScroll = Math.min(scrubLen, Math.max(0, -rect.top));
      const progress = scrubLen > 0 ? currentScroll / scrubLen : 0;
      scrollY = progress * 80;

      // Hero copy state machine:
      //   currentScroll < 40           → INITIAL (right-aligned, visible)
      //   40 ≤ progress < 0.80         → HIDDEN (fade out during scrub)
      //   progress ≥ 0.80              → FINAL  (far LEFT, visible — appears
      //                                   a bit before the video's very last
      //                                   frame so it settles smoothly).
      const copy = copyRef.current;
      if (copy) {
        if (currentScroll < 40) {
          copy.classList.add("sc-hero-copy--initial");
          copy.classList.remove("sc-hero-copy--hidden");
          copy.classList.remove("sc-hero-copy--final");
        } else if (progress >= 0.80) {
          copy.classList.add("sc-hero-copy--final");
          copy.classList.remove("sc-hero-copy--initial");
          copy.classList.remove("sc-hero-copy--hidden");
        } else {
          copy.classList.add("sc-hero-copy--hidden");
          copy.classList.remove("sc-hero-copy--initial");
          copy.classList.remove("sc-hero-copy--final");
        }
      }
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
      cancelAnimationFrame(frameRaf);
      if (canvas && canvas.__mobileTimer) canvas.__mobileTimer();
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", scheduleDraw);
      window.removeEventListener("resize", scheduleDraw);
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
        <canvas
          ref={canvasRef}
          className="sc-hero-video"
          data-testid="hero-canvas"
          aria-hidden="true"
        />
        {/* Poster fallback shown until frames start arriving. */}
        <img
          src={`${process.env.PUBLIC_URL}/video/intro-poster.webp`}
          alt=""
          className="sc-hero-poster"
          aria-hidden="true"
        />
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
      <NeuralNodeNetwork color="#00B8D4" density={90} interactive opacity={0.6} />

      {/* Subtle cyan cursor-following glow (no dots) */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 sc-hero-cursor-glow"
        aria-hidden="true"
        data-testid="hero-cursor-glow"
      />

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
        className="sc-hero-copy sc-hero-copy--initial"
        data-testid="hero-copy"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex max-w-2xl flex-col sc-hero-copy__col">
            {/* Title on INITIAL — the standard "Infrastruktura IT ..." heading */}
            <h1
              data-testid="hero-title"
              className="sc-hero-title sc-hero-copy__initial-only text-white"
            >
              {t.hero.title_pre}{" "}
              <span className="sc-hero-accent">{t.hero.title_accent}</span>{" "}
              {t.hero.title_post}
            </h1>

            {/* Title on FINAL — replaces the h1 with the value proposition text
                once the scrub has finished. Key words are highlighted with the
                same cyan gradient accent used on "ciągłości" in the initial. */}
            <h1
              data-testid="hero-title-final"
              className="sc-hero-title sc-hero-copy__final-only text-white"
            >
              {(t.hero.subtitle_parts || [{ text: t.hero.subtitle }]).map(
                (part, i) =>
                  part.accent ? (
                    <span key={i} className="sc-hero-accent">{part.text}</span>
                  ) : (
                    <React.Fragment key={i}>{part.text}</React.Fragment>
                  )
              )}
            </h1>

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
