import { base44 } from './base44Client';
import { mockEntities } from './mockClient';
import { Athlete as RealAthlete, Video as RealVideo, Team as RealTeam } from './apiClient';

// Use real API in development mode, fallback to mock if backend is unavailable
const isDevelopment = import.meta.env.DEV;

// For demo deployment, use mock data temporarily
export const Athlete = mockEntities.Athlete;
export const Video = mockEntities.Video;  
export const Team = mockEntities.Team;

// auth sdk:
export const User = base44.auth;