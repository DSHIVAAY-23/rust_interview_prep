
### **Tokio:**
**Tokio** ek asynchronous runtime hai Rust programming language ke liye jo concurrency aur parallelism handle karne ke liye use hota hai. Yeh Rust ke async/await syntax ko implement karta hai aur aapko asynchronous programming mein madad karta hai, jisme aap parallel tasks ko efficiently execute kar sakte ho bina threads ke over-head ke.

Chalo, ab thoda aur detail mein samajhte hain ki **Tokio** kya hai aur yeh kaise kaam karta hai.


### **Key Features of Tokio:**

1. **Concurrency and Parallelism:**
   
2. **Async IO:**

3. **Futures and Streams:**
   - Tokio ka use karte waqt aapko **`Future`** aur **`Stream`** types ka use karna padta hai, jo asynchronous operations ko represent karte hain.
   - **`Future`** ek value ko represent karta hai jo future mein available hoga.
   - **`Stream`** ek sequence of values ko represent karta hai jo time ke saath aayenge.
4. **Multithreading Support:**

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
1. Jab ek asynchronous function call hota hai, toh wo turant execute nahi hota. Rust isse ek **Future** object ke roop mein treat karta hai.
2. **`await`** jab function par lagta hai, toh Rust wait karta hai jab tak wo **Future** complete nahi ho jaata.
3. Jab **Future** complete hota hai, tab hum **`await`** ke baad ka code execute karte hain.

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


