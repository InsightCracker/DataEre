import '../src/css/style.css';
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider, Box } from '@chakra-ui/react'; 
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

// Quiz Pages
import LandingPage from "./features/landing/pages/LandingPage";
import LoginPage from "./features/auth/pages/LoginPage";
import SignupPage from './features/auth/pages/SIgnupPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import QuizDashboard from './features/quiz/pages/QuizDashboard';
import Results from './features/quiz/pages/Result';
import VsBot from "./features/quiz/pages/VsBot";
// import MultiEnd from "./pages/MultiEnd";
import QuickPlay from "./features/quiz/pages/QuickPlay";
import Datahub from './pages/Datahub';

import Leaderboard from './util/LeaderBoard';

// PDF Converter
import PDFConverter from './pages/PDFConverter';

// Upcoming Feature
import ComingSoon from './util/ComingSoon';

import { QuizContext } from "./util/Contexts";
import { TimerProvider } from './util/TimerProvider';

function App() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState("");
  const [score, setScore] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [currQuestion, setCurrQuestion] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [refresh, setRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Shuffle utility
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

// Fetch questions from JSON
const fetchQuestions = async () => {
  try {
    setIsLoading(true);

    const response = await fetch("/questions.json");
    const data = await response.json();

    // Filter by category & difficulty
    const filteredQuestions = data.filter((q) => {
      const matchCategory = categories ? q.category === categories : true;
      const matchDifficulty = difficulty ? q.difficulty === difficulty : true;
      return matchCategory && matchDifficulty;
    });

    // Shuffle and limit to 20
    const finalQuestions = shuffleArray(filteredQuestions).slice(0, 20);

    setQuestions(finalQuestions);
    setCurrentQuestion(finalQuestions[0] || null);
  } catch (error) {
    console.error("Error loading questions:", error);
  } finally {
    setIsLoading(false); // ✅ cleaner
  }
};

// Re-fetch when dependencies change
useEffect(() => {
  fetchQuestions();
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
          email,
          setEmail,
          password,
          setPassword,
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
          setWrongAnswer,
          searchTerm,
          setSearchTerm
        }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/users/login" element={<LoginPage />} />
            <Route path="/users/signup" element={<SignupPage />} />
            <Route path="/users/profile" element={<ProfilePage />} />
            <Route path="/datahub" element={<Datahub />} />
            <Route path="/quiz/topics" element={<QuizDashboard />} />
            <Route path="/quiz/solo" element={<QuickPlay />} />
            <Route path="/results" element={<Results />} />
            <Route path="/quiz/vsbot" element={<VsBot />} />
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
