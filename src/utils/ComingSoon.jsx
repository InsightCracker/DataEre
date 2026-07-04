import { Box } from "@chakra-ui/react";
import { FaRocket } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500&display=swap');

  @keyframes cs-fadeUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes cs-drift1    { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,20px)} }
  @keyframes cs-drift2    { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-22px,-28px)} }
  @keyframes cs-drift3    { 0%,100%{transform:translate(0,0)} 50%{transform:translate(18px,-14px)} }
  @keyframes cs-ping      { 0%,100%{transform:scale(1);opacity:.3} 50%{transform:scale(2.2);opacity:0} }
  @keyframes cs-spin      { to{transform:rotate(360deg)} }
  @keyframes cs-rocket-float { 0%,100%{transform:translateY(0) rotate(-12deg)} 50%{transform:translateY(-10px) rotate(-8deg)} }
  @keyframes cs-shimmer-sweep{ 0%{transform:translateX(-100%)} 30%,100%{transform:translateX(200%)} }
  @keyframes cs-flip      { from{transform:translateY(-6px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes cs-dotbounce {
    0%,80%,100%{ transform:scale(1);opacity:.5; }
    40%        { transform:scale(1.7) translateY(-5px);opacity:1; }
  }
  @keyframes cs-bar-grow  { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes cs-glowPulse {
    0%,100%{ box-shadow:0 8px 28px rgba(59,110,240,.28); }
    50%     { box-shadow:0 14px 44px rgba(59,110,240,.50); }
  }

  .cs-orb{ position:absolute; border-radius:50%; pointer-events:none; }
  .cs-orb1{ width:420px;height:420px;top:-120px;left:-120px;
    background:radial-gradient(circle,rgba(59,110,240,.09),transparent 70%);
    animation:cs-drift1 9s ease-in-out infinite; }
  .cs-orb2{ width:300px;height:300px;bottom:-80px;right:-80px;
    background:radial-gradient(circle,rgba(107,150,245,.12),transparent 70%);
    animation:cs-drift2 11s ease-in-out infinite; }
  .cs-orb3{ width:180px;height:180px;
    background:radial-gradient(circle,rgba(167,139,250,.10),transparent 70%);
    animation:cs-drift3 7s ease-in-out infinite; }

  .cs-rocket-bg{ position:relative;overflow:hidden; }
  .cs-rocket-bg::before{
    content:'';position:absolute;inset:0;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent);
    transform:translateX(-100%);
    animation:cs-shimmer-sweep 3s ease-in-out infinite 1s;
  }
  .cs-ring{ position:absolute;border-radius:50%;border-style:dashed;pointer-events:none; }
  .cs-ring1{ inset:-18px;border:1.5px dashed rgba(59,110,240,.22);animation:cs-spin 12s linear infinite; }
  .cs-ring2{ inset:-34px;border:1px dashed rgba(59,110,240,.12);animation:cs-spin 18s linear infinite reverse; }

  .cs-unit{ transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease; }
  .cs-unit:hover{
    transform:translateY(-5px) !important;
    box-shadow:0 12px 30px rgba(59,110,240,.16) !important;
    border-color:rgba(59,110,240,.3) !important;
  }
  .cs-unit-num.flip{ animation:cs-flip .3s ease; }

  .cs-pill{ transition:all .25s ease; }
  .cs-pill:hover{
    transform:translateY(-3px);
    border-color:rgba(59,110,240,.3) !important;
    color:#3b6ef0 !important;
    box-shadow:0 8px 20px rgba(59,110,240,.12);
  }

  .cs-btn-notify{
    background:linear-gradient(135deg,#2251cc,#3b6ef0);
    color:#fff;border:none;cursor:pointer;padding:13px 24px;
    font-family:'Sora',sans-serif;font-size:.85rem;font-weight:800;
    letter-spacing:.02em;white-space:nowrap;
    transition:filter .2s;position:relative;overflow:hidden;
  }
  .cs-btn-notify:hover{ filter:brightness(1.12); animation:cs-glowPulse 1.5s ease infinite; }
`;

const FEATURES = [
  { label: "Daily Challenge",     dot: "#3b6ef0" },
  { label: "PDF Converter",     dot: "#f87171" },
  { label: "AI Insights",       dot: "#a78bfa" },
  { label: "Report Generator",  dot: "#34d399" },
];

/* ── live countdown ── */
const useCountdown = (targetDate) => {
  const calc = () => {
    const diff = Math.max(0, targetDate - Date.now());
    return {
      d: String(Math.floor(diff / 864e5)).padStart(2, "0"),
      h: String(Math.floor((diff % 864e5) / 36e5)).padStart(2, "0"),
      m: String(Math.floor((diff % 36e5) / 6e4)).padStart(2, "0"),
      s: String(Math.floor((diff % 6e4) / 1e3)).padStart(2, "0"),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
};

/* ── countdown unit ── */
const Unit = ({ value, label, delay }) => (
  <Box
    className="cs-unit"
    bg="#fff"
    border="1px solid rgba(59,110,240,.12)"
    borderRadius="16px"
    px="20px" py="16px"
    minW="72px" textAlign="center"
    boxShadow="0 2px 12px rgba(59,110,240,.07)"
    position="relative" overflow="hidden"
    style={{ animation: `cs-fadeUp .6s ${delay} ease both` }}
  >
    <Box
      className="cs-unit-num"
      fontFamily="'Sora',sans-serif" fontSize="1.9rem" fontWeight={900}
      color="#111827" letterSpacing="-1px" lineHeight={1} mb="6px"
    >
      {value}
    </Box>
    <Box
      fontFamily="'Sora',sans-serif" fontSize=".62rem" fontWeight={800}
      color="#9ca3af" letterSpacing=".08em" textTransform="uppercase"
    >
      {label}
    </Box>
    <Box
      position="absolute" bottom={0} left={0} right={0} h="3px"
      bg="linear-gradient(90deg,#3b6ef0,#6b96f5)"
      transformOrigin="left"
      style={{ animation: `cs-bar-grow .9s ${delay} ease both` }}
    />
  </Box>
);

const ComingSoon = () => {
  const canvasRef = useRef(null);

  /* launch date = 7 days from now */
  const target = useRef(Date.now() + 2 * 864e5 + 14 * 36e5 + 32 * 6e4);
  const time   = useCountdown(target.current);

  /* canvas particle network */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.3,
      dx: (Math.random() - 0.5) * 0.32,
      dy: (Math.random() - 0.5) * 0.32,
      op: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(59,110,240,.05)"; ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 72) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 72) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
      pts.forEach((a, i) =>
        pts.slice(i + 1).forEach((b) => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(59,110,240,${0.09 * (1 - d / 130)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        })
      );
      pts.forEach((p) => {
        p.pulse += 0.018;
        const r = p.r + Math.sin(p.pulse) * 0.35;
        ctx.fillStyle = `rgba(59,110,240,${p.op * 0.5})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <Box
      minH="100vh" bg="#f0f4ff"
      fontFamily="'DM Sans', sans-serif"
      position="relative" overflow="hidden"
      display="flex" flexDir="column"
      alignItems="center" justifyContent="center"
      px={{ base: "1.5rem", md: "2rem" }}
      py={{ base: "4rem", md: "3rem" }}
    >
      <style>{STYLES}</style>

      {/* canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      />

      {/* orbs */}
      <Box className="cs-orb cs-orb1" />
      <Box className="cs-orb cs-orb2" />
      <Box
        className="cs-orb cs-orb3"
        style={{ top: "40%", right: "15%" }}
      />

      <Box
        position="relative" zIndex={2}
        display="flex" flexDir="column" alignItems="center"
        textAlign="center"
      >

        {/* badge */}
        <Box
          display="inline-flex" alignItems="center" gap="8px"
          px="18px" py="7px" borderRadius="full" mb="28px"
          bg="rgba(59,110,240,.07)" border="1px solid rgba(59,110,240,.22)"
          style={{ animation: "cs-fadeUp .6s ease both" }}
        >
          <Box position="relative" w="7px" h="7px">
            <Box position="absolute" inset={0} borderRadius="full" bg="#3b6ef0" opacity={0.35}
              style={{ animation: "cs-ping 1.8s ease-in-out infinite" }} />
            <Box position="absolute" inset={0} borderRadius="full" bg="#3b6ef0" />
          </Box>
          <Box
            fontFamily="'Sora',sans-serif" fontSize="11px" fontWeight={800}
            color="#3b6ef0" letterSpacing=".1em" textTransform="uppercase"
          >
            Something epic is coming
          </Box>
        </Box>

        {/* rocket */}
        <Box
          position="relative" w="100px" h="100px"
          display="flex" alignItems="center" justifyContent="center"
          mb="32px"
          style={{ animation: "cs-fadeUp .6s .08s ease both" }}
        >
          <Box className="cs-ring cs-ring1" />
          <Box className="cs-ring cs-ring2" />
          <Box
            className="cs-rocket-bg"
            w="100px" h="100px" borderRadius="28px"
            bg="rgba(59,110,240,.09)" border="1px solid rgba(59,110,240,.2)"
            display="flex" alignItems="center" justifyContent="center"
            style={{ animation: "cs-rocket-float 3s ease-in-out infinite" }}
          >
            <FaRocket
              size={38}
              color="#3b6ef0"
              style={{ transform: "rotate(-45deg)", filter: "drop-shadow(0 4px 12px rgba(59,110,240,.35))" }}
            />
          </Box>
        </Box>

        {/* title */}
        <Box
          fontFamily="'Sora',sans-serif"
          fontSize={{ base: "2.6rem", md: "3.2rem" }}
          fontWeight={900} color="#111827"
          letterSpacing="-1.5px" lineHeight={1.05} mb="16px"
          style={{ animation: "cs-fadeUp .6s .16s ease both" }}
        >
          Coming{" "}
          <Box
            as="span"
            sx={{
              background: "linear-gradient(135deg,#6b96f5 0%,#3b6ef0 45%,#2251cc 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Soon!
          </Box>
        </Box>

        {/* sub */}
        <Box
          fontSize=".98rem" color="#4b5563" lineHeight={1.75}
          maxW="440px" mb="40px"
          style={{ animation: "cs-fadeUp .6s .24s ease both" }}
        >
          Exciting new features are on the way. We're building something that will completely transform your data journey.
        </Box>

        {/* countdown */}
        <Box
          display="flex" gap="12px" mb="40px" flexWrap="wrap" justifyContent="center"
          style={{ animation: "cs-fadeUp .6s .32s ease both" }}
        >
          <Unit value={time.d} label="Days"  delay=".32s" />
          <Unit value={time.h} label="Hours" delay=".38s" />
          <Unit value={time.m} label="Mins"  delay=".44s" />
          <Unit value={time.s} label="Secs"  delay=".50s" />
        </Box>

        {/* bouncing dots */}
        <Box
          display="flex" gap="6px" mb="36px"
          style={{ animation: "cs-fadeUp .6s .4s ease both" }}
        >
          {[0, .2, .4].map((d, i) => (
            <Box
              key={i} w="8px" h="8px" borderRadius="full" bg="#3b6ef0"
              style={{ animation: `cs-dotbounce 1.3s ease-in-out infinite ${d}s` }}
            />
          ))}
        </Box>

        {/* feature pills */}
        <Box
          display="flex" gap="10px" flexWrap="wrap" justifyContent="center"
          style={{ animation: "cs-fadeUp .6s .56s ease both" }}
        >
          {FEATURES.map((f) => (
            <Box
              key={f.label}
              className="cs-pill"
              display="inline-flex" alignItems="center" gap="7px"
              bg="#fff" border="1px solid rgba(59,110,240,.12)" borderRadius="99px"
              px="16px" py="7px"
              fontFamily="'Sora',sans-serif" fontSize=".75rem" fontWeight={700}
              color="#4b5563"
              boxShadow="0 2px 8px rgba(59,110,240,.06)"
            >
              <Box w="5px" h="5px" borderRadius="full" bg={f.dot} />
              {f.label}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ComingSoon;