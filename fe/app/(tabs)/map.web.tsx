import React from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

export default function MapScreen() {
  const apiKey =
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
    "AIzaSyCIw9o3WcF5n9AUxefDTQ3Ze7k8zKt5Czg";
  const center = { lat: 52.2297, lng: 21.0122 };

  return (
    <ThemedView
      style={styles.webContainer}
      lightColor="#E8F4F8"
      darkColor="#E8F4F8"
    >
      <ThemedText type="title">Map</ThemedText>
      <APIProvider apiKey={apiKey} onLoadError={console.error}>
        <Map
          style={styles.map}
          defaultCenter={center}
          defaultZoom={11}
          gestureHandling="greedy"
        >
          <Marker position={center} title="Warsaw" />
        </Map>
      </APIProvider>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    padding: 16,
  },
  map: {
    width: "100%",
    height: "80%",
    borderRadius: 12,
    overflow: "hidden",
  },
});
