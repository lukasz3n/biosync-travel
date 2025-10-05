import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function WellnessTipsScreen() {
  return (
    <ThemedView style={{ padding: 20 }}>
      <ThemedText type="title">
        <ThemedText type="accent">Wellness Tips</ThemedText>
      </ThemedText>
      <ThemedText>Porady wellness — placeholder.</ThemedText>
    </ThemedView>
  );
}
