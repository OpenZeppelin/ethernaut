const fs = require("fs");
const leaderBoardPath = `${__dirname}/../../../boards/leaderBoard.json`;
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const fetchAndAddAliases = async () => {
  const aliasArray = await fetchAliases();
  const uniqueAliasArray =  eliminateDuplicates(aliasArray);
  await addAliases(uniqueAliasArray)
};

const eliminateDuplicates = (aliasArray) => {
  const addressToIndicesMapping = getAddressToIndicesMapping(aliasArray);
  delete addressToIndicesMapping[null]
  const finalResults = []
  Object.keys(addressToIndicesMapping).forEach((address) => {
    const indices = addressToIndicesMapping[address];
    if (indices.length === 1) {
      finalResults.push(aliasArray[indices[0]]);
    } else {
      const entryWithLastCreatedDate = getEntryWithLastCreatedDate(indices.map((index) => aliasArray[index]));
      finalResults.push(entryWithLastCreatedDate);
    }
  });
  return finalResults
}

const getEntryWithLastCreatedDate = (aliasArray) => { 
  let entryWithLastCreatedDate = aliasArray[0];
  for (let i = 1; i < aliasArray.length; i++) { 

    if (Date.parse(aliasArray[i].createdate) > Date.parse(entryWithLastCreatedDate.createdate)) { 
      entryWithLastCreatedDate = aliasArray[i];
    }
  }
  return entryWithLastCreatedDate;
}

const getAddressToIndicesMapping = (aliasArray) => { 
  const addressToIndices = {};
  aliasArray.forEach((alias, index) => {
    if (addressToIndices[alias.ethernaut_address]) { 
      addressToIndices[alias.ethernaut_address].push(index);
    } else { 
      addressToIndices[alias.ethernaut_address] = [index];
    }
  });
  return addressToIndices;
}

const fetchAliases = async () => {
  let after = 0;
  let results;
  let finalResults = [];
  do {
    results = await getFetchAliasRequest(after)
    after = after + 100
    finalResults.push(...results)
  } while (results.length === 100)
  return finalResults;
}

const getFetchAliasRequest = async (after) => { 
  const response = await axios.post('https://api.hubapi.com/crm/v3/objects/contacts/search',
    {
      limit: 100,
      properties: ["email", "ethernaut_address", "ethernaut_alias"],
      after
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_SECRET}`,
        'Content-Type': 'application/json'
      }
    }
  )
  return response.data.results.map((result) => result.properties);
}

const addAliases = async (aliasArray) => {
  const leaderBoard = JSON.parse(fs.readFileSync(leaderBoardPath));

  const newLeaderBoard = leaderBoard.map((entry) => {
    for (let i = 0; i < aliasArray.length; i++) {
      if (!entry) { 
        continue;
      }
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
