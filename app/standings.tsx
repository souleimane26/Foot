import { useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { fetchLeagueStandings, TeamStanding, LEAGUES } from "../utils/api";

export default function Standings() {
  const [selectedLeague, setSelectedLeague] = useState<number | null>(null);
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fonction pour récupérer le classement de la ligue sélectionnée
  const loadStandings = async (leagueId: number) => {
    setLoading(true);
    setError(null);
    setSelectedLeague(leagueId);

    const data = await fetchLeagueStandings(leagueId);

    if (data.length === 0) {
      setError("Aucun classement disponible pour cette ligue.");
    }

    setStandings(data);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Sélectionne une Ligue</Text>

      {/* ✅ Boutons pour choisir la ligue */}
      <View style={styles.buttonContainer}>
        {LEAGUES.map((league) => (
          <TouchableOpacity key={league.id} style={styles.button} onPress={() => loadStandings(league.id)}>
            <Text style={styles.buttonText}>{league.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ✅ Indicateur de chargement */}
      {loading && <Text style={styles.loading}>Chargement...</Text>}

      {/* ✅ Message d'erreur si aucun classement n'est disponible */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* ✅ Affichage du classement avec un style propre */}
      <FlatList
        data={standings}
        keyExtractor={(item) => item.rank.toString()}
        renderItem={({ item }) => (
          <View style={styles.teamRow}>
            <Text style={styles.rank}>{item.rank}</Text>
            <Image source={{ uri: item.team.logo }} style={styles.logo} />
            <Text style={styles.teamName}>{item.team.name}</Text>
            <Text style={styles.points}>{item.points} pts</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f4f4f4" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center", color: "#222" },

  // ✅ Styles pour les boutons de sélection de ligue
  buttonContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginBottom: 15 },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    borderRadius: 5,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },

  // ✅ Indicateur de chargement & erreurs
  loading: { fontSize: 16, fontWeight: "bold", color: "#555", marginTop: 10, textAlign: "center" },
  error: { color: "red", fontSize: 16, marginTop: 10, textAlign: "center" },

  // ✅ Style du classement des équipes
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  rank: { width: 30, fontSize: 16, fontWeight: "bold", textAlign: "center", color: "#333" },
  logo: { width: 40, height: 40, marginRight: 10 },
  teamName: { flex: 1, fontSize: 16, fontWeight: "bold", color: "#222" },
  points: { fontSize: 16, fontWeight: "bold", color: "#007bff" },
});
