/*eslint no-undef: "off"*/
const ethers = require('ethers');

const SignatureCoinFactory = artifacts.require(
  './levels/SignatureCoinFactory.sol'
);
const SignatureCoin = artifacts.require('./levels/SignatureCoin.sol');
const utils = require('../utils/TestUtils');
const BN = Web3.utils.BN;
const { expectRevert } = require('openzeppelin-test-helpers');

contract('SignatureCoin', function (accounts) {
  let ethernaut, level, instance;
  let player = accounts[0];

  let source, recipient, amount, nonce, decimals, sig, scale;

  before(async function () {
    ethernaut = await utils.getEthernautWithStatsProxy();
    level = await SignatureCoinFactory.new();
    await ethernaut.registerLevel(level.address);

    // the source and recipient accounts are two arbitrary addresses chosen psuedorandomly
    const privateKeySource = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes('SignatureCoin:source')
    );
    const privateKeyRecipient = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes('SignatureCoin:recipient')
    );
    source = new ethers.Wallet(privateKeySource);
    recipient = new ethers.Wallet(privateKeyRecipient);

    // the signature corresponds to an arbitrary token transfer
    decimals = 18;
    scale = new BN(10).pow(new BN(decimals));
    amount = new ethers.BigNumber.from(10).pow(decimals).mul(5);
    nonce = 1;
    const encoder = new ethers.utils.AbiCoder();
    const encoding = encoder.encode(
      ['address', 'uint256', 'uint256'],
      [recipient.address, amount, nonce]
    );
    const message = ethers.utils.keccak256(encoding);
    const hash = ethers.utils.arrayify(message);
    const flatSig = await source.signMessage(hash);
    sig = ethers.utils.splitSignature(flatSig);
  });

  beforeEach(async function () {
    instance = await utils.createLevelInstance(
      ethernaut,
      level.address,
      player,
      SignatureCoin
    );
  });

  describe('Initialization', async function () {
    it('should provide 95 tokens to the source', async function () {
      const balance = await instance.balanceOf(source.address);
      assert(balance.eq(scale.mul(new BN(95))));
    });

    it('should provide 5 tokens to the recipient', async function () {
      const balance = await instance.balanceOf(recipient.address);
      assert(balance.eq(scale.mul(new BN(5))));
    });

    it('should not be completed', async function () {
      const isComplete = await utils.submitLevelInstance(
        ethernaut,
        level.address,
        instance.address,
        player
      );
      assert.equal(isComplete, false);
    });
  });

  describe('Replay the same signature', async function () {
    it('should fail to execute', async function () {
      expectRevert(
        instance.transferWithSignature(
          recipient.address,
          amount,
          nonce,
          sig.r,
          sig.s,
          sig.v
        ),
        'SignatureCoin: transfer already executed'
      );
    });
  });

  describe('Malleability attack', async function () {
    // This is taken from the question. In a real attack, it would be read from the original transaction
    // note: it matches the global `sig` variable but we redefine it here so the attack is standalone
    const sig = {
      r: '0x3311019efd630afe231491d2afcfc626870880e99ff5907a814f55539bf1955f',
      s: '0x08dcefa95e708b229636cfe4f952c87721daccd45248e0fd78e32b1ae5e33f21',
      v: 27,
    };

    // This is a property of the secp256k1 elliptic curve
    const order =
      '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141';

    let altSig;
    beforeEach(async function () {
      altSig = {
        r: sig.r,
        s: new ethers.BigNumber.from(order).sub(sig.s).toHexString(),
        v: 55 - sig.v, // map 27 to 28 and vice versa
      };

      await instance.transferWithSignature(
        recipient.address,
        amount,
        nonce,
        altSig.r,
        altSig.s,
        altSig.v
      );
    });

    it('should set the source balance to 90', async function () {
      const balance = await instance.balanceOf(source.address);
      assert(balance.eq(scale.mul(new BN(90))));
    });

    it('should set the recipient balance to 10', async function () {
      const balance = await instance.balanceOf(recipient.address);
      assert(balance.eq(scale.mul(new BN(10))));
    });

    it('should complete the challenge', async function () {
      const isComplete = await utils.submitLevelInstance(
        ethernaut,
        level.address,
        instance.address,
        player
      );
      assert.equal(isComplete, true);
    });
  });
});
