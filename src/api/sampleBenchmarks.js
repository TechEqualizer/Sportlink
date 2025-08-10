// Sample benchmark data for demo
export const sampleBenchmarks = [
  // John Smith benchmarks
  {
    id: "bench_1",
    player_id: "1",
    stat_type: "points",
    target_value: 18.0,
    opponent_id: null, // Season average
    active: true,
    created_date: "2024-08-01T00:00:00.000Z"
  },
  {
    id: "bench_2", 
    player_id: "1",
    stat_type: "assists",
    target_value: 7.5,
    opponent_id: null,
    active: true,
    created_date: "2024-08-01T00:00:00.000Z"
  },
  {
    id: "bench_3",
    player_id: "1", 
    stat_type: "rebounds",
    target_value: 5.5,
    opponent_id: null,
    active: true,
    created_date: "2024-08-01T00:00:00.000Z"
  },

  // Sarah Johnson benchmarks
  {
    id: "bench_4",
    player_id: "2",
    stat_type: "points", 
    target_value: 22.5,
    opponent_id: null,
    active: true,
    created_date: "2024-08-01T00:00:00.000Z"
  },
  {
    id: "bench_5",
    player_id: "2",
    stat_type: "three_pointers_made",
    target_value: 4.5,
    opponent_id: null,
    active: true,
    created_date: "2024-08-01T00:00:00.000Z"
  },
  {
    id: "bench_6",
    player_id: "2",
    stat_type: "rebounds",
    target_value: 5.0,
    opponent_id: null,
    active: true,
    created_date: "2024-08-01T00:00:00.000Z"
  },

  // Mike Williams benchmarks
  {
    id: "bench_7", 
    player_id: "3",
    stat_type: "points",
    target_value: 14.5,
    opponent_id: null,
    active: true,
    created_date: "2024-08-01T00:00:00.000Z"
  },
  {
    id: "bench_8",
    player_id: "3",
    stat_type: "rebounds",
    target_value: 11.5,
    opponent_id: null,
    active: true,
    created_date: "2024-08-01T00:00:00.000Z"
  },
  {
    id: "bench_9",
    player_id: "3",
    stat_type: "blocks",
    target_value: 2.5,
    opponent_id: null,
    active: true,
    created_date: "2024-08-01T00:00:00.000Z"
  }
];

// Function to load sample benchmarks
export function loadSampleBenchmarks() {
  const existingBenchmarks = JSON.parse(localStorage.getItem('mock_benchmarks') || '[]');
  const benchmarkIds = existingBenchmarks.map(b => b.id);
  
  // Only add benchmarks that don't already exist
  const newBenchmarks = sampleBenchmarks.filter(bench => !benchmarkIds.includes(bench.id));
  const updatedBenchmarks = [...existingBenchmarks, ...newBenchmarks];
  localStorage.setItem('mock_benchmarks', JSON.stringify(updatedBenchmarks));
  
  console.log(`Loaded ${newBenchmarks.length} new benchmarks`);
  return { benchmarks: newBenchmarks.length };
}

// Default benchmark values by stat type
export const DEFAULT_BENCHMARKS = {
  points: {
    pg: 15.0, // Point Guard
    sg: 18.0, // Shooting Guard
    sf: 16.0, // Small Forward
    pf: 14.0, // Power Forward
    c: 12.0   // Center
  },
  assists: {
    pg: 7.0,
    sg: 3.5,
    sf: 4.0,
    pf: 2.5,
    c: 1.5
  },
  rebounds: {
    pg: 4.0,
    sg: 5.0,
    sf: 6.5,
    pf: 8.5,
    c: 10.0
  },
  steals: {
    all: 1.5
  },
  blocks: {
    guard: 0.5,
    forward: 1.5,
    center: 2.5
  }
};

// Function to suggest benchmark based on player position and historical performance
export function suggestBenchmark(player, statType, seasonAvg = null) {
  const position = player.position?.toLowerCase();
  
  if (seasonAvg && seasonAvg > 0) {
    // Base on 90% of season average for achievable targets
    return (seasonAvg * 0.9).toFixed(1);
  }
  
  // Fallback to position-based defaults
  switch (statType) {
    case 'points':
      if (position?.includes('point') || position?.includes('pg')) return DEFAULT_BENCHMARKS.points.pg;
      if (position?.includes('guard') || position?.includes('sg')) return DEFAULT_BENCHMARKS.points.sg;
      if (position?.includes('forward') || position?.includes('sf')) return DEFAULT_BENCHMARKS.points.sf;
      if (position?.includes('power') || position?.includes('pf')) return DEFAULT_BENCHMARKS.points.pf;
      if (position?.includes('center') || position?.includes('c')) return DEFAULT_BENCHMARKS.points.c;
      return 15.0;
      
    case 'assists':
      if (position?.includes('point') || position?.includes('pg')) return DEFAULT_BENCHMARKS.assists.pg;
      if (position?.includes('guard') || position?.includes('sg')) return DEFAULT_BENCHMARKS.assists.sg;
      if (position?.includes('forward') || position?.includes('sf')) return DEFAULT_BENCHMARKS.assists.sf;
      if (position?.includes('power') || position?.includes('pf')) return DEFAULT_BENCHMARKS.assists.pf;
      if (position?.includes('center') || position?.includes('c')) return DEFAULT_BENCHMARKS.assists.c;
      return 3.0;
      
    case 'rebounds':
      if (position?.includes('point') || position?.includes('pg')) return DEFAULT_BENCHMARKS.rebounds.pg;
      if (position?.includes('guard') || position?.includes('sg')) return DEFAULT_BENCHMARKS.rebounds.sg;
      if (position?.includes('forward') || position?.includes('sf')) return DEFAULT_BENCHMARKS.rebounds.sf;
      if (position?.includes('power') || position?.includes('pf')) return DEFAULT_BENCHMARKS.rebounds.pf;
      if (position?.includes('center') || position?.includes('c')) return DEFAULT_BENCHMARKS.rebounds.c;
      return 6.0;
      
    default:
      return 1.0;
  }
}