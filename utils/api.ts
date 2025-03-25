import axios from "axios";
import { API_FOOTBALL_KEY } from "@env"; 

// lien API
const API_URL = "https://v3.football.api-sports.io/";

// Liste des ligues (plus connues)
export const LEAGUES = [
  { id: 39, name: "Premier League" }, 
  { id: 140, name: "La Liga" }, 
  { id: 61, name: "Ligue 1" }, 
  { id: 78, name: "Bundesliga" }, 
];

// Types pour comprendre ce qu’on récupère depuis l’API

export type TeamStanding = {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
};

export type Match = {
  fixture: {
    id: number;
    date: string;
    status: {
      elapsed: number;
    };
  };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
};

// cherche tous les matchs en cours
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

// récupère le classement d’une ligue
export const fetchLeagueStandings = async (leagueId: number): Promise<TeamStanding[]> => {
  const availableSeason = 2023; // 2023 car c’est la dernière saison dispo avec l'api gratuite

  try {
    const response = await axios.get(`${API_URL}standings?league=${leagueId}&season=${availableSeason}`, {
      headers: { "x-apisports-key": API_FOOTBALL_KEY },
    });

    if (!response.data.response || response.data.response.length === 0) {
      return [];
    }

    // je récupère la première ligne de standings, c’est là que sont les équipes
    return response.data.response[0]?.league?.standings[0] || [];
  } catch (error) {
    return [];
  }
};
