import { readFileSync } from "fs";

function openSvg(path = "./assets/thumbnail-template.svg"): string {
  try {
    return readFileSync((path = path), "utf8");
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}

export { openSvg };
