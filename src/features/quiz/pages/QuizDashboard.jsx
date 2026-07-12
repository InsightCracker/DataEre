import "../styles/quiz.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Heading } from "@chakra-ui/react";
import { FaBullseye, FaTable } from "react-icons/fa6";

import { QuizContext } from "../../../shared/contexts/Contexts";
import Sidebar from "../../../shared/components/Sidebar";
import BottomNav from "../../../shared/components/BottomNav";
import Cards from "../components/Cards";


const QuizDashboard = () => {
  const {
    difficulty,
    setCategories,
    setDifficulty
  } = useContext(QuizContext);
  const navigate = useNavigate();

  const quickPlay = (cat) => {
    if (window.gtag) {
      window.gtag("event", "quick_play", {
        event_category: "engagement",
        event_label: "Quick Play Button",
        value: 1,
      });
    }

    setCategories(cat.name);
  };

  const botMode = (cat) => {
    if (window.gtag) {
      window.gtag("event", "bot_mode", {
        event_category: "engagement",
        event_label: "Bot Mode Button",
        value: 1,
      });
    }

    setCategories(cat.name);
  };

  const openDatasetChallenge = () => {
    if (window.gtag) {
      window.gtag("event", "dataset_challenge_entry", {
        event_category: "engagement",
        event_label: "Dataset Challenge Banner",
        value: 1,
      });
    }

    navigate("/upload-dataset");
  };

  return (
    <Box className="quiz-home-page">
      <Sidebar />

      <div className="dashboard_container">
        {/* Dataset Challenge Banner */}
        <div className="banner">
          <div className="banner-left">
            <div className="banner-title">
              <span className="icon">📊</span> Dataset Challenge
            </div>
            <div className="banner-sub">
              Upload your own dataset and get quiz questions generated from it — Excel & Power BI
            </div>
            <div className="reward-badge">✨ New</div>
            <button className="btn-start" onClick={openDatasetChallenge}>
              Try it out
            </button>
          </div>

          <div className="banner-right">
            <div className="diff-label">Choose Difficulty:</div>
            <div className="diff-buttons">
              {["Beginner", "Intermediate", "Advanced"].map((d) => (
                <button
                  key={d}
                  className={`diff-btn${difficulty === d ? " selected" : ""}`}
                  onClick={() => setDifficulty(d)}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="diff-hint">
              Default level is <strong>{difficulty}</strong>. Select a level to continue.
            </div>
          </div>
        </div>

        <Box>
          <Cards />
        </Box>
      </div>

      <Box>
        <BottomNav />
      </Box>
    </Box>
  );
};

export default QuizDashboard