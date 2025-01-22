import { ImageBackground, View, Text, StyleSheet } from "react-native";
import {
  SQLiteProvider,
  useSQLiteContext,
  type SQLiteDatabase,
} from "expo-sqlite";
import { useEffect, useState } from "react";
import { Image, type ImageSource } from "expo-image";

const CardAssets = {
  Backgrounds: {
    Dark: require("@/assets/images/Pokemon Cards/Card Assets/Backgrounds/Dark.png"),
    Dragon: require("@/assets/images/Pokemon Cards/Card Assets/Backgrounds/Dragon.png"),
    Fighting: require("@/assets/images/Pokemon Cards/Card Assets/Backgrounds/Fighting.png"),
    Fire: require("@/assets/images/Pokemon Cards/Card Assets/Backgrounds/Fire.png"),
    Goods: require("@/assets/images/Pokemon Cards/Card Assets/Backgrounds/Goods.png"),
    Grass: require("@/assets/images/Pokemon Cards/Card Assets/Backgrounds/Grass.png"),
    Items: require("@/assets/images/Pokemon Cards/Card Assets/Backgrounds/Items.png"),
    Lightning: require("@/assets/images/Pokemon Cards/Card Assets/Backgrounds/Lightning.png"),
    Metal: require("@/assets/images/Pokemon Cards/Card Assets/Backgrounds/Metal.png"),
    Normal: require("@/assets/images/Pokemon Cards/Card Assets/Backgrounds/Normal.png"),
    Psychic: require("@/assets/images/Pokemon Cards/Card Assets/Backgrounds/Psychic.png"),
    Supporter: require("@/assets/images/Pokemon Cards/Card Assets/Backgrounds/Supporter.png"),
    Water: require("@/assets/images/Pokemon Cards/Card Assets/Backgrounds/Water.png"),
  },

  Rarity: {
    Crown: require("@/assets/images/Pokemon Cards/Card Assets/Backgrounds/Dark.png"),
    Diamond: require("@/assets/images/Pokemon Cards/Card Assets/Backgrounds/Dark.png"),
    Star: require("@/assets/images/Pokemon Cards/Card Assets/Backgrounds/Dark.png"),
  },

  Frames: {
    Common: require("@/assets/images/Pokemon Cards/Card Assets/Frames/Common.png"),
    Uncommon: require("@/assets/images/Pokemon Cards/Card Assets/Frames/Uncommon.png"),
    Rare: require("@/assets/images/Pokemon Cards/Card Assets/Frames/Rare.png"),
    FullArt: require("@/assets/images/Pokemon Cards/Card Assets/Frames/FullArt.png"),
    Gold: require("@/assets/images/Pokemon Cards/Card Assets/Frames/Gold.png"),
    Rainbow: require("@/assets/images/Pokemon Cards/Card Assets/Frames/Rainbow.png"),
    Immersive: require("@/assets/images/Pokemon Cards/Card Assets/Frames/Immersive.png"),
    Trainer: require("@/assets/images/Pokemon Cards/Card Assets/Frames/Trainer.png"),
  },

  Stage: {
    0: require("@/assets/images/Pokemon Cards/Card Assets/Stage/BasicDetails.png"),
    1: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Stage1Details.png"),
    2: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Stage2Details.png"),
    Gold0: require("@/assets/images/Pokemon Cards/Card Assets/Stage/GoldBasicDetails.png"),
    Gold2: require("@/assets/images/Pokemon Cards/Card Assets/Stage/GoldStage2Details.png"),
  },

  StageText: {
    DE: {
      0: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Basic/DE.png"),
      1: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Stage 1/DE.png"),
      2: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Stage 2/DE.png"),
    },
    EN: {
      0: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Basic/EN.png"),
      1: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Stage 1/EN.png"),
      2: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Stage 2/EN.png"),
    },
    ES: {
      0: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Basic/ES.png"),
      1: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Stage 1/ES.png"),
      2: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Stage 2/ES.png"),
    },
    FR: {
      0: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Basic/FR.png"),
      1: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Stage 1/FR.png"),
      2: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Stage 2/FR.png"),
    },
    IT: {
      0: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Basic/IT.png"),
      1: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Stage 1/IT.png"),
      2: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Stage 2/IT.png"),
    },
    JP: {
      0: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Basic/JP.png"),
      1: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Stage 1/JP.png"),
      2: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Stage 2/JP.png"),
    },
    KO: {
      0: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Basic/KO.png"),
      1: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Stage 1/KO.png"),
      2: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Stage 2/KO.png"),
    },
    PT: {
      0: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Basic/PT.png"),
      1: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Stage 1/PT.png"),
      2: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Stage 2/PT.png"),
    },
    ZH: {
      0: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Basic/ZH.png"),
      1: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Stage 1/ZH.png"),
      2: require("@/assets/images/Pokemon Cards/Card Assets/Stage/Text/Stage 2/ZH.png"),
    },
  },

  EvolvesFrom: {
    Doduo: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Doduo.png"),
    DomeFossil: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/DomeFossil.png"),
    Dragonair: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Dragonair.png"),
    Dratini: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Dratini.png"),
    Drowsee: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Drowsee.png"),
    Ducklet: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Ducklet.png"),
    Eelektrik: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Eelektrik.png"),
    Eevee: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Eevee.png"),
    Ekans: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Ekans.png"),
    Electabuzz: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Electabuzz.png"),
    Exeggcute: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Exeggcute.png"),
    Froakie: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Froakie.png"),
    Frogadier: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Frogadier.png"),
    Gastly: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Gastly.png"),
    Geodude: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Geodude.png"),
    Gloom: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Gloom.png"),
    Goldeen: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Goldeen.png"),
    Golett: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Golett.png"),
    Graveler: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Graveler.png"),
    Grimer: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Grimer.png"),
    Growlithe: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Growlithe.png"),
    Haunter: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Haunter.png"),
    Heliolisk: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Heliolisk.png"),
    HelixFossi: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/HelixFossil.png"),
    Horsea: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Horsea.png"),
    Ivysaur: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Ivysaur.png"),
    Jigglypuff: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Jigglypuff.png"),
    Kabuto: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Kabuto.png"),
    Kadabra: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Kadabra.png"),
    Kakuna: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Kakuna.png"),
    Kirlia: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Kirlia.png"),
    Koffing: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Koffing.png"),
    Krabby: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Krabby.png"),
    Lickitung: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Lickitung.png"),
    Machoke: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Machoke.png"),
    Machop: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Machop.png"),
    Magikarp: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Magikarp.png"),
    Magmar: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Magmar.png"),
    Magneton: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Magneton.png"),
    Mankey: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Mankey.png"),
    Megnemite: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Megnemite.png"),
    Meltan: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Meltan.png"),
    Meowth: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Meowth.png"),
    Metapod: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Metapod.png"),
    Mienshao: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Mienshao.png"),
    Minccino: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Minccino.png"),
    NidoranF: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/NidoranF.png"),
    NidoranM: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/NidoranM.png"),
    Nidorina: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Nidorina.png"),
    Nidorino: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Nidorino.png"),
    Oddish: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Oddish.png"),
    OldAmber: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/OldAmber.png"),
    Omanyte: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Omanyte.png"),
    Paras: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Paras.png"),
    Petilil: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Petilil.png"),
    Pidgeotto: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Pidgeotto.png"),
    Pidgey: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Pidgey.png"),
    Pikachu: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Pikachu.png"),
    Poliwag: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Poliwag.png"),
    Poliwhirl: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Poliwhirl.png"),
    Ponyta: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Ponyta.png"),
    Porygon: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Porygon.png"),
    Psyduck: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Psyduck.png"),
    Ralts: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Ralts.png"),
    Rattata: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Rattata.png"),
    Rhydon: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Rhydon.png"),
    Rhyhorn: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Rhyhorn.png"),
    Salandit: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Salandit.png"),
    Sanshrew: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Sanshrew.png"),
    Seel: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Seel.png"),
    Shellder: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Shellder.png"),
    Sizzlipede: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Sizzlipede.png"),
    Skidoo: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Skidoo.png"),
    Slowpoke: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Slowpoke.png"),
    Snom: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Snom.png"),
    Spearow: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Spearow.png"),
    Squirtle: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Squirtle.png"),
    Staryu: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Staryu.png"),
    Tangela: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Tangela.png"),
    Tentacool: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Tentacool.png"),
    Tynamo: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Tynamo.png"),
    Venonat: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Venonat.png"),
    Voltorb: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Voltorb.png"),
    Vulpix: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Vulpix.png"),
    Weedle: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Weedle.png"),
    Weepinbell: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Weepinbell.png"),
    Woobat: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Woobat.png"),
    Wooloo: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Wooloo.png"),
    Wortortle: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Wortortle.png"),
    Zubat: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Zubat.png"),
    Abra: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Abra.png"),
    Bellsprout: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Bellsprout.png"),
    Bisharp: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Bisharp.png"),
    Blitzle: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Blitzle.png"),
    Bulbasaur: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Bulbasaur.png"),
    Caterpie: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Caterpie.png"),
    Charmander: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Charmander.png"),
    Charmeleon: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Charmeleon.png"),
    Clefairy: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Clefairy.png"),
    Clobopuss: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Clobopuss.png"),
    Cottonee: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Cottonee.png"),
    Cubone: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Cubone.png"),
    Digglet: require("@/assets/images/Pokemon Cards/Card Assets/Pokemon Evo/Digglet.png"),
  },

  TypeSymbols: {
    Dark: require("@/assets/images/Pokemon Cards/Card Assets/Type Icons/Dark.png"),
    Dragon: require("@/assets/images/Pokemon Cards/Card Assets/Type Icons/Dragon.png"),
    Fighting: require("@/assets/images/Pokemon Cards/Card Assets/Type Icons/Fighting.png"),
    Fire: require("@/assets/images/Pokemon Cards/Card Assets/Type Icons/Fire.png"),
    Grass: require("@/assets/images/Pokemon Cards/Card Assets/Type Icons/Grass.png"),
    Lightning: require("@/assets/images/Pokemon Cards/Card Assets/Type Icons/Lightning.png"),
    Metal: require("@/assets/images/Pokemon Cards/Card Assets/Type Icons/Metal.png"),
    Normal: require("@/assets/images/Pokemon Cards/Card Assets/Type Icons/Normal.png"),
    Psychic: require("@/assets/images/Pokemon Cards/Card Assets/Type Icons/Psychic.png"),
    Water: require("@/assets/images/Pokemon Cards/Card Assets/Type Icons/Water.png"),
  },
};

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
