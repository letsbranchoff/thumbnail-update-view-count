import fs from "node:fs";

function openSvg(path = "./assets/thumbnail-template.svg"): string {
  try {
    return fs.readFileSync((path = path), "utf8");
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}

function main() {
  const svg = openSvg();

  if (process.exitCode == 1) {
    return;
  }

  console.log(svg);
}

if (typeof require !== "undefined" && require.main === module) {
  main();
}
