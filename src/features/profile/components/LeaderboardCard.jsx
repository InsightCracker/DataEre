import { FaTrophy } from "react-icons/fa";
import { RANK_STYLES, MEDALS } from "../Levelconfig";

export const LeaderboardCard = ({ board, isYou, navigate }) => {
  return (
    <div style={{
      background: "#fff", borderRadius: "16px",
      border: "1px solid rgba(59,110,240,0.10)", padding: "18px 20px",
    }}>
      <div className="leaderboard-header">
        <span><FaTrophy className="box_icon" /></span>
        <span>Top DataErians</span>
      </div>
      <div className="leaderboard-list">
        {board.length === 0
          ? [1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="leaderboard-item" style={{ opacity: 0.4 }}>
                <span className="leaderboard-rank">{n}</span>
                <span className="leaderboard-name">—</span>
                <span className="leaderboard-points">— XP</span>
              </div>
            ))
          : board.map((u, i) => {
              const rank = i + 1;
              const you = isYou(u);
              const rs = RANK_STYLES[rank] ?? {};
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
                    {u.totalCorrect}<span style={{ fontSize: "0.7rem", color: "#9ca3af", marginLeft: "2px" }}>XP</span>
                  </span>
                </div>
              );
            })}
      </div>
      <p className="leaderboard-footer" onClick={() => navigate("/board")} style={{ cursor: "pointer" }}>
        View Full Leaderboard
      </p>
    </div>
  );
};


export const AchievementsPanel = ({ badges }) => {
  const earned = badges.filter((b) => b.earned);

  return (
    <div style={{
      marginTop: "16px", background: "#ebf1fd", borderRadius: "14px",
      border: "1px solid rgba(145, 176, 255, 0.1)", padding: "16px",
    }}>
      <h3 style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
        🏆 Achievements Unlocked
      </h3>
      {earned.length === 0 ? (
        <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Start a session to unlock achievements!</p>
      ) : (
        earned.slice(0, 7).map((b) => (
          <div key={b.id} style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "8px 0", borderBottom: "1px solid rgba(59,110,240,0.07)",
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
  );
};