# Solidity Advanced Topics Cheat Sheet

## 1. Events & Logging

```solidity
event Transfer(address indexed from, address indexed to, uint amount);
event Log(string message);

function transfer(address to, uint amount) public {
    emit Transfer(msg.sender, to, amount);
}

// Up to 3 indexed parameters (searchable)
// indexed parameters are hashed (can't get original value)
```

## 2. Modifiers

```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "not owner");
    _;  // Function body inserted here
}

modifier validAddress(address _addr) {
    require(_addr != address(0), "zero address");
    _;
}

function withdraw() external onlyOwner validAddress(msg.sender) {
    // Function code
}
```

## 3. Inheritance & Virtual/Override

```solidity
contract A {
    function foo() public virtual returns (string memory) {
        return "A";
    }
}

contract B is A {
    function foo() public override returns (string memory) {
        return "B";
    }
}

// Multiple inheritance
contract C is A, B {
    function foo() public override(A, B) returns (string memory) {
        return super.foo();  // Calls B.foo()
    }
}
```

## 4. Abstract Contracts & Interfaces

```solidity
// Abstract: Has at least one unimplemented function
abstract contract Animal {
    function makeSound() public virtual returns (string memory);
}

// Interface: All functions unimplemented, no state variables
interface IERC20 {
    function transfer(address to, uint amount) external returns (bool);
    function balanceOf(address account) external view returns (uint);
}
```

## 5. Enums

```solidity
enum Status { Pending, Shipped, Delivered, Canceled }

Status public status;

function ship() external {
    status = Status.Shipped;
}

function get() external view returns (Status) {
    return status;
}

// Reset to first value
function reset() external {
    delete status;  // Sets to Pending (0)
}
```

## 6. Structs

```solidity
struct User {
    string name;
    uint age;
    address wallet;
}

User[] public users;
mapping(address => User) public userMap;

function addUser(string memory _name, uint _age) public {
    // Method 1: Key-value
    users.push(User({name: _name, age: _age, wallet: msg.sender}));
    
    // Method 2: Positional
    users.push(User(_name, _age, msg.sender));
    
    // Method 3: Initialize empty then set
    User memory user;
    user.name = _name;
    user.age = _age;
    users.push(user);
}
```

## 7. Mapping Advanced

```solidity
// Nested mapping
mapping(address => mapping(address => uint)) public allowance;

// Iterable mapping pattern
struct UserInfo {
    uint balance;
    bool exists;
}
mapping(address => UserInfo) public users;
address[] public userList;

function addUser(address _user, uint _balance) public {
    if (!users[_user].exists) {
        userList.push(_user);
        users[_user].exists = true;
    }
    users[_user].balance = _balance;
}
```

## 8. Array Operations

```solidity
uint[] public arr;

function examples() external {
    arr.push(1);           // Add to end
    arr.push(2);
    arr[0] = 10;           // Update
    delete arr[1];         // Sets to 0, doesn't reduce length
    arr.pop();             // Remove last element
    uint len = arr.length; // Get length
}

// Remove by shifting
function remove(uint index) public {
    for (uint i = index; i < arr.length - 1; i++) {
        arr[i] = arr[i + 1];
    }
    arr.pop();
}
```

## 9. Payable & Ether Units

```solidity
function deposit() external payable {
    // msg.value in wei
}

// Ether units
1 wei == 1;
1 gwei == 1e9;
1 ether == 1e18;

// Time units
1 seconds == 1;
1 minutes == 60;
1 hours == 3600;
1 days == 86400;
1 weeks == 604800;
```

## 10. Visibility Modifiers

```solidity
contract Visibility {
    uint private x = 0;      // Only this contract
    uint internal y = 1;     // This + derived contracts
    uint public z = 2;       // Anyone (auto getter)
    
    function privateFunc() private {}    // Only this contract
    function internalFunc() internal {}  // This + derived
    function publicFunc() public {}      // Anyone
    function externalFunc() external {}  // Only external calls
}
```

## 11. Error Handling

```solidity
// require: Validate inputs, refunds remaining gas
require(msg.sender == owner, "not owner");

// revert: Same as require but for complex logic
if (balance < amount) {
    revert("insufficient balance");
}

// assert: Check invariants, consumes all gas (use sparingly)
assert(balance >= 0);

// Custom errors (gas efficient)
error Unauthorized(address caller);
if (msg.sender != owner) revert Unauthorized(msg.sender);
```

## 12. Function Types

```solidity
// Pure: No read/write state
function add(uint a, uint b) public pure returns (uint) {
    return a + b;
}

// View: Read state, no write
function getBalance() public view returns (uint) {
    return balance;
}

// Payable: Can receive ETH
function deposit() public payable {}

// Returns multiple values
function multiReturn() public pure returns (uint, bool, string memory) {
    return (1, true, "hello");
}
```

## 13. Constructor & Selfdestruct

```solidity
contract MyContract {
    address public owner;
    
    constructor(address _owner) {
        owner = _owner;
    }
}

// Selfdestruct (deprecated, avoid)
function destroy() external {
    selfdestruct(payable(owner));  // Sends ETH to owner
}
```

## 14. Import Patterns

```solidity
// Import everything
import "./Helper.sol";

// Named imports
import {Helper, Utils} from "./Contracts.sol";

// Aliasing
import * as MyLib from "./Library.sol";

// From node_modules
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
```

## 15. Assembly (Yul)

```solidity
function getCodeSize(address _addr) public view returns (uint size) {
    assembly {
        size := extcodesize(_addr)
    }
}

function add(uint a, uint b) public pure returns (uint result) {
    assembly {
        result := add(a, b)
    }
}
```

## 16. Unchecked Math (0.8.0+)

```solidity
// Disable overflow checks for gas savings
function uncheckedAdd(uint a, uint b) public pure returns (uint) {
    unchecked {
        return a + b;  // No overflow check, saves gas
    }
}
```

## 17. Bitwise Operations

```solidity
uint a = 5;  // 0101
uint b = 3;  // 0011

a & b;   // AND: 0001 = 1
a | b;   // OR:  0111 = 7
a ^ b;   // XOR: 0110 = 6
~a;      // NOT: 1010 (inverted)
a << 1;  // Left shift: 1010 = 10
a >> 1;  // Right shift: 0010 = 2
```

## 18. Keccak256 Hashing

```solidity
bytes32 hash = keccak256(abi.encodePacked("hello", uint(123)));

// Collision resistance
function verify(string memory _input) public pure returns (bool) {
    return keccak256(abi.encodePacked(_input)) == 
           keccak256(abi.encodePacked("password"));
}
```

## 19. Transient Storage (0.8.24+)

```solidity
// Temporary storage cleared after transaction
contract TransientExample {
    bytes32 constant LOCK_SLOT = keccak256("lock");
    
    modifier nonReentrant() {
        assembly {
            if tload(LOCK_SLOT) { revert(0, 0) }
            tstore(LOCK_SLOT, 1)
        }
        _;
        assembly {
            tstore(LOCK_SLOT, 0)
        }
    }
}
```

## 20. User-Defined Value Types

```solidity
type Price is uint256;

function add(Price a, Price b) pure returns (Price) {
    return Price.wrap(Price.unwrap(a) + Price.unwrap(b));
}
```

---

**Quick Tips**:
- Use events for off-chain logging
- Prefer custom errors over require strings
- Use `unchecked` for gas savings when safe
- Avoid `selfdestruct` (deprecated)
- Use transient storage for reentrancy guards (0.8.24+)

**Complete Coverage**: Now you have all 3 cheat sheets covering basics, security, and advanced topics! 🚀
