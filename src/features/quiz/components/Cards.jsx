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
    setSearchTerm,
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
        {/* Search + Section Header */}
          <div className="search-row">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                type="text"
                placeholder="Search Data SKills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="search-clear" onClick={() => setSearchTerm("")}>✕</button>
              )}
            </div>
          </div>

        <Box className="card-grid">
          {filteredCategories.length > 0 ? filteredCategories.map((cat, index) => (
            <div
                key={cat.name}
                className="topic-card"
                style={{ "--card-accent": cat.accent, "--card-bg": cat.iconBg }}
              >
                <div className="bot-badge">🤖 Bot Mode</div>
                <div className="card-icon-wrap">{cat.icon}</div>
                <div className="card-title">{cat.name}</div>
                <div className="card-desc">{cat.description}</div>
                <div className="card-footer">
                  <button 
                    onClick={() => quickPlay(cat)} 
                    className="card-btn primary">⚡ Quick Play</button>
                  <button 
                    onClick={() => botMode(cat)}
                    className="card-btn">🤖 Bot Mode</button>
                </div>
              </div>
            // <div className="card visible" key={cat.id || index}>
            //   <div className="content">
            //     <h3>{cat.name}</h3>
            //     <p>{cat.description}</p>

            //     <div className="btns-box">
            //       <button
            //         onClick={() => quickPlay(cat)}
            //         className="btn card-btn"
            //       >
            //         {loading === `solo-${cat.id}` ? <Spinner size="sm" color="white" /> : "Qucik Play"}
            //       </button>

            //       <button
            //         onClick={() => botMode(cat)}
            //         className="btn card-btn"
            //       >
            //         {loading === `bot-${cat.id}` ? <Spinner size="sm" color="white" /> : "Bot Mode"}
            //       </button>
            //     </div>
            //   </div>
            // </div>
          )): (
              <div className="empty-state">
                <div className="empty-icon">🔎</div>
                <h3>No Data Skill found</h3>
                <p>No results for "<strong>{searchTerm}</strong>". Try a different keyword.</p>
              </div>
            )}
        </Box>
      </div>
    </Box>
  );
};

export default Cards;