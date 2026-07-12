import '../src/css/style.css';
import { useEffect, useState, useCallback, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider, Box } from '@chakra-ui/react'; 

// Quiz Pages
import LandingPage from "./features/landing/pages/LandingPage";
import LoginPage from "./features/auth/pages/LoginPage";
import SignUpPage from './features/auth/pages/SignUpPage';
import OAuthCallback from './features/auth/pages/OAuthCallback';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import QuizDashboard from './features/quiz/pages/QuizDashboard';
import Results from './features/quiz/pages/Result';
import VsBot from "./features/quiz/pages/VsBot";
import QuickPlay from "./features/quiz/pages/QuickPlay";

// Daily Challenge
import DailyChallenge from './features/challenge/DailyChallenge';

import Leaderboard from './features/leaderboard/LeaderBoard';

// Premium Features
import DatasetChallengePage from './features/premium/DatasetUpload';
import PaywallModal from './features/premium/PaywallModal';

// Upcoming Feature
import ComingSoon from './utils/ComingSoon';

import { QuizContext } from "./shared/contexts/Contexts";
import { TimerProvider } from './shared/contexts/TimerProvider';

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
            <Route path="/users/signup" element={<SignUpPage />} />
            <Route path="/users/oauth/callback" element={<OAuthCallback />} />
            <Route path="/users/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/users/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/users/profile" element={<ProfilePage />} />
            <Route path="/quiz/topics" element={<QuizDashboard />} />
            <Route path="/quiz/solo" element={<QuickPlay />} />
            <Route path="/quiz/results" element={<Results />} />
            <Route path="/quiz/vsbot" element={<VsBot />} />
            <Route path="/board" element={<Leaderboard />} />

            /* Premium Features */
            <Route path='/upload-dataset' element={<DatasetChallengePage />} />
            <Route path='/payment' element={<PaywallModal />} />

            {/* Daily Challenge */}
            <Route path='/challenge' element={<DailyChallenge />} />

            {/* Coming Soon */}
            <Route path="/coming-soon" element={<ComingSoon />} />
          </Routes>
        </QuizContext.Provider>
        </TimerProvider>
      </Box>
      </ChakraProvider>
    </Router>
  );
}

export default App;
