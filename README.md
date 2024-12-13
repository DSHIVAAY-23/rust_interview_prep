# Rust Basics

## Difference Between `mut` and `let mut`

### `let`
- Immutable by default.
- When you define a variable with `let`, Rust treats it as immutable, meaning its value cannot be changed once set.

### `let mut`
- Enables mutability.
- Using `let mut` allows you to make the variable mutable.

```rust
fn main() {
    let a = 20;
    // a = 30; // Error: cannot assign twice to immutable variable

    let mut b = 22;
    b = 23;

    println!("Value of a is {} and b is {}", a, b);
}
```

## What is Shadowing in Rust?

**Shadowing** allows you to reuse the same variable name in the same scope with a new value or type. The old variable is "hidden" but not deleted; instead, a new variable is created.

### Example
```rust
fn main() {
    let age = "20"; // Step 1: `age` is a string with value "20".
    let age = age.parse::<u8>().unwrap(); // Step 2: `age` is now parsed into a number (u8).

    println!("Double your age plus 7: {}", (age * 2 + 7));
}
```

### Explanation
1. `let age = "20";`
   - `age` is defined as a string.

2. `let age = age.parse::<u8>().unwrap();`
   - The same `age` variable name is reused, but now it holds a number (u8).
   - `age.parse::<u8>()` converts the string "20" to the number 20.

3. `println!`
   - The new `age` is used for calculations.
   - Output: `Double your age plus 7: 47`.

### Why Use Shadowing?
- Change type or value of a variable without creating a new name.
- Makes code more readable and concise.
- Maintains immutability for intermediate values.

---

## Declaring an Array in Rust

### Example
```rust
fn main() {
   let mut arr: [i32; 3] = [1, 5, 7];
   let first_number = arr[0];
   arr[0] = 5;
   println!("The first element of array is: {}", first_number);
}
```

### Output
```
The first element of array is: 1
```

### Explanation
1. **Array Definition**
   ```rust
   let mut arr: [i32; 3] = [1, 5, 7];
   ```
   - A mutable array `arr` of type `[i32; 3]` is defined with initial values `[1, 5, 7]`.

2. **Fetching the First Element**
   ```rust
   let first_number = arr[0];
   ```
   - The value `1` is copied into `first_number`.

3. **Changing the First Element**
   ```rust
   arr[0] = 5;
   ```
   - The first element of the array is updated to `5`, but `first_number` remains `1`.

4. **Printing**
   ```rust
   println!("The first element of array is: {}", first_number);
   ```
   - Output is `1` because `first_number` was assigned before the array was modified.

---

## Ownership in Rust

Rust's **ownership** model manages memory without a garbage collector. Each variable has an **owner**, and when the owner goes out of scope, Rust automatically frees the memory.

### Ownership Rules
1. Each value has a single owner.
2. A value can only have one owner at a time.
3. When the owner goes out of scope, the value is dropped.

### Example
```rust
fn main() {
    let name = String::from("Amit"); // Step 1: `name` owns the memory.
    println!("Name is: {}", name);   // Step 2: `name` is used.

    let another_name = name;         // Step 3: Ownership is transferred to `another_name`.
    // println!("{}", name);         // Step 4: Error! `name` is no longer valid.

    println!("{}", another_name);    // Step 5: `another_name` is used.
}
```

### Explanation
1. `name` owns the `String` memory.
2. Ownership transfers to `another_name`, making `name` invalid.
3. Attempting to use `name` after ownership transfer causes a compile-time error.

### To Clone a Value
Use `clone()` to create a new owner without transferring ownership:
```rust
let name = String::from("Amit");
let another_name = name.clone();
println!("{}", name); // Both are valid.
println!("{}", another_name);
```

---

## Borrowing Rules in Rust

Borrowing allows you to use references to a value without taking ownership.

### Borrowing Rules
1. Only one mutable reference (`&mut`) is allowed at a time.
2. Immutable references (`&`) and mutable references (`&mut`) cannot coexist.
3. References must always be valid.

### Example 1: Single Mutable Reference
```rust
fn main() {
    let mut data = String::from("Hello");
    let r1 = &mut data; // OK: One mutable reference
    // let r2 = &mut data; // Error: Cannot have two mutable references
    r1.push_str(", World!");
    println!("{}", r1); // Output: "Hello, World!"
}
```

### Example 2: Immutable and Mutable References Together
```rust
fn main() {
    let mut data = String::from("Hello");
    let r1 = &data; // Immutable reference
    let r2 = &data; // Another immutable reference
    // let r3 = &mut data; // Error: Cannot mix immutable and mutable references
    println!("{} and {}", r1, r2);
}
```

### Example 3: Dangling References
```rust
fn main() {
    let r;
    {
        let data = String::from("Hello");
        r = &data; // Error: `data` goes out of scope
    }
    // println!("{}", r); // Dangling reference not allowed
}
```

---

### Summary
1. Only one mutable reference allowed at a time.
2. Immutable and mutable references cannot coexist.
3. Rust ensures references are always valid at compile time.

Rust's borrowing system ensures memory safety and eliminates common bugs without a garbage collector.