import '../styles/profile.css';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';

import { 
    Box
} from "@chakra-ui/react";

import { 
    SiThunderstore 
} from "react-icons/si";

import { 
  FaAward,
  FaBullseye,
  FaGraduationCap,
  FaLaptopFile,
  FaChartColumn
} from "react-icons/fa6";

const ProfilePage = () => {
    const navigate = useNavigate();
    return (
    <Box className="profile_page">
        <Box>
            <Navbar />
        </Box>

        <Box className='dashboard_container'>
            <div className="profile">
            <h1 >Welcome back 👋</h1>

            <div className="dash-list">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    gap: '.5rem'
                }}>
                    <h1 style={{
                        color: 'rgb(146, 124, 0)'
                    }}><FaAward /> </h1>

                    <div>Advance Analyst</div>
                </div>

                <div className="profile-btn">
                    View Leaderboard
                </div>
            </div>

            <div className="dash-list colored">
                <div className="dash-list-card">
                    <Box className="icon" 
                        sx={{color: '#304ecf' }} 
                    >
                        <SiThunderstore />
                    </Box>

                    <div className="list-text">
                        <p>Daily Streak</p>
                        <h3>0 days</h3>
                    </div>
                </div>

                <div className="dash-list-card">
                    <Box className="icon" 
                        sx={{color: '#304ecf' }} 
                    >
                        <FaGraduationCap />
                    </Box>

                    <div className="list-text">
                        <p>Total Points</p>
                        <h3>0</h3>
                    </div>
                </div>
            </div>
        </div>

        <div className="low-box">
            <div className=" max_box left-side-box">
                <div className="first_box">
                    <h2><FaBullseye className="box_icon" /> 
                        Daily Challenge
                    </h2>

                    <p>Answer today's question!</p>

                    <p><span>Reward:</span> +20 points</p>

                    <div className="max-box-btn">
                        Start Challenge
                    </div>
                </div>

                <div className="second_box">
                    <h2>
                        <FaLaptopFile className="box_icon" />
                        Continue Learning
                    </h2>

                    <p>Test your skill level.</p>

                    <div 
                        onClick={() => {
                            navigate('/quiz')
                        }}
                        className="max-box-btn"
                    >
                        Resume Quiz
                    </div>
                </div>

                <div className="third_box">
                    <h2>
                        <FaChartColumn className="box_icon" />
                        Your Data Journey
                    </h2>
                    
                    <div className="third-inner">
                        <div>
                            <p>Quizzes Taken: <span>18</span></p>
                            <p>Best Skill: <span>Excel</span></p>
                        </div>


                        <div>
                            <p>Average Score <span>82%</span></p>
                            <p>Weak Skill: <span>SQL</span></p>
                        </div>
                    </div>

                </div>
            </div>

            <div className="max_box right-side-box">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    gap: '.5rem',
                    fontWeight: '600'
                }}>
                    <h1>🏆 </h1>

                    <div>Top DataEre Analysts</div>
                </div>
                
                <div>

                </div>
                
                <p style={{
                        color: '#304ecf',
                        paddingTop: '.5rem',
                        marginTop: '.5rem',
                        textAlign: 'center',
                        fontSize: '.7rem',
                        fontWeight: '500',
                        borderTop: '.7px solid #304dcf52',
                        cursor: 'pointer'
                    }}>View Full Leaderboard
                </p>
            </div>
        </div>
        </Box>
    </Box>
    )
}

export default ProfilePage;