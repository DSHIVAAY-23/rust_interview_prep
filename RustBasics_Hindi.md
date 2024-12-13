# Difference between `mut` and `let mut`

`let`: is immutable by default, when you define a variable with `let`, Rust treats it as immutable by default, meaning its value cannot be changed once set.  
`let mut`: Enabling Mutability, on the other hand using `let mut`, allows you to make the variable mutable.

```rust
fn main(){
    let a = 20;
    // a = 30; you cannot assign twice to immutable variable
    let mut b = 22;
    b = 23;
    println!("value of a is {} and b is {}", a, b);
}
```

---

# What is Shadowing in Rust and give an example of how it's used?

Shadowing ka matlab hai ki Rust me tum ek hi variable ka naam phir se use kar sakte ho **usi scope me**, aur naye value ya naye type ke sath usse redefine kar sakte ho. Matlab ek naye variable ko purane wale ko "hide" karne ke liye use kiya jata hai, lekin asal me purane variable ko delete nahi kiya jata; ek naya create hota hai.

Chalo example ko samjhte hain:

```rust
fn main() {
    let age = "20"; // Step 1: Yaha `age` ek string (text) hai. Iska value "20" hai.
    let age = age.parse::<u8>().unwrap(); // Step 2: Yaha `age` ka type string se number (u8) me badal diya.
    println!("Double your age plus 7: {}", (age * 2 + 7)); // Step 3: Naye `age` ka use number wale calculation ke liye kiya.
}
```

### Step by Step Hindi me:
1. **`let age = "20";`**  
   - Yaha tumne ek variable banaya jiska naam `age` hai, aur usme ek string value `"20"` rakhi.

2. **Shadowing: `let age = age.parse::<u8>().unwrap();`**  
   - Is line me tumne wahi `age` ka naam dobara use kiya, lekin ab uska type string se **number** (`u8`) me convert kar diya.  
   - Yaha `age.parse::<u8>()` ka matlab hai ki string `"20"` ko number `20` me badal rahe ho. Agar string ko number me convert karna successful hai, to `unwrap()` result deta hai.

3. **`println!` me naye `age` ka use hota hai:**  
   - Naye `age` me ab number `20` hai. Tumne us number ko double kiya (`20 * 2 = 40`) aur usme 7 add kiya (`40 + 7 = 47`).  
   - Output:
     ```
     Double your age plus 7: 47
     ```

### Shadowing kyon useful hai?
- **Type badalne ke liye:** Ek variable ka type (string se number, ya kuch aur) badalna ho to naye naam ki zarurat nahi, bas shadowing karo.
- **Readable code:** `age_str` aur `age_num` jese alag variable banane ki zarurat nahi.
- **Immutability maintain hoti hai:** Tumhe `mut` (mutable) banana ki zarurat nahi, kyunki har baar ek naya variable ban raha hai.

### Summary:
Shadowing tumhare code ko simple banata hai, aur type ya value badalne ke liye ek hi naam baar-baar use karne ki flexibility deta hai.

---

# Declare an Array in Rust

```rust
fn main(){
   let mut arr:[i32; 3] = [1,5,7];
   let first_number = arr[0];
   arr[0] = 5;
   println!("The first element of array is: {}", first_number)
}
```

In the given code, the output will be:

```
The first element of array is: 1
```

### Explanation:

1. **Array Definition**:
   ```rust
   let mut arr: [i32; 3] = [1, 5, 7];
   ```
   - A mutable array `arr` of type `[i32; 3]` (an array of three 32-bit integers) is defined with initial values `[1, 5, 7]`.

2. **Fetching the First Element**:
   ```rust
   let first_number = arr[0];
   ```
   - The first element of the array (`arr[0]`, which is `1`) is assigned to the variable `first_number`. At this point, `first_number` has the value `1`.

3. **Changing the First Element**:
   ```rust
   arr[0] = 5;
   ```
   - The first element of the array is updated to `5`. However, this does **not affect** the value of `first_number`, because `first_number` was assigned the value `1` **before** the array was modified. In Rust, when you assign a value from an array to a variable, the value is copied (not referenced).

4. **Printing `first_number`**:
   ```rust
   println!("The first element of array is: {}", first_number);
   ```
   - This prints the value of `first_number`, which is still `1`, as it was not affected by the modification of the array.

### Key Concept:
- **Ownership and Copying**: In Rust, primitive types like `i32` implement the `Copy` trait. When you assign `arr[0]` to `first_number`, a copy of the value (`1`) is made. Changes to `arr[0]` after this do not affect `first_number`.

---

### Ownership in Rust:

**Ownership** Rust ka ek unique concept hai jo memory management ko handle karta hai bina garbage collector ke. Matlab, Rust me har variable ka ek **owner** hota hai, aur ye owner hi memory ko control karta hai. Jab owner ka kaam khatam hota hai, to Rust automatically us memory ko free kar deta hai.

Ownership ki wajah se:
1. **Memory safety** ensure hoti hai (koi "dangling pointers" nahi hote).
2. Performance fast hoti hai, kyunki garbage collector ki zarurat nahi.

---

### Ownership ke 3 Rules:
1. **Har variable ka ek owner hota hai.**
2. **Ek hi time pe sirf ek owner hota hai.**
3. **Jab owner scope se bahar jata hai, memory free ho jati hai.**

---

