import axios from "axios";
import { ALIAS_PATH } from "../../constants";

export const checkIfAliasIsPresent = async (alias) => {
    try {
        const response = await axios.get(ALIAS_PATH)
        const aliases = response.data
        if (aliases[alias]) { 
            return true;
        }
        return false;
    } catch (err) { 
        console.log(err)
    }
}