import puppeteer from "puppeteer";
import csv from "csv-parser";
import fs from "fs";
import path from "path";

import { buildGPX, GarminBuilder } from "gpx-builder";

const filePath = process.argv[2];
const exportFileName = process.argv[3] || "export-google-maps-to-gpx";

const loadRealURL = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log(`Requesting URL: [${url}]`);

  await page.goto(url);
  await page.click('button[aria-label="Accept all"]');
  await new Promise((r) => setTimeout(r, 10000));

  const redirectedURL = page.url();

  console.log(`Redirected to URL: [${redirectedURL}]`);

  const matchedCoordinates = redirectedURL.match(/@(.*),(.*),/);

  await browser.close();

  return [matchedCoordinates[1], matchedCoordinates[2]];
};

const createGPX = (coordinates) => {
  const { Point } = GarminBuilder.MODELS;

  const points = coordinates.map((coordinate) => {
    return new Point(coordinate[0], coordinate[1]);
  });

  const gpxData = new GarminBuilder();

  gpxData.setSegmentPoints(points);

  console.log(path.join(path.parse(filePath).dir, `${exportFileName}.gpx`));

  fs.writeFileSync(
    path.join(path.parse(filePath).dir, `${exportFileName}.gpx`),
    buildGPX(gpxData.toObject())
  );
};

const loadData = async (data) => {
  const coordinates = [];
  for (const googleLocation of data) {
    coordinates.push(await loadRealURL(googleLocation.URL));
  }
  createGPX(coordinates);
};

const tmpLoadedData = [];

fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (data) => tmpLoadedData.push(data))
  .on("end", () => loadData(tmpLoadedData));
