import { 
  Box, 
  Text 
} from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Box sx={{
      width: "100vw",
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      pos: 'fixed',
      background: 'rgba(10, 14, 39, 0.95)',
      backdropFilter: 'blur(10px)',
      top: 0,
      left: 0,
      zIndex: '2000',
      padding: '1rem 5%',
      borderBottom: '1px solid rgba(19, 44, 207, 0.2)'
    }} className='navbar'>
        <Text className="logo">Data<span className="dataxo">Ere</span></Text>

        <Box  className="large_nav">
        <ul sx={{
            width: "100%",
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}>
          <a href="#about">
            <li>About</li>
          </a>
          <a href="#services">
            <li>Services</li>
          </a>
          <a href="#features">
            <li>Features</li>
          </a>
        </ul>
      </Box>
        
        <a href="/users/login" className="btn nav-btn">Get Started</a>
    </Box>
  )
}

export default Navbar