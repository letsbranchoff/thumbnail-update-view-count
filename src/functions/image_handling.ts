import jsdom from "jsdom";
import sharp from "sharp";
import fs from "node:fs";

const { JSDOM } = jsdom;

function openSvg(path = "../assets/thumbnail-template.svg"): string {
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

function updateNumberInTemplate(dom: jsdom.JSDOM, val: number) {
  dom.window.document.getElementById("viewCount").innerHTML =
    val.toLocaleString();
}

async function saveJsdomAsPNG(dom: jsdom.JSDOM, dir = "../output") {
  let svgString = dom.window.document.getElementsByTagName("body")[0].innerHTML;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  await sharp(Buffer.from(svgString)).png().toFile(`${dir}/thumbnail.png`);
}

export { openSvg, parseSvgStrToXml, updateNumberInTemplate, saveJsdomAsPNG };
