import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { fetchLiveMatches } from "../utils/api";
import { Match } from "../utils/api";

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]); // stocke les matchs en direct
  const [loading, setLoading] = useState(true); // booléen pour gérer le chargement
  const router = useRouter(); // pour naviguer quand je clique sur un match

  useEffect(() => {
    // au chargement cherche les matchs en direct
    const load = async () => {
      const data = await fetchLiveMatches();
      setMatches(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <View style={styles.container}>
      {/* Titre de la page */}
      <Text style={styles.title}>Matchs en direct ⚽</Text>

      {/* Si c’est en train de charger */}
      {loading ? (
        <Text>Chargement...</Text>
      ) : (
        // affiche la liste des matchs
        <FlatList
          data={matches}
          keyExtractor={(item) => item.fixture.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/match/${item.fixture.id}`)}>
              <View style={styles.matchCard}>
                <Text style={styles.team}>
                  {item.teams.home.name} 🆚 {item.teams.away.name}
                </Text>
                <Text style={styles.score}>
                  {item.goals.home ?? 0} - {item.goals.away ?? 0}
                </Text>
                <Text style={styles.time}>⏱ {item.fixture.status.elapsed} min</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

// Style pour l’affichage des matchs
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  matchCard: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  team: { fontSize: 16, fontWeight: "600" },
  score: { fontSize: 18, fontWeight: "bold", marginVertical: 4 },
  time: { color: "#555" },
});
