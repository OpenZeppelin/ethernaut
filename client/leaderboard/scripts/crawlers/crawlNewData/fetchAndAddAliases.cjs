const fs = require("fs");
const leaderBoardPath = "client/leaderboard/boards/leaderboard.json";
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const fetchAndAddAliases = async () => {
  const aliasArray = await fetchAliases();
  console.log(aliasArray)
  // await addAliases(aliasArray)
};

const fetchAliases = async () => {
  const response = await axios.post('https://api.hubapi.com/crm/v3/objects/companies/search',
    {
      limit:100
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_SECRET}`,
        'Content-Type': 'application/json'
      }
    }
  )
  return response.data.results.map(entry=>entry.properties)
};

const addAliases = async (aliasArray) => {
  const leaderBoard = JSON.parse(fs.readFileSync(leaderBoardPath));

  const newLeaderBoard = leaderBoard.map((entry) => {
    for(let i = 0; i < aliasArray.length; i++) {
      if(entry.player === aliasArray[i].player) {
        return {
          ...entry,
          alias: aliasArray[i].alias
        }
      }
    }
    return entry;
  });

  fs.writeFileSync(leaderBoardPath, JSON.stringify(newLeaderBoard));
};

fetchAndAddAliases()

module.exports = fetchAndAddAliases;
