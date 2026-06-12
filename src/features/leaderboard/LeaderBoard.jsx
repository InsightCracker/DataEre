import {
  Box, Flex, Text, Input, InputGroup, InputLeftElement,
  SimpleGrid, Spinner, Center,
} from "@chakra-ui/react";
import { LuSearch, LuTrendingUp, LuTrendingDown, LuMinus } from "react-icons/lu";
import { FaTrophy } from "react-icons/fa";
import { FaFire, FaBoltLightning, FaRankingStar, FaUsers } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { keyframes } from "@emotion/react";
import { getLeaderboard, getTopics } from "../../util/api";
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

const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const Avatar = ({ name, size = 36, index = 0 }) => {
  const c = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <Flex w={`${size}px`} h={`${size}px`} borderRadius="full" flexShrink={0}
      align="center" justify="center" bg={c.bg} color={c.color}
      fontWeight={600} fontSize={size > 44 ? "16px" : "13px"}>
      {initials(name)}
    </Flex>
  );
};

const StatCard = ({ label, value, icon, delay = "0s" }) => (
  <Box
    bg={C.surface} borderRadius="14px" p="14px 16px"
    border={`1px solid ${C.border}`}
    style={{ animation: `slideUp 0.4s ease ${delay} both` }}
  >
    <Flex align="center" gap="7px" mb="6px">
      <Box color={C.accent} opacity={0.7}>{icon}</Box>
      <Text fontSize="0.7rem" color={C.muted} fontFamily="'Sora',sans-serif"
        fontWeight={700} letterSpacing="0.05em" textTransform="uppercase">
        {label}
      </Text>
    </Flex>
    <Text fontSize="1.35rem" fontWeight={800} color={C.text}
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
        textAlign="center" maxW="80px" noOfLines={1}>
        {user.username}
      </Text>
      <Text fontSize="0.72rem" color={C.muted}>{user.totalCorrect} XP</Text>
      <Flex w="76px" h={`${height}px`} bg={c.bg} border={`1px solid ${c.border}`}
        borderRadius="10px 10px 0 0" align="center" justify="center" fontSize="1.2rem">
        {medals[rank]}
      </Flex>
    </Flex>
  );
};

