import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Path, Line, Circle, G } from "react-native-svg";
import BoltLightningIcon from "../../assets/images/bolt-lightning.svg";

type ActivityStatus = "pending" | "completed" | "skipped";

type TimeOfDay = "morning" | "afternoon" | "evening";

const EnergyForecastChart = () => {
  const width = 320;
  const height = 120;
  const padding = 20;
  const optimalData = [85, 90, 88, 82, 78, 75, 72, 70, 65, 62];
  const currentData = [75, 80, 78, 70, 65, 58, 52, 48, 42, 38];

  const maxValue = 100;
  const minValue = 0;

  const createPath = (data: number[]) => {
    const points = data.map((value, index) => {
      const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
      const y =
        height -
        padding -
        ((value - minValue) / (maxValue - minValue)) * (height - 2 * padding);
      return { x, y };
    });

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;

      path += ` Q ${controlX} ${current.y}, ${controlX} ${(current.y + next.y) / 2}`;
      path += ` Q ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }

    return path;
  };

  return (
    <View style={styles.chartContainer}>
      <Svg width={width} height={height}>
        <Line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#E5E7EB"
          strokeWidth="1"
        />

        <Path
          d={createPath(currentData)}
          stroke="#8B4513"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        <Path
          d={createPath(optimalData)}
          stroke="#0D9488"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        <Circle
          cx={
            padding +
            ((optimalData.length - 1) * (width - 2 * padding)) /
              (optimalData.length - 1)
          }
          cy={
            height -
            padding -
            ((optimalData[optimalData.length - 1] - minValue) /
              (maxValue - minValue)) *
              (height - 2 * padding)
          }
          r="4"
          fill="#0D9488"
        />
        <Circle
          cx={
            padding +
            ((currentData.length - 1) * (width - 2 * padding)) /
              (currentData.length - 1)
          }
          cy={
            height -
            padding -
            ((currentData[currentData.length - 1] - minValue) /
              (maxValue - minValue)) *
              (height - 2 * padding)
          }
          r="4"
          fill="#8B4513"
        />
      </Svg>
    </View>
  );
};

export default function DailyPlanScreen() {
  const [selectedActivity, setSelectedActivity] = useState<{
    timeOfDay: TimeOfDay;
    activityId: string;
  } | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  const handleStatusChange = (status: ActivityStatus) => {
    if (!selectedActivity) return;

    setShowActionModal(false);
    setSelectedActivity(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BioSync Travel</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.pageTitleContainer}>
          <BoltLightningIcon
            style={styles.energyLevelTitleIcon}
            width={20}
            height={20}
            fill="#0D9488"
          />
          <Text style={styles.pageTitle}>Energy Level Warning</Text>
        </View>

        <View style={styles.energySection}>
          <Text style={styles.energyLabel}>
            Your energy level has suddenly dropped. Would you like to adjust
            your plan?
          </Text>
          <View style={styles.energyButtonsContainer}>
            <Pressable style={styles.noChangesButton}>
              <Text style={styles.noChangesButtonText}>No Changes</Text>
            </Pressable>
            <Pressable style={styles.adjustPlanButtonEnergy}>
              <Text style={styles.adjustPlanButtonTextEnergy}>Adjust Plan</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.currentEnergyCard}>
          <Text style={styles.currentEnergyTitle}>Current Energy Level</Text>
          <View style={styles.currentEnergyCircleContainer}>
            <Svg width={120} height={120}>
              <Circle
                cx={60}
                cy={60}
                r={50}
                stroke="#E5E7EB"
                strokeWidth={10}
                fill="none"
              />
              <Circle
                cx={60}
                cy={60}
                r={50}
                stroke="#EF4444"
                strokeWidth={10}
                fill="none"
                strokeDasharray={`${(65 / 100) * 2 * Math.PI * 50} ${2 * Math.PI * 50}`}
                strokeLinecap="round"
                rotation="-90"
                origin="60, 60"
              />
            </Svg>
            <Text style={styles.currentEnergyPercentageAbsolute}>65%</Text>
          </View>
        </View>

        <View style={styles.forecastSection}>
          <View style={styles.forecastTitleContainer}>
            <Ionicons name="analytics" size={20} color="#0D9488" />
            <Text style={styles.forecastTitle}>Daily Energy Forecast</Text>
          </View>
          <EnergyForecastChart />
          <View style={styles.forecastLabels}>
            <Text style={styles.forecastLabel}>Morning</Text>
            <Text style={styles.forecastLabel}>Afternoon</Text>
            <Text style={styles.forecastLabel}>Evening</Text>
          </View>
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
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  pageTitleContainer: {
    flexDirection: "row",
    marginHorizontal: 30,
    marginTop: 20,
    marginBottom: 16,
  },
  energyLevelTitleIcon: {
    marginTop: 7,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#0D9488",
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 16,
  },
  dateArrow: {
    backgroundColor: "#0D9488",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  dateContainer: {
    flex: 1,
    alignItems: "center",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0D9488",
  },
  energySection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  energyLabel: {
    fontSize: 16,
    color: "#11181C",
    lineHeight: 24,
    marginBottom: 24,
  },
  energyButtonsContainer: {
    flexDirection: "column",
    gap: 16,
    justifyContent: "center",
  },
  noChangesButton: {
    backgroundColor: "#B2DFDB",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    minWidth: 140,
    alignItems: "center",
  },
  noChangesButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D9488",
  },
  adjustPlanButtonEnergy: {
    backgroundColor: "#0D9488",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    minWidth: 140,
    alignItems: "center",
  },
  adjustPlanButtonTextEnergy: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  energyBadge: {
    backgroundColor: "#0D9488",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  energyPercentage: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  energyLabelText: {
    fontSize: 12,
    color: "#6B7280",
  },
  activityCard: {
    backgroundColor: "#FFFFFF",
    marginRight: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  editButton: {
    padding: 4,
  },
  editIcon: {
    fontSize: 20,
  },
  activityTime: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: "#E0F2F1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: "#0D9488",
    fontWeight: "500",
  },
  statusContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
  },
  alternativesLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  alternativesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  alternativeChip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  alternativeText: {
    fontSize: 13,
    color: "#6B7280",
  },
  updateButton: {
    backgroundColor: "#0D9488",
    marginHorizontal: 20,
    marginVertical: 24,
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  forecastSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  forecastTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  forecastTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
  },
  forecastLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 16,
  },
  forecastLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: "#E0F2F1",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#11181C",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  modalButtonsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  modalButtonCompleted: {
    backgroundColor: "#10B981",
  },
  modalButtonSkipped: {
    backgroundColor: "#EF4444",
  },
  modalButtonReset: {
    backgroundColor: "#6B7280",
  },
  modalButtonIconWrapper: {
    marginRight: 16,
  },
  modalButtonContent: {
    flex: 1,
  },
  modalButtonTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  modalButtonDescription: {
    color: "#FFFFFF",
    fontSize: 13,
    opacity: 0.9,
  },
  modalButtonCancel: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
  },
  modalButtonCancelPressed: {
    backgroundColor: "#E5E7EB",
  },
  modalButtonCancelText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  currentEnergyCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: "center",
  },
  currentEnergyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 16,
  },
  currentEnergyCircleContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  currentEnergyPercentageAbsolute: {
    position: "absolute",
    fontSize: 28,
    fontWeight: "700",
    color: "#EF4444",
  },
});
