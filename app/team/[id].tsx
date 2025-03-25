import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import axios from "axios";
import { API_FOOTBALL_KEY } from "@env";

// lien API
const API_URL = "https://v3.football.api-sports.io/";

export default function TeamDetails() {
  const { id } = useLocalSearchParams(); // récupère l’ID via l’URL
  const [team, setTeam] = useState<any>(null); // stocke les infos de l’équipe
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // chercher les infos de l’équipe
    const fetchTeam = async () => {
      const res = await axios.get(`${API_URL}teams?id=${id}`, {
        headers: { "x-apisports-key": API_FOOTBALL_KEY },
      });
      setTeam(res.data.response[0]);
      setLoading(false);
    };
    fetchTeam();
  }, []);

  if (loading) return <ActivityIndicator size="large" />; // loader pendant le chargement

  if (!team) return <Text>Équipe introuvable</Text>; // au cas où pas de réponse

  return (
    <View style={{ padding: 20 }}>
      {/* Logo et nom de l’équipe */}
      <Image source={{ uri: team.team.logo }} style={{ width: 100, height: 100 }} />
      <Text style={{ fontSize: 24 }}>{team.team.name}</Text>

      {/* Infos basiques sur l’équipe */}
      <Text>Pays : {team.team.country}</Text>
      <Text>Fondée en : {team.team.founded}</Text>
      <Text>Stade : {team.venue.name}</Text>
      <Text>Capacité : {team.venue.capacity}</Text>
    </View>
  );
}
