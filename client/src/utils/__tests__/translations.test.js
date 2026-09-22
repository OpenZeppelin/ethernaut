import { loadTranslations, translate } from "../translations";

function silenceWarnings() {
  const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
  return () => warn.mockRestore();
}

describe("i18n loader", () => {
  it("loads the language dictionary merged over the English baseline", () => {
    const strings = loadTranslations("es");
    expect(strings.spanish).toBe("Español");
    expect(strings.title).toBe("The Ethernaut");
  });

  it("defaults to English when no language is provided", () => {
    const strings = loadTranslations(null);
    expect(strings.english).toBe("English");
    expect(strings.title).toBe("The Ethernaut");
  });

  it("falls back to English when the language file does not exist", () => {
    const restore = silenceWarnings();
    const strings = loadTranslations("xx-nonexistent");
    expect(strings.english).toBe("English");
    expect(strings.spanish).toBe("Español");
    restore();
  });

  it("falls back to English for a key missing in the language dictionary", () => {
    const restore = silenceWarnings();
    const sparse = { english: "English" };
    expect(translate(sparse, "nextLevel")).toBe("Go to the next level");
    restore();
  });

  it("warns and returns the key itself when not even English has it", () => {
    const restore = silenceWarnings();
    expect(translate({}, "nonexistent.key")).toBe("nonexistent.key");
    restore();
  });

  it("interpolates unique {placeholders} with the provided params", () => {
    const strings = {
      rewards: "Ganaste {points} puntos en {currency}.",
    };
    expect(
      translate(strings, "rewards", { points: 120, currency: "PDT" }),
    ).toBe("Ganaste 120 puntos en PDT.");
  });

  it("exposes translate and t bound to the merged dictionary", () => {
    const strings = loadTranslations("es");
    expect(typeof strings.translate).toBe("function");
    expect(typeof strings.t).toBe("function");
    expect(strings.translate("nextLevel")).toBe("Pasa al siguiente nivel");
    expect(strings.t("nextLevel")).toBe("Pasa al siguiente nivel");
  });
});