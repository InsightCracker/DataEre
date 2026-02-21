import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { QuizContext } from "../Helpers/Contexts";
import { 
  Box
} from "@chakra-ui/react";
import { 
  FaShareNodes,
  FaHouse,
  FaTrophy,
  FaRobot,
  FaUserAstronaut,
  FaHandshake,
  FaSpinner 
} from "react-icons/fa6";


import QuizShareCard from "../util/QuizShareCard";


const MultiEnd = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false)

  const {
    score,
    setScore,  
    botScore,
    setBotScore, 
    refresh,
    setRefresh,
    setWrongAnswer,
    questions,
    setCurrQuestion
} = useContext(QuizContext);

const total = questions.length;

const percentage =
  total > 0
    ? Math.round((score / total) * 100)
    : 0;


  const retryQuiz = () => {
    setScore(0);
    setBotScore(0);
    setWrongAnswer(0);
    setCurrQuestion(0);
    setRefresh(!refresh);
    navigate('/vsbot')
  }

  const tryAnotherQuiz = () => {
    setScore(0);
    setBotScore(0);
    setWrongAnswer(0);
    setCurrQuestion(0);
    setRefresh(!refresh);
    navigate('/quiz')
  }
  
  return (
    <Box className="result-screen">
      <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDir: 'column'
        }}>
          {/* Navbar */}
          <div className="resultpage-navbar">
            <p>🎉 Quiz Completed!</p>
          </div>

          {botScore > score ? (
            <div className="badge-board">
              <div className="winner-badge-icon"><FaRobot /></div>
              <p className="winner-badge">Bot Won!</p>
            </div>
          ) : botScore < score ? (
            <div className="badge-board">
              <div className="winner-badge-icon"><FaUserAstronaut /></div>
              <p className="winner-badge">You Won!</p>
            </div>
          ) : (
            <div className="badge-board">
              <div className="winner-badge-icon"><FaHandshake /></div>
              <p className="winner-badge">It's a Tie!</p>
            </div>
          )}
          
          
          
          <div className="question-missed">
            <div className="miss-card checked">
              <h3><FaUserAstronaut /></h3>
              <p sx={{
                m: '5px 0'
              }}><span className="wrong-ans"> Your Score: </span> {score}</p>
            </div>

            <div className="miss-card missed">
              <h3><FaRobot /></h3>
              <p sx={{
                m: '5px 0'
              }}><span className="wrong-ans"> Bot Score: </span> {botScore}</p>
            </div>
          </div>

          <Box 
            className="quiz-btn" 
            onClick={retryQuiz}
          >
            <div>
              <p><FaSpinner /></p>
            </div>
            <p>Retry Quiz</p>
          </Box>

          <Box 
            className="quiz-btn" 
            onClick={() => navigate('/tune')}
          >
            <div>
              <p><FaTrophy /></p>
            </div>
            <div>
              <p>View Leaderboard</p>
            </div>
          </Box>

          <Box 
            onClick={() => setShow(true)}
            className="quiz-btn"
          >
            <div>
              <p><FaShareNodes /></p>
            </div>
            <div>
              <p>Share Score</p>
            </div>
          </Box>

          <Box 
            className="quiz-btn" 
            onClick={tryAnotherQuiz}
          >
            <div>
              <p><FaHouse /></p>
            </div>
            <div>
              <p>Back to Dashboard</p>
            </div>
          </Box>

          <Box position="relative">
            {show && (
              <Box
                position="fixed"
                top="0"
                left="0"
                w="100vw"
                h="100vh"
                display="flex"
                justifyContent="center"
                alignItems="center"
                bg="rgba(255,255,255,0.2)" // semi transparent required
                backdropFilter="blur(10px)"
                sx={{
                  WebkitBackdropFilter: "blur(10px)",
                }}
                zIndex="1000"
              >
                <QuizShareCard 
                  score={score}
                  total={total}
                  percentage={percentage}
                />
              </Box>
            )}
            </Box>
        </Box>
    </Box>
  )
}

export default MultiEnd