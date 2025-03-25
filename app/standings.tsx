import { useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { fetchLeagueStandings, TeamStanding, LEAGUES } from "../utils/api";

export default function Standings() {
  const [selectedLeague, setSelectedLeague] = useState<number | null>(null); // pour savoir quelle ligue est sélectionnée
  const [standings, setStandings] = useState<TeamStanding[]>([]); // stocke le classement
  const [loading, setLoading] = useState(false); // pour gérer le chargement
  const [error, setError] = useState<string | null>(null); // pour afficher une erreur si y’a pas de données
  const router = useRouter();

  const loadStandings = async (leagueId: number) => {
    // récupère le classement quand on clique sur un championnat
    setLoading(true);
    setError(null);
    setSelectedLeague(leagueId);

    const data = await fetchLeagueStandings(leagueId);
    if (data.length === 0) setError("Aucun classement disponible.");
    setStandings(data);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* titre */}
      <Text style={styles.title}>🏆 Classements</Text>

      {/* liste des ligues à cliquer */}
      <View style={styles.buttons}>
        {LEAGUES.map((league) => (
          <TouchableOpacity key={league.id} style={styles.button} onPress={() => loadStandings(league.id)}>
            <Text style={styles.buttonText}>{league.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* si en chargement ou erreur */}
      {loading && <Text>Chargement...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* affiche la liste des équipes avec leur position */}
      <FlatList
        data={standings}
        keyExtractor={(item) => item.rank.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/team/${item.team.id}`)}>
            <View style={styles.teamRow}>
              <Text style={styles.rank}>{item.rank}</Text>
              <Image source={{ uri: item.team.logo }} style={styles.logo} />
              <Text style={styles.teamName}>{item.team.name}</Text>
              <Text style={styles.points}>{item.points} pts</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// style
const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  buttons: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 15 },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    margin: 4,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  error: { color: "red", marginBottom: 10 },
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 6,
    marginBottom: 8,
    elevation: 1,
  },
  rank: { width: 30, fontWeight: "bold" },
  logo: { width: 30, height: 30, marginRight: 10 },
  teamName: { flex: 1 },
  points: { fontWeight: "bold", color: "#007bff" },
});
