### Reverse a string:

Rust mein string ko reverse karne ka program kuch is tarah likha ja sakta hai:

```rust
fn reverse_string(s: &str) -> String {
    s.chars().rev().collect()
}

fn main() {
    let input = "hello";
    let reversed = reverse_string(input);
    println!("Reversed string: {}", reversed);
}
```
---

### Explanation:
1. **`chars()`**: Yeh function string ko characters ke iterator mein convert karta hai.
2. **`rev()`**: Yeh iterator ko reverse kar deta hai.
3. **`collect()`**: Yeh reversed characters ko ek `String` mein convert kar leta hai.

Is program mein `input` string ko reverse karke `reversed` mein store kar liya gaya hai aur usse print kiya gaya hai.

Output:
```
Reversed string: olleh
```
---

### Longest String in an array:

Rust mein array ya vector mein sabse lambi string ko find karne ka program kuch is tarah likha ja sakta hai:

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

fn main() {
    let arr = ["apple", "banana", "cherry", "kiwi"];
    let result = longest_string(&arr);
    println!("Longest string: {}", result);
}
```
---

### Explanation:
1. **`longest_string` function**: Yeh function ek slice of string references (`&[&str]`) leta hai aur unme se sabse lambi string ko return karta hai.
2. **`longest` variable**: Yeh initial value `""` (empty string) hai. Yeh variable track karega ki ab tak sabse lambi string kaunsi hai.
3. **Loop**: `for &s in strings` mein hum array ya slice ke har element ko iterate kar rahe hain. Agar current string ki length pehle se stored `longest` string se zyada hai, toh usse `longest` variable mein store karte hain.
4. **`len()` function**: `s.len()` current string ki length ko return karta hai.

Output:
```
Longest string: banana
```

---

Agar aapko `max_by_key` ka use karke longest string find karni ho toh aap yeh program likh sakte hain:

```rust
fn main() {
    let arr = ["apple", "banana", "cherry", "kiwi"];
    let longest = arr.iter().max_by_key(|s| s.len()).unwrap();
    println!("Longest string: {}", longest);
}
```

---

### Explanation:
1. **`arr.iter()`**: Yeh `arr` array ke elements ka iterator return karta hai.
2. **`max_by_key(|s| s.len())`**: Yeh iterator ko process karta hai aur har string ka length compare karke sabse lambi string ko return karta hai. `max_by_key` function ek closure leta hai jo string ka length (`s.len()`) return karta hai.
3. **`unwrap()`**: `max_by_key` option return karta hai (yani `Some(&str)` ya `None`). Agar koi element nahi hai, toh `unwrap()` panic karega. Hum yaha assume kar rahe hain ki array empty nahi hai.

---

Output:
```
Longest string: banana
``` 

Yeh method `max_by_key` ka use karta hai, jo aapke program ko cleaner aur concise banata hai.

---

### **Max Number in an Array**

Rust mein array mein sabse bada number find karne ke liye aap `iter()` aur `max()` ka use kar sakte hain. Yaha ek example hai:

```rust
fn main() {
    let arr = [1, 5, 3, 9, 7];
    let max_num = arr.iter().max().unwrap();
    println!("Max number: {}", max_num);
}
```
---

### Explanation:
1. **`arr.iter()`**: Yeh array ka iterator return karta hai.
2. **`max()`**: Yeh iterator ke elements ka comparison karta hai aur sabse bada element return karta hai.
3. **`unwrap()`**: `max()` ek `Option` type return karta hai (`Some(&i32)` ya `None`). `unwrap()` se hum us value ko safely extract karte hain. Agar array empty ho, toh `unwrap()` panic karega. 

---

### Output:
```
Max number: 9
```
---

Agar aapko yeh ensure karna ho ki array empty nahi ho, toh `match` ya `if let` ka use karke safely handle kar sakte hain. Jaise:

```rust
fn main() {
    let arr = [1, 5, 3, 9, 7];
    match arr.iter().max() {
        Some(&max_num) => println!("Max number: {}", max_num),
        None => println!("Array is empty"),
    }
}
```

---

### **Fibonacci series in Rust**

Rust mein Fibonacci series ka program kuch is tarah se likha ja sakta hai:

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
---

### Explanation:
1. **`fibonacci(n: u32) -> u32`**: Yeh function nth Fibonacci number return karta hai. Yaha hum iterative approach ka use kar rahe hain.
2. **`a` aur `b`**: In dono variables mein pehle do Fibonacci numbers (0 aur 1) store hote hain.
3. **Loop**: Hum `0..n` ke range mein loop chala kar Fibonacci series generate karte hain.
4. **`println!("{}", fibonacci(i))`**: Har Fibonacci number print kiya jata hai.

### Output (for `n = 10`):
```
Fibonacci series for first 10 numbers:
0
1
1
2
3
5
8
13
21
34
```
---

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
---

### Explanation:
1. **Base Case**: Agar `n <= 1`, toh value return karte hain.
2. **Recursive Case**: Fibonacci sequence ka calculation `fibonacci(n - 1) + fibonacci(n - 2)` se hota hai.

---

### Output:
```
Fibonacci series for first 10 numbers:
0
1
1
2
3
5
8
13
21
34
```
---

### **Bubble Sort in Rust**

### Bubble Sort Explanation:
**Bubble Sort** ek simple sorting algorithm hai, jo repeatedly adjacent elements ko compare karke swap karta hai agar wo order mein nahi hote. Iska naam **Bubble** isliye pada kyunki chhote elements array ke bottom pe "bubble up" karte hain aur bade elements upar ki taraf "sink" karte hain.

### Steps:
1. **Comparison**: Array ke adjacent elements ko compare karo.
2. **Swap**: Agar wo elements sahi order mein nahi hain (matlab pehla element bada hai doosre se), toh unhe swap karo.
3. **Repeat**: Yeh step array ke end tak repeat karo. Har pass ke baad ek element apni correct position pe aajata hai.
4. **Termination**: Jab array ke andar koi swap na ho toh sorting complete hota hai.

---

### Code:

```rust
fn bubble_sort(arr: &mut [i32]) {
    let n = arr.len();
    
    for i in 0..n {
        // Flag to check if any swap happens in this iteration
        let mut swapped = false;
        
        // Traverse the array from 0 to n - i - 1
        // Last i elements are already sorted
        for j in 0..n - i - 1 {
            // If the current element is greater than the next, swap them
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
                swapped = true;
            }
        }
        
        // If no elements were swapped, the array is sorted
        if !swapped {
            break;
        }
    }
}

