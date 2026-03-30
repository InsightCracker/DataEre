import "../styles/quiz.css";
import { useContext } from "react";
import { QuizContext } from "../../../util/Contexts";

import { 
  Box,
  Heading
} from "@chakra-ui/react";

import { 
  FaBullseye
} from "react-icons/fa6";

import SideBar from "../../../util/SideBar";
import Searchbar from "../components/Searchbar";
import Cards from "../components/Cards";


const Home = () => {

  const {
    difficulty,
    setCategories,
    setDifficulty
  } = useContext(QuizContext);

  const quickPlay = (cat) => {
    if (window.gtag) {
      window.gtag('event', 'quick_play', {
        event_category: 'engagement',
        event_label: 'Quick Play Button',
        value: 1
      });
    }

    setCategories(cat.name)
  }; 

  const botMode = (cat) => {
    if (window.gtag) {
      window.gtag('event', 'bot_mode', {
        event_category: 'engagement',
        event_label: 'Bot Mode Button',
        value: 1
      });
    }

    setCategories(cat.name)
  }; 



  return (
  <Box className="quiz-home-page">
    <div className="sidebar-container">
      <SideBar />
    </div>

    <div className="about-text home-container">
      <Searchbar />

      <div className="special_cards">
        <div className="first_box special_box challenge_box">
          <h2>
            <FaBullseye className="box_icon" /> 
            Daily Challenge
          </h2>

          <p>Answer today's question!</p>

          <p><span>Reward:</span> +20 points</p>

          <div className="max-box-btn">
            Start Challenge
          </div>
        </div>

        <Box className="level-box first_box special_box">
          <h2>Choose Difficulty:</h2>
          <div className="level-btns">
            {["Beginner", "Intermediate", "Advanced"].map((level) => (
              <button 
                key={level}
                className={`level-btn ${difficulty === level ? "active" : ""}`}
                onClick={() => setDifficulty(level)}
              >
                {level}
              </button>
            ))}
          </div>

          <p>Default level is set to Beginner. Please select your preferred level to continue.</p>
        </Box>
      </div>

      <Box>
        <Cards />
      </Box>
    </div>
  </Box>
  )
}

export default Home