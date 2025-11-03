import { useState } from "react";

export function useMessages() {
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleError = (text) => setMessage({ text, type: "error" });
  const handleSuccess = (text) => setMessage({ text, type: "success" });
  const clearMessage = () => setMessage({ text: "", type: "" });

  return { message, handleError, handleSuccess, clearMessage };
}
