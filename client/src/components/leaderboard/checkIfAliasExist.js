import axios from "axios";
import { ALIAS_PATH } from "../../constants";

export const checkIfAliasIsPresent = async (alias) => {
    try {
        const response = await axios.get(ALIAS_PATH)
        const aliases = Object.values(response.data)
        return aliases.includes(alias)
    } catch (err) { 
        console.log(err)
    }
}