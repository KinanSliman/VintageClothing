import { createContext, useContext, useState } from "react";

const QueriesContext = createContext();

export function QueriesProvider({ children }) {
  const [activeSearchQuery, setActiveSearchQuery] = useState("");

  return (
    <QueriesContext.Provider
      value={{ activeSearchQuery, setActiveSearchQuery }}
    >
      {children}
    </QueriesContext.Provider>
  );
}

export function useQueriesContext() {
  const context = useContext(QueriesContext);
  if (!context) {
    throw new Error("useQueriesContext must be used within a QueriesProvider");
  }
  return context;
}
