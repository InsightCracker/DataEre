import QuizTimer from "./QuizTimer";
import { QuizContext } from "./Contexts";
import { TimerContext } from "./TimerProvider";

import { 
  Box
} from "@chakra-ui/react";
import { useContext, useEffect } from "react";


const Navbar = () => {
  const { 
    currQuestion, 
    questions
  } = useContext(QuizContext);

  const {timeLeft, setTimeLeft} = useContext(TimerContext);

  const totalTime = 300;
  

  const progress = (timeLeft / totalTime) * 100;

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [timeLeft]);

  return (
    <Box sx={{
      display: 'flex',
      bgColor: 'rgba(10, 14, 39, 0.95)',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 2rem',
      boxShadow: '0px 1px 2px rgba'
    }}>
      {/* Progress Bar Container */}
        <div className="progressbar-container">
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: progress > 30 ? "rgba(10, 14, 39, 0.70)" : "red",
              borderRadius: "10px",
              transition: "width 1s linear",
            }}
          />
        </div>

        <div style={{
          fontSize: ".8rem",
          display: "flex",
          gap: "5px"
        }}>
          <p>Question</p>
          <p>{ currQuestion + 1 } of { questions.length }</p>
        </div>
      {/* {
        location.pathname === '/multiplayer' &&
        <Box>
          {currQuestion !== questions.length - 1 && (
            <Text onClick={skipMultiQuestion} sx={{
              fontSize: '15px',
              cursor: 'pointer'
            }}>quit</Text>
          )}
        </Box>
      } */}

      {/* {
        location.pathname !== '/multiplayer' &&
        <Box>
          {currQuestion !== questions.length - 1 && (
            <Text onClick={skipPlayQuestion} sx={{
              fontSize: '15px',
              cursor: 'pointer'
            }}>quit</Text>
          )}
        </Box>
      } */}

      <QuizTimer />
    </Box>
  )
}

export default Navbar