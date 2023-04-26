// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


// OpenZeppelin Contracts (last updated v4.7.0) (access/Ownable.sol)




// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)



/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}


/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


abstract contract Level is Ownable {
  function createInstance(address _player) virtual public payable returns (address);
  function validateInstance(address payable _instance, address _player) virtual public returns (bool);
}

interface IStatistics {
    function saveNewLevel(address level) external;

    function createNewInstance(
        address instance,
        address level,
        address player
    ) external;

    function submitFailure(
        address instance,
        address level,
        address player
    ) external;

    function submitSuccess(
        address instance,
        address level,
        address player
    ) external;
}

contract Ethernaut is Ownable {
    IStatistics public statistics;

    // ----------------------------------
    // Owner interaction
    // ----------------------------------

    mapping(address => bool) public registeredLevels;

    // Only registered levels will be allowed to generate and validate level instances.
    function registerLevel(Level _level) public onlyOwner {
        registeredLevels[address(_level)] = true;
        statistics.saveNewLevel(address(_level));
    }

    function setStatistics(address _statProxy) external onlyOwner {
        statistics = IStatistics(_statProxy);
    }

    // ----------------------------------
    // Get/submit level instances
    // ----------------------------------

    struct EmittedInstanceData {
        address player;
        Level level;
        bool completed;
    }

    mapping(address => EmittedInstanceData) public emittedInstances;

    event LevelInstanceCreatedLog(
        address indexed player,
        address indexed instance,
        address indexed level
    );
    event LevelCompletedLog(
        address indexed player,
        address indexed instance,
        address indexed level
    );

    function createLevelInstance(Level _level) public payable {
        // Ensure level is registered.
        require(registeredLevels[address(_level)], "This level doesn't exists");

        // Get level factory to create an instance.
        address instance = _level.createInstance{value: msg.value}(msg.sender);

        // Store emitted instance relationship with player and level.
        emittedInstances[instance] = EmittedInstanceData(
            msg.sender,
            _level,
            false
        );

        statistics.createNewInstance(instance, address(_level), msg.sender);

        // Retrieve created instance via logs.
        emit LevelInstanceCreatedLog(msg.sender, instance, address(_level));
    }

    function submitLevelInstance(address payable _instance) public {
        // Get player and level.
        EmittedInstanceData storage data = emittedInstances[_instance];
        require(
            data.player == msg.sender,
            "This instance doesn't belong to the current user"
        ); // instance was emitted for this player
        require(data.completed == false, "Level has been completed already"); // not already submitted

        // Have the level check the instance.
        if (data.level.validateInstance(_instance, msg.sender)) {
            // Register instance as completed.
            data.completed = true;

            statistics.submitSuccess(
                _instance,
                address(data.level),
                msg.sender
            );
            // Notify success via logs.
            emit LevelCompletedLog(msg.sender, _instance, address(data.level));
        } else {
            statistics.submitFailure(
                _instance,
                address(data.level),
                msg.sender
            );
        }
    }
}



