import React from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import {
  Heart,
  MessageCircle,
  MapPin,
  Utensils,
  Star,
} from "lucide-react-native";

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  progress?: number;
  total?: number;
  isNew?: boolean;
  icon: "heart" | "message" | "map" | "utensils";
  completed: boolean;
}

const ICON_MAP = {
  heart: Heart,
  message: MessageCircle,
  map: MapPin,
  utensils: Utensils,
};

export default function AchievementsScreen() {
  const recentAchievements: Achievement[] = [
    {
      id: "calm-hero",
      title: "Calm Hero",
      description: "7 days in a row improving BioSync recovery indicator",
      points: 150,
      isNew: true,
      icon: "heart",
      completed: true,
    },
    {
      id: "quest-regeneracyjny",
      title: "Regeneration Quest",
      description: "Found 3 places where heart rate drops by 5 points",
      points: 100,
      isNew: true,
      icon: "map",
      completed: true,
    },
  ];

  const categories: Achievement[] = [
    {
      id: "calm-hero-cat",
      title: "Calm Hero",
      description: "",
      points: 0,
      progress: 1,
      total: 1,
      icon: "heart",
      completed: true,
    },
    {
      id: "cultural-exchange",
      title: "Cultural Exchange",
      description: "",
      points: 0,
      progress: 3,
      total: 4,
      icon: "message",
      completed: false,
    },
    {
      id: "quest-regeneracyjny-cat",
      title: "Regeneration Quest",
      description: "",
      points: 0,
      progress: 1,
      total: 1,
      icon: "map",
      completed: true,
    },
    {
      id: "smaki-swiata",
      title: "World Flavors",
      description: "",
      points: 0,
      progress: 1,
      total: 5,
      icon: "utensils",
      completed: false,
    },
  ];

  const allAchievements: Achievement[] = [
    {
      id: "calm-hero-all",
      title: "Calm Hero",
      description: "7 days in a row improving BioSync recovery indicator",
      points: 0,
      progress: 7,
      total: 7,
      icon: "heart",
      completed: true,
    },
    {
      id: "cultural-exchange-all",
      title: "Cultural Exchange Mission",
      description: "Conversations with local artists",
      points: 0,
      progress: 3,
      total: 4,
      icon: "message",
      completed: false,
    },
    {
      id: "quest-regeneracyjny-all",
      title: "Regeneration Quest",
      description: "Finding 3 places where heart rate drops by 5 points",
      points: 0,
      progress: 3,
      total: 3,
      icon: "map",
      completed: true,
    },
    {
      id: "smaki-swiata-all",
      title: "World Flavors",
      description: "Try 5 local dishes",
      points: 0,
      progress: 1,
      total: 5,
      icon: "utensils",
      completed: false,
    },
  ];

  const upcomingChallenges: Achievement[] = [
    {
      id: "mindful-navigation",
      title: "Mindful Navigation",
      description: "Walk the path of peace through parks and quiet streets",
      points: 75,
      icon: "map",
      completed: false,
    },
    {
      id: "kolekcjoner-momentow",
      title: "Moment Collector",
      description: "Take photos of 5 different sunsets",
      points: 100,
      icon: "heart",
      completed: false,
    },
  ];

  const renderIcon = (iconType: Achievement["icon"], completed: boolean) => {
    const IconComponent = ICON_MAP[iconType];
    return (
      <IconComponent
        size={24}
        color="#FFFFFF"
        fill={completed ? "#FFFFFF" : "transparent"}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BioSync Travel</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Your Achievements</Text>
          <View style={styles.pointsBadge}>
            <Star size={16} color="#0B7D72" fill="#0B7D72" />
            <Text style={styles.pointsText}>1250</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Earned</Text>
            <Text style={styles.sectionSubtitle}>2 new</Text>
          </View>

          {recentAchievements.map((achievement) => (
            <View key={achievement.id} style={styles.recentCard}>
              <View style={styles.recentIconContainer}>
                {renderIcon(achievement.icon, achievement.completed)}
              </View>
              <View style={styles.recentContent}>
                <Text style={styles.recentTitle}>{achievement.title}</Text>
                <Text style={styles.recentDescription}>
                  {achievement.description}
                </Text>
                <Text style={styles.recentPoints}>
                  +{achievement.points} points
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievement Categories</Text>

          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <View key={category.id} style={styles.categoryCard}>
                <View
                  style={[
                    styles.categoryIconContainer,
                    !category.completed && styles.categoryIconIncomplete,
                  ]}
                >
                  {renderIcon(category.icon, category.completed)}
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                {category.progress !== undefined &&
                  category.total !== undefined && (
                    <>
                      <View style={styles.progressBarContainer}>
                        <View
                          style={[
                            styles.progressBar,
                            {
                              width: `${(category.progress / category.total) * 100}%`,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.categoryProgress}>
                        {category.completed
                          ? "Completed!"
                          : `${category.progress}/${category.total} conversations`}
                      </Text>
                    </>
                  )}
              </View>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Achievements</Text>

          {allAchievements.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.achievementRow,
                achievement.completed && styles.achievementRowCompleted,
              ]}
            >
              <View
                style={[
                  styles.achievementIconContainer,
                  !achievement.completed && styles.achievementIconIncomplete,
                ]}
              >
                {renderIcon(achievement.icon, achievement.completed)}
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
                {achievement.progress !== undefined &&
                  achievement.total !== undefined && (
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${(achievement.progress / achievement.total) * 100}%`,
                          },
                        ]}
                      />
                    </View>
                  )}
              </View>
              <Text style={styles.achievementStatus}>
                {achievement.completed ? "Done" : "In Progress"}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.section, { marginBottom: 24 }]}>
          <Text style={styles.sectionTitle}>Upcoming Challenges</Text>

          {upcomingChallenges.map((challenge) => (
            <View key={challenge.id} style={styles.challengeCard}>
              <View style={styles.challengeIconContainer}>
                {renderIcon(challenge.icon, false)}
              </View>
              <View style={styles.challengeContent}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={styles.challengeDescription}>
                  {challenge.description}
                </Text>
                <Text style={styles.challengePoints}>
                  +{challenge.points} points
                </Text>
              </View>
            </View>
          ))}
        </View>
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
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0B7D72",
  },
  pointsBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B7D72",
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0B7D72",
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#64748B",
  },
  recentCard: {
    flexDirection: "row",
    backgroundColor: "#99F6E0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  recentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0B7D72",
    justifyContent: "center",
    alignItems: "center",
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B7D72",
    marginBottom: 4,
  },
  recentDescription: {
    fontSize: 13,
    color: "#0B7D72",
    marginBottom: 6,
  },
  recentPoints: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0B7D72",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0B7D72",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryIconIncomplete: {
    backgroundColor: "#D1D5DB",
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0B7D72",
    textAlign: "center",
    marginBottom: 8,
  },
  progressBarContainer: {
    width: "100%",
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 6,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#0B7D72",
    borderRadius: 3,
  },
  categoryProgress: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
  achievementRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    alignItems: "center",
  },
  achievementRowCompleted: {
    backgroundColor: "#99F6E0",
  },
  achievementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0B7D72",
    justifyContent: "center",
    alignItems: "center",
  },
  achievementIconIncomplete: {
    backgroundColor: "#D1D5DB",
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0B7D72",
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 6,
  },
  achievementStatus: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  challengeCard: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  challengeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 6,
  },
  challengePoints: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0B7D72",
  },
  backButton: {
    backgroundColor: "#0B7D72",
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginHorizontal: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
