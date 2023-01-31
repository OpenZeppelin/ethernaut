const callFunctionWithRetry = async (promise, maxNoOfTries) => { 
    let noOfTries = 0;
    let result;

    while (noOfTries < maxNoOfTries) {
        try {
            result = await promise;
            return result;
        } catch (error) {
            console.log(`Try ${noOfTries + 1}/${maxNoOfTries} failed. Retrying...`)
            noOfTries++;
        }
    }

    throw new Error(`Failed to execute function after ${maxNoOfTries} attempts`);
}

module.exports = callFunctionWithRetry;