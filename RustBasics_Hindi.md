
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

Explanation:
Lifetime Parameter < 'a >:
Specifies that the references passed to longest will live as long as 'a.
Ensures Validity:
Guarantees that the returned reference points to a memory location valid for 'a.

---
```
---
### **1. Box<T>**
`Box<T>` ek heap-allocated smart pointer hai, jo ek value ko heap par store karta hai aur ek reference ke through us value ko manage karta hai.

#### **Example**:

```rust
fn main() {
    let b = Box::new(5);  // Box mein value store kiya

    println!("Value: {}", b);  // Output: Value: 5
}
```

Yahan pe, `5` ko heap par store kiya gaya hai. `Box` ke through hum us value ko access kar pa rahe hain.

### **Deref and Drop**:
```rust
use std::ops::Deref;

// Define a custom smart pointer MyBox
struct MyBox<T>(T);

// Implement Deref trait for MyBox
impl<T> Deref for MyBox<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.0 // Allows dereferencing to access the inner value
    }
}

// Implement Drop trait for MyBox
impl<T> Drop for MyBox<T> {
    fn drop(&mut self) {
        println!("Dropping MyBox with value!");
    }
}

fn main() {
    // Using MyBox to hold a value
    let x = MyBox(42);

    // Accessing the inner value using dereference operator (*)
    println!("The value inside MyBox is: {}", *x);

    // MyBox will automatically drop here
    println!("MyBox is about to go out of scope...");
}
```
### reff cell implemention
```rust
use std::cell::RefCell;

fn main(){
 let a: RefCell<i32> = RefCell::new(14);
 *a.borrow_mut() += 1;

 println!("{}", *a.borrow());
}
```

### Rc , Arc  implementation
#### **Example**:

```rust
use std::rc::Rc;
use std::thread;
use std::sync::Arc;
use std::cell::RefCell;


struct Person {
    name: String,
    age: u32,
}

fn main() {

    // for Rc  

    /* let person1 = Rc::new(Person {
        name: "Alice".to_string(),
        age: 25,
    });*/
let  cave = Arc::new(Person {
        name: "Alice".to_string(),
        age: 25,
    });
let r1 = cave.clone();
 let r2 = cave.clone();
  
 println!("the rc count is : {}",Arc::strong_count(&cave));

    let thread1 = thread::spawn(move || {
        println!("Thread 1: Name={}, Age={}", r1.name, r1.age);
        // Simulate some work being done in thread 1
        thread::sleep_ms(1000);
    });

    let thread2 = thread::spawn(move || {
        println!("Thread 2: Name={}, Age={}", r2.name,r2.age);
        // Simulate some work being done in thread 2
        thread::sleep_ms(1000);
    });

    thread1.join().unwrap();
    thread2.join().unwrap();

    println!("Reference Count: {}", Arc::strong_count(&cave));
    
    let head = RefCell::new(32);
    *head.borrow_mut() += 1;
     println!("{}", *head.borrow());

    
    
}
```

---

### Threading in Rust
 ### mutex arc example
---
```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0)); // Shared counter with Mutex
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap(); // Lock the Mutex
            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap(); // Wait for all threads to finish
    }

    println!("Result: {}", *counter.lock().unwrap());
}
```

###  4. Deadlocks in Mutex<T>
A deadlock occurs when two threads wait for each other’s lock forever.

❌ Example: Deadlock Scenario
```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let lock1 = Arc::new(Mutex::new(1));
    let lock2 = Arc::new(Mutex::new(2));

    let l1 = Arc::clone(&lock1);
    let l2 = Arc::clone(&lock2);

    let handle1 = thread::spawn(move || {
        let _lock1 = l1.lock().unwrap();
        println!("Thread 1: Acquired Lock 1");

        std::thread::sleep(std::time::Duration::from_secs(1)); 

        let _lock2 = l2.lock().unwrap(); // Waiting for Lock 2
        println!("Thread 1: Acquired Lock 2");
    });

    let l1 = Arc::clone(&lock1);
    let l2 = Arc::clone(&lock2);

    let handle2 = thread::spawn(move || {
        let _lock2 = l2.lock().unwrap();
        println!("Thread 2: Acquired Lock 2");

        std::thread::sleep(std::time::Duration::from_secs(1));

        let _lock1 = l1.lock().unwrap(); // Waiting for Lock 1
        println!("Thread 2: Acquired Lock 1");
    });

    handle1.join().unwrap();
    handle2.join().unwrap();
}
```
### 🔥 What Happens?
Thread 1 locks lock1, then waits for lock2.
Thread 2 locks lock2, then waits for lock1.
❌ Deadlock! Both threads wait forever, blocking each other.
🔹 5. Preventing Deadlocks
✅ Solution 1: Always Lock in the Same Order
Modify the code so that all threads lock in the same order:

```rust
let _lock1 = lock1.lock().unwrap();
let _lock2 = lock2.lock().unwrap();
✅ Solution 2: Use try_lock() to Avoid Blocking
Instead of lock(), use try_lock():
```
```rust
if let Ok(mut data) = lock1.try_lock() {
    *data += 1;
}
```
If try_lock() fails, it won’t block and can retry later.

---



