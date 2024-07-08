import fs from "node:fs";
import jsdom from "jsdom";
import sharp from "sharp";

const { JSDOM } = jsdom;

function openSvg(path = "./assets/thumbnail-template.svg"): string {
  try {
    return fs.readFileSync((path = path), "utf8");
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}

function parseSvgStrToXml(svg_str: string) {
  return new JSDOM(svg_str);
}

function updateNumberInThumbnail(dom: jsdom.JSDOM, val: string) {
  dom.window.document.getElementById("viewCount").innerHTML = val;
}

function saveJsdomAsPNG(dom: jsdom.JSDOM, dir = "./output") {
  let svgString = dom.window.document.getElementsByTagName("body")[0].innerHTML;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  sharp(Buffer.from(svgString)).png().toFile(`${dir}/thumbnail.png`);
}

function main() {
  const svg = openSvg();

  if (process.exitCode == 1) {
    return;
  }

  const svgAsDom = parseSvgStrToXml(svg);
  updateNumberInThumbnail(svgAsDom, "2000");

  saveJsdomAsPNG(svgAsDom);
}

if (typeof require !== "undefined" && require.main === module) {
  main();
}
