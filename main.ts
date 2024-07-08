function main() {
  console.log("hello from main");
}

if (typeof require !== "undefined" && require.main === module) {
  main();
}
