import "../styles/profile.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../../util/Sidebar";
import BottomNav from "../../../util/BottomNav";

import { Box, useDisclosure } from "@chakra-ui/react";

import { useAuth } from "../../../util/AuthContext";
import { getMyScores, getLeaderboard, getMe } from "../../../util/api";

import { getLevel, LEVELS, computeBadges, fetchDailyChallenge } from "../Levelconfig";
import ProfileLoadingSkeleton from "../components/ProfileLoadingSkeleton";
import { ProfileHeader, LearningStatsPanel } from "../components/ProfileHeader";
import BadgesPanel from "../components/BadgesPanel";
import { LeaderboardCard, AchievementsPanel } from "../components/LeaderboardCard";
import SettingsModal from "../components/SettingsModal";
import DeleteAccountModal from "../components/DeleteAccountModal";

const ProfilePage = () => {
  const navigate = useNavigate();
  const {
    firstName, username, email, userId,
    streak, longestStreak, joinDate, isPublic,
    logout, updateUser,
  } = useAuth();

  const [challenge, setChallenge] = useState(null);
  const [stats, setStats] = useState({ totalCorrect: 0, total: 0, avgScore: 0, bestScore: 0 });
  const [scores, setScores] = useState([]);
  const [bestSkill, setBestSkill] = useState(null);
  const [worstSkill, setWorstSkill] = useState(null);
  const [board, setBoard] = useState([]);

  const { isOpen: isSettingsOpen, onOpen: openSettings, onClose: closeSettings } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: openDelete, onClose: closeDelete } = useDisclosure();

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

  // Fetch leaderboard top 3
  useEffect(() => {
    getLeaderboard().then((res) => {
      if (res.success) {
        const sorted = [...res.data].sort((a, b) => b.totalCorrect - a.totalCorrect);
        setBoard(sorted.slice(0, 3));
      }
    });
  }, []);

  // Fetch latest user data (streak, joinDate) from backend
  useEffect(() => {
    getMe().then((res) => {
      if (res.success) updateUser(res.user);
    });
  }, []);

  useEffect(() => { fetchDailyChallenge().then(setChallenge); }, []);

  // ── Derived values ──
  const xp = stats.totalCorrect;
  const level = getLevel(xp);
  const nextLevel = LEVELS[Math.min(level.index + 1, LEVELS.length - 1)];
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

  if (!challenge) {
    return <ProfileLoadingSkeleton firstName={firstName} level={level} />;
  }

  return (
    <Box className="profile_page">
      <Sidebar />

      <Box className="dashboard_container">
        <ProfileHeader
          firstName={firstName}
          level={level}
          nextLevel={nextLevel}
          xp={xp}
          xpProgress={xpProgress}
          myRank={myRank}
          joinDateFormatted={joinDateFormatted}
          streak={streak}
          stats={stats}
          onOpenSettings={openSettings}
          navigate={navigate}
        />

        <div className="low-box">
          <div className="max_box left-side-box">
            <LearningStatsPanel
              challenge={challenge}
              stats={stats}
              bestSkill={bestSkill}
              worstSkill={worstSkill}
              navigate={navigate}
            />
            <BadgesPanel badges={badges} />
          </div>

          <div className="max_box right-side-box">
            <LeaderboardCard board={board} isYou={isYou} navigate={navigate} />
            <AchievementsPanel badges={badges} />
          </div>
        </div>
      </Box>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={closeSettings}
        username={username}
        email={email}
        joinDateFormatted={joinDateFormatted}
        longestStreak={longestStreak}
        isPublic={isPublic}
        updateUser={updateUser}
        onOpenDelete={openDelete}
      />

      <DeleteAccountModal
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        logout={logout}
      />

      <BottomNav />
    </Box>
  );
};

export default ProfilePage;