import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const theme = {
  light: {
    bg: "#F5F5F4",           // stone-100
    headerBg: "#FFFFFF",
    headerBorder: "#D6D3D1", // stone-300
    title: "#292524",        // stone-800
    subtitle: "#78716C",     // stone-500
    card: "rgba(255,255,255,0.8)",
    cardBorder: "#D6D3D1",   // stone-300
    innerCardBg: "#FAFAF9",  // stone-50
    innerCardBorder: "#E7E5E4", // stone-200
    cardLabel: "#78716C",    // stone-500
    cardValue: "#292524",    // stone-800
    cardValueAccent: "#0D9488", // teal-600
    cardValueMono: "#57534E",  // stone-600
    signOut: "#78716C",      // stone-500
    toggleBtnBg: "#E7E5E4",  // stone-200
    toggleBtnText: "#57534E", // stone-600
    welcomeText: "#44403C",  // stone-700
    actionCardBg: "#F0FDFA", // teal-50
    actionCardBorder: "#CCFBF1", // teal-100
    actionCardTitle: "#0F766E", // teal-700
    actionCardDesc: "#0D9488",  // teal-600
    actionCardIconBg: "#CCFBF1", // teal-100
    // Chat
    chatBg: "#F5F5F4",
    inputBg: "#F9FAFB",
    inputBorder: "#E5E7EB",
    userBubble: "#0D9488",
    userText: "#FFFFFF",
    botBubble: "#FFFFFF",
    botBubbleBorder: "#D6D3D1",
    botText: "#292524",
    botAvatarBg: "#E0F2F1",
    // Login
    loginBg: "#FFFFFF",
    inputText: "#292524",
    placeholderText: "#9CA3AF",
  },
  dark: {
    bg: "#1C1917",           // stone-900
    headerBg: "#292524",     // stone-800
    headerBorder: "#44403C", // stone-700
    title: "#F5F5F4",        // stone-100
    subtitle: "#A8A29E",     // stone-400
    card: "rgba(41,37,36,0.5)", // stone-800/50
    cardBorder: "#44403C",   // stone-700
    innerCardBg: "#1C1917",  // stone-900
    innerCardBorder: "#292524", // stone-800
    cardLabel: "#78716C",    // stone-500
    cardValue: "#D6D3D1",    // stone-300
    cardValueAccent: "#14B8A6", // teal-500
    cardValueMono: "#A8A29E",   // stone-400
    signOut: "#A8A29E",      // stone-400
    toggleBtnBg: "#44403C",  // stone-700
    toggleBtnText: "#D6D3D1", // stone-300
    welcomeText: "#D6D3D1",  // stone-300
    actionCardBg: "rgba(19,78,74,0.3)", // teal-900/30
    actionCardBorder: "rgba(15,118,110,0.5)", // teal-700/50
    actionCardTitle: "#2DD4BF", // teal-400
    actionCardDesc: "rgba(20,184,166,0.8)", // teal-500/80
    actionCardIconBg: "rgba(19,78,74,0.5)", // teal-900/50
    // Chat
    chatBg: "#1C1917",
    inputBg: "#292524",
    inputBorder: "#44403C",
    userBubble: "#0D9488",
    userText: "#FFFFFF",
    botBubble: "#292524",
    botBubbleBorder: "#44403C",
    botText: "#F5F5F4",
    botAvatarBg: "rgba(19,78,74,0.5)",
    // Login
    loginBg: "#1C1917",
    inputText: "#F5F5F4",
    placeholderText: "#78716C",
  },
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const colors = darkMode ? theme.dark : theme.light;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
