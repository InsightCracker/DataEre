import '../src/css/style.css';
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider, Box } from '@chakra-ui/react'; 

import axios from "axios";
import Home from "./pages/Home"
import QuickPlay from "./pages/QuickPlay";
import Login from "./pages/Login";
import ResultPage from "./pages/ResultPage";
import VsBot from "./pages/VsBot";
import MultiEnd from "./pages/MultiEnd";
import Help from "./pages/Help";
import FirstPage from "./pages/FirstPage";
import Dashboard from './pages/Dashboard';
import QuizShareCard from './util/QuizShareCard';

import { QuizContext } from "./Helpers/Contexts";
import { TimerProvider } from './util/TimerProvider';

function App() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState('');
  const [score, setScore] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [currQuestion, setCurrQuestion] = useState(0);
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState('');
  const [refresh, setRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };


  const getRandomQuestions = (
    allQuestions,
    num = 20,
    category,
    difficulty
  ) => {
    const filtered = allQuestions.filter(
      (q) =>
        (!category || q.category === category) &&
        (!difficulty || q.difficulty === difficulty)
    );

    const shuffled = shuffleArray(filtered);

    return shuffled.slice(0, num);
  };


  const fetchQuestion = async () => {
    try {
      setIsLoading(true);

      const result = await axios("/questions.json");

      const randomQuestions = getRandomQuestions(
        result.data,
        20,
        categories,
        difficulty
      );

      setQuestions(randomQuestions);
      setCurrentQuestion(randomQuestions[0] || null);
      setIsLoading(false);

    } catch (error) {
      console.error("Error loading questions:", error);
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchQuestion(); // eslint-disable-next-line
  }, [categories, difficulty, refresh]);

  return (
    <Router>
      <ChakraProvider>
      <Box>
        <TimerProvider>
        <QuizContext.Provider value={{ 
          questions,
          setQuestions,
          currentQuestion,
          setCurrentQuestion,
          score, 
          setScore, 
          currQuestion, 
          setCurrQuestion,
          name,
          setName,
          botScore,
          setBotScore,
          categories,
          setCategories,
          difficulty,
          setDifficulty,
          refresh,
          setRefresh,
          isLoading,
          wrongAnswer,
          setWrongAnswer
        }}>
          <Routes>
            <Route path="/" element={<FirstPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/solo" element={<QuickPlay />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/multiend" element={<MultiEnd />} />
            <Route path="/vsbot" element={<VsBot />} />
            <Route path="/help" element={<Help />} />
            <Route path="/share" element={<QuizShareCard 
                score={score} 
                setScore={setScore}
                questions={questions} 
                categories={categories}
              />} 
            />
          </Routes>
        </QuizContext.Provider>
        </TimerProvider>
      </Box>
      </ChakraProvider>
    </Router>
  );
}

export default App;
