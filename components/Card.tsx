import { ImageBackground, View, Text, StyleSheet } from "react-native";
import {
  SQLiteProvider,
  useSQLiteContext,
  type SQLiteDatabase,
} from "expo-sqlite";
import { useEffect, useState } from "react";
import { Image, type ImageSource } from "expo-image";

type Card = {
  ID: number;
  Name: string;
  Rarity: number;
  Count: number;
  DisplayID: string;
  IsFullArt: number /*Treat as Bool*/;
  Type: string;
  Stage: number;
  IsEx: number /*Treat as Bool*/;
  Frame: string;
  EvolvesFrom: string;
  AbilityID: number;
  RetreatCost: number;
  NameLocalisationID: number;
};

type Props = {
  CardID: number;
  ScaleFactor: number;
  LanguageCode: string;
};

export default function CardViewer({
  CardID,
  ScaleFactor,
  LanguageCode,
}: Props) {
  return (
    <View
      style={[
        styles.cardContainer,
        { width: ScaleFactor * 734, height: ScaleFactor * 1024 },
      ]}
    >
      <SQLiteProvider
        databaseName="CardDatabase.db"
        assetSource={{ assetId: require("@/assets/CardDatabase.db") }}
      >
        <CardRenderer
          CardID={CardID}
          ScaleFactor={ScaleFactor}
          LanguageCode={LanguageCode}
        ></CardRenderer>
      </SQLiteProvider>
    </View>
  );
}

export function CardRenderer({ CardID, ScaleFactor, LanguageCode }: Props) {
  const db = useSQLiteContext();
  const [cardDetails, setCardDetails] = useState<Card>();

  useEffect(() => {
    async function dbRequest() {
      const cardStatement = await db.prepareAsync(
        "SELECT * FROM Cards WHERE ID=$ID"
      );
      try {
        let cardRequest = await cardStatement.executeAsync({
          $ID: CardID,
        });

        const cardResponse = (await cardRequest.getFirstAsync()) as Card;
        setCardDetails(cardResponse);
      } finally {
        await cardStatement.finalizeAsync();
      }
    }

    dbRequest();
  }, [CardID]);

  const RetreatDisplay = [];

  if (cardDetails) {
    console.log(cardDetails.RetreatCost);
    for (let i = 0; i < cardDetails.RetreatCost; i++) {
      RetreatDisplay.push(
        <Image
          style={[styles.typePip, styles.retreatSymbol]}
          source={CardAssets["TypeSymbols"]["Normal"]}
          key={i}
        />
      );
    }
  }

  return (
    <View style={{ transform: [{ scale: ScaleFactor }] }}>
      <ImageBackground /*Type Colour Background*/
        style={styles.card}
        source={
          cardDetails ? CardAssets["Backgrounds"][cardDetails.Type] : null
        }
      >
        <ImageBackground /*Frame*/
          style={styles.card}
          source={
            cardDetails
              ? cardDetails.Rarity == 8
                ? CardAssets["Frames"]["Gold"]
                : CardAssets["Frames"][cardDetails.Frame]
              : null
          }
        >
          <ImageBackground /*Stage Additions*/
            style={styles.card}
            source={
              cardDetails
                ? cardDetails.Rarity == 8
                  ? CardAssets["Stage"]["Gold" + cardDetails.Stage]
                  : CardAssets["Stage"][cardDetails.Stage]
                : null
            }
          >
            <ImageBackground /*Stage Text*/
              style={styles.card}
              source={
                cardDetails
                  ? CardAssets["StageText"][LanguageCode][cardDetails.Stage]
                  : null
              }
            >
              <Image /*Type Symbol*/
                style={[styles.typePip, styles.typeSymbol]}
                source={
                  cardDetails
                    ? CardAssets["TypeSymbols"][cardDetails.Type]
                    : null
                }
              />

              <Image /*Prior Evoloution*/
                style={styles.priorEvoloution}
                source={
                  cardDetails && cardDetails.EvolvesFrom
                    ? CardAssets["EvolvesFrom"][cardDetails.EvolvesFrom]
                    : null
                }
              />

              <View style={styles.retreatContainer}>
                <Text
                  style={{
                    height: 29,
                    width: 118,
                    alignSelf: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    textAlignVertical: "center",
                    fontSize: 13,
                    fontFamily: "Puritan",
                  }}
                >
                  retreat
                </Text>
                {RetreatDisplay}
              </View>
            </ImageBackground>
          </ImageBackground>
        </ImageBackground>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 734,
    height: 1024,
    alignSelf: "center",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  priorEvoloution: {
    width: 80,
    height: 80,
    left: 31,
    top: 79,
    position: "absolute",
  },
  typePip: {
    width: 88,
    height: 88,
  },
  typeSymbol: {
    height: 44,
    width: 44,
    top: 41,
    left: 649,
    position: "absolute",
  },
  retreatSymbol: {
    width: 29,
    height: 29,
    transformOrigin: "left top",
    top: 0,
  },
  retreatContainer: {
    flexDirection: "row",
    left: 388,
    top: 880,
    position: "absolute",
    height: 30,
    width: 295,
    gap: 7,
  },
});

function localizeName(LocalizationID: number, LanguageCode: string) {}
