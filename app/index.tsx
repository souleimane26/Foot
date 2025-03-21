import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { fetchLiveMatches, Match } from "../utils/api";

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const loadMatches = async () => {
      const data = await fetchLiveMatches();
      setMatches(data);
    };

    loadMatches();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matchs en Direct ⚽</Text>
      {matches.length > 0 ? (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.fixture.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.matchCard}>
              <Text>{item.teams.home.name} 🆚 {item.teams.away.name}</Text>
              <Text>Score: {item.goals.home ?? 0} - {item.goals.away ?? 0}</Text>
              <Text>🕒 {item.fixture.status.elapsed} min</Text>
            </View>
          )}
        />
      ) : (
        <Text>Aucun match en cours</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  matchCard: { padding: 10, marginVertical: 5, backgroundColor: "#eee", borderRadius: 8 },
});
