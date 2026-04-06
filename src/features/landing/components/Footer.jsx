import { Box, Flex, Text, SimpleGrid, Link, HStack } from "@chakra-ui/react";
import { FaLinkedin, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <Box
      bg="#050812"
      borderTop="1px solid rgba(19, 44, 207, 0.2)"
      pt={{ base: "3rem", md: "4rem" }}
      pb={{ base: "2rem", md: "2.5rem" }}
      px={{ base: "1.5rem", md: "5%" }}
      color="white"
    >
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3 }}
        spacing={{ base: "2.5rem", md: "3rem" }}
        maxW="1100px"
        mx="auto"
        mb="3rem"
      >
        {/* Brand */}
        <Box>
          <Text fontSize="1.5rem" fontWeight="800" mb="0.8rem">
            Data<Text as="span" color="#4a9eff">Ere</Text>
          </Text>
          <Text fontSize="0.9rem" color="rgba(255,255,255,0.55)" lineHeight="1.7" maxW="240px">
            Your complete data learning hub — quizzes, converters, and reports in one place.
          </Text>
          <HStack spacing="1rem" mt="1.2rem">
            {/* TODO: Replace # with actual social media URLs */}
          {[FaInstagram, FaXTwitter, FaLinkedin, FaTiktok].map((Icon, i) => (
              <Box
                key={i}
                as="a"
                href="#"
                w="36px"
                h="36px"
                borderRadius="full"
                bg="rgba(74,158,255,0.1)"
                border="1px solid rgba(74,158,255,0.2)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                transition="all 0.2s"
                _hover={{ bg: "rgba(74,158,255,0.2)", transform: "translateY(-2px)" }}
              >
                <Icon size={15} color="#4a9eff" />
              </Box>
            ))}
          </HStack>
        </Box>

        {/* Quick Links */}
        <Box>
          <Text fontWeight="700" fontSize="0.95rem" mb="1.2rem" color="white">
            Quick Links
          </Text>
          <Flex direction="column" gap="0.7rem">
            {[
              { label: "Home", href: "#hero" },
              { label: "About Us", href: "#about" },
              { label: "Services", href: "#services" },
              { label: "Features", href: "#features" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                fontSize="0.9rem"
                color="rgba(255,255,255,0.55)"
                textDecoration="none"
                _hover={{ color: "#4a9eff", textDecoration: "none" }}
                transition="color 0.2s"
              >
                {link.label}
              </Link>
            ))}
          </Flex>
        </Box>

        {/* Contact */}
        <Box>
          <Text fontWeight="700" fontSize="0.95rem" mb="1.2rem" color="white">
            Contact
          </Text>
          <Flex direction="column" gap="0.7rem">
            <Text fontSize="0.9rem" color="rgba(255,255,255,0.55)">
              Have questions or feedback?
            </Text>
            {/* TODO: Replace with actual company email */}
            <Link
              href="mailto:hello@dataere.com"
              fontSize="0.9rem"
              color="#4a9eff"
              textDecoration="none"
              _hover={{ textDecoration: "underline" }}
            >
              hello@dataere.com
            </Link>
          </Flex>
        </Box>
      </SimpleGrid>

      {/* Bottom bar */}
      <Box
        borderTop="1px solid rgba(255,255,255,0.08)"
        pt="1.5rem"
        textAlign="center"
      >
        <Text fontSize="0.82rem" color="rgba(255,255,255,0.35)">
          © 2026 DataEre. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
};

export default Footer;