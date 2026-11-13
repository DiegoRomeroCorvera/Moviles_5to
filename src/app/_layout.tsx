import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout() {
  return(
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }}/>
          <Stack.Screen name="details/[id]" options={{ headerShown: false }}/>
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
