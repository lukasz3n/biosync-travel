import { Tabs } from "expo-router";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import { HapticTab } from "@/components/haptic-tab";
import {
  Home,
  Plane,
  Map,
  CalendarDays,
  MoreHorizontal,
} from "lucide-react-native";

type ActivityStatus = "pending" | "completed" | "skipped";

type Activity = {
  id: string;
  title: string;
  time: string;
  tags: string[];
  alternatives: string[];
  status: ActivityStatus;
  energyCost: number;
};

type TimeOfDay = "morning" | "afternoon" | "evening";

type DayActivities = Record<TimeOfDay, Activity[]>;

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const [todayActivityCount, setTodayActivityCount] = useState<number>(0);

  // Calculate today's activity count
  useFocusEffect(
    React.useCallback(() => {
      const calculateActivityCount = async () => {
        try {
          const tripCreated = await AsyncStorage.getItem('tripCreated');

          if (tripCreated !== 'true') {
            setTodayActivityCount(0);
            return;
          }

          const tripData = await AsyncStorage.getItem('currentTrip');

          if (!tripData) {
            setTodayActivityCount(0);
            return;
          }

          const trip = JSON.parse(tripData);
          const startDate = new Date(trip.start_date);
          const today = new Date();

          // Calculate day offset from trip start
          const diffTime = today.getTime() - startDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const availableDays = 6;
          const cyclicDay = Math.abs(diffDays) % availableDays;
          const dayKey = "day" + cyclicDay;

          // Try to load saved activities first
          const savedActivities = await AsyncStorage.getItem('dailyPlanActivities');
          let activities: Record<string, DayActivities> = {};

          if (savedActivities) {
            activities = JSON.parse(savedActivities);
          }

          const todayActivities = activities[dayKey];

          if (todayActivities) {
            const morningCount = todayActivities.morning?.length || 0;
            const afternoonCount = todayActivities.afternoon?.length || 0;
            const eveningCount = todayActivities.evening?.length || 0;
            const total = morningCount + afternoonCount + eveningCount;
            setTodayActivityCount(total);
          } else {
            // If no saved activities, use default count (assuming 3 + 2 + 2 = 7 for most days)
            // This is a fallback - the actual count will be set when daily-plan screen loads
            setTodayActivityCount(7);
          }
        } catch (error) {
          console.error('Error calculating activity count:', error);
          setTodayActivityCount(0);
        }
      };

      calculateActivityCount();
    }, [])
  );
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.5)",
        tabBarStyle: {
          backgroundColor: "#0B7D72",
          borderTopColor: "rgba(255, 255, 255, 0.1)",
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 10),
          height: 55 + Math.max(insets.bottom, 12),
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: 4,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={28} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: "Trips",
          tabBarIcon: ({ color }) => (
            <Plane size={24} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => <Map size={24} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="daily-plan"
        options={{
          title: "Daily",
          tabBarBadge: todayActivityCount > 0 ? todayActivityCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: "#34D399",
            color: "#0B7D72",
            fontWeight: "900",
          },
          tabBarIcon: ({ color }) => (
            <CalendarDays
              size={24}
              strokeWidth={2.25}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarBadge: 2,
          tabBarBadgeStyle: {
            backgroundColor: "#34D399",
            color: "#0B7D72",
            fontWeight: "900",
          },
          tabBarIcon: ({ color }) => (
            <MoreHorizontal
              size={24}
              strokeWidth={2.25}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
