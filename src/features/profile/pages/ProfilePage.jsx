import "../styles/profile.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../../util/Sidebar";
import BottomNav from "../../../util/BottomNav";

import {
  Box, Text, HStack, useToast,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter, ModalCloseButton,
  useDisclosure, Input, Switch,
} from "@chakra-ui/react";

import { useAuth } from "../../../util/AuthContext";
import { getMyScores, getLeaderboard, updateProfile, deleteAccount, getMe } from "../../../util/api";

import {
  FaAward, FaBullseye, FaLaptopFile,
  FaChartColumn, FaClock, FaListCheck, FaShield,
  FaBell, FaLock, FaTrash, FaPen, FaGear, FaFire, FaBoltLightning
} from "react-icons/fa6";
import { FaTrophy } from "react-icons/fa";

// ─── Level config
const LEVELS = [
  { label: "Beginner Analyst",     minXP: 0,    maxXP: 100,  color: "#6b96f5", emoji: "🌱" },
  { label: "Junior Analyst",       minXP: 100,  maxXP: 250,  color: "#3b6ef0", emoji: "📈" },
  { label: "Intermediate Analyst", minXP: 250,  maxXP: 500,  color: "#f59e0b", emoji: "⚡" },
  { label: "Senior Analyst",       minXP: 500,  maxXP: 1000, color: "#10b981", emoji: "🔥" },
  { label: "Data Expert",          minXP: 1000, maxXP: 2000, color: "#8b5cf6", emoji: "💎" },
  { label: "Master Analyst",       minXP: 2000, maxXP: 9999, color: "#ef4444", emoji: "👑" },
];

const getLevel = (xp) => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return { ...LEVELS[i], index: i };
  }
  return { ...LEVELS[0], index: 0 };
};

// ─── Badge config 
const computeBadges = (stats, scores, streak) => {
  const badges = [];
  const topics = [...new Set(scores.map((s) => s.topic))];

  const add = (id, label, icon, desc, condition) =>
    badges.push({ id, label, icon, desc, earned: !!condition });

  add("first",    "DataEre Rookie",     "🎯", "Completed your first session", stats.total >= 1);
  add("tenner",   "DataEre",   "📚", "Completed 10 sessions",             stats.total >= 10);
  add("fifty",    "DataEre Master",    "🏅", "Completed 50 sessions",             stats.total >= 50);
  add("ace",      "High Achiever",  "⭐", "Maintained 80%+ average",          stats.avgScore >= 80);
  add("perfect",  "Perfectionist",  "💯", "Scored 100% on a quiz",            stats.bestScore === 100);
  add("sql",      "SQL Starter",    "🗄️", "Completed an SQL quiz",            topics.some(t => t?.toLowerCase().includes("sql")));
  add("streak3",  "On Fire",        "🔥", "3-day learning streak",            streak >= 3);
  add("streak7",  "Week Warrior",   "⚡", "7-day learning streak",            streak >= 7);
  add("streak10", "Streak Master",  "🏆", "10-day unbroken streak",           streak >= 10);
  add("xp50",     "XP Collector",   "💎", "Earned 50+ total points",          stats.totalCorrect >= 50);
  add("xp200",    "Point Hoarder",  "👑", "Earned 200+ total points",         stats.totalCorrect >= 200);

  return badges;
};

// ─── Fake daily challenge
const fetchDailyChallenge = async () =>
  new Promise((res) =>
    setTimeout(() => res({
      title: "Sales Dashboard Insight", duration: 5, questions: 5, pts: 25,
    }), 500));

const RANK_STYLES = {
  1: { bg: "#faeeda", color: "#854f0b", border: "1px solid #ef9f27" },
  2: { bg: "#e6f1fb", color: "#185fa5", border: "1px solid #85b7eb" },
  3: { bg: "#faece7", color: "#993c1d", border: "1px solid #f0997b" },
};
const MEDALS = { 1: "🥇", 2: "🥈", 3: "🥉" };

