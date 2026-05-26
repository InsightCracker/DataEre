import { keyframes } from "@emotion/react";
import { useEffect, useRef, useState } from "react";

// ─── Fonts ───────────────────────────────────────────────────────
// export const fontLink = `@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');`;

// ─── Keyframes ────────────────────────────────────────────────────
export const fadeUp    = keyframes`from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}`;
export const fadeIn    = keyframes`from{opacity:0}to{opacity:1}`;
export const glowPulse = keyframes`0%,100%{box-shadow:0 0 20px rgba(74,158,255,0.2)}50%{box-shadow:0 0 50px rgba(74,158,255,0.5),0 0 80px rgba(48,78,207,0.3)}`;
export const lineGrow  = keyframes`from{transform:scaleX(0)}to{transform:scaleX(1)}`;
export const float     = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}`;
export const spin      = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
export const shimmer   = keyframes`0%{background-position:200% center}100%{background-position:-200% center}`;
export const scanline  = keyframes`0%{top:-10%}100%{top:110%}`;
export const borderGlow= keyframes`0%,100%{border-color:rgba(74,158,255,0.2)}50%{border-color:rgba(74,158,255,0.7)}`;

// ─── Design Tokens ────────────────────────────────────────────────
export const C = {
  bg0:    "#060914",
  bg1:    "#080d1e",
  bg2:    "#0a0f23",
  bg3:    "#0d1234",
  accent: "#4a9eff",
  accent2:"#304ecf",
  accent3:"#7eb8ff",
  green:  "#2dd4a0",
  yellow: "#fbbf24",
  purple: "#a78bfa",
  text:   "rgba(255,255,255,0.9)",
  muted:  "rgba(255,255,255,0.5)",
  dim:    "rgba(255,255,255,0.25)",
};

// ─── useFadeIn hook ───────────────────────────────────────────────
export const useFadeIn = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
};