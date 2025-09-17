import * as duckdb from '@duckdb/duckdb-wasm';
import { VOTE_COLORS } from '../constants';
import { resolveAssetPath, getAssetUrl } from './paths';

// DuckDB instance and connection
let db: duckdb.AsyncDuckDB | null = null;
let conn: duckdb.AsyncDuckDBConnection | null = null;

/**
 * Initialize DuckDB WASM instance
 */
export async function initializeDuckDB(): Promise<void> {
  if (db) return; // Already initialized

  try {
    // Create local bundle configuration to avoid CORS issues
    const LOCAL_BUNDLES: duckdb.DuckDBBundles = {
      mvp: {
        mainModule: resolveAssetPath('/duckdb/duckdb-mvp.wasm'),
        mainWorker: resolveAssetPath('/duckdb/duckdb-browser-mvp.worker.js'),
      },
      eh: {
        mainModule: resolveAssetPath('/duckdb/duckdb-eh.wasm'),
        mainWorker: resolveAssetPath('/duckdb/duckdb-browser-eh.worker.js'),
      },
      coi: {
        mainModule: resolveAssetPath('/duckdb/duckdb-coi.wasm'),
        mainWorker: resolveAssetPath('/duckdb/duckdb-browser-coi.worker.js'),
        pthreadWorker: resolveAssetPath('/duckdb/duckdb-browser-coi.pthread.worker.js'),
      },
    };
    
    // Select bundle based on browser support
    const bundle = await duckdb.selectBundle(LOCAL_BUNDLES);
    
    // Instantiate the asynchronous version of DuckDB-wasm
    const worker = new Worker(bundle.mainWorker!);
    const logger = new duckdb.ConsoleLogger();
    db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    
    // Create a connection
    conn = await db.connect();
    
    console.log('DuckDB initialized successfully with local files');
  } catch (error) {
    console.error('Failed to initialize DuckDB:', error);
    throw error;
  }
}

/**
 * Load parquet file into DuckDB
 */
export async function loadParquetFile(filePath: string, tableName: string): Promise<void> {
  if (!conn) {
    await initializeDuckDB();
  }
  
  try {
    // Create table from parquet file
    await conn!.query(`
      CREATE OR REPLACE TABLE ${tableName} AS 
      SELECT * FROM read_parquet('${filePath}')
    `);
    
    console.log(`Loaded parquet file ${filePath} into table ${tableName}`);
  } catch (error) {
    console.error(`Failed to load parquet file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Get votes for specific participants and statement
 * @param statementId - The statement ID to get votes for
 * @param participantIds - Array of participant IDs to get votes for
 * @returns Map of participant IDs to their votes
 */
export async function getVotesForParticipants(statementId: string, participantIds: string[]): Promise<Map<string, number>> {
  if (!conn) {
    await initializeDuckDB();
  }
  
  try {
    // First, ensure the votes table is loaded
    // Use full URL for DuckDB WASM file access
    const votesUrl = getAssetUrl('/votes.parquet');
    console.log('Loading votes from:', votesUrl);
    await loadParquetFile(votesUrl, 'votes');
    
    // Create a comma-separated list of participant IDs for the IN clause
    const participantIdList = participantIds.map(id => `'${id}'`).join(',');
    
    // Query votes for the specific statement and participants in one go
    const result = await conn!.query(`
      SELECT participant_id, vote
      FROM votes
      WHERE comment_id = '${statementId}'
        AND participant_id IN (${participantIdList})
    `);
    
    const votes = new Map<string, number>();
    
    // Process the results
    for (let i = 0; i < result.numRows; i++) {
      const participantId = result.getChild('participant_id')?.get(i)?.toString();
      const rawVote = result.getChild('vote')?.get(i);
      
      // Convert BigInt to number if needed
      const vote = typeof rawVote === 'bigint' ? Number(rawVote) : rawVote as number;
      
      if (participantId !== undefined && vote !== undefined) {
        votes.set(participantId, vote);
      }
    }
    
    console.log(`Found ${votes.size} votes for statement ${statementId} from ${participantIds.length} participants`);
    return votes;
  } catch (error) {
    console.error(`Failed to get votes for statement ${statementId}:`, error);
    throw error;
  }
}

/**
 * Load projections data from JSON file
 */
export async function loadProjections(): Promise<Map<string, [number, number]>> {
  try {
    const projectionsUrl = resolveAssetPath('/projections.json');
    const response = await fetch(projectionsUrl);
    const projectionsArray = await response.json();
    
    const projections = new Map<string, [number, number]>();
    
    // Convert array format to Map
    projectionsArray.forEach(([participantId, coordinates]: [string, [number, number]]) => {
      projections.set(participantId, coordinates);
    });
    
    console.log(`Loaded ${projections.size} projections`);
    return projections;
  } catch (error) {
    console.error('Failed to load projections:', error);
    throw error;
  }
}

/**
 * Convert vote number to vote type string
 */
function getVoteType(vote: number): keyof typeof VOTE_COLORS {
  switch (vote) {
    case 1:
      return 'agree';
    case -1:
      return 'disagree';
    case 0:
    default:
      return 'pass';
  }
}

/**
 * Get participant data with votes and colors for a specific statement
 * More efficient approach: load all projections first, then query votes for those participants
 * @param statementId - The statement ID to get data for
 * @returns Array of participant data with coordinates, votes, and colors
 */
export async function getParticipantDataForStatement(statementId: string): Promise<Array<{
  participantId: string;
  coordinates: [number, number];
  vote: number | null;
  voteType: keyof typeof VOTE_COLORS;
  color: string;
}>> {
  try {
    // First load all projections to get the participant IDs
    const projections = await loadProjections();
    const participantIds = Array.from(projections.keys());
    
    // Then get votes for all those participants in a single query
    const votes = await getVotesForParticipants(statementId, participantIds);
    
    const participantData: Array<{
      participantId: string;
      coordinates: [number, number];
      vote: number | null;
      voteType: keyof typeof VOTE_COLORS;
      color: string;
    }> = [];
    
    // Process all participants from projections, maintaining order
    projections.forEach((coordinates, participantId) => {
      const vote = votes.get(participantId) ?? null; // null if no vote found
      
      // Only assign vote type and color if participant actually voted
      let voteType: keyof typeof VOTE_COLORS;
      let color: string;
      
      if (vote !== null) {
        // Participant has a vote: -1=disagree(red), 0=pass(yellow), 1=agree(green)
        voteType = getVoteType(vote);
        color = VOTE_COLORS[voteType];
      } else {
        // Participant has no vote record - should be black like ungrouped participants
        voteType = 'pass'; // This is just for the data structure consistency
        color = 'black';
      }
      
      participantData.push({
        participantId,
        coordinates,
        vote,
        voteType,
        color
      });
    });
    
    console.log(`Processed ${participantData.length} participants (${votes.size} with votes) for statement ${statementId}`);
    return participantData;
  } catch (error) {
    console.error(`Failed to get participant data for statement ${statementId}:`, error);
    throw error;
  }
}

/**
 * Close DuckDB connection and cleanup
 */
export async function closeDuckDB(): Promise<void> {
  try {
    if (conn) {
      await conn.close();
      conn = null;
    }
    if (db) {
      await db.terminate();
      db = null;
    }
    console.log('DuckDB connection closed');
  } catch (error) {
    console.error('Error closing DuckDB:', error);
  }
}
