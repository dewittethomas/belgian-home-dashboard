import { NotFoundError } from "../helpers/execute_helper.js";

function languageSelector(lang) {
    if (!['nl', 'fr', 'de', 'en'].includes(lang)) {
        throw new NotFoundError("Not a valid language parameter.");
    } 
}

export default languageSelector;