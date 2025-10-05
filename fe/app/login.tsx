import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BioSyncLogo from "../assets/images/biosync-logo.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async function signInWithEmail() {
    // Validate user credentials
    const isUser1 = email.toLowerCase() === 'user1' && password.toLowerCase() === 'user1';
    const isUser2 = email.toLowerCase() === 'user2' && password.toLowerCase() === 'user2';

    if (!isUser1 && !isUser2) {
      Alert.alert(
        'Invalid Credentials',
        'Please enter valid credentials:\n• user1 / user1\n• user2 / user2'
      );
      return;
    }

    // Detect if user2 is logging in
    if (isUser2) {
      await AsyncStorage.setItem('currentUser', 'user2');
    } else {
      await AsyncStorage.setItem('currentUser', 'user1');
    }

    router.replace("/(tabs)");
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <BioSyncLogo
            width={50}
            height={50}
            fill="#0D9488"
          />
          <Text style={styles.appTitle}>BioSync Travel</Text>
        </View>

        <View style={styles.formWrapper}>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#999"
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={styles.signInButton}
            onPress={() => signInWithEmail()}
            disabled={loading}
          >
            <Text style={styles.signInButtonText}>
              {loading ? "Signing In..." : "Sign In"}
            </Text>
          </Pressable>

          <Pressable>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </Pressable>
        </View>

        <View style={styles.extraContent}>
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <Pressable style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Google</Text>
            </Pressable>
            <Pressable style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Facebook</Text>
            </Pressable>
            <Pressable style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Apple</Text>
            </Pressable>
          </View>

          <View style={styles.signUpSection}>
            <View style={styles.signUpTextContainer}>
              <Text style={styles.signUpText}>New to BioSync?</Text>
              <Text style={styles.signUpText}>
                Create an account to get started
              </Text>
            </View>
            <Pressable
              style={styles.signUpButton}
              onPress={() => router.push("/signup")}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </Pressable>
          </View>

          <Text style={styles.tagline}>
            Personalized travel experiences based on your wellbeing
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4F8",
  },
  scrollContent: {
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  card: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0D9488",
    marginLeft: 10,
  },
  formContainer: {
    width: "100%",
  },
  formWrapper: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 24,
    maxWidth: 400,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 50,
    marginBottom: 20,
  },
  extraContent: {
    width: "100%",
    maxWidth: 400,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 14,
    color: "#000",
  },
  passwordContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    paddingRight: 50,
    fontSize: 14,
    color: "#000",
  },
  eyeButton: {
    position: "absolute",
    right: 15,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  signInButton: {
    backgroundColor: "#0D9488",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 25,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#0D9488",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 6,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D0D0D0",
  },
  dividerText: {
    color: "#999",
    fontSize: 12,
    marginHorizontal: 12,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: "center",
  },
  socialButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  signUpSection: {
    backgroundColor: "#C2F5F0",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  signUpTextContainer: {
    flex: 1,
  },
  signUpText: {
    fontSize: 12,
    color: "#333",
    lineHeight: 18,
  },
  signUpButton: {
    backgroundColor: "#14B8A6",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  tagline: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    lineHeight: 16,
  },
});
