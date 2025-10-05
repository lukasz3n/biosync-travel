import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function TravelHistoryScreen() {
  return (
    <ThemedView style={{ padding: 20 }}>
      <ThemedText type="title">
        <ThemedText type="accent">Travel History</ThemedText>
      </ThemedText>
      <ThemedText>Historia podróży — placeholder.</ThemedText>
    </ThemedView>
  );
}
