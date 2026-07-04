import { useState, useEffect } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, Input, Switch, useToast,
} from "@chakra-ui/react";
import { FaBell, FaLock, FaTrash, FaPen } from "react-icons/fa6";
import { useAuth } from "../../../shared/contexts/AuthContext";
import { updateProfile, updatePrivacy, updateNotificationPrefs } from "../../../shared/utils/api";

const SettingsModal = ({
  isOpen,
  onClose,
  user,
  username,
  email,
  joinDateFormatted,
  longestStreak,
  isPublic,
  onOpenDelete,
}) => {
  const toast = useToast();

  const { notificationPrefs, updateUser } = useAuth();
  const [settingsTab, setSettingsTab] = useState("profile");
  const [editName, setEditName] = useState(username || "");
  const [editEmail, setEditEmail] = useState(email || "");
  const [notifQuiz, setNotifQuiz] = useState(user?.notificationPrefs?.dailyReminders ?? false);
  const [notifLeader, setNotifLeader] = useState(user?.notificationPrefs?.leaderboardUpdates ?? false);
  const [savingNotif, setSavingNotif] = useState(false);
  const [profilePublic, setProfilePublic] = useState(isPublic ?? true);
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const [saving, setSaving] = useState(false);

  // Keep edit fields in sync when auth data loads/changes
  useEffect(() => { setEditName(username || ""); }, [username]);
  useEffect(() => { setEditEmail(email || ""); }, [email]);
  useEffect(() => { setProfilePublic(isPublic ?? true); }, [isPublic]);

  useEffect(() => {
    setNotifQuiz(notificationPrefs?.dailyReminders    ?? false);
    setNotifLeader(notificationPrefs?.leaderboardUpdates ?? false);
  }, [notificationPrefs?.dailyReminders, notificationPrefs?.leaderboardUpdates]);

  const handleToggleNotif = async (key, currentVal) => {
  const next = !currentVal;
  // Optimistic update
  if (key === "dailyReminders")    setNotifQuiz(next);
  if (key === "leaderboardUpdates") setNotifLeader(next);

  setSavingNotif(true);
    try {
      const res = await updateNotificationPrefs(key, next);
      if (res.success) {
        updateUser(res.user);
        toast({
          title: next ? "Notification enabled" : "Notification disabled",
          status: "success",
          duration: 2000,
        });
      } else {
        // Roll back
        if (key === "dailyReminders") setNotifQuiz(currentVal);
        if (key === "leaderboardUpdates") setNotifLeader(currentVal);
        toast({ title: res.message || "Could not update", status: "error", duration: 3000 });
      }
    } catch {
      if (key === "dailyReminders") setNotifQuiz(currentVal);
      if (key === "leaderboardUpdates") setNotifLeader(currentVal);
      toast({ title: "Network error", status: "error", duration: 3000 });
    } finally {
      setSavingNotif(false);
    }
  };

  const handleTogglePrivacy = async (key, currentVal) => {
    console.log("Testing")
    console.log("TOGGLE CLICKED", key, currentVal);
    const next = !profilePublic;
    setProfilePublic(next);
    setSavingPrivacy(true);
    try {
      const res = await updatePrivacy(next);
      if (res.success) {
        updateUser(res.user);
        toast({
          title: next ? "Profile is now public" : "Profile hidden from leaderboard",
          status: "success",
          duration: 2000,
        });
      } else {
        setProfilePublic(!next);
        toast({ title: res.message || "Could not update privacy setting", status: "error", duration: 3000 });
      }
    } catch {
      setProfilePublic(!next);
      toast({ title: "Network error", status: "error", duration: 3000 });
    } finally {
      setSavingPrivacy(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim() && !editEmail.trim()) return;
    setSaving(true);
    try {
      const res = await updateProfile(editName, editEmail);
      if (res.success) {
        updateUser(res.user);
        toast({ title: "Profile updated", status: "success", duration: 2000 });
        onClose();
      } else {
        toast({ title: res.message || "Update failed", status: "error", duration: 3000 });
      }
    } catch {
      toast({ title: "Network error", status: "error", duration: 3000 });
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { key: "profile", label: "Edit Profile", icon: <FaPen size={11} /> },
    { key: "notif", label: "Notifications", icon: <FaBell size={11} /> },
    { key: "privacy", label: "Privacy", icon: <FaLock size={11} /> },
    { key: "danger", label: "Account", icon: <FaTrash size={11} /> },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent borderRadius="20px" mx="1rem">
        <ModalHeader fontWeight={800} fontSize="1.1rem" pt="1.5rem">
          Settings
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="1.5rem">

          {/* Tabs */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setSettingsTab(t.key)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "7px 14px", borderRadius: "99px",
                  border: `1px solid ${settingsTab === t.key ? "#3b6ef0" : "rgba(59,110,240,0.15)"}`,
                  background: settingsTab === t.key ? "#3b6ef0" : "transparent",
                  color: settingsTab === t.key ? "white" : "#4b5563",
                  fontWeight: 600, fontSize: "0.8rem", cursor: "pointer",
                }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Profile tab */}
          {settingsTab === "profile" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>Full name</label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your name" borderRadius="12px" fontSize="0.9rem"
                  border="1px solid rgba(59,110,240,0.2)"
                  _focus={{ borderColor: "#3b6ef0", boxShadow: "0 0 0 3px rgba(59,110,240,0.12)" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>Email address</label>
                <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)}
                  type="email" placeholder="your@email.com" borderRadius="12px" fontSize="0.9rem"
                  border="1px solid rgba(59,110,240,0.2)"
                  _focus={{ borderColor: "#3b6ef0", boxShadow: "0 0 0 3px rgba(59,110,240,0.12)" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>Member since</label>
                <Input value={joinDateFormatted} isReadOnly borderRadius="12px"
                  fontSize="0.9rem" bg="rgba(0,0,0,0.03)" border="1px solid rgba(59,110,240,0.1)" />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>Longest streak</label>
                <Input value={`${longestStreak} day${longestStreak !== 1 ? "s" : ""}`}
                  isReadOnly borderRadius="12px" fontSize="0.9rem"
                  bg="rgba(0,0,0,0.03)" border="1px solid rgba(59,110,240,0.1)" />
              </div>
              <button onClick={handleSaveProfile} disabled={saving}
                style={{
                  padding: "12px", borderRadius: "12px", border: "none",
                  background: saving ? "rgba(59,110,240,0.5)" : "linear-gradient(135deg,#2251cc,#3b6ef0)",
                  color: "white", fontWeight: 700, fontSize: "0.9rem",
                  cursor: saving ? "not-allowed" : "pointer",
                }}>
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          )}

          {/* Notifications tab */}
          {settingsTab === "notif" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                {
                  label: "Daily reminders",
                  sub:   "Email nudges to keep your streak alive",
                  val:   notifQuiz,
                  key:   "dailyReminders",
                },
                {
                  label: "Leaderboard updates",
                  sub:   "In-app alert when your rank changes",
                  val:   notifLeader,
                  key:   "leaderboardUpdates",
                },
              ].map((item) => (
                <div key={item.key} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 16px", borderRadius: "12px",
                  border: "1px solid rgba(59,110,240,0.10)", background: "rgba(59,110,240,0.03)",
                  opacity: savingNotif ? 0.6 : 1, transition: "opacity 0.2s",
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#111827" }}>{item.label}</div>
                    <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{item.sub}</div>
                  </div>
                  <Switch
                    isChecked={item.val}
                    onChange={() => handleToggleNotif(item.key, item.val)}
                    isDisabled={savingNotif}
                    colorScheme="blue"
                    size="md"
                  />
                </div>
              ))}

              {/* Info note so users know what each channel does */}
              <div style={{
                padding: "10px 14px", borderRadius: "10px", fontSize: "0.76rem",
                color: "#6b7280", lineHeight: 1.6,
                background: "rgba(59,110,240,0.04)", border: "1px solid rgba(59,110,240,0.08)",
              }}>
                Daily reminders are sent by <strong>email</strong>. Leaderboard updates appear as
                an <strong>in-app pop-up</strong> while you're active.
              </div>
            </div>
          )}

          {/* Privacy tab */}
          {settingsTab === "privacy" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px", borderRadius: "12px",
                border: "1px solid rgba(59,110,240,0.10)", background: "rgba(59,110,240,0.03)",
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#111827" }}>Public profile</div>
                  <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>Show your name on the leaderboard</div>
                </div>
                <Switch isChecked={profilePublic} onChange={handleTogglePrivacy}
                  isDisabled={savingPrivacy} colorScheme="blue" size="md" />
              </div>
              <div style={{
                padding: "12px 16px", borderRadius: "12px",
                border: "1px solid rgba(59,110,240,0.10)", background: "rgba(59,110,240,0.03)",
                fontSize: "0.82rem", color: "#4b5563", lineHeight: 1.6,
              }}>
                Your data is never sold to third parties. Scores are stored securely.
              </div>
            </div>
          )}

          {/* Danger tab */}
          {settingsTab === "danger" && (
            <div style={{
              padding: "14px 16px", borderRadius: "12px",
              border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.04)",
            }}>
              <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#dc2626", marginBottom: "4px" }}>Delete account</div>
              <div style={{ fontSize: "0.78rem", color: "#9ca3af", marginBottom: "12px" }}>
                Permanently deletes your account, all scores, and data. Cannot be undone.
              </div>
              <button onClick={() => { onClose(); onOpenDelete(); }}
                style={{
                  padding: "9px 18px", borderRadius: "10px",
                  border: "1px solid rgba(239,68,68,0.4)", background: "transparent",
                  color: "#dc2626", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "6px",
                }}>
                <FaTrash size={12} /> Delete my account
              </button>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SettingsModal;