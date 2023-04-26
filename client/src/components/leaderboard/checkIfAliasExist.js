import axios from "axios";
import { ALIAS_PATH } from "../../constants";

const getAliases = async () => { 
    try { 
        const response = await axios.get(ALIAS_PATH)
        window.aliases = response.data
    } catch (err) { 
        console.log(err)
    }
}

export const checkIfAliasIsPresent = (alias) => {
    try {
        const aliases = Object.values(window.aliases)
        return aliases.includes(alias)
    } catch (err) { 
        console.log(err)
    }
}

getAliases()