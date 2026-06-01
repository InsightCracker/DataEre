import '../src/css/style.css';
import { useEffect, useState, useCallback, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider, Box } from '@chakra-ui/react'; 

// Quiz Pages
import LandingPage from "./features/landing/pages/LandingPage";
import LoginPage from "./features/auth/pages/LoginPage";
import SignupPage from './features/auth/pages/SIgnupPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import QuizDashboard from './features/quiz/pages/QuizDashboard';
import Results from './features/quiz/pages/Result';
import VsBot from "./features/quiz/pages/VsBot";
import QuickPlay from "./features/quiz/pages/QuickPlay";

// Daily Challenge
import DailyChallenge from './features/quiz/pages/DailyChallenge';

import Leaderboard from './features/leaderboard/LeaderBoard';

// PDF Converter
import PDFConverter from './pages/PDFConverter';

// Upcoming Feature
import ComingSoon from './util/ComingSoon';

import { QuizContext } from "./util/Contexts";
import { TimerProvider } from './util/TimerProvider';

// Groq AI — DataEre adaptive question generator
import { 
  fetchQuestionsFromGroq,
  clearQuestionCache 
} from "./config/groq";

function App() {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [currQuestion, setCurrQuestion] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [refresh, setRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("")
  const [fetchError, setFetchError] = useState(null);

  // Adaptive quiz parameters
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const categoryRef = useRef("");

  // Keep ref in sync with state so fetchQuestions always reads the latest value
  useEffect(() => { categoryRef.current = category; }, [category]);
  const [userWeakness, setUserWeakness] = useState("");
  const [previousQuestions, setPreviousQuestions] = useState([]);
  const [performance, setPerformance] = useState("average");
  const [learningObjective, setLearningObjective] = useState("");

  // Derive performance level from score automatically
  // Call this after a quiz session ends to update the next session's difficulty
  const updatePerformance = useCallback((totalQuestions, correctAnswers) => {
    const ratio = correctAnswers / totalQuestions;
    if (ratio >= 0.8) setPerformance("high");
    else if (ratio >= 0.5) setPerformance("average");
    else setPerformance("low");
  }, []);


  const fetchQuestions = useCallback(async (categoryOverride) => {
    const activeCategory = categoryOverride ?? categoryRef.current ?? categories;
    
    // Clear cache so a manual refresh always fetches new questions
    clearQuestionCache({
      category,
      difficulty,
      performance,
      userWeakness,
    });

    setIsLoading(true);
    setFetchError(null);
 
    try {
      const generated = await fetchQuestionsFromGroq({
        category: activeCategory,
        difficulty,
        userWeakness,
        previousQuestions,
        performance,
        learningObjective,
      });

      setQuestions(generated);
      setCurrentQuestion(generated[0] ?? null);
      setCurrQuestion(0);
      setScore(0);
      setWrongAnswer(0);

      // Track question texts to avoid repetition in future sessions
      setPreviousQuestions((prev) => [
        ...prev,
        ...generated.map((q) => q.question),
      ]);

    } catch (error) {
      console.error("Error generating questions:", error);

      setFetchError(error.message ?? "Failed to generate questions from Groq.");

      setQuestions([]);
      setCurrentQuestion(null);

      return false
    } finally {
      setIsLoading(false);
    }
  }, [category, 
    difficulty, 
    userWeakness, 
    performance, 
    learningObjective, 
    refresh]);

  return (
    <Router>
      <ChakraProvider>
      <Box>
        <TimerProvider>
        <QuizContext.Provider value={{ 
          // Core quiz
          questions,
          setQuestions,
          currentQuestion,
          setCurrentQuestion,
          currQuestion,
          setCurrQuestion,
          score,
          setScore,
          wrongAnswer,
          setWrongAnswer,
          botScore,
          setBotScore,
          isLoading,
          fetchError,
          refresh,
          setRefresh,
          fetchQuestions,

          // Auth
          email,
          setEmail,
          password,
          setPassword,

          // Adaptive parameters — expose so any page can read/update them
          category,
          setCategory,
          difficulty,
          setDifficulty,
          userWeakness,
          setUserWeakness,
          previousQuestions,
          setPreviousQuestions,
          performance,
          setPerformance,
          updatePerformance,
          learningObjective,
          setLearningObjective,

          // Search
          searchTerm,
          setSearchTerm,
        }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/users/login" element={<LoginPage />} />
            <Route path="/users/signup" element={<SignupPage />} />
            <Route path="/users/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/users/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/users/profile" element={<ProfilePage />} />
            <Route path="/quiz/topics" element={<QuizDashboard />} />
            <Route path="/quiz/solo" element={<QuickPlay />} />
            <Route path="/quiz/results" element={<Results />} />
            <Route path="/quiz/vsbot" element={<VsBot />} />
            <Route path="/board" element={<Leaderboard />} />

            {/* Daily Challenge */}
            <Route path='/challenge' element={<DailyChallenge />} />

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
