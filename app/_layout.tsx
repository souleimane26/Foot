import { Stack } from "expo-router";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.navText}>🏠 Matchs</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/standings")}>
          <Text style={styles.navText}>📊 Classements</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "#eee",
    borderTopWidth: 1,
    borderColor: "#ccc"
  },
  navText: {
    fontSize: 18,
    fontWeight: "600"
  }
});