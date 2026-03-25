import { 
    Box
} from "@chakra-ui/react";

const Hero = () => {
    return (
    <Box className="hero" id="hero">
        <h1>Your Data Workflow, All in One Hub</h1>

        <p>Engage with quizzes, convert PDFs to Excel, and generate reports - seamlessly.</p>

        <Box sx={{
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
        }}>
            <a href="/login" className="btn btn-primary">Start Now</a>

            <a href='#services' className="btn btn-secondary">Explore Services</a>
        </Box>
    </Box>
    )
}

export default Hero