const oldSolveInstanceHex =
  "0x9dfdf7e3e630f506a3dfe38cdbe34e196353364235df33e5a3b588488d9a1e78";
const newSolveInstanceHex =
  "0x5038a30b900118d4e513ba62ebd647a96726a6f81b8fda73c21e9da45df5423d";

const evaluateIfWeHavePassedReDeployment = (check, switchoverBlock) => {
  if (check > switchoverBlock) return true;
};

const evaluateCurrentSolveInstanceHex = (check, switchoverBlock) => {
  let solveInstanceHex = "";
  if (!evaluateIfWeHavePassedReDeployment(check, switchoverBlock)) {
    solveInstanceHex = oldSolveInstanceHex;
  } else {
    solveInstanceHex = newSolveInstanceHex;
  }
  return solveInstanceHex;
};

const returnCurrentLevel = (
  switchoverBlock,
  txn,
  log,
  web3,
  mappingData
) => {
  let result = "";
  if (!evaluateIfWeHavePassedReDeployment(log.blockNumber, switchoverBlock)) {
    let input = txn.data;
    let input_data = "0x" + input.slice(10);
    if (log.topics[0] === oldSolveInstanceHex) {
      let decodedAddress = web3.eth.abi.decodeParameter(
        "address",
        String(log.data)
      );
      result = mappingData[decodedAddress];
    } else {
      let decodedAddress = web3.eth.abi.decodeParameter(
        "address",
        String(input_data)
      );
      result = mappingData[decodedAddress];
    }
  } else {
    const topicsArray = [{ type: "address", name: "level" }];
    const topic0Array = web3.eth.abi.decodeParameters(
      topicsArray,
      String(log.topics[3])
    );
    const newLevelAddress = topic0Array.level;
    result = newLevelAddress;
  }
  return result;
};

const evaluateHistoricalPlayersProfile = (processedData, network) =>
  processedData.map((profile) => {
    let levelCompletedCounter = 0;
    const totalTimeTakenToCompleteLevels = profile.levels.reduce(
      (acc, level) => {
        if (level.isCompleted) {
          acc = acc + level.timeTaken;
          levelCompletedCounter++;
        }
        return acc;
      },
      0
    );
    const averageTimeTakenToCompleteALevel = Math.round(totalTimeTakenToCompleteLevels / levelCompletedCounter) ;
    const totalDifficultyFacedByPlayer = evaluateTotalDifficultyFaced(profile, network)
    return {
      player: profile.player,
      averageTimeTakenToCompleteALevel: averageTimeTakenToCompleteALevel ? averageTimeTakenToCompleteALevel : 0,
      totalNumberOfLevelsCompleted: levelCompletedCounter,
      totalDifficultyFaced: totalDifficultyFacedByPlayer,
      alias: "",
    };
  });

const useScoreEquation = (averageTimeTakenToCompleteALevel, totalDifficultyFacedByPlayer, totalNumberOfLevelsCompleted) => {

  const volumeCompletedParameter = 0.8; //approx. 80% of total attainable score
  const difficultyFacedParameter = 0.1; //approx 10% of total attainable score
  const totalDifficultyInEthernautGame = evaluateTotalDifficultyInEthernautGame();
  let timeScoreContribution = 0;
  const totalNumberOfEthernautLevels = evaluateCurrentNumberOfEthernautLevels();

  // If less than 15 seconds, set to 15 seconds, so that timeScoreContribution is 0.1 * 1
  averageTimeTakenToCompleteALevel = Math.max(averageTimeTakenToCompleteALevel, 15)

  if (averageTimeTakenToCompleteALevel !== 0) {
    timeScoreContribution = 0.1 * (15/averageTimeTakenToCompleteALevel)
  }

  let score = 0;
  if (totalNumberOfLevelsCompleted && totalDifficultyFacedByPlayer && averageTimeTakenToCompleteALevel) {
    score =
      100 * (
      (volumeCompletedParameter * (totalNumberOfLevelsCompleted / totalNumberOfEthernautLevels)) +
      (difficultyFacedParameter * (totalDifficultyFacedByPlayer / totalDifficultyInEthernautGame)) +
      timeScoreContribution
    )
  };

  return score;
}

const reCalculateScores = (board) => {
  const boardWithScores = board.map((player) => {
    const score = useScoreEquation(player.averageTimeTakenToCompleteALevel, player.totalDifficultyFaced, player.totalNumberOfLevelsCompleted);
    return {
      ...player,
      score,
    };
  })
  return boardWithScores;
}

