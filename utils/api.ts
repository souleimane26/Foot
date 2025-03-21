import axios from "axios";
import { API_FOOTBALL_KEY } from "@env"; 

const API_URL = "https://v3.football.api-sports.io/";

// Liste des ligues
export const LEAGUES = [
  { id: 39, name: "Premier League" }, 
  { id: 140, name: "La Liga" }, 
  { id: 61, name: "Ligue 1" }, 
  { id: 78, name: "Bundesliga" }, 
];

// Données retournées par l'API
export type Match = {
  fixture: { id: number; status: { elapsed: number } };
  teams: { home: { name: string }; away: { name: string } };
  goals: { home: number | null; away: number | null };
};

export type TeamStanding = {
  rank: number;
  team: { name: string; logo: string };
  points: number;
  goalsDiff: number;
  all: { played: number; win: number; draw: number; lose: number };
};

// Matchs en direct
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

// Classement d'une ligue
export const fetchLeagueStandings = async (leagueId: number): Promise<TeamStanding[]> => {
    const availableSeason = 2023; // ✅ Saison valide pour le plan gratuit
    try {
      const response = await axios.get(`${API_URL}standings?league=${leagueId}&season=${availableSeason}`, {
        headers: { "x-apisports-key": API_FOOTBALL_KEY },
      });
  
      if (!response.data.response || response.data.response.length === 0) {
        return [];
      }
  
      return response.data.response[0]?.league?.standings[0] || [];
    } catch (error) {
      return [];
    }
  };
  
  