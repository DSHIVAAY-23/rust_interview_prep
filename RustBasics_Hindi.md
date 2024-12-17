
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
---

In conclusion, **Traits** in Rust are a powerful mechanism for defining shared behavior across multiple types. They allow for abstraction, code reuse, and polymorphism, making your code more modular and flexible. Traits are a key feature in Rust that help organize and manage common functionality across different types efficiently.
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


---

### Threading in Rust


```rust
use std::thread;

fn main() {
    let handle = thread::spawn(|| { // Ek alag thread create kiya
        for i in 1..5 {
            println!("From spawned thread: {}", i);
        }
    });

    for i in 1..5 {
        println!("From main thread: {}", i); // Main thread ka kaam
    }

    handle.join().unwrap(); // Wait for the spawned thread to finish
}
```

---
---

### Shared Data in Threads:
Rust threads me data ko share karna thoda tricky ho sakta hai, kyunki Rust ownership rules ko todna allowed nahi hai.

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

#### **Key Points:**

1. **Mutex:**  
   - Data ko ek time pe sirf ek thread access kar sake, iske liye `Mutex` ka use hota hai.  
   - `lock()` function ko call karke data access karte ho, aur kaam hone ke baad Mutex unlock ho jata hai.

2. **Arc:**  
   - `Arc` ka matlab hai **Atomic Reference Counter**. Ye shared data ka ownership multiple threads me safely manage karta hai.  

---

### Output Explanation:
Upar ke code me:
- 10 threads ek shared counter ko increment karte hain.
- Mutex aur Arc ensure karte hain ki koi **data race** na ho.  
Output:
```
Result: 10
```

---

### Summary:
Threading Rust me:
- Parallel processing ke liye use hoti hai.
- Safe aur efficient hai, kyunki Rust ownership aur borrowing rules data races ko prevent karte hain.
- Advanced use cases me `Mutex`, `Arc`, aur **async/await** ka use hota hai.



---

### **Arc aur Mutex aur Arc<Mutex<T>>** - Rust me inka kaam aur istemal

Rust me **concurrency** aur **thread safety** handle karne ke liye `Arc`, `Mutex`, aur inka combination `Arc<Mutex<T>>` ka use hota hai. Ab inhe step-by-step samajhte hain.

---

### 1. **Mutex kya hai?**

`Mutex` ka full form hota hai **Mutual Exclusion**, jo ensure karta hai ki ek baar me sirf ek thread shared data ko access kare. Ye **data races** ko prevent karta hai. 

#### **Key Points:**
- Ek hi thread ko data access karne deta hai.
- Data ko modify karte waqt `lock` ki zarurat hoti hai.
- Jab kaam ho jata hai, to Mutex apne aap unlock ho jata hai.

#### **Example:**

```rust
use std::sync::Mutex;

fn main() {
    let m = Mutex::new(5); // Mutex ke andar ek value wrap kar di

    {
        let mut num = m.lock().unwrap(); // Mutex ko lock kiya
        *num += 1; // Value ko modify kiya
    } // Lock yaha release ho gaya

    println!("Result: {:?}", m); // Output: Mutex { data: 6 }
}
```

#### **Samajh**:
1. Jab `lock()` call karte hain, thread data ka access le leta hai.
2. Jaise hi scope khatam hota hai, lock release ho jata hai.
3. Agar ek thread lock kar chuka hai aur dusra thread usi data ko access karne ki koshish karega, to dusra thread wait karega.

---

### 2. **Arc kya hai?**

`Arc` ka full form hai **Atomic Reference Counting**. Ye allow karta hai ki ek resource ka **multiple threads ke beech me safe sharing** ho sake.

#### **Key Points:**
- Ye ek **thread-safe shared ownership** provide karta hai.
- Ek **atomic counter** ke through track karta hai ki kitne references hain.
- Immutable data ke liye useful hai. Mutable data ke liye ise `Mutex` ke saath combine karna padta hai.

#### **Example:**

```rust
use std::sync::Arc;
use std::thread;

fn main() {
    let data = Arc::new(5); // Arc me ek value wrap kar di

    let data_clone = Arc::clone(&data); // Arc ka clone banaya

    let handle = thread::spawn(move || {
        println!("Data from thread: {}", data_clone); // Shared ownership ka use
    });

    handle.join().unwrap(); // Thread ke khatam hone ka wait kiya

    println!("Data from main: {}", data);
}
```

