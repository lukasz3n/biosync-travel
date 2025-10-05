import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

function MoodMeterWarning() {
  const router = useRouter();

  return (
    <View style={styles.moodMeterWarningCard}>
      <View style={styles.moodMeterWarningHeader}>
        <Text style={styles.moodMeterWarningTitle}>Warning</Text>
      </View>

      <View style={styles.moodMeterWarningContent}>
        <Pressable
          style={styles.adjustPlanButton}
          onPress={() => router.push("/energy-level")}
        >
          <Text style={styles.adjustPlanButtonText}>Adjust Plan</Text>
        </Pressable>
      </View>
    </View>
  );
}

const MoodMeter = React.memo(function MoodMeter({
  moodValue,
  handleValueChange,
}: {
  moodValue: number;
  handleValueChange: (value: number) => void;
}) {
  const getMoodIcon = () => {
    if (moodValue <= 35) {
      return <Ionicons name="sad" size={48} color="#EF4444" />;
    } else if (moodValue >= 66) {
      return <Ionicons name="happy" size={48} color="#10B981" />;
    } else {
      return <Ionicons name="happy-outline" size={48} color="#F59E0B" />;
    }
  };

  return (
    <View style={styles.moodMeterCard}>
      <Text style={styles.moodMeterTitle}>Mood Meter</Text>

      <View style={styles.moodMeterContent}>
        <View style={styles.moodIconContainer}>{getMoodIcon()}</View>

        <View style={styles.moodSliderContainer}>
          <Slider
            style={styles.moodSlider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={moodValue}
            onValueChange={handleValueChange}
            minimumTrackTintColor="#0D9488"
            maximumTrackTintColor="#D1D5DB"
            thumbTintColor="#0D9488"
            accessibilityLabel="Mood intensity slider"
            accessibilityHint="Drag to adjust your current mood level"
          />
          <View style={styles.moodLabelsRow}>
            <Text style={styles.moodLabelLeft}>Low</Text>
            <Text style={styles.moodLabelCenter}>{moodValue}%</Text>
            <Text style={styles.moodLabelRight}>High</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

export default function HomeScreen() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [createdTrip, setCreatedTrip] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<"user1" | "user2">("user1");
  // Set initial mood based on user
  const initialMood = currentUser === "user2" ? 25 : 58;
  const [moodValue, setMoodValue] = useState(initialMood);

  // Update mood when user changes
  React.useEffect(() => {
    setMoodValue(currentUser === "user2" ? 25 : 58);
  }, [currentUser]);

  const handleValueChange = useCallback((value: number) => {
    setMoodValue(Math.round(value));
  }, []);

  // TEMPORARY: Clear AsyncStorage on mount for testing
  useEffect(() => {
    const clearStorage = async () => {
      await AsyncStorage.removeItem("tripCreated");
      await AsyncStorage.removeItem("currentTrip");
      console.log("AsyncStorage cleared for fresh start");
    };
    clearStorage();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    return () => {
      subscription.subscription?.unsubscribe();
    };
  }, []);

  // Check for created trip from AsyncStorage and load current user
  useFocusEffect(
    useCallback(() => {
      const loadCreatedTrip = async () => {
        try {
          const tripData = await AsyncStorage.getItem("currentTrip");
          const tripCreated = await AsyncStorage.getItem("tripCreated");
          const user = await AsyncStorage.getItem("currentUser");

          if (user) {
            setCurrentUser(user as "user1" | "user2");
          }

          if (tripCreated === "true" && tripData) {
            setCreatedTrip(JSON.parse(tripData));
          } else {
            setCreatedTrip(null);
          }
        } catch (error) {
          console.error("Error loading created trip:", error);
        }
      };

      loadCreatedTrip();
    }, []),
  );

  // Calculate energy percentage based on user
  const energyPercentage = currentUser === "user2" ? 35 : 87;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Welcome, {session?.user?.user_metadata?.first_name || "Sophia"}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {createdTrip ? (
          <View style={styles.demoTripCard}>
            <View style={styles.demoTripHeader}>
              <View style={styles.demoTripStatusRow}>
                <Text style={styles.demoTripStatusLabel}>
                  Current Trip Status
                </Text>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>
            </View>

            <View style={styles.demoTripContent}>
              <Image
                source={{
                  uri: "https://overhere-media.s3.amazonaws.com/images/Travel_guide_to_Krakow..max-1280x768.jpg",
                }}
                style={styles.demoTripImage}
                resizeMode="cover"
              />
              <View style={styles.demoTripInfo}>
                <Text style={styles.demoTripTitle}>
                  {createdTrip.destination || "Cracow, Poland"}
                </Text>
                <Text style={styles.demoTripDay}>
                  {new Date(createdTrip.start_date).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    },
                  )}{" "}
                  -{" "}
                  {new Date(createdTrip.end_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>

                <View style={styles.demoProgressContainer}>
                  <View style={styles.demoProgressBar}>
                    <View style={[styles.demoProgressFill, { width: "15%" }]} />
                  </View>
                  <Text style={styles.demoProgressText}>
                    Day 1 - Just started!
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <>
            {/* No trip created - show Create Trip button */}
            <Pressable
              style={styles.createTripButton}
              onPress={() => {
                // Navigate to trips tab and open modal
                router.push("/(tabs)/trips?openModal=true");
              }}
            >
              <Ionicons name="add-circle" size={24} color="#FFFFFF" />
              <Text style={styles.createTripButtonText}>Create Trip</Text>
            </Pressable>
          </>
        )}

        <View style={styles.wellbeingCard}>
          <Text style={styles.wellbeingTitle}>Wellbeing Score</Text>

          <View style={styles.wellbeingContent}>
            <View style={styles.energyCircleContainer}>
              <View
                style={[
                  styles.energyCircleOuter,
                  currentUser === "user2" && { backgroundColor: "#EF4444" },
                ]}
              >
                <View style={styles.energyCircleInner}>
                  <Text
                    style={[
                      styles.energyPercentage,
                      currentUser === "user2" && { color: "#EF4444" },
                    ]}
                  >
                    {energyPercentage}%
                  </Text>
                </View>
              </View>
              <Text style={styles.energyLabel}>Energy lvl</Text>
            </View>

            <View style={styles.metricsColumn}>
              <View style={styles.metricRow}>
                <Ionicons name="heart" size={20} color="#EF4444" />
                <View style={styles.metricInfo}>
                  <Text style={styles.healthMetricLabel}>Heart Rate</Text>
                  <Text style={styles.healthMetricValue}>72</Text>
                </View>
              </View>

              <View style={styles.metricRow}>
                <Ionicons name="thunderstorm" size={20} color="#8B5CF6" />
                <View style={styles.metricInfo}>
                  <Text style={styles.healthMetricLabel}>Stress Level</Text>
                  <Text style={styles.healthMetricValue}>Medium</Text>
                </View>
              </View>

              <View style={styles.metricRow}>
                <Ionicons name="walk" size={20} color="#10B981" />
                <View style={styles.metricInfo}>
                  <Text style={styles.healthMetricLabel}>Steps</Text>
                  <Text style={styles.healthMetricValue}>6,200</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.wellbeingAdvice}>
            <Text style={styles.adviceText}>
              Your energy levels are lower today. Consider more relaxing
              activities.
            </Text>
          </View>
        </View>

        <View style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>
            <Text style={styles.recommendationTitle}>
              Today’s Recommendation
            </Text>
          </View>

          <View style={styles.recommendationContent}>
            <Image
              source={{
                uri: "https://photos.smugmug.com/Krakow/Old-Town-Guide/i-npz2THv/0/3debf8c9/L/krakow-old-town-planty-park-L.jpg",
              }}
              style={styles.recommendationImage}
              resizeMode="cover"
            />
            <View style={styles.recommendationInfo}>
              <Text style={styles.recommendationPlaceName}>
                Planty Park, Cracov
              </Text>
              <Text style={styles.recommendationDescription}>
                Perfect for your current energy level
              </Text>

              <View style={styles.energyRequiredRow}>
                <Ionicons name="battery-half" size={18} color="#F59E0B" />
                <Text style={styles.energyRequiredText}>
                  Medium energy required
                </Text>
              </View>

              <Pressable style={styles.viewDetailsButton}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </View>

        <MoodMeter
          handleValueChange={handleValueChange}
          moodValue={moodValue}
        />
        {moodValue < 30 && <MoodMeterWarning />}

        <View style={styles.inspirationCard}>
          <Text style={styles.inspirationTitle}>Daily Inspiration</Text>
          <Text style={styles.inspirationQuote}>
            “Travel isn’t just about seeing new places, but about finding
            balance and renewal wherever you go.”
          </Text>
          <Text style={styles.inspirationAuthor}>- Dr. Maya Richards</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4F8",
  },
  header: {
    backgroundColor: "#0D9488",
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  statsSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
  },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2F1",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 6,
  },
  chipIcon: {
    marginRight: 2,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0D9488",
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0D9488",
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionText: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    color: "#11181C",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  metricCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  metricLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#11181C",
  },
  recoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  recoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#11181C",
    marginBottom: 6,
  },
  recoDesc: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
  },
  loadingCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  currentTripCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  currentTripHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    paddingBottom: 12,
  },
  currentTripTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0D9488",
  },
  currentTripImageContainer: {
    width: "100%",
    height: 180,
    backgroundColor: "#E0F2F1",
  },
  currentTripImage: {
    width: "100%",
    height: 180,
  },
  currentTripImagePlaceholder: {
    width: "100%",
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0F2F1",
  },
  currentTripInfo: {
    padding: 16,
  },
  currentTripName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#11181C",
    marginBottom: 8,
  },
  currentTripDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 16,
  },
  currentTripProgress: {
    gap: 8,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#E0F2F1",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0D9488",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D9488",
    textAlign: "center",
  },
  firstGoalCard: {
    backgroundColor: "#F0FDFA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#14B8A6",
  },
  firstGoalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  firstGoalTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0D9488",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  firstGoalName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#11181C",
    marginBottom: 6,
  },
  firstGoalDesc: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    fontSize: 13,
    color: "#6B7280",
    flex: 1,
  },
  startButton: {
    backgroundColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 8,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  demoTripCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  demoTripHeader: {
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  demoTripStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  demoTripStatusLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#10B981",
  },
  demoTripContent: {
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
  demoTripImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  demoTripInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  demoTripTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#11181C",
    marginBottom: 4,
  },
  demoTripDay: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  demoProgressContainer: {
    gap: 6,
  },
  demoProgressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#E0F2F1",
    borderRadius: 3,
    overflow: "hidden",
  },
  demoProgressFill: {
    height: "100%",
    backgroundColor: "#0D9488",
    borderRadius: 3,
  },
  demoProgressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0D9488",
  },
  wellbeingCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wellbeingTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#11181C",
    marginBottom: 20,
  },
  wellbeingContent: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 16,
  },
  energyCircleContainer: {
    alignItems: "center",
    gap: 8,
  },
  energyCircleOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#0D9488",
    alignItems: "center",
    justifyContent: "center",
  },
  energyCircleInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  energyPercentage: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0D9488",
  },
  energyLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  metricsColumn: {
    flex: 1,
    gap: 12,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metricInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  healthMetricLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  healthMetricValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#11181C",
  },
  wellbeingAdvice: {
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  adviceText: {
    fontSize: 13,
    color: "#92400E",
    lineHeight: 18,
  },
  recommendationCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  recommendationHeader: {
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#11181C",
  },
  recommendationContent: {
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
  recommendationImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  recommendationInfo: {
    flex: 1,
    gap: 8,
  },
  recommendationPlaceName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#11181C",
  },
  recommendationDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  energyRequiredRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  energyRequiredText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#F59E0B",
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0D9488",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
    marginTop: 4,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  moodMeterCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodMeterTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#11181C",
    marginBottom: 20,
  },
  moodMeterContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  moodIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  moodSliderContainer: {
    flex: 1,
  },
  moodSlider: {
    width: "100%",
    height: 38,
    marginBottom: 8,
  },
  moodLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  moodLabelLeft: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  moodLabelCenter: {
    fontSize: 16,
    color: "#0D9488",
    fontWeight: "700",
  },
  moodLabelRight: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  moodMeterWarningCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  moodMeterWarningHeader: {
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  moodMeterWarningTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "orange",
  },
  moodMeterWarningContent: {
    flexDirection: "row",
    padding: 16,
    gap: 16,
    justifyContent: "center",
  },
  adjustPlanButton: {
    backgroundColor: "#0D9488",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 4,
  },
  adjustPlanButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  inspirationCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#0D9488",
  },
  inspirationTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#11181C",
    marginBottom: 16,
  },
  inspirationQuote: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    fontStyle: "italic",
    marginBottom: 12,
  },
  inspirationAuthor: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
    textAlign: "right",
  },
  createTripButton: {
    backgroundColor: "#0D9488",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  createTripButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
