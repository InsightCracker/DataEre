import { 
    Box
} from "@chakra-ui/react";

const HowItWorks = () => {
    return (
    <Box className="howitworks" id="services">
        <h2>How It Works</h2>

        <p>Get started in three steps</p>

        <Box className="steps-container">
            <div className="step-card visible">
                <div className="step-number">1</div>
                <div className="step-icon">📚</div>
                <h3>Choose Your Quiz Journey</h3>
                <p>Pick what you want to master — quizzes on Excel, Power BI, Tableau, SQL, Python or real-world projects. Start where your curiosity takes you.</p>
            </div>

            <div className="step-card visible">
                <div className="step-number">2</div>
                <div className="step-icon">🖥️</div>
                <h3>Learn & Test Your Skills</h3>
                <p>Dive into interactive lessons, hands-on quizzes, and real-world challenges. Practice, get instant feedback, and sharpen your knowledge step by step.</p>
            </div>

            <div className="step-card visible">
                <div className="step-number">3</div>
                <div className="step-icon">📈</div>
                <h3>Track Progress & Show Off</h3>
                <p >Monitor your performance, see your ranking on the leaderboard, and share your quiz results with peers or colleagues to showcase your skills and achievements.</p>
            </div>
        </Box>
    </Box>
    )
}

export default HowItWorks