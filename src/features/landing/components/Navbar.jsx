import { 
  Box, 
  Flex, 
  Text, 
  Button, 
  HStack, 
  VStack, 
  IconButton, 
  useDisclosure 
} from "@chakra-ui/react";

import { 
  HamburgerIcon, 
  CloseIcon 
} from "@chakra-ui/icons";

import { useEffect, useState } from "react";

import { C } from "./tokens";

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { label: "About",    href: "#about"    },
    { label: "Services", href: "#services" },
    { label: "Features", href: "#features" },
  ];

  return (
    <Box
      className="Nav-bg"
      position="fixed" top={0} left={0} right={0} zIndex={2000}
      bg={{
        base: "rgba(255,255,255,0.96)",
        md: scrolled ? "rgba(255,255,255,0.96)" : "transparent"
      }}
      backdropFilter={scrolled ? "blur(20px)" : "none"}
      borderBottom={scrolled ? "1px solid rgba(59,110,240,0.10)" : "none"}
      boxShadow={scrolled ? "0 8px 40px rgba(59,110,240,0.12)" : "none"}
      transition="all 0.4s cubic-bezier(0.4,0,0.2,1)"
      px={{ base: "6%", md: "6%" }} py="1rem"
    >
      <Flex align="center" justify="space-between">
        {/* Logo */}
        <Text
          fontFamily="'Sora',sans-serif"
          fontSize={{ base: "1.4rem", md: "1.6rem" }}
          fontWeight={900} color={C.text} letterSpacing="-1px" cursor="pointer"
        >
          Data
          <Text as="span" bgGradient="linear(135deg,#2251cc,#3b6ef0)" bgClip="text">
            Ere
          </Text>
        </Text>

        {/* Desktop links */}
        <HStack spacing="2.5rem" display={{ base: "none", md: "flex" }}>
          {links.map((l) => (
            <Box
              key={l.label} as="a" href={l.href} position="relative"
              color={C.muted} fontSize="0.88rem" fontWeight={600}
              fontFamily="'Sora',sans-serif" letterSpacing="0.02em"
              textDecoration="none" transition="color 0.2s"
              _hover={{ color: C.text, textDecoration: "none" }}
              sx={{
                "&::after": {
                  content: '""', position: "absolute", bottom: "-3px", left: 0,
                  width: 0, height: "1px", bg: "#3b6ef0",
                  transition: "width 0.3s ease", display: "block",
                },
                "&:hover::after": { width: "100%" },
              }}
            >
              {l.label}
            </Box>
          ))}
        </HStack>

        {/* CTA buttons */}
        <Flex gap={3} align="center">
          <Button
            as="a" href="/users/login"
            display={{ base: "none", md: "inline-flex" }}
            bgGradient="linear(135deg,#2251cc,#3b6ef0)"
            color="white" fontFamily="'Sora',sans-serif"
            fontSize="0.85rem" fontWeight={700}
            px="1.4rem" py="0.45rem" borderRadius="8px"
            boxShadow="0 4px 20px rgba(59,110,240,0.25)"
            _hover={{ 
              transform: "translateY(-2px)", 
              boxShadow: "0 8px 30px rgba(59,110,240,0.38)" 
            }}
            transition="all 0.25s"
          >
            Get Started
          </Button>
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={onToggle}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            variant="ghost" color={C.text} fontSize="1.1rem"
            _hover={{ bg: "rgba(59,110,240,0.08)" }}
            aria-label="menu"
          />
        </Flex>
      </Flex>

      {/* Mobile menu */}
      {isOpen && (
        <VStack
          spacing={0} mt="1rem" pb="1.5rem"
          borderTop="1px solid rgba(59,110,240,0.07)"
          align="stretch" display={{ base: "flex", md: "none" }}
        >
          {links.map((l) => (
            <Box
              key={l.label} as="a" href={l.href} onClick={onToggle}
              color={C.muted} fontSize="1rem" fontWeight={600}
              fontFamily="'Sora',sans-serif"
              px="0.5rem" py="1rem"
              borderBottom="1px solid rgba(59,110,240,0.04)"
              textDecoration="none"
              _hover={{ color: C.accent, pl: "1rem", textDecoration: "none" }}
              transition="all 0.2s"
            >
              {l.label}
            </Box>
          ))}
          <Button
            as="a" href="/users/login" mt="1rem"
            bgGradient="linear(135deg,#2251cc,#3b6ef0)"
            color="white" fontFamily="'Sora',sans-serif"
            fontWeight={700} borderRadius="8px"
          >
            Get Started
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default Navbar;