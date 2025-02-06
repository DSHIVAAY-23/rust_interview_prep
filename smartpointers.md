

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

### 🔹 What is a Reference Cycle?
A reference cycle happens when two Rc<T> values reference each other, preventing them from being dropped. Rust’s reference counting (Rc<T>) does not detect cycles, leading to memory leaks.

❌ Example: Reference Cycle (Memory Leak)
```rust

use std::rc::Rc;
use std::cell::RefCell;

#[derive(Debug)]
struct Node {
    value: i32,
    next: Option<Rc<RefCell<Node>>>,
}

fn main() {
    let a = Rc::new(RefCell::new(Node { value: 10, next: None }));
    let b = Rc::new(RefCell::new(Node { value: 20, next: None }));

    // Creating a reference cycle
    a.borrow_mut().next = Some(Rc::clone(&b));
    b.borrow_mut().next = Some(Rc::clone(&a)); // ❌ Cyclic reference!

    println!("Count of a: {}", Rc::strong_count(&a)); // 2
    println!("Count of b: {}", Rc::strong_count(&b)); // 2
```rust

    // ❌ Both values will never be dropped because they reference each other
}

```

🔴 Problem: Memory Leak
a owns b, and b owns a, forming a cycle.
Rust's Rc<T> uses reference counting, so neither object’s count ever reaches 0.
As a result, Rust will never free the memory, causing a leak.

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
