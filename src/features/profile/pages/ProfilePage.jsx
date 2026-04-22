import "../styles/profile.css";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import { Box } from "@chakra-ui/react";

import { SiThunderstore } from "react-icons/si";
import { useAuth } from "../../../util/AuthContext";
import {
  FaAward,
  FaBullseye,
  FaGraduationCap,
  FaLaptopFile,
  FaChartColumn,
} from "react-icons/fa6";
import { FaTrophy } from "react-icons/fa";
import BottomNav from "../components/BottomNav";
const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <Box className="profile_page">
      <Sidebar />
      <Box className="dashboard_container">
        <div className="profile">
          <h1 className="welcome-heading">Welcome back, {user?.firstName}</h1>

          <div className="dash-list">
            <div className="rank-badge">
              <FaAward className="rank-icon" />
              <span>Advance Analyst</span>
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
                <h3>0 days</h3>
              </div>
            </div>

            <div className="dash-list-card">
              <Box className="icon" sx={{ color: "#304ecf" }}>
                <FaGraduationCap />
              </Box>
              <div className="list-text">
                <p>Total Points</p>
                <h3>0</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="low-box">
          <div className=" max_box left-side-box">
            <div className="first_box">
              <h2>
                <FaBullseye className="box_icon" />
                Daily Challenge
              </h2>

              <p>Answer today's question!</p>

              <p>
                <span>Reward:</span> +20 points
              </p>

                <div className="max-box-btn">
                  Start Challenge
                </div>
            </div>

            <div className="second_box">
              <h2>
                <FaLaptopFile className="box_icon" />
                Continue Learning
              </h2>

              <p>Test your skill level.</p>

              <div
                onClick={() => {
                  navigate("/quiz/topics");
                }}
                className="max-box-btn"
              >
                Resume Quiz
              </div>
            </div>

            <div className="third_box">
              <h2>
                <FaChartColumn className="box_icon" />
                Your Data Journey
              </h2>

              <div className="third-inner">
                <div>
                  <p>
                    Quizzes Taken: <span>18</span>
                  </p>
                  <p>
                    Best Skill: <span>Excel</span>
                  </p>
                </div>

                <div>
                  <p>
                    Average Score <span>82%</span>
                  </p>
                  <p>
                    Weak Skill: <span>SQL</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="max_box right-side-box">
            <div className="leaderboard-header">
              <span>
                <FaTrophy className="box_icon" />
              </span>
              <span>Top DataEre Analysts</span>
            </div>

            <div className="leaderboard-list">
              <div className="leaderboard-item">
                <span className="leaderboard-rank gold">1</span>
                <span className="leaderboard-name">—</span>
                <span className="leaderboard-points">— pts</span>
              </div>
              <div className="leaderboard-item">
                <span className="leaderboard-rank silver">2</span>
                <span className="leaderboard-name">—</span>
                <span className="leaderboard-points">— pts</span>
              </div>
              <div className="leaderboard-item">
                <span className="leaderboard-rank bronze">3</span>
                <span className="leaderboard-name">—</span>
                <span className="leaderboard-points">— pts</span>
              </div>
              <div className="leaderboard-item">
                <span className="leaderboard-rank">4</span>
                <span className="leaderboard-name">—</span>
                <span className="leaderboard-points">— pts</span>
              </div>
              <div className="leaderboard-item">
                <span className="leaderboard-rank">5</span>
                <span className="leaderboard-name">—</span>
                <span className="leaderboard-points">— pts</span>
              </div>
            </div>

            <p
              className="leaderboard-footer"
              onClick={() => navigate("/board")}
              style={{ cursor: "pointer" }}
            >
              View Full Leaderboard
            </p>
          </div>
        </div>
      </Box>
      <BottomNav />
    </Box>
  );
};

export default ProfilePage;
