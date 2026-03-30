import { 
  Box
} from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Box sx={{
      background: 'rgba(10, 14, 39, 0.95)',
      backdropFilter: 'blur(10px)',
      zIndex: '2000',
      padding: '1rem 5%',
      borderBottom: '1px solid rgba(19, 44, 207, 0.2)'
    }} className='navbar'>

       <Box>
          <p className="logo">Data<span className="">Ere</span></p>
        </Box>

      <Box  className="large_nav">
        <ul sx={{
          width: "100%",
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
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
      
      <Box>
        <a href="/users/login" className="btn nav-btn">Get Started</a>
      </Box>
    </Box>
  )
}

export default Navbar