import { useEffect, useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import confetti from "canvas-confetti";
import {
  FaWhatsapp,
  FaLinkedinIn,
  FaFacebook,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton
} from "@chakra-ui/react";

import { QuizContext } from "../../../shared/contexts/Contexts";

// ── Badge config 
const getBadge = (pct) => {
  if (pct >= 90) return { emoji: "🥇", label: "Outstanding!",  color: "#ef9f27", bg: "#faeeda", border: "#ef9f27" };
  if (pct >= 70) return { emoji: "🥈", label: "Great job!",    color: "#185fa5", bg: "#e6f1fb", border: "#85b7eb" };
  if (pct >= 50) return { emoji: "🥉", label: "Good effort!",  color: "#993c1d", bg: "#faece7", border: "#f0997b" };
  return { emoji: "👏", label: "Keep going!",        color: "#3c3489", bg: "#eeedfe", border: "#afa9ec" };
};

// ── Share messages
const getShareMessage = (pct, category) => {
  const msgs = [
    `I just scored ${pct}% on the DataEre ${category} Session! 😎 Think you can beat me?`,
    `${pct}% on the DataEre ${category} Session. Bet you can't beat that 😏`,
    `Just crushed the DataEre ${category} Session with ${pct}%! 🎉 Can you do better?`,
    `${pct}% on the DataEre ${category} Session! Ready to challenge yourself? 😏`,
  ];
  return msgs[Math.floor(Math.random() * msgs.length)];
};

// ── Animated number 
const AnimatedNumber = ({ target, duration = 1200, suffix = "" }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setVal(Math.round(start));
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{val}{suffix}</>;
};

// ── Ring 
const ScoreRing = ({ percentage }) => {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (percentage / 100) * circ;
  const color = percentage >= 70 ? "#10b981" : percentage >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ position: "relative", width: 128, height: 128, margin: "0 auto" }}>
      <svg width="128" height="128" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(59,110,240,0.10)" strokeWidth="10" />
        <circle cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.34,1.3,0.64,1)" }} />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "#111827", fontFamily: "'Sora',sans-serif", lineHeight: 1 }}>
          <AnimatedNumber target={percentage} suffix="%" />
        </span>
        <span style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "2px" }}>score</span>
      </div>
    </div>
  );
};

// ── Stat pill 
const StatPill = ({ label, value, color }) => (
  <div style={{
    flex: 1, textAlign: "center",
    padding: "10px 8px", borderRadius: "12px",
    background: color + "15", border: `1px solid ${color}30`,
  }}>
    <div style={{ fontSize: "1.2rem", fontWeight: 800, color, fontFamily: "'Sora',sans-serif" }}>{value}</div>
    <div style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "2px" }}>{label}</div>
  </div>
);

