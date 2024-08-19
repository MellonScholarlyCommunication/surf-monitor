#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');
require('dotenv').config();

const config = JSON.parse(fs.readFileSync("./config/inbox_config.json", { encoding: "utf-8"}));

for (let i = 0 ; i < config.inboxes.length ; i++) {
    const inbox = config.inboxes[i];
    const notifications = listInbox(inbox);
    
    console.log(`[` + chalk.yellow(inbox) + `]`);
    for (let i = 0 ; i < notifications.length ; i++) {
        const id = notifications[i].id;
        const type = notifications[i].type;
        const actor = notifications[i].actor.id;
        const object = notifications[i].object.id;
        console.log(` |- ${chalk.blue(actor)} ${chalk.red.bold(type)} ${object}`);
    }
}

function listInbox(path) {
    const files = fs.readdirSync(path)
                    .filter( (f) => f.match(/\.jsonld$/))
                    .map( (f) => {
                        return JSON.parse(fs.readFileSync(`${path}/${f}`, { encoding: 'utf-8'}));
                    });


    return files;
}