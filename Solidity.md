# Solidity Cheat Sheet - Advanced Concepts

## 1. Sending ETH: Call vs Send vs Transfer

| Method | Gas | On Fail | Recommended |
|--------|-----|---------|-------------|
| `transfer` | 2300 | Reverts | ❌ No |
| `send` | 2300 | Returns false | ❌ No |
| `call` | All | Returns false | ✅ Yes |

```solidity
// ❌ DON'T USE
payable(addr).transfer(1 ether);
bool success = payable(addr).send(1 ether);

// ✅ USE THIS
(bool success, ) = addr.call{value: 1 ether}("");
require(success, "Failed");
```

## 2. Delegatecall vs Call

```solidity
// CALL: Executes in target's context (changes target's storage)
target.call(abi.encodeWithSignature("setNum(uint256)", 123));

// DELEGATECALL: Executes in caller's context (changes caller's storage)
target.delegatecall(abi.encodeWithSignature("setNum(uint256)", 123));
```

**Use Case**: Proxies use delegatecall to execute implementation logic with proxy's storage.



## 4. Factory Pattern

```solidity
contract TokenFactory {
    Token[] public tokens;
    
    // CREATE: Unpredictable address
    function create() public {
        Token t = new Token();
        tokens.push(t);
    }
    
    // CREATE2: Predictable address
    function create2(bytes32 salt) public {
        Token t = (new Token){salt: salt}();
        tokens.push(t);
    }
}
```

## 5. Storage Packing

```solidity
// ❌ BAD: 3 slots
uint256 a;  // Slot 0
uint8 b;    // Slot 1
address c;  // Slot 2

// ✅ GOOD: 1 slot
uint8 b;    // Slot 0
address c;  // Slot 0 (packed)
uint256 a;  // Slot 1
```

## 6. Reentrancy Protection

```solidity
bool locked;
modifier nonReentrant() {
    require(!locked);
    locked = true;
    _;
    locked = false;
}
```

## 7. Custom Errors (Gas Efficient)

```solidity
error InsufficientBalance(uint requested, uint available);
revert InsufficientBalance(100, 50);  // Saves ~50 gas vs require
```

## 8. Function Selector

```solidity
bytes4 selector = bytes4(keccak256("transfer(address,uint256)"));
// Returns: 0xa9059cbb
```

## 9. ABI Encode/Decode

```solidity
bytes memory data = abi.encode(addr, amount);
(address a, uint b) = abi.decode(data, (address, uint));
```

## 10. Signature Verification

```solidity
bytes32 hash = keccak256(abi.encodePacked(message));
bytes32 ethHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
address signer = ecrecover(ethHash, v, r, s);
```

## 11. Immutable vs Constant

```solidity
uint constant MAX = 100;        // Compile-time, ~3 gas read
uint immutable DEPLOY_TIME;     // Constructor-time, ~3 gas read
uint public value;              // Runtime, ~2100 gas read
```

## 12. Data Locations

```solidity
function f(uint[] calldata arr) external {}  // ✅ Cheapest (immutable)
function f(uint[] memory arr) public {}      // Medium (mutable copy)
uint[] storage arr;                          // Expensive (persistent)
```

## 13. Try/Catch

```solidity
try externalContract.func() returns (uint v) {
    // success
} catch Error(string memory reason) {
    // revert with reason
} catch {
    // other errors
}
```

## 14. Library

```solidity
library SafeMath {
    function add(uint a, uint b) internal pure returns (uint) {
        return a + b;
    }
}
using SafeMath for uint;
uint result = x.add(y);
```

## 15. Gas Optimizations

- Use `++i` instead of `i++` (saves 5 gas)
- Cache array length in loops
- Use `calldata` for external functions
- Pack storage variables
- Use custom errors
- Use `immutable`/`constant`
- Avoid unnecessary storage reads

---

**Quick Reference**: Always use `call` for ETH, delegatecall for proxies, CREATE2 for predictable addresses, and pack storage! 🚀
