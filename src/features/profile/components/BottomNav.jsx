import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaQuestionCircle, FaTrophy, FaFilePdf, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../../util/AuthContext";
import "../styles/bottomnav.css";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/users/login");
  };

  const navLinks = [
    { label: "Home", icon: FaHome, path: "/users/profile" },
    { label: "Quizzes", icon: FaQuestionCircle, path: "/quiz/topics" },
    { label: "Board", icon: FaTrophy, path: "/board" },
    { label: "PDF", icon: FaFilePdf, path: "/converter" },
    { label: "Reports", icon: FaChartBar, path: "/reports" },
  ];

  return (
    <nav className="bottom-nav">
      {navLinks.map((link, index) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.path;
        return (
          <button
            key={index}
            className={`bottom-nav-item ${isActive ? "active" : ""}`}
            onClick={() => navigate(link.path)}
          >
            <Icon className="bottom-nav-icon" />
            <span>{link.label}</span>
          </button>
        );
      })}
      <button className="bottom-nav-item logout" onClick={handleLogout}>
        <FaSignOutAlt className="bottom-nav-icon" />
        <span>Logout</span>
      </button>
    </nav>
  );
};

export default BottomNav;