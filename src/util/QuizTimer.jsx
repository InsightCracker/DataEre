import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

const QuizTimer = ({ initialTime = 300 }) => { // default = 5 minute
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (timeLeft <= 0) {
      if (location.pathname === "/quiz/solo") {
        navigate("/quiz/result");
      } else if (location.pathname === "/quiz/vsbot") {
        navigate("/multiend");
      }
      
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

      return () => clearInterval(timer);
    }, [navigate, timeLeft, location.pathname]);


  // Convert seconds to MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <div className="timer">
      ⏱ {formattedTime}
    </div>
  );
}

export default QuizTimer;
