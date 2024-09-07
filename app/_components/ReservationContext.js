"use client";

import { createContext, useContext, useState } from "react";

const ReservationContext = createContext();

function ReservationProvider({ children }) {
  const [range, setRange] = useState({ from: undefined, to: undefined });

  function resetRange() {
    setRange({ from: undefined, to: undefined });
  }

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);

  if (context === undefined) {
    throw new Error("Outside the context");
  }
  return context;
}

export { ReservationProvider, useReservation };
