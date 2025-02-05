
### **Tokio:**
**Tokio** Tokio is an asynchronous runtime for the Rust programming language that is used to handle concurrency and parallelism. It implements Rust's async/await syntax and helps you write asynchronous programs, allowing you to execute multiple tasks efficiently without excessive thread overhead.

Let’s understand in more detail what Tokio is and how it works.


### **Key Features of Tokio:**

Key Features of Tokio:

1. Concurrency and Parallelism:

Tokio enables concurrent execution of multiple tasks using async/await, making it efficient for high-performance applications.

2. Async IO:

Tokio provides non-blocking Input/Output operations, which means you can handle multiple tasks simultaneously without blocking the main thread.

3. Futures and Streams:

When working with Tokio, you need to use Future and Stream types, which represent asynchronous operations.
Future represents a value that will be available at some point in the future.
Stream represents a sequence of values that arrive over time.

4.Multithreading Support:

Tokio allows tasks to run on multiple threads, improving efficiency for large-scale applications.

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




### **6. Async/Await ka Flow:**
When an asynchronous function is called, it does not execute immediately. Instead, Rust treats it as a Future object.
The await keyword makes Rust pause execution until the Future is completed.
Once the Future is resolved, the code following await continues execution.

---

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


