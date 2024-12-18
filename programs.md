### Reverse a string:

Rust mein string ko reverse karne ka program kuch is tarah likha ja sakta hai:

```rust
fn reverse_string(s: &str) -> String {
    s.chars().rev().collect()
}
```


### Longest String in an array:

```rust
fn longest_string(strings: &[&str]) -> &str {
    let mut longest = "";
    for &s in strings {
        if s.len() > longest.len() {
            longest = s;
        }
    }
    longest
}

---

---

### **Fibonacci series in Rust**

Rust mein Fibonacci series ka program kuch is tarah se likha ja sakta hai:

### Recursive Approach:
Agar aap recursive approach ka use karna chahein toh kuch is tarah se likh sakte hain:

```rust
fn fibonacci(n: u32) -> u32 {
    if n <= 1 {
        n
    } else {
        fibonacci(n - 1) + fibonacci(n - 2)
    }
}

fn main() {
    let n = 10;
    println!("Fibonacci series for first {} numbers:", n);
    for i in 0..n {
        println!("{}", fibonacci(i));
    }
}
```

### Iterative Approach:
```rust
fn fibonacci(n: u32) -> u32 {
    let mut a = 0;
    let mut b = 1;
    for _ in 0..n {
        let temp = a;
        a = b;
        b = temp + b;
    }
    a
}

fn main() {
    let n = 10; // Number of terms in Fibonacci series
    println!("Fibonacci series for first {} numbers:", n);
    for i in 0..n {
        println!("{}", fibonacci(i));
    }
}
```

### **Program To check weather String is Palindrome or not**

```rust
fn is_palindrome(s: &str) -> bool {
    let rev: String = s.chars().rev().collect();
    s == rev
}

fn main(){
    let data = "naman";
    if is_palindrome(data){
        println!("{} Is a palidrome", data);
    } else{
        println!(" {} Is not a palindrome", data);
    }
    
}
```

---


### **Case-Insensitive Palindrome Code**

```rust
fn is_palindrome(s: &str) -> bool {
    let lower_s = s.to_lowercase(); // Convert the string to lowercase
    let rev: String = lower_s.chars().rev().collect(); // Reverse the lowercase string
    lower_s == rev // Compare original (lowercase) with reversed
}

fn main() {
    let data = "Naman"; // Example with mixed case
    if is_palindrome(data) {
        println!("{} is a palindrome", data);
    } else {
        println!("{} is not a palindrome", data);
    }
}
```
----
