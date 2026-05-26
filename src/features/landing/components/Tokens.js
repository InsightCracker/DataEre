import { keyframes } from "@emotion/react";
import { useEffect, useRef, useState } from "react";

// ─── Keyframes 
export const fadeUp    = keyframes`from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}`;
export const fadeIn    = keyframes`from{opacity:0}to{opacity:1}`;
export const glowPulse = keyframes`0%,100%{box-shadow:0 0 20px rgba(59,110,240,0.15)}50%{box-shadow:0 0 40px rgba(59,110,240,0.35),0 0 60px rgba(34,81,204,0.2)}`;
export const lineGrow  = keyframes`from{transform:scaleX(0)}to{transform:scaleX(1)}`;
export const float     = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}`;
export const spin      = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
export const shimmer   = keyframes`0%{background-position:200% center}100%{background-position:-200% center}`;
export const scanline  = keyframes`0%{top:-10%}100%{top:110%}`;
export const borderGlow= keyframes`0%,100%{border-color:rgba(74,158,255,0.2)}50%{border-color:rgba(74,158,255,0.7)}`;

// ─── Design Tokens
export const C = {
  bg0:    "#f0f4ff",
  bg1:    "#ffffff",
  bg2:    "#f5f8ff",
  bg3:    "#eef2ff",
  accent: "#3b6ef0",
  accent2:"#2251cc",
  accent3:"#6b96f5",
  green:  "#0ea874",
  yellow: "#f59e0b",
  purple: "#7c5cfc",
  text:   "#111827",
  muted:  "#4b5563",
  dim:    "#9ca3af",
};

// ─── useFadeIn hook
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