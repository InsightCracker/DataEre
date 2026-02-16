import '../src/css/style.css';
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider, Box } from '@chakra-ui/react'; 
import axios from "axios";
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ResultPage from "./pages/ResultPage";
import VsBot from "./pages/VsBot";
import MultiEnd from "./pages/MultiEnd";
import Help from "./pages/Help";
import { QuizContext } from "./Helpers/Contexts";
import { TimerProvider } from './util/TimerProvider';
import FirstPage from "./pages/FirstPage";
import Dash from './pages/Dash';
import QuizShareCard from './util/QuizShareCard';

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
  const [quizQuestions, setQuizQuestions] = useState([]);

  const [currentQuestion, setCurrentQuestion] = useState(null);

  const getRandomQuestions = (allQuestions, num = 20, category, difficulty) => {
    // Filter questions based on category & difficulty
    const filtered = allQuestions.filter(
      (q) =>
        (!category || q.category === category) &&
        (!difficulty || q.difficulty === difficulty)
    );

    // Shuffle the filtered array
    const shuffled = filtered.sort(() => 0.5 - Math.random());

    // Return the first `num` questions (or less if not enough)
    return shuffled.slice(0, num);
  };

  const fetchQuestion = async () => {
    try {
      const result = await axios("/questions.json");

      // Filter and shuffle based on category & difficulty
      const filtered = result.data.filter(
        (q) =>
          (!categories || q.category === categories) &&
          (!difficulty || q.difficulty === difficulty)
      );

      const shuffled = filtered.sort(() => 0.5 - Math.random());

      // Take first 20 questions
      const random20 = shuffled.slice(0, 20);

      // Set questions state to these 20
      setQuestions(random20);

      // Optionally set first question to display
      setCurrentQuestion(random20[0]);

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading questions:", error);
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
            <Route path="/dash" element={<Dash />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
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
