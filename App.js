// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   SafeAreaView,
//   Alert,
// } from "react-native";
// import {
//   createUserWithEmailAndPassword, // Added this back
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   signOut,
// } from "firebase/auth";
// import { auth } from "./firebaseConfig";
// import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

// // REPLACE WITH YOUR ACTUAL URL
// const API_URL_BASE = "https://www.volvox.guru/api";

// // --- COMPONENT: Dashboard ---
// const Dashboard = ({ user, handleLogout, initialUserData }) => {
//   console.log("Dashboard mounted, initialUserData:", initialUserData);
//   const [userData, setUserData] = useState(initialUserData || null);
//   const [loading, setLoading] = useState(!initialUserData);

//   useEffect(() => {
//     console.log("Dashboard useEffect, initialUserData:", initialUserData, "userData:", userData);
//     // Skip fetch if we already have data from signup
//     if (!initialUserData) {
//       fetchUserData();
//     }
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       // GET request to read data
//       const response = await fetch(`${API_URL_BASE}/user/${user.uid}`);
//       const data = await response.json();

//       if (response.ok) {
//         setUserData(data);
//       } else {
//         console.log("MongoDB Error:", data.error);
//       }
//     } catch (error) {
//       console.error("API Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#009688" />
//         <Text style={{ marginTop: 10 }}>Loading Dashboard...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.dashboardContainer}>
//         <View style={styles.header}>
//           <View style={styles.headerLeft}>
//             <View style={styles.iconBox}>
//               <MaterialCommunityIcons
//                 name="view-dashboard"
//                 size={24}
//                 color="white"
//               />
//             </View>
//             <View>
//               <Text style={styles.headerTitle}>Dashboard</Text>
//               <Text style={styles.headerSubtitle}>Welcome back</Text>
//             </View>
//           </View>
//           <TouchableOpacity onPress={handleLogout}>
//             <Feather name="log-out" size={22} color="#555" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>
//             Hello, {user.email?.split("@")[0]}
//           </Text>
//           <Text style={styles.cardText}>
//             Here's an overview of your account.
//           </Text>
//         </View>

//         {userData ? (
//           <>
//             <View style={styles.grid}>
//               <View style={styles.statCard}>
//                 <View style={styles.statHeader}>
//                   <Feather
//                     name="target"
//                     size={18}
//                     color="#009688"
//                     style={{ marginRight: 8 }}
//                   />
//                   <Text style={styles.statLabel}>TARGET DAYS</Text>
//                 </View>
//                 <Text style={styles.statValueAccent}>
//                   {userData.targetDays}
//                 </Text>
//               </View>

//               <View style={styles.statCard}>
//                 <View style={styles.statHeader}>
//                   <Feather
//                     name="calendar"
//                     size={18}
//                     color="#009688"
//                     style={{ marginRight: 8 }}
//                   />
//                   <Text style={styles.statLabel}>CREATED</Text>
//                 </View>
//                 <Text style={styles.statValue}>
//                   {new Date(userData.createdAt).toLocaleDateString()}
//                 </Text>
//               </View>
//             </View>

//             <View style={[styles.statCard, { marginTop: 15 }]}>
//               <View style={styles.statHeader}>
//                 <Feather
//                   name="hash"
//                   size={18}
//                   color="#009688"
//                   style={{ marginRight: 8 }}
//                 />
//                 <Text style={styles.statLabel}>USER ID</Text>
//               </View>
//               <Text style={styles.statValueMono}>{userData.firebaseUid}</Text>
//             </View>
//           </>
//         ) : (
//           <View style={styles.card}>
//             <Text style={{ color: "red" }}>User data not found.</Text>
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// // --- COMPONENT: Login / Signup Screen ---
// const LoginScreen = ({ onSignupComplete, onSignupStart, onSignupError }) => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [targetDays, setTargetDays] = useState("30"); // Default to 30
//   const [loading, setLoading] = useState(false);

//   // const handleAuth = async () => {
//   //   setLoading(true);
//   //   try {
//   //     if (isLogin) {
//   //       // --- LOGIN FLOW ---
//   //       await signInWithEmailAndPassword(auth, email, password);
//   //     } else {
//   //       // --- SIGNUP FLOW ---
//   //       // 1. Create User in Firebase
//   //       const userCredential = await createUserWithEmailAndPassword(
//   //         auth,
//   //         email,
//   //         password,
//   //       );
//   //       const user = userCredential.user;

