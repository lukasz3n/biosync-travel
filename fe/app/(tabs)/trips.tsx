import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Modal,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Trip {
  id: string;
  name: string;
  description?: string;
  destination: string;
  start_date: string;
  end_date: string;
  status: "planned" | "active" | "completed" | "cancelled";
  created_at: string;
  preferences?: {
    culture?: boolean;
    nature?: boolean;
    gastronomy?: boolean;
    wellness?: boolean;
    shopping?: boolean;
    intensive?: boolean;
    goodMood?: boolean;
  };
}

export default function TripsScreen() {
  const params = useLocalSearchParams();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [wearableConnected, setWearableConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState<'user1' | 'user2'>('user1');
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    destination: "",
    start_date: new Date(),
    end_date: new Date(),
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [preferences, setPreferences] = useState({
    culture: true,
    nature: true,
    gastronomy: true,
    wellness: false,
    shopping: false,
    intensive: false,
    goodMood: true,
  });

  const slideAnim = useRef(new Animated.Value(1000)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Load current user from AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const user = await AsyncStorage.getItem('currentUser');
      if (user) {
        setCurrentUser(user as 'user1' | 'user2');
      }
    };
    loadUser();
  }, []);

  // Open modal if coming from create trip button
  useEffect(() => {
    if (params.openModal === 'true') {
      setModalVisible(true);
    }
  }, [params.openModal]);

  useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
      ]).start();
    } else {
      slideAnim.setValue(1000);
      fadeAnim.setValue(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible]);

  const handleCreateTrip = async () => {
    if (!formData.name.trim() || !formData.destination.trim()) {
      Alert.alert("Error", "Please fill in name and destination");
      return;
    }

    const newTrip: Trip = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      destination: formData.destination,
      start_date: formData.start_date.toISOString(),
      end_date: formData.end_date.toISOString(),
      status: "planned",
      created_at: new Date().toISOString(),
      preferences: preferences,
    };

    setTrips([newTrip, ...trips]);

    // Save trip created flag for daily plan
    await AsyncStorage.setItem('tripCreated', 'true');
    await AsyncStorage.setItem('currentTrip', JSON.stringify(newTrip));

    Alert.alert("Success", "Trip has been created!");
    setModalVisible(false);
    setFormData({
      name: "",
      description: "",
      destination: "",
      start_date: new Date(),
      end_date: new Date(),
    });
    setPreferences({
      culture: true,
      nature: true,
      gastronomy: true,
      wellness: false,
      shopping: false,
      intensive: false,
      goodMood: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getTripStatusInfo = (status: string) => {
    switch (status) {
      case "planned":
        return { label: "Planned", color: "#3B82F6", icon: "calendar-outline" };
      case "active":
        return { label: "Active", color: "#10B981", icon: "navigate-circle" };
      case "completed":
        return { label: "Completed", color: "#6B7280", icon: "checkmark-circle" };
      case "cancelled":
        return { label: "Cancelled", color: "#EF4444", icon: "close-circle" };
      default:
        return { label: status, color: "#6B7280", icon: "help-circle" };
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    Alert.alert(
      "Delete Trip",
      "Are you sure you want to delete this trip?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updatedTrips = trips.filter((t) => t.id !== tripId);
            setTrips(updatedTrips);

            // If deleting the current trip, clear ALL AsyncStorage data
            const currentTripStr = await AsyncStorage.getItem('currentTrip');
            if (currentTripStr) {
              const currentTrip = JSON.parse(currentTripStr);
              if (currentTrip.id === tripId) {
                await AsyncStorage.removeItem('tripCreated');
                await AsyncStorage.removeItem('currentTrip');
                await AsyncStorage.removeItem('dailyPlanActivities');
                await AsyncStorage.removeItem('currentEnergyLevel');
                await AsyncStorage.removeItem('energyLevelsPerDay');
              }
            }
          },
        },
      ]
    );
  }; const renderTripCard = (trip: Trip) => {
    const statusInfo = getTripStatusInfo(trip.status);
    return (
      <View key={trip.id} style={styles.tripCard}>
        <Pressable
          style={styles.deleteButton}
          onPress={() => handleDeleteTrip(trip.id)}
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </Pressable>

        <View style={styles.tripHeader}>
          <View style={styles.tripTitleRow}>
            <Ionicons name="airplane" size={24} color="#0D9488" />
            <Text style={styles.tripName}>{trip.name}</Text>
          </View>
        </View>

        <View style={styles.statusBadgeContainer}>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + "20" }]}>
            <Ionicons name={statusInfo.icon as any} size={14} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        {trip.description && (
          <Text style={styles.tripDescription}>{trip.description}</Text>
        )}

        {trip.preferences && (
          <View style={styles.preferencesContainer}>
            {trip.preferences.culture && (
              <View style={styles.preferenceTag}>
                <Ionicons name="business" size={12} color="#0D9488" />
                <Text style={styles.preferenceTagText}>Culture</Text>
              </View>
            )}
            {trip.preferences.nature && (
              <View style={styles.preferenceTag}>
                <Ionicons name="leaf" size={12} color="#10B981" />
                <Text style={styles.preferenceTagText}>Nature</Text>
              </View>
            )}
            {trip.preferences.gastronomy && (
              <View style={styles.preferenceTag}>
                <Ionicons name="restaurant" size={12} color="#F59E0B" />
                <Text style={styles.preferenceTagText}>Gastronomy</Text>
              </View>
            )}
            {trip.preferences.wellness && (
              <View style={styles.preferenceTag}>
                <Ionicons name="flower" size={12} color="#EC4899" />
                <Text style={styles.preferenceTagText}>Wellness</Text>
              </View>
            )}
            {trip.preferences.shopping && (
              <View style={styles.preferenceTag}>
                <Ionicons name="cart" size={12} color="#8B5CF6" />
                <Text style={styles.preferenceTagText}>Shopping</Text>
              </View>
            )}
            {trip.preferences.intensive && (
              <View style={styles.preferenceTag}>
                <Ionicons name="flash" size={12} color="#EF4444" />
                <Text style={styles.preferenceTagText}>Intensive</Text>
              </View>
            )}
            {trip.preferences.goodMood && (
              <View style={styles.preferenceTag}>
                <Ionicons name="happy" size={12} color="#FBBF24" />
                <Text style={styles.preferenceTagText}>Good Mood</Text>
              </View>
            )}
          </View>
        )}

        {trip.start_date && trip.end_date && (
          <View style={styles.tripDates}>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={16} color="#6B7280" />
              <Text style={styles.dateText}>
                {new Date(trip.start_date).toLocaleDateString("pl-PL")} -{" "}
                {new Date(trip.end_date).toLocaleDateString("pl-PL")}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Trips</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {trips.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="airplane-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No trips yet</Text>
            <Text style={styles.emptyText}>
              Add your first trip and start planning your adventure!
            </Text>
          </View>
        ) : (
          trips.map(renderTripCard)
        )}
      </ScrollView>

      <Pressable
        style={styles.addButton}
        onPress={() => {
          console.log("Add button pressed!");
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setModalVisible(false)}
          />
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Plan Your Journey</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#FFFFFF" />
              </Pressable>
            </View>

            <View style={styles.modalSubtitleContainer}>
              <Ionicons name="sparkles" size={20} color="#0D9488" />
              <Text style={styles.modalSubtitle}>
                Configure your travel preferences for a personalized experience
              </Text>
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={true}
            >
              {/* Biometric Data Section */}
              <View style={styles.biometricSection}>
                <Text style={styles.biometricTitle}>Biometric Data</Text>

                {!wearableConnected ? (
                  <View style={styles.biometricCard}>
                    <View style={styles.biometricHeader}>
                      <Ionicons name="watch" size={24} color="#0D9488" />
                      <Text style={styles.biometricHeaderText}>Connect Wearable Device</Text>
                    </View>
                    <Text style={styles.biometricDescription}>
                      Sync your wearable for personalized recommendations
                    </Text>
                    <View style={styles.wearableOptions}>
                      <Pressable style={styles.wearableButton}>
                        <Text style={styles.wearableButtonText}>Samsung Health</Text>
                      </Pressable>
                      <Pressable style={styles.wearableButton}>
                        <Text style={styles.wearableButtonText}>Apple Watch</Text>
                      </Pressable>
                      <Pressable style={styles.wearableButton}>
                        <Text style={styles.wearableButtonText}>Garmin</Text>
                      </Pressable>
                    </View>
                    <Pressable
                      style={styles.connectButton}
                      onPress={() => {
                        setWearableConnected(true);
                      }}
                    >
                      <Text style={styles.connectButtonText}>Connect</Text>
                    </Pressable>
                  </View>
                ) : (
                  <View style={styles.biometricCard}>
                    <View style={styles.biometricConnectedHeader}>
                      <Ionicons name="checkmark-circle" size={24} color={currentUser === 'user1' ? "#10B981" : "#EF4444"} />
                      <Text style={[styles.biometricConnectedText, { color: currentUser === 'user1' ? "#10B981" : "#EF4444" }]}>
                        Apple Watch Connected
                      </Text>
                    </View>

                    <View style={styles.biometricStats}>
                      <View style={styles.biometricStatRow}>
                        <View style={styles.biometricStatItem}>
                          <Ionicons name="heart" size={20} color={currentUser === 'user1' ? "#10B981" : "#EF4444"} />
                          <Text style={styles.biometricStatLabel}>Heart Rate</Text>
                          <Text style={styles.biometricStatValue}>{currentUser === 'user1' ? '68 BPM' : '78 BPM'}</Text>
                        </View>
                        <View style={styles.biometricStatItem}>
                          <Ionicons name="walk" size={20} color={currentUser === 'user1' ? "#10B981" : "#EF4444"} />
                          <Text style={styles.biometricStatLabel}>Steps</Text>
                          <Text style={styles.biometricStatValue}>{currentUser === 'user1' ? '8,542' : '3,210'}</Text>
                        </View>
                      </View>

                      <View style={styles.biometricStatRow}>
                        <View style={styles.biometricStatItem}>
                          <Ionicons name={currentUser === 'user1' ? "battery-charging" : "battery-half"} size={20} color={currentUser === 'user1' ? "#10B981" : "#EF4444"} />
                          <Text style={styles.biometricStatLabel}>Energy Level</Text>
                          <Text style={styles.biometricStatValue}>{currentUser === 'user1' ? '94%' : '45%'}</Text>
                        </View>
                        <View style={styles.biometricStatItem}>
                          <Ionicons name={currentUser === 'user1' ? "happy" : "sad"} size={20} color={currentUser === 'user1' ? "#10B981" : "#EF4444"} />
                          <Text style={styles.biometricStatLabel}>Stress</Text>
                          <Text style={styles.biometricStatValue}>{currentUser === 'user1' ? 'Low' : 'Moderate'}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={[styles.wellbeingBanner, { backgroundColor: currentUser === 'user1' ? "#D1FAE5" : "#FEE2E2" }]}>
                      <Ionicons name={currentUser === 'user1' ? "sparkles" : "leaf"} size={20} color={currentUser === 'user1' ? "#10B981" : "#EF4444"} />
                      <Text style={[styles.wellbeingText, { color: currentUser === 'user1' ? "#047857" : "#991B1B" }]}>
                        {currentUser === 'user1'
                          ? 'Excellent health! Perfect for high-energy activities! 🎉'
                          : 'Take it easy! Relax and enjoy calming activities 🧘'
                        }
                      </Text>
                    </View>

                    <Pressable
                      style={styles.disconnectButton}
                      onPress={() => setWearableConnected(false)}
                    >
                      <Text style={styles.disconnectButtonText}>Disconnect Device</Text>
                    </Pressable>
                  </View>
                )}
              </View>

              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Destination & Dates</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Where to?</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Search destinations"
                    placeholderTextColor="#999"
                    value={formData.destination}
                    onChangeText={(text) =>
                      setFormData({ ...formData, destination: text })
                    }
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Trip Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Summer in Paris"
                    placeholderTextColor="#999"
                    value={formData.name}
                    onChangeText={(text) =>
                      setFormData({ ...formData, name: text })
                    }
                  />
                </View>

                <View style={styles.dateRow}>
                  <View style={styles.dateInputGroup}>
                    <Text style={styles.inputLabel}>Check in</Text>
                    <Pressable
                      style={styles.dateInput}
                      onPress={() => setShowStartDatePicker(true)}
                    >
                      <Text style={styles.dateInputText}>
                        {formatDate(formData.start_date)}
                      </Text>
                      <Ionicons name="calendar" size={20} color="#0D9488" />
                    </Pressable>
                  </View>

                  <View style={styles.dateInputGroup}>
                    <Text style={styles.inputLabel}>Check out</Text>
                    <Pressable
                      style={styles.dateInput}
                      onPress={() => setShowEndDatePicker(true)}
                    >
                      <Text style={styles.dateInputText}>
                        {formatDate(formData.end_date)}
                      </Text>
                      <Ionicons name="calendar" size={20} color="#0D9488" />
                    </Pressable>
                  </View>
                </View>

                {showStartDatePicker && Platform.OS === "ios" && (
                  <View style={styles.iosDatePickerContainer}>
                    <DateTimePicker
                      value={formData.start_date}
                      mode="date"
                      display="spinner"
                      minimumDate={new Date()}
                      onChange={(_event: any, date?: Date) => {
                        if (date) {
                          setFormData({ ...formData, start_date: date });
                        }
                      }}
                      textColor="#000000"
                      style={styles.iosDatePicker}
                    />
                    <Pressable
                      style={styles.datePickerDoneButton}
                      onPress={() => setShowStartDatePicker(false)}
                    >
                      <Text style={styles.datePickerDoneText}>Done</Text>
                    </Pressable>
                  </View>
                )}

                {showStartDatePicker && Platform.OS === "android" && (
                  <DateTimePicker
                    value={formData.start_date}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={(_event: any, date?: Date) => {
                      setShowStartDatePicker(false);
                      if (date) {
                        setFormData({ ...formData, start_date: date });
                      }
                    }}
                  />
                )}

                {showEndDatePicker && Platform.OS === "ios" && (
                  <View style={styles.iosDatePickerContainer}>
                    <DateTimePicker
                      value={formData.end_date}
                      mode="date"
                      display="spinner"
                      minimumDate={formData.start_date}
                      onChange={(_event: any, date?: Date) => {
                        if (date) {
                          setFormData({ ...formData, end_date: date });
                        }
                      }}
                      textColor="#000000"
                      style={styles.iosDatePicker}
                    />
                    <Pressable
                      style={styles.datePickerDoneButton}
                      onPress={() => setShowEndDatePicker(false)}
                    >
                      <Text style={styles.datePickerDoneText}>Done</Text>
                    </Pressable>
                  </View>
                )}

                {showEndDatePicker && Platform.OS === "android" && (
                  <DateTimePicker
                    value={formData.end_date}
                    mode="date"
                    display="default"
                    minimumDate={formData.start_date}
                    onChange={(_event: any, date?: Date) => {
                      setShowEndDatePicker(false);
                      if (date) {
                        setFormData({ ...formData, end_date: date });
                      }
                    }}
                  />
                )}
              </View>

              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Travel Preferences</Text>

                <PreferenceToggle
                  icon="business"
                  label="Culture & History"
                  value={preferences.culture}
                  onToggle={() =>
                    setPreferences({ ...preferences, culture: !preferences.culture })
                  }
                />

                <PreferenceToggle
                  icon="leaf"
                  label="Nature & Outdoors"
                  value={preferences.nature}
                  onToggle={() =>
                    setPreferences({ ...preferences, nature: !preferences.nature })
                  }
                />

                <PreferenceToggle
                  icon="restaurant"
                  label="Gastronomy"
                  value={preferences.gastronomy}
                  onToggle={() =>
                    setPreferences({
                      ...preferences,
                      gastronomy: !preferences.gastronomy,
                    })
                  }
                />

                <PreferenceToggle
                  icon="flower"
                  label="Wellness & Relaxation"
                  value={preferences.wellness}
                  onToggle={() =>
                    setPreferences({ ...preferences, wellness: !preferences.wellness })
                  }
                />

                <PreferenceToggle
                  icon="cart"
                  label="Shopping"
                  value={preferences.shopping}
                  onToggle={() =>
                    setPreferences({ ...preferences, shopping: !preferences.shopping })
                  }
                />

                <PreferenceToggle
                  icon="flash"
                  label="Intensive"
                  value={preferences.intensive}
                  onToggle={() =>
                    setPreferences({
                      ...preferences,
                      intensive: !preferences.intensive,
                    })
                  }
                />

                <PreferenceToggle
                  icon="happy"
                  label="Good mood"
                  value={preferences.goodMood}
                  onToggle={() =>
                    setPreferences({ ...preferences, goodMood: !preferences.goodMood })
                  }
                />
              </View>

              <View style={styles.formSection}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Description (Optional)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Add notes about your trip..."
                    placeholderTextColor="#999"
                    value={formData.description}
                    onChangeText={(text) =>
                      setFormData({ ...formData, description: text })
                    }
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </View>

              <View style={styles.buttonGroup}>
                <Pressable
                  style={styles.primaryButton}
                  onPress={handleCreateTrip}
                >
                  <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>Create Detailed Trip</Text>
                </Pressable>
              </View>
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}

interface PreferenceToggleProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onToggle: () => void;
}

