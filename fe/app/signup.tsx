import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BioSyncLogo from "../assets/images/biosync-logo.svg";

export default function SignUpScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const totalSteps = 5;

  function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function canGoNext() {
    switch (currentStep) {
      case 1:
        return firstName.trim().length > 0;
      case 2:
        return lastName.trim().length > 0;
      case 3:
        return validateEmail(email);
      case 4:
        return password.length >= 6;
      case 5:
        return confirmPassword === password;
      default:
        return false;
    }
  }

  function handleNext() {
    if (!canGoNext()) {
      let errorMessage = "";
      switch (currentStep) {
        case 1:
          errorMessage = "Please enter your first name";
          break;
        case 2:
          errorMessage = "Please enter your last name";
          break;
        case 3:
          errorMessage = "Please enter a valid email address";
          break;
        case 4:
          errorMessage = "Password must be at least 6 characters";
          break;
        case 5:
          errorMessage = "Passwords do not match";
          break;
      }
      Alert.alert("Error", errorMessage);
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      signUpWithEmail();
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  }

  async function signUpWithEmail() {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
        emailRedirectTo: undefined,
      },
    });

    setLoading(false);

    if (error) {
      if (
        error.message.includes("already registered") ||
        error.message.includes("already been registered") ||
        error.message.includes("User already registered")
      ) {
        Alert.alert(
          "Account Already Exists",
          "This email is already registered. Please login instead or use a different email address.",
          [
            {
              text: "Go to Login",
              onPress: () => router.replace("/login"),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
        );
        return;
      }

      Alert.alert("Error", error.message);
      return;
    }

    if (data?.user) {
      if (data.user.identities && data.user.identities.length === 0) {
        Alert.alert(
          "Account Already Exists",
          "This email is already registered. Please login instead.",
          [
            {
              text: "Go to Login",
              onPress: () => router.replace("/login"),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
        );
        return;
      }

      router.replace({
        pathname: "/otp",
        params: { email: email },
      });
    }
  }

  function renderStepContent() {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What&apos;s your first name?</Text>
            <Text style={styles.stepDescription}>
              Let us know how to address you
            </Text>
            <TextInput
              style={styles.input}
              placeholder="John"
              placeholderTextColor="#999"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={handleNext}
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>And your last name?</Text>
            <Text style={styles.stepDescription}>
              We&apos;re almost there!
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Doe"
              placeholderTextColor="#999"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={handleNext}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What&apos;s your email?</Text>
            <Text style={styles.stepDescription}>
              We&apos;ll use this to create your account
            </Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={handleNext}
            />
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Create a password</Text>
            <Text style={styles.stepDescription}>
              Must be at least 6 characters
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="next"
                onSubmitEditing={handleNext}
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
        );
      case 5:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Confirm your password</Text>
            <Text style={styles.stepDescription}>
              Let&apos;s make sure it matches
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                returnKeyType="done"
                onSubmitEditing={handleNext}
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#999"
                />
              </Pressable>
            </View>
          </View>
        );
      default:
        return null;
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
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
            <View style={styles.progressContainer}>
              {Array.from({ length: totalSteps }).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    index < currentStep && styles.progressDotActive,
                  ]}
                />
              ))}
            </View>

            {renderStepContent()}

            <View style={styles.buttonRow}>
              <Pressable
                style={styles.backButton}
                onPress={handleBack}
                disabled={loading}
              >
                <Ionicons name="arrow-back" size={20} color="#0D9488" />
                <Text style={styles.backButtonText}>Back</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.nextButton,
                  !canGoNext() && styles.nextButtonDisabled,
                ]}
                onPress={handleNext}
                disabled={loading || !canGoNext()}
              >
                <Text style={styles.nextButtonText}>
                  {loading
                    ? "Creating..."
                    : currentStep === totalSteps
                      ? "Sign Up"
                      : "Next"}
                </Text>
                {currentStep < totalSteps && (
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                )}
              </Pressable>
            </View>
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

            <View style={styles.signInSection}>
              <View style={styles.signInTextContainer}>
                <Text style={styles.signInText}>Already have an account?</Text>
              </View>
              <Pressable
                style={styles.signInButton}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
              </Pressable>
            </View>

            <Text style={styles.tagline}>
              Personalized travel experiences based on your wellbeing
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginTop: 15,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    gap: 8,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
  },
  progressDotActive: {
    backgroundColor: "#0D9488",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepContent: {
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0D9488",
    marginBottom: 12,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 15,
    color: "#666",
    marginBottom: 28,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#000",
    textAlign: "center",
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
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
  eyeButton: {
    position: "absolute",
    right: 15,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#0D9488",
    gap: 8,
  },
  backButtonText: {
    color: "#0D9488",
    fontSize: 16,
    fontWeight: "600",
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#0D9488",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: "#B0D9D5",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  signInSection: {
    backgroundColor: "#C2F5F0",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  signInTextContainer: {
    flex: 1,
  },
  signInText: {
    fontSize: 12,
    color: "#333",
    lineHeight: 18,
  },
  signInButton: {
    backgroundColor: "#14B8A6",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  signInButtonText: {
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
