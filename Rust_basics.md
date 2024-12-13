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

---

### What are Generics in Rust?

In Rust, **Generics** are used when you want to write a function or data structure that works with **multiple types**. In other words, you write a general solution that can work with different data types without having to duplicate the code for each type. This makes your code more flexible and reusable.

Generics in Rust are defined through **type parameters**. Type parameters are typically represented by a placeholder like `<T>`, where `T` can stand for any type. When you use generics, you can use the same code for various types without hard-coding them.

---

### When Are Generics Used?

- When you want to apply the same logic to different data types.
- When you pass a generic data type into a function or structure.
- When you want type safety without hard-coding the types.

### Syntax of Generics

In Rust, generics are written as `<T>` where `T` is the type parameter, and it can be replaced by any type.

```rust
fn print_value<T>(value: T) {
    println!("{:?}", value);
}
```

Here `<T>` is a **type parameter** and it represents a type that will be determined later when the function is called.

---

### Understanding with Examples

#### Example 1: Generic Function

```rust
fn print_value<T>(value: T) {
    println!("Value is: {:?}", value);
}

fn main() {
    let num = 5;
    let text = "Hello, Rust!";
    
    print_value(num); // Here T is replaced by i32
    print_value(text); // Here T is replaced by &str
}
```

**Explanation:**

1. **`print_value<T>`** is a function that takes a generic parameter `T`. This means you can pass any type for `value`.
2. **`value: T`** indicates that the `value` parameter can be of any type, determined when the function is called.
3. You can call the `print_value` function with different types, such as an integer (`5`) or a string (`"Hello, Rust!"`).

- **Output:**
  ```
  Value is: 5
  Value is: "Hello, Rust!"
  ```

Here, `T` gets replaced by `i32` (integer) and `&str` (string slice) at runtime.

---

#### Example 2: Generic Struct

You can also use **generics** with structs in Rust.

```rust
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn new(x: T, y: T) -> Point<T> {
        Point { x, y }
    }

    fn get_x(&self) -> &T {
        &self.x
    }
    
    fn get_y(&self) -> &T {
        &self.y
    }
}

fn main() {
    let int_point = Point::new(5, 10);
    let float_point = Point::new(3.5, 7.2);

    println!("Int Point: ({}, {})", int_point.get_x(), int_point.get_y());
    println!("Float Point: ({}, {})", float_point.get_x(), float_point.get_y());
}
```

**Explanation:**

1. The struct **`Point<T>`** uses a generic type `T`. This means `x` and `y` can be of any type.
2. The **`Point::new(x: T, y: T)`** constructor creates a `Point<T>` object.
3. The methods **`get_x`** and **`get_y`** return references to the `x` and `y` values respectively, of type `T`.

- **Output:**
  ```
  Int Point: (5, 10)
  Float Point: (3.5, 7.2)
  ```

Here, `T` is replaced by `i32` (integers) and `f64` (floating-point numbers).

---

#### Example 3: Generic Enum

Rust also allows you to use **generics** with enums.

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}

fn division(dividend: f64, divisor: f64) -> Result<f64, String> {
    if divisor == 0.0 {
        Result::Err(String::from("Division by zero"))
    } else {
        Result::Ok(dividend / divisor)
    }
}

fn main() {
    let result = division(10.0, 2.0);
    
    match result {
        Result::Ok(value) => println!("Result is: {}", value),
        Result::Err(e) => println!("Error: {}", e),
    }
}
```

**Explanation:**

1. **`Result<T, E>`** is an enum that uses generics. `T` is for the success value, and `E` is for the error value.
2. The **`division`** function checks if the divisor is zero and returns an `Err` variant with a message if so. Otherwise, it returns an `Ok` variant with the result of the division.

- **Output:**
  ```
  Result is: 5
  ```

Here, `T` is `f64` (floating-point type) and `E` is `String` (error message).

---

### Advantages of Generics in Rust:

1. **Code Reusability**: You can reuse the same code with different types, making it more efficient.
2. **Type Safety**: Rust ensures that your code is type-safe, meaning type errors are caught during compile-time.
3. **Performance**: Using generics doesn’t affect performance because Rust generates specialized code for each type at compile-time (monomorphization).

---

### Conclusion:

Generics in Rust provide flexibility and reusability in your code. With generics, you can write functions, structs, and enums that work with any type, ensuring that your code is type-safe and efficient. It's a powerful feature of Rust that allows you to write more general and maintainable code.

### Traits in Rust (English Explanation)

In Rust, **Traits** are similar to **interfaces** in other programming languages like Java or C#. A trait defines behavior that types can implement. It specifies a set of methods that a type must implement, and by doing so, it grants that type specific functionality. Traits enable **code reuse** and **polymorphism** in Rust, making the code more flexible and reusable.

Think of traits as a way to define shared behavior across different types, without needing to specify the actual implementation details within the trait itself. A type can implement a trait, meaning it will provide specific implementations for the methods defined by the trait.

### Trait Syntax

A trait is defined using the `trait` keyword, followed by the method signatures (without the body) that types implementing this trait must define.

```rust
trait Speak {
    fn speak(&self); // Method signature within the trait
}

struct Person {
    name: String,
}

impl Speak for Person {
    fn speak(&self) {
        println!("Hello, my name is {}", self.name);
    }
}

fn main() {
    let person = Person { name: String::from("Amit") };
    person.speak(); // Calling the `speak` method on a Person instance
}
```

### Step-by-Step Explanation:

1. **`trait Speak`**: We define a trait `Speak` that has a method `speak`. Note that the method does not have an implementation in the trait; it only has a method signature.
   
2. **`struct Person`**: We define a `Person` struct with a field `name` of type `String`.

3. **`impl Speak for Person`**: We implement the `Speak` trait for the `Person` struct. Here, we provide the actual implementation of the `speak` method, which prints a message that includes the person's name.

4. **Calling the `speak()` method**: In the `main` function, we create an instance of `Person` and call the `speak` method. Since `Person` implements the `Speak` trait, calling `speak()` on a `Person` object invokes the method defined in the `impl Speak for Person` block.

### Use Cases for Traits:

1. **Code Reusability**: Traits allow you to define behavior that can be reused across different types. Instead of repeating the same code for every type, you define the behavior in a trait and have multiple types implement it.

2. **Polymorphism**: Traits enable polymorphism in Rust. This means that you can use the same method name to work with different types. As long as those types implement the trait, the method will behave the same way, but for different types.

3. **Abstract Behavior**: Traits provide a way to abstract behavior. You don't need to know the concrete implementation details of the type, just that it implements the trait.

---

### Benefits of Traits:
- **Flexible Code**: Traits allow you to write more flexible code that can work with different types. For example, a function can accept any type that implements a given trait.
- **Type Safety**: Traits help maintain type safety in your code, preventing errors and ensuring that only valid methods are called on types that implement the trait.

---

In conclusion, **Traits** in Rust are a powerful mechanism for defining shared behavior across multiple types. They allow for abstraction, code reuse, and polymorphism, making your code more modular and flexible. Traits are a key feature in Rust that help organize and manage common functionality across different types efficiently.