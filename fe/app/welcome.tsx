import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import BioSyncLogo from "../assets/images/biosync-logo.svg";

export default function WelcomeScreen() {
  const router = useRouter();

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

        <View style={styles.heroImageContainer}>
          <MaterialCommunityIcons
            name="palm-tree"
            size={70}
            color="#0D9488"
            style={styles.palmIcon}
          />
          <View style={styles.heroOverlay}>
            <MaterialCommunityIcons
              name="airplane"
              size={30}
              color="#fff"
              style={styles.planeIcon}
            />
          </View>
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.mainHeading}>Travel in Harmony with</Text>
          <Text style={styles.mainHeading}>Your Body</Text>

          <Text style={styles.description}>
            BioSync Travel creates personalised travel experiences that adapt to
            your body&apos;s needs. Using your biometric data, we craft journeys
            that enhance your wellbeing and ensure you return home truly
            rejuvenated.
          </Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="moon" size={16} color="#0D9488" />
            </View>
            <Text style={styles.metricLabel}>Sleep{"\n"}Quality</Text>
          </View>
          <View style={styles.metricItem}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="head-cog"
                size={16}
                color="#0D9488"
              />
            </View>
            <Text style={styles.metricLabel}>Stress{"\n"}Levels</Text>
          </View>
          <View style={styles.metricItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="flash" size={16} color="#0D9488" />
            </View>
            <Text style={styles.metricLabel}>Energy{"\n"}State</Text>
          </View>
          <View style={styles.metricItem}>
            <View style={styles.iconCircle}>
              <FontAwesome5 name="heartbeat" size={14} color="#0D9488" />
            </View>
            <Text style={styles.metricLabel}>Heart{"\n"}Rate</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.ctaButtonPressed,
          ]}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.ctaButtonText}>Get Started</Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color="#fff"
            style={styles.arrowIcon}
          />
        </Pressable>

        <Text style={styles.subtitle}>
          Your journey to wellness begins here
        </Text>
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
    paddingBottom: 40,
  },
  card: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0D9488",
    marginLeft: 10,
  },
  heroImageContainer: {
    width: "100%",
    height: 160,
    backgroundColor: "#B8E5ED",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    overflow: "hidden",
    position: "relative",
  },
  heroEmoji: {
    fontSize: 80,
  },
  palmIcon: {
    opacity: 0.8,
  },
  heroOverlay: {
    position: "absolute",
    top: 20,
    right: 20,
    opacity: 0.7,
  },
  planeIcon: {
    transform: [{ rotate: "45deg" }],
  },
  messageContainer: {
    marginBottom: 32,
  },
  mainHeading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0D9488",
    textAlign: "center",
    lineHeight: 28,
  },
  description: {
    fontSize: 13,
    color: "#333",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 20,
    paddingHorizontal: 4,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 12,
  },
  metricItem: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8F4F8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  metricLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    lineHeight: 16,
  },
  ctaButton: {
    backgroundColor: "#0D9488",
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    marginTop: 8,
    shadowColor: "#0D9488",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaButtonPressed: {
    backgroundColor: "#0B7A6F",
    transform: [{ scale: 0.98 }],
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  arrowIcon: {
    marginLeft: 4,
  },
  subtitle: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
});
