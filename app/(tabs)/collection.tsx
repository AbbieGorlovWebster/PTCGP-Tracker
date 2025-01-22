import { View, StyleSheet } from "react-native";
import CardViewer from "@/components/Card";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

export default function Index() {
  const [selectedCard, setSelectedCard] = useState(1);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CardViewer CardID={selectedCard} ScaleFactor={0.5} LanguageCode="EN" />

      <View style={[styles.picker, styles.shadow]}>
        <Picker
          selectedValue={selectedCard}
          onValueChange={(itemValue) => setSelectedCard(itemValue)}
        >
          <Picker.Item label="1" value="1" />
          <Picker.Item label="2" value="2" />
          <Picker.Item label="3" value="3" />
          <Picker.Item label="60" value="60" />
          <Picker.Item label="286" value="286" />
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    minWidth: 200,
    width: "50%",
    maxWidth: 300,
    alignSelf: "center",
    backgroundColor: "#e8f2f8",
    borderRadius: 10,
    borderWidth: 0,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
