
# 📄 Smart Contract Audit Process — Documentation Summary

## 🔍 Phase 1: Scoping & Audit Readiness

### 🎯 Goal:
Understand **project maturity** and determine if the codebase is ready for a security review.

### ✅ Checklist:
- **Code Access:** Never audit code provided only via Etherscan links.
- **Expectations:**
  - GitHub repo or Git access
  - Testing framework (e.g., Foundry, Hardhat)
  - Deployment scripts
- **Audit Readiness Questions (Rekt Test):**
  - Is the code deployed and verified?
  - Are there tests and documentation?
  - Are there signs of active maintenance?

### 🚩 Red Flags:
- No test suite
- Pressure to audit quickly
- Incomplete or unverified code

---

## 🔎 Phase 2: Understanding the Codebase (REKT Test Style)

### 🧠 Objective:
Build an internal understanding of the contract before hunting bugs.

### 🧰 Actions:
- Start from the top of the codebase
- Read NatSpec documentation
- Note compiler version, naming conventions, visibility, etc.
- Maintain a `.notes.md` file with:
  - Questions (`// Q:`)
  - Observations (`// I:`)
  - Potential issues (`// @Audit:`)
- Ask for client clarification when unclear

### 🧾 Pro Tips:
- Use printed code with highlighters (e.g., like 0Kage)
- Use tools like `headers` from `transmissions11` for repo navigation

---

## ⚠️ Phase 3: Vulnerability Identification

### 🐞 Example:
```solidity
function setPassword(string memory newPassword) external {
    s_password = newPassword;
    emit SetNetPassword();
}
```

### 🚨 Finding:
- **Claimed:** Only the owner can call this
- **Actual:** No access control implemented
- **Impact:** Anyone can overwrite the password

### 📝 How to Document It:
```solidity
// @Audit - High - any user can set a password (missing access control)
```

### 🎯 Key Lesson:
Focus on **access control**, **state manipulation**, **reentrancy**, etc. Use **comments + notes** for clarity.

---

## 🗂️ Phase 4: Reporting

### 📝 Finding Template:
```md
[S-#] Title (Root Cause + Impact)

**Description:**  
Explain the bug clearly and concisely

**Impact:**  
Describe what could happen

**Proof of Concept:**  
Add a simple example or test that shows the bug

**Recommended Mitigation:**  
Explain how to fix it (e.g., add `onlyOwner` modifier)
```

### 👨‍🏫 Why It Matters:
- Convince client the issue is real
- Communicate impact clearly
- Educate on secure coding practices

---

## ⚖️ Phase 5: Evaluating Severity

### 📈 Severity Breakdown:

| Severity | Impact                                                                 | Likelihood                          |
|----------|------------------------------------------------------------------------|-------------------------------------|
| High     | Direct risk to funds, protocol disruption                             | Easily callable by attacker         |
| Medium   | Indirect fund risk, moderate disruption                               | Triggered under specific conditions |
| Low      | No fund risk, incorrect logic, UX bugs                                | Rare edge case                      |

🔗 **Reference**: [CodeHawks Severity Evaluation Guide](https://docs.codehawks.com/hawks-auditors/how-to-evaluate-a-finding-severity)

---

## 🧠 Interview-Ready Takeaways

- Show that **scoping** is as important as code review
- Emphasize the role of **code comprehension** before bug hunting
- Mention usage of tools & methods (`.notes.md`, NatSpec, headers, printing code)
- Explain **how you report findings** using a minimal, structured format
- Discuss how you **assess severity** (Impact × Likelihood)
