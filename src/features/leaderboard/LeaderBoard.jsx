import {
  Box, 
  Flex, 
  Text, 
  Input, 
  InputGroup, 
  InputLeftElement,
  SimpleGrid, 
  Spinner, 
  Center,
} from "@chakra-ui/react";
import { LuSearch, LuTrendingUp, LuTrendingDown, LuMinus } from "react-icons/lu";
import { FaTrophy } from "react-icons/fa";
import { useState, useEffect } from "react";
import { keyframes } from "@emotion/react";
import { getLeaderboard } from "../../util/api";
import { useAuth } from "../../util/AuthContext";
import Sidebar from "../../util/Sidebar";
import BottomNav from "../../util/BottomNav";

const slideUp = keyframes`
  from { opacity:0; transform:translateY(12px); }
  to   { opacity:1; transform:translateY(0); }
`;

const C = {
  bg:     "#f0f4ff",
  card:   "#ffffff",
  accent: "#3b6ef0",
  text:   "#111827",
  muted:  "#4b5563",
  dim:    "#9ca3af",
  border: "rgba(59,110,240,0.12)",
};

const AVATAR_COLORS = [
  { bg: "#e1f5ee", color: "#0f6e56" },
  { bg: "#eeedfe", color: "#3c3489" },
  { bg: "#faece7", color: "#993c1d" },
  { bg: "#fbeaf0", color: "#72243e" },
  { bg: "#e6f1fb", color: "#185fa5" },
];

const FILTERS = [
  { key: "totalCorrect",  label: "Total correct" },
  { key: "bestScore",     label: "Best score" },
  { key: "totalQuizzes",  label: "Quizzes played" },
  { key: "avgScore",      label: "Avg score" },
];

const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const Avatar = ({ name, size = 36, index = 0 }) => {
  const c = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <Flex
      w={`${size}px`} h={`${size}px`} borderRadius="full" flexShrink={0}
      align="center" justify="center"
      bg={c.bg} color={c.color}
      fontWeight={600} fontSize={size > 44 ? "16px" : "13px"}
    >
      {initials(name)}
    </Flex>
  );
};

const StatCard = ({ label, value, delay = "0s" }) => (
  <Box
    bg="rgba(59,110,240,0.06)" borderRadius="14px"
    p="14px 18px" textAlign="center"
    style={{ animation: `${slideUp} 0.4s ease ${delay} both` }}
  >
    <Text fontSize="0.75rem" color={C.muted} fontFamily="'Sora',sans-serif"
      fontWeight={600} letterSpacing="0.04em" textTransform="uppercase" mb="4px">
      {label}
    </Text>
    <Text fontSize="1.5rem" fontWeight={800} color={C.text}
      fontFamily="'Sora',sans-serif" letterSpacing="-0.5px">
      {value}
    </Text>
  </Box>
);


const PodiumBlock = ({ user, rank, height, index }) => {
  if (!user) return <Box />;
  const medals = { 1: "🥇", 2: "🥈", 3: "🥉" };
  const colors = {
    1: { bg: "#faeeda", border: "#ef9f27" },
    2: { bg: "#e6f1fb", border: "#85b7eb" },
    3: { bg: "#faece7", border: "#f0997b" },
  };
  const c = colors[rank];
  return (
    <Flex flexDir="column" align="center" gap="8px"
      style={{ animation: `${slideUp} 0.5s cubic-bezier(0.34,1.3,0.64,1) ${index * 0.1}s both` }}>
      <Avatar name={user.username} size={rank === 1 ? 56 : 44} index={index} />
      <Text fontSize="0.8rem" fontWeight={700} color={C.text}
        fontFamily="'Sora',sans-serif" textAlign="center" maxW="80px" noOfLines={1}>
        {user.username}
      </Text>
      {/* top score subheading removed */}
      <Flex
        w="76px" h={`${height}px`}
        bg={c.bg} border={`1px solid ${c.border}`}
        borderRadius="10px 10px 0 0"
        align="center" justify="center"
        fontSize="1.2rem"
      >
        {medals[rank]}
      </Flex>
    </Flex>
  );
};

