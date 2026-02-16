import { 
  useEffect,
  useContext 
} from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { QuizContext } from "../Helpers/Contexts";
import confetti from "canvas-confetti";

import {
  FaWhatsapp,
  FaTwitter,
  FaLinkedinIn,
  FaFacebook
} from "react-icons/fa"

const getBadgeEmoji = (percentage) => {
  if (percentage >= 90) return "🏆";
  if (percentage >= 70) return "🔥";
  if (percentage >= 50) return "👏";
  return "💪";
};

// Quiz Share Card Component
const QuizShareCard = ({ 
  score = 0,
  categories  = ""
}) => {
  
  const { 
    questions = [],
    setWrongAnswer,
    setRefresh,
    setScore,
    setBotScore
  } = useContext(QuizContext);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Safe calculation
  const totalQuestions = questions.length;
  
   const percentage =
    totalQuestions > 0
      ? Math.round((Number(score) / totalQuestions) * 100)
      : 0;

  const result = {
    percentage,
    title: "My Dataxo Quiz Result!",
    message: `I scored ${percentage}% on the Dataxo ${categories} Quiz! Can you beat me? 😎`,
    url: "https://dataxo.cfd/home"
  };

  // 🎉 Confetti
  useEffect(() => {
    confetti({
      particleCount: percentage >= 70 ? 120 : 80,
      spread: percentage >= 70 ? 70 : 50,
      origin: { y: 0.6 }
    });
  }, [percentage]);

  // Smart share function
  const share = async (platform = null) => {
    const fullText = `${result.message} ${result.url}`;

    const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(result.message)}&url=${encodeURIComponent(result.url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(result.url)}&quote=${encodeURIComponent(result.message)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(result.url)}`
    };

    if (platform && shareLinks[platform]) {
    window.open(shareLinks[platform], "_blank", "width=600,height=500");
    return;
    }

    if (navigator.share) {
    try {
      await navigator.share({
      title: result.title,
      text: result.message,
      url: result.url
      });
      return;
    } catch (err) {
      console.error(err);
    }
    }

    try {
    await navigator.clipboard.writeText(fullText);
    alert("Link copied! Share it anywhere 🚀");
    } catch {
    alert("Sharing not supported on this device.");
    }
  };

  // ✅ Reset function (cleaner)
  const resetQuizState = () => {
    setScore(0);
    setBotScore(0);
    setWrongAnswer(0);
  };
  
  const retry = () => {
    resetQuizState();

    if (location.pathname === "/result") {
      setRefresh(prev => !prev);
      navigate("/dashboard");
    } else if (location.pathname === "/multiend") {
      setRefresh(prev => !prev);
      navigate("/vsbot");
    }
  };



  const goToDashboard = () => {  
    resetQuizState();
    navigate("/home");
  };


  return (
    <div className="container-quiz-share">
      <div className="quiz-share-card">
        <div className="badge">
          <h1>{getBadgeEmoji(percentage)}</h1>
          <h2>{percentage}<span>%</span></h2>
          <p>Great Job!</p>
        </div>

        <div className="share-msg">
          <p>{result.message}</p>
        </div>

        <div 
          onClick={() => share()} 
          className="quick-share-btn"
        >
          <button>Quick Share</button>
        </div>

        <div className="share-buttons">
          <button onClick={() => share("whatsapp")}><FaWhatsapp /></button>
          <button onClick={() => share("twitter")}><FaTwitter /></button>
          <button onClick={() => share("facebook")}><FaFacebook /></button>
          <button onClick={() => share("linkedin")}><FaLinkedinIn /></button>
        </div>

        <div className="other-share-btn">
          <div 
            className="other-share-btn-left"
            onClick={retry}
          >
            Try Again
          </div>

          <div 
            className="other-share-btn-right"
            onClick={goToDashboard}
          >
            Go to Dashboard
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizShareCard;