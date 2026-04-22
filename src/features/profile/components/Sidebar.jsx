import { Box } from "@chakra-ui/react";
import { useNavigate, useLocation} from "react-router-dom";
import { useAuth } from "../../../util/AuthContext";
import {
  FaHome,
  FaQuestionCircle,
  FaTrophy,
  FaFilePdf,
  FaChartBar, 
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles/sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
const location = useLocation();
  const handleLogout = () => {
    logout();
    navigate("/users/login");
  };

  const navLinks = [
    { label: "Dashboard", icon: FaHome, path: "/users/profile" },
    { label: "Quizzes", icon: FaQuestionCircle, path: "/quiz/topics" },
    { label: "Leaderboard", icon: FaTrophy, path: "/board" },
    { label: "PDF Converter", icon: FaFilePdf, path: "/converter" },
    { label: "Reports", icon: FaChartBar, path: "/reports" },
  ];

  return (
    <Box className="sidebar">
      {/* Logo Section */}
      {/* <div className="sidebar-logo">
        <h1>DataEre</h1>
      </div> */}
   {/* User Profile Section */}
<div className="sidebar-profile">
  <div className="sidebar-avatar">
    {user?.firstName ? user.firstName[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : "U"}
  </div>
  <div className="sidebar-user-info">
    <p className="sidebar-user-name">
      {user?.firstName ? `${user.firstName} ${user.lastName}` : "Welcome!"}
    </p>
    <p className="sidebar-user-email">{user?.email || ""}</p>
  </div>
</div>
      {/* Nav Links Section */}
      <nav className="sidebar-nav">
        <ul>
          {navLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <li key={index}>
                <a
                  href={link.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(link.path);
                  }}
                 className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
                >
                  <Icon className="nav-icon" />
                  <span>{link.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="sidebar-logout">
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </Box>
  );
};

export default Sidebar;