//   //       // 2. Create User in MongoDB via API
//   //       const response = await fetch(`${API_URL_BASE}/register`, {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({
//   //           firebaseUid: user.uid,
//   //           email: user.email,
//   //           targetDays: targetDays,
//   //         }),
//   //       });

//   //       // --- DEBUG START ---
//   //       const text = await response.text(); // Get raw text instead of JSON
//   //       console.log("Server Response Status:", response.status);
//   //       console.log("Server Response Body:", text);

//   //       // Try to parse it only if it looks like JSON
//   //       try {
//   //         const result = JSON.parse(text);
//   //         if (!response.ok) {
//   //           throw new Error(result.error || "Failed to create database record");
//   //         }
//   //       } catch (e) {
//   //         // If parsing fails, throw the raw HTML text (or a summary) so you can see it in Alert
//   //         throw new Error(
//   //           `Server Error (${response.status}): ${text.slice(0, 100)}...`,
//   //         );
//   //       }
//   //       // --- DEBUG END ---

//   //       const result = await response.json();

//   //       if (!response.ok) {
//   //         throw new Error(result.error || "Failed to create database record");
//   //       }

//   //       // Success is handled automatically by onAuthStateChanged in the parent
//   //     }
//   //   } catch (e) {
//   //     Alert.alert("Error", e.message);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleAuth = async () => {
//     setLoading(true);
//     try {
//       if (isLogin) {
//         // --- LOGIN FLOW ---
//         await signInWithEmailAndPassword(auth, email, password);
//         // User state listener will handle the redirect
//       } else {
//         // --- SIGNUP FLOW ---
//         // Tell parent we're signing up so it ignores auth state changes until API completes
//         onSignupStart();

//         // 1. Create User in Firebase
//         const userCredential = await createUserWithEmailAndPassword(
//           auth,
//           email,
//           password,
//         );
//         const firebaseUser = userCredential.user;

//         // 2. Create User in MongoDB via API
//         const response = await fetch(`${API_URL_BASE}/register`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             firebaseUid: firebaseUser.uid,
//             email: firebaseUser.email,
//             targetDays: targetDays,
//           }),
//         });

//         // Parse JSON only once
//         const result = await response.json();
//         console.log("Register API response:", result);

//         if (!response.ok) {
//           throw new Error(result.error || "Failed to create database record");
//         }

//         // Success! Pass the user data to the parent so Dashboard has it immediately
//         // Try result.user first, then result itself, then construct from known data
//         const newUserData = result.user || result || {
//           firebaseUid: firebaseUser.uid,
//           email: firebaseUser.email,
//           targetDays: parseInt(targetDays, 10),
//           createdAt: new Date().toISOString(),
//         };
//         console.log("Passing to Dashboard:", newUserData);
//         onSignupComplete(newUserData);
//       }
//     } catch (e) {
//       // Handle specific Firebase errors or API errors
//       let msg = e.message;
//       if (msg.includes("auth/email-already-in-use"))
//         msg = "Email already in use.";
//       Alert.alert("Error", msg);
//       // Reset signup state on error so auth listener works again
//       if (!isLogin) {
//         onSignupError();
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.centerContainer}
//     >
//       <View style={{ alignItems: "center", marginBottom: 30 }}>
//         <View
//           style={[
//             styles.iconBox,
//             {
//               marginBottom: 15,
//               width: 60,
//               height: 60,
//               alignItems: "center",
//               justifyContent: "center",
//             },
//           ]}
//         >
//           <MaterialCommunityIcons
//             name={isLogin ? "login" : "account-plus"}
//             size={32}
//             color="white"
//           />
//         </View>
//         <Text style={styles.loginTitle}>
//           {isLogin ? "Welcome Back" : "Create Account"}
//         </Text>
//       </View>

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//         keyboardType="email-address"
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       {/* Show Target Days only for Signup */}
//       {!isLogin && (
//         <View>
//           <TextInput
//             style={styles.input}
//             placeholder="Target Days (e.g. 30)"
//             value={targetDays}
//             onChangeText={setTargetDays}
//             keyboardType="numeric"
//           />
//           <Text
//             style={{
//               color: "#888",
//               fontSize: 12,
//               marginTop: -10,
//               marginBottom: 15,
//               marginLeft: 5,
//             }}
//           >
//             Your goal duration in days
//           </Text>
//         </View>
//       )}

//       <TouchableOpacity style={styles.button} onPress={handleAuth}>
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>
//             {isLogin ? "Sign In" : "Sign Up"}
//           </Text>
//         )}
//       </TouchableOpacity>

