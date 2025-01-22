import { View, Text, StyleSheet } from "react-native";
import {
  SQLiteProvider,
  useSQLiteContext,
  type SQLiteDatabase,
} from "expo-sqlite";
import { useEffect, useState } from "react";
import { Image, type ImageSource } from "expo-image";
import { Picker } from "@react-native-picker/picker";
import { hide } from "expo-splash-screen";

const PackAssets = [
  require("@/assets/images/Packs/1/1.png") /*Mewtwo*/,
  require("@/assets/images/Packs/1/2.png") /*Pikachu*/,
  require("@/assets/images/Packs/1/3.png") /*Charizard*/,
  require("@/assets/images/Packs/2/4.png") /*Mew*/,
];

const SetAssets = [
  require("@/assets/images/Packs/1/Logo.png") /*Genetic Apex*/,
  require("@/assets/images/Packs/2/Logo.png") /*Mythical Island*/,
];

export default function PackViewer() {
  const [selectedSet, setSelectedSet] = useState(1);
  return (
    <View style={styles.packViewer}>
      <Image
        source={SetAssets[selectedSet - 1]}
        style={styles.setIcon}
        contentFit="contain"
      />

      <SQLiteProvider
        databaseName="CardDatabase.db"
        assetSource={{ assetId: require("@/assets/CardDatabase.db") }}
      >
        <Packs SetID={selectedSet} />
      </SQLiteProvider>

      <View style={[styles.picker, styles.shadow]}>
        <Picker
          selectedValue={selectedSet}
          onValueChange={(itemValue) => setSelectedSet(itemValue)}
        >
          <Picker.Item label="Genetic Apex" value="1" />
          <Picker.Item label="Mythical Island" value="2" />
        </Picker>
      </View>
    </View>
  );
}

interface Pack {
  ID: number;
  Name: string;
}

export function Packs({ SetID }: { SetID: number }) {
  const db = useSQLiteContext();
  const [packs, setPacks] = useState<Pack[]>([]);

  useEffect(() => {
    async function dbRequest() {
      const packStatement = await db.prepareAsync(
        "SELECT ID, Name FROM Packs WHERE SetID=$SetID"
      );

      try {
        let packRequest = await packStatement.executeAsync({
          $SetID: SetID,
        });
        const packResponse = (await packRequest.getAllAsync()) as Pack[];
        setPacks(packResponse);
      } finally {
        await packStatement.finalizeAsync();
      }
    }

    dbRequest();
  }, [SetID]);

  return (
    <View style={styles.packsContainer}>
      {packs.map((pack, index) => (
        <View key={index}>
          <Image
            source={PackAssets[pack.ID - 1]}
            style={styles.pack}
            contentFit="contain"
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pack: {
    width: 100,
    height: 200,
    alignSelf: "center",
  },
  packsContainer: {
    width: "90%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignSelf: "center",
    alignItems: "center",
  },
  setIcon: {
    width: "80%",
    height: "20%",
    alignSelf: "center",
    marginTop: "10%",
  },
  picker: {
    minWidth: 200,
    width: "50%",
    maxWidth: 300,
    alignSelf: "center",
    backgroundColor: "#ffffff",
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
  packViewer: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    height: "100%",
    width: "100%",
  },
});
