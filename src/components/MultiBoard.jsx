import { useContext } from "react";
import { QuizContext } from "../Helpers/Contexts";
import { 
    Box
} from "@chakra-ui/react";
import { 
    FaUserAstronaut,
    FaRobot } from "react-icons/fa";

const MultiBoard = () => {
    const { 
        botScore,
        score
    } = useContext(QuizContext);
     
  return (
    <Box className="battle-container">
        <div className="player-box you">
            <div className="identity-box ">
                <span><FaUserAstronaut color="rgba(10, 14, 39, 0.95)" /></span>
            </div>
            <div className="point-box user-point">
                <p><span>{score}</span> Points</p>
            </div>
        </div>

        <div className="vs">vs</div>

        <div className="player-box bot">
            <div className="identity-box">
                <span><FaRobot color="rgb(0, 92, 0)" /></span>
            </div>
            <div className="point-box ai-point">
                <p><span>{botScore}</span> Points</p>
            </div>
        </div>
    </Box>
  )
}

export default MultiBoard