let enStrings;
try {
  enStrings = require("../gamedata/en/strings.json");
} catch (e) {
  enStrings = {};
}

function interpolate(template, params) {
  if (!params || Object.keys(params).length === 0) return template;
  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
  }, String(template));
}

export function translate(strings, key, params) {
  let template = strings && strings[key];
  if (template === undefined) {
    template = enStrings[key];
    if (template === undefined) {
      console.warn(`[i18n] Missing translation for key "${key}".`);
      return key;
    }
    console.warn(
      `[i18n] Untranslated key "${key}", falling back to English value.`
    );
  }
  return interpolate(template, params);
}

export function loadTranslations(language) {
  if (!language) language = "en";
  let strings = {};
  try {
    strings = require(`../gamedata/${language}/strings.json`);
  } catch (e) {
    console.warn(
      `[i18n] No translations file for language "${language}", falling back to English.`
    );
  }
  const translations = Object.assign({}, enStrings, strings);
  translations.translate = (key, params) => translate(translations, key, params);
  translations.t = translations.translate;
  return translations;
}