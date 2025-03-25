import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import axios from "axios";
import { API_FOOTBALL_KEY } from "@env";

// Lien API
const API_URL = "https://v3.football.api-sports.io/";

export default function MatchDetails() {
  const { id } = useLocalSearchParams(); // récupère l’id du match avec l’URL
  const [match, setMatch] = useState<any>(null); // Stocke les données du match
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // pour naviguer quand je clique sur une équipe

  useEffect(() => {
    // chercher les infos du match
    const fetchMatch = async () => {
      const res = await axios.get(`${API_URL}fixtures?id=${id}`, {
        headers: { "x-apisports-key": API_FOOTBALL_KEY },
      });
      setMatch(res.data.response[0]);
      setLoading(false);
    };
    fetchMatch();
  }, []);

  if (loading) return <ActivityIndicator size="large" />; // loader pendant le fetch

  if (!match) return <Text>Match introuvable</Text>; // au cas où pas de réponse

  return (
    <View style={{ padding: 20 }}>
      {/* Infos de base d'un match */}
      <Text style={{ fontSize: 18 }}>{match.league.name}</Text>
      <Text>{match.fixture.date}</Text>

      {/* Équipe à domicile, clique pour voir les détails */}
      <TouchableOpacity onPress={() => router.push(`/team/${match.teams.home.id}`)}>
        <Image source={{ uri: match.teams.home.logo }} style={{ width: 50, height: 50 }} />
        <Text>{match.teams.home.name}</Text>
      </TouchableOpacity>

      {/* Score du match */}
      <Text style={{ fontSize: 22 }}>
        {match.goals.home ?? 0} - {match.goals.away ?? 0}
      </Text>

      {/* Équipe à l’extérieur */}
      <TouchableOpacity onPress={() => router.push(`/team/${match.teams.away.id}`)}>
        <Image source={{ uri: match.teams.away.logo }} style={{ width: 50, height: 50 }} />
        <Text>{match.teams.away.name}</Text>
      </TouchableOpacity>
    </View>
  );
}