//       <TouchableOpacity
//         onPress={() => setIsLogin(!isLogin)}
//         style={{ marginTop: 20 }}
//       >
//         <Text style={{ color: "#009688", fontWeight: "600" }}>
//           {isLogin
//             ? "Don't have an account? Sign Up"
//             : "Already have an account? Log In"}
//         </Text>
//       </TouchableOpacity>
//     </KeyboardAvoidingView>
//   );
// };

// // --- MAIN APP ---
// export default function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [initialUserData, setInitialUserData] = useState(null);
//   const [isSigningUp, setIsSigningUp] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (u) => {
//       // During signup, don't set user yet - wait for API to complete
//       if (!isSigningUp) {
//         setUser(u);
//         setLoading(false);
//       }
//       // Clear initial data when user logs out
//       if (!u) {
//         setInitialUserData(null);
//       }
//     });
//     return unsubscribe;
//   }, [isSigningUp]);

//   // Called when signup API completes successfully
//   const handleSignupComplete = (userData) => {
//     setInitialUserData(userData);
//     setUser(auth.currentUser); // Now set the user after data is ready
//     setIsSigningUp(false);
//   };

//   if (loading)
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator />
//       </View>
//     );

//   return user ? (
//     <Dashboard user={user} handleLogout={() => signOut(auth)} initialUserData={initialUserData} />
//   ) : (
//     <LoginScreen
//       onSignupComplete={handleSignupComplete}
//       onSignupStart={() => setIsSigningUp(true)}
//       onSignupError={() => setIsSigningUp(false)}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: "#F5F5F4" },
//   centerContainer: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   dashboardContainer: { padding: 24 },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 24,
//     marginTop: 10,
//   },
//   headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
//   iconBox: {
//     backgroundColor: "#009688",
//     padding: 8,
//     borderRadius: 8,
//     marginRight: 10,
//   },
//   headerTitle: { fontSize: 20, fontWeight: "bold", color: "#292524" },
//   headerSubtitle: {
//     fontSize: 12,
//     color: "#78716C",
//     textTransform: "uppercase",
//     letterSpacing: 1,
//   },
//   card: {
//     backgroundColor: "rgba(255,255,255,0.8)",
//     padding: 20,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: "#D6D3D1",
//     marginBottom: 24,
//   },
//   cardTitle: {
//     fontSize: 24,
//     fontWeight: "300",
//     color: "#292524",
//     marginBottom: 8,
//   },
//   cardText: { color: "#44403C" },
//   grid: { flexDirection: "row", gap: 15, justifyContent: "space-between" },
//   statCard: {
//     flex: 1,
//     backgroundColor: "#FAFAF9",
//     borderColor: "#E7E5E4",
//     borderWidth: 1,
//     borderRadius: 12,
//     padding: 16,
//   },
//   statHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
//   statLabel: {
//     fontSize: 10,
//     color: "#78716C",
//     fontWeight: "bold",
//     letterSpacing: 0.5,
//   },
//   statValue: { fontSize: 16, color: "#292524" },
//   statValueAccent: { fontSize: 32, fontWeight: "300", color: "#009688" },
//   statValueMono: {
//     fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
//     fontSize: 12,
//     color: "#57534E",
//   },
//   loginTitle: { fontSize: 28, fontWeight: "bold", color: "#292524" },
//   input: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: "#009688",
//     height: 50,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
// });

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

// Your Production API
const API_URL_BASE = "https://www.volvox.guru/api";

