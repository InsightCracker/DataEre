const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
 
  const links = [{ label:"About", href:"#about" }, { label:"Services", href:"#services" }, { label:"Features", href:"#features" }];
 
  return (
    <Box position="fixed" top={0} left={0} right={0} zIndex={2000}
      bg={scrolled ? "rgba(6,9,20,0.96)" : "transparent"}
      backdropFilter={scrolled ? "blur(20px)" : "none"}
      borderBottom={scrolled ? "1px solid rgba(74,158,255,0.15)" : "none"}
      boxShadow={scrolled ? "0 8px 40px rgba(0,0,0,0.5)" : "none"}
      transition="all 0.4s cubic-bezier(0.4,0,0.2,1)"
      px={{ base:"6%", md:"6%" }} py="1rem"
    >
      <style>{fontLink}</style>
      <Flex align="center" justify="space-between">
        <Text fontFamily="'Cabinet Grotesk',sans-serif" fontSize={{ base:"1.4rem", md:"1.6rem" }}
          fontWeight={900} color="white" letterSpacing="-1px" cursor="pointer">
          Data<Text as="span" bgGradient="linear(135deg,#304ecf,#4a9eff)" bgClip="text">Ere</Text>
        </Text>
 
        <HStack spacing="2.5rem" display={{ base:"none", md:"flex" }}>
          {links.map(l => (
            <Box key={l.label} as="a" href={l.href} position="relative"
              color={C.muted} fontSize="0.88rem" fontWeight={600}
              fontFamily="'Cabinet Grotesk',sans-serif" letterSpacing="0.02em"
              textDecoration="none" transition="color 0.2s"
              _hover={{ color:"white", textDecoration:"none" }}
              sx={{
                "&::after": { content:'""', position:"absolute", bottom:"-3px", left:0, width:0, height:"1px",
                  bg:"#4a9eff", transition:"width 0.3s ease", display:"block" },
                "&:hover::after": { width:"100%" }
              }}>{l.label}</Box>
          ))}
        </HStack>
 
        <Flex gap={3} align="center">
          <Button as="a" href="/users/login"
            display={{ base:"none", md:"inline-flex" }}
            bg="transparent" color={C.accent}
            border="1px solid rgba(74,158,255,0.4)"
            fontFamily="'Cabinet Grotesk',sans-serif"
            fontSize="0.85rem" fontWeight={700}
            px="1.4rem" py="0.45rem" borderRadius="8px"
            transition="all 0.25s"
            _hover={{ bg:"rgba(74,158,255,0.1)", borderColor:C.accent, transform:"translateY(-1px)" }}>
            Sign In
          </Button>
          <Button as="a" href="/users/login"
            display={{ base:"none", md:"inline-flex" }}
            bgGradient="linear(135deg,#304ecf,#4a9eff)"
            color="white" fontFamily="'Cabinet Grotesk',sans-serif"
            fontSize="0.85rem" fontWeight={700}
            px="1.4rem" py="0.45rem" borderRadius="8px"
            boxShadow="0 4px 20px rgba(48,78,207,0.4)"
            _hover={{ transform:"translateY(-2px)", boxShadow:"0 8px 30px rgba(48,78,207,0.6)" }}
            transition="all 0.25s">
            Get Started
          </Button>
          <IconButton display={{ base:"flex", md:"none" }} onClick={onToggle}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            variant="ghost" color="white" fontSize="1.1rem"
            _hover={{ bg:"rgba(74,158,255,0.1)" }} aria-label="menu" />
        </Flex>
      </Flex>
 
      {isOpen && (
        <VStack spacing={0} mt="1rem" pb="1.5rem"
          borderTop="1px solid rgba(255,255,255,0.06)" align="stretch"
          display={{ base:"flex", md:"none" }}>
          {links.map(l => (
            <Box key={l.label} as="a" href={l.href} onClick={onToggle}
              color={C.muted} fontSize="1rem" fontWeight={600}
              fontFamily="'Cabinet Grotesk',sans-serif"
              px="0.5rem" py="1rem"
              borderBottom="1px solid rgba(255,255,255,0.04)"
              textDecoration="none"
              _hover={{ color:C.accent, pl:"1rem", textDecoration:"none" }}
              transition="all 0.2s">{l.label}</Box>
          ))}
          <Button as="a" href="/users/login" mt="1rem"
            bgGradient="linear(135deg,#304ecf,#4a9eff)" color="white"
            fontFamily="'Cabinet Grotesk',sans-serif" fontWeight={700} borderRadius="8px">
            Get Started
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default Navbar;