import React, { useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

export default function MapScreen() {
  const [selected, setSelected] = useState(false);
  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        latitude: 50.0677181,
        longitude: 19.9888172,
        latitudeDelta: 0.08,
        longitudeDelta: 0.04,
      }}
    >
      <Marker
        image={require("../../assets/map-markers/marker-1.png")}
        coordinate={{ latitude: 50.0688007, longitude: 20.0006135 }}
        title="14:00  Muzeum Lotnictwa Polskiego"
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
