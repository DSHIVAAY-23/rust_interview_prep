# Solidity Applications & Security Cheat Sheet

## 1. Ether Wallet (Simple)

```solidity
contract EtherWallet {
    address payable public owner;
    
    constructor() { owner = payable(msg.sender); }
    receive() external payable {}  // Accept ETH
    
    function withdraw(uint _amount) external {
        require(msg.sender == owner, "not owner");
        payable(msg.sender).transfer(_amount);
    }
    
    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}
```

## 2. English Auction (NFT)

```solidity
contract EnglishAuction {
    IERC721 public nft;
    address payable public seller;
    uint public endAt;
    address public highestBidder;
    uint public highestBid;
    mapping(address => uint) public bids;  // Failed bids to withdraw
    
    function start() external {
        nft.transferFrom(msg.sender, address(this), nftId);
        endAt = block.timestamp + 7 days;
    }
    
    function bid() external payable {
        require(msg.value > highestBid, "too low");
        if (highestBidder != address(0)) {
            bids[highestBidder] += highestBid;  // Refund previous bidder
        }
        highestBidder = msg.sender;
        highestBid = msg.value;
    }
    
    function withdraw() external {
        uint bal = bids[msg.sender];
        bids[msg.sender] = 0;  // CEI pattern
        payable(msg.sender).transfer(bal);
    }
    
    function end() external {
        require(block.timestamp >= endAt, "not ended");
        nft.safeTransferFrom(address(this), highestBidder, nftId);
        seller.transfer(highestBid);
    }
}
```

## 3. Reentrancy Attack & Prevention

### ❌ Vulnerable Code
```solidity
contract Vulnerable {
    mapping(address => uint) public balances;
    
    function withdraw() public {
        uint bal = balances[msg.sender];
        (bool sent, ) = msg.sender.call{value: bal}("");  // ⚠️ External call first
        require(sent);
        balances[msg.sender] = 0;  // ⚠️ State update AFTER call
    }
}

// Attacker drains contract by calling withdraw recursively
contract Attacker {
    receive() external payable {
        if (address(victim).balance > 0) {
            victim.withdraw();  // Reenter!
        }
    }
}
```

### ✅ Secure Code (CEI Pattern)
```solidity
contract Secure {
    mapping(address => uint) public balances;
    bool private locked;
    
    modifier nonReentrant() {
        require(!locked, "no reentrancy");
        locked = true;
        _;
        locked = false;
    }
    
    function withdraw() public nonReentrant {
        uint bal = balances[msg.sender];
        balances[msg.sender] = 0;  // ✅ Update state FIRST
        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent);
    }
}
```

**CEI Pattern**: Checks → Effects → Interactions

## 4. Transparent Proxy vs UUPS

| Feature | Transparent Proxy | UUPS |
|---------|-------------------|------|
| **Upgrade logic** | In proxy | In implementation |
| **Gas cost** | Higher (checks admin) | Lower |
| **Function clashing** | Prevented | Possible |
| **Security** | Safer | Requires careful impl |
| **Storage** | Proxy stores impl address | Implementation stores impl address |

### Transparent Proxy
```solidity
contract TransparentProxy {
    address public admin;
    address public implementation;
    
    modifier ifAdmin() {
        if (msg.sender == admin) {
            _;
        } else {
            _fallback();
        }
    }
    
    function upgradeTo(address newImpl) external ifAdmin {
        implementation = newImpl;
    }
    
    fallback() external payable {
        _fallback();
    }
    
    function _fallback() internal {
        address impl = implementation;
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
}
```

### UUPS Proxy
```solidity
contract UUPSProxy {
    address public implementation;
    
    fallback() external payable {
        address impl = implementation;
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
}

// Implementation has upgrade logic
contract Implementation is UUPSUpgradeable {
    function upgradeTo(address newImpl) external onlyOwner {
        _upgradeTo(newImpl);  // Upgrade logic in implementation
    }
}
```

**Key Difference**: Transparent checks `msg.sender == admin` on every call (gas cost), UUPS doesn't.

## 5. Common Security Vulnerabilities

### Integer Overflow (Pre-0.8.0)
```solidity
// ❌ Solidity <0.8.0
uint8 x = 255;
x++;  // Wraps to 0

// ✅ Solidity >=0.8.0 (auto-checks)
uint8 x = 255;
x++;  // Reverts
```

### tx.origin Phishing
```solidity
// ❌ NEVER USE tx.origin for auth
function withdraw() external {
    require(tx.origin == owner);  // Vulnerable!
}

// ✅ Use msg.sender
function withdraw() external {
    require(msg.sender == owner);
}
```

### Front-Running
```solidity
// Vulnerable: Predictable randomness
uint random = uint(keccak256(abi.encodePacked(block.timestamp)));

// Better: Use Chainlink VRF for true randomness
```

## 6. Access Control Patterns

```solidity
// Simple Owner
address public owner;
modifier onlyOwner() {
    require(msg.sender == owner);
    _;
}

// Role-Based (OpenZeppelin)
bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
function mint() external onlyRole(MINTER_ROLE) {}
```

## 7. Emergency Patterns

```solidity
contract Pausable {
    bool public paused;
    
    modifier whenNotPaused() {
        require(!paused, "paused");
        _;
    }
    
    function pause() external onlyOwner {
        paused = true;
    }
}
```

## 8. Safe Math (Pre-0.8.0)

```solidity
// Solidity <0.8.0: Use SafeMath
using SafeMath for uint;
uint result = a.add(b);

// Solidity >=0.8.0: Built-in overflow checks
uint result = a + b;  // Auto-reverts on overflow
```

---

**Security Checklist**:
- ✅ Use CEI pattern (Checks-Effects-Interactions)
- ✅ Add reentrancy guards
- ✅ Use `msg.sender` not `tx.origin`
- ✅ Validate all inputs
- ✅ Use Solidity >=0.8.0
- ✅ Add pause mechanism
- ✅ Test thoroughly
- ✅ Get audited before mainnet

**Quick Reference**: CEI pattern prevents reentrancy, UUPS is cheaper than Transparent, always use `msg.sender`! 🔒
