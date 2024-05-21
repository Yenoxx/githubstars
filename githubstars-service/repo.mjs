// repo module.
// Provides Repo class to store repository data

class Repo {

    constructor(repo_id, full_name, html_url, stars) {
        this.repo_id = repo_id;
        this.full_name = full_name;
        this.html_url = html_url;
        this.stars = stars;
    }

    getArray() {
        return [this.repo_id, this.full_name, this.html_url, this.stars];
    }
}


export {
    Repo,
}