fn main() {
    let mut arr = [64, 34, 25, 12, 22, 11, 90];
    println!("Original array: {:?}", arr);
    
    bubble_sort(&mut arr); // Call the bubble_sort function to sort the array
    
    println!("Sorted array: {:?}", arr);
}
```
---

### Explanation:
1. **`bubble_sort` function**: Yeh function array ko sort karne ke liye bubble sort algorithm use karta hai. Yeh array ko **mutable reference** ke roop mein leta hai, taaki array ko modify kiya ja sake.
2. **Outer loop (`for i in 0..n`)**: Yeh loop har pass ke liye execute hota hai. `i` ka use ye ensure karne ke liye hota hai ki har pass mein ek element ko apni correct position pe dala jaaye.
3. **Inner loop (`for j in 0..n - i - 1`)**: Yeh loop adjacent elements ko compare karta hai aur agar required ho toh swap karta hai.
4. **Early termination**: Agar kisi pass mein koi swap nahi hota, toh array already sorted hai aur loop ko break kar diya jaata hai.

---

### Output:
```
Original array: [64, 34, 25, 12, 22, 11, 90]
Sorted array: [11, 12, 22, 25, 34, 64, 90]
```
---

### Time Complexity:
- **Worst case**: O(n^2), jab array reverse order mein ho.
- **Best case**: O(n), jab array already sorted ho (early termination).
- **Average case**: O(n^2), jab elements random order mein hon.

---


### **Binary Search in Rust**

### Binary Search Kya Hai?

**Binary Search** ek efficient algorithm hai jo **sorted array** mein element ko dhundhne ka kaam karta hai. Yeh algorithm har step mein array ko half kar leta hai, isse search ka time bahut kam ho jata hai. Agar target element middle se chhota ho, toh left side mein search karega, aur agar bada ho toh right side mein. Iska time complexity **O(log n)** hota hai, jo ki bahut fast hota hai.

---

### **Code Explanation:**

```rust
fn binary_search(arr: &[i32], target: i32) -> Option<usize> {
    let mut left = 0;  // Array ka starting point
    let mut right = arr.len() as i32 - 1;  // Array ka end point

    while left <= right {  // Jab tak left pointer right pointer se bada nahi ho jata
        let mid = left + (right - left) / 2;  // Middle element ka index nikaal rahe hain

        if arr[mid as usize] == target {  // Agar middle element target ke barabar hai
            return Some(mid as usize);  // Index return karo
        } else if arr[mid as usize] < target {  // Agar middle element target se chhota hai
            left = mid + 1;  // Left pointer ko mid ke baad ki taraf shift karo
        } else {  // Agar middle element target se bada hai
            right = mid - 1;  // Right pointer ko mid ke pehle ki taraf shift karo
        }
    }
    None  // Agar target element nahi milta, toh None return karo
}

