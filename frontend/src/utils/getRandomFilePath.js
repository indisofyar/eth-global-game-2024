import * as fs from "fs";
import path from "path";
import {readdir} from "fs";


export function getRandomFilePath(folderPath, callback) {
    readdir(folderPath, (err, files) => {
        if (err) {
            callback(err, null);
            return;
        }

        const randomIndex = Math.floor(Math.random() * files.length);
        const randomFile = files[randomIndex];
        const randomFilePath = path.join(folderPath, randomFile);

        callback(null, randomFilePath);
    });
}


