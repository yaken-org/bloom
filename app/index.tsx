import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@react-navigation/elements";

import { router } from "expo-router";


export default function Home() {
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedText>Hello</ThemedText>
      <Button onPress={() => router.push("/TestPage")}>Go to Test Page</Button>
    </ThemedView>
  );
}