const LeaderBoard = () => {
  const { userId, username } = useAuth();
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("totalCorrect");
  const [search, setSearch]   = useState("");

  useEffect(() => {
    getLeaderboard()
      .then((res) => { if (res.success) setData(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...data].sort((a, b) => b[filter] - a[filter]);

  const filtered = sorted.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const myRank       = sorted.findIndex((u) => String(u._id) === String(userId)) + 1;
  const topCorrect   = sorted[0]?.totalCorrect ?? 0;
  const topScore     = sorted[0]?.avgScore ?? 0;

  const podium       = sorted.slice(0, 3);
  const podiumOrder  = podium.length >= 2
    ? [podium[1], podium[0], podium[2]]
    : podium;
  const podiumRanks   = [2, 1, 3];
  const podiumHeights = [60, 80, 44];

  const getDisplayVal = (u) => {
    if (filter === "avgScore")     return u.avgScore + "%";
    if (filter === "bestScore")    return u.bestScore + "%";
    if (filter === "totalQuizzes") return u.totalQuizzes;
    if (filter === "totalCorrect") return u.totalCorrect;
  };

  const getTrend = (rank) => {
    if (rank === 1) return { icon: <LuTrendingUp size={12} />, bg: "#eaf3de", color: "#3b6d11" };
    if (rank <= 3)  return { icon: <LuTrendingUp size={12} />, bg: "#eaf3de", color: "#3b6d11" };
    if (rank > Math.ceil(sorted.length * 0.7))
      return { icon: <LuTrendingDown size={12} />, bg: "#fcebeb", color: "#a32d2d" };
    return { icon: <LuMinus size={12} />, bg: "rgba(0,0,0,0.06)", color: C.dim };
  };

  const isYou = (u) => String(u._id) === String(userId) || u.username === username;

  return (
    <Box minH="100vh" bg={C.bg} px={{ base: "1rem", md: "2rem" }}
      py="2rem" fontFamily="'DM Sans', sans-serif">

      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes rowIn {
          from { opacity:0; transform:translateX(-8px); }
          to   { opacity:1; transform:translateX(0); }
        }
      `}</style>

      <Sidebar />

      <Box maxW="720px" mx="auto">

        <Flex align="center" justify="center" gap="10px" mb="0.5rem"
          style={{ animation: "slideUp 0.4s ease both" }}>
          <FaTrophy color="#ef9f27" size={22} />
          <Text fontFamily="'Sora',sans-serif" fontSize={{ base:"1.5rem", md:"1.8rem" }}
            fontWeight={800} color={C.text} letterSpacing="-0.5px">
            Leaderboard
          </Text>
        </Flex>

        {loading ? (
          <Center py="4rem"><Spinner color={C.accent} size="lg" /></Center>
        ) : (
          <>
            <SimpleGrid columns={{ base: 2, md: 4 }} gap="12px" mb="2rem">
              <StatCard label="Players"    value={data.length}       delay="0.05s" />
              <StatCard label="Top XP" value={topCorrect}       delay="0.10s" />
              <StatCard label="Top avg"    value={topScore + "%"}    delay="0.15s" />
              <StatCard label="Your rank"  value={myRank ? `#${myRank}` : "—"} delay="0.20s" />
            </SimpleGrid>

            {podium.length >= 1 && (
              <Box bg={C.card} borderRadius="20px" border={`1px solid ${C.border}`}
                boxShadow="0 4px 24px rgba(59,110,240,0.08)"
                p="2rem 1.5rem 0" mb="1.5rem" overflow="hidden">
                <Text fontSize="0.72rem" fontWeight={700} color={C.muted}
                  letterSpacing="0.08em" textTransform="uppercase"
                  fontFamily="'Sora',sans-serif" textAlign="center" mb="1.5rem">
                  Top 3
                </Text>
                <Flex align="flex-end" justify="center" gap="16px">
                  {podiumOrder.map((u, i) =>
                    u ? (
                      <PodiumBlock
                        key={u._id} user={u}
                        rank={podiumRanks[i]}
                        height={podiumHeights[i]}
                        index={i}
                      />
                    ) : <Box key={i} />
                  )}
                </Flex>
              </Box>
            )}

            <Flex gap="8px" mb="1rem" flexWrap="wrap">
              {FILTERS.map((f) => (
                <Box
                  key={f.key} as="button"
                  onClick={() => setFilter(f.key)}
                  px="14px" py="6px" borderRadius="99px" fontSize="0.8rem"
                  fontWeight={600} cursor="pointer" transition="all 0.15s"
                  bg={filter === f.key ? C.accent : C.card}
                  color={filter === f.key ? "white" : C.muted}
                  border={`1px solid ${filter === f.key ? C.accent : C.border}`}
                  _hover={{ bg: filter === f.key ? "#2251cc" : "rgba(59,110,240,0.06)" }}
                >
                  {f.label}
                </Box>
              ))}
            </Flex>

            <InputGroup mb="1.2rem">
              <InputLeftElement pointerEvents="none" mt="1px">
                <LuSearch color={C.dim} size={15} />
              </InputLeftElement>
              <Input
                placeholder="Search players..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                bg={C.card} border={`1px solid ${C.border}`}
                borderRadius="12px" color={C.text} fontSize="0.9rem"
                _placeholder={{ color: C.dim }}
                _focus={{ borderColor: C.accent, boxShadow: "0 0 0 3px rgba(59,110,240,0.12)" }}
              />
            </InputGroup>

            <Box bg={C.card} borderRadius="20px" border={`1px solid ${C.border}`}
              boxShadow="0 4px 24px rgba(59,110,240,0.08)" overflow="hidden">

              {/* ── table header now includes Total Correct column ── */}
              <Flex px="16px" py="10px" borderBottom={`1px solid ${C.border}`}>
                <Text w="36px" fontSize="0.7rem" color={C.dim} fontWeight={600}
                  textTransform="uppercase" letterSpacing="0.06em">#</Text>
                <Text flex={1} fontSize="0.7rem" color={C.dim} fontWeight={600}
                  textTransform="uppercase" letterSpacing="0.06em">Player</Text>
                <Text w="90px" fontSize="0.7rem" color={C.dim} fontWeight={600}
                  textTransform="uppercase" letterSpacing="0.06em">Correct</Text>
              </Flex>

              {filtered.length === 0 ? (
                <Box py="3rem" textAlign="center">
                  <LuSearch size={24} color={C.dim} style={{ margin: "0 auto 8px" }} />
                  <Text fontSize="0.88rem" color={C.dim}>No players match your search</Text>
                </Box>
              ) : (
                filtered.map((u, i) => {
                  const globalRank = sorted.indexOf(u) + 1;
                  const you   = isYou(u);
                  const medal = globalRank === 1 ? "🥇" : globalRank === 2 ? "🥈" : globalRank === 3 ? "🥉" : null;
                  const trend = getTrend(globalRank);
                  const displayVal = getDisplayVal(u);

                  return (
                    <Flex
                      key={u._id} px="16px" py="12px" align="center"
                      borderBottom={i < filtered.length - 1 ? `1px solid ${C.border}` : "none"}
                      bg={you ? "rgba(59,110,240,0.06)" : "transparent"}
                      _hover={{ bg: you ? "rgba(59,110,240,0.10)" : "rgba(59,110,240,0.03)" }}
                      transition="background 0.12s"
                      style={{ animation: `rowIn 0.3s ease ${i * 0.04}s both` }}
                    >
                      <Box w="36px">
                        {medal ? (
                          <Text fontSize="1rem">{medal}</Text>
                        ) : (
                          <Text fontSize="0.8rem" color={C.dim} fontWeight={600}>{globalRank}</Text>
                        )}
                      </Box>

                      <Flex flex={1} align="center" gap="10px">
                        <Avatar name={u.username} size={34} index={sorted.indexOf(u)} />
                        <Flex align="center" gap="6px">
                          <Text fontSize="0.88rem" fontWeight={600} color={C.text}>
                            {u.username}
                          </Text>
                          {you && (
                            <Text fontSize="0.7rem" color={C.accent} fontWeight={600}>(you)</Text>
                          )}
                        </Flex>
                      </Flex>

                      {/* ── Total correct column ── */}
                      <Flex w="90px" align="center">
                        <Text fontSize="0.82rem" fontWeight={700} color={C.accent}>
                          {u.totalCorrect}
                        </Text>
                      </Flex>
                    </Flex>
                  );
                })
              )}
            </Box>

            <Text fontSize="0.75rem" color={C.dim} textAlign="center" mt="1.2rem">
              Rankings update after each quiz · Sorted by total XP.
            </Text>
          </>
        )}
      </Box>

      <BottomNav />
    </Box>
  );
};

export default LeaderBoard;