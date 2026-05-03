import { useEffect, useState } from "react";
import axios from "axios";
import { Box, VStack, Text, Heading, Badge } from "@chakra-ui/react";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/leaderboard");
      setLeaders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box p={5} bg="gray.100" borderRadius="lg" w="400px" mx="auto" mt={10}>
      <Heading mb={5} textAlign="center">
        DataXO Leaderboard
      </Heading>
      <VStack spacing={3} align="stretch">
        {leaders.map((user, idx) => (
          <Box
            key={user._id}
            p={3}
            bg={idx === 0 ? "yellow.200" : idx === 1 ? "gray.300" : idx === 2 ? "orange.200" : "white"}
            borderRadius="md"
            shadow="md"
            display="flex"
            justifyContent="space-between"
          >
            <Text fontWeight="bold">
              {idx + 1}. {user.username}
            </Text>
            <Text>
              {user.score}{" "}
              {idx === 0 ? <Badge colorScheme="yellow">🥇</Badge> :
               idx === 1 ? <Badge colorScheme="gray">🥈</Badge> :
               idx === 2 ? <Badge colorScheme="orange">🥉</Badge> : null}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Leaderboard;
