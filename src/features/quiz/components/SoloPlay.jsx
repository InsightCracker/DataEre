import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { QuizContext } from "../../../util/Contexts";

import { 
  Box,
  Text
} from "@chakra-ui/react";

import { 
  ArrowRightIcon,
  ArrowLeftIcon
} from "@chakra-ui/icons"; 

import { FaRegCheckCircle } from "react-icons/fa";


const SoloPlay = () => {
  const navigate = useNavigate();

  const {
    score, 
    setScore, 
    currQuestion, 
    setCurrQuestion,
    questions,
    wrongAnswer,
    setWrongAnswer
  } = useContext(QuizContext);
  
  const [optionChosen, setOptionChosen] = useState("");
  const [optionChosenBG, setOptionChosenBG] = useState("");
  const [pointsHistory, setpointsHistory] = useState([]);

  const nextQuestion = () => {
    if(optionChosen === 'true'){
      setScore(score + 1);
      setpointsHistory([...pointsHistory, 2]);
      setOptionChosen('');
      setOptionChosenBG('A');
    }
    else {
      setpointsHistory([...pointsHistory, 0]);
      setWrongAnswer(wrongAnswer + 1);
    }

    setOptionChosenBG('');
    setCurrQuestion(currQuestion + 1);
  }

  const prevQuestion = () => {
    setOptionChosen('');
    setOptionChosenBG('');
    setCurrQuestion(currQuestion - 1);
    const prev = (pointsHistory.length > 0) ? pointsHistory[pointsHistory.length-1] : 0;
    setpointsHistory(pointsHistory.slice(0, pointsHistory.length - 1));
    if (prev === 2) setScore(score - 1);
  }

  const finishQuiz = () => {
    if(optionChosen === 'true'){
      setScore(score + 1);
    } else {
      setWrongAnswer(wrongAnswer + 1);
    }

    setOptionChosenBG('');
    setCurrQuestion(0);
    navigate(`/results?mode=solo`);
  }

  const flexStyle = {
    width: "100%",
    margin: "5px 10px",
    display: 'flex',
    alignItems: 'center',
    padding: '5px .5rem 5px 5px',
    borderRadius: '5px',
    cursor: 'pointer',
  }

  const optionStyle = {
    bgColor: '#d3d3d3',
    color: 'rgba(10, 14, 39, 0.95)',
    padding: '5px 12px',
    borderRadius: '100%',
    fontWeight: 'bold',
    marginRight: '15px'
  }

  return (
    <Box className="quiz-container">
      <Box className="question-board">
        <h1>{questions[currQuestion].question}</h1>
      </Box>

      <Box className="option-btn-box" sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <Box className="option-btn" onClick={() => {
          setOptionChosenBG('A');
          setOptionChosen(questions[currQuestion].correct_answers.answer_a_correct);
        }} sx={flexStyle} 
          bgColor={optionChosenBG === 'A' ? 'rgba(10, 14, 39, 0.95)' : '#fff'}
          color={optionChosenBG === 'A' ? '#fff' : 'blue.800'}
        >
          <Text sx={optionStyle} >A</Text>
          <Text 
            textTransform={'capitalize'} 
            color={optionChosenBG === 'A' ? '#fff' : 'rgba(10, 14, 39, 0.95)'}
          >{questions[currQuestion].answers.answer_a}</Text>
        </Box>

        <Box className="option-btn" onClick={() => {
          setOptionChosenBG('B');
          setOptionChosen(questions[currQuestion].correct_answers.answer_b_correct);
        }} sx={flexStyle} 
          bgColor={optionChosenBG === 'B' ? 'rgba(10, 14, 39, 0.95)' : '#fff'}
          color={optionChosenBG === 'B' ? '#fff' : 'blue.800'}
        >
          <Text sx={optionStyle}>B</Text>
          <Text 
            textTransform={'capitalize'}
            color={optionChosenBG === 'B' ? '#fff' : 'rgba(10, 14, 39, 0.95)'}
          >{questions[currQuestion].answers.answer_b}</Text>
        </Box>

        <Box className="option-btn" onClick={() => {
          setOptionChosenBG('C');
          setOptionChosen(questions[currQuestion].correct_answers.answer_c_correct);
        }} sx={flexStyle} 
          bgColor={optionChosenBG === 'C' ? 'rgba(10, 14, 39, 0.95)' : '#fff'}
          color={optionChosenBG === 'C' ? '#fff' : 'blue.800'}
        >
          <Text sx={optionStyle}>C</Text>
          <Text 
            textTransform={'capitalize'}
            color={optionChosenBG === 'C' ? '#fff' : 'rgba(10, 14, 39, 0.95)'}
          >{questions[currQuestion].answers.answer_c}</Text>
        </Box>

        <Box className="option-btn" onClick={() => {
          setOptionChosenBG('D');
          setOptionChosen(questions[currQuestion].correct_answers.answer_d_correct);
        }} sx={flexStyle} 
          bgColor={optionChosenBG === 'D' ? 'rgba(10, 14, 39, 0.95)' : '#fff'}
          color={optionChosenBG === 'D' ? '#fff' : 'red'}
        >
          <Text sx={optionStyle}>D</Text>
          <Text 
            textTransform={'capitalize'}
            color={optionChosenBG === 'D' ? '#fff' : 'rgba(10, 14, 39, 0.95)'}
          >{questions[currQuestion].answers.answer_d}</Text>
        </Box>

        {/* Other Buttons */}
        <Box className="other-btns">
          {
            currQuestion !== 0 ? (
              <Box onClick={prevQuestion} className="other-btns-btn prev">
                <Text color={'rgba(10, 14, 39, 0.95)'}><ArrowLeftIcon /></Text>
                <Text color={'rgba(10, 14, 39, 0.95)'}>Prev</Text>
              </Box>
            ) : (
              <Box  onClick={() => {}}
                  opacity={'0.5'}  
                  className="other-btns-btn prev">
                <Text color={'rgba(10, 14, 39, 0.95)'}><ArrowLeftIcon /></Text>
                <Text color={'rgba(10, 14, 39, 0.95)'}>Prev</Text>
              </Box>
            )
          }

          {
            currQuestion === questions.length - 1 ? (<Box 
              onClick={() => {}}
              opacity={'0.5'} 
              className="other-btns-btn skip"
            >
                <Text color={'#fff'}>Skip</Text>
              </Box>) : (
              <Box onClick={nextQuestion} className="other-btns-btn skip">
                <Text color={'#fff'}>Skip</Text>
              </Box>
            )
          }

          {currQuestion === questions.length - 1 ? (
          <Box onClick={finishQuiz} className="other-btns-btn finish">
            <Text color={'#fff'}>Finish</Text>
            <Text color={'#fff'}><FaRegCheckCircle /></Text>
          </Box>
        ) : (
          <Box onClick={nextQuestion} className="other-btns-btn next">
            <Text color={'#fff'}>Next</Text>
            <Text color={'#fff'}><ArrowRightIcon /></Text>
          </Box>
        )}
        </Box>
      </Box>
    </Box>
  )
}

export default SoloPlay