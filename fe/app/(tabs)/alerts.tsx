import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, Pressable } from "react-native";
import {
  Bell,
  Heart,
  AlertTriangle,
  Calendar,
  MapPin,
  CheckCircle,
  X,
} from "lucide-react-native";

interface Notification {
  id: string;
  type: "energy" | "health" | "activity" | "location" | "reminder";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  priority: "high" | "medium" | "low";
}

const ICON_MAP = {
  energy: Heart,
  health: AlertTriangle,
  activity: Calendar,
  location: MapPin,
  reminder: Bell,
};

const PRIORITY_COLORS = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#0D9488",
};

export default function AlertsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "energy",
      title: "Low Energy Alert",
      message:
        "Your energy level is at 45%. Consider taking a break or visiting a recommended calm spot.",
      time: "10 minutes ago",
      isRead: false,
      priority: "high",
    },
    {
      id: "2",
      type: "activity",
      title: "Upcoming Activity Reminder",
      message:
        "Don't forget: Sunset Yoga at Beach starts in 30 minutes. Tap to view alternatives.",
      time: "30 minutes ago",
      isRead: false,
      priority: "medium",
    },
    {
      id: "3",
      type: "location",
      title: "New Calm Spot Nearby",
      message:
        "We found a peaceful garden 5 minutes away that matches your recovery needs.",
      time: "1 hour ago",
      isRead: true,
      priority: "low",
    },
    {
      id: "4",
      type: "health",
      title: "Heart Rate Alert",
      message:
        "Your heart rate has been elevated for 20 minutes. Consider taking a break.",
      time: "2 hours ago",
      isRead: true,
      priority: "high",
    },
    {
      id: "5",
      type: "reminder",
      title: "Daily Check-in",
      message: "Time for your evening wellness check-in. How are you feeling?",
      time: "3 hours ago",
      isRead: true,
      priority: "low",
    },
    {
      id: "6",
      type: "activity",
      title: "Achievement Unlocked!",
      message:
        "Congratulations! You've completed the 'Calm Hero' achievement. +150 points!",
      time: "5 hours ago",
      isRead: true,
      priority: "medium",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true })),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const renderIcon = (type: Notification["type"]) => {
    const IconComponent = ICON_MAP[type];
    return <IconComponent size={24} color="#FFFFFF" />;
  };

  const renderNotification = (notification: Notification) => {
    return (
      <Pressable
        key={notification.id}
        style={[
          styles.notificationCard,
          !notification.isRead && styles.notificationCardUnread,
        ]}
        onPress={() => markAsRead(notification.id)}
      >
        <View style={styles.notificationHeader}>
          <View
            style={[
              styles.notificationIcon,
              { backgroundColor: PRIORITY_COLORS[notification.priority] },
            ]}
          >
            {renderIcon(notification.type)}
          </View>
          <View style={styles.notificationContent}>
            <View style={styles.notificationTitleRow}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              {!notification.isRead && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.notificationMessage}>
              {notification.message}
            </Text>
            <Text style={styles.notificationTime}>{notification.time}</Text>
          </View>
          <Pressable
            style={styles.deleteButton}
            onPress={() => deleteNotification(notification.id)}
          >
            <X size={20} color="#64748B" />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

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
          <Text style={styles.mainTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount} new</Text>
            </View>
          )}
        </View>

        {unreadCount > 0 && (
          <Pressable style={styles.markAllButton} onPress={markAllAsRead}>
            <CheckCircle size={18} color="#0D9488" />
            <Text style={styles.markAllText}>Mark all as read</Text>
          </Pressable>
        )}

        {unreadNotifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Unread ({unreadCount})</Text>
            {unreadNotifications.map(renderNotification)}
          </View>
        )}

        {readNotifications.length > 0 && (
          <View style={[styles.section, { marginBottom: 24 }]}>
            <Text style={styles.sectionTitle}>Earlier</Text>
            {readNotifications.map(renderNotification)}
          </View>
        )}

        {notifications.length === 0 && (
          <View style={styles.emptyState}>
            <Bell size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No notifications</Text>
            <Text style={styles.emptyStateMessage}>
              You&apos;re all caught up! Check back later for updates.
            </Text>
          </View>
        )}
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
  badge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 16,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D9488",
  },
  section: {
    marginTop: 8,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0B7D72",
    marginBottom: 12,
  },
  notificationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
  },
  notificationCardUnread: {
    backgroundColor: "#F0FDFA",
    borderLeftColor: "#0D9488",
  },
  notificationHeader: {
    flexDirection: "row",
    gap: 12,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B7D72",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: "#94A3B8",
  },
  deleteButton: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0B7D72",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
});
