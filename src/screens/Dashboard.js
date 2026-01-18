import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { API_URL_BASE } from "../config/api";
import { useTheme } from "../context/ThemeContext";

const Dashboard = ({ user, handleLogout, initialUserData, onNavigateChat }) => {
  const { darkMode, toggleTheme, colors } = useTheme();
  const [userData, setUserData] = useState(initialUserData || null);
  const [loading, setLoading] = useState(!initialUserData);

  useEffect(() => {
    if (!initialUserData) fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_URL_BASE}/user/${user.uid}`);
      const data = await response.json();
      if (response.ok) setUserData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.cardValueAccent} />
      </View>
    );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.dashboardContainer}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.headerBorder }]}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons
                name="view-dashboard"
                size={24}
                color="white"
              />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: colors.title }]}>
                Dashboard
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.subtitle }]}>
                Welcome back
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            {/* Dark/Light Mode Toggle */}
            <TouchableOpacity
              onPress={toggleTheme}
              style={[styles.toggleBtn, { backgroundColor: colors.toggleBtnBg }]}
            >
              {darkMode ? (
                <Feather name="sun" size={20} color={colors.toggleBtnText} />
              ) : (
                <Feather name="moon" size={20} color={colors.toggleBtnText} />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Feather name="log-out" size={22} color={colors.signOut} />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.title }]}>
            Hello, {user.email?.split("@")[0]}
          </Text>
          <Text style={[styles.cardText, { color: colors.welcomeText }]}>
            Here's an overview of your account.
          </Text>
        </View>

        {userData ? (
          <>
            <View style={styles.grid}>
              <View
                style={[
                  styles.statCard,
                  {
                    backgroundColor: colors.innerCardBg,
                    borderColor: colors.innerCardBorder,
                  },
                ]}
              >
                <View style={styles.statHeader}>
                  <Feather
                    name="target"
                    size={18}
                    color={colors.cardValueAccent}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={[styles.statLabel, { color: colors.cardLabel }]}>
                    TARGET DAYS
                  </Text>
                </View>
                <Text
                  style={[styles.statValueAccent, { color: colors.cardValueAccent }]}
                >
                  {userData.targetDays}
                </Text>
              </View>

              <View
                style={[
                  styles.statCard,
                  {
                    backgroundColor: colors.innerCardBg,
                    borderColor: colors.innerCardBorder,
                  },
                ]}
              >
                <View style={styles.statHeader}>
                  <Feather
                    name="calendar"
                    size={18}
                    color={colors.cardValueAccent}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={[styles.statLabel, { color: colors.cardLabel }]}>
                    CREATED
                  </Text>
                </View>
                <Text style={[styles.statValue, { color: colors.cardValue }]}>
                  {new Date(userData.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>

            {/* User ID */}
            <View
              style={[
                styles.statCard,
                {
                  marginTop: 15,
                  backgroundColor: colors.innerCardBg,
                  borderColor: colors.innerCardBorder,
                },
              ]}
            >
              <View style={styles.statHeader}>
                <Feather
                  name="hash"
                  size={18}
                  color={colors.cardValueAccent}
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.statLabel, { color: colors.cardLabel }]}>
                  USER ID
                </Text>
              </View>
              <Text style={[styles.statValueMono, { color: colors.cardValueMono }]}>
                {userData.firebaseUid}
              </Text>
            </View>

            {/* CHAT BUTTON ACTION CARD */}
            <TouchableOpacity
              style={[
                styles.actionCard,
                {
                  backgroundColor: colors.actionCardBg,
                  borderColor: colors.actionCardBorder,
                },
              ]}
              onPress={onNavigateChat}
            >
              <View
                style={[styles.actionIcon, { backgroundColor: colors.actionCardIconBg }]}
              >
                <MaterialCommunityIcons
                  name="message-text-outline"
                  size={24}
                  color={colors.cardValueAccent}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.actionTitle, { color: colors.actionCardTitle }]}>
                  Relationship Mechanic
                </Text>
                <Text style={[styles.actionDesc, { color: colors.actionCardDesc }]}>
                  Start a diagnostic session
                </Text>
              </View>
              <Feather name="chevron-right" size={24} color={colors.cardValueAccent} />
            </TouchableOpacity>
          </>
        ) : (
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <Text style={{ color: "red" }}>User data not found.</Text>
            <TouchableOpacity onPress={fetchUserData} style={{ marginTop: 10 }}>
              <Text style={{ color: colors.cardValueAccent }}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dashboardContainer: { padding: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBox: { backgroundColor: "#0D9488", padding: 8, borderRadius: 8 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  headerSubtitle: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  toggleBtn: {
    padding: 8,
    borderRadius: 8,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "300",
    marginBottom: 8,
  },
  cardText: {},
  grid: { flexDirection: "row", gap: 15, justifyContent: "space-between" },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  statHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  statLabel: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  statValue: { fontSize: 16 },
  statValueAccent: { fontSize: 32, fontWeight: "300" },
  statValueMono: {
    fontFamily: "monospace",
    fontSize: 12,
  },
  actionCard: {
    marginTop: 24,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: { padding: 10, borderRadius: 10, marginRight: 15 },
  actionTitle: { fontSize: 18, fontWeight: "500" },
  actionDesc: {},
});

export default Dashboard;
