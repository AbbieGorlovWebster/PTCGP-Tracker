import { Text, View, StyleSheet } from "react-native";
import PackViewer from "@/components/PackViewer";
import { useEffect, useState } from "react";

export default function Index() {
  return (
    <View style={styles.index}>
      <PackViewer />
    </View>
  );
}

const styles = StyleSheet.create({
  index: {
    backgroundColor: "#e8ecef",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
