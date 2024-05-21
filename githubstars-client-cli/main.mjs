// main module
// Provides CLI interface to GitHubStars API

import { readFileSync } from 'node:fs';
import http from 'node:http';
import readline from 'node:readline';


// Load server config
const config = JSON.parse(readFileSync('./client-config.json'));

const host = config.host;
const port = config.port;


// Makes requests and handles responses
function request(pathname) {
    // Sending the request
    const req = http.request(`http://${host}:${port}${pathname}`, (response) => {
        let data = ''
 
        response.on('data', (chunk) => {
            data += chunk;
        });
    
        // Ending the response 
        response.on('end', () => {
            let message = JSON.parse(data);
            if (message.type == 'list') list(message.data);
            else if (message.type == 'repo') repo(message.data);
            else if (message.type == 'sync') sync(message.data);
            else if (message.type == 'error') error(message);
        });
    }).on('error', (error) => {
        console.error(`Connection error: ${error.message}`);
    }).end();
}


// Shows welcome menu
function welcome() {
    console.log(`/====================================================\\`);
    console.log(`|           Welcome to GitHubStars!                  |`);
    console.log(`|====================================================|`);
    console.log(`|    Commands are:                                   |`);
    console.log(`|        1) list all trending repositories;          |`);
    console.log(`|        2) search for a repository by name or id;   |`);
    console.log(`|        3) sync with github;                        |`);
    console.log(`|        4) show this welcome menu.                  |`);
    console.log(`|    Type "exit" when you're done.                   |`);
    console.log(`\\====================================================/`);
}


// Shows repo info by 'repo'
function multirepo(repo) {
    if (!repo) {
        console.log(`======================================================`);
        console.log(` Repo not found.`);
        return;
    }

    let id = repo.repo_id;
    let name = repo.full_name;
    let url = repo.html_url;
    let stars = repo.stars;
    console.log(`======================================================`);
    console.log(` Repo: ${name}`);
    console.log(`   stars    ${stars}`);
    console.log(`   url      ${url}`);
    console.log(`   id       ${id}`);
}


// Shows repo info by 'data' and looks good
function repo(data) {
    console.log('');
    multirepo(data.repo);
    console.log(`======================================================`);
}


// Shows list of repos
function list(data) {
    console.log('');
    for (let i = 0; i < data.repos.length; i++) {
        multirepo(data.repos[i]);
    }
    console.log(`======================================================`);
}


// Syncs with git and shows response
function sync(data) {
    console.log(`Sync response: ${data.text}`);
}


// Shows server error status and message
function error(message) {
    console.log(`Error response: ${message.status}: ${message.data.text}`);
}


// Like readline(), but with callback
function ask(question, callback) {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    
    rl.question(question, (command) => {
        rl.close();

        callback(command);
    });
}


// Asks user to specify repo and sends request. Then returns control to listen()
function search() {
    ask(`Enter repository name or id: `, (nameOrId) => {
        request(`/repo/${nameOrId}`);
        setTimeout(listen, 500);
    });
}


// Listens for commands and sends requests
async function listen() {
    ask(`\nEnter command number or type "exit": `, (input) => {
        let command = input.trim().toLowerCase();

        if (command == '1') {
            request('/list');
            setTimeout(listen, 500);
        }
        else if (command == '2') {
            search();
        }
        else if (command == '3') {
            request('/sync');
            setTimeout(listen, 500);
        }
        else if (command == '4') {
            console.log('');
            welcome();
            setTimeout(listen, 500);
        }
        else if (command == 'exit') {
            console.log('\nGoodbye!');
        }
        else {
            console.log('Command not found. Please, try again.')
            setTimeout(listen, 500);
        }
    });
}


// Welcome and start listening
welcome();
listen();
