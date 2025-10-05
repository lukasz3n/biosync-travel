import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function TripConfigScreen() {
  return (
    <ThemedView style={{ padding: 20 }}>
      <ThemedText type="title">
        <ThemedText type="accent">Trip Configuration</ThemedText>
      </ThemedText>
      <ThemedText>Konfiguracja podróży — placeholder.</ThemedText>
    </ThemedView>
  );
}
