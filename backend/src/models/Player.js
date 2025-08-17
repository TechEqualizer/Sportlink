import { v4 as uuidv4 } from 'uuid';

// Player model - using mock data for development
class Player {
  static async findAll(filters = {}) {
    // Initialize mock players if not exists
    if (!global.mockPlayers) {
      global.mockPlayers = [
        {
          id: '1',
          name: 'John Smith',
          position: 'PG',
          status: 'active',
          team: 'Varsity',
          email: 'john.smith@example.com',
          phoneNumber: '+1-555-0101',
          profilePicture: null,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          position: 'SG',
          status: 'active',
          team: 'Varsity',
          email: 'sarah.johnson@example.com',
          phoneNumber: '+1-555-0102',
          profilePicture: null,
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
          updatedAt: new Date()
        },
        {
          id: '3',
          name: 'Mike Williams',
          position: 'SF',
          status: 'active',
          team: 'Varsity',
          email: 'mike.williams@example.com',
          phoneNumber: '+1-555-0103',
          profilePicture: null,
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
          updatedAt: new Date()
        },
        {
          id: '4',
          name: 'Emily Davis',
          position: 'PF',
          status: 'active',
          team: 'Varsity',
          email: 'emily.davis@example.com',
          phoneNumber: '+1-555-0104',
          profilePicture: null,
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          updatedAt: new Date()
        },
        {
          id: '5',
          name: 'Marcus Thompson',
          position: 'C',
          status: 'active',
          team: 'Varsity',
          email: 'marcus.thompson@example.com',
          phoneNumber: '+1-555-0105',
          profilePicture: null,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          updatedAt: new Date()
        },
        {
          id: '6',
          name: 'Jessica Brown',
          position: 'PG',
          status: 'active',
          team: 'JV',
          email: 'jessica.brown@example.com',
          phoneNumber: '+1-555-0106',
          profilePicture: null,
          createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
          updatedAt: new Date()
        }
      ];
    }

    let players = [...global.mockPlayers];

    // Apply filters
    if (filters.status) {
      players = players.filter(player => player.status === filters.status);
    }
    if (filters.team) {
      players = players.filter(player => player.team === filters.team);
    }
    if (filters.position) {
      players = players.filter(player => player.position === filters.position);
    }

    // Apply limit
    if (filters.limit) {
      players = players.slice(0, filters.limit);
    }

    return players;
  }

  static async findById(id) {
    if (!global.mockPlayers) {
      await this.findAll(); // Initialize mock data
    }

    return global.mockPlayers.find(player => player.id === id) || null;
  }

  static async create(playerData) {
    const {
      name,
      position,
      status = 'active',
      team,
      email,
      phoneNumber = null,
      profilePicture = null
    } = playerData;

    const player = {
      id: uuidv4(),
      name,
      position,
      status,
      team,
      email,
      phoneNumber,
      profilePicture,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Initialize mock data if not exists
    if (!global.mockPlayers) {
      global.mockPlayers = [];
    }
    global.mockPlayers.push(player);

    return player;
  }

  static async update(id, updates) {
    if (!global.mockPlayers) {
      return null;
    }

    const playerIndex = global.mockPlayers.findIndex(player => player.id === id);
    if (playerIndex === -1) {
      return null;
    }

    global.mockPlayers[playerIndex] = {
      ...global.mockPlayers[playerIndex],
      ...updates,
      updatedAt: new Date()
    };

    return global.mockPlayers[playerIndex];
  }

  static async delete(id) {
    if (!global.mockPlayers) {
      return null;
    }

    const playerIndex = global.mockPlayers.findIndex(player => player.id === id);
    if (playerIndex === -1) {
      return null;
    }

    const deletedPlayer = global.mockPlayers[playerIndex];
    global.mockPlayers.splice(playerIndex, 1);
    return deletedPlayer;
  }

  // Helper method to get player name by ID
  static async getPlayerName(id) {
    const player = await this.findById(id);
    return player ? player.name : `Player ${id}`;
  }

  // Helper method to get multiple player names
  static async getPlayerNames(ids) {
    if (!global.mockPlayers) {
      await this.findAll(); // Initialize mock data
    }

    const names = {};
    ids.forEach(id => {
      const player = global.mockPlayers.find(p => p.id === id);
      names[id] = player ? player.name : `Player ${id}`;
    });
    
    return names;
  }
}

export default Player;