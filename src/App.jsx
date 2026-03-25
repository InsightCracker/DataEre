import '../src/css/style.css';
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider, Box } from '@chakra-ui/react'; 
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

// Quiz Pages
import QuickPlay from "./pages/QuickPlay";
import Login from "./pages/Login";
import Home from './pages/Home';
import ResultPage from "./pages/ResultPage";
import VsBot from "./pages/VsBot";
import MultiEnd from "./pages/MultiEnd";
import LandingPage from "./features/landing/pages/LandingPage";
import Datahub from './pages/Datahub';
import Dashboard from './pages/Dashboard';
import Leaderboard from './util/LeaderBoard';

// PDF COnverter
import PDFConverter from './pages/PDFConverter';

// Upcoming Feature
import ComingSoon from './util/ComingSoon';

import { QuizContext } from "./Helpers/Contexts";
import { TimerProvider } from './util/TimerProvider';

function App() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState("");
  const [score, setScore] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [currQuestion, setCurrQuestion] = useState(0);
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [refresh, setRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Shuffle utility
  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

// Fetch AI-generated questions from backend
  const fetchAIQuestions = async () => {
    try {
      setIsLoading(true);

      // Call your Express backend API
      const response = await axios.post("http://localhost:5000/api/generate", {
        topic: categories || "General Knowledge",
        difficulty: difficulty
      });

      // Shuffle and pick first 20 questions
      const shuffledQuestions = shuffleArray(response.data).slice(0, 20);

      setQuestions(shuffledQuestions);
      setCurrentQuestion(shuffledQuestions[0] || null);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching AI questions:", error);
      setIsLoading(false);
    }
  };

  // Re-fetch questions when difficulty, category, or refresh changes
  useEffect(() => {
    fetchAIQuestions(); // eslint-disable-next-line
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
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/datahub" element={<Datahub />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quiz" element={<Home />} />
            <Route path="/solo" element={<QuickPlay />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/multiend" element={<MultiEnd />} />
            <Route path="/vsbot" element={<VsBot />} />
            <Route path="/board" element={<Leaderboard />} />

            {/* Converter */}
            <Route path="/converter" element={<PDFConverter />} />

            {/* Coming Soon */}
            <Route path="/tune" element={<ComingSoon />} />
          </Routes>
        </QuizContext.Provider>
        </TimerProvider>
      </Box>
      </ChakraProvider>
    </Router>
  );
}

export default App;