const evaluateCurrentNumberOfEthernautLevels = () => {
  const ethernautLevelsObject = require("../../../src/gamedata/gamedata.json");
  const ethernautLevels = ethernautLevelsObject["levels"];
  return ethernautLevels.length;
};

const evaluateTotalDifficultyInEthernautGame = () => {
  const gameDataObject = require("../../../src/gamedata/gamedata.json");
  const gameData = gameDataObject["levels"];
  let totalDifficulty = 0;
  gameData.forEach((level) => {
    totalDifficulty += parseInt(level.difficulty);
  });
  return totalDifficulty
}

const evaluateTotalDifficultyFaced = (playerProfile, network) => {
  let playerLevelsArray = playerProfile.levels;
  let difficultyCount = 0;
  const difficultyMap = require(`../../networks/${String(network.name).toLowerCase()}/difficultyMap${network.name}.json`);
  playerLevelsArray.forEach((game) => {
    if (game.isCompleted == true) {
      const thisDifficultyProfile = difficultyMap.find(
        (matchingProfile) => {
          if (matchingProfile.address == game.levelAddress) return matchingProfile;
        }
      );
      difficultyCount += parseInt(thisDifficultyProfile.difficulty);
    }
  });
  return difficultyCount;
};

const evaluateDifficultyInThisStatisticsEmit = async (network, log, web3, nodeProvider) => {
  const decodedAddress = await evaluateDecodedLevelAddress(network, log, web3, nodeProvider);
  const difficultyMap = require(`../../networks/${String(network.name).toLowerCase()}/difficultyMap${network.name}.json`);
  let thisDifficultyProfileIndex = 0;
  //sometimes, errors related to RPC downtime occur. This is a workaround to prevent the script from crashing
  try {
    let returnedIndexValue = difficultyMap.findIndex(
      (matchingLevel) =>
        decodedAddress == matchingLevel.address
    );
    if (returnedIndexValue >= 0) {
      thisDifficultyProfileIndex = returnedIndexValue;
    }
  } catch (error) {console.log("difficulty indexing error is defaulted to 0 and returned error " + error)}
  return difficultyMap[thisDifficultyProfileIndex].difficulty;
}

const evaluateDecodedLevelAddress = async (network, log, web3, nodeProvider) => {
  let levelAddress = "";
  try {
    let block = log.blockNumber;
    const logsFromEthernaut = await nodeProvider.getLogs({
      fromBlock: block,
      toBlock: block,
      address: network.newAddress,
      topics: [newSolveInstanceHex],
    });
    let txn = await nodeProvider.getTransaction(String(log.transactionHash));
    let fromPlayer = String(txn.from)
    const playerTopicArray = [{ type: "address", name: "player" }];
    const levelTopicArray = [{ type: "address", name: "level" }];
    for (log of logsFromEthernaut) {
      const playerArray = web3.eth.abi.decodeParameters(
        playerTopicArray,
        String(log.topics[1])
      );
      if (playerArray.player == fromPlayer) {
        let levelArray = web3.eth.abi.decodeParameters(
          levelTopicArray,
          String(log.topics[3])
        );
        levelAddress = levelArray.level;
      }
    }
  } catch (error) { console.log(error) }
  return levelAddress
};

const evaluateIfThisPlayerHasAlreadyCompletedThisLevel = (player, levelAddress, networkBoard) => {
  const doesPlayerExist = networkBoard.find((entry) => player === entry.address);
  const evaluator = false;
  if (doesPlayerExist) {
    const indexOfExistingPlayer = networkBoard.findIndex((entry) => player === entry.address);
    const existingEntry = networkBoard[indexOfExistingPlayer];
    const existingEntryLevelsArray = existingEntry.levels;
    existingEntryLevelsArray.forEach((level) => {
      if (level.address === levelAddress) {
        evaluator = true
      }
    })
  }
  return evaluator;
}

module.exports = {
  evaluateCurrentSolveInstanceHex,
  evaluateIfWeHavePassedReDeployment,
  returnCurrentLevel,
  evaluateHistoricalPlayersProfile,
  evaluateCurrentNumberOfEthernautLevels,
  evaluateTotalDifficultyFaced,
  evaluateTotalDifficultyInEthernautGame,
  useScoreEquation,
  reCalculateScores,
  evaluateDifficultyInThisStatisticsEmit,
  evaluateDecodedLevelAddress,
  evaluateIfThisPlayerHasAlreadyCompletedThisLevel
};
