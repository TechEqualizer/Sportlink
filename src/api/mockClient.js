import { mockAthletes, mockTeam } from './mockData';

// In-memory storage for videos during development
let mockVideos = [];

// Mock implementation of Base44 SDK for local development
const createMockAthlete = () => ({
  list: async (sortOption = "-updated_date") => {
    console.log('Mock Athlete.list called with:', { sortOption });
    
    let sortedAthletes = [...mockAthletes];
    
    // Apply sorting
    if (sortOption === "-created_date" || sortOption === "-updated_date") {
      sortedAthletes.sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date));
    } else if (sortOption === "name") {
      sortedAthletes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "-name") {
      sortedAthletes.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return sortedAthletes;
  },
  
  filter: async (query = {}, sortOption = "-updated_date", limit = 25, offset = 0) => {
    console.log('Mock Athlete.filter called with:', { query, sortOption, limit, offset });
    
    let filteredAthletes = [...mockAthletes];
    
    // Apply filters
    if (query.class_year) {
      filteredAthletes = filteredAthletes.filter(a => a.class_year === query.class_year);
    }
    if (query.recruiting_status) {
      filteredAthletes = filteredAthletes.filter(a => a.recruiting_status === query.recruiting_status);
    }
    if (query.sport_type) {
      filteredAthletes = filteredAthletes.filter(a => a.sport_type === query.sport_type);
    }
    if (query.name && query.name.contains) {
      filteredAthletes = filteredAthletes.filter(a => 
        a.name.toLowerCase().includes(query.name.contains.toLowerCase())
      );
    }
    if (query.gpa && query.gpa.gte) {
      filteredAthletes = filteredAthletes.filter(a => a.gpa >= query.gpa.gte);
    }
    
    // Apply sorting
    if (sortOption === "-updated_date") {
      filteredAthletes.sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date));
    } else if (sortOption === "name") {
      filteredAthletes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "-name") {
      filteredAthletes.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === "-gpa") {
      filteredAthletes.sort((a, b) => (b.gpa || 0) - (a.gpa || 0));
    }
    
    // Apply pagination
    const paginatedAthletes = filteredAthletes.slice(offset, offset + limit);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      data: paginatedAthletes,
      total: filteredAthletes.length
    };
  },
  
  create: async (athleteData) => {
    console.log('Mock Athlete.create called with:', athleteData);
    
    const newAthlete = {
      id: Date.now().toString(),
      ...athleteData,
      updated_date: new Date().toISOString()
    };
    
    mockAthletes.unshift(newAthlete);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return newAthlete;
  },
  
  update: async (id, athleteData) => {
    console.log('Mock Athlete.update called with:', { id, athleteData });
    
    const index = mockAthletes.findIndex(a => a.id === id);
    if (index !== -1) {
      mockAthletes[index] = {
        ...mockAthletes[index],
        ...athleteData,
        updated_date: new Date().toISOString()
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockAthletes[index];
    }
    
    throw new Error('Athlete not found');
  },
  
  delete: async (id) => {
    console.log('Mock Athlete.delete called with:', id);
    
    const index = mockAthletes.findIndex(a => a.id === id);
    if (index !== -1) {
      mockAthletes.splice(index, 1);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { success: true };
    }
    
    throw new Error('Athlete not found');
  }
});