function PreferenceToggle({ icon, label, value, onToggle }: PreferenceToggleProps) {
  return (
    <Pressable style={styles.preferenceRow} onPress={onToggle}>
      <View style={styles.preferenceLeft}>
        <Ionicons name={icon} size={20} color="#0D9488" />
        <Text style={styles.preferenceLabel}>{label}</Text>
      </View>
      <Pressable
        style={[styles.toggle, value && styles.toggleActive]}
        onPress={onToggle}
      >
        <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
      </Pressable>
    </Pressable>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#11181C",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  tripCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  tripTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  tripName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
    flex: 1,
  },
  statusBadgeContainer: {
    marginBottom: 12,
    alignItems: "flex-start",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  tripDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
    lineHeight: 20,
  },
  preferencesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  preferenceTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F0FDFA",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#5EEAD4",
  },
  preferenceTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#0F766E",
  },
  tripDates: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    color: "#6B7280",
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0D9488",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: "#E8F4F8",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "92%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "#0D9488",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  modalSubtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  modalSubtitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#0D9488",
    lineHeight: 22,
  },
  modalScroll: {
    flex: 1,
    paddingBottom: 20,
  },
  modalScrollContent: {
    paddingBottom: 80,
  },
  formSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#11181C",
  },
  textArea: {
    borderRadius: 16,
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  dateInputGroup: {
    flex: 1,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dateInputText: {
    fontSize: 14,
    color: "#11181C",
  },
  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  preferenceLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  preferenceLabel: {
    fontSize: 15,
    color: "#11181C",
  },
  toggle: {
    width: 52,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#D1D5DB",
    padding: 3,
    justifyContent: "center",
  },
  toggleActive: {
    backgroundColor: "#0D9488",
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
  },
  toggleThumbActive: {
    alignSelf: "flex-end",
  },
  buttonGroup: {
    marginTop: 8,
    gap: 12,
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: "#0D9488",
    borderRadius: 25,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#0D9488",
    borderRadius: 25,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  secondaryButtonText: {
    color: "#0D9488",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  iosDatePickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  iosDatePicker: {
    backgroundColor: "#FFFFFF",
    height: 200,
  },
  datePickerDoneButton: {
    backgroundColor: "#0D9488",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 12,
  },
  datePickerDoneText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  biometricSection: {
    backgroundColor: "#F0FDFA",
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#5EEAD4",
  },
  biometricTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0D9488",
    marginBottom: 16,
  },
  biometricCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  biometricHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  biometricHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
    flex: 1,
  },
  biometricDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    lineHeight: 20,
  },
  wearableOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  wearableButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  wearableButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  connectButton: {
    backgroundColor: "#0D9488",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  biometricConnectedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  biometricConnectedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10B981",
  },
  biometricStats: {
    gap: 12,
    marginBottom: 16,
  },
  biometricStatRow: {
    flexDirection: "row",
    gap: 12,
  },
  biometricStatItem: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 6,
  },
  biometricStatLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  biometricStatValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#11181C",
  },
  disconnectButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  disconnectButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  wellbeingBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#D1FAE5",
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 8,
  },
  wellbeingText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#047857",
    lineHeight: 20,
    paddingBottom: 2,
  },
});

