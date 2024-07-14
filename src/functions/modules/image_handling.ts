import jsdom = require("jsdom");
import { readFileSync } from "node:fs";
import puppeteer from "puppeteer";

const { JSDOM } = jsdom;

function openSvg(path = "./assets/thumbnail-template.svg"): string {
  try {
    return readFileSync((path = path), "utf8");
  } catch (err) {
    process.exitCode = 1;
  }
}

function parseSvgStrToXml(svg_str: string) {
  return new JSDOM(svg_str);
}

function updateNumberInTemplate(dom: jsdom.JSDOM, val: number) {
  dom.window.document.getElementById("viewCount").innerHTML =
    val.toLocaleString();
}

async function saveJsdomAsPNG(dom: jsdom.JSDOM) {
  let svgString = dom.window.document.getElementsByTagName("body")[0].innerHTML;

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });
  await page.setContent(svgString);

  const svgInPage = await page.$("svg");
  const thumbnailAsBuffer = await svgInPage.screenshot();
  await browser.close();

  return thumbnailAsBuffer;
}

export { openSvg, parseSvgStrToXml, updateNumberInTemplate, saveJsdomAsPNG };
