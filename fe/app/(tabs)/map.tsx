import React from "react";
import { Platform } from "react-native";

export default function MapRoute() {
  const Impl = React.useMemo(() => {
    if (Platform.OS === "web") {
      return require("./map.web").default;
    }
    return require("./map.native").default;
  }, []);

  const ImplComponent = Impl as React.ComponentType;
  return <ImplComponent />;
}
