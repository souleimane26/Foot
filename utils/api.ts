import axios from "axios";
import { API_FOOTBALL_KEY } from "@env";

const API_URL = "https://v3.football.api-sports.io/";

export type Match = {
  fixture: { id: number; status: { elapsed: number } };
  teams: { home: { name: string }; away: { name: string } };
  goals: { home: number | null; away: number | null };
};

export const fetchLiveMatches = async (): Promise<Match[]> => {
  try {
    const response = await axios.get(`${API_URL}fixtures?live=all`, {
      headers: { "x-apisports-key": API_FOOTBALL_KEY },
    });
    return response.data.response;
  } catch (error) {
    console.error("Erreur lors de la récupération des matchs :", error);
    return [];
  }
};