const LeaderBoard = () => {
  const { userId, username } = useAuth();

  const [data, setData]                 = useState([]);
  const [topics, setTopics]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [topicLoading, setTopicLoading] = useState(false);
  const [activeTopic, setActiveTopic]   = useState("overall");
  const [filter, setFilter]             = useState("totalCorrect");
  const [search, setSearch]             = useState("");

  useEffect(() => {
    getTopics()
      .then((res) => { if (res.success) setTopics(res.data); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setTopicLoading(true);
    getLeaderboard(activeTopic)
      .then((res) => { if (res.success) setData(res.data); })
      .catch(console.error)
      .finally(() => { setLoading(false); setTopicLoading(false); });
  }, [activeTopic]);

  const isYou = (u) => String(u._id) === String(userId) || u.username === username;

  const sorted   = [...data].sort((a, b) => b[filter] - a[filter]);
  const filtered = sorted.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const topCorrect = sorted[0]?.totalCorrect ?? 0;
  const myRank = sorted.findIndex((u) => isYou(u)) + 1;
  const yourXP = data.find((u) => isYou(u))?.totalCorrect ?? 0;

  const podium = sorted.slice(0, 3);
  const podiumOrder = podium.length >= 2 ? [podium[1], podium[0], podium[2]] : podium;
  const podiumRanks   = [2, 1, 3];
  const podiumHeights = [60, 80, 44];

  const ALL_TOPICS = ["overall", ...topics];

  const formattedTopic = activeTopic.charAt(0).toUpperCase() + activeTopic.slice(1);
  

  return (
    <Box minH="100vh" bg={C.bg}>

      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes rowIn {
          from { opacity:0; transform:translateX(-8px); }
          to   { opacity:1; transform:translateX(0); }
        }
        .topic-scroll::-webkit-scrollbar { display: none; }
        .topic-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <Sidebar />

      <Box mx="auto" px={{ base: "1rem", md: "2rem" }} py="2rem" ml={{ base: 0, lg: "240px" }} pb={{ base: "5rem", lg: 0}}>

        {/* Header */}
        <Flex align="center" justify="center" gap="10px" mb="0.3rem"
          style={{ animation: "slideUp 0.4s ease both" }}>
          <FaTrophy color="#ef9f27" size={22} />
          <Text 
            fontSize={{ base: "1.5rem", md: "1.8rem" }}
            fontWeight={800} color={C.text} letterSpacing="-0.5px"
          >
            Hall of Fame
          </Text>
        </Flex>
        <Text fontSize="0.85rem" color={C.muted} textAlign="center" mb="1.8rem"
          style={{ animation: "slideUp 0.4s ease 0.05s both" }}>
          {activeTopic === "overall"
            ? "Overall rankings across all skills"
            : `Rankings for ${formattedTopic}`}
        </Text>

        {loading ? (
          <Center py="4rem"><Spinner color={C.accent} size="lg" /></Center>
        ) : (
          <>
            {/* Stats */}
            <SimpleGrid columns={{ base: 2, md: 4 }} gap="12px" mb="1.8rem">
              <StatCard 
                label="DataErians" 
                value={data.length} 
                icon={<FaUsers size={13} />} delay="0.05s"
              />
              <StatCard 
                label="Top XP Earned"       
                value={topCorrect}                
                icon={<FaTrophy size={12} />} delay="0.10s" 
              />
              <StatCard 
                label="Your XP"      
                value={yourXP}                    
                icon={<FaBoltLightning size={12} />} delay="0.15s" 
              />
              <StatCard 
                label="Your Rank"    
                value={myRank ? `#${myRank}` : "—"} 
                icon={<FaRankingStar size={12} />} delay="0.20s" 
              />
            </SimpleGrid>

            {/* Topic tabs */}
            <Box mb="1.2rem" style={{ animation: "slideUp 0.4s ease 0.1s both" }}>
              <Text fontSize="0.72rem" fontWeight={700} color={C.muted}
                letterSpacing="0.06em" textTransform="uppercase"
                mb="0.6rem">
                Filter by Data Skill
              </Text>
              <Flex gap="8px" overflowX="auto" pb="4px" className="topic-scroll">
                {ALL_TOPICS.map((t) => (
                  <Box key={t} as="button"
                    onClick={() => { setActiveTopic(t); setSearch(""); }}
                    flexShrink={0} px="14px" py="7px" borderRadius="99px"
                    fontSize="0.8rem" fontWeight={600} cursor="pointer" transition="all 0.15s"
                    bg={activeTopic === t ? C.accent : C.card}
                    color={activeTopic === t ? "white" : C.muted}
                    border={`1px solid ${activeTopic === t ? C.accent : C.border}`}
                    _hover={{ bg: activeTopic === t ? "#2251cc" : "rgba(59,110,240,0.06)" }}
                    textTransform={t === "overall" ? "capitalize" : "none"}>
                    {t === "overall" ? "🌐 Overall" : t}
                  </Box>
                ))}
              </Flex>
            </Box>

            {/* Podium */}
            {!topicLoading && podium.length >= 1 && (
              <Box bg={C.card} borderRadius="20px" border={`1px solid ${C.border}`}
                boxShadow="0 4px 24px rgba(59,110,240,0.08)"
                p="1.5rem 1.5rem 0" mb="1.5rem" overflow="hidden"
                style={{ animation: "slideUp 0.4s ease 0.15s both" }}>
                <Text fontSize="0.72rem" fontWeight={700} color={C.muted}
                  letterSpacing="0.08em" textTransform="uppercase"
                   textAlign="center" mb="1.5rem">
                  Top 3 — <span style={{ color: "#3b6ef0" }}>
                    {activeTopic === "overall" ? "Overall" : activeTopic}
                  </span>
                </Text>
                <Flex align="flex-end" justify="center" gap="16px">
                  {podiumOrder.map((u, i) =>
                    u ? (
                      <PodiumBlock key={u._id} user={u}
                        rank={podiumRanks[i]} height={podiumHeights[i]} index={i} />
                    ) : <Box key={i} />
                  )}
                </Flex>
              </Box>
            )}

            {/* Search */}
            <InputGroup mb="1.2rem">
              <InputLeftElement pointerEvents="none" mt="1px">
                <LuSearch color={C.dim} size={15} />
              </InputLeftElement>
              <Input
                placeholder="Search dataerian..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                bg={C.card} border={`1px solid ${C.border}`}
                borderRadius="12px" color={C.text} fontSize="0.9rem"
                _placeholder={{ color: C.dim }}
                _focus={{ borderColor: C.accent, boxShadow: "0 0 0 3px rgba(59,110,240,0.12)" }}
              />
            </InputGroup>

            {/* Table */}
            <Box bg={C.card} borderRadius="20px" border={`1px solid ${C.border}`}
              boxShadow="0 4px 24px rgba(59,110,240,0.08)" overflow="hidden"
              position="relative">

              {topicLoading && (
                <Center position="absolute" inset={0} bg="rgba(255,255,255,0.7)" zIndex={2} borderRadius="20px">
                  <Spinner color={C.accent} />
                </Center>
              )}

              {/* ✅ Table header: #  Player  XP */}
              <Flex px="16px" py="10px" borderBottom={`1px solid ${C.border}`}>
                <Text w="36px" fontSize="0.7rem" color={C.dim} fontWeight={600}
                  textTransform="uppercase" letterSpacing="0.06em">#</Text>
                <Text flex={1} fontSize="0.7rem" color={C.dim} fontWeight={600}
                  textTransform="uppercase" letterSpacing="0.06em">Dataerians</Text>
                <Text w="80px" fontSize="0.7rem" color={C.dim} fontWeight={600}
                  textTransform="uppercase" letterSpacing="0.06em" textAlign="right">XP</Text>
              </Flex>

              {filtered.length === 0 ? (
                <Box py="3rem" textAlign="center">
                  <LuSearch size={24} color={C.dim} style={{ margin: "0 auto 8px" }} />
                  <Text fontSize="0.88rem" color={C.dim}>
                    {data.length === 0
                      ? `No scores recorded for ${activeTopic === "overall" ? "any topic" : activeTopic} yet`
                      : "No players match your search"}
                  </Text>
                </Box>
              ) : (
                filtered.map((u, i) => {
                  const globalRank = sorted.indexOf(u) + 1;
                  const you        = isYou(u);
                  const medal      = globalRank <= 3 ? ["🥇","🥈","🥉"][globalRank - 1] : null;

                  return (
                    <Flex key={u._id} px="16px" py="12px" align="center"
                      borderBottom={i < filtered.length - 1 ? `1px solid ${C.border}` : "none"}
                      bg={you ? "rgba(59,110,240,0.06)" : "transparent"}
                      _hover={{ bg: you ? "rgba(59,110,240,0.10)" : "rgba(59,110,240,0.03)" }}
                      transition="background 0.12s"
                      style={{ animation: `rowIn 0.3s ease ${i * 0.04}s both` }}>

                      {/* Rank */}
                      <Box w="36px">
                        {medal
                          ? <Text fontSize="1rem">{medal}</Text>
                          : <Text fontSize="0.8rem" color={C.dim} fontWeight={600}>{globalRank}</Text>}
                      </Box>

                      {/* Player */}
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

                      {/* ✅ XP column */}
                      <Text w="80px" textAlign="right" fontSize="0.88rem"
                        fontWeight={700} color={C.accent} >
                        {u.totalCorrect} XP
                      </Text>

                    </Flex>
                  );
                })
              )}
            </Box>

            <Text fontSize="0.75rem" color={C.dim} textAlign="center" mt="1.2rem">
              Rankings update after each session ·{" "}
              {activeTopic === "overall"
                ? "Showing all skills combined"
                : `Showing ${formattedTopic} only`}
            </Text>
          </>
        )}
      </Box>

      <BottomNav />
    </Box>
  );
};

export default LeaderBoard;