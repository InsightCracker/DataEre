import "../styles/profile.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../../util/Sidebar";
import BottomNav from "../../../util/BottomNav";

import {
  Box,
  Text,
  HStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Input,
  Switch,
  Divider,
} from "@chakra-ui/react";

import { SiThunderstore } from "react-icons/si";
import { useAuth } from "../../../util/AuthContext";
import { getMyScores, getLeaderboard } from "../../../util/api";

import {
  FaAward,
  FaBullseye,
  FaGraduationCap,
  FaLaptopFile,
  FaChartColumn,
  FaClock,
  FaListCheck,
  FaShield,
  FaBell,
  FaLock,
  FaTrash,
  FaPen,
  FaGear,
  FaXmark,
} from "react-icons/fa6";
import { FaTrophy } from "react-icons/fa";

// ─── Level config ─────────────────────────────────────────────────────────────
const LEVELS = [
  { label: "Beginner Analyst",      minXP: 0,    maxXP: 100,  color: "#6b96f5" },
  { label: "Junior Analyst",        minXP: 100,  maxXP: 250,  color: "#3b6ef0" },
  { label: "Intermediate Analyst",  minXP: 250,  maxXP: 500,  color: "#f59e0b" },
  { label: "Senior Analyst",        minXP: 500,  maxXP: 1000, color: "#10b981" },
  { label: "Data Expert",           minXP: 1000, maxXP: 2000, color: "#8b5cf6" },
  { label: "Master Analyst",        minXP: 2000, maxXP: 9999, color: "#ef4444" },
];

const getLevel = (xp) => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return { ...LEVELS[i], index: i };
  }
  return { ...LEVELS[0], index: 0 };
};

// ─── Badge config ─────────────────────────────────────────────────────────────
const computeBadges = (stats, scores, streak) => {
  const badges = [];
  const topics = [...new Set(scores.map((s) => s.topic))];

  if (stats.total >= 1)    badges.push({ id: "first",   label: "DataEre Rookie",     icon: "🎯", desc: "Completed your first session", earned: true });
  if (stats.total >= 10)   badges.push({ id: "tenner",  label: "DataEre Explorer",   icon: "📚", desc: "Completed 10 session", earned: true });
  if (stats.total >= 50)   badges.push({ id: "fifty",   label: "DataEre Elite",    icon: "🏅", desc: "Completed 50 session", earned: true });
  if (stats.avgScore >= 80) badges.push({ id: "ace",    label: "DataEre Pro",  icon: "⭐", desc: "Maintained 80%+ average", earned: true });
  if (stats.bestScore === 100) badges.push({ id: "perfect", label: "Perfectionist", icon: "💯", desc: "Scored 100% on a session", earned: true });

  if (topics.includes("SQL") || topics.some(t => t?.toLowerCase().includes("sql")))
    badges.push({ id: "sql",  label: "SQL Starter",    icon: "🗄️", desc: "Completed an SQL quiz", earned: true });
  if (streak >= 3)  badges.push({ id: "streak3",  label: "On Fire",          icon: "🔥", desc: "3-day learning streak", earned: true });
  if (streak >= 7)  badges.push({ id: "streak7",  label: "Week Warrior",     icon: "⚡", desc: "7-day learning streak", earned: true });
  if (streak >= 15) badges.push({ id: "streak15", label: "Streak Master",    icon: "🏆", desc: "15-day unbroken streak", earned: true });
  if (stats.totalCorrect >= 50)  badges.push({ id: "xp50",  label: "XP Collector",  icon: "💎", desc: "Earned 50+ total points", earned: true });
  if (stats.totalCorrect >= 200) badges.push({ id: "xp200", label: "Point Hoarder", icon: "👑", desc: "Earned 200+ total points", earned: true });

  // Locked badges (teasers)
  if (!badges.find(b => b.id === "streak15"))
    badges.push({ id: "streak15", label: "Streak Master", icon: "🏆", desc: "Reach a 10-day streak",   earned: false });
  if (!badges.find(b => b.id === "perfect"))
    badges.push({ id: "perfect",  label: "Perfectionist", icon: "💯", desc: "Score 100% on any session", earned: false });
  if (!badges.find(b => b.id === "fifty"))
    badges.push({ id: "fifty",    label: "DataEre Elite",   icon: "🏅", desc: "Complete 50 sessions", earned: false });

  return badges;
};

