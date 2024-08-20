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
        const no = notifications[i];
        const id = no.id;
        const type = no.type;
        const actor = normalizeActor(no.actor.id);
        const target = normalizeActor(no.target?.id);
        let object = no.object.id;
        
        if (no.object.url) {
            object = no.object.url[0].href;
        }

        console.log(` \\_ from: ${chalk.blue(actor)} ${chalk.red.bold(type)} ${object}`);

        if (target) {
            console.log(`     \\_ to: ${chalk.blue(target)}`);
        }
    }
}

function normalizeActor(actor) {
    if (!actor) {
        return null;
    }

    let result = actor;

    if (actor.match(/@/)) {
        result = result.replaceAll(/https?:\/\/(.*)\/@(.*)/g,"$2@$1");
    }

    if (actor.match(/192.87.108.242/)) {
        result = result.replaceAll(/http:\/\/192.87.108.242\//g,"@surf:")
                     .replaceAll(/\/profile.*/g,'');
    }

    return result;
}

function listInbox(path) {
    const files = fs.readdirSync(path)
                    .filter( (f) => f.match(/\.jsonld$/))
                    .map( (f) => {
                        return JSON.parse(fs.readFileSync(`${path}/${f}`, { encoding: 'utf-8'}));
                    });


    return files;
}