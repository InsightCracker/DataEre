import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { QuizContext } from "../Helpers/Contexts";
import { categoriesList } from "../util/categories";

import { 
  Box,
  Input, 
  InputGroup,
  InputLeftElement,
  Heading
} from "@chakra-ui/react";

import { LuSearchCheck } from "react-icons/lu";

import SideBar from "../util/SideBar";


const Home = () => {

  const {
    setCategories,
    setDifficulty
  } = useContext(QuizContext);

  const [searchTerm, setSearchTerm] = useState("");

  // Filter categories based on search input
  const filteredCategories = categoriesList.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const botMode = () => {
    // if (window.gtag) {
    //   window.gtag('event', 'bot_mode', {
    //     event_category: 'engagement',
    //     event_label: 'Bot Mode Button',
    //     value: 1
    //   });
    // }

    setCategories(cat.name)
  }; 



  return (
  <Box className="" >
    <div className="sidebar-container">
      <SideBar />
    </div>

    <div className="about-text home-container">
      <div className="top-bar">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <LuSearchCheck />
          </InputLeftElement>
          <Input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search categories"
            placeholder="Search..." 
          />
        </InputGroup>
      </div>

      <Box className="level-box">
        <Heading size="mr">Choose Difficulty:</Heading>
        <div className="level-btns">
          {["Beginner", "Intermediate", "Advanced"].map((level) => (
            <button className="level-btn"
              onClick={() => setDifficulty(level)}
            >
              {level}
            </button>
            ))}
        </div>
      </Box>

      <Box className="about-grid home-card-con">
        {filteredCategories.map((cat) => (
          <div className="card visible" key={cat.name}>
            <div className="content">
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>

              <div className="btns-box">
                <Link
                  to="/solo"
                  onClick={() => quickPlay(cat)}
                  className="btn card-btn"
                >
                  Quick Play
                </Link>

                <Link
                  to="/vsbot"
                  onClick={() =>  botMode(cat)}
                  className="btn card-btn"
                >
                  Bot Mode
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Box>
    </div>
  </Box>
  )
}

export default Home