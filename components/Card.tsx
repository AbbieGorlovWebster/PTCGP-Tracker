import { ImageBackground, View, Text, StyleSheet } from "react-native";
import {
  SQLiteProvider,
  useSQLiteContext,
  type SQLiteDatabase,
} from "expo-sqlite";
import { useEffect, useState } from "react";
import { Image, type ImageSource } from "expo-image";
import CardAssets from "../components/CardAssets";
import * as DBHandler from "../components/DBHandler";
import { Switch } from "react-native-gesture-handler";

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

  //Retreat Cost
  const RetreatDisplay = [];

  if (cardDetails) {
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

  //Weakness
  const WeaknessDisplay = [];

  if (cardDetails?.Weakness) {
    WeaknessDisplay.push(
      <Image
        style={[styles.typePip, styles.retreatSymbol]}
        source={
          CardAssets["TypeSymbols"][
            cardDetails?.Weakness as keyof (typeof CardAssets)["TypeSymbols"]
          ]
        }
      />
    );
    WeaknessDisplay.push(
      <Text
        style={[
          styles.boldText,
          styles.TopAlign,
          styles.boldText,
          styles.BigText,
          { marginTop: -3 },
        ]}
      >
        +20
      </Text>
    );
  }

  //Rarity
  const RarityDisplay = [];

  if (cardDetails?.Rarity) {
    switch (cardDetails.Rarity) {
      case 1:
      case 2:
      case 3:
      case 4:
        for (let i = 0; i < cardDetails.Rarity; i++) {
          RarityDisplay.push(
            <Image
              style={styles.raritySymbol}
              source={CardAssets["Rarity"]["Diamond"]}
            />
          );
        }
        break;

      case 5:
      case 6:
      case 7:
        for (let i = 4; i < cardDetails.Rarity; i++) {
          RarityDisplay.push(
            <Image
              style={styles.raritySymbol}
              source={CardAssets["Rarity"]["Star"]}
            />
          );
        }
        break;

      case 8:
        RarityDisplay.push(
          <Image
            style={styles.raritySymbol}
            source={CardAssets["Rarity"]["Crown"]}
          />
        );
        break;
    }
  }

  console.log(RarityDisplay);

  return (
    <View style={{ transform: [{ scale: ScaleFactor }] }}>
      <ImageBackground /*Type Colour Background*/
        style={styles.card}
        source={
          cardDetails
            ? CardAssets["Backgrounds"][
                cardDetails?.Type as keyof (typeof CardAssets)["Backgrounds"]
              ]
            : null
        }
      >
        {/* Card Art */}
        <Image
          style={styles.cardArt}
          source={
            cardDetails?.DisplayID
              ? CardAssets["CardArt"][
                  cardDetails?.DisplayID as keyof (typeof CardAssets)["CardArt"]
                ]
              : null
          }
        />

        <ImageBackground /*Frame*/
          style={styles.card}
          source={
            cardDetails
              ? cardDetails.Rarity == 8
                ? CardAssets["Frames"]["Gold"]
                : CardAssets["Frames"][
                    cardDetails?.Frame as keyof (typeof CardAssets)["Frames"]
                  ]
              : null
          }
        >
          <ImageBackground /*Stage Additions*/
            style={styles.card}
            source={
              cardDetails
                ? cardDetails.Rarity == 8
                  ? CardAssets["Stage"][
                      ("Gold" +
                        cardDetails?.Stage) as keyof (typeof CardAssets)["Stage"]
                    ]
                  : CardAssets["Stage"][
                      cardDetails?.Stage as keyof (typeof CardAssets)["Stage"]
                    ]
                : null
            }
          >
            <ImageBackground /*Stage Text*/
              style={styles.card}
              source={
                cardDetails
                  ? CardAssets["StageText"][
                      LanguageCode as keyof (typeof CardAssets)["StageText"]
                    ][
                      cardDetails?.Stage as keyof (typeof CardAssets)["StageText"]["EN"]
                    ]
                  : null
              }
            >
              <Image /*Type Symbol*/
                style={[styles.typePip, styles.typeSymbol]}
                source={
                  cardDetails
                    ? CardAssets["TypeSymbols"][
                        cardDetails?.Type as keyof (typeof CardAssets)["TypeSymbols"]
                      ]
                    : null
                }
              />

              <Image /*Prior Evoloution*/
                style={styles.priorEvoloution}
                source={
                  cardDetails && cardDetails.EvolvesFrom
                    ? CardAssets["EvolvesFrom"][
                        cardDetails?.EvolvesFrom as keyof (typeof CardAssets)["EvolvesFrom"]
                      ]
                    : null
                }
              />

              <Text
                style={[
                  styles.evoText,
                  styles.SmallText,
                  styles.regularText,
                  styles.LeftAlign,
                  styles.CenterVAlign,
                ]}
              >
                {cardDetails?.EvolvesFrom
                  ? CardAssets["Localisation"]["Evolves from"][
                      LanguageCode as keyof (typeof CardAssets)["Localisation"]["Evolves from"]
                    ].replace(
                      "[Mst:CardCharacterName]",
                      cardDetails?.EvolvesFrom
                    )
                  : null}
              </Text>

              {/* Retreat */}
              <View style={styles.retreatContainer}>
                <Text
                  style={[
                    styles.regularText,
                    styles.NormalText,
                    styles.CenterAlign,
                    styles.CenterVAlign,
                    styles.retreatText,
                  ]}
                >
                  retreat
                </Text>
                {RetreatDisplay}
              </View>

              {/* Name */}
              <View style={styles.nameContainer}>
                <Text
                  style={[styles.cardText, styles.boldText, styles.HugeText]}
                >
                  {cardDetails?.Name}
                </Text>
              </View>

              {/* Weakness */}
              <View style={styles.weaknessContainer}>
                <Text
                  style={[
                    styles.regularText,
                    styles.NormalText,
                    styles.CenterAlign,
                    styles.CenterVAlign,
                    styles.weaknessText,
                  ]}
                >
                  {
                    CardAssets["Localisation"]["Weakness"][
                      LanguageCode as keyof (typeof CardAssets)["Localisation"]["Weakness"]
                    ]
                  }
                </Text>
                {WeaknessDisplay}
              </View>

              {/* Flavour Text */}
              <View style={styles.flavourTextContainer}>
                <Text
                  style={[
                    styles.NormalText,
                    styles.CenterVAlign,
                    styles.RightAlign,
                    styles.regularText,
                    styles.flavorText,
                  ]}
                >
                  {cardDetails?.FlavorText}
                </Text>
              </View>

              {/* Artist */}
              <View style={styles.artistContainer}>
                <Text
                  style={[
                    styles.regularText,
                    styles.NormalText,
                    styles.LeftAlign,
                    styles.CenterVAlign,
                  ]}
                >
                  {
                    CardAssets["Localisation"]["Illustrator"][
                      LanguageCode as keyof (typeof CardAssets)["Localisation"]["Illustrator"]
                    ]
                  }{" "}
                  {cardDetails?.Artist}
                </Text>
              </View>

              {/* HP */}
              <View style={styles.HPContainer}>
                <Text
                  style={[
                    styles.LargeText,
                    styles.boldText,
                    styles.BottomAlign,
                    { marginBottom: -8 },
                  ]}
                >
                  {
                    CardAssets["Localisation"]["HP"][
                      LanguageCode as keyof (typeof CardAssets)["Localisation"]["HP"]
                    ]
                  }
                </Text>
                <Text
                  style={[
                    styles.boldText,
                    styles.HugeText,
                    styles.BottomAlign,
                    { marginBottom: -15 },
                  ]}
                >
                  {cardDetails?.HP}
                </Text>
              </View>

              {/* Description */}

              <View style={styles.descriptionContainer}>
                <Text
                  style={[
                    styles.NormalText,
                    styles.CenterVAlign,
                    styles.CenterAlign,
                    styles.regularText,
                  ]}
                >
                  {cardDetails?.DescriptionText}
                </Text>
              </View>

              {/* Rarity */}
              <View style={styles.rarityContainer}>{RarityDisplay}</View>
            </ImageBackground>
          </ImageBackground>
        </ImageBackground>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  cardText: {
    marginRight: 32,
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "left",
    textAlignVertical: "center",
    fontSize: 15,
  },
  flavorText: {
    lineHeight: 22,
    letterSpacing: 1,
  },
  retreatText: {
    width: 127,
  },
  weaknessText: {
    width: 156,
  },
  evoText: {
    left: 135,
    top: 94,
    height: 22,
  },

  // Text Styles
  // Font Weighting
  regularText: {
    fontFamily: "PuritanBold",
    fontWeight: 400,
  },
  boldText: {
    fontFamily: "PuritanBold",
    fontWeight: 700,
  },
  italicText: {
    fontFamily: "PuritanBoldItalic",
    fontWeight: 400,
  },

  //Font Size
  HugeText: {
    fontSize: 48,
  },
  BigText: {
    fontSize: 30,
  },
  LargeText: {
    fontSize: 22,
  },
  NormalText: {
    fontSize: 15,
  },
  SmallText: {
    fontSize: 12,
  },

  //Text Alignment
  //Horizontal
  LeftAlign: {
    textAlign: "left",
  },
  RightAlign: {
    textAlign: "right",
  },
  CenterAlign: {
    textAlign: "center",
  },

  //Vertical
  TopAlign: {
    textAlignVertical: "top",
  },
  BottomAlign: {
    textAlignVertical: "bottom",
  },
  CenterVAlign: {
    textAlignVertical: "center",
  },

  //View Styles
  card: {
    width: 734,
    height: 1024,
    alignSelf: "center",
  },
  nameContainer: {
    left: 139,
    top: 29,
    position: "absolute",
    height: 61,
  },
  artistContainer: {
    left: 54,
    top: 915,
    position: "absolute",
  },
  flavourTextContainer: {
    right: 54,
    top: 922,
    position: "absolute",
  },
  weaknessContainer: {
    flexDirection: "row",
    left: 55,
    top: 876,
    position: "absolute",
    height: 36,
    width: 304,
    gap: 4,
  },
  retreatContainer: {
    flexDirection: "row",
    left: 382,
    top: 876,
    position: "absolute",
    height: 36,
    width: 304,
    gap: 7,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  HPContainer: {
    right: 97,
    top: 29,
    position: "absolute",
    height: 61,
    flexDirection: "row",
    paddingTop: 13,
    paddingBottom: 10,
    gap: 3,
  },
  descriptionContainer: {
    left: 61,
    top: 491,
    position: "absolute",
    width: 617,
    height: 19,
    justifyContent: "center",
  },
  rarityContainer: {
    left: 58,
    top: 935,
    position: "absolute",
    height: 26,
    flexDirection: "row",
  },

  //Image Styles
  typePip: {
    width: 88,
    height: 88,
  },
  retreatSymbol: {
    width: 26,
    height: 26,
    transformOrigin: "top left",
    top: 0,
    alignSelf: "center",
  },
  priorEvoloution: {
    width: 80,
    height: 80,
    left: 31,
    top: 79,
    position: "absolute",
  },
  typeSymbol: {
    height: 44,
    width: 44,
    top: 41,
    left: 649,
    position: "absolute",
  },
  raritySymbol: {
    height: 26,
    width: 26,
    contentFit: "contain",
    marginTop: 0.2,
  },
  cardArt: {
    right: 56,
    top: 97,
    position: "absolute",
    width: 616,
    height: 384,
  },
});
