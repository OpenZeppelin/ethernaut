// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// https://github.com/ethereum-optimism/optimism/blob/@eth-optimism/contracts@0.6.0/packages/contracts/contracts/libraries/rlp/Lib_RLPReader.sol
import { Lib_RLPReader } from "../helpers/lib/rlp/Lib_RLPReader.sol";
// https://github.com/ethereum-optimism/optimism/blob/@eth-optimism/contracts@0.6.0/packages/contracts/contracts/libraries/trie/Lib_SecureMerkleTrie.sol
import { Lib_SecureMerkleTrie } from "../helpers/lib/trie/Lib_SecureMerkleTrie.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IMessageReceiver {
    function onMessageReceived(bytes memory messageData) external;
}

contract NotOptimisticPortal is ERC20, ReentrancyGuard{
    using Lib_RLPReader for bytes;
    using Lib_RLPReader for Lib_RLPReader.RLPItem;

    struct ProofData {
        bytes stateTrieProof;
        bytes storageTrieProof;
        bytes accountStateRlp;
    }

    address public constant L2_TARGET = 0x4242424242424242424242424242424242424242;
    uint16 public constant MAX_ROOT_BUFFER = 1000;

    // Shared data
    address public owner;
    address public sequencer;
    address public immutable governance;

    // L2 state data
    bytes32 public latestBlockHash;
    uint256 public latestBlockNumber;
    uint256 public latestBlockTimestamp;
    bytes32[MAX_ROOT_BUFFER] public l2StateRoots;
    uint16 public bufferCounter;
    mapping(bytes32 => bool) public executedMessages;

    event MessageExecuted(
        address indexed to,
        uint256 indexed amount,
        address[] targetAddresses,
        bytes[] executionDatas,
        uint256 salt
    );

    constructor(
        string memory _name,
        string memory _symbol,
        bytes memory _rlpBlockHeader, 
        address _governance
    ) ERC20(_name, _symbol) {
        owner = msg.sender;
        (bytes32 parentHash, bytes32 stateRoot, uint256 blockNumber, uint256 timestamp) = _extractData(_rlpBlockHeader);
        _updateL2State(keccak256(_rlpBlockHeader), parentHash, stateRoot, blockNumber, timestamp);
        governance = _governance;
    }

    function executeMessage(
        address _tokenReceiver,
        uint256 _amount,
        address[] calldata _messageReceivers,
        bytes[] calldata _messageData,
        uint256 _salt,
        ProofData calldata _proofs,
        uint16 _bufferIndex
    ) external nonReentrant {
        bytes32 withdrawalHash = _computeMessageSlot(
            _tokenReceiver,
            _amount,
            _messageReceivers,
            _messageData,
            _salt
        );
        require(!executedMessages[withdrawalHash], "Message already executed");
        require(_messageReceivers.length == _messageData.length, "Message execution data arrays mismatch");

        for(uint256 i; i < _messageData.length; i++){
            _executeOperation(_messageReceivers[i], _messageData[i], false);
        }

        _verifyMessageInclusion(
            withdrawalHash,
            _proofs.stateTrieProof,
            _proofs.storageTrieProof,
            _proofs.accountStateRlp,
            _bufferIndex
        );

        executedMessages[withdrawalHash] = true;

        if(_amount != 0){
            _mint(_tokenReceiver, _amount);
        }
        emit MessageExecuted(
            _tokenReceiver,
            _amount,
            _messageReceivers,
            _messageData,
            _salt
        );
    }

    function sendMessage(
        uint256 _amount,
        address[] calldata _messageReceivers,
        bytes[] calldata _messageData,
        uint256 _salt
    ) external {
        require(_messageReceivers.length == _messageData.length, "Message array mismatch");
        for(uint256 i; i < _messageData.length; i++){
            require(bytes4(_messageData[i][0:4]) == bytes4(0x3a69197e), "Message not allowed");
        }
        bytes32 storageSlot = _computeMessageSlot(
            msg.sender,
            _amount,
            _messageReceivers,
            _messageData,
            _salt
        );
        uint256 slotValue;
        assembly{
            slotValue := sload(storageSlot)
        }
        require(slotValue == 0, "Message already sent");
        assembly{
            sstore(storageSlot, 0x01)
        }
        _burn(msg.sender, _amount);
    }



    // Permissioned function (optimized to be at the end of the function selector dispatching)
    function submitNewBlock_____37278985983(bytes memory rlpBlockHeader) external onlySequencer {
        (bytes32 parentHash, bytes32 stateRoot, uint256 blockNumber, uint256 timestamp) = _extractData(rlpBlockHeader);
        _updateL2State(keccak256(rlpBlockHeader), parentHash, stateRoot, blockNumber, timestamp);
    }

    function updateSequencer_____76439298743(address newSequencer) external onlyOwner {
        sequencer = newSequencer;
    }

    function transferOwnership_____610165642(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function governanceAction_____2357862414(address target, bytes calldata callData) external onlyGovernance {
        _executeOperation(target, callData, true);
    }

    // Governance must be able to transfer portal ownership
    modifier onlyOwner() {
        require(msg.sender == owner || msg.sender == address(this), "Caller not owner");
        _;
    }

    modifier onlySequencer() {
        require(msg.sender == sequencer, "Caller not sequencer");
        _;
    }

    modifier onlyGovernance() {
        require(msg.sender == governance, "Caller not governance");
        _;
    }


    // Internal functions
    function _computeMessageSlot(
        address _tokenReceiver,
        uint256 _amount,
        address[] calldata _messageReceivers,
        bytes[] calldata _messageDatas,
        uint256 _salt
    ) internal pure returns(bytes32){
        bytes32 messageReceiversAccumulatedHash;
        bytes32 messageDatasAccumulatedHash;
        if(_messageReceivers.length != 0){
            for(uint i; i < _messageReceivers.length - 1; i++){
                messageReceiversAccumulatedHash = keccak256(abi.encode(messageReceiversAccumulatedHash, _messageReceivers[i]));
                messageDatasAccumulatedHash = keccak256(abi.encode(messageDatasAccumulatedHash, _messageDatas[i]));
            }
        }
        return keccak256(abi.encode(
            _tokenReceiver,
            _amount,
            messageReceiversAccumulatedHash,
            messageDatasAccumulatedHash,
            _salt
        ));
    }

    function _extractData(bytes memory rlpBlockHeader) internal pure
        returns(
            bytes32 parentHash,
            bytes32 stateRoot,
            uint256 number,
            uint256 timestamp
        ){
            Lib_RLPReader.RLPItem[] memory header = rlpBlockHeader.toRLPItem().readList();

            parentHash = bytes32(header[0].readUint256());
            stateRoot = bytes32(header[3].readUint256());
            number = header[8].readUint256();
            timestamp = header[11].readUint256();
    }

    function _verifyMessageInclusion(
        bytes32 messageSlot,
        bytes calldata stateTrieProof,
        bytes calldata storageTrieProof,
        bytes calldata accountStateRlp,
        uint16 bufferIndex
    ) internal view {
        // Verify L2_TARGET in state root
        bool accountVerified = Lib_SecureMerkleTrie.verifyInclusionProof(
            abi.encodePacked(L2_TARGET),
            accountStateRlp,
            stateTrieProof,
            l2StateRoots[bufferIndex]
        );
        require(accountVerified, "Invalid account proof");

        // Extract storageRoot
        Lib_RLPReader.RLPItem[] memory accountState = accountStateRlp.toRLPItem().readList();
        
        // Account state is [nonce, balance, storageRoot, codeHash]
        bytes32 storageRoot = accountState[2].readBytes32();

        // Verify message slot in storage root
        bool slotVerified = Lib_SecureMerkleTrie.verifyInclusionProof(
            abi.encodePacked(messageSlot),
            hex"01",
            storageTrieProof,
            storageRoot
        );
        require(slotVerified, "Invalid storage proof");
    }

    function _updateL2State(
        bytes32 newBlockHash,
        bytes32 parentBlockHash,
        bytes32 newRootState,
        uint256 newBlockNumber,
        uint256 newTimestamp
    ) internal {
        if(latestBlockHash != 0) require(parentBlockHash == latestBlockHash, "Invalid parent block hash");
        if(latestBlockNumber != 0) require(newBlockNumber == latestBlockNumber + 1, "Invalid block number");
        require(newTimestamp > latestBlockTimestamp, "Invalid timestamp");

        latestBlockHash = newBlockHash;
        l2StateRoots[bufferCounter] = newRootState;
        bufferCounter = (bufferCounter + 1) % 1000;
        latestBlockNumber = newBlockNumber;
        latestBlockTimestamp = newTimestamp;
    }

    function _executeOperation(
        address target,
        bytes calldata callData,
        bool isGovernanceAction
    ) internal {
        if(!isGovernanceAction){
            // Ensure the execution is the onMessageReceived(bytes) entrypoint on the target address
            require(bytes4(callData[0:4]) == bytes4(0x3a69197e), "Invalid message entrypoint");
        }
        (bool success, ) = target.call(callData);
        require(success, "Execution failed");
    }
}