import { 
  useContext, 
  useEffect, 
  useRef, 
  useState 
} from "react";
import { useNavigate } from "react-router-dom";
import { Box, Spinner } from "@chakra-ui/react";
import { QuizContext } from "../../../shared/contexts/Contexts";
import { categoriesList } from "../../../shared/utils/categories";

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

  const filteredCategories = categoriesList.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!isLoading && questions.length > 0 && pendingRoute.current) {
      const route = pendingRoute.current;
      pendingRoute.current = null; 
      setLoading(null);
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
    setLoading(`solo-${cat.id}`);
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

  const isSoloLoading = (cat) => loading === `solo-${cat.id}`;
  const isBotLoading  = (cat) => loading === `bot-${cat.id}`;
  const isCardLoading = (cat) => isSoloLoading(cat) || isBotLoading(cat);
  const anyLoading    = loading !== null;

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
              placeholder="Search Data Skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="search-clear" onClick={() => setSearchTerm("")}>✕</button>
            )}
          </div>
        </div>

        <Box className="card-grid">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <div
                key={cat.name}
                className={`topic-card${isCardLoading(cat) ? " card-loading" : ""}${anyLoading && !isCardLoading(cat) ? " card-dimmed" : ""}`}
                style={{ "--card-accent": cat.accent, "--card-bg": cat.iconBg }}
              >
                {/* Loading overlay — only on the active card */}
                {isCardLoading(cat) && (
                  <div className="card-loading-overlay">
                    <div className="card-loading-inner">
                      <Spinner
                        size="md"
                        color="#4263eb"
                        thickness="3px"
                        speed="0.65s"
                      />
                      <span className="card-loading-label">
                        {isSoloLoading(cat) ? "Setting up the session…" : "Setting up bot…"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="bot-badge">🤖 Bot Mode</div>
                <div className="card-icon-wrap">{cat.icon}</div>
                <div className="card-title">{cat.name}</div>
                <div className="card-desc">{cat.description}</div>

                <div className="card-footer">
                  <button
                    onClick={() => !anyLoading && quickPlay(cat)}
                    className={`card-btn primary${isSoloLoading(cat) ? " btn-loading" : ""}`}
                    disabled={anyLoading}
                    aria-busy={isSoloLoading(cat)}
                  >
                    {isSoloLoading(cat) ? (
                      <>
                        <Spinner size="xs" color="white" speed="0.65s" />
                        <span>Loading…</span>
                      </>
                    ) : (
                      <>⚡ Solo Mode</>
                    )}
                  </button>

                  <button
                    onClick={() => !anyLoading && botMode(cat)}
                    className={`card-btn${isBotLoading(cat) ? " btn-loading" : ""}`}
                    disabled={anyLoading}
                    aria-busy={isBotLoading(cat)}
                  >
                    {isBotLoading(cat) ? (
                      <>
                        <Spinner size="xs" color="white" speed="0.65s" />
                        <span>Loading…</span>
                      </>
                    ) : (
                      <>🤖 Bot Mode</>
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔎</div>
              <h3>No Data Skill found</h3>
              <p>No results for "<strong>{searchTerm}</strong>". Try a different keyword.</p>
            </div>
          )}
        </Box>
      </div>

      <style>{`
        /* ── Card loading overlay ── */
        .topic-card {
          position: relative;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .topic-card.card-dimmed {
          opacity: 0.45;
          pointer-events: none;
        }

        .topic-card.card-loading {
          /* keep opacity full; overlay handles the visual */
        }

        .card-loading-overlay {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          animation: overlayFadeIn 0.2s ease both;
        }

        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .card-loading-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .card-loading-label {
          font-size: 13px;
          font-weight: 600;
          color: #4263eb;
          letter-spacing: 0.01em;
        }

        /* ── Button loading state ── */
        .card-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: opacity 0.2s ease, transform 0.15s ease;
        }

        .card-btn:disabled {
          cursor: not-allowed;
        }

        .card-btn.btn-loading {
          opacity: 0.9;
        }

        /* Pulse ring on the active card */
        .topic-card.card-loading::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          border: 2px solid #4263eb;
          opacity: 0;
          animation: cardPulse 1.4s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes cardPulse {
          0%   { opacity: 0.7; transform: scale(1);    }
          100% { opacity: 0;   transform: scale(1.03); }
        }
      `}</style>
    </Box>
  );
};

export default Cards;