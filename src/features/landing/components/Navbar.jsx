import { Box, Flex, Text, HStack, Link, Button, IconButton, VStack, useDisclosure } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Features", href: "#features" },
  ];

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="2000"
      bg={scrolled ? "rgba(10, 14, 39, 0.98)" : "rgba(10, 14, 39, 0.85)"}
      backdropFilter="blur(12px)"
      borderBottom="1px solid rgba(19, 44, 207, 0.2)"
      boxShadow={scrolled ? "0 4px 20px rgba(0,0,0,0.3)" : "none"}
      transition="all 0.3s ease"
      px={{ base: "5%", md: "5%" }}
      py={{ base: "1rem", md: "1rem" }}
    >
      <Flex align="center" justify="space-between">
        
        {/* Logo */}
        <Text
          fontSize={{ base: "1.3rem", md: "1.5rem" }}
          fontWeight="800"
          color="white"
          letterSpacing="-0.5px"
          cursor="pointer"
        >
          Data<Text as="span" color="#4a9eff">Ere</Text>
        </Text>

        {/* Desktop Nav Links */}
        <HStack
          spacing="2rem"
          display={{ base: "none", md: "flex" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              color="rgba(255,255,255,0.75)"
              fontSize="0.92rem"
              fontWeight="500"
              textDecoration="none"
              position="relative"
              transition="color 0.2s"
              _hover={{
                color: "#4a9eff",
                textDecoration: "none",
                _after: { width: "100%" }
              }}
              _after={{
                content: '""',
                position: "absolute",
                bottom: "-4px",
                left: "0",
                width: "0%",
                height: "2px",
                bg: "#4a9eff",
                transition: "width 0.3s ease",
                borderRadius: "2px"
              }}
            >
              {link.label}
            </Link>
          ))}
        </HStack>

        {/* Desktop CTA + Mobile Hamburger */}
        <Flex align="center" gap="1rem">
          <Button
            as="a"
            href="/users/login"
            display={{ base: "none", md: "inline-flex" }}
            bg="linear-gradient(135deg, #304ecf, #4a9eff)"
            color="white"
            fontWeight="600"
            fontSize="0.9rem"
            px="1.5rem"
            py="0.5rem"
            borderRadius="full"
            boxShadow="0 4px 15px rgba(19, 44, 207, 0.4)"
            _hover={{
              transform: "translateY(-1px)",
              boxShadow: "0 6px 20px rgba(19, 44, 207, 0.6)",
            }}
            transition="all 0.2s"
          >
            Get Started
          </Button>

          {/* Hamburger - mobile only */}
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={onToggle}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            variant="ghost"
            color="white"
            fontSize="1.2rem"
            _hover={{ bg: "rgba(74, 158, 255, 0.1)" }}
            aria-label="Toggle Navigation"
          />
        </Flex>
      </Flex>

      {/* Mobile Menu */}
      {isOpen && (
        <VStack
          spacing="0"
          mt="1rem"
          pb="1rem"
          borderTop="1px solid rgba(255,255,255,0.08)"
          align="stretch"
          display={{ base: "flex", md: "none" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onToggle}
              color="rgba(255,255,255,0.8)"
              fontSize="1rem"
              fontWeight="500"
              px="0.5rem"
              py="0.9rem"
              borderBottom="1px solid rgba(255,255,255,0.05)"
              textDecoration="none"
              _hover={{ color: "#4a9eff", bg: "rgba(74,158,255,0.05)", textDecoration: "none" }}
              transition="all 0.2s"
            >
              {link.label}
            </Link>
          ))}

          <Button
            as="a"
            href="/users/login"
            mt="1rem"
            bg="linear-gradient(135deg, #304ecf, #4a9eff)"
            color="white"
            fontWeight="600"
            borderRadius="full"
            boxShadow="0 4px 15px rgba(19, 44, 207, 0.4)"
            _hover={{ transform: "translateY(-1px)" }}
          >
            Get Started
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default Navbar;