import { FaShield } from "react-icons/fa6";

const BadgesPanel = ({ badges }) => {
  return (
    <div style={{
      background: "#fff", borderRadius: "16px",
      border: "1px solid rgba(59,110,240,0.10)", padding: "18px 20px",
    }}>
      <h2 style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", fontSize: "0.95rem", fontWeight: 700 }}>
        <FaShield style={{ color: "#3b6ef0" }} /> Badges Earned
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {badges.map((b) => (
          <div key={b.id} title={b.desc} style={{
            display: "flex", alignItems: "center", gap: "5px",
            padding: "5px 11px", borderRadius: "99px",
            background: b.earned ? "rgba(59,110,240,0.08)" : "rgba(0,0,0,0.04)",
            border: `1px solid ${b.earned ? "rgba(59,110,240,0.2)" : "rgba(0,0,0,0.08)"}`,
            opacity: b.earned ? 1 : 0.4,
            filter: b.earned ? "none" : "grayscale(1)",
          }}>
            <span style={{ fontSize: "13px" }}>{b.earned ? b.icon : "🔒"}</span>
            <span style={{ fontSize: "0.73rem", fontWeight: 600, color: b.earned ? "#3b6ef0" : "#9ca3af" }}>
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesPanel;