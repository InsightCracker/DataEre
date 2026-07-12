import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast, Spinner } from "@chakra-ui/react";
import { FaUpload, FaFileCsv, FaLock } from "react-icons/fa6";
import {
  getAccessStatus,
  uploadDataset,
  generateDatasetQuiz,
} from "../../shared/utils/datasetquizapi";
import PaywallModal from "./PaywallModal";

const TOOLS = [
  { key: "excel", label: "Excel" },
  { key: "power_bi", label: "Power BI" },
];

const DIFFICULTIES = [
  { key: "easy", label: "Easy" },
  { key: "hard", label: "Hard" },
];

const DatasetChallengePage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [access, setAccess] = useState(null);
  const [file, setFile] = useState(null);
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [tool, setTool] = useState("excel");
  const [difficulty, setDifficulty] = useState("easy");
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [resetDate, setResetDate] = useState(null);

  useEffect(() => {
    getAccessStatus().then(setAccess).catch(() => {});
  }, []);

  const handleFileSelect = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setDatasetInfo(null);
    setUploading(true);
    try {
      const data = await uploadDataset(selected);
      setDatasetInfo(data);
      toast({ title: "Dataset uploaded", status: "success", duration: 2000 });
    } catch (err) {
      toast({ title: err.message, status: "error", duration: 3000 });
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!datasetInfo) return;
    setGenerating(true);
    try {
      const { questions, remaining } = await generateDatasetQuiz({
        datasetId: datasetInfo.datasetId,
        tool,
        difficulty,
      });
      setAccess((prev) => (prev ? { ...prev, remaining } : prev));
      navigate("/quiz/dataset-challenge/play", { state: { questions, tool, difficulty } });
    } catch (err) {
      if (err.code === "FREE_LIMIT_REACHED") {
        setResetDate(err.resetsOn);
        setShowPaywall(true);
      } else {
        toast({ title: err.message, status: "error", duration: 3000 });
      }
    } finally {
      setGenerating(false);
    }
  };

  const pillStyle = (active) => ({
    padding: "10px 20px",
    borderRadius: "99px",
    border: `1px solid ${active ? "#3b6ef0" : "rgba(59,110,240,0.15)"}`,
    background: active ? "#3b6ef0" : "transparent",
    color: active ? "white" : "#4b5563",
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "all 0.15s",
  });

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "2rem 1.25rem" }}>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#111827", marginBottom: "4px" }}>
        Dataset Challenge
      </h1>
      <p style={{ fontSize: "0.88rem", color: "#6b7280", marginBottom: "24px" }}>
        Upload your own dataset and get quiz questions generated from it.
      </p>

      {access && !access.isSubscribed && (
        <div
          style={{
            display: "inline-block",
            padding: "6px 12px",
            borderRadius: "99px",
            background: "rgba(59,110,240,0.08)",
            color: "#3b6ef0",
            fontWeight: 600,
            fontSize: "0.76rem",
            marginBottom: "20px",
          }}
        >
          {access.remaining} free {access.remaining === 1 ? "quiz" : "quizzes"} left this month
        </div>
      )}

      {/* Upload zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: "1.5px dashed rgba(59,110,240,0.3)",
          borderRadius: "16px",
          padding: "32px 20px",
          textAlign: "center",
          cursor: "pointer",
          background: "rgba(59,110,240,0.03)",
          marginBottom: "24px",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
        {uploading ? (
          <Spinner color="#3b6ef0" size="md" />
        ) : datasetInfo ? (
          <>
            <FaFileCsv size={28} color="#3b6ef0" style={{ marginBottom: "8px" }} />
            <div style={{ fontWeight: 700, color: "#111827", fontSize: "0.9rem" }}>
              {file?.name}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>
              {datasetInfo.rowCount} rows · {datasetInfo.columns.length} columns
            </div>
          </>
        ) : (
          <>
            <FaUpload size={24} color="#3b6ef0" style={{ marginBottom: "8px" }} />
            <div style={{ fontWeight: 600, color: "#111827", fontSize: "0.9rem" }}>
              Click to upload a CSV or Excel file
            </div>
            <div style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>
              Max 5MB
            </div>
          </>
        )}
      </div>

      {/* Tool selector */}
      <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "8px" }}>
        Tool
      </label>
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {TOOLS.map((t) => (
          <button key={t.key} style={pillStyle(tool === t.key)} onClick={() => setTool(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Difficulty selector */}
      <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "8px" }}>
        Difficulty
      </label>
      <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
        {DIFFICULTIES.map((d) => (
          <button key={d.key} style={pillStyle(difficulty === d.key)} onClick={() => setDifficulty(d.key)}>
            {d.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleGenerate}
        disabled={!datasetInfo || generating}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "none",
          background:
            !datasetInfo || generating
              ? "rgba(59,110,240,0.4)"
              : "linear-gradient(135deg,#2251cc,#3b6ef0)",
          color: "white",
          fontWeight: 700,
          fontSize: "0.95rem",
          cursor: !datasetInfo || generating ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {generating ? (
          <>
            <Spinner size="sm" /> Generating questions...
          </>
        ) : (
          "Start Challenge"
        )}
      </button>

      {showPaywall && (
        <PaywallModal
          resetDate={resetDate}
          onClose={() => setShowPaywall(false)}
        />
      )}
    </div>
  );
};

export default DatasetChallengePage;