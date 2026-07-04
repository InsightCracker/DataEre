import { useNavigate, useLocation } from "react-router-dom";
import { FaHouse, FaBookOpen, FaTrophy, FaChartColumn, FaRightFromBracket } from "react-icons/fa6";
import { useAuth } from "../contexts/AuthContext";
import "./style/bottomnav.css";

const navLinks = [
  { label: "Home", icon: FaHouse, path: "/users/profile" },
  { label: "Learn", icon: FaBookOpen, path: "/quiz/topics" },
  { label: "Hall of Fame", icon: FaTrophy, path: "/board" },
  { label: "Insight Studio", icon: FaChartColumn, path: "/coming-soon" },
];

const BottomNav = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/users/login");
  };

  return (
    <nav className="bottom-nav">
      {navLinks.map((link, index) => {
        const Icon     = link.icon;
        const isActive = location.pathname === link.path;
        return (
          <button
            key={index}
            className={`bottom-nav-item${isActive ? " active" : ""}`}
            onClick={() => navigate(link.path)}
          >
            <span className="bottom-nav-icon-wrap">
              <Icon size={18} />
            </span>
            <span className="bottom-nav-label">{link.label}</span>
            {isActive && <span className="bottom-nav-dot" />}
          </button>
        );
      })}

      <button className="bottom-nav-item bottom-nav-logout" onClick={handleLogout}>
        <span className="bottom-nav-icon-wrap">
          <FaRightFromBracket size={18} />
        </span>
        <span className="bottom-nav-label">Logout</span>
      </button>
    </nav>
  );
};

export default BottomNav;