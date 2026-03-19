import { 
    Box
} from "@chakra-ui/react";

import dataQuiz from "../assets/dataquiz.png";
import conceptMastery from "../assets/conceptMastery.png";
import pdfconvert from "../assets/pdfconvert.png"
import instant from "../assets/instant.png"

const Datahub = () => {
  return (
    <Box className="dashboard container">
        <div className="head">
            <h2>Data Hub</h2>
        </div>
        
        <div className="">
            <div className="features-grid">
                <div className="card visible">
                    <div className="img-box">
                        <img
                        src={dataQuiz}
                            alt="Data Quizzes"
                            style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    </div>
                    <div className="content">
                        <h3>Data Quizzes</h3>
                        <p>Challenge yourself with 500+ questions and discover the power of different data tools.</p>
                        <a href="/quiz" className="btn card-btn">Explore</a>
                    </div>
                </div>

                <div className="card visible">
                    <div className="img-box">
                        <img
                        src={pdfconvert}
                            alt="Data Quizzes"
                            style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    </div>
                    <div className="content">
                        <h3>PDF Converter</h3>
                        <p>Turn your PDFs into actionable data in seconds! Convert to Excel (XLSX) or CSV instantly and get your information ready for analysis, reporting, and smarter decisions - no manual work required.</p>
                        <a href="/converter" className="btn card-btn">Explore</a>
                    </div>
                </div>

                <div className="card visible">
                    <div className="img-box">
                        <img
                        src={conceptMastery}
                            alt="Data Quizzes"
                            style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    </div>
                    <div className="content">
                        <h3>Concepts Mastery</h3>
                        <p>Learn data concepts deeply and clearly, even if you’re just starting out. Explore practical examples to master each topic.</p>
                        <a href="/tune" className="btn card-btn">Explore</a>
                    </div>
                </div>

                <div className="card visible">
                    <div className="img-box">
                        <img
                        src={instant}
                            alt="Data Quizzes"
                            style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    </div>
                    <div className="content">
                        <h3>Instant Report Generator</h3>
                        <p>Upload a screenshot of your dashboard and get a professional report instantly. Available in PDF, Word, or README format. Turn your visuals into clear, actionable insights with just a few clicks.</p>
                        <a href="/tune" className="btn card-btn">Explore</a>
                    </div>
                </div>

            </div>        
        </div>
    </Box>
  )
}

export default Datahub