// ─── Main 
const ProfilePage = () => {
  const navigate = useNavigate();
  const toast    = useToast();
  const {
    firstName, username, email, userId,
    streak, longestStreak, joinDate,
    login, logout, updateUser,
  } = useAuth();

  const [challenge, setChallenge]   = useState(null);
  const [timeLeft, setTimeLeft]     = useState(86400);
  const [stats, setStats]           = useState({ 
    totalCorrect: 0, total: 0, avgScore: 0, bestScore: 0 
  });
  const [scores, setScores]         = useState([]);
  const [bestSkill, setBestSkill]   = useState(null);
  const [worstSkill, setWorstSkill] = useState(null);
  const [board, setBoard]           = useState([]);

  // Settings state
  const [settingsTab, setSettingsTab]     = useState("profile");
  const [editName, setEditName]           = useState(username || "");
  const [editEmail, setEditEmail]         = useState(email || "");
  const [notifQuiz, setNotifQuiz]         = useState(true);
  const [notifLeader, setNotifLeader]     = useState(true);
  const [profilePublic, setProfilePublic] = useState(true);
  const [saving, setSaving]               = useState(false);
  const [deleting, setDeleting]           = useState(false);

  const { isOpen: isSettingsOpen, onOpen: openSettings, onClose: closeSettings } = useDisclosure();
  const { isOpen: isDeleteOpen,   onOpen: openDelete,   onClose: closeDelete   } = useDisclosure();

  // Fetch scores
  useEffect(() => {
    getMyScores().then((res) => {
      if (res.success) {
        setStats(res.data.stats);
        setScores(res.data.scores);
        setBestSkill(res.data.bestSkill);
        setWorstSkill(res.data.worstSkill);
      }
    });
  }, []);

  // Fetch leaderboard top 5
  useEffect(() => {
    getLeaderboard().then((res) => {
      if (res.success) {
        const sorted = [...res.data].sort((a, b) => b.totalCorrect - a.totalCorrect);
        setBoard(sorted.slice(0, 5));
      }
    });
  }, []);

  // Fetch latest user data (streak, joinDate) from backend
  useEffect(() => {
    getMe().then((res) => {
      if (res.success) updateUser(res.user);
    });
  }, []);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => setTimeLeft((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { fetchDailyChallenge().then(setChallenge); }, []);

  // Keep edit fields in sync when auth data loads
  useEffect(() => { setEditName(username || ""); }, [username]);
  useEffect(() => { setEditEmail(email || ""); }, [email]);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  const xp         = stats.totalCorrect;
  const level      = getLevel(xp);
  const nextLevel  = LEVELS[Math.min(level.index + 1, LEVELS.length - 1)];
  const xpProgress = Math.min(
    Math.round(((xp - level.minXP) / (level.maxXP - level.minXP)) * 100), 100
  );
  const badges = computeBadges(stats, scores, streak);

  const myRank = board.findIndex(
    (u) => String(u._id) === String(userId) || u.username === username
  ) + 1;

  const isYou = (u) => String(u._id) === String(userId) || u.username === username;

  const joinDateFormatted = joinDate
    ? new Date(joinDate).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : "—";

  // ── Save profile 
  const handleSaveProfile = async () => {
    if (!editName.trim() && !editEmail.trim()) return;
    setSaving(true);
    try {
      const res = await updateProfile(editName, editEmail);
      if (res.success) {
        updateUser(res.user);
        toast({ title: "Profile updated", status: "success", duration: 2000 });
        closeSettings();
      } else {
        toast({ title: res.message || "Update failed", status: "error", duration: 3000 });
      }
    } catch {
      toast({ title: "Network error", status: "error", duration: 3000 });
    } finally {
      setSaving(false);
    }
  };

  // ── Delete account 
  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await deleteAccount();
      if (res.success) {
        toast({ title: "Account deleted", status: "info", duration: 3000 });
        logout();
        navigate("/users/login");
      } else {
        toast({ title: res.message || "Delete failed", status: "error", duration: 3000 });
      }
    } catch {
      toast({ title: "Network error", status: "error", duration: 3000 });
    } finally {
      setDeleting(false);
      closeDelete();
    }
  };

 if (!challenge) {
  return (
    <Box
      minH="100vh" bg="#f0f4ff"
      fontFamily="'DM Sans', sans-serif"
      display="flex" flexDir="column"
      alignItems="center" justifyContent="center"
      position="relative" overflow="hidden"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&display=swap');

        @keyframes orbDrift1  { 0%,100%{transform:translate(0,0)}   50%{transform:translate(30px,20px)} }
        @keyframes orbDrift2  { 0%,100%{transform:translate(0,0)}   50%{transform:translate(-20px,-30px)} }
        @keyframes orbDrift3  { 0%,100%{transform:translate(0,0)}   50%{transform:translate(15px,-20px)} }
        @keyframes ringPulse  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.07);opacity:0.45} }
        @keyframes trophyFloat{ 0%,100%{transform:translateY(0)}    50%{transform:translateY(-7px)} }
        @keyframes fadeUp     { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dotBounce  {
          0%,80%,100%{ transform:scale(1);                    background:#3b6ef0; }
          40%         { transform:scale(1.5) translateY(-6px); background:#6d8ff5; }
        }
        @keyframes shimmer {
          0%   { transform:translateX(-100%); }
          100% { transform:translateX(100%); }
        }
        .pf-orb { position:absolute; border-radius:50%; pointer-events:none; }
        .pf-shimmer { position:relative; overflow:hidden; background:rgba(255,255,255,0.75); }
        .pf-shimmer::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(90deg, transparent 0%, rgba(59,110,240,0.08) 50%, transparent 100%);
          animation: shimmer 1.8s ease-in-out infinite;
        }
      `}</style>

      {/* Floating orbs */}
      <Box className="pf-orb" w="340px" h="340px" bg="#3b6ef0" opacity="0.13"
        top="-90px" left="-90px"
        style={{ animation: "orbDrift1 7s ease-in-out infinite" }} />
      <Box className="pf-orb" w="220px" h="220px" bg="#6d8ff5" opacity="0.11"
        bottom="-50px" right="-50px"
        style={{ animation: "orbDrift2 9s ease-in-out infinite" }} />
      <Box className="pf-orb" w="120px" h="120px" bg="#3b6ef0" opacity="0.10"
        bottom="80px" left="80px"
        style={{ animation: "orbDrift3 6s ease-in-out infinite" }} />

      {/* Trophy + pulse rings */}
      <Box position="relative" w="88px" h="88px" mb="24px">
        {["-22px", "-10px", "0px"].map((inset, i) => (
          <Box key={i} position="absolute"
            top={inset} left={inset} right={inset} bottom={inset}
            borderRadius="full"
            border={`${1.5 - i * 0.4}px solid rgba(59,110,240,${0.07 + i * 0.09})`}
            style={{ animation: `ringPulse 2s ease-in-out infinite ${i * 0.35}s` }}
          />
        ))}
        <Box position="absolute" inset="0" borderRadius="full"
          bg="rgba(59,110,240,0.09)"
          display="flex" alignItems="center" justifyContent="center" fontSize="2.2rem"
          style={{ animation: "trophyFloat 3s ease-in-out infinite" }}
        >
          {level.emoji}
        </Box>
      </Box>

      {/* Title */}
      <Text fontFamily="'Sora',sans-serif" fontSize="1.5rem" fontWeight={800}
        color="#111827" letterSpacing="-0.5px" mb="4px"
        style={{ animation: "fadeUp 0.5s ease both" }}>
        Hi 👋, {firstName}
      </Text>
      <Text fontSize="0.85rem" color="#4b5563" mb="32px"
        style={{ animation: "fadeUp 0.5s ease 0.08s both" }}>
        Loading your profile…
      </Text>

      {/* Stat shimmer cards — mirrors the streak / XP / sessions row */}
      <Box
        display="flex" gap="12px" mb="20px" w="100%" maxW="480px" px="1rem"
        style={{ animation: "fadeUp 0.5s ease 0.16s both" }}
      >
        {[
          { label: "Daily Streak",  w: "100%" },
          { label: "Total XP",      w: "100%" },
        ].map((c, i) => (
          <Box key={i} className="pf-shimmer" flex="1" h="72px"
            borderRadius="14px" border="1px solid rgba(59,110,240,0.12)">
            <Box p="10px 14px">
              <Box w="60%" h="10px" bg="rgba(59,110,240,0.08)" borderRadius="6px" mb="8px" />
              <Box w="40%" h="18px" bg="rgba(59,110,240,0.10)" borderRadius="6px" />
            </Box>
          </Box>
        ))}
      </Box>

      {/* XP progress bar skeleton */}
      <Box w="100%" maxW="480px" px="1rem" mb="20px"
        style={{ animation: "fadeUp 0.5s ease 0.22s both" }}>
        <Box className="pf-shimmer" h="76px" borderRadius="16px"
          border="1px solid rgba(59,110,240,0.12)">
          <Box p="14px 18px">
            <Box display="flex" justifyContent="space-between" mb="10px">
              <Box w="44px" h="44px" borderRadius="full"
                bg="rgba(59,110,240,0.08)" border="2px solid rgba(59,110,240,0.15)" />
              <Box w="60px" h="22px" bg="rgba(59,110,240,0.08)" borderRadius="99px" />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Challenge + leaderboard skeleton cards */}
      <Box w="100%" maxW="480px" px="1rem" mb="28px"
        style={{ animation: "fadeUp 0.5s ease 0.28s both" }}>
        <Box display="flex" gap="12px">
          {/* Daily challenge card */}
          <Box className="pf-shimmer" flex="1.3" h="110px"
            borderRadius="16px" border="1px solid rgba(59,110,240,0.12)" p="14px">
            <Box w="55%" h="11px" bg="rgba(59,110,240,0.09)" borderRadius="6px" mb="8px" />
            <Box w="80%" h="9px"  bg="rgba(59,110,240,0.06)" borderRadius="6px" mb="16px" />
            <Box w="100%" h="32px" bg="rgba(59,110,240,0.10)" borderRadius="10px" />
          </Box>
          {/* Leaderboard card */}
          <Box className="pf-shimmer" flex="1" h="110px"
            borderRadius="16px" border="1px solid rgba(59,110,240,0.12)" p="14px">
            {[70, 55, 45, 35].map((w, i) => (
              <Box key={i} display="flex" alignItems="center" gap="8px" mb="8px">
                <Box w="18px" h="18px" borderRadius="full" bg="rgba(59,110,240,0.09)" flexShrink={0} />
                <Box flex="1" h="9px" bg="rgba(59,110,240,0.07)" borderRadius="6px"
                  style={{ width: `${w}%` }} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Bouncing dots */}
      <Box display="flex" gap="16px"
        style={{ animation: "fadeUp 0.5s ease 0.34s both" }}>
        {[0, 0.2, 0.4, 0.6].map((delay, i) => (
          <Box key={i} w="9px" h="9px" borderRadius="full" bg="#3b6ef0"
            style={{ animation: `dotBounce 1.2s ease-in-out infinite ${delay}s` }} />
        ))}
      </Box>
    </Box>
  );
}

  return (
    <Box className="profile_page">
      <Sidebar />

      <Box className="dashboard_container">

        {/* ── Profile header ── */}
        <div className="profile">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <h1 className="welcome-heading">Hi 👋, {firstName} </h1>
            <button onClick={openSettings} style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 16px", borderRadius: "99px",
              border: "1px solid rgba(59,110,240,0.2)",
              background: "rgba(59,110,240,0.06)",
              color: "#3b6ef0", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer",
            }}>
              <FaGear size={13} /> Settings
            </button>
          </div>

          {/* Level + XP bar */}
          <div style={{
            background: "rgba(59,110,240,0.06)", border: "1px solid rgba(59,110,240,0.12)",
            borderRadius: "16px", padding: "16px 20px", marginTop: "14px",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "42px", height: "42px", borderRadius: "50%",
                  background: level.color + "22", border: `2px solid ${level.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
                }}>
                  {level.emoji}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>{myRank > 0 ? `Rank #${myRank}` : "Unranked"}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    Joined {joinDateFormatted}
                  </div>
                </div>
              </div>
              <div style={{
                padding: "4px 12px", borderRadius: "99px",
                background: level.color + "22", color: level.color,
                fontSize: "0.75rem", fontWeight: 700,
              }}>
                Level {level.index + 1}
              </div>
            </div>
            <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginBottom: "5px", display: "flex", justifyContent: "space-between" }}>
              <span>{xp - level.minXP} / {level.maxXP - level.minXP} XP to next level</span>
              <span>Next: {nextLevel.label}</span>
            </div>
            <div style={{ height: "8px", background: "rgba(59,110,240,0.12)", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${xpProgress}%`,
                background: level.color, borderRadius: "99px", transition: "width 0.6s ease",
              }} />
            </div>
          </div>

          <div className="dash-list" style={{ marginTop: "14px" }}>
            <div className="rank-badge">
              <FaAward className="rank-icon" />
              <span>{level.label}</span>
            </div>
            <div className="profile-btn" onClick={() => navigate("/board")}>View Leaderboard</div>
          </div>

          <div className="dash-list colored">
            <div className="dash-list-card">
              <Box className="icon" sx={{ color: "#304ecf" }}><FaFire /></Box>
              <div className="list-text">
                <p>Daily Streak</p>
                <h3>{streak}-day{streak !== 1 ? "s" : ""}</h3>
              </div>
            </div>
            <div className="dash-list-card">
              <Box className="icon" sx={{ color: "#304ecf" }}><FaBoltLightning /></Box>
              <div className="list-text">
                <p>Total XP</p>
                <h3>{stats.totalCorrect} XP</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="low-box">

          {/* ── Left ── */}
          <div className="max_box left-side-box">
            <div className="second_box">
              <h2><FaLaptopFile className="box_icon" /> Enter Learning Lab</h2>
              <p>Test your skill level.</p>
              <div onClick={() => navigate("/quiz/topics")} className="max-box-btn">Start Learning Sprint</div>
            </div>
            
            <div className="first_box">
              <h2><FaBullseye className="box_icon" /> Daily Data Challenge</h2>
              <p>Sharpen your data skills in just 5 minutes and earn rewards.</p>
              <HStack className="instruction" spacing={3} fontSize="sm">
                <div className="instruction-item"><FaClock className="box_icon" /><span>{challenge.duration} mins</span></div>
                <div className="instruction-item"><FaListCheck className="box_icon" /><span>{challenge.questions} questions</span></div>
                <div className="instruction-item"><FaBoltLightning className="box_icon" /><span>{challenge.pts} XP</span></div>
              </HStack>
              <div onClick={() => navigate("/challenge")} className="max-box-btn">Start Challenge</div>
              <p className="footer_note">Only 23% of users completed yesterday's challenge.</p>
            </div>

            <div className="third_box">
              <h2><FaChartColumn className="box_icon" /> Your Data Journey</h2>
              <div className="third-inner">
                <div>
                  <p>Sessions Taken: <span>{String(stats.total).padStart(2,"0")}</span></p>
                  <p>Best Skill: <span style={{ textTransform:"capitalize", color:"green" }}>{bestSkill?.topic ?? "N/A"}</span></p>
                </div>
                <div>
                  <p>Average Score: <span>{stats.avgScore}%</span></p>
                  <p>Weak Skill: <span style={{ textTransform:"capitalize", color:"red" }}>{worstSkill?.topic ?? "N/A"}</span></p>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div style={{
              background: "#fff", borderRadius: "16px",
              border: "1px solid rgba(59,110,240,0.10)", padding: "18px 20px",
            }}>
              <h2 style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"14px", fontSize:"0.95rem", fontWeight:700 }}>
                <FaShield style={{ color:"#3b6ef0" }} /> Badges Earned
              </h2>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                {badges.map((b) => (
                  <div key={b.id} title={b.desc} style={{
                    display:"flex", alignItems:"center", gap:"5px",
                    padding:"5px 11px", borderRadius:"99px",
                    background: b.earned ? "rgba(59,110,240,0.08)" : "rgba(0,0,0,0.04)",
                    border:`1px solid ${b.earned ? "rgba(59,110,240,0.2)" : "rgba(0,0,0,0.08)"}`,
                    opacity: b.earned ? 1 : 0.4,
                    filter: b.earned ? "none" : "grayscale(1)",
                  }}>
                    <span style={{ fontSize:"13px" }}>{b.earned ? b.icon : "🔒"}</span>
                    <span style={{ fontSize:"0.73rem", fontWeight:600, color: b.earned ? "#3b6ef0" : "#9ca3af" }}>
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right ── */}
          <div className="max_box right-side-box">

            {/* Leaderboard */}
            <div className="leaderboard-header">
              <span><FaTrophy className="box_icon" /></span>
              <span>Top DataErians</span>
            </div>
            <div className="leaderboard-list">
              {board.length === 0
                ? [1,2,3,4,5].map((n) => (
                    <div key={n} className="leaderboard-item" style={{ opacity:0.4 }}>
                      <span className="leaderboard-rank">{n}</span>
                      <span className="leaderboard-name">—</span>
                      <span className="leaderboard-points">— XP</span>
                    </div>
                  ))
                : board.map((u, i) => {
                    const rank = i + 1;
                    const you  = isYou(u);
                    const rs   = RANK_STYLES[rank] ?? {};
                    const rankClass = rank === 1 ? "gold" : rank === 2 ? "silver" : rank === 3 ? "bronze" : "";
                    return (
                      <div key={u._id} className="leaderboard-item"
                        style={{ background: you ? "rgba(59,110,240,0.06)" : "transparent", borderRadius:"10px" }}>
                        <span className={`leaderboard-rank ${rankClass}`} style={rs}>
                          {MEDALS[rank] ?? rank}
                        </span>
                        <span className="leaderboard-name">
                          {u.username}
                          {you && <span style={{ marginLeft:"5px", fontSize:"0.7rem", color:"#3b6ef0", fontWeight:600 }}>(you)</span>}
                        </span>
                        <span className="leaderboard-points">
                          {u.totalCorrect}<span style={{ fontSize:"0.7rem", color:"#9ca3af", marginLeft:"2px" }}>XP</span>
                        </span>
                      </div>
                    );
                  })}
            </div>
            <p className="leaderboard-footer" onClick={() => navigate("/board")} style={{ cursor:"pointer" }}>
              View Full Leaderboard
            </p>

            {/* Achievements */}
            <div style={{
              marginTop:"16px", background:"#ebf1fd", borderRadius:"14px",
              border:"1px solid rgba(145, 176, 255, 0.1)", padding:"16px",
            }}>
              <h3 style={{ fontWeight:700, fontSize:"0.9rem", marginBottom:"12px", display:"flex", alignItems:"center", gap:"8px" }}>
                🏆 Achievements Unlocked
              </h3>
              {badges.filter(b => b.earned).length === 0 ? (
                <p style={{ fontSize:"0.8rem", color:"#9ca3af" }}>Staart a session to unlock achievements!</p>
              ) : (
                badges.filter(b => b.earned).slice(0, 4).map((b) => (
                  <div key={b.id} style={{
                    display:"flex", alignItems:"center", gap:"10px",
                    padding:"8px 0", borderBottom:"1px solid rgba(59,110,240,0.07)",
                  }}>
                    <span style={{ fontSize:"18px" }}>{b.icon}</span>
                    <div>
                      <div style={{ fontSize:"0.82rem", fontWeight:600, color:"#111827" }}>{b.label}</div>
                      <div style={{ fontSize:"0.72rem", color:"#9ca3af" }}>{b.desc}</div>
                    </div>
                    <span style={{
                      marginLeft:"auto", fontSize:"0.68rem", fontWeight:700,
                      padding:"2px 8px", borderRadius:"99px",
                      background:"rgba(14,168,116,0.10)", color:"#0ea874",
                    }}>Earned</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Box>

      {/* ── Settings Modal ── */}
      <Modal isOpen={isSettingsOpen} onClose={closeSettings} size="lg" scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(6px)" />
        <ModalContent borderRadius="20px" mx="1rem">
          <ModalHeader fontFamily="'Sora',sans-serif" fontWeight={800} fontSize="1.1rem" pt="1.5rem">
            Settings
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="1.5rem">

            {/* Tabs */}
            <div style={{ display:"flex", gap:"8px", marginBottom:"20px", flexWrap:"wrap" }}>
              {[
                { key:"profile", label:"Edit Profile",  icon:<FaPen size={11} /> },
                { key:"notif",   label:"Notifications", icon:<FaBell size={11} /> },
                { key:"privacy", label:"Privacy",       icon:<FaLock size={11} /> },
                { key:"danger",  label:"Account",       icon:<FaTrash size={11} /> },
              ].map((t) => (
                <button key={t.key} onClick={() => setSettingsTab(t.key)}
                  style={{
                    display:"flex", alignItems:"center", gap:"6px",
                    padding:"7px 14px", borderRadius:"99px",
                    border:`1px solid ${settingsTab === t.key ? "#3b6ef0" : "rgba(59,110,240,0.15)"}`,
                    background: settingsTab === t.key ? "#3b6ef0" : "transparent",
                    color: settingsTab === t.key ? "white" : "#4b5563",
                    fontWeight:600, fontSize:"0.8rem", cursor:"pointer",
                  }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Profile tab */}
            {settingsTab === "profile" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                <div>
                  <label style={{ fontSize:"0.8rem", fontWeight:600, color:"#4b5563", display:"block", marginBottom:"6px" }}>Full name</label>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your name" borderRadius="12px" fontSize="0.9rem"
                    border="1px solid rgba(59,110,240,0.2)"
                    _focus={{ borderColor:"#3b6ef0", boxShadow:"0 0 0 3px rgba(59,110,240,0.12)" }} />
                </div>
                <div>
                  <label style={{ fontSize:"0.8rem", fontWeight:600, color:"#4b5563", display:"block", marginBottom:"6px" }}>Email address</label>
                  <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)}
                    type="email" placeholder="your@email.com" borderRadius="12px" fontSize="0.9rem"
                    border="1px solid rgba(59,110,240,0.2)"
                    _focus={{ borderColor:"#3b6ef0", boxShadow:"0 0 0 3px rgba(59,110,240,0.12)" }} />
                </div>
                <div>
                  <label style={{ fontSize:"0.8rem", fontWeight:600, color:"#4b5563", display:"block", marginBottom:"6px" }}>Member since</label>
                  <Input value={joinDateFormatted} isReadOnly borderRadius="12px"
                    fontSize="0.9rem" bg="rgba(0,0,0,0.03)" border="1px solid rgba(59,110,240,0.1)" />
                </div>
                <div>
                  <label style={{ fontSize:"0.8rem", fontWeight:600, color:"#4b5563", display:"block", marginBottom:"6px" }}>Longest streak</label>
                  <Input value={`${longestStreak} day${longestStreak !== 1 ? "s" : ""}`}
                    isReadOnly borderRadius="12px" fontSize="0.9rem"
                    bg="rgba(0,0,0,0.03)" border="1px solid rgba(59,110,240,0.1)" />
                </div>
                <button onClick={handleSaveProfile} disabled={saving}
                  style={{
                    padding:"12px", borderRadius:"12px", border:"none",
                    background: saving ? "rgba(59,110,240,0.5)" : "linear-gradient(135deg,#2251cc,#3b6ef0)",
                    color:"white", fontWeight:700, fontSize:"0.9rem",
                    cursor: saving ? "not-allowed" : "pointer",
                  }}>
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            )}

            {/* Notifications tab */}
            {settingsTab === "notif" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                {[
                  { label:"Daily reminders",      sub:"Daily nudges to keep your streak", val:notifQuiz,   set:setNotifQuiz   },
                  { label:"Leaderboard updates", sub:"When your rank changes",            val:notifLeader, set:setNotifLeader },
                ].map((item) => (
                  <div key={item.label} style={{
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"12px 16px", borderRadius:"12px",
                    border:"1px solid rgba(59,110,240,0.10)", background:"rgba(59,110,240,0.03)",
                  }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:"0.88rem", color:"#111827" }}>{item.label}</div>
                      <div style={{ fontSize:"0.75rem", color:"#9ca3af" }}>{item.sub}</div>
                    </div>
                    <Switch isChecked={item.val} onChange={() => item.set(!item.val)} colorScheme="blue" size="md" />
                  </div>
                ))}
              </div>
            )}

            {/* Privacy tab */}
            {settingsTab === "privacy" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                <div style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"12px 16px", borderRadius:"12px",
                  border:"1px solid rgba(59,110,240,0.10)", background:"rgba(59,110,240,0.03)",
                }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:"0.88rem", color:"#111827" }}>Public profile</div>
                    <div style={{ fontSize:"0.75rem", color:"#9ca3af" }}>Show your name on the leaderboard</div>
                  </div>
                  <Switch isChecked={profilePublic} onChange={() => setProfilePublic(!profilePublic)} colorScheme="blue" size="md" />
                </div>
                <div style={{
                  padding:"12px 16px", borderRadius:"12px",
                  border:"1px solid rgba(59,110,240,0.10)", background:"rgba(59,110,240,0.03)",
                  fontSize:"0.82rem", color:"#4b5563", lineHeight:1.6,
                }}>
                  Your data is never sold to third parties. Scores are stored securely.
                </div>
              </div>
            )}

            {/* Danger tab */}
            {settingsTab === "danger" && (
              <div style={{
                padding:"14px 16px", borderRadius:"12px",
                border:"1px solid rgba(239,68,68,0.2)", background:"rgba(239,68,68,0.04)",
              }}>
                <div style={{ fontWeight:700, fontSize:"0.88rem", color:"#dc2626", marginBottom:"4px" }}>Delete account</div>
                <div style={{ fontSize:"0.78rem", color:"#9ca3af", marginBottom:"12px" }}>
                  Permanently deletes your account, all scores, and data. Cannot be undone.
                </div>
                <button onClick={() => { closeSettings(); openDelete(); }}
                  style={{
                    padding:"9px 18px", borderRadius:"10px",
                    border:"1px solid rgba(239,68,68,0.4)", background:"transparent",
                    color:"#dc2626", fontWeight:700, fontSize:"0.82rem", cursor:"pointer",
                    display:"flex", alignItems:"center", gap:"6px",
                  }}>
                  <FaTrash size={12} /> Delete my account
                </button>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal isOpen={isDeleteOpen} onClose={closeDelete} size="sm" isCentered>
        <ModalOverlay backdropFilter="blur(6px)" />
        <ModalContent borderRadius="20px" mx="1rem">
          <ModalHeader fontFamily="'Sora',sans-serif" fontWeight={800} color="#dc2626" fontSize="1rem">
            Delete account?
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="0.5rem" fontSize="0.88rem" color="#4b5563" lineHeight={1.6}>
            All your scores, badges, and progress will be permanently deleted. This cannot be undone.
          </ModalBody>
          <ModalFooter gap="8px">
            <button onClick={closeDelete} style={{
              padding:"9px 18px", borderRadius:"10px",
              border:"1px solid rgba(59,110,240,0.2)", background:"transparent",
              fontWeight:600, fontSize:"0.85rem", cursor:"pointer",
            }}>
              Cancel
            </button>
            <button onClick={handleDeleteAccount} disabled={deleting}
              style={{
                padding:"9px 18px", borderRadius:"10px", border:"none",
                background: deleting ? "rgba(220,38,38,0.5)" : "#dc2626",
                color:"white", fontWeight:700, fontSize:"0.85rem",
                cursor: deleting ? "not-allowed" : "pointer",
              }}>
              {deleting ? "Deleting..." : "Yes, delete"}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <BottomNav />
    </Box>
  );
};

export default ProfilePage;