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
  DisplayID: string;
  IsFullArt: boolean;
  Type: string;
  Stage: number;
  IsEx: boolean;
  Frame: string;
  EvolvesFrom: string;
  Ability: Ability | null;
  RetreatCost: number;
  Weakness: string;
  FlavorText: string | null;
  Moves: Move[] | undefined;
  DescriptionText: string | null;
  Artist: string;
  HP: number;
};

type Ability = {
  AbilityName: string;
  AbilityText: string;
  AbilitySpecifics: any[];
};

type Move = {
  Name: string;
  Cost: string[];
  Damage: number;
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
  const database = useSQLiteContext();
  const [cardDetails, setCardDetails] = useState<Card>();

  useEffect(() => {
    let requestCardDetails: Card;

    async function getCardData() {
      //Get Raw Card Data From DB
      let rawCardDetails = await DBHandler.Get({
        tableName: "Cards",
        db: database,
        filterFields: [["ID", `${CardID}`]],
      });

      //Get Secondary Details
      //Artist Name
      let artistName = getArtist(rawCardDetails.Artist);

      //Ability
      let ability = rawCardDetails.AbilityID
        ? getAbility(rawCardDetails.AbilityID)
        : null;

      //Name
      let cardName = getName(rawCardDetails.NameLocalisationID);

      //Flavour Text
      let flavourText = rawCardDetails.FlavourLocalisationID
        ? getFlavourText(rawCardDetails.FlavourLocalisationID)
        : null;

      //Description
      let description = rawCardDetails.DescriptionLocalisationID
        ? getDescription(rawCardDetails.DescriptionLocalisationID)
        : null;

      //Moves

      console.log(rawCardDetails.HP);

      //Structure data into type
      let cardDetails: Card = {
        Name: await cardName,
        ID: rawCardDetails.ID,
        Rarity: rawCardDetails.Rarity,
        DisplayID: rawCardDetails.DisplayID,
        IsFullArt: rawCardDetails.IsFullArt ? true : false,
        Stage: rawCardDetails.Stage,
        Type: rawCardDetails.Type,
        IsEx: rawCardDetails.IsEx ? true : false,
        Frame: rawCardDetails.Frame,
        EvolvesFrom: rawCardDetails.EvolvesFrom,
        Ability: await ability,
        RetreatCost: rawCardDetails.RetreatCost,
        Weakness: rawCardDetails.Weakness,
        FlavorText: await flavourText,
        DescriptionText: await description,
        Moves: undefined,
        Artist: await artistName,
        HP: rawCardDetails.HP,
      };

      setCardDetails(cardDetails);
    }

    async function getArtist(artistID: number) {
      return (
        await DBHandler.Get({
          tableName: "Illustrator",
          db: database,
          filterFields: [["ID", `${artistID}`]],
        })
      ).Name;
    }

    async function getName(nameID: number) {
      return (
        await DBHandler.Get({
          tableName: "NamesLocalisation",
          db: database,
          filterFields: [["ID", `${nameID}`]],
          queryFields: [LanguageCode],
        })
      )[LanguageCode];
    }

    async function getDescription(descriptionID: number) {
      return (
        (
          await DBHandler.Get({
            tableName: "DescriptionLocalisation",
            db: database,
            filterFields: [["ID", `${descriptionID}`]],
            queryFields: [LanguageCode],
          })
        )[LanguageCode] as string
      )
        .replace(/\\\"/g, '"')
        .replace(/\n/g, "");
    }

    async function getFlavourText(flavourTextID: number) {
      return (
        (
          await DBHandler.Get({
            tableName: "FlavourTextLocalisation",
            db: database,
            filterFields: [["ID", `${flavourTextID}`]],
            queryFields: [LanguageCode],
          })
        )[LanguageCode] as string
      ).replace(/\\n/g, "\n");
    }

    async function getAbility(abilityID: number) {
      let rawDetails = await DBHandler.Get({
        tableName: "Abilities",
        db: database,
        filterFields: [["ID", `${abilityID}`]],
      });

      let ability: Ability = {
        AbilityName: (
          await DBHandler.Get({
            tableName: "AbilitiesNameLocalisation",
            db: database,
            filterFields: [["ID", `${rawDetails.Name}`]],
            queryFields: [LanguageCode],
          })
        )[LanguageCode],
        AbilityText: (
          await DBHandler.Get({
            tableName: "AbilitiesTextLocalisation",
            db: database,
            filterFields: [["ID", `${rawDetails.Text}`]],
            queryFields: [LanguageCode],
          })
        )[LanguageCode],
        AbilitySpecifics: rawDetails.SpecificsArray,
      };

      return ability;
    }

    getCardData();
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
