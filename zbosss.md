// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// --- 1. INHERITANCE & VISIBILITY ---
contract Parent {
    uint256 public publicVar = 100;
    uint256 internal internalVar = 200;
    uint256 private privateVar = 300; 

    function _internalFunction() internal view returns(uint256) {
        return internalVar;
    }

    function externalFunction() external pure returns(string memory) {
        return "Called External";
    }
}

// --- 2. MASTER CHEAT SHEET ---
contract MasterCheatSheet is Parent {
    
    // --- STATE VARIABLES ---
    address public owner; 
    uint256 public maxSupply; 
    uint256 public constant MIN_FEE = 0.01 ether; 
    address public immutable i_creator;

    struct Person {
        string name;
        uint256 age;
    }
    Person[] public people; 
    mapping(address => uint256) public balances; 

    event Deposited(address indexed sender, uint256 amount);
    event Withdrawn(address indexed receiver, uint256 amount);

    // --- 3. CONSTRUCTOR ---
    constructor(uint256 _maxSupply) {
        owner = msg.sender;
        i_creator = msg.sender;
        maxSupply = _maxSupply;
    }

    // --- 4. RECEIVE & FALLBACK ---
    receive() external payable {
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    fallback() external payable {
        balances[msg.sender] += msg.value;
    }

    // --- 5. MODIFIERS ---
    modifier onlyOwner() {
        require(msg.sender == owner, "Not Owner");
        _; 
    }

    // --- 6. VIEW vs PURE ---
    function getOwner() public view returns (address) {
        return owner;
    }

    function addPure(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }

    // --- 7. INHERITANCE TEST ---
    function testInheritance() public view returns (uint256) {
        return _internalFunction(); 
    }

    // --- 8. SENDING ETH (Recommended Way) ---
    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer Failed");
        
        emit Withdrawn(msg.sender, amount);
    }

    // --- 9. ARRAY & MAPPING ---
    function addPerson(string memory _name, uint256 _age) public {
        people.push(Person(_name, _age));
        balances[msg.sender] += 10;
    }
}

// --- 10. FACTORY PATTERN ---
contract Factory {
    MasterCheatSheet[] public deployedContracts;

    function createNewContract(uint256 _supply) public {
        MasterCheatSheet newContract = new MasterCheatSheet(_supply);
        deployedContracts.push(newContract);
    }

    function createDeterministic(uint256 _supply, bytes32 _salt) public {
        new MasterCheatSheet{salt: _salt}(_supply);
    }
}
