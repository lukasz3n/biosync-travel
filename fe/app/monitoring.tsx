import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function MonitoringScreen() {
  return (
    <ThemedView style={{ padding: 20 }}>
      <ThemedText type="title">
        <ThemedText type="accent">Monitoring</ThemedText>
      </ThemedText>
      <ThemedText>Monitoring — placeholder.</ThemedText>
    </ThemedView>
  );
}
