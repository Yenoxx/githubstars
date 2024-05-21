// stars module.
// Starts a service that pulls trending repositories from GitHub

import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { StarWatcher } from './starwatcher.mjs';
import { route } from './routes.mjs';
import { log } from './log.mjs';


// Load server config
const config = JSON.parse(readFileSync('./server-config.json'));

// GitHub search interval in milliseconds
const syncTimeMS = 1000 * 60 * config.server.syncTimeMinutes; 

// Hostname of the server.
const host = config.server.host; 

// Port for the server to listen to
const port = config.server.port; 


// StarWatcher instance. It searches and saves trending repos to a database.
// Search query is configured to pull repos with most number of stars
const watcher = new StarWatcher(syncTimeMS);

// Start searching for repos.
watcher.watch()


// Create server passing a callback to handle requests
const server = createServer(async (request, response) => {
    // Parse url
    let query = new URL(request.url, `http://${request.headers.host}`);

    // Get response message by method and pathname. Query is not used in this project
    let message = await route(request.method, query.pathname)

    // Log message type
    log(`Sending response of type: "${message.type}".`);
    
    // Constructing response
    response.statusCode = message.status;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(message));
});

// Tell the server to start listening
server.listen(port, host, () => {
    log(`Server running at http://${host}:${port}/`);
});


export {
    config, watcher, 
}