import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type MenuOption = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  badge?: number;
};

const menuOptions: MenuOption[] = [
  {
    id: "achievements",
    title: "Achievements",
    description: "View your travel milestones and badges",
    icon: "trophy",
    route: "/achievements",
  },
  {
    id: "alerts",
    title: "Alerts",
    description: "Check your notifications and updates",
    icon: "notifications",
    route: "/alerts",
    badge: 2,
  },
  {
    id: "logout",
    title: "Logout",
    description: "Log out of your account",
    icon: "log-out",
    route: "/logout",
  },
];

export default function MoreScreen() {
  const handleOptionPress = (route: string) => {
    if (route === "/logout") {
      supabase.auth.signOut().then(() => {
        router.replace("/welcome");
      });
      return;
    }

    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.pageTitle}>Options</Text>

        <View style={styles.menuContainer}>
          {menuOptions.map((option) => (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.menuOption,
                pressed && styles.menuOptionPressed,
              ]}
              onPress={() => handleOptionPress(option.route)}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={option.icon} size={28} color="#0D9488" />
                {option.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{option.badge}</Text>
                  </View>
                )}
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{option.title}</Text>
                <Text style={styles.menuDescription}>{option.description}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </Pressable>
          ))}
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
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0D9488",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  menuContainer: {
    marginHorizontal: 20,
  },
  menuOption: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  menuOptionPressed: {
    backgroundColor: "#F0F9FF",
    transform: [{ scale: 0.98 }],
  },
  menuIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: "#E0F2F1",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#34D399",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#0B7D72",
    fontSize: 12,
    fontWeight: "bold",
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  menuArrow: {
    fontSize: 32,
    color: "#9CA3AF",
    marginLeft: 8,
  },
});
