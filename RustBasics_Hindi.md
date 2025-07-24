# Ownership: 
A set of rules that governs how Rust manages memory; each value has a single owner, and the value is dropped when the owner goes out of scope.

# Borrowing: 
Accessing data without taking ownership. There are two types: immutable (&T) and mutable (&mut T) borrows.

# Reference:
A pointer to a value without owning it. References allow borrowing (&T or &mut T).


## Ownership in Rust
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

## Borrowing Rules in Rust

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

### Example2 -- refrence rule
```rust
    let mut s = String::from("hello");

    let r1 = &mut s;
    let r2 = &mut s;

    println!("{}, {}", r1, r2);
```


### Example 3: Dangling References  -- A dangling reference (or dangling pointer) is a reference to a memory location that has already been freed. In Rust, this is prevented through ownership and borrowing rules.
```rust
fn main() {
    let r;   // correct code i.e let r =  {data}
    {
        let data = String::from("Hello");
        r = &data; // Error: `data` goes out of scope
    }
    // println!("{}", r); // Dangling reference not allowed
}
```
---

### What are Generics in Rust?

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
---
---

#### Example 3: Generic Enum


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
### Traits in Rust (English Explanation)

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
# Lifetimes in Rust

## Overview
Lifetimes in Rust are used to manage the validity of references, ensuring memory safety without relying on garbage collection. They prevent **dangling references** and work closely with Rust's ownership system.

## Example: Lifetimes in Functions
```rust
// 🚀 Function to return the longest of two string slices
// `'a` is a generic lifetime that ensures both `s1` and `s2` have the same lifetime.
fn longest<'a>(s1: &'a str, s2: &'a str) -> &'a str {
    if s1.len() > s2.len() {
        s1  // Returns `s1`, which must live at least as long as `'a`
    } else {
        s2  // Returns `s2`, ensuring its lifetime matches `'a`
    }
}

fn main() {
    let string1 = String::from("Hello");
    let string2 = String::from("World");
    
    // `string1` and `string2` are owned values, but we pass references to `longest`
    let result = longest(&string1, &string2);
    
    // ✅ Safe because `string1` and `string2` are still in scope
    println!("Longest string: {}", result);
}

```
Explanation:
Lifetime Parameter < 'a >:
Specifies that the references passed to longest will live as long as 'a.
Ensures Validity:
Guarantees that the returned reference points to a memory location valid for 'a.


### Closures and iterators
```rust

fn main() {
    // ✅ Creating a vector of numbers
    let numbers = vec![1, 2, 3, 4, 5];

    // ✅ Using an iterator with `.map()` and a closure
    // The closure takes each number `x`, multiplies it by 2, and collects the results into a new vector.
    let doubled_numbers: Vec<i32> = numbers.iter().map(|x| x * 2).collect();

    println!("Original numbers: {:?}", numbers);
    println!("Doubled numbers: {:?}", doubled_numbers);

    // ✅ Using an iterator with `.filter()` and a closure
    // This filters out only the even numbers
    let even_numbers: Vec<i32> = numbers.iter().filter(|&&x| x % 2 == 0).collect();

    println!("Even numbers: {:?}", even_numbers);

    // ✅ Defining a closure separately
    let add_ten = |x: i32| x + 10; // Closure that adds 10 to a number

    // Applying the closure to each element in an iterator
    let incremented_numbers: Vec<i32> = numbers.iter().map(|&x| add_ten(x)).collect();

    println!("Numbers + 10: {:?}", incremented_numbers);
}
```
### Closures (|x| x * 2)

A closure is an anonymous function that can capture variables from its surrounding scope.
Example: |x| x * 2 is a closure that takes x, multiplies it by 2, and returns the result.

### Iterators (.iter(), .map(), .filter())

.iter() creates an immutable iterator over numbers.
.map(|x| x * 2) applies the closure to each element and transforms it.
.filter(|&&x| x % 2 == 0) keeps only even numbers.
.collect() converts the iterator back into a Vec<i32>.
Closures Stored in Variables

let add_ten = |x: i32| x + 10; defines a closure that adds 10 to a number.
We apply it using .map(|&x| add_ten(x)).


### What Are Macros in Rust?
In Rust, macros are a way to write code that generates code. They allow for metaprogramming, enabling developers to:

## Types of Macros in Rust
Rust provides four main types of macros:

1.Declarative Macros (macro_rules!) -- Declarative macros use the macro_rules! syntax and work similarly to match expressions. They are useful for defining reusable patterns.
```rust

macro_rules! my_vec {
    ( $( $x:expr ),* ) => {
        {
            let mut temp_vec = Vec::new();
            $(
                temp_vec.push($x);
            )*
            temp_vec
        }
    };
}

fn main() {
    let numbers = my_vec![1, 2, 3, 4, 5];
    println!("{:?}", numbers); // Output: [1, 2, 3, 4, 5]
}
```

### How It Works?
$( $x:expr ),* → Captures any number of expressions (1, 2, 3, ...).
temp_vec.push($x); → Expands each captured value inside a loop.
Result → A new Vec<T> is created at compile-time.

### Custom my_println! Macro
```rust

macro_rules! my_println {
    ( $( $arg:tt )* ) => {
        {
            print!("{}",""); // Ensures output is properly flushed
            println!($($arg)*);
        }
    };
}

fn main() {
    my_println!("Hello, Rust!");
    my_println!("Number: {}", 42);
    my_println!("Coordinates: ({}, {})", 10, 20);
}
```

2.Procedural Macros -- Procedural macros are more powerful than declarative macros. They take Rust code as input, process it, and generate new code.
Function-like Macros (#[proc_macro])
```rust

use proc_macro;

#[proc_macro]
pub fn uppercase(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input_str = input.to_string().to_uppercase(); 
    format!("{}", input_str).parse().unwrap()
}
```
🔥 How It Works?
Takes Rust tokens as input (proc_macro::TokenStream).
Transforms them (e.g., converts to uppercase).
Returns modified Rust code.

Attribute Macros (#[proc_macro_attribute])
```rust

use proc_macro::TokenStream;

#[proc_macro_attribute]

pub fn log_execution(_attr: TokenStream, item: TokenStream) -> TokenStream {
    let input = item.to_string();
    let output = format!(
        "{{ println!(\"Executing function: {}\", \"{}\"); {} }}",
        input, input
    );
    output.parse().unwrap()
}

```

Derive Macros (#[proc_macro_derive])

✅ Example: Implementing a Hello Trait Automatically
```rust

use proc_macro::TokenStream;

#[proc_macro_derive(Hello)]
pub fn hello_macro_derive(_input: TokenStream) -> TokenStream {
    let output = "impl Hello for MyStruct { fn hello() { println!(\"Hello, world!\"); } }";
    output.parse().unwrap()
}
```

🔥 Usage:
```rust

#[derive(Hello)]
struct MyStruct;

fn main() {
    MyStruct::hello(); // Output: Hello, world!
}
```
