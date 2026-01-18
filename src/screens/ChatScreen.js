import { useState, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  FlatList,
  Keyboard,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons, Feather, Ionicons } from "@expo/vector-icons";
import { API_URL_BASE } from "../config/api";
import { useTheme } from "../context/ThemeContext";

const ChatScreen = ({ user, onBack }) => {
  const { darkMode, toggleTheme, colors } = useTheme();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "I am the Relationship Mechanic. I help you recalibrate your reality. Let's begin. \n\n1) What is happening in your relationship right now?\n2) What are you feeling most intensely?\n3) What action or decision feels hardest for you to make?",
    },
  ]);

  const flatListRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    Keyboard.dismiss();

    // 1. Add User Message
    const newMsg = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, newMsg]);
    setLoading(true);

    try {
      // 2. Call API
      const response = await fetch(`${API_URL_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          sessionId: user.uid, // Send UID so memory is specific to this user
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Network error");

      const botResponse = data.message || "System Error: No response.";

      // 3. Add Bot Message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: botResponse },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection failure. My diagnostic systems are offline.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Render a single message bubble
  const renderItem = ({ item }) => {
    const isUser = item.role === "user";
    return (
      <View
        style={[
          styles.messageRow,
          isUser
            ? { justifyContent: "flex-end" }
            : { justifyContent: "flex-start" },
        ]}
      >
        {!isUser && (
          <View
            style={[styles.botAvatar, { backgroundColor: colors.botAvatarBg }]}
          >
            <MaterialCommunityIcons
              name="robot"
              size={16}
              color={colors.cardValueAccent}
            />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser
              ? [styles.userBubble, { backgroundColor: colors.userBubble }]
              : [
                  styles.botBubble,
                  {
                    backgroundColor: colors.botBubble,
                    borderColor: colors.botBubbleBorder,
                  },
                ],
          ]}
        >
          <Text
            style={
              isUser
                ? [styles.userText, { color: colors.userText }]
                : [styles.botText, { color: colors.botText }]
            }
          >
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { borderBottomColor: colors.headerBorder }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onBack} style={{ marginRight: 10 }}>
            <Feather name="arrow-left" size={24} color={colors.subtitle} />
          </TouchableOpacity>
          <View style={styles.iconBox}>
            <MaterialCommunityIcons name="wrench" size={20} color="white" />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.title }]}>
              Mechanic
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.subtitle }]}>
              Diagnostic Engine
            </Text>
          </View>
        </View>
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

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ padding: 15, paddingBottom: 20 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Input Area */}
        <View
          style={[
            styles.chatInputContainer,
            {
              backgroundColor: colors.headerBg,
              borderTopColor: colors.headerBorder,
            },
          ]}
        >
          <TextInput
            style={[
              styles.chatInput,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.inputBorder,
                color: colors.inputText,
              },
            ]}
            placeholder="Describe the situation..."
            placeholderTextColor={colors.placeholderText}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!input.trim() || loading) && { opacity: 0.5 },
            ]}
            onPress={handleSend}
            disabled={!input.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  toggleBtn: {
    padding: 8,
    borderRadius: 8,
  },
  iconBox: { backgroundColor: "#0D9488", padding: 8, borderRadius: 8 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  headerSubtitle: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  messageRow: { flexDirection: "row", marginBottom: 20 },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginTop: 4,
  },
  messageBubble: { maxWidth: "80%", padding: 14, borderRadius: 16 },
  userBubble: { borderBottomRightRadius: 4 },
  botBubble: {
    borderWidth: 1,
    borderTopLeftRadius: 4,
  },
  userText: { fontSize: 15, lineHeight: 22 },
  botText: { fontSize: 15, lineHeight: 22 },
  chatInputContainer: {
    flexDirection: "row",
    padding: 15,
    borderTopWidth: 1,
  },
  chatInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: 10,
    borderWidth: 1,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0D9488",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatScreen;
