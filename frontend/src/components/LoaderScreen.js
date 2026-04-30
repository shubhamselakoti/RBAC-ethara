import React, { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const LoaderScreen = ({ onReady }) => {
  const [message, setMessage] = useState("Waking up the server…");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    let timer;
    const ping = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, { method: "GET" });
        // Any response (even 401) means server is up
        if (res.status !== 0) {
          onReady();
          return;
        }
      } catch {}

      setAttempts((a) => {
        const next = a + 1;
        if (next > 3) setMessage("Still starting up, hang tight…");
        if (next > 7) setMessage("Almost there…");
        return next;
      });
      timer = setTimeout(ping, 3000);
    };

    ping();
    return () => clearTimeout(timer);
  }, [onReady]);

  return (
    <div className="loader-screen">
      <div className="loader-brand">AuthApp</div>
      <div className="loader-spinner" />
      <p className="loader-text">{message}</p>
      {attempts > 5 && (
        <p className="loader-text" style={{ fontSize: 12, maxWidth: 280, textAlign: "center" }}>
          Render free tier servers sleep after inactivity. First load may take ~30–60s.
        </p>
      )}
    </div>
  );
};

export default LoaderScreen;
