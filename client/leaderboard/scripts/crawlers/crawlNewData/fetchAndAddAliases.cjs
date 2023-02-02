const fs = require("fs");
const leaderBoardPath = `client/leaderboard/boards/aliases.json`;
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
      const entryWithLastUpdatedDate = getEntryWithLastUpdatedDate(indices.map((index) => aliasArray[index]));
      finalResults.push(entryWithLastUpdatedDate);
    }
  });
  return finalResults
}

const getEntryWithLastUpdatedDate = (aliasArray) => { 
  let entryWithLastUpdatedDate = aliasArray[0];
  for (let i = 1; i < aliasArray.length; i++) {
    const date1 = Date.parse(aliasArray[i].lastmodifieddate);
    const date2 = Date.parse(entryWithLastUpdatedDate.lastmodifieddate);
    if (date1 > date2) { 
      entryWithLastUpdatedDate = aliasArray[i];
    }
  }
  return entryWithLastUpdatedDate;
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
      properties: ["ethernaut_address", "ethernaut_alias"],
      after,
      filterGroups: [
        {
          filters: [
            {
              propertyName: "ethernaut_address",
              operator: "HAS_PROPERTY"
            }
          ]
        }
      ]
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
  const leaderBoard = require(leaderBoardPath);

  for (let i = 0; i < aliasArray.length; i++) {
    if(!leaderBoard[aliasArray[i].ethernaut_address]) {
      leaderBoard[aliasArray[i].ethernaut_address.toLowerCase()] = aliasArray[i].ethernaut_alias;
    }
  }

  fs.writeFileSync(leaderBoardPath, JSON.stringify(leaderBoard));
};

fetchAndAddAliases()

module.exports = fetchAndAddAliases;


module.exports = fetchAndAddAliases;
