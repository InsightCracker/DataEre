import { 
  useContext, 
  useEffect, 
  useRef, 
  useState 
} from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../../../util/Contexts";
import { categoriesList } from "../../../util/categories";
import { Box, Spinner } from "@chakra-ui/react";

const Cards = () => {
  const navigate = useNavigate();
  const pendingRoute = useRef(null); 
  const [loading, setLoading] = useState(null);

  const {
    setCategory,
    searchTerm,
    fetchQuestions,
    questions,
    isLoading
  } = useContext(QuizContext);

  // Filter categories based on search input
  const filteredCategories = categoriesList.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!isLoading && questions.length > 0 && pendingRoute.current) {
      const route = pendingRoute.current;
      pendingRoute.current = null; 
      setLoading(null)
      navigate(route);
    }
  }, [isLoading, questions, navigate]);

  const quickPlay = (cat) => {
    if (window.gtag) {
      window.gtag('event', 'quick_play', {
        event_category: 'engagement',
        event_label: 'Quick Play Button',
        value: 1
      });
    }

    
    setLoading(`solo-${cat.id}`)
    pendingRoute.current = "/quiz/solo";
    setCategory(cat.name);
    fetchQuestions(cat.name);
  };

  const botMode = (cat) => {
    if (window.gtag) {
      window.gtag('event', 'bot_mode', {
        event_category: 'engagement',
        event_label: 'Bot Mode Button',
        value: 1
      });
    }

    setLoading(`bot-${cat.id}`);
    pendingRoute.current = "/quiz/vsbot"; 
    setCategory(cat.name);
    fetchQuestions(cat.name);
  };

  return (
    <Box>
      <div>
        <Box className="card-grid">
          {filteredCategories.map((cat, index) => (
            <div className="card visible" key={cat.id || index}>
              <div className="content">
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>

                <div className="btns-box">
                  <button
                    onClick={() => quickPlay(cat)}
                    className="btn card-btn"
                  >
                    {loading === `solo-${cat.id}` ? <Spinner size="sm" color="white" /> : "Qucik Play"}
                  </button>

                  <button
                    onClick={() => botMode(cat)}
                    className="btn card-btn"
                  >
                    {loading === `bot-${cat.id}` ? <Spinner size="sm" color="white" /> : "Bot Mode"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Box>
      </div>
    </Box>
  );
};

export default Cards;