require("intl");

const fs = require("fs");
const path = require("path");
const { stripIndents } = require("common-tags");

async function run() {
  const buildZip = path.join("build.zip");

  const stats = fs.statSync(buildZip);

  const maxBytes = 13312;
  const currentBytesString = stats.size.toLocaleString("en");
  const maxBytesString = maxBytes.toLocaleString("en");
  const remainingBytesString = (maxBytes - stats.size).toLocaleString("en");

  const maxLength = Math.max(
    currentBytesString.length,
    maxBytesString.length,
    remainingBytesString.length
  );

  console.log(stripIndents`
    Current Bytes:     ${currentBytesString.padStart(maxLength, " ")}
    Max Bytes:         ${maxBytesString.padStart(maxLength, " ")}
    Remaining Bytes:   ${remainingBytesString.padStart(maxLength, " ")}
    `);
}

run();
