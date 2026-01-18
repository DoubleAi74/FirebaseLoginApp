import { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

import ChatScreen from "./src/screens/ChatScreen";
import Dashboard from "./src/screens/Dashboard";
import LoginScreen from "./src/screens/LoginScreen";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";

function AppContent() {
  const { colors } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialUserData, setInitialUserData] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("dashboard"); // 'dashboard' or 'chat'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!isSigningUp) {
        setUser(u);
        setLoading(false);
      }
      if (!u) {
        setInitialUserData(null);
        setCurrentScreen("dashboard");
      }
    });
    return unsubscribe;
  }, [isSigningUp]);

  const handleSignupComplete = (userData) => {
    setInitialUserData(userData);
    setUser(auth.currentUser);
    setIsSigningUp(false);
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.cardValueAccent} />
      </View>
    );

  if (!user) {
    return (
      <LoginScreen
        onSignupComplete={handleSignupComplete}
        onSignupStart={() => setIsSigningUp(true)}
        onSignupError={() => setIsSigningUp(false)}
      />
    );
  }

  // --- NAVIGATION LOGIC ---
  if (currentScreen === "chat") {
    return (
      <ChatScreen user={user} onBack={() => setCurrentScreen("dashboard")} />
    );
  }

  return (
    <Dashboard
      user={user}
      handleLogout={() => signOut(auth)}
      initialUserData={initialUserData}
      onNavigateChat={() => setCurrentScreen("chat")}
    />
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