// ─── Fake challenge 
const fetchDailyChallenge = async () =>
  new Promise((res) =>
    setTimeout(() =>
      res({
        title: "Sales Dashboard Insight",
        description: "Analyze the dataset and identify the key revenue driver.",
        duration: 5, questions: 5, pts: 25, difficulty: "Medium",
      }), 500));

// ─── Rank medal colors 
const RANK_STYLES = {
  1: { bg: "#faeeda", color: "#854f0b", border: "1px solid #ef9f27" },
  2: { bg: "#e6f1fb", color: "#185fa5", border: "1px solid #85b7eb" },
  3: { bg: "#faece7", color: "#993c1d", border: "1px solid #f0997b" },
};
const MEDALS = { 1: "🥇", 2: "🥈", 3: "🥉" };

// ─── Main component 
const ProfilePage = () => {
  const [challenge, setChallenge] = useState(null);
  const [timeLeft, setTimeLeft]   = useState(86400);
  const toast      = useToast();
  const navigate   = useNavigate();
  const { firstName, lastName, email, username, userId } = useAuth();

  const [stats, setStats] = useState({ totalCorrect: 0, total: 0, avgScore: 0, bestScore: 0 });
  const [scores, setScores] = useState([]);
  const [bestSkill, setBestSkill] = useState(null);
  const [worstSkill, setWorstSkill] = useState(null);
  const [board, setBoard] = useState([]);
  const [streak] = useState(0); // replace with real streak logic
  const [settingsTab, setSettingsTab] = useState("profile");
  const [notifQuiz, setNotifQuiz] = useState(true);
  const [notifLeader, setNotifLeader] = useState(true);
  const [profilePublic, setProfilePublic] = useState(true);
  const [editName, setEditName] = useState(username || "");
  const [editEmail, setEditEmail]= useState(email || "");

  const { isOpen: isSettingsOpen, onOpen: openSettings, onClose: closeSettings } = useDisclosure();
  const { isOpen: isDeleteOpen,   onOpen: openDelete,   onClose: closeDelete   } = useDisclosure();

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

  useEffect(() => {
    getLeaderboard().then((res) => {
      if (res.success) {
        const sorted = [...res.data].sort((a, b) => b.totalCorrect - a.totalCorrect);
        setBoard(sorted.slice(0, 5));
      }
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { fetchDailyChallenge().then(setChallenge); }, []);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  const xp = stats.totalCorrect;
  const level = getLevel(xp);
  const nextLevel = LEVELS[Math.min(level.index + 1, LEVELS.length - 1)];
  const xpProgress = Math.min(Math.round(((xp - level.minXP) / (level.maxXP - level.minXP)) * 100), 100);
  const badges = computeBadges(stats, scores, streak);

  // My rank on leaderboard
  const myRank = board.findIndex(
    (u) => String(u._id) === String(userId) || u.username === username
  ) + 1;

  const isYou = (u) => String(u._id) === String(userId) || u.username === username;

  if (!challenge) return <Text p={6}>Loading...</Text>;

  return (
    <Box className="profile_page">
      <Sidebar />

      <Box className="dashboard_container">

        {/* ── Profile header ── */}
        <div className="profile">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <h1 className="welcome-heading">Welcome back, {firstName}</h1>
            <button
              onClick={openSettings}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "8px 16px", borderRadius: "99px",
                border: "1px solid rgba(59,110,240,0.2)",
                background: "rgba(59,110,240,0.06)",
                color: "#3b6ef0", fontWeight: 600, fontSize: "0.82rem",
                cursor: "pointer",
              }}>
              <FaGear size={13} /> Settings
            </button>
          </div>

          {/* Level + XP bar */}
          <div style={{
            background: "rgba(59,110,240,0.06)",
            border: "1px solid rgba(59,110,240,0.12)",
            borderRadius: "16px", padding: "16px 20px", marginTop: "14px",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: level.color + "22", border: `2px solid ${level.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px",
                }}>
                  {level.index === 0 ? "🌱" : level.index === 1 ? "📈" : level.index === 2 ? "⚡" : level.index === 3 ? "🔥" : level.index === 4 ? "💎" : "👑"}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>{level.label}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    {myRank > 0 ? `Rank #${myRank}` : "Unranked"}
                  </div>
                </div>
              </div>
              <div style={{
                padding: "4px 12px", borderRadius: "99px",
                background: level.color + "22",
                color: level.color,
                fontSize: "0.75rem", fontWeight: 700,
              }}>
                Level {level.index + 1}
              </div>
            </div>

            {/* XP progress bar */}
            <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginBottom: "5px", display: "flex", justifyContent: "space-between" }}>
              <span>{xp - level.minXP} / {level.maxXP - level.minXP} XP</span>
              <span>Next: {nextLevel.label}</span>
            </div>
            <div style={{ height: "8px", background: "rgba(59,110,240,0.12)", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${xpProgress}%`,
                background: level.color, borderRadius: "99px",
                transition: "width 0.6s ease",
              }} />
            </div>
          </div>

          <div className="dash-list" style={{ marginTop: "14px" }}>
            <div className="rank-badge">
              <FaAward className="rank-icon" />
              <span>{level.label}</span>
            </div>
            <div className="profile-btn" onClick={() => navigate("/board")}>
              View Leaderboard
            </div>
          </div>

          <div className="dash-list colored">
            <div className="dash-list-card">
              <Box className="icon" sx={{ color: "#304ecf" }}>
                <SiThunderstore />
              </Box>
              <div className="list-text">
                <p>Daily Streak</p>
                <h3>{streak} days {streak > 0 ? "🔥" : ""}</h3>
              </div>
            </div>
            <div className="dash-list-card">
              <Box className="icon" sx={{ color: "#304ecf" }}>
                <FaGraduationCap />
              </Box>
              <div className="list-text">
                <p>Total Points</p>
                <h3>{stats.totalCorrect} XP</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="low-box">

          {/* ── Left side ── */}
          <div className="max_box left-side-box">
            <div className="first_box">
              <h2><FaBullseye className="box_icon" /> Daily Data Challenge</h2>
              <p>Sharpen your data skills in 5 minutes.</p>
              <HStack className="instruction" spacing={3} fontSize="sm">
                <div className="instruction-item">
                  <FaClock className="box_icon" /><span>{challenge.duration} mins</span>
                </div>
                <div className="instruction-item">
                  <FaListCheck className="box_icon" /><span>{challenge.questions} questions</span>
                </div>
                <div className="instruction-item">
                  <FaTrophy className="box_icon" /><span>{challenge.pts} XP</span>
                </div>
              </HStack>
              <div onClick={() => navigate("/challenge")} className="max-box-btn">
                Start Challenge
              </div>
              <p className="footer_note">Only 23% of users completed yesterday's challenge.</p>
            </div>

            <div className="second_box">
              <h2><FaLaptopFile className="box_icon" /> Continue Learning</h2>
              <p>Test your skill level.</p>
              <div onClick={() => navigate("/quiz/topics")} className="max-box-btn">
                Resume Session
              </div>
            </div>

            <div className="third_box">
              <h2><FaChartColumn className="box_icon" /> Your Data Journey</h2>
              <div className="third-inner">
                <div>
                  <p>Sessions Taken: <span>{String(stats.total).padStart(2, "0")}</span></p>
                  <p>Best Skill: <span style={{ textTransform: "capitalize", color: "green" }}>{bestSkill?.topic ?? "N/A"}</span></p>
                </div>
                <div>
                  <p>Average Score: <span>{stats.avgScore}%</span></p>
                  <p>Weak Skill: <span style={{ textTransform: "capitalize", color: "red" }}>{worstSkill?.topic ?? "N/A"}</span></p>
                </div>
              </div>
            </div>

            {/* ── Badges ── */}
            <div style={{
              background: "#fff", borderRadius: "16px",
              border: "1px solid rgba(59,110,240,0.10)",
              padding: "18px 20px", marginTop: "0",
            }}>
              <h2 style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", fontSize: "0.95rem", fontWeight: 700 }}>
                <FaShield style={{ color: "#3b6ef0" }} /> Badges Earned
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {badges.map((b) => (
                  <div key={b.id} title={b.desc} style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "6px 12px", borderRadius: "99px",
                    background: b.earned ? "rgba(59,110,240,0.08)" : "rgba(0,0,0,0.04)",
                    border: `1px solid ${b.earned ? "rgba(59,110,240,0.2)" : "rgba(0,0,0,0.08)"}`,
                    opacity: b.earned ? 1 : 0.45,
                    cursor: "default",
                    filter: b.earned ? "none" : "grayscale(1)",
                  }}>
                    <span style={{ fontSize: "14px" }}>{b.earned ? b.icon : "🔒"}</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: b.earned ? "#3b6ef0" : "#9ca3af" }}>
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right side ── */}
          <div className="max_box right-side-box">

            {/* Leaderboard */}
            <div className="leaderboard-header">
              <span><FaTrophy className="box_icon" /></span>
              <span>Top Dataerians</span>
            </div>

            <div className="leaderboard-list">
              {board.length === 0 ? (
                [1,2,3,4,5].map((n) => (
                  <div key={n} className="leaderboard-item" style={{ opacity: 0.4 }}>
                    <span className="leaderboard-rank">{n}</span>
                    <span className="leaderboard-name">—</span>
                    <span className="leaderboard-points">— XP</span>
                  </div>
                ))
              ) : (
                board.map((u, i) => {
                  const rank = i + 1;
                  const you  = isYou(u);
                  const rs   = RANK_STYLES[rank] ?? {};
                  const rankClass = rank === 1 ? "gold" : rank === 2 ? "silver" : rank === 3 ? "bronze" : "";
                  return (
                    <div key={u._id} className="leaderboard-item"
                      style={{ background: you ? "rgba(59,110,240,0.06)" : "transparent", borderRadius: "10px" }}>
                      <span className={`leaderboard-rank ${rankClass}`} style={rs}>
                        {MEDALS[rank] ?? rank}
                      </span>
                      <span className="leaderboard-name">
                        {u.username}
                        {you && <span style={{ marginLeft: "5px", fontSize: "0.7rem", color: "#3b6ef0", fontWeight: 600 }}>(you)</span>}
                      </span>
                      <span className="leaderboard-points">
                        {u.totalCorrect} <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>XP</span>
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <p className="leaderboard-footer" onClick={() => navigate("/board")} style={{ cursor: "pointer" }}>
              View Full Leaderboard →
            </p>

            {/* Achievements */}
            <div style={{
              marginTop: "16px", background: "#fff",
              borderRadius: "14px", border: "1px solid rgba(59,110,240,0.10)",
              padding: "16px",
            }}>
              <h3 style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                🏆 Achievements Unlocked
              </h3>
              {badges.filter(b => b.earned).length === 0 ? (
                <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Play quizzes to unlock achievements!</p>
              ) : (
                badges.filter(b => b.earned).slice(0, 4).map((b) => (
                  <div key={b.id} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "8px 0",
                    borderBottom: "1px solid rgba(59,110,240,0.07)",
                  }}>
                    <span style={{ fontSize: "18px" }}>{b.icon}</span>
                    <div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#111827" }}>{b.label}</div>
                      <div style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{b.desc}</div>
                    </div>
                    <span style={{
                      marginLeft: "auto", fontSize: "0.68rem", fontWeight: 700,
                      padding: "2px 8px", borderRadius: "99px",
                      background: "rgba(14,168,116,0.10)", color: "#0ea874",
                    }}>Earned</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Box>

      {/* ────────────────── Settings Modal ────────────────── */}
      <Modal isOpen={isSettingsOpen} onClose={closeSettings} size="lg" scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(6px)" />
        <ModalContent borderRadius="20px" mx="1rem">
          <ModalHeader fontFamily="'Sora',sans-serif" fontWeight={800} fontSize="1.1rem" pt="1.5rem">
            Settings
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb="1.5rem">

            {/* Tab switcher */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
              {[
                { key: "profile",  label: "Edit Profile",   icon: <FaPen size={11} /> },
                { key: "notif",    label: "Notifications",  icon: <FaBell size={11} /> },
                { key: "privacy",  label: "Privacy",        icon: <FaLock size={11} /> },
                { key: "danger",   label: "Account",        icon: <FaTrash size={11} /> },
              ].map((t) => (
                <button key={t.key} onClick={() => setSettingsTab(t.key)}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "7px 14px", borderRadius: "99px",
                    border: `1px solid ${settingsTab === t.key ? "#3b6ef0" : "rgba(59,110,240,0.15)"}`,
                    background: settingsTab === t.key ? "#3b6ef0" : "transparent",
                    color: settingsTab === t.key ? "white" : "#4b5563",
                    fontWeight: 600, fontSize: "0.8rem", cursor: "pointer",
                  }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* ── Profile tab ── */}
            {settingsTab === "profile" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>
                    Full name
                  </label>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your name" borderRadius="12px" fontSize="0.9rem"
                    border="1px solid rgba(59,110,240,0.2)"
                    _focus={{ borderColor: "#3b6ef0", boxShadow: "0 0 0 3px rgba(59,110,240,0.12)" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>
                    Email address
                  </label>
                  <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)}
                    type="email" placeholder="your@email.com" borderRadius="12px" fontSize="0.9rem"
                    border="1px solid rgba(59,110,240,0.2)"
                    _focus={{ borderColor: "#3b6ef0", boxShadow: "0 0 0 3px rgba(59,110,240,0.12)" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>
                    Member since
                  </label>
                  <Input value={scores[scores.length - 1]?.createdAt
                    ? new Date(scores[scores.length - 1].createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
                    : "—"}
                    isReadOnly borderRadius="12px" fontSize="0.9rem" bg="rgba(0,0,0,0.03)"
                    border="1px solid rgba(59,110,240,0.1)" />
                </div>
                <button
                  onClick={() => {
                    toast({ title: "Profile updated", status: "success", duration: 2000 });
                    closeSettings();
                  }}
                  style={{
                    padding: "12px", borderRadius: "12px", border: "none",
                    background: "linear-gradient(135deg, #2251cc, #3b6ef0)",
                    color: "white", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
                  }}>
                  Save changes
                </button>
              </div>
            )}

            {/* ── Notifications tab ── */}
            {settingsTab === "notif" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  { label: "Quiz reminders",       sub: "Daily nudges to keep your streak",        val: notifQuiz,   set: setNotifQuiz   },
                  { label: "Leaderboard updates",  sub: "When your rank changes",                   val: notifLeader, set: setNotifLeader },
                ].map((item) => (
                  <div key={item.label} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px", borderRadius: "12px",
                    border: "1px solid rgba(59,110,240,0.10)", background: "rgba(59,110,240,0.03)",
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#111827" }}>{item.label}</div>
                      <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{item.sub}</div>
                    </div>
                    <Switch isChecked={item.val} onChange={() => item.set(!item.val)}
                      colorScheme="blue" size="md" />
                  </div>
                ))}
              </div>
            )}

            {/* ── Privacy tab ── */}
            {settingsTab === "privacy" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 16px", borderRadius: "12px",
                  border: "1px solid rgba(59,110,240,0.10)", background: "rgba(59,110,240,0.03)",
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#111827" }}>Public profile</div>
                    <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>Show your name on the leaderboard</div>
                  </div>
                  <Switch isChecked={profilePublic} onChange={() => setProfilePublic(!profilePublic)}
                    colorScheme="blue" size="md" />
                </div>
                <div style={{
                  padding: "12px 16px", borderRadius: "12px",
                  border: "1px solid rgba(59,110,240,0.10)", background: "rgba(59,110,240,0.03)",
                  fontSize: "0.82rem", color: "#4b5563", lineHeight: 1.6,
                }}>
                  Your data is never sold to third parties. Scores are stored securely and used only to power your leaderboard and profile stats.
                </div>
              </div>
            )}

            {/* ── Account / Danger tab ── */}
            {settingsTab === "danger" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{
                  padding: "14px 16px", borderRadius: "12px",
                  border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.04)",
                }}>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#dc2626", marginBottom: "4px" }}>
                    Delete account
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#9ca3af", marginBottom: "12px" }}>
                    This permanently deletes your account, scores, and all data. This cannot be undone.
                  </div>
                  <button
                    onClick={() => { closeSettings(); openDelete(); }}
                    style={{
                      padding: "9px 18px", borderRadius: "10px",
                      border: "1px solid rgba(239,68,68,0.4)",
                      background: "transparent", color: "#dc2626",
                      fontWeight: 700, fontSize: "0.82rem", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "6px",
                    }}>
                    <FaTrash size={12} /> Delete my account
                  </button>
                </div>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* ────────────────── Delete Confirm Modal ────────────────── */}
      <Modal isOpen={isDeleteOpen} onClose={closeDelete} size="sm" isCentered>
        <ModalOverlay backdropFilter="blur(6px)" />
        <ModalContent borderRadius="20px" mx="1rem">
          <ModalHeader fontFamily="'Sora',sans-serif" fontWeight={800} color="#dc2626" fontSize="1rem">
            Delete account?
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="0.5rem" fontSize="0.88rem" color="#4b5563" lineHeight={1.6}>
            All your scores, badges, and progress will be permanently deleted. This action cannot be undone.
          </ModalBody>
          <ModalFooter gap="8px">
            <button onClick={closeDelete}
              style={{ padding: "9px 18px", borderRadius: "10px", border: "1px solid rgba(59,110,240,0.2)", background: "transparent", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
              Cancel
            </button>
            <button
              onClick={() => {
                toast({ title: "Account deleted", status: "error", duration: 3000 });
                closeDelete();
              }}
              style={{ padding: "9px 18px", borderRadius: "10px", border: "none", background: "#dc2626", color: "white", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
              Yes, delete
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <BottomNav />
    </Box>
  );
};

export default ProfilePage;