import { base44 } from './base44Client';
import { mockEntities } from './mockClient';
import { Athlete as RealAthlete, Video as RealVideo, Team as RealTeam } from './apiClient';

// Use real API in development mode, fallback to mock if backend is unavailable
const isDevelopment = import.meta.env.DEV;

// Check if backend is running, otherwise fallback to mock
export const Athlete = RealAthlete;
export const Video = RealVideo;  
export const Team = RealTeam;

// auth sdk:
export const User = base44.auth;