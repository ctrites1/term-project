/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: November 09, 2023
 * Author: Christine Trites
 *
 */

const { pipeline } = require("stream/promises");
const { createReadStream } = require("fs");
const { createWriteStream } = require("fs");
const fs = require("fs/promises"),
  PNG = require("pngjs").PNG,
  path = require("path");
  AdmZip = require("adm-zip");  // use in unzip function!

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  const zip = new AdmZip(pathIn);

  return new Promise((resolve, reject) => {
    zip.extractAllToAsync(pathOut, true, (err) => {
      if (err) {
        reject(console.log(err));
      } else {
        resolve(console.log("Extraction operation complete"));
      }
    })
  })
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */


async function readDir(dir) {
  let arrayfilenames = [];
  await fs.readdir(dir) 
    .then(files => {
      files.forEach(file => {
        if (path.extname(file) === ".png") {
          arrayfilenames.push(file)
          console.log(file)
        }
      })
    })
    .catch(err => {
      console.log(err);
    })
  return arrayfilenames;
}

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */

function grayScale(pathIn, pathOut) {
  let png = new PNG({});
  png.on("parsed", function () {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let i = (this.width * y + x) << 2;
  
        // change to grayscale
        let colour = Math.round(0.3 * this.data[i] + 0.59 * this.data[i + 1] + 0.11 * this.data[i + 2]);
        this.data[i] = colour; // R value
        this.data[i + 1] = colour; // G value
        this.data[i + 2] = colour; // B value
  
      }
    }
    this.pack()
  });

  pipeline(
    createReadStream(String(pathIn)),
    png,
    createWriteStream(pathOut)
  )
}

function sepia(pathIn, pathOut) {
  let png = new PNG({});
  png.on("parsed", function () {

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let i = (this.width * y + x) << 2;
  
        // change to sepia
        let redAdj = Math.round(19 * 0.70 + 27 * 0.11);
        let greenAdj = Math.round(redAdj - 19);
        let blueAdj = Math.round(redAdj - 19 - 27);
        let luminance = Math.round(0.3 * this.data[i] + 0.59 * this.data[i + 1] + 0.11 * this.data[i + 2]);

        this.data[i] = Math.max(0, (Math.min((luminance + redAdj), 255))); // R value
        this.data[i + 1] = Math.max(0, (Math.min((luminance + greenAdj), 255))); // G value
        this.data[i + 2] = Math.max(0, (Math.min((luminance + blueAdj), 255))); // B value
  
      }
    }
    this.pack()
  });

  pipeline(
    createReadStream(String(pathIn)),
    png,
    createWriteStream(pathOut)
  )
}

module.exports = {
  unzip,
  readDir,
  grayScale,
  sepia
};
