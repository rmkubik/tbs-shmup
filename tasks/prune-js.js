const fs = require("fs").promises;
const path = require("path");

const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);

async function getBundlePath(buildDirectory) {
  const files = await fs.readdir(buildDirectory);

  const bundleFileName = files.find(
    (fileName) =>
      fileName.includes("src") &&
      fileName.includes(".js") &&
      !fileName.includes(".map")
  );

  return path.join(buildDirectory, bundleFileName);
}

async function readBundle(bundlePath) {
  return await fs.readFile(bundlePath, "utf8");
}

function trimTypeErrorMessages(bundleString) {
  return bundleString.replace(/TypeError\(".*?"\)/g, "TypeError()");
}

async function writeBundle(bundlePath, newBundle) {
  await fs.writeFile(bundlePath, newBundle);
}

async function run() {
  const BUILD_PATH = path.join("dist");

  const bundlePath = await getBundlePath(BUILD_PATH);
  const bundle = await readBundle(bundlePath);

  const newBundle = pipe(trimTypeErrorMessages)(bundle);

  await writeBundle(bundlePath, newBundle);
}

run();
