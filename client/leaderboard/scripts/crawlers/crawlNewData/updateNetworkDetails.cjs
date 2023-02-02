const networkDataPath = "client/leaderboard/utils/networkDetails.json";
const fs = require("fs");

const updateNetworkDetails = async (network, upperBlock) => {
  const networkDetails = JSON.parse(fs.readFileSync(networkDataPath));
  const updatedNetworkDetails = networkDetails.map((networkDetail) => {
    if (networkDetail.name === network.name) {
      return {
        ...networkDetail,
        lastFrom: upperBlock + 1,
      };
    }
    if (networkDetail.name !== network.name) {
      return networkDetail;
    }
    
  });
  console.log("[NETWORK DETAILS UPDATE TRIGGERED FOR ", network.name, "]. LAST UPPER BLOCK RECORDED IS " + upperBlock);
  fs.writeFileSync(networkDataPath, JSON.stringify(updatedNetworkDetails));
};

module.exports = updateNetworkDetails;
