import { 
    Box
} from "@chakra-ui/react";

const About = () => {
    return (
    <Box className="about" id="about">
        <h2>About Us</h2>

        <p>Building a Smarter Way to Master Data</p>

        <div className="about-text">
            <p>DataXO combines interactive quizzes, PDF-to-Excel conversion, and real-world scenarios to help analysts and data enthusiasts go beyond just using tools. Our platform empowers you to think critically, reason with data, and make smarter analytical decisions.</p>

            <p>We bridge the gap between tool proficiency and deep conceptual understanding, so you can truly master your data skills and workflow.</p>

            <Box className="about-grid">
                <div className="about-feature visible">
                    <h3>📊 Smart Data Quizzes</h3>
                    <p>Take interactive, hands-on quizzes on Excel, Power BI, data modeling, and more. Test your skills, master real-world analytics scenarios, and track your progress as your confidence grows with every challenge.</p>
                </div>

                <div className="about-feature visible">
                    <h3>📄 PDF to CSV/XLSX Converter</h3>
                    <p>Easily convert PDFs to CSV or Excel files. Streamline your workflow, save time, and get accurate data ready for analysis.</p>
                </div>

                <div className="about-feature visible">
                    <h3>🧠 Data Concepts Mastery</h3>
                    <p>Build a solid foundation in essential data terms, analytics frameworks, and key concepts. Our interactive lessons make complex ideas simple, helping you think critically and apply theory to practice.</p>
                </div>

                <div className="about-feature visible">
                    <h3>📝 Instant Report Generator</h3>
                    <p>Upload a screenshot of your dashboard and get a professional report instantly - available in PDF, Word, or README format. Turn your visuals into clear, actionable insights with just a few clicks.</p>
                </div>
            </Box>
        </div>
    </Box>
    )
}

export default About