// --- COMPONENT: Dashboard ---
const Dashboard = ({ user, handleLogout, initialUserData }) => {
  // Use passed data immediately, or null if this is a fresh login
  const [userData, setUserData] = useState(initialUserData || null);
  const [loading, setLoading] = useState(!initialUserData);

  useEffect(() => {
    // Only fetch if we didn't get data passed down from signup
    if (!initialUserData) {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_URL_BASE}/user/${user.uid}`);
      const data = await response.json();

      if (response.ok) {
        setUserData(data);
      } else {
        // Optional: You could add the retry logic here as a backup
        // just in case of network blips, but your current setup is solid.
        console.log("MongoDB Error:", data.error);
      }
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", "Could not load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#009688" />
        <Text style={{ marginTop: 10 }}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.dashboardContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons
                name="view-dashboard"
                size={24}
                color="white"
              />
            </View>
            <View>
              <Text style={styles.headerTitle}>Dashboard</Text>
              <Text style={styles.headerSubtitle}>Welcome back</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Feather name="log-out" size={22} color="#555" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Hello, {user.email?.split("@")[0]}
          </Text>
          <Text style={styles.cardText}>
            Here's an overview of your account.
          </Text>
        </View>

        {userData ? (
          <>
            <View style={styles.grid}>
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Feather
                    name="target"
                    size={18}
                    color="#009688"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.statLabel}>TARGET DAYS</Text>
                </View>
                <Text style={styles.statValueAccent}>
                  {userData.targetDays}
                </Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Feather
                    name="calendar"
                    size={18}
                    color="#009688"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.statLabel}>CREATED</Text>
                </View>
                <Text style={styles.statValue}>
                  {new Date(userData.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View style={[styles.statCard, { marginTop: 15 }]}>
              <View style={styles.statHeader}>
                <Feather
                  name="hash"
                  size={18}
                  color="#009688"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.statLabel}>USER ID</Text>
              </View>
              <Text style={styles.statValueMono}>{userData.firebaseUid}</Text>
            </View>
          </>
        ) : (
          <View style={styles.card}>
            <Text style={{ color: "red" }}>User data not found.</Text>
            <TouchableOpacity onPress={fetchUserData} style={{ marginTop: 10 }}>
              <Text style={{ color: "#009688" }}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- COMPONENT: Login / Signup Screen ---
const LoginScreen = ({ onSignupComplete, onSignupStart, onSignupError }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetDays, setTargetDays] = useState("30");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isLogin) {
        // --- LOGIN FLOW ---
        await signInWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged handles the rest
      } else {
        // --- SIGNUP FLOW ---
        onSignupStart(); // Pause auth listener

        // 1. Create User in Firebase
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const firebaseUser = userCredential.user;

        // 2. Create User in MongoDB via API
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

        if (!response.ok) {
          throw new Error(result.error || "Failed to create database record");
        }

        // 3. Prepare data for Dashboard
        const newUserData = result.user ||
          result || {
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            targetDays: parseInt(targetDays, 10),
            createdAt: new Date().toISOString(),
          };

        // 4. Complete flow
        onSignupComplete(newUserData);
      }
    } catch (e) {
      let msg = e.message;
      if (msg.includes("auth/email-already-in-use"))
        msg = "Email already in use.";
      Alert.alert("Error", msg);

      // If signup failed, re-enable auth listener so user isn't stuck
      if (!isLogin) {
        onSignupError();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.centerContainer}
    >
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
        <Text style={styles.loginTitle}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {!isLogin && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Target Days (e.g. 30)"
            value={targetDays}
            onChangeText={setTargetDays}
            keyboardType="numeric"
          />
          <Text
            style={{
              color: "#888",
              fontSize: 12,
              marginTop: -10,
              marginBottom: 15,
              marginLeft: 5,
            }}
          >
            Your goal duration in days
          </Text>
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
        <Text style={{ color: "#009688", fontWeight: "600" }}>
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Log In"}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

// --- MAIN APP ---
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialUserData, setInitialUserData] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      // If we are currently signing up, ignore this update.
      // We will set the user manually in handleSignupComplete
      if (!isSigningUp) {
        setUser(u);
        setLoading(false);
      }
      if (!u) {
        setInitialUserData(null);
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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#009688" />
      </View>
    );

  return user ? (
    <Dashboard
      user={user}
      handleLogout={() => signOut(auth)}
      initialUserData={initialUserData}
    />
  ) : (
    <LoginScreen
      onSignupComplete={handleSignupComplete}
      onSignupStart={() => setIsSigningUp(true)}
      onSignupError={() => setIsSigningUp(false)}
    />
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F5F4" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  dashboardContainer: { padding: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 10,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBox: {
    backgroundColor: "#009688",
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#292524" },
  headerSubtitle: {
    fontSize: 12,
    color: "#78716C",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D6D3D1",
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "300",
    color: "#292524",
    marginBottom: 8,
  },
  cardText: { color: "#44403C" },
  grid: { flexDirection: "row", gap: 15, justifyContent: "space-between" },
  statCard: {
    flex: 1,
    backgroundColor: "#FAFAF9",
    borderColor: "#E7E5E4",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  statHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  statLabel: {
    fontSize: 10,
    color: "#78716C",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  statValue: { fontSize: 16, color: "#292524" },
  statValueAccent: { fontSize: 32, fontWeight: "300", color: "#009688" },
  statValueMono: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 12,
    color: "#57534E",
  },
  loginTitle: { fontSize: 28, fontWeight: "bold", color: "#292524" },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#009688",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