fn main() {
    let arr = [1, 3, 5, 7, 9, 11, 13, 15];  // Sorted array
    let target = 7;  // Jo element humein dhundhna hai

    match binary_search(&arr, target) {  // binary_search function call karte hain
        Some(index) => println!("Element found at index {}", index),  // Agar element milta hai toh index print karo
        None => println!("Element not found"),  // Agar nahi milta toh message print karo
    }
}
```

---

### **Code ka Breakdown:**

1. **`binary_search` function:**
   - **Arguments**:
     - `arr: &[i32]`: Yeh ek reference hai array ka jo hum pass karte hain.
     - `target: i32`: Yeh wo element hai jo humein array mein search karna hai.
   
   - **Return Type**:
     - `Option<usize>`: Yeh function ya toh `Some(index)` return karega agar element milta hai, ya `None` agar element nahi milta.

2. **Variables:**
   - `left`: Yeh start ho raha hai array ke first index (0).
   - `right`: Yeh array ke last index par set ho raha hai (`arr.len() - 1`).

3. **While Loop:**
   - **Condition (`left <= right`)**: Jab tak left pointer right pointer se chhota ya barabar ho, loop chalta rahega. Matlab jab tak left aur right ke beech koi range bachi ho tab tak hum element dhundhte rahenge.

4. **Middle Element Calculation**:
   - `mid = left + (right - left) / 2`: Yeh middle element ka index nikaalne ka formula hai.

5. **Comparison**:
   - Agar `arr[mid as usize] == target`: Agar middle element target ke barabar hai, toh uska index return karo.
   - Agar `arr[mid as usize] < target`: Agar middle element target se chhota hai, toh left pointer ko middle ke right side par shift karo (`left = mid + 1`).
   - Agar `arr[mid as usize] > target`: Agar middle element target se bada hai, toh right pointer ko middle ke left side par shift karo (`right = mid - 1`).

6. **End of the loop**:
   - Agar target element nahi milta, toh `None` return hota hai.

7. **Main Function**:
   - Humne ek sorted array `arr` banaya hai aur target `7` ko search kar rahe hain.
   - **Pattern Matching (`match`)**:
     - Agar element mil jata hai toh uska index print karte hain.
     - Agar element nahi milta toh `"Element not found"` print karte hain.

---

### **Example Output:**
Agar hum array `[1, 3, 5, 7, 9, 11, 13, 15]` ko dekhen aur target `7` ho, toh output hoga:

```
Element found at index 3
```

Yeh isliye kyunki `7` array mein index `3` pe hai.

---

### **Time Complexity:**

- **Time Complexity**: **O(log n)**, jahan `n` array ki length hai. Har step mein hum array ko half karte hain, isliye time bahut kam ho jata hai.
- **Space Complexity**: **O(1)**, kyunki hum sirf kuch pointers ka use kar rahe hain, koi extra memory use nahi ho rahi.

### **Binary Search Kahan Use Karna Hai:**

- Binary search sirf **sorted arrays** ya lists par kaam karta hai.
- Yeh linear search se bahut fast hai, specially jab data bahut bada ho.

---

