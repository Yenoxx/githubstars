// routes module
// Contains 'route' function to provide access to service endpoints

import { watcher } from './main.mjs';
import { Message, ErrorMessage } from './message.mjs'


// Handles request and returns response message.
async function route(method, pathname) {
    // Only GET requests are accepted.
    // '/sync' request is also classified as GET for this project, since
    // it does not submit any resource, but I don't know if this is correct or not
    if (method !== "GET") methodNotAllowed();

    // Split pathname
    let parts = pathname.slice(1).split('/');
    // Return list representation by default
    if (parts.length < 1) return list();
    // Ensure first part of pathname is in lower case
    let first = parts[0].toLocaleLowerCase();

    // Classify request by first part
    if (first === 'repo') return await repo(parts);
    if (first === 'list') return await list(parts);
    if (first === 'sync') return await sync(parts);

    // If request was not classified then return Not Found (404)
    return notFound();
}


// Method Not Allowed (405) response
function methodNotAllowed() {
    return new ErrorMessage('Method Not Allowed', 405);
}


// Not Found (404) response
function notFound() {
    return new ErrorMessage('Not Found', 404);
}


// Respose for /repo/* pathname 
async function repo(parts) {
    if (parts.length < 2) return notFound();
    let repo = await watcher.getRepo(parts[1]);
    return new Message("repo", {repo: repo});
}


// Response for /list pathname
async function list(_parts) {
    let repos = await watcher.getList();
    return new Message("list", {repos: repos});
}


// Response for /sync pathname
async function sync(_parts) {
    watcher.watch();
    return new Message("sync", {text:'Sync Succesful'});
}


export {
    route,
}