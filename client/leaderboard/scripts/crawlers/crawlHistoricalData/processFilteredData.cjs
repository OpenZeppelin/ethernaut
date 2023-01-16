const processFilteredData = (filteredData) => {
  const processedData = [];
  filteredData.forEach((game) => {
    const { player } = game;
    const existingPlayerRecord = processedData.find(
      (filteredGame) => filteredGame.player === player
    );
    const existingPlayerRecordIndex = processedData.findIndex(
      (filteredGame) => filteredGame.player === player
    );
    if (!!existingPlayerRecord) {
      // player exists already, check levels
      // has player done level yet?
      const existingEntryForLevel = existingPlayerRecord.levels.find(
        (existingLevel) => game.level === existingLevel.levelAddress
      );
      let updatedLevels = [];
      // if there is existing level entry for user, and it is not completed, lets update level array if not add a new level
      if (existingEntryForLevel && !existingEntryForLevel.isCompleted) {
        updatedLevels = existingPlayerRecord.levels.map((existingLevel) => {
          // if level has been completed this time, update that level entry to completed
          if (
            existingLevel.levelAddress === game.level &&
            game.eventType === "LevelCompleted"
          ) {
            return {
              levelAddress: game.level,
              isCompleted: true,
              timeCreated: existingLevel.timeCreated,
              timeSolved: game.timeStamp,
              timeTaken: game.timeStamp - existingLevel.timeCreated,
            };
            // if new try, overwrite last try
          } else if (
            existingLevel.levelAddress === game.level &&
            game.eventType === "InstanceCreated"
          ) {
            return {
              levelAddress: game.level,
              isCompleted: false,
              timeCreated: game.timeStamp,
              timeSolved: null,
              timeTaken: 0,
            };
          } else {
            return existingLevel;
          }
        });
        // if level already completed, do nothing
      } else if (existingEntryForLevel && existingEntryForLevel.isCompleted) {
        updatedLevels = existingPlayerRecord.levels;
        // if attempt at new level, add to levels array
      } else {
        updatedLevels = [
          ...existingPlayerRecord.levels,
          {
            levelAddress: game.level,
            isCompleted: false,
            timeCreated: game.timeStamp,
            timeSolved: null,
            timeTaken: 0,
          },
        ];
        console.log("adding new level");
      }
      existingPlayerRecord.levels = updatedLevels;
      // overwrite original player record with player containing new level records
      processedData[existingPlayerRecordIndex] = existingPlayerRecord;
    } else {
      // player doesn't exist, create new profile with one level
      const newLevel = {
        levelAddress: game.level,
        isCompleted: game.eventType === "InstanceCreated" ? false : true,
        timeCreated:
          game.eventType === "InstanceCreated"
            ? game.timeStamp
            : "this is a solved level",
        timeSolved:
          game.eventType === "LevelCompleted"
            ? game.timeStamp
            : "not yet solved",
        timeTaken: 0,
      };
      const newProcessedEntry = {
        player,
        levels: [newLevel],
      };
      processedData.push(newProcessedEntry);
      console.log("newProcessedEntry written");
    }
  });
  return processedData;
};
module.exports = processFilteredData;
