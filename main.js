const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date: November 09, 2023
 * Author: Christine Trites
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");



IOhandler
    .unzip(zipFilePath, pathUnzipped)
    .then(() => IOhandler.readDir(pathUnzipped))
    .then((imgs) => {
        imgs.forEach(
            (img) => IOhandler.grayScale((path.join(pathUnzipped, img)), path.join(pathProcessed, img))
        )
    })
    .then(() => console.log("All images filtered!"))

// IOhandler
//     .unzip("myfile.zip", "unzipped")
//     .then(() => IOhandler.readDir("unzipped"))
//     .then((imgs) => {  // <- Using an array with promises.all!
//         Promise.all(

//         )}  // Don't actually list out the IOhandler stuff, use a loop or something
//     ).then(() => console.log("All images filtered!")) 