import axios from "axios";

export const checkIfAliasIsPresent = async (alias) => {
    try {
        const response = await axios.get('https://raw.githubusercontent.com/OpenZeppelin/ethernaut/leaderboard-periodic-update/client/leaderboard/boards/aliases.json')
        const aliases = response.data
        if (aliases[alias]) { 
            return true;
        }
        return false;
    } catch (err) { 
        console.log(err)
    }
}