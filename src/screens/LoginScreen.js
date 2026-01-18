import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { API_URL_BASE } from "../config/api";
import { useTheme } from "../context/ThemeContext";

const LoginScreen = ({ onSignupComplete, onSignupStart, onSignupError }) => {
  const { darkMode, toggleTheme, colors } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetDays, setTargetDays] = useState("30");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        onSignupStart();
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const firebaseUser = userCredential.user;

        const response = await fetch(`${API_URL_BASE}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            targetDays: targetDays,
          }),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed DB creation");

        const newUserData = result.user ||
          result || {
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            targetDays: parseInt(targetDays, 10),
            createdAt: new Date().toISOString(),
          };
        onSignupComplete(newUserData);
      }
    } catch (e) {
      let msg = e.message;
      if (msg.includes("auth/email-already-in-use"))
        msg = "Email already in use.";
      Alert.alert("Error", msg);
      if (!isLogin) onSignupError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.centerContainer, { backgroundColor: colors.loginBg }]}
    >
      {/* Theme Toggle in top right */}
      <View style={styles.toggleContainer}>
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
      </View>

      <View style={{ alignItems: "center", marginBottom: 30 }}>
        <View
          style={[
            styles.iconBox,
            {
              marginBottom: 15,
              width: 60,
              height: 60,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <MaterialCommunityIcons
            name={isLogin ? "login" : "account-plus"}
            size={32}
            color="white"
          />
        </View>
        <Text style={[styles.loginTitle, { color: colors.title }]}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </Text>
      </View>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.inputBorder,
            color: colors.inputText,
          },
        ]}
        placeholder="Email"
        placeholderTextColor={colors.placeholderText}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.inputBorder,
            color: colors.inputText,
          },
        ]}
        placeholder="Password"
        placeholderTextColor={colors.placeholderText}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {!isLogin && (
        <View>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.inputBorder,
                color: colors.inputText,
              },
            ]}
            placeholder="Target Days (30)"
            placeholderTextColor={colors.placeholderText}
            value={targetDays}
            onChangeText={setTargetDays}
            keyboardType="numeric"
          />
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isLogin ? "Sign In" : "Sign Up"}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setIsLogin(!isLogin)}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: colors.cardValueAccent, fontWeight: "600" }}>
          {isLogin ? "Create Account" : "Back to Login"}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  toggleContainer: {
    position: "absolute",
    top: 60,
    right: 20,
  },
  toggleBtn: {
    padding: 10,
    borderRadius: 8,
  },
  iconBox: { backgroundColor: "#0D9488", padding: 8, borderRadius: 8 },
  loginTitle: { fontSize: 28, fontWeight: "bold" },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#0D9488",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default LoginScreen;