#### **Samajh**:
1. `Arc` threads ke beech ek data ko safely share karne me madad karta hai.
2. Jab ek Arc ka clone banate ho, uska reference count increment ho jata hai.
3. Jab last reference drop hota hai, to data automatically clean ho jata hai.

---

### 3. **Arc<Mutex<T>> kya hai?**

Agar ek shared resource ko **mutable** karna hai aur **threads ke beech safely share** bhi karna hai, to `Arc<Mutex<T>>` ka use karte hain.

#### **Why Arc + Mutex?**
- `Arc` shared ownership provide karta hai.
- `Mutex` ensure karta hai ki ek baar me sirf ek thread data ko modify kare.

---

#### **Example:**

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0)); // Counter ko wrap kiya Arc aur Mutex ke andar
    let mut handles = vec![];

    for _ in 0..10 {
        let counter_clone = Arc::clone(&counter); // Arc ka clone banaya
        let handle = thread::spawn(move || {
            let mut num = counter_clone.lock().unwrap(); // Mutex lock kiya
            *num += 1; // Counter increment kiya
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap(); // Har thread ka wait kiya
    }

    println!("Final Counter: {}", *counter.lock().unwrap());
}
```

#### **Output:**
```
Final Counter: 10
```

#### **Samajh**:
1. `Arc` allow karta hai ki multiple threads counter ka reference safely le saken.
2. `Mutex` ensure karta hai ki ek baar me sirf ek thread counter ko modify kare.
3. Thread-safe way me mutable data ko share karne ka best option hai.

---

### **Kya Use Kare Kab?**

| Use Case                              | Tool         |
|---------------------------------------|--------------|
| Immutable data ka sharing             | `Arc`        |
| Ek thread ke liye exclusive mutation  | `Mutex`      |
| Threads ke beech shared mutable data  | `Arc<Mutex>` |

---

### **Important Points:**
1. **Mutex**: Sirf ek thread ko data modify karne deta hai.
2. **Arc**: Multiple threads ko ek data ka reference safely share karne deta hai.
3. **Arc<Mutex<T>>**: Jab shared ownership aur mutation dono chahiye.

### **Smart Pointers:**
Rust mein **smart pointers** ek aise mechanism hote hain jo memory management ko efficiently handle karte hain, bina manual memory management (jaise C++ mein hota hai) ke. Rust mein 3 main types ke smart pointers hote hain: **Box**, **Rc**, aur **Arc**. Inka use karke hum easily memory leak aur dangling pointers se bach sakte hain.

---

### **1. Box<T>**
`Box<T>` ek heap-allocated smart pointer hai, jo ek value ko heap par store karta hai aur ek reference ke through us value ko manage karta hai.

#### **Key Features**:
- `Box` ka use jab hota hai jab hume dynamically sized data ko store karna ho, jo stack par nahi store kiya ja sakta.
- Ye ownership ko transfer karta hai, matlab agar ek function ke andar `Box` pass karte ho to ownership transfer ho jaati hai.

#### **Use Case**:
- Jab aapko **heap** pe memory allocate karni ho.

#### **Example**:

```rust
fn main() {
    let b = Box::new(5);  // Box mein value store kiya

    println!("Value: {}", b);  // Output: Value: 5
}
```

Yahan pe, `5` ko heap par store kiya gaya hai. `Box` ke through hum us value ko access kar pa rahe hain.

### **Deref and Drop**:

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


### **2. Rc<T>**
`Rc<T>` ka full form hai **Reference Counting**. Ye ek **non-thread-safe smart pointer** hai jo multiple owners ke beech ownership share karta hai. `Rc` ka use tab hota hai jab hume ek data ka **multiple references** chahiye ho.

#### **Key Features**:
- `Rc` reference counting ko manage karta hai, matlab har reference ka counter hota hai.
- Jab reference count 0 ho jaata hai, to object automatically deallocated ho jata hai.
- Ye **single-threaded** environment ke liye suitable hai, kyunki `Rc` thread-safe nahi hai.

#### **Use Case**:
- Jab ek data ko multiple owners ke beech share karna ho (but threads ki zarurat na ho).

#### **Example**:

```rust
use std::rc::Rc;

fn main() {
    let a = Rc::new(5);  // Rc mein value store kiya

    let b = Rc::clone(&a);  // Rc ka clone banaya

    println!("a: {}, b: {}", a, b);  // Output: a: 5, b: 5
}
```

Yahan pe, dono `a` aur `b` `Rc` pointer ko share kar rahe hain. Jab dono references ka count 0 ho jaayega, to memory release ho jaayegi.

#### **Important Points**:
- `Rc` memory ko share karta hai, lekin thread-safe nahi hota.
- Aapko **mutable** reference ke liye `RefCell` ke saath use karna padta hai.

---

### **3. Arc<T>**
`Arc<T>` ka full form hai **Atomic Reference Counting**. Ye `Rc<T>` ka thread-safe version hai. `Arc` ka use tab hota hai jab hume ek data ko **multiple threads** ke beech share karna ho.

#### **Key Features**:
- `Arc` bhi reference counting karta hai, lekin ye **atomic operations** use karta hai, jo threads ke beech synchronization ko manage karta hai.
- Ye **multi-threaded environments** ke liye suitable hai.

#### **Use Case**:
- Jab ek data ko multiple threads ke beech safely share karna ho.

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

Yahan pe, dono main thread aur spawned thread `Arc` pointer ko share kar rahe hain safely.

#### **Important Points**:
- `Arc` thread-safe hota hai.
- Iska use multi-threading scenarios mein kiya jata hai jab multiple threads ek hi data access karte hain.

---

### **Summary**:
| Smart Pointer | Thread-Safe | Multiple Ownership | Use Case | Memory Management |
|---------------|-------------|---------------------|----------|-------------------|
| **Box<T>**    | No          | No                  | Dynamic memory allocation | Automatically deallocated when out of scope |
| **Rc<T>**     | No          | Yes (single-threaded) | Single-threaded shared ownership | Automatically deallocated when ref count is 0 |
| **Arc<T>**    | Yes         | Yes (multi-threaded) | Multi-threaded shared ownership | Automatically deallocated when ref count is 0 |

---

**Important**: Agar aapko **mutable** data chahiye to `Rc` ya `Arc` ke saath `RefCell` ka use karna padta hai, kyunki `Rc` aur `Arc` khud se mutable references allow nahi karte.



---

### **Closures in Rust**
Rust mein **closures** ek aise function-like constructs hote hain jo specific environment ke context ko capture karte hain aur phir use karte hain.
Closure ek anonymous function (jo naam nahi rakhta) hota hai jo ek specific environment ke variables ko capture karke use karta hai. Matlab, closures apne surrounding scope se data ko "borrow" ya "take" karte hain aur usse operate karte hain.

#### **Basic Syntax:**

```rust
let closure_name = |parameter1, parameter2| {
    // function body
};
```

Yeh closure ko define karne ka basic tareeka hai. Closure ko define karte waqt hum ek ya zyada arguments de sakte hain aur unko process karne ke liye body likh sakte hain.

---

### **Closure ka Functionality**
Closure apne surrounding scope ke variables ko use karte hain, isliye inhe **captures** kaha jaata hai. Closure 3 tarike se variables ko capture kar sakte hain:
1. **By reference (`&T`)**
2. **By mutable reference (`&mut T`)**
3. **By value (`T`)**

Rust automatically decide karta hai ki closure ko variable ko kis tarah capture karna hai. Hum closure ke define karne ke time par specify bhi kar sakte hain.

---

### **1. By Reference (`&T`)**
Jab closure variable ko **borrow** karta hai (reference), tab wo variable ko modify nahi kar sakta.

#### Example:

```rust
fn main() {
    let x = 5;

    let closure = |y| {
        println!("x is: {}", x);  // x ko reference ke through access kiya
    };

    closure(10);  // Output: x is: 5
}
```

Yahan pe `x` ko closure mein **borrow** kiya gaya hai, matlab `x` ki value change nahi hogi.

---

### **2. By Mutable Reference (`&mut T`)**
Agar closure ko mutable reference milta hai, to wo closure variable ki value ko modify kar sakta hai.

#### Example:

```rust
fn main() {
    let mut x = 5;

    let mut closure = |y| {
        x += y;
        println!("x is: {}", x);  // x ko modify kiya
    };

    closure(10);  // Output: x is: 15
}
```

Yahan pe closure ne `x` ko mutable reference ke through capture kiya hai aur uski value ko update kiya.

---

### **3. By Value (`T`)**
Closure jab **by value** variable ko capture karta hai, to us variable ki ownership closure ko transfer ho jaati hai. Iska matlab hai ki closure ke andar us variable ka access aur modify karne ki permission mil jaati hai, lekin outside scope se wo variable ab access nahi kiya ja sakta.

#### Example:

```rust
fn main() {
    let x = String::from("Hello");

    let closure = move || {
        println!("x is: {}", x);  // x ki ownership closure ko di gayi hai
    };

    closure();  // Output: x is: Hello

    // println!("{}", x);  // Error: x ka ownership move ho gaya hai
}
```

Yahan pe `move` keyword ke saath closure ko variable ki ownership di gayi hai. Iska matlab hai ki closure `x` ko own karega aur baad mein `x` ko main function mein access nahi kar sakte.

---

### **Why use closures?**

- **Concise code**: Agar aapko chhoti functions ko repeatedly use karna ho, to closures ka use aapko boilerplate code se bachata hai.
- **Custom behavior**: Closure aapko specific behavior ko easily encapsulate karne ka option dete hain without creating a whole new function.
- **Functional style programming**: Rust mein closures ko functional programming paradigms ke saath use karna bahut asaan hota hai.

---

### **Type Inference in Closures:**
Rust closures ka type inference bhi bahut achha hai, matlab aapko closure ke parameters ke types explicitly define karne ki zarurat nahi padti. Rust automatically samajh leta hai ki kaunse type ki value pass ho rahi hai.

#### Example:

```rust
fn main() {
    let closure = |x| x + 1;  // Rust automatically samajh lega ki x ka type integer hai

    println!("{}", closure(5));  // Output: 6
}
```

---

### **Difference between Functions and Closures**

| Feature          | Functions              | Closures           |
|------------------|------------------------|--------------------|
| **Syntax**       | Named function         | Anonymous function |
| **Capture**      | Cannot capture variables from the environment | Can capture variables from the environment |
| **Arguments**    | Fixed argument types    | Types inferred or explicit |
| **Performance**  | Slightly faster in some cases | Can be slower due to capture semantics |

---

### **Summary**:
- Closure ek function-like construct hai jo surrounding scope ke variables ko capture karke use karta hai.
- `move`, `&T`, aur `&mut T` ke through closures apne environment ke variables ko capture kar sakte hain.
- Closures ko use karke hum apne code ko concise aur flexible bana sakte hain.


### **Error Handling in Rust**:
Rust mein error handling kaafi important hai aur Rust isme **`Result`** aur **`Option`** types ka use karta hai. Ye types allow karte hain ki aap errors ko handle kar sakein bina program crash hone ke.

Chalo, **error handling** ko achhe se samajhte hain:

---

### **1. `Result` Type**

Rust mein errors ko handle karne ke liye **`Result<T, E>`** type ka use hota hai. Yeh enum hota hai jo do variants mein split hota hai:

- **`Ok(T)`**: Jab operation successfully complete hota hai.
- **`Err(E)`**: Jab operation fail ho jaata hai aur koi error aati hai.

#### **Syntax:**
```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

**T** ka matlab hai successful value ka type, aur **E** ka matlab hai error ka type.

#### **Example:**

```rust
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        return Err(String::from("Cannot divide by zero"));
    }
    Ok(a / b)
}

fn main() {
    let result = divide(10, 2);
    
    match result {
        Ok(value) => println!("Result: {}", value),
        Err(e) => println!("Error: {}", e),
    }
}
```

**Explanation:**
- `divide` function mein agar `b` zero hai to error return hoti hai (`Err`), otherwise result ko `Ok` mein return karte hain.
- `match` statement ka use karke hum check karte hain ki result `Ok` hai ya `Err`.

#### **Chhoti error handling (unwrap() aur expect() ka use):**
Agar aapko sure ho ke operation successful hoga (i.e. error nahi aayegi), to aap `unwrap()` ya `expect()` ka use kar sakte hain. Lekin, **yeh methods run-time error throw karte hain agar result `Err` ho.**

```rust
fn main() {
    let result = divide(10, 0).unwrap();  // This will panic (crash) because division by 0 is an error
    println!("Result: {}", result);
}
```

---

### **2. `Option` Type**

**`Option`** type ka use hota hai jab koi value ho sakti hai ya nahi, is case mein error nahi hota, lekin kisi value ka hona ya na hona handle karte hain.

- **`Some(T)`**: Jab value present ho.
- **`None`**: Jab value absent ho.

#### **Syntax:**
```rust
enum Option<T> {
    Some(T),
    None,
}
```

#### **Example:**

```rust
fn find_index(vec: &Vec<i32>, target: i32) -> Option<usize> {
    for (index, &value) in vec.iter().enumerate() {
        if value == target {
            return Some(index);
        }
    }
    None
}

fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    
    match find_index(&numbers, 3) {
        Some(index) => println!("Found at index: {}", index),
        None => println!("Not found"),
    }
}
```

**Explanation:**
- `find_index` function mein agar target value mil jaati hai to `Some(index)` return hota hai, otherwise `None` return hota hai.
- `match` statement ka use karke hum `Some` ya `None` ko check karte hain aur appropriate action lete hain.

---

### **Error Handling in Functions:**

Agar function me kisi point pe error aati hai, to usse handle karne ke liye **`?` operator** ka use karte hain. **`?` operator** agar `Result` ya `Option` type return ho toh automatically error ko propagate kar deta hai (agar koi `Err` ya `None` aati hai).

#### **Example (using `?` operator):**

```rust
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        return Err(String::from("Cannot divide by zero"));
    }
    Ok(a / b)
}

fn main() -> Result<(), String> {
    let result = divide(10, 2)?;
    println!("Result: {}", result);
    
    let result2 = divide(10, 0)?;
    println!("Result: {}", result2);

    Ok(())
}
```

**Explanation:**
- Jab `divide(10, 2)` call hota hai to result properly return hota hai, lekin `divide(10, 0)` call pe `Err` return hota hai aur program turant error ke saath exit kar jaata hai.
- `?` operator ko use karke, agar error hota hai to hum usse propagate kar dete hain aur function fail ho jaata hai bina explicitly match ya unwrap kiye.

---

### **Custom Errors in Rust:**

Agar aap apni custom error types define karna chahte hain, to aap **`enum`** ya **`struct`** bana sakte hain aur unhe `Result` ya `Option` mein return kar sakte hain.

#### **Example of Custom Error Type:**

```rust
use std::fmt;

#[derive(Debug)]
enum MathError {
    DivisionByZero,
    NegativeNumber,
}

impl fmt::Display for MathError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            MathError::DivisionByZero => write!(f, "Cannot divide by zero"),
            MathError::NegativeNumber => write!(f, "Negative number encountered"),
        }
    }
}

fn divide(a: i32, b: i32) -> Result<i32, MathError> {
    if b == 0 {
        return Err(MathError::DivisionByZero);
    }
    if a < 0 || b < 0 {
        return Err(MathError::NegativeNumber);
    }
    Ok(a / b)
}

fn main() {
    match divide(10, 0) {
        Ok(result) => println!("Result: {}", result),
        Err(e) => println!("Error: {}", e),
    }
}
```

**Explanation:**
- Yahan pe `MathError` naam ka custom error type banaaya gaya hai.
- Agar division by zero ya negative number hota hai, to hum apne custom error ko `Err` ke saath return kar rahe hain.

---

### **Summary:**
- **`Result`** type success aur error ko handle karta hai.
- **`Option`** type presence ya absence of value ko handle karta hai.
- **`?` operator** ko use karke error ko propagate kiya jaa sakta hai.
- Custom errors define karne ke liye apne `enum` ya `struct` bana kar unhe `Result` mein use kiya jaata hai.

---

### **Tokio:**
**Tokio** ek asynchronous runtime hai Rust programming language ke liye jo concurrency aur parallelism handle karne ke liye use hota hai. Yeh Rust ke async/await syntax ko implement karta hai aur aapko asynchronous programming mein madad karta hai, jisme aap parallel tasks ko efficiently execute kar sakte ho bina threads ke over-head ke.

Chalo, ab thoda aur detail mein samajhte hain ki **Tokio** kya hai aur yeh kaise kaam karta hai.

---

### **Tokio Kya Hai?**
- **Tokio** ek asynchronous runtime hai jo Rust ke asynchronous ecosystem ka core part hai. 
- Yeh ek "async IO" ko efficiently handle karne ke liye design kiya gaya hai. 
- Asynchronous IO ka matlab hai ki aap ek time pe multiple tasks ko handle kar sakte ho bina ek task ko complete hone ka wait kiye, jo ki traditional blocking IO mein hota hai.

---

### **Key Features of Tokio:**

1. **Concurrency and Parallelism:**
   - Tokio ka sabse bada fayda yeh hai ki yeh multiple tasks ko asynchronously handle karta hai. Aapko threads ke overhead ki fikar nahi karni padti.
   
2. **Async IO:**
   - Tokio asynchronous IO operations ko handle karne ke liye highly optimized hai. Jaise ki network calls, file operations, etc. Jab ek task complete hota hai, tab hi next task ko execute karne ke liye CPU resources allocate kiye jaate hain.

3. **Futures and Streams:**
   - Tokio ka use karte waqt aapko **`Future`** aur **`Stream`** types ka use karna padta hai, jo asynchronous operations ko represent karte hain.
   - **`Future`** ek value ko represent karta hai jo future mein available hoga.
   - **`Stream`** ek sequence of values ko represent karta hai jo time ke saath aayenge.

4. **Task Scheduling:**
   - Tokio ka task scheduler automatically handle karta hai ki kaunsa task kab execute ho, isse CPU ka efficient use hota hai.

5. **Multithreading Support:**
   - Tokio multi-threaded runtime ko bhi support karta hai. Iska matlaab hai ki multiple threads ke upar parallel tasks ko distribute kar sakte ho, jisme ki sab tasks efficiently run hote hain bina kisi blocking ke.

---

### **Basic Example of Tokio:**

```rust
use tokio;

async fn say_hello() {
    println!("Hello from Tokio!");
}

#[tokio::main]
async fn main() {
    say_hello().await;
}
```

**Explanation:**
- **`async fn`**: Yeh function asynchronous hai, matlab isko await kiya jaa sakta hai.
- **`#[tokio::main]`**: Yeh macro hai jo Tokio runtime ko initialize karta hai aur aapke main function ko asynchronous banaata hai.

---

### **How Does Tokio Work?**

1. **Event Loop**: 
   - Tokio ek **event loop** ka use karta hai. Iska matlab hai ki ek thread continuously monitor karta hai ki kaunse tasks ready hain aur unko process karta hai.

2. **Task Scheduling**:
   - Jab aap koi asynchronous operation karte ho, like network request ya file read operation, to Tokio runtime us task ko schedule karta hai aur jab operation complete ho jaata hai tab result ko handle karta hai.

3. **Futures and Executor**:
   - **`Future`** ek object hai jo ek asynchronous operation ko represent karta hai. Yeh future value kisi point pe complete hoti hai. Tokio ke paas ek **executor** hota hai jo in futures ko execute karta hai jab unka result ready ho.
   
4. **Non-blocking**:
   - Tokio non-blocking IO ke liye designed hai. Matlab jab ek operation like database call ya network request chal raha hota hai, toh aapka program kisi aur task ko execute kar sakta hai bina kisi interruption ke.

---

### **Common Tokio Components:**

1. **`tokio::spawn`**:
   - Yeh function asynchronous tasks ko spawn karne ke liye use hota hai.
   
   ```rust
   use tokio;

   #[tokio::main]
   async fn main() {
       tokio::spawn(async {
           println!("This runs asynchronously!");
       }).await.unwrap();
   }
   ```

2. **`tokio::io`**:
   - Yeh module asynchronous IO operations ke liye use hota hai, jaise ki reading from or writing to files, network, etc.

3. **`tokio::time`**:
   - Is module ka use aapko time-based operations ke liye hota hai, jaise ki sleeping for a certain duration, delaying execution, etc.

4. **`tokio::sync`**:
   - Is module ka use aapko concurrency control ke liye hota hai, jaise ki **Mutex**, **RwLock**, aur **mpsc channels** for communication between tasks.

---

### **Example of Concurrency with Tokio:**

```rust
use tokio;

async fn task1() {
    println!("Task 1 started");
    tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
    println!("Task 1 finished");
}

async fn task2() {
    println!("Task 2 started");
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    println!("Task 2 finished");
}

#[tokio::main]
async fn main() {
    tokio::join!(task1(), task2());
}
```

**Explanation:**
- **`tokio::join!`** ka use karke hum multiple asynchronous tasks ko concurrently run kar rahe hain. Jab dono tasks complete hote hain tab hi program exit hota hai.
- `task1` 2 seconds tak soye gi, jabki `task2` sirf 1 second tak soye gi, aur dono tasks parallel mein execute hoti hain.

---

### **Why Use Tokio?**
- **Performance**: Tokio highly optimized hai aur high-performance applications banane mein madad karta hai.
- **Scalability**: Yeh large-scale, concurrent applications banane ke liye perfect hai, jaise ki web servers, databases, etc.
- **Ecosystem**: Rust ka ecosystem asynchronous programming ke liye kaafi strong hai aur Tokio uska part hai.

---

### **Conclusion:**

- **Tokio** ek asynchronous runtime hai jo aapko efficiently multiple tasks ko handle karne ki suvidha deta hai.
- Yeh concurrency aur parallelism ke concepts ko asaan banaata hai aur aapke applications ko zyada scalable banata hai.
- **Async/await** syntax ke saath integrate hota hai aur Rust ke ecosystem mein widely used hai, especially network programming, web servers, etc. ke liye.

---


### **what is Async/Await:**

**Async/Await** Rust mein asynchronous programming ko handle karne ke liye use kiya jaata hai. Iska main purpose hai ki hum efficiently multiple tasks ko execute kar sakein bina program ko block kiye. Matlab, hum ek task ke complete hone ka wait nahi karte, aur dusre task ko execute karte hain.

### **1. Asynchronous Programming kya hai?**
Asynchronous programming ka matlab hai ki jab aap koi long-running task perform kar rahe ho, jaise file reading, network requests, ya database operations, toh program ke baaki parts execute hote rehte hain, bina kisi interruption ke. Matlab, ek task ko execute karte waqt baaki tasks ko block nahi kiya jaata.

Rust mein **async/await** ka use karte waqt, hum long-running operations ko "asynchronous" bana dete hain, jisse ki program efficiently chal sake bina wait kiye.

### **2. `async` Function kya hai?**
- **`async`** ek keyword hai jo ek function ko asynchronous bana deta hai.
- Jab hum **`async fn`** likhte hain, toh wo function ek **`Future`** return karta hai, jo future mein value ko return karega.

### **Example:**
```rust
async fn say_hello() {
    println!("Hello, async!");
}
```
Is function ko **`async`** banaya gaya hai, iska matlab hai ki yeh function asynchronous hai aur yeh turant execute nahi hoga, balki yeh future mein execute hoga.

---

### **3. `await` kya hai?**
- **`await`** ek keyword hai jo kisi asynchronous function ko call karte waqt use hota hai.
- Jab aap **`await`** lagate ho, toh yeh function ko call karta hai aur wait karta hai jab tak wo **`Future`** complete nahi ho jaata.
- Matlab, jab tak ek **`Future`** complete nahi hoti, tab tak aapka program block nahi hota. Aap dusre tasks ko execute kar sakte ho.

### **Example:**

```rust
async fn say_hello() {
    println!("Hello, async!");
}

#[tokio::main]
async fn main() {
    say_hello().await; // wait for the async function to complete
}
```

- **`await`** se hum yeh ensure kar rahe hain ki hum **`say_hello()`** ko finish hone tak wait kar rahe hain.
- **`main`** function ko asynchronous banaya gaya hai using **`#[tokio::main]`**.

---

### **4. Async/Await kaise kaam karta hai?**

- Jab aap ek asynchronous function call karte ho, jaise **`say_hello()`**, toh wo turant execute nahi hota.
- **`await`** ke saath call karte waqt, Rust us function ko background mein execute karne ke liye schedule kar deta hai, aur jab wo function complete hota hai, tab result ko return karta hai.

Rust mein, **async functions** ko **`Future`** objects ke roop mein treat kiya jaata hai, jo ek placeholder hai kisi future value ke liye.

---

### **5. `async` aur `await` ka Example:**

```rust
use tokio;

async fn fetch_data() -> String {
    // Simulating network call
    tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
    "Data fetched!".to_string()
}

#[tokio::main]
async fn main() {
    let result = fetch_data().await; // await the async function to complete
    println!("{}", result);
}
```

- **`fetch_data()`** ek asynchronous function hai, jo data fetch karne ka kaam karta hai. Isme humne **`tokio::time::sleep`** ka use kiya hai jo ek delay simulate karta hai.
- **`await`** ka use kiya gaya hai, jisse hum program ko rukne nahi dete, aur jab **`fetch_data()`** complete hota hai tab **`result`** ko print karte hain.

---

### **6. Async/Await ka Flow:**
1. Jab ek asynchronous function call hota hai, toh wo turant execute nahi hota. Rust isse ek **Future** object ke roop mein treat karta hai.
2. **`await`** jab function par lagta hai, toh Rust wait karta hai jab tak wo **Future** complete nahi ho jaata.
3. Jab **Future** complete hota hai, tab hum **`await`** ke baad ka code execute karte hain.

---

### **7. Benefits of Async/Await:**

- **Non-blocking Execution**: Async functions block nahi karte. Matlab ek function ka wait karte hue baaki tasks chal sakte hain.
- **Concurrency**: Aap easily multiple tasks ko concurrently run kar sakte ho bina threads ka over-head liye.
- **Performance**: Asynchronous programming ka use karte hue aap efficiently apne resources ka use kar sakte ho, jisse performance improve hoti hai.

---

### **8. Real-World Example:**

Agar aap ek web server bana rahe hain jo requests ko asynchronously handle kare, toh aap **async/await** ka use karenge. Maan lo ek user ne request ki hai jo network se data fetch kar rahi hai:

```rust
use tokio;
use reqwest;

async fn fetch_user_data() -> reqwest::Result<String> {
    let response = reqwest::get("https://jsonplaceholder.typicode.com/users")
        .await?
        .text()
        .await?;
    Ok(response)
}

#[tokio::main]
async fn main() {
    match fetch_user_data().await {
        Ok(data) => println!("User Data: {}", data),
        Err(e) => println!("Error: {}", e),
    }
}
```

- **`fetch_user_data()`** ek asynchronous function hai jo data ko fetch karta hai.
- **`reqwest::get()`** ka use karke ek HTTP request send ki jaati hai aur **`await`** ka use kiya gaya hai jab tak response nahi milta.

---

### **Conclusion:**

- **Async/Await** Rust mein concurrency aur parallelism ko handle karne ka ek powerful tool hai.
- Yeh aapko long-running tasks ko asynchronously execute karne ki suvidha deta hai.
- **`async`** function create karta hai jo future mein value return karega.
- **`await`** ka use aapko function ke completion ka wait karne ke liye hota hai.

---

### **WebAssembly (WASM):**

WebAssembly (WASM) ek tarah ka low-level binary format hai jo code ko fast aur efficiently execute karta hai, khaas kar web browsers mein. Jab hum WebAssembly ki baat karte hain, toh hum uske types ke baare mein baat karte hain, jo ki data ko store karne, functions ko define karne, aur memory ko manage karne ke liye use hote hain.

---

Ab samajh, main types jo WebAssembly mein hote hain:

### 1. **Value Types**  
Yeh wo types hain jo directly data ko represent karte hain. Jaise:
- **`i32`**: 32-bit signed integer.
- **`i64`**: 64-bit signed integer.
- **`f32`**: 32-bit floating point number (single precision).
- **`f64`**: 64-bit floating point number (double precision).
- **`v128`**: 128-bit SIMD vector (yeh zyada efficient hota hai jab complex calculations perform karte hain).

### 2. **Reference Types**  
Yeh types refer karte hain un cheezon ko jo external memory ya environment (jaise JavaScript) mein stored hoti hain. Jaise:
- **`funcref`**: Function ka reference (yaani, ek function ko dusre function mein pass karna).
- **`externref`**: JavaScript object ya kisi external reference ka pointer.

### 3. **Memory Types**  
WebAssembly mein memory ek flat structure hota hai, jisme sequential addresses hote hain. Yeh memory types hain:
- **`memory`**: Yeh ek block of memory ko define karta hai, jisme data store kiya jata hai.

Jaise:
```wasm
(memory 1)  ; Yeh 1 page memory define karega (1 page = 64 KB).
```
---

### 4. **Table Types**  
Jab hum functions ko store karte hain (jaise function pointers), toh hum table use karte hain:
- **`table`**: Yeh ek table hota hai jo function references store karta hai. Jaise ek array hota hai functions ka.

```wasm
(table funcref 10)  ; Yeh 10 function references store kar sakta hai.
```
---

### 5. **Global Types**  
Global variables ko define karte hain:
- **`global`**: Yeh ek global variable ko represent karta hai, jisme integer ya floating-point number ho sakta hai. Yeh immutable (const) ya mutable (changeable) ho sakte hain.
---

### 6. **Function Signatures**  
Jab hum function define karte hain, toh hum uske input/output types define karte hain.
```wasm
(func (param i32) (result i32))
```
Yeh function ek `i32` type ka parameter lega aur `i32` type ka result dega.

---

### 7. **Structs aur Arrays**  
WASM mein directly structs ya arrays nahi hote, lekin hum memory ko use karke unhe represent kar sakte hain.

---

### **Summary**
WebAssembly mein types ka use data ko store karne, functions ko pass karne, aur memory ko manage karne ke liye hota hai. Basic types hote hain jaise integers (`i32`, `i64`), floating point numbers (`f32`, `f64`), references (functions ya objects), aur memory jahan hum data rakhte hain.

---

