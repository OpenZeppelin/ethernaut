/** @type import('highlight.js') */
const hljs = require('highlight.js/lib/core');

const hljsDefineSolidity = require('highlightjs-solidity');
hljsDefineSolidity(hljs);

module.exports = hljs;
