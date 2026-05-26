import { Box, Flex, Text, HStack, SimpleGrid } from "@chakra-ui/react";
import { FaLinkedin, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { C } from "./Tokens";

const Footer = () => {
  const socials = [FaInstagram, FaXTwitter, FaLinkedin, FaTiktok];

  const quickLinks = [
    { label: "Home",     href: "#hero"     },
    { label: "About Us", href: "#about"    },
    { label: "Services", href: "#services" },
    { label: "Features", href: "#features" },
  ];

  return (
    <Box
      bg={C.bg0}
      borderTop="1px solid rgba(59,110,240,0.08)"
      pt={{ base: "4rem", md: "5rem" }}
      pb={{ base: "2.5rem", md: "3rem" }}
      px={{ base: "1.5rem", md: "6%" }}
    >
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3 }}
        spacing={{ base: "3rem", md: "4rem" }}
        maxW="1100px" mx="auto" mb="4rem"
      >
        {/* Brand */}
        <Box>
          <Text
            fontFamily="'Sora',sans-serif"
            fontSize="1.6rem" fontWeight={900} mb="1rem" letterSpacing="-1px" color={C.text}
          >
            Data<Text as="span" color={C.accent}>Ere</Text>
          </Text>
          <Text
            fontFamily="'Sora',sans-serif"
            fontSize="0.88rem" color={C.muted} lineHeight={1.8}
            maxW="240px" mb="1.5rem"
          >
            Your complete data learning hub; quizzes, converters, and reports in one place.
          </Text>
          <HStack spacing="0.7rem">
            {socials.map((Icon, i) => (
              <Box
                key={i} as="a" href="#"
                w="36px" h="36px" borderRadius="10px"
                bg="rgba(74,158,255,0.07)" border="1px solid rgba(59,110,240,0.10)"
                display="flex" alignItems="center" justifyContent="center"
                transition="all 0.2s"
                _hover={{
                  bg: "rgba(59,110,240,0.14)",
                  transform: "translateY(-3px)",
                  borderColor: "rgba(59,110,240,0.35)",
                }}
              >
                <Icon size={14} color={C.accent} />
              </Box>
            ))}
          </HStack>
        </Box>

        {/* Quick Links */}
        <Box>
          <Text
            fontFamily="'Sora',sans-serif"
            fontSize="0.85rem" fontWeight={800} mb="1.5rem"
            color={C.text} letterSpacing="0.08em" textTransform="uppercase"
          >
            Quick Links
          </Text>
          <Flex direction="column" gap="0.85rem">
            {quickLinks.map((l) => (
              <Box
                key={l.label} as="a" href={l.href}
                fontFamily="'Sora',sans-serif"
                fontSize="0.9rem" color={C.muted}
                textDecoration="none" fontWeight={500}
                transition="color 0.2s, padding-left 0.2s"
                _hover={{ color: C.accent, pl: "4px", textDecoration: "none" }}
              >
                {l.label}
              </Box>
            ))}
          </Flex>
        </Box>

        {/* Contact */}
        <Box>
          <Text
            fontFamily="'Sora',sans-serif"
            fontSize="0.85rem" fontWeight={800} mb="1.5rem"
            color={C.text} letterSpacing="0.08em" textTransform="uppercase"
          >
            Contact
          </Text>
          <Text
            fontFamily="'Sora',sans-serif"
            fontSize="0.88rem" color={C.muted} mb="0.8rem" lineHeight={1.7}
          >
            Have questions or feedback? We'd love to hear from you.
          </Text>
          <Box
            as="a" href="mailto:hello@dataere.com"
            fontFamily="'Sora',sans-serif"
            fontSize="0.9rem" color={C.accent} fontWeight={600}
            textDecoration="none"
            _hover={{ textDecoration: "underline" }}
          >
            hello@dataere.com
          </Box>
        </Box>
      </SimpleGrid>

      {/* Bottom bar */}
      <Box
        borderTop="1px solid rgba(59,110,240,0.07)" pt="2rem"
        display="flex" flexWrap="wrap"
        justifyContent="space-between" alignItems="center"
        gap="1rem" maxW="1100px" mx="auto"
      >
        <Text fontFamily="'Sora',sans-serif" fontSize="0.8rem" color={C.dim}>
          © 2026 DataEre. All rights reserved.
        </Text>
        <HStack spacing="1.5rem">
          {["Privacy Policy", "Terms of Service"].map((t) => (
            <Box
              key={t} as="a" href="#"
              fontFamily="'Sora',sans-serif"
              fontSize="0.8rem" color={C.dim}
              textDecoration="none"
              _hover={{ color: C.muted, textDecoration: "none" }}
              transition="color 0.2s"
            >
              {t}
            </Box>
          ))}
        </HStack>
      </Box>
    </Box>
  );
};

export default Footer;