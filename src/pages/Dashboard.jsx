import { 
    Box
} from "@chakra-ui/react";

import dataQuiz from "../assets/dataquiz.png";
import conceptMastery from "../assets/conceptMastery.png"
import one from "../assets/1.PNG"

const Dashboard = () => {
  return (
    <Box className="dashboard container">
        <div className="head">
            <h2>Dashboard</h2>
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
                        <a href="/home" className="btn card-btn">Start</a>
                    </div>
                </div>

                <div className="card visible">
                    <div className="img-box">
                        <img
                        src={one}
                            alt="Data Quizzes"
                            style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    </div>
                    <div className="content">
                        <h3>PDF COnverter</h3>
                        <p>Turn your PDFs into actionable data in seconds! Convert to Excel (XLSX) or CSV instantly and get your information ready for analysis, reporting, and smarter decisions - no manual work required.</p>
                        <a href="/#" className="btn card-btn">Start</a>
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
                        <a href="/multiplayer" className="btn card-btn">Start</a>
                    </div>
                </div>

                <div className="card visible">
                    <div className="img-box">
                        <img
                        src={one}
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
                        <p>Put your theoretical knowledge to the test with over 500 carefully crafted questions, and explore a wide range of data tools to strengthen your skills and boost your understanding.</p>
                        <a href="/#" className="btn card-btn">Start</a>
                    </div>
                </div>

                <div className="card visible">
                    <div className="img-box">
                        <img
                        src={one}
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
                        <p>Put your theoretical knowledge to the test with over 500 carefully crafted questions, and explore a wide range of data tools to strengthen your skills and boost your understanding.</p>
                        <a href="/#" className="btn card-btn">Start</a>
                    </div>
                </div>
            </div>        
        </div>
    </Box>
  )
}

export default Dashboard