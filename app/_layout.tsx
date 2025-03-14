import { Stack } from "expo-router";
import { useFonts } from "expo-font";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Puritan: require("@/assets/fonts/Puritan-Regular.ttf"),
    PuritanBold: require("@/assets/fonts/Puritan-Bold.ttf"),
    PuritanBoldItalic: require("@/assets/fonts/Puritan-BoldItalic.ttf"),
    PuritanItalic: require("@/assets/fonts/Puritan-Italic.ttf"),
  });

  if (!fontsLoaded) {
    return undefined;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
