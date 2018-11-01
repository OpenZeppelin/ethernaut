/*eslint no-undef: "off"*/
const Alias = artifacts.require('./Alias.sol');
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow';
import * as aliasUtil from '../src/utils/aliasutil';

contract('Alias', function (accounts) {
  let aliasContract;
  const owner = accounts[0];
  const playerA = accounts[1];
  const playerB = accounts[2];

  beforeEach(async () => {
    aliasContract = await Alias.new();
    aliasUtil.set(web3, aliasContract);
  });

  const validAlias = ['playera', 'p', 'quinquagintaquadringentillionths', 'playera0x', 'playerA'];

  validAlias.forEach((value) => {
    it(`should allow alias: ` + value, async () => {
      await aliasUtil.setAlias(value, { from: playerA });

      const aliasInContract = await aliasUtil.getAliasForPlayer(playerA);

      assert.equal(value.toLowerCase(), aliasInContract);
    });
  });

  it(`should allow alias to be reused if changed`, async () => {
    const validAlias = 'reuse';

    await aliasUtil.setAlias(validAlias, { from: playerA });
    await aliasUtil.setAlias('playera', { from: playerA });
    await aliasUtil.setAlias(validAlias, { from: playerB });

    const aliasInContract = await aliasUtil.getAliasForPlayer(playerB);

    assert.equal(validAlias, aliasInContract);
    assert.equal(await aliasContract.getCount(), 2);
  });

  it(`should return player address if no alias set`, async () => {
    const aliasInContract = await aliasUtil.getAliasForPlayer(playerA);

    assert.equal(playerA, aliasInContract);
  });

  it(`should not allow playerB to set alias to existing alias`, async () => {
    const validAlias = 'playera';
    await aliasUtil.setAlias(validAlias, { from: playerA });

    await expectThrow(aliasUtil.setAlias(validAlias, { from: playerB }));
  });

  it(`isValidAlias should return true for an alias that is not in use`, async () => {
    assert.equal(await aliasContract.isValidAlias('playera'), true);
  });

  it(`isValidAlias should return false for an alias that is in use`, async () => {
    const validAlias = 'playera';
    await aliasUtil.setAlias(validAlias, { from: playerA });

    assert.equal(await aliasContract.isValidAlias(validAlias), false);
  });

  it(`addressOf should return the correct address of the alias`, async () => {
    const validAlias = 'playera';
    await aliasUtil.setAlias(validAlias, { from: playerA });

    const aliasInContract = await aliasContract.addressOf(validAlias);

    assert.equal(aliasInContract, playerA);
  });

  it(`addressOf should return 0x0 address if the alias is not set`, async () => {
    const aliasInContract = await aliasContract.addressOf('playera');

    assert.equal(aliasInContract, '0x0000000000000000000000000000000000000000');
  });

  const invalidAlias = ['', 'quinquagintaquadringentillionthsz', ' playera', 'playera ', 'player  a', '0xplayera', '999',
    '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '~', '`', '{', '}', '[', ']', '|', ':', ';', '<', '>', '?', ',', '.', '/'];

  invalidAlias.forEach((value) => {
    it(`should not allow alias:` + value, async () => {
      await expectThrow(aliasUtil.setAlias(value, { from: playerA }));
    });
  });

  // test setAliasAdmin
  it(`should allow admin to override alias`, async () => {
    const badAlias = 'badword';
    const ownerAlias = 'iamownerhearmeroar';
    await aliasUtil.setAlias(badAlias, { from: playerA });
    await aliasUtil.setAlias(ownerAlias, { from: owner });

    await aliasContract.overrideAlias(badAlias, { from: owner });

    // alias should be reset to their address
    assert.equal(await aliasUtil.getAliasForPlayer(playerA), playerA);

    // owners alias should not have been changed
    assert.equal(await aliasUtil.getAliasForPlayer(owner), ownerAlias);

    // bad alias should be invalid now
    assert.equal(await aliasContract.isValidAlias(badAlias), false);

    // ensure item was removed from playerAlias array
    assert.equal(await aliasContract.getCount(), 1);
  });

  it(`should allow admin to override alias order`, async () => {
    const badAlias = 'badword';
    const ownerAlias = 'iamownerhearmeroar';
    await aliasUtil.setAlias(ownerAlias, { from: owner });
    await aliasUtil.setAlias(badAlias, { from: playerA });

    await aliasContract.overrideAlias(badAlias, { from: owner });

    // alias should be reset to their address
    assert.equal(await aliasUtil.getAliasForPlayer(playerA), playerA);

    // owners alias should not have been changed
    assert.equal(await aliasUtil.getAliasForPlayer(owner), ownerAlias);

    // bad alias should be invalid now
    assert.equal(await aliasContract.isValidAlias(badAlias), false);

    // ensure item was removed from playerAlias array
    assert.equal(await aliasContract.getCount(), 1);
  });

  it(`should not allow player to use overriden alias`, async () => {
    const badAlias = 'badword';
    const ownerAlias = 'iamownerhearmeroar';
    await aliasUtil.setAlias(badAlias, { from: playerA });
    await aliasUtil.setAlias(ownerAlias, { from: owner });

    await aliasContract.overrideAlias(badAlias, { from: owner });
    await expectThrow(aliasUtil.setAlias(badAlias, { from: playerA }));
  });

  it(`should not allow non admin to override alias`, async () => {
    const validAlias = 'playera';
    await aliasUtil.setAlias(validAlias, { from: playerA });

    await expectThrow(aliasContract.overrideAlias(validAlias, { from: playerB }));
  });

  it(`should not allow admin to override their own alias`, async () => {
    const ownerAlias = 'iamownerhearmeroar';
    await aliasUtil.setAlias(ownerAlias, { from: owner });

    await expectThrow(aliasContract.overrideAlias(ownerAlias, { from: owner }));
  });

  it(`should not allow admin to override alias that does not exist`, async () => {
    await expectThrow(aliasContract.overrideAlias('playera', { from: owner }));
  });

  it(`should not allow admin to override alias if admin alias hasn't been set`, async () => {
    const badAlias = 'badword';
    await aliasUtil.setAlias(badAlias, { from: playerA });

    await expectThrow(aliasContract.overrideAlias(badAlias, { from: owner }));
  });

  // test ui method setAliasWithChecks
  validAlias.forEach((value) => {
    it(`setAliasWithChecks: should allow alias: ` + value, async () => {
      await aliasUtil.setAliasWithChecks(value, { from: playerA });

      const aliasInContract = await aliasUtil.getAliasForPlayer(playerA);

      assert.equal(value.toLowerCase(), aliasInContract);
    });
  });

  it(`setAliasWithChecks: should not allow playerB to set alias to existing alias`, async () => {
    const validAlias = 'playera';
    await aliasUtil.setAliasWithChecks(validAlias, { from: playerA });

    const result = await aliasUtil.setAliasWithChecks(validAlias, { from: playerA })
      .catch(error => {
      });

    assert.equal(result === true, false);
  });

  invalidAlias.forEach((value) => {
    it(`setAliasWithChecks: should not allow alias: ` + value, async () => {

      const result = await aliasUtil.setAliasWithChecks(value, { from: playerA })
        .catch(error => {
        });

      assert.equal(result === true, false);
    });
  });
});