### Example ke Saath Samjho:
```rust
fn main() {
    let name = String::from("Amit"); // Step 1: `name` variable owner ban gaya.
    println!("Name is: {}", name);   // Step 2: `name` ka use ho raha hai.
    let another_name = name;         // Step 3: Ownership `name` se `another_name` me transfer ho gaya.
    // println!("{}", name);         // Step 4: Error! `name` ab valid nahi hai.
    println!("{}", another_name);    // Step 5: `another_name` ka use ho raha hai.
}
```

---

### Step by Step Explanation:
1. **`let name = String::from("Amit");`**  
   - Yaha `name` ek `String` ka owner ban gaya. Memory allocate ho gayi.

2. **`println!("Name is: {}", name);`**  
   - `name` ka value access ho raha hai. Sab kuch theek chal raha hai.

3. **`let another_name = name;`**  
   - Ownership `name` se `another_name` me transfer ho gaya. Ab `name` invalid ho gaya. Rust me ek hi variable ek time pe owner ho sakta hai.

4. **`println!("{}", name);`**  
   - Agar tum yaha `name` use karoge, to **compile-time error** aayega, kyunki `name` ka ownership khatam ho chuka hai.

5. **`println!("{}", another_name);`**  
   - Ab tum `another_name` ka use kar sakte ho, kyunki wo ab naye owner hai.

---

### Important Points:
1. **Ownership kyon zaroori hai?**  
   - Ye memory leaks aur undefined behavior se bachaata hai.

2. **Ownership transfer kab hota hai?**  
   - Jab tum ek variable ko doosre variable me assign karte ho ya function me pass karte ho.

3. **Agar Ownership wapas chahiye ho?**  
   - Tum `clone()` ka use kar sakte ho:
     ```rust
     let name = String::from("Amit");
     let another_name = name.clone(); // Dono ke alag copy banegi.
     println!("{}", name); // Ye ab valid hai.
     println!("{}", another_name);
     ```

---

### Summary:
Rust ka **Ownership** concept memory ko manage karta hai bina garbage collector ke. Har variable ka ek owner hota hai, aur jab wo owner kaam khatam karta hai, Rust us memory ko free kar deta hai. Is concept ki wajah se Rust fast aur safe language hai.


### Borrowing Rules in Rust:

Rust ka **borrowing** concept ownership ke saath kaam karta hai. Borrowing ka matlab hai ki tum kisi variable ki **ownership liye bina uska reference** (`&` ya `&mut`) use kar sakte ho. Isse memory safe rehti hai, aur tumhare code me bugs ka chance kam hota hai.  

---

### Borrowing ke Rules:
Borrowing me kuch strict rules hote hain jo Rust ke **safety guarantees** ko ensure karte hain:

#### 1. **Ek samay pe ek hi mutable reference ho sakta hai (`&mut`)**:  
   - Tum ek hi variable ka ek waqt me sirf ek mutable reference le sakte ho.  
   - Ye isliye hota hai, taaki data race (conflicting changes) na ho.

#### 2. **Immutable (`&`) aur mutable (`&mut`) reference ek sath nahi ho sakte**:  
   - Agar ek variable ka immutable reference hai, to tum uska mutable reference nahi le sakte, aur vice versa.  
   - Matlab, ek waqt pe ya to sab **read-only** (immutable) honge, ya ek hi **write** (mutable) hoga.

#### 3. **References hamesha valid rahni chahiye**:  
   - Tum reference ko tab tak use nahi kar sakte jab tak us variable ka scope valid hai.  
   - Rust compile-time pe check karta hai ki koi "dangling reference" (ek aisa reference jo khud kisi invalid memory location ko point kar raha ho) na ho.

---

### Example ke Saath Samjho:

#### **1. Ek hi mutable reference allowed:**
```rust
fn main() {
    let mut data = String::from("Hello");
    let r1 = &mut data; // OK: Ek mutable reference
    // let r2 = &mut data; // Error: Do mutable references ek sath allowed nahi!
    r1.push_str(", World!"); // `r1` ka use ho raha hai
    println!("{}", r1); // Output: "Hello, World!"
}
```

- Yaha tum ek mutable reference `r1` banate ho. Dusra mutable reference `r2` banane ki koshish karoge to Rust compile-time error dega.

---

#### **2. Immutable aur mutable reference ek saath allowed nahi:**
```rust
fn main() {
    let mut data = String::from("Hello");
    let r1 = &data; // Immutable reference
    let r2 = &data; // Dusra immutable reference (ye allowed hai)
    // let r3 = &mut data; // Error: Immutable aur mutable references ek sath nahi ho sakte
    println!("{} and {}", r1, r2);
}
```

- Yaha tum multiple **immutable references** bana sakte ho (`r1` aur `r2`), lekin usi waqt pe mutable reference (`r3`) banana allowed nahi hai.

---

#### **3. Dangling Reference Avoidance:**
```rust
fn main() {
    let r;
    {
        let data = String::from("Hello");
        r = &data; // Error: `data` ka scope khatam ho raha hai
    }
    // println!("{}", r); // Dangling reference hoga, isliye Rust allow nahi karega
}
```

- Yaha `data` ka scope khatam ho gaya hai, aur `r` uske reference ko hold kar raha hai. Rust yaha compile-time error dega taaki koi invalid memory access na ho.

---

### Summary:
1. Ek hi time pe ek mutable reference ho sakta hai.
2. Immutable aur mutable references ek sath allowed nahi hote.
3. Rust compile-time pe ensure karta hai ki koi reference kabhi invalid memory ko point na kare.

Ye rules Rust ko **memory-safe** banate hain bina garbage collector ke. Rust ka borrowing system powerful aur bugs-free code likhne me madad karta hai.

---

