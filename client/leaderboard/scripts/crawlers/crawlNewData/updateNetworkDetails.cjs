const networkDataPath = "client/leaderboard/utils/networkDetails.json";
const fs = require("fs");

const updateNetworkDetails = async (network, upperBlock) => {
  const networkDetails = require(networkDataPath);
  const updatedNetworkDetails = networkDetails.map((networkDetail) => {
    if (networkDetail.name === network.name) {
      return {
        ...networkDetail,
        lastFrom: upperBlock + 1,
      };
    }
    return networkDetail;
  });
  console.log("[NETWORK DETAILS UPDATE TRIGGERED FOR ", network.name, "]");
  fs.writeFileSync(networkDataPath, JSON.stringify(updatedNetworkDetails));
};

module.exports = updateNetworkDetails;
