const DEFAULT_MAX_RETRIES = 5;

const callFunctionWithRetry = async (
  promise,
  maxNoOfTries = DEFAULT_MAX_RETRIES
) => {
  let noOfTries = 0;
  let result;

  while (noOfTries < maxNoOfTries) {
    try {
      result = await promise();
      return result;
    } catch (error) {
      console.log(`Try ${noOfTries + 1}/${maxNoOfTries} failed. Retrying...`);
      noOfTries++;
    }
  }
};

module.exports = callFunctionWithRetry;
