export const LEVELS = [
  { label: "Intern", minXP: 0, maxXP: 100, color: "#6b96f5", emoji: "🧑‍💻" },
  { label: "Trainee", minXP: 100, maxXP: 250, color: "#3b6ef0", emoji: "🌱" },
  { label: "Beginner", minXP: 250, maxXP: 500, color: "#f59e0b", emoji: "⚡" },
  { label: "Junior", minXP: 500, maxXP: 1000, color: "#10b981", emoji: "📈" },
  { label: "Senior", minXP: 1000, maxXP: 2000, color: "#8b5cf6", emoji: "🔥" },
  { label: "Analytics Expert", minXP: 2000, maxXP: 5000, color: "#fc5ed4", emoji: "💎" },
  { label: "DataEre Legend", minXP: 5000, maxXP: 9999, color: "#ef4444", emoji: "👑" },
];

export const getLevel = (xp) => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return { ...LEVELS[i], index: i };
  }
  return { ...LEVELS[0], index: 0 };
};

export const computeBadges = (stats, scores, streak) => {
  const badges = [];
  const topics = [...new Set(scores.map((s) => s.topic))];

  const add = (id, label, icon, desc, condition) =>
    badges.push({ id, label, icon, desc, earned: !!condition });

  add("first", "DataEre Rookie", "🎯", "Completed your first session", stats.total >= 1);
  add("tenner", "DataEre Starter", "📚", "Completed 10 sessions", stats.total >= 10);
  add("fifty", "DataEre Master", "🏅", "Completed 50 sessions", stats.total >= 50);
  add("hundred", "Century CLub", "⭐", "Completed 100 sessions", stats.avgScore >= 100);
  add("twohundred", "Data Veteran", "🎖️", "Completed 200 sessions", stats.total >= 200);
  add("fivehundred", "Data Legend", "👑", "Completed 500 sessions", stats.total >= 500);
  add("ace", "High Achiever", "⭐", "Maintained 80%+ average", stats.avgScore >= 80);
  add("sharp", "Sharp Shooter", "🎯", "Achieved 90%+ average", stats.avgScore >= 90);
  add("genius", "Data Genius", "🧠", "Achieved 95%+ average", stats.avgScore >= 95);
  add("excel", "Excel Starter", "🗄️", "Completed an Excel session", topics.some((t) => t?.toLowerCase().includes("excel")));
  add("perfect", "Perfectionist", "💯", "Scored 100% on a session", stats.bestScore === 100);
  add("sql", "SQL Starter", "🗄️", "Completed a SQL session", topics.some((t) => t?.toLowerCase().includes("sql")));
  add("streak3", "On Fire", "🔥", "3-day learning streak", streak >= 3);
  add("streak7", "Week Warrior", "⚡", "7-day learning streak", streak >= 7);
  add("streak10", "Streak Master", "🏆", "10-day unbroken streak", streak >= 10);
  add("streak30", "Consistency King", "📅", "30-day learning streak", streak >= 30);
  add("xp50", "XP Collector", "💎", "Earned 50+ total XP", stats.totalCorrect >= 50);
  add("xp200", "XP Hoarder", "👑", "Earned 200+ total XP", stats.totalCorrect >= 200);

  return badges;
};

// ─── Fake daily challenge (replace with real API call) ─────
export const fetchDailyChallenge = async () =>
  new Promise((res) =>
    setTimeout(
      () =>
        res({
          title: "Sales Dashboard Insight",
          duration: 5,
          questions: 5,
          pts: 25,
        }),
      500
    )
  );

export const RANK_STYLES = {
  1: { bg: "#faeeda", color: "#854f0b", border: "1px solid #ef9f27" },
  2: { bg: "#e6f1fb", color: "#185fa5", border: "1px solid #85b7eb" },
  3: { bg: "#faece7", color: "#993c1d", border: "1px solid #f0997b" },
};
export const MEDALS = { 1: "🥇", 2: "🥈", 3: "🥉" };