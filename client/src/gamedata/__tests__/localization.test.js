const fs = require("fs");
const path = require("path");

const GAMEDATA_DIR = path.resolve(__dirname, "..");
const ES_LEVELS_DIR = path.join(GAMEDATA_DIR, "es", "descriptions", "levels");
const EN_LEVELS_DIR = path.join(GAMEDATA_DIR, "en", "descriptions", "levels");
const ES_STRINGS_PATH = path.join(GAMEDATA_DIR, "es", "strings.json");
const EN_STRINGS_PATH = path.join(GAMEDATA_DIR, "en", "strings.json");
const GAMEDATA_PATH = path.join(GAMEDATA_DIR, "gamedata.json");

const esStrings = require(ES_STRINGS_PATH);
const enStrings = require(EN_STRINGS_PATH);
const gameData = require(GAMEDATA_PATH);

function listMarkdown(directory) {
  return fs
    .readdirSync(directory)
    .filter((name) => name.endsWith(".md"))
    .sort();
}

function verifyEmpty(list, label) {
  if (list.length > 0) {
    console.error(`[localization] ${label}:\n- ${list.join("\n- ")}`);
  }
  expect(list).toEqual([]);
}

describe("Spanish localization (gamedata/es)", () => {
  const esLevelFiles = listMarkdown(ES_LEVELS_DIR);
  const enLevelFiles = listMarkdown(EN_LEVELS_DIR);

  describe("level descriptions", () => {
    it("covers every level description available in English", () => {
      const missing = enLevelFiles.filter((file) => !esLevelFiles.includes(file));
      verifyEmpty(missing, "Missing level descriptions in es/descriptions/levels");
    });

    it("does not contain orphan descriptions missing in English", () => {
      const orphans = esLevelFiles.filter((file) => !enLevelFiles.includes(file));
      verifyEmpty(orphans, "Orphan level descriptions in es/descriptions/levels");
    });

    it("keeps every level registered in gamedata.json translated", () => {
      for (const level of gameData.levels) {
        const files = [level.description, level.completedDescription].filter(Boolean);
        for (const file of files) {
          const issues = [];
          if (!fs.existsSync(path.join(EN_LEVELS_DIR, file))) {
            issues.push(`missing in en/descriptions/levels/${file}`);
          }
          if (!fs.existsSync(path.join(ES_LEVELS_DIR, file))) {
            issues.push(`missing in es/descriptions/levels/${file}`);
          }
          verifyEmpty(issues, `Level "${level.name}" (${file})`);
          const content = fs.readFileSync(path.join(ES_LEVELS_DIR, file), "utf8");
          if (!content.trim()) {
            console.error(`[localization] Level "${level.name}": file "${file}" is empty`);
          }
          expect(content.trim()).not.toBe("");
        }
      }
    });
  });

  describe("es/strings.json keys", () => {
    it("indexes every English vocabulary key", () => {
      const missing = Object.keys(enStrings).filter((key) => !(key in esStrings));
      verifyEmpty(missing, "Missing vocabulary keys in es/strings.json");
    });

    it("does not drift with keys absent from the English baseline", () => {
      const extra = Object.keys(esStrings).filter((key) => !(key in enStrings));
      verifyEmpty(extra, "Unexpected extra keys in es/strings.json");
    });

    it("has non-empty translations for every key", () => {
      const empty = Object.entries(esStrings)
        .filter(([, value]) => typeof value !== "string" || value.trim() === "")
        .map(([key]) => key);
      verifyEmpty(empty, "Empty vocabulary values in es/strings.json");
    });
  });
});