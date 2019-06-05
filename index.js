const argv = require("argv");
const parse = require("csv-parse/lib/sync");
const puppeteer = require("puppeteer");

const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const filenamifyUrl = require("filenamify-url");
const wildcard = require("wildcard");

const argOptions = require("./config/argv");

const {
  options: { config, inputfile, outputdir }
} = argv.option(argOptions).run();

async function init() {
  const readFile = promisify(fs.readFile);

  const csv = await readFile(inputfile);
  const { blacklist, repeat, force } = JSON.parse(await readFile(config));

  const links = parse(csv);
  let index = 1; // skip the header

  const repeatMatches = {};

  let repeatMatchCount = 0;

  function processNext() {
    index = index + 1;

    // go to the next one
    if (index < links.length - 1) {
      processLink(links[index][0]);
    } else {
      console.log("repeatMatchCount", repeatMatchCount);
    }
  }

  function processLink(link) {
    console.log("processing: ", link);
    let doForce = false;

    const hitsForcelist = force.find(rule => {
      return wildcard(rule, link);
    });

    if (hitsForcelist) {
      console.log("forcing as part of force list");
      doForce = true;
    }

    if (!doForce) {
      const hitsBlacklist = blacklist.find(rule => {
        return wildcard(rule, link);
      });

      if (hitsBlacklist) {
        console.log("skipping as part of blacklist");
        processNext();
        return;
      }

      const hitsRepeat = repeat.find(rule => {
        const match = wildcard(rule, link);

        if (!match) return false;

        if (repeatMatches[rule]) {
          repeatMatchCount++;
          return true;
        } else {
          repeatMatches[rule] = true;
          return false;
        }
      });

      if (hitsRepeat) {
        console.log("skipping as part of repeat list");
        processNext();
        return;
      }
    }

    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(link, { waitUntil: "networkidle2" });

      await page.setViewport({ width: 1440, height: 900 });

      console.log(`storing at location: ${index}-${filenamifyUrl(link)}.png`);
      await page.screenshot({
        path: path.join(outputdir, `${index}-${filenamifyUrl(link)}.png`),
        fullPage: true
      });

      await browser.close();

      processNext();
    })();
  }

  processLink(links[index][0]);
}

try {
  init();
} catch (e) {
  console.error(e);
}
