export const showToast = (toast, type, message) => {
  const config = {
    success: {
      status: "success",
      duration: 3000,
    },
    info: {
      status: "info",
      duration: 3000,
    },
    warning: {
      status: "warning",
      duration: 4000,
    },
    error: {
      status: "error",
      duration: 5000,
    },
  };

  const selected = config[type];

  toast({
    description: message,
    status: selected.status,
    duration: selected.duration,
    position: "bottom-left",
    isClosable: true,
  });
};