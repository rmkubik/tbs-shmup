import omitKey from "../../utils/omitKey.js";
import reduceEntries from "../../utils/reduceEntries.js";
import currentDirectoryModules from "./*.js";

const themeModules = omitKey("index")(currentDirectoryModules);
const themeEntries = Object.entries(themeModules).map(
  ([themeModuleKey, themeModuleValue]) => [
    themeModuleKey,
    themeModuleValue.default,
  ]
);
const themes = reduceEntries(themeEntries);

export default themes;