const createMockTeam = () => ({
  list: async () => {
    console.log('Mock Team.list called');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [mockTeam];
  },
  
  create: async (teamData) => {
    console.log('Mock Team.create called with:', teamData);
    
    const newTeam = {
      id: Date.now().toString(),
      ...teamData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Update the mockTeam object
    Object.assign(mockTeam, newTeam);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return newTeam;
  },
  
  update: async (id, teamData) => {
    console.log('Mock Team.update called with:', { id, teamData });
    
    const updatedTeam = {
      ...mockTeam,
      ...teamData,
      updated_at: new Date().toISOString()
    };
    
    // Update the mockTeam object
    Object.assign(mockTeam, updatedTeam);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return updatedTeam;
  }
});

const createMockVideo = () => ({
  filter: async (query = {}, sortOption = "-created_date") => {
    console.log('Mock Video.filter called with:', { query, sortOption });
    
    let filteredVideos = [...mockVideos];
    
    // Apply filters
    if (query.athlete_id) {
      filteredVideos = filteredVideos.filter(v => v.athlete_id === query.athlete_id);
    }
    if (query.category) {
      filteredVideos = filteredVideos.filter(v => v.category === query.category);
    }
    if (query.source) {
      filteredVideos = filteredVideos.filter(v => v.source === query.source);
    }
    
    // Apply sorting
    if (sortOption === "-created_date") {
      filteredVideos.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    } else if (sortOption === "created_date") {
      filteredVideos.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    } else if (sortOption === "title") {
      filteredVideos.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return filteredVideos;
  },
  
  create: async (videoData) => {
    console.log('Mock Video.create called with:', videoData);
    
    const newVideo = {
      id: Date.now().toString(),
      ...videoData,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    };
    
    // Store the video in our in-memory array
    mockVideos.unshift(newVideo);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return newVideo;
  },
  
  delete: async (id) => {
    console.log('Mock Video.delete called with:', id);
    
    const index = mockVideos.findIndex(v => v.id === id);
    if (index !== -1) {
      mockVideos.splice(index, 1);
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { success: true };
  }
});

const createMockGame = () => ({
  create: async (data) => {
    const id = Date.now().toString();
    const newGame = {
      id,
      ...data,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    };
    const games = JSON.parse(localStorage.getItem('mock_games') || '[]');
    games.push(newGame);
    localStorage.setItem('mock_games', JSON.stringify(games));
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return newGame;
  },
  
  list: async (sortBy = '-date') => {
    const games = JSON.parse(localStorage.getItem('mock_games') || '[]');
    const sortedGames = [...games].sort((a, b) => {
      const field = sortBy.replace('-', '');
      const order = sortBy.startsWith('-') ? -1 : 1;
      if (field === 'date') {
        return order * (new Date(a.date) - new Date(b.date));
      }
      return order * (a[field] > b[field] ? 1 : -1);
    });
    
    await new Promise(resolve => setTimeout(resolve, 200));
    return sortedGames;
  },
  
  get: async (id) => {
    const games = JSON.parse(localStorage.getItem('mock_games') || '[]');
    await new Promise(resolve => setTimeout(resolve, 100));
    return games.find(g => g.id === id);
  },
  
  update: async (id, data) => {
    const games = JSON.parse(localStorage.getItem('mock_games') || '[]');
    const index = games.findIndex(g => g.id === id);
    if (index !== -1) {
      games[index] = {
        ...games[index],
        ...data,
        updated_date: new Date().toISOString()
      };
      localStorage.setItem('mock_games', JSON.stringify(games));
      await new Promise(resolve => setTimeout(resolve, 300));
      return games[index];
    }
    throw new Error('Game not found');
  },
  
  delete: async (id) => {
    const games = JSON.parse(localStorage.getItem('mock_games') || '[]');
    const filtered = games.filter(g => g.id !== id);
    localStorage.setItem('mock_games', JSON.stringify(filtered));
    
    // Also delete associated performances
    const performances = JSON.parse(localStorage.getItem('mock_gamePerformances') || '[]');
    const filteredPerfs = performances.filter(p => p.game_id !== id);
    localStorage.setItem('mock_gamePerformances', JSON.stringify(filteredPerfs));
    
    await new Promise(resolve => setTimeout(resolve, 200));
    return { success: true };
  },
  
  filter: async (query = {}, sortBy = '-date', limit = 50, offset = 0) => {
    let games = JSON.parse(localStorage.getItem('mock_games') || '[]');
    
    // Apply filters
    if (query.season) {
      games = games.filter(g => g.season === query.season);
    }
    if (query.opponent && query.opponent.contains) {
      games = games.filter(g => g.opponent.toLowerCase().includes(query.opponent.contains.toLowerCase()));
    }
    if (query.date_gte) {
      games = games.filter(g => new Date(g.date) >= new Date(query.date_gte));
    }
    if (query.date_lte) {
      games = games.filter(g => new Date(g.date) <= new Date(query.date_lte));
    }
    
    // Sort
    const sortedGames = [...games].sort((a, b) => {
      const field = sortBy.replace('-', '');
      const order = sortBy.startsWith('-') ? -1 : 1;
      if (field === 'date') {
        return order * (new Date(a.date) - new Date(b.date));
      }
      return order * (a[field] > b[field] ? 1 : -1);
    });
    
    // Paginate
    const paginatedGames = sortedGames.slice(offset, offset + limit);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: paginatedGames, total: games.length };
  }
});

const createMockGamePerformance = () => ({
  create: async (data) => {
    const id = Date.now().toString();
    const newPerformance = {
      id,
      ...data,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    };
    const performances = JSON.parse(localStorage.getItem('mock_gamePerformances') || '[]');
    performances.push(newPerformance);
    localStorage.setItem('mock_gamePerformances', JSON.stringify(performances));
    
    await new Promise(resolve => setTimeout(resolve, 200));
    return newPerformance;
  },
  
  createBatch: async (performancesData) => {
    const performances = JSON.parse(localStorage.getItem('mock_gamePerformances') || '[]');
    const newPerformances = performancesData.map((data, index) => ({
      id: (Date.now() + index).toString(),
      ...data,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    }));
    performances.push(...newPerformances);
    localStorage.setItem('mock_gamePerformances', JSON.stringify(performances));
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return newPerformances;
  },
  
  list: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return JSON.parse(localStorage.getItem('mock_gamePerformances') || '[]');
  },
  
  get: async (id) => {
    const performances = JSON.parse(localStorage.getItem('mock_gamePerformances') || '[]');
    await new Promise(resolve => setTimeout(resolve, 100));
    return performances.find(p => p.id === id);
  },
  
  update: async (id, data) => {
    const performances = JSON.parse(localStorage.getItem('mock_gamePerformances') || '[]');
    const index = performances.findIndex(p => p.id === id);
    if (index !== -1) {
      performances[index] = {
        ...performances[index],
        ...data,
        updated_date: new Date().toISOString()
      };
      localStorage.setItem('mock_gamePerformances', JSON.stringify(performances));
      await new Promise(resolve => setTimeout(resolve, 200));
      return performances[index];
    }
    throw new Error('Performance not found');
  },
  
  delete: async (id) => {
    const performances = JSON.parse(localStorage.getItem('mock_gamePerformances') || '[]');
    const filtered = performances.filter(p => p.id !== id);
    localStorage.setItem('mock_gamePerformances', JSON.stringify(filtered));
    
    await new Promise(resolve => setTimeout(resolve, 200));
    return { success: true };
  },
  
  filter: async (query = {}) => {
    let performances = JSON.parse(localStorage.getItem('mock_gamePerformances') || '[]');
    
    if (query.game_id) {
      performances = performances.filter(p => p.game_id === query.game_id);
    }
    if (query.athlete_id) {
      performances = performances.filter(p => p.athlete_id === query.athlete_id);
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    return performances;
  },
  
  getByGame: async (gameId) => {
    const performances = JSON.parse(localStorage.getItem('mock_gamePerformances') || '[]');
    await new Promise(resolve => setTimeout(resolve, 200));
    return performances.filter(p => p.game_id === gameId);
  },
  
  getByAthlete: async (athleteId) => {
    const performances = JSON.parse(localStorage.getItem('mock_gamePerformances') || '[]');
    await new Promise(resolve => setTimeout(resolve, 200));
    return performances.filter(p => p.athlete_id === athleteId);
  }
});

// Export mock entities
export const mockEntities = {
  Athlete: createMockAthlete(),
  Team: createMockTeam(),
  Video: createMockVideo(),
  Game: createMockGame(),
  GamePerformance: createMockGamePerformance()
};