import { 
    Box, 
    Text 
} from "@chakra-ui/react";

import { AiOutlineGlobal } from "react-icons/ai";

const Navbar = () => {
  return (
    <Box sx={{
      width: "100vw",
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      pos: 'fixed',
      background: '#fff',
      backdropFilter: 'blur(10px)',
      top: 0,
      left: 0,
      zIndex: '2000',
      padding: '1rem 5%',
      borderBottom: '1px solid #bebebe'
    }} className='navbar'>
        <p>DataEre</p>

        <Box  className="max_list">
            <ul sx={{
                width: "100%",
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <a href="#about">
                    <li>My Profile</li>
                </a>
                <a href="#services">
                    <li>Concept Mastery</li>
                </a>
                <a href="#features">
                    <li>PDF Converter</li>
                </a>
                <a href="#features">
                    <li>Report Generator</li>
                </a>
            </ul>
        </Box>

        <Box  className="mini_list">
            <ul sx={{
                width: "100%",
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <a href="#about">
                    <li>My Profile</li>
                </a>
                <a href="#services">
                    <li>Concept Mastery</li>
                </a>
                <a href="#features">
                    <li>PDF Converter</li>
                </a>
                <a href="#features">
                    <li>Report Generator</li>
                </a>
            </ul>
        </Box>

        <div className="lang" style={{
            display: "flex",
            alignItems: 'center',
            gap: '.2rem'
        }}>
            <p><AiOutlineGlobal /></p> 
            <p>EN</p>
        </div>
    </Box>
  )
}

export default Navbar