import { Box, HStack } from "@chakra-ui/react";
import {
  FaAward, FaBullseye, FaLaptopFile, FaChartColumn, FaClock,
  FaListCheck, FaBoltLightning, FaFire, FaArrowTrendUp, FaArrowTrendDown, FaGear,
} from "react-icons/fa6";

export const ProfileHeader = ({
  firstName,
  level,
  nextLevel,
  xp,
  xpProgress,
  myRank,
  joinDateFormatted,
  streak,
  stats,
  onOpenSettings,
  navigate,
}) => {
  return (
    <div className="profile">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <h1 className="welcome-heading">Hi 👋, {firstName} </h1>
        <button onClick={onOpenSettings} style={{
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
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>
                {myRank > 0 ? `Rank #${myRank}` : "Unranked"}
              </div>
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
  );
};

export const LearningStatsPanel = ({ challenge, stats, bestSkill, worstSkill, navigate }) => {
  return (
    <>
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
        <div onClick={() => navigate("/coming-soon")} className="max-box-btn">Start Challenge</div>
      </div>

      <div className="third_box">
        <h2><FaChartColumn className="box_icon" /> Your Data Journey</h2>

        <div className="journey-grid">
          <div className="journey-card">
            <div className="journey-card-label">
              <span className="journey-icon-wrap journey-icon-blue"><FaListCheck size={12} /></span>
              Sessions
            </div>
            <div className="journey-card-value journey-blue">{String(stats.total).padStart(2, "0")}</div>
            <div className="journey-card-sub">sessions taken</div>
          </div>

          <div className="journey-card">
            <div className="journey-card-label">
              <span className="journey-icon-wrap journey-icon-blue"><FaChartColumn size={12} /></span>
              Avg Score
            </div>
            <div className="journey-card-value journey-blue">{stats.avgScore}%</div>
            <div className="journey-card-sub">across all topics</div>
          </div>

          <div className="journey-card">
            <div className="journey-card-label">
              <span className="journey-icon-wrap journey-icon-green"><FaArrowTrendUp size={12} /></span>
              Best Skill
            </div>
            <div className="journey-card-value journey-green">{bestSkill?.topic ?? "N/A"}</div>
            <div className="journey-card-sub">strongest topic</div>
          </div>

          <div className="journey-card">
            <div className="journey-card-label">
              <span className="journey-icon-wrap journey-icon-red"><FaArrowTrendDown size={12} /></span>
              Weak Skill
            </div>
            <div className="journey-card-value journey-red">{worstSkill?.topic ?? "N/A"}</div>
            <div className="journey-card-sub">needs more practice</div>
          </div>
        </div>
      </div>
    </>
  );
};