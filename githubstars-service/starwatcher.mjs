// starwatcher module. 
// Contains StarWatcher class that searches for repos and saves them into the database

import { Octokit } from 'octokit';
import { err, log } from './log.mjs';
import { DBClient } from './dbclient.mjs';
import { Repo } from './repo.mjs';


// StarWatcher class searches for repos and saves them into the database
class StarWatcher {

    constructor(syncTimeMS) {
        this.syncTimeMS = syncTimeMS; // GitHub search interval in milliseconds
        this.interval = null; // Interval reference for use with clearInterval()
        this.octokit = new Octokit({}); // Octokit instance to make requests to REST API of GitHub 
        this.dbclient = new DBClient(); 
    }

    // Stops watching cycle if it's currently active
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            log('Clearing interval...');
        }
    }

    // Start watching or reset the interval.
    async watch() {
        await this.dbclient.connect()
        this.stop();
        this.interval = setInterval(this.pullReposCallback(), this.syncTimeMS);
        this.pullRepos();
    }

    // Searches for repos and adds them into the database
    async pullRepos() {
        try {
            let response = await this.octokit.request('GET /search/repositories?q=stars:>100000&sort=stars', {
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });
            
            let raw_data = response.data;
            let data = [];
            for (let i = 0; i < raw_data.items.length; i++) {
                let item = raw_data.items[i];
                data.push(new Repo(item.id, item.full_name, item.html_url, item.watchers));
            }
            
            await this.dbclient.update(data);

            log('Repo list updated.');
        } catch (error) {
            err(error);
        }
    }

    // Callback workaround for setInterval.
    // This way anonymous function ensures closure on a class instance
    pullReposCallback() {
        return async () => {
            await this.pullRepos();
        }
    }

    // Returns repo list
    async getList() {
        return await this.dbclient.getList();
    }

    // Returns repo by name or id
    async getRepo(nameOrId) {
        return await this.dbclient.getRepo(nameOrId);
    }
}


export {
    StarWatcher,
}