// ── Main 
const QuizShareCard = ({ score = 0, isOpen, onClose }) => {
  const {
    questions = [],
    setWrongAnswer,
    setRefresh,
    setScore,
    setBotScore,
    wrongAnswer = 0,
    categories = "General",
  } = useContext(QuizContext);

  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const [copied, setCopied]     = useState(false);
  const [sharing, setSharing]   = useState(false);

  const mode     = searchParams.get("mode");
  const total    = questions.length;
  const skipped  = Math.max(total - score - wrongAnswer, 0);
  const pct      = total > 0 ? Math.round((score / total) * 100) : 0;
  const badge    = getBadge(pct);
  const category = categories.charAt(0).toUpperCase() + categories.slice(1).toLowerCase();
  const message  = getShareMessage(pct, category);
  const url      = "https://dataxo.cfd";

  useEffect(() => {

    // Confetti
    const fire = () => confetti({
      particleCount: pct >= 70 ? 140 : 60,
      spread: pct >= 70 ? 80 : 45,
      origin: { y: 0.55 },
      colors: pct >= 90
        ? ["#ef9f27", "#faeeda", "#ffffff"]
        : pct >= 70
        ? ["#3b6ef0", "#6b96f5", "#ffffff"]
        : ["#a78bfa", "#c4b5fd", "#ffffff"],
    });
    setTimeout(fire, 200);
    if (pct >= 90) setTimeout(fire, 700);
  }, [pct]);

  const shareUrl = async (platform = null) => {
    const full = `${message}\nTest your skills: ${url}`;
    const links = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(full)}`,
      twitter:  `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    if (platform) { window.open(links[platform], "_blank", "width=600,height=500"); return; }
    if (navigator.share) {
      try { await navigator.share({ title: "DataEre Quiz", text: message, url }); return; } catch {}
    }
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { alert("Sharing not supported on this device."); }
  };

  const reset = () => {
    setScore(0); setBotScore?.(0); setWrongAnswer(0);
    setRefresh((p) => !p);
    navigate(mode === "vsbot" ? "/quiz/vsbot" : "/quiz/solo");
  };

  const goHome = () => {
    setScore(0); setBotScore?.(0); setWrongAnswer(0);
    navigate("/quiz/topics");
  };

  return (
  <Modal isOpen={isOpen} onClose={onClose} size="sm" scrollBehavior="inside" isCentered >
    <ModalOverlay backdropFilter="blur(12px)" bg="rgba(15,27,53,0.55)" />
    <ModalContent borderRadius="24px" mx="1rem"  maxH="80vh">
      <ModalCloseButton />
      <ModalBody p="28px 24px">

        {/* Badge + topic */}
        <div style={{ textAlign: "center", marginBottom: "18px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "5px 14px", borderRadius: "99px",
            background: badge.bg, border: `1px solid ${badge.border}`,
            fontSize: "0.75rem", fontWeight: 700, color: badge.color,
            marginBottom: "12px",
          }}>
            <span>{badge.emoji}</span>
            <span>{badge.label}</span>
          </div>
          <div style={{ fontSize: "0.82rem", color: "#9ca3af" }}>
            {category} Session
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "8px", margin: "18px 0" }}>
          <StatPill label="Correct"  value={score}        color="#10b981" />
          <StatPill label="Wrong"    value={wrongAnswer}  color="#ef4444" />
          <StatPill label="Skipped"  value={skipped}      color="#f59e0b" />
          <StatPill label="Total"    value={total}        color="#3b6ef0" />
        </div>

        {/* Share message */}
        <div style={{
          background: "rgba(59,110,240,0.04)", border: "1px solid rgba(59,110,240,0.12)",
          borderRadius: "12px", padding: "12px 14px", marginBottom: "16px",
          fontSize: "0.82rem", color: "#4b5563", lineHeight: 1.55, textAlign: "center",
        }}>
          {message}
        </div>

        {/* Quick share */}
        <button
          onClick={() => { setSharing(true); shareUrl(); setSharing(false); }}
          style={{
            width: "100%", padding: "12px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, #2251cc, #3b6ef0)",
            color: "white", fontWeight: 700, fontSize: "0.9rem",
            cursor: "pointer", marginBottom: "12px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            transition: "all 0.2s",
          }}>
          {copied ? "✅ Copied to clipboard!" : "⚡ Quick Share"}
        </button>

        {/* Social buttons */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {[
            { platform: "whatsapp", Icon: FaWhatsapp,   color: "#25d366", bg: "#f0fdf4", border: "#bbf7d0" },
            { platform: "twitter",  Icon: FaXTwitter,   color: "#fff",    bg: "#2b2b2b", border: "#2b2b2b" },
            { platform: "facebook", Icon: FaFacebook,   color: "#1877f2", bg: "#eff6ff", border: "#bfdbfe" },
            { platform: "linkedin", Icon: FaLinkedinIn, color: "#0a66c2", bg: "#eff6ff", border: "#bfdbfe" },
          ].map(({ platform, Icon, color, bg, border }) => (
            <button key={platform} onClick={() => shareUrl(platform)}
              style={{
                flex: 1, padding: "10px 0", borderRadius: "10px",
                background: bg, border: `1px solid ${border}`,
                color, fontSize: "1rem", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 4px 12px ${color}30`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <Icon />
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={reset}
            style={{
              flex: 1, padding: "11px", borderRadius: "12px",
              border: "1px solid rgba(59,110,240,0.2)",
              background: "rgba(59,110,240,0.05)", color: "#3b6ef0",
              fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(59,110,240,0.10)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(59,110,240,0.05)"; }}>
            🔄 Try Again
          </button>
          <button onClick={goHome}
            style={{
              flex: 1, padding: "11px", borderRadius: "12px",
              border: "none",
              background: "#111827", color: "white",
              fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#1f2937"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#111827"; e.currentTarget.style.transform = "none"; }}>
            🏠 Dashboard
          </button>
        </div>

      </ModalBody>
    </ModalContent>
  </Modal>
);
};

export default QuizShareCard;