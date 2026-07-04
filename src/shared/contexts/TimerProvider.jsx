import { createContext, useState } from "react";

export const TimerContext = createContext();

export function TimerProvider({ children }) {
  const [timeLeft, setTimeLeft] = useState(300);

  return (
    <TimerContext.Provider value={{ timeLeft, setTimeLeft }}>
      {children}
    </TimerContext.Provider>
  );
}
