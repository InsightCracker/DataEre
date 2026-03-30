import { 
    Box
} from "@chakra-ui/react";

const Features = () => {
    return (
    <Box className="features" id="features">
        <h2>Why Choose DataEre?</h2>

        <p>Building a smarter way to learn data</p>

        <div className="features-text">
            <Box className="features-grid">
                <div className="feature-list visible">
                    <h3>🚀 Fast-Track Your Learning</h3>
                    <p>Engaging quizzes and practical challenges that accelerate your journey from beginner to confident data professional.</p>
                </div>

                <div className="feature-list visible">
                    <h3>🎯 Beyond Tools - Real Thinking</h3>
                    <p>We help you master concepts, critical reasoning, and problem-solving not just software buttons.</p>
                </div>

                <div className="feature-list visible">
                    <h3>🌐 Learn From Anywhere</h3>
                    <p>Accessible to students, analysts, and aspiring data scientists across the world at your own pace.</p>
                </div>

                <div className="feature-list visible">
                    <h3>💡 Smart Feedback & Guidance</h3>
                    <p>Actionable insights on your progress so you always know what to improve and why.</p>
                </div>
            </Box>
        </div>
    </Box>
    )
}

export default Features