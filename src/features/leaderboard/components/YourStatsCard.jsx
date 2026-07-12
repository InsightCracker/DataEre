import { useState, useEffect } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { FaBoltLightning, FaRankingStar } from "react-icons/fa6";

import { getMyRank } from "../../../shared/utils/api";

const C = {
  card:   "#ffffff",
  accent: "#3b6ef0",
  text:   "#111827",
  muted:  "#4b5563",
  border: "rgba(59,110,240,0.12)",
};

const StatCard = ({ label, value, icon, delay = "0s" }) => (
  <Box
    bg={C.card} borderRadius="14px" p="14px 16px"
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

const YourStatsCard = ({ activeTopic = "overall", onLoaded }) => {
  const [myStats, setMyStats] = useState({ rank: null, totalCorrect: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getMyRank(activeTopic)
      .then((res) => {
        if (cancelled) return;
        if (res.success) {
          const next = { rank: res.data.rank, totalCorrect: res.data.totalCorrect };
          setMyStats(next);
          onLoaded?.(next);
        } else {
          setError(res.message || "Failed to load your stats");
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("YourStatsCard fetch error:", err);
        setError("Failed to load your stats");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [activeTopic]);

  const xpDisplay   = loading ? "…" : error ? "—" : myStats.totalCorrect;
  const rankDisplay = loading ? "…" : error ? "—" : (myStats.rank ? `#${myStats.rank}` : "—");

  return (
    <>
      <StatCard
        label="Your XP"
        value={xpDisplay}
        icon={<FaBoltLightning size={12} />}
        delay="0.15s"
      />
      <StatCard
        label="Your Rank"
        value={rankDisplay}
        icon={<FaRankingStar size={12} />}
        delay="0.20s"
      />
    </>
  );
};

export default YourStatsCard;