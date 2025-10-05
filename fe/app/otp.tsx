import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export default function OTPScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function verifyOTP() {
    if (!otp || otp.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit code");
      return;
    }

    if (!email) {
      Alert.alert("Error", "Email address not found");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.verifyOtp({
      email: email as string,
      token: otp,
      type: "signup",
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    if (data?.session) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Error", "Verification failed. Please try again.");
    }
  }

  async function resendOTP() {
    if (!email) {
      Alert.alert("Error", "Email address not found");
      return;
    }

    setResending(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: email as string,
      options: {
        shouldCreateUser: false,
      },
    });

    setResending(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Verification code has been resent to your email");
      setOtp("");
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.card}>
        {/* Logo and Title */}
        <View style={styles.header}>
          <BioSyncLogo
            width={50}
            height={50}
            fill="#0D9488"
          />
          <Text style={styles.appTitle}>BioSync Travel</Text>
        </View>

        {/* White card with form */}
        <View style={styles.formWrapper}>
          <Text style={styles.welcomeTitle}>Verify Your Email</Text>

          <Text style={styles.description}>
            We&apos;ve sent a 6-digit verification code to{"\n"}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          {/* OTP Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Verification Code</Text>
            <TextInput
              style={styles.input}
              placeholder="000000"
              placeholderTextColor="#999"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              autoCapitalize="none"
            />
          </View>

          {/* Verify Button */}
          <Pressable
            style={styles.verifyButton}
            onPress={() => verifyOTP()}
            disabled={loading}
          >
            <Text style={styles.verifyButtonText}>
              {loading ? "Verifying..." : "Verify Email"}
            </Text>
          </Pressable>

          {/* Resend Code */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn&apos;t receive the code?</Text>
            <Pressable onPress={() => resendOTP()} disabled={resending}>
              <Text style={styles.resendLink}>
                {resending ? "Sending..." : "Resend Code"}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Content outside white card */}
        <View style={styles.extraContent}>
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <Ionicons name="mail-outline" size={60} color="#0D9488" />
          </View>

          {/* Tagline */}
          <Text style={styles.tagline}>
            Check your email inbox and spam folder
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
    marginTop: 32,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  emailText: {
    color: "#0D9488",
    fontWeight: "600",
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
    fontSize: 18,
    color: "#000",
    textAlign: "center",
    letterSpacing: 8,
  },
  verifyButton: {
    backgroundColor: "#0D9488",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 16,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  resendText: {
    fontSize: 14,
    color: "#666",
  },
  resendLink: {
    fontSize: 14,
    color: "#0D9488",
    fontWeight: "600",
  },
  illustrationContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  tagline: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    lineHeight: 16,
  },
});
