
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
fn longest<'a>(s1: &'a str, s2: &'a str) -> &'a str {
    if s1.len() > s2.len() {
        s1
    } else {
        s2
    }
}

fn main() {
    let string1 = String::from("Hello");
    let string2 = String::from("World");
    
    let result = longest(&string1, &string2);
    println!("Longest string: {}", result);
}
```
Explanation:
Lifetime Parameter < 'a >:
Specifies that the references passed to longest will live as long as 'a.
Ensures Validity:
Guarantees that the returned reference points to a memory location valid for 'a.



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

How It Works?
$( $x:expr ),* → Captures any number of expressions (1, 2, 3, ...).
temp_vec.push($x); → Expands each captured value inside a loop.
Result → A new Vec<T> is created at compile-time.

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
