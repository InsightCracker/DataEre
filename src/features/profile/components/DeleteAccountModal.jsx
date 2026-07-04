import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter, ModalCloseButton, useToast,
} from "@chakra-ui/react";
import { deleteAccount } from "../../../shared/utils/api";

/* Confirmation modal for permanently deleting the user's account. */
const DeleteAccountModal = ({ isOpen, onClose, logout }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await deleteAccount();
      if (res.success) {
        toast({ title: "Account deleted", status: "info", duration: 3000 });
        logout();
        navigate("/users/login");
      } else {
        toast({ title: res.message || "Delete failed", status: "error", duration: 3000 });
      }
    } catch {
      toast({ title: "Network error", status: "error", duration: 3000 });
    } finally {
      setDeleting(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent borderRadius="20px" mx="1rem">
        <ModalHeader fontWeight={800} color="#dc2626" fontSize="1rem">
          Delete account?
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="0.5rem" fontSize="0.88rem" color="#4b5563" lineHeight={1.6}>
          All your scores, badges, and progress will be permanently deleted. This cannot be undone.
        </ModalBody>
        <ModalFooter gap="8px">
          <button onClick={onClose} style={{
            padding: "9px 18px", borderRadius: "10px",
            border: "1px solid rgba(59,110,240,0.2)", background: "transparent",
            fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
          }}>
            Cancel
          </button>
          <button onClick={handleDeleteAccount} disabled={deleting}
            style={{
              padding: "9px 18px", borderRadius: "10px", border: "none",
              background: deleting ? "rgba(220,38,38,0.5)" : "#dc2626",
              color: "white", fontWeight: 700, fontSize: "0.85rem",
              cursor: deleting ? "not-allowed" : "pointer",
            }}>
            {deleting ? "Deleting..." : "Yes, delete"}
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteAccountModal;