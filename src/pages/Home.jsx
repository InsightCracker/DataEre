import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { QuizContext } from "../Helpers/Contexts";
import { categoriesList } from "../util/categories";

import { 
  Box,
  Input, 
  InputGroup,
  InputLeftElement
} from "@chakra-ui/react";

import { LuSearchCheck } from "react-icons/lu";

import SideBar from "../util/SideBar";


const Home = () => {

  const {
    setCategories,
    setDifficulty
  } = useContext(QuizContext);

  const location = useLocation();



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
            <Input placeholder="Search..." />
          </InputGroup>
        </div>

        <div className="level-btns">
          <button 
              onClick={() => setDifficulty("Beginner")}
              className="level-btn"
            >
              Beginner
            </button>

            <button 
              onClick={() => setDifficulty("Intermediate")}
              className="level-btn"
            >
              Intermediate
            </button>

            <button 
              onClick={() => setDifficulty("Advanced")}
              className="level-btn"
            >
              Advanced
            </button>

            <button 
              onClick={() => setDifficulty("Legendary")}
              className="level-btn"
            >
              Legendary
            </button>
        </div>

        <Box className="about-grid home-card-con">
          {categoriesList.map((cat) => (
            <div className="card visible" key={cat.name}>
              <div className="content">
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>

                <div className="btns-box">
                  <Link
                    to="/dashboard"
                    onClick={() => setCategories(cat.name)}
                    className="btn card-btn"
                  >
                    Quick Play
                  </Link>

                  <Link
                    to="/vsbot"
                    onClick={() => setCategories(cat.name)}
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