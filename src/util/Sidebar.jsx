import { Box } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {
  FaHouse,
  FaBookOpen,
  FaTrophy,
  FaChartColumn,
  FaRightFromBracket,
  FaGauge,
} from "react-icons/fa6";
import "../style/sidebar.css";

const navLinks = [
  { label: "Dashboard",     icon: FaGauge,      path: "/users/profile" },
  { label: "Learning Lab",  icon: FaBookOpen,   path: "/quiz/topics"   },
  { label: "Hall of Fame",  icon: FaTrophy,     path: "/board"         },
  { label: "Insight Studio",icon: FaChartColumn,path: "/coming-soon"   },
];

const Sidebar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { logout, firstName, lastName, email } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/users/login");
  };

  const avatarLetter = firstName
    ? firstName[0].toUpperCase()
    : email
    ? email[0].toUpperCase()
    : "U";

  const displayName = firstName
    ? `${firstName}${lastName ? " " + lastName : ""}`
    : "Welcome!";

  return (
    <Box className="sidebar">

      {/* ── Brand ── */}
      <div className="sidebar-brand">
        <span className="sidebar-brand-logo">D</span>
        <span className="sidebar-brand-name">DataEre</span>
      </div>

      {/* ── User card ── */}
      <div className="sidebar-profile">
        <div className="sidebar-avatar">{avatarLetter}</div>
        <div className="sidebar-user-info">
          <p className="sidebar-user-name">{displayName}</p>
          <p className="sidebar-user-email">{email}</p>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="sidebar-nav">
        <p className="sidebar-nav-label">Menu</p>
        <ul>
          {navLinks.map((link, index) => {
            const Icon     = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <li key={index}>
                <a
                  href={link.path}
                  onClick={(e) => { e.preventDefault(); navigate(link.path); }}
                  className={`nav-link${isActive ? " active" : ""}`}
                >
                  <span className="nav-link-icon-wrap">
                    <Icon size={15} />
                  </span>
                  <span className="nav-link-label">{link.label}</span>
                  {isActive && <span className="nav-link-pip" />}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Logout ── */}
      <div className="sidebar-logout">
        <button onClick={handleLogout} className="logout-btn">
          <span className="logout-icon-wrap">
            <FaRightFromBracket size={14} />
          </span>
          <span>Logout</span>
        </button>
      </div>

    </Box>
  );
};

export default Sidebar;