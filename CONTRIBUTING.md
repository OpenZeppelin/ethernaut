# Contributing to Ethernaut

Thank you for your interesting in contributing to Ethernaut!

Please follow the steps below. If you're new to git and/or GitHub, we suggest you go through the [GitHub Guides](https://guides.github.com/introduction/flow/).

1. Fork this repository
2. Clone the fork replacing `<username>` with your github username
   - Using SSH

        ```bash
        git clone --filter=blob:none git@github.com:<username>/ethernaut.git
        ```

   - Using HTTPS

        ```bash
        git clone --filter=blob:none https://github.com/<username>/ethernaut.git
        ```

   - Using GitHub CLI

        ```bash
        gh repo clone <username>/ethernaut -- --filter=blob:none
        ```

3. Create a new branch from the latest `master`
4. Start hacking on the new branch according to the type of contribution outlined below
5. Commit and push to the new branch
6. Make a pull request against `OpenZeppelin/ethernaut master`

## Contribution Types

Currently, we are reviewing contributions of the following types:

<!-- no toc -->
- [Level Development](#level-development)
- [Translations and Additional Languages](#translations-and-additional-languages)
- [Documentation Updates and Corrections](#documentation-updates-and-corrections)

If you would like to contribute in another way, please reach out to us via email: [ethernaut@zeppelin.solutions](mailto:ethernaut@zeppelin.solutions)

### Level development

*A level is composed of the following elements:*

- A `<Level>Factory.sol` contract, where `<Level>` is replaced by the name of the level, that needs to extend [`Level.sol`](./contracts/contracts/levels/base/Level.sol). This factory contract will be deployed only once and registered on Ethernaut.sol by Ethernaut's owner. Players never interact with the factory directly. The factory is in charge of creating level instances for players to use (1 instance per player) and to check these instances to verify if the player has passed the level. Factories should not have state that can be changed by the player.
- A `level instance` contract named `<Level>.sol`, where `<Level>` is replaced by the name of the level, that is emitted by the factory for each player that requests it. Instances need to be completely decouppled from Ethernaut's architecture. Factories will emit them and verify them. That is, level instances don't know anything about their factories or Ethernaut. An instance's state can be completely demolished by players and even destroyed since they are not really part of the architecture, just a challenge for a player to use at will.
- A `description file` in [the descriptions directory](./client/src/gamedata/en/descriptions/levels) that the UI presents to the player and describes the level's objectives with some narrative and tips.
- A `description completion file` also located in [the descriptions directory](./client/src/gamedata/en/descriptions/levels) that the UI presents to the player when the level is passed, further information about the player, historical insights, further explanations or just a congrats message.
- A `tests file` in the [`test directory`](./contracts/test/levels/) that performs unit tests on the level.
- A `json entry` for the level in [gamedata.json](client/src/gamedata/gamedata.json) that appends metadata to the level. The UI uses this metadata to display the level's title, difficulty, etc, but also to determine if sources are shown, the default gas for the creation of an instance, instance contract verification on explorers, etc. NOTE: "deployId" **must** be unique and is also used by the deployment script.
- Optionally, an `author entry` in [authors.json](client/src/gamedata/authors.json). You can specify opt-in information about yourself in this file.

#### Example level development: King

Let's suppose that we are creating the level "King" (which is already created and available in the game of course).

1. Fork this repo, clone and yarn install.
2. Use the other levels as a basis, eg. duplicate DummyFactory.sol and Dummy.sol.
3. Rename and modify the contracts to KingFactory.sol and King.sol respectively.
4. Implement the desired instance and factory logic in solidity. See current levels and notes to understand how the game mechanics work.
5. Add the test file `contracts/test/levels/King.test.js`. Use other tests files as reference to see how tests might work.
6. Run `yarn test:contracts` and once all tests pass, register the level in [gamedata.json](client/src/gamedata/gamedata.json).
7. The level should now show up in the ui. To start the UI, set the [ACTIVE_NETWORK](client/src/constants.js) to `NETWORKS.LOCAL` and run `yarn start`.
8. Add a description markdown file, in this case client/src/gamedata/levels/king.md (make sure gamedata.json points to it). This content will now be displayed in the ui for the level.
9. Add a completed description markdown file, in this case client/src/gamedata/levels/king_complete.md (make sure gamedata.json points to it). The level will display this as additional info once the level is solved, usually to include historical information related to the level.
10. Verify that the level is playable and winnable via UI. It is common for levels to be beatable in some way in tests that doesn't work using the UI, so it is important to test it manually as well.
11. Make a PR request so that we can re-deploy the game with the new level!

### Translations and additional languages

To modify or add a new language to the list of supported ones, follow these steps:

1. under `client/src/gamedata` create a new folder with the languge you want to add.
2. Copy paste the content you want to translate of any other language into the new directory.
3. You will need to translate two things:

     - `pages` and `level` descriptions under `descriptions` subdirectory
     - `strings.json`. For this, only the values of the keys in the json must be translated. Do not translate keys (i.e. `nextLevel`).

4. If you are just modifying an already existing language you can stop here and submit a PR. If you're adding a new language go to the next steps. Translations are mantained by the community but we ask to translate at least the `Help` page, the `strings.json` and the `instances.md` and `instances_complete.md` files entirely since those are the most important ones to understand how the game works. Levels which are not translated will default to English in any case.
5. Add a new key/value in all `strings.json` of all languages for the newly added language. For example, if you're going to add French, add

    ```bash
    #In `en/strings.json` add:

    {
        ...
        "french": "French",
        ...
    }

    #In `es/strings.json` add:
    {
        ...
        "french": "Francés",
        ...
    }
    ```

6. Once translation is done, add an entry in `client/src/containers/Headers.js` in the language picker for the user interface so you can select your added language:

    ```html
    <li>
    <select style={{fontSize: 'small'}} onChange={this.changeLanguage.bind(this)} value={this.state.lang ? this.state.lang : 'en'}>
        <option value="en">{strings.english}</option>
        <option value="es">{strings.spanish}</option>
        ---> ADD AN ENTRY HERE <---
        </select>
    </li>
    ```

7. You can now submit a PR and we will review.

### Documentation updates and corrections

There are no specific files that need to be changed for these types of fixes. Once you correct the documentation please open a PR and we will review it!
