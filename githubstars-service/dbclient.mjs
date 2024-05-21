// dbclient module.
// Provides DBClient class to connect and update or retreive 
// data from PostgreSQL database

import { config } from "./main.mjs";
import { err, log } from "./log.mjs";
import pg from 'pg';
const { Client } = pg;


// Check if table exists
const queryTableExists = `
SELECT EXISTS (
    SELECT FROM 
        pg_tables
    WHERE 
        schemaname = 'public' AND 
        tablename  = 'repos'
);`

// Create table to work with
const queryCreateRepos = `
CREATE TABLE repos (
    repo_id integer PRIMARY KEY,
    full_name text,
    html_url text,
    stars integer
);`

// Search for repo by id
const queryRepoById = `
SELECT 
    repo_id, full_name, html_url, stars 
FROM 
    repos
WHERE 
    repo_id = $1::integer;`

// Search for repo by id or name
const queryRepoByIdOrName = `
    SELECT 
        repo_id, full_name, html_url, stars 
    FROM 
        repos
    WHERE 
        repo_id::text = $1::text 
        OR substring(lower(full_name) FROM lower($1::text)) <> '';`

// List repos
const queryRepos = `
SELECT 
    repo_id, full_name, html_url, stars 
FROM 
    repos
ORDER BY stars DESC;`

// Insert repo
const queryInsertValue = `
INSERT INTO repos 
    (repo_id, full_name, html_url, stars) 
VALUES 
    ($1::integer, $2::text, $3::text, $4::integer);`


// Update stars
const queryUpdateStars = `
UPDATE 
    repos 
SET 
    stars = $2::integer 
WHERE 
    repo_id = $1::integer;`


// Client class for PostgreSQL
class DBClient {

    constructor() {
        this.client = new Client({
            user: config.database.user,
            password: config.database.password,
            host: config.database.host,
            port: config.database.port,
            database: config.database.databaseName,
        });
        this.connected = false;
    }

    // Try to connect to database
    async connect() {
        if (this.connected) return;
        try {
            await this.client.connect();
            log('Connected to database.');
            this.connected = true;
            // 'end' callback to track connection state
            this.client.on('end', () => {
                this.connected = false;
                err('Database client lost connection.')
            });
        } catch (error) {
            err(error);
            this.client.end();
        }
    }

    // Update or insert repo data
    async update(data) {
        try {
            // Check if table even exists
            let res = await this.client.query(queryTableExists);
            let exists = res.rows[0].exists;
            if (!exists) {
                res = await this.client.query(queryCreateRepos);
            }

            // Insert or update repo data
            for (let i = 0; i < data.length; i++) {
                let repo = data[i];
                res = await this.client.query(queryRepoById, [repo.repo_id]);
                let rows = res.rows;
                // If repo is not in table, insert its data
                if (rows.length < 1) {
                    res = await this.client.query(queryInsertValue, repo.getArray());
                } 
                // Else update
                else {
                    res = await this.client.query(queryUpdateStars, [repo.repo_id, repo.stars]);
                }
            }
        } catch (error) {
            err(error);
            this.client.end();
        }
    }

    // Returns repo list
    async getList() {
        let res = await this.client.query(queryRepos);
        return res.rows;
    }

    // Returns repo by name or id
    async getRepo(nameOrId) {
        let res = await this.client.query(queryRepoByIdOrName, [nameOrId]);
        if (res.rows.length < 1) return null;
        return res.rows[0];
    }
}


export {
    DBClient,
}



