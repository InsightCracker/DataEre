import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { QuizContext } from "../../../util/Contexts";

import { 
  Box
} from "@chakra-ui/react";

import { 
  ArrowRightIcon
} from "@chakra-ui/icons"; 

import { FaRegCheckCircle } from "react-icons/fa";


const VsBotPlay = () => {
  const [userAnswer, setUserAnswer] = useState(null);
  const [botAnswer, setBotAnswer] = useState(null);

  const navigate = useNavigate();

  const {
    currQuestion, 
    setCurrQuestion, 
    setBotScore,
    questions,
    setScore,
    difficulty
  } = useContext(QuizContext);

  const currentQuestion = questions[currQuestion];

  // Convert answers object to array
  const answerKeys = Object.keys(currentQuestion?.answers || {});

  const answerValues = answerKeys.map(
    (key) => currentQuestion.answers[key]
  );

  // Find correct answer key safely
  const correctKey = Object.keys(currentQuestion?.correct_answers || {})
    .find(
      (key) => currentQuestion.correct_answers[key] === "true"
    )
    ?.replace("_correct", "");

  // Function to generate smart bot answer
  const getSmartBotAnswer = () => {
    const chance = Math.random(); // 0–1
    let difficultyChance = 0.7; // default 
    if (difficulty === "Beginner") difficultyChance = 0.5;
    if (difficulty === "Intermediate") difficultyChance = 0.7;
    if (difficulty === "Advanced") difficultyChance = 0.85;

    const correctOptionKey = correctKey.replace("_correct", "");

    if (chance < difficultyChance) return correctKey;

    // Otherwise pick a random wrong answer
    const wrongKeys = answerKeys.filter((k) => k !== correctOptionKey);
    return wrongKeys[Math.floor(Math.random() * wrongKeys.length)];
  };



  const handleUserSelect = (key) => {
    setUserAnswer(key); 
    
    // Store bot answer in state
    const botChoice = getSmartBotAnswer();
    setBotAnswer(botChoice);
  };

  // Next Question
  const nextQuestion = () => {
    if (userAnswer === correctKey) {
      setScore((prev) => prev + 1);
    } else {
    }

    if (botAnswer === correctKey) {
      setBotScore((prev) => prev + 1);
    }

    setCurrQuestion(currQuestion + 1);
    setUserAnswer("")
  }

  const finishQuiz = () => {
    if (userAnswer === correctKey) {
      setScore((prev) => prev + 1);
    } else {
    }

    if (botAnswer === correctKey) {
      setBotScore((prev) => prev + 1);
    }

    setCurrQuestion(0);
    navigate(`/results?mode=vsbot`);
  }
  
  const letters = ["A", "B", "C", "D"];

  return (
    <Box className="ai-container">
      <Box className="question-board">
        <h1>{questions[currQuestion].question}</h1>
      </Box>

      <Box sx={{
        width: '100%',
        padding: "0 10px",
      }}>
        {answerKeys.map((key, index) => (
          <button
            key={key}
            onClick={() => handleUserSelect(key)}
            className="ai-btn"
            style={{
              display: "block",
              width: "100%",
              margin: "10px 0",
              padding: "5px .5rem 5px 5px",
              backgroundColor:
                userAnswer === key
                  ? "rgba(10, 14, 39, 0.95)"
                  : "#fff",
              color: 
                userAnswer === key
                  ? "#fff"
                  : "rgba(10, 14, 39, 0.95)"
            }}
          >
            <div className="vsbot-answer-btn">
              <span className="ai-btn-label">{letters[index]}</span> 
              <span>{answerValues[index]}</span>
            </div>
          </button>))
        }      

        {currQuestion === questions.length - 1 ? (
          <Box onClick={finishQuiz} className="ai-btn-other">
            <p>Finish</p>
            <p className="ai-btn-other-label"><FaRegCheckCircle /></p>
          </Box>
        ) : (
          <Box onClick={nextQuestion} className="ai-btn-other">
            <p>Next</p>
            <p className="ai-btn-other-label"><ArrowRightIcon /></p>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default VsBotPlay;