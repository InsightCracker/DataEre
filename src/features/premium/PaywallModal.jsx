import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, useToast,
} from "@chakra-ui/react";
import { FaLock, FaCheck } from "react-icons/fa6";
import { useState } from "react";
import { initiateCheckout } from "../../shared/utils/datasetquizapi";

const PLANS = [
  { key: "monthly", label: "Monthly", price: "₦2,000" },
  { key: "quarterly", label: "Quarterly", price: "₦5,000", badge: "Save 17%" },
  { key: "yearly", label: "Yearly", price: "₦20,000", badge: "Save 17%" },
];

const PERKS = [
  "Unlimited Dataset Challenges",
  "Power BI question mode",
  "Hard difficulty (multi-condition, interview-style)",
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

const PaywallModal = ({ resetDate, onClose }) => {
  const toast = useToast();
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [redirecting, setRedirecting] = useState(false);

  const handleUpgrade = async () => {
    setRedirecting(true);
    try {
      const { checkoutUrl } = await initiateCheckout(selectedPlan);
      window.location.href = checkoutUrl;
    } catch (err) {
      toast({ title: err.message, status: "error", duration: 3000 });
      setRedirecting(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="md" isCentered>
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent borderRadius="20px" mx="1rem">
        <ModalHeader fontWeight={800} fontSize="1.1rem" pt="1.5rem">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FaLock color="#3b6ef0" size={16} />
            Free limit reached
          </div>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="1.5rem">
          <p style={{ fontSize: "0.85rem", color: "#4b5563", marginBottom: "16px", lineHeight: 1.6 }}>
            You've used all your free Dataset Challenges this month. Upgrade for unlimited access.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px" }}>
            {PERKS.map((perk) => (
              <div key={perk} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaCheck size={11} color="#3b6ef0" />
                <span style={{ fontSize: "0.82rem", color: "#111827" }}>{perk}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
            {PLANS.map((plan) => (
              <div
                key={plan.key}
                onClick={() => setSelectedPlan(plan.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: `1.5px solid ${selectedPlan === plan.key ? "#3b6ef0" : "rgba(59,110,240,0.12)"}`,
                  background: selectedPlan === plan.key ? "rgba(59,110,240,0.05)" : "transparent",
                  cursor: "pointer",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#111827" }}>
                    {plan.label}
                    {plan.badge && (
                      <span
                        style={{
                          marginLeft: "8px",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: "#3b6ef0",
                          background: "rgba(59,110,240,0.1)",
                          padding: "2px 8px",
                          borderRadius: "99px",
                        }}
                      >
                        {plan.badge}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#3b6ef0" }}>
                  {plan.price}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpgrade}
            disabled={redirecting}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "12px",
              border: "none",
              background: redirecting
                ? "rgba(59,110,240,0.5)"
                : "linear-gradient(135deg,#2251cc,#3b6ef0)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: redirecting ? "not-allowed" : "pointer",
              marginBottom: "10px",
            }}
          >
            {redirecting ? "Redirecting..." : "Upgrade now"}
          </button>

          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "12px",
              border: "none",
              background: "transparent",
              color: "#9ca3af",
              fontWeight: 600,
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            Not now
          </button>

          {resetDate && (
            <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#9ca3af", marginTop: "8px" }}>
              Free quizzes reset on {formatDate(resetDate)}
            </p>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PaywallModal;