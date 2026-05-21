// ============================================================
// DATA — All content for rust-prep website
// ============================================================

const CONCEPTS = [
  {
    name:'Ownership', cat:'foundation',
    when:'Core of Rust — always relevant. Every value has exactly one owner.',
    avoid:'You cannot opt out — it is the language itself.',
    tip:'Stack values are copied (Copy types). Heap values are moved. Clone() for explicit deep copy.',
    interview:'"Ownership means each value has exactly one owner. When the owner goes out of scope, the value is dropped — no garbage collector needed."',
    basic:`fn main() {
    let s1 = String::from("hello");
    let s2 = s1;        // s1 MOVED to s2
    // println!("{}", s1); // ERROR: moved
    println!("{}", s2);  // OK

    let x = 5;
    let y = x;           // COPIED — i32 implements Copy
    println!("{} {}", x, y); // both valid
}`,
    advanced:`// Avoid unnecessary moves — pass references instead
fn calculate_length(s: &String) -> usize { s.len() }

fn main() {
    let s = String::from("hello");
    let len = calculate_length(&s); // borrow, not move
    println!("{} has length {}", s, len); // s still valid
}`
  },
  {
    name:'Borrowing', cat:'foundation',
    when:'Pass data without transferring ownership. Read (&T) or mutate (&mut T).',
    avoid:'Cannot have &mut T and &T at same time — compile error.',
    tip:'Rule: many immutable refs OR one mutable ref — never both simultaneously.',
    interview:'"Borrowing lets you use a value without taking ownership. Rust enforces: either many readers or one writer — never both. This eliminates data races at compile time."',
    basic:`fn main() {
    let s = String::from("hello");
    let r1 = &s;      // immutable borrow
    let r2 = &s;      // second — OK
    println!("{} {}", r1, r2);

    let mut s2 = String::from("hello");
    let r3 = &mut s2; // mutable borrow
    r3.push_str(" world");
    println!("{}", r3);
}`,
    advanced:`// Slice borrows — borrow part of collection
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &b) in bytes.iter().enumerate() {
        if b == b' ' { return &s[..i]; }
    }
    &s[..]
}`
  },
  {
    name:'Lifetimes', cat:'foundation',
    when:'When compiler cannot infer how long a reference lives — multiple input refs with output ref.',
    avoid:"Elision rules handle most cases — only annotate when compiler complains.",
    tip:'Lifetime annotations do not change how long data lives — they label relationships.',
    interview:'"Lifetimes tell the compiler how long references are valid relative to each other. They prevent dangling references — all enforced at compile time, zero runtime cost."',
    basic:`// 'a means: output lives at least as long as shorter input
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}`,
    advanced:`// Lifetime in structs
struct Important<'a> {
    part: &'a str,  // struct cannot outlive string it holds
}

// Static lifetime — lives entire program
let s: &'static str = "I live forever";`
  },
  {
    name:'Traits', cat:'abstraction',
    when:'Define shared behaviour across types. Like interfaces in other languages.',
    avoid:'When only one type needs the method — just use impl block directly.',
    tip:'Default implementations let you partially implement a trait. impl Trait in params is cleaner than T: Trait.',
    interview:'"A trait defines a contract — any type implementing it must provide that behaviour. This is how Rust achieves polymorphism without inheritance."',
    basic:`trait Summary {
    fn summarize(&self) -> String;
    fn preview(&self) -> String {  // default impl
        format!("{}...", &self.summarize()[..20.min(self.summarize().len())])
    }
}
struct Article { title: String, author: String }
impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{} by {}", self.title, self.author)
    }
}`,
    advanced:`// Trait bounds — require multiple traits
fn notify(item: &(impl Summary + std::fmt::Display)) { }

// Return impl Trait — hide concrete type
fn make_summarizer() -> impl Summary {
    Article { title: "hello".into(), author: "world".into() }
}`
  },
  {
    name:'Generics', cat:'abstraction',
    when:'Write one function/struct for multiple types without code duplication.',
    avoid:'When you need runtime type selection — use dyn Trait instead.',
    tip:'Generics are zero-cost — compiler generates specialized code per type (monomorphization).',
    interview:'"Generics are zero-cost abstractions. The compiler generates a separate concrete version for each type — no runtime overhead, unlike Java or C# generics."',
    basic:`fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest { largest = item; }
    }
    largest
}
// Works for both Vec<i32> and Vec<f64>`,
    advanced:`struct Pair<T> { first: T, second: T }

impl<T: std::fmt::Display + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.first >= self.second {
            println!("first: {}", self.first);
        }
    }
}`
  },
  {
    name:'Box<T>', cat:'smart-ptrs',
    when:'Heap allocation. Recursive types. Return dyn Trait. Move large data.',
    avoid:'When stack allocation works — Box adds unnecessary heap indirection.',
    tip:'Box size is always 8 bytes (pointer). That is why recursive types compile.',
    interview:'"Box stores data on the heap. In recursive types, Rust cannot know size at compile time. Box solves this because its size is always fixed — just a pointer."',
    basic:`enum List {
    Cons(i32, Box<List>),  // Box size = 8 bytes
    Nil,
}
let list = List::Cons(1, Box::new(List::Cons(2, Box::new(List::Nil))));

// Return trait object
fn make_animal(kind: &str) -> Box<dyn std::fmt::Debug> {
    Box::new(format!("I am a {}", kind))
}`,
    advanced:`// Deref coercion — Box<T> behaves like &T
let x = 5;
let y = Box::new(x);
assert_eq!(5, *y);

// Custom Deref
use std::ops::Deref;
struct MyBox<T>(T);
impl<T> Deref for MyBox<T> {
    type Target = T;
    fn deref(&self) -> &T { &self.0 }
}`
  },
  {
    name:'Option<T>', cat:'error',
    when:'Value might be absent. Null replacement. Function might not find a result.',
    avoid:'When value is always present — Option adds unnecessary noise.',
    tip:'Chain .map(), .and_then(), .unwrap_or() — avoid nested match when possible.',
    interview:'"Option is Rust\'s null replacement. The compiler forces you to handle both Some and None — null pointer exceptions are impossible at compile time."',
    basic:`fn find_user(id: u32) -> Option<String> {
    if id == 1 { Some("Alice".to_string()) } else { None }
}
if let Some(name) = find_user(1) {
    println!("Found: {}", name);
}`,
    advanced:`// Chaining
let upper = find_user(1)
    .map(|n| n.to_uppercase())
    .filter(|n| n.starts_with('A'))
    .unwrap_or_else(|| "GUEST".into());

// ? in Option-returning functions
fn get_first(v: &[i32]) -> Option<i32> {
    let first = v.first()?;  // returns None if empty
    Some(*first * 2)
}`
  },
  {
    name:'Result<T,E>', cat:'error',
    when:'Operation might fail — IO, parsing, network. Propagate errors up.',
    avoid:'When failure is impossible — unwrap() is fine in tests and scripts.',
    tip:'? operator propagates automatically. thiserror for libraries, anyhow for apps.',
    interview:'"Result is Rust\'s exception replacement. You cannot ignore a Result — the compiler warns you. This forces explicit error handling everywhere."',
    basic:`fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 { Err("division by zero".to_string()) }
    else { Ok(a / b) }
}
match divide(10.0, 2.0) {
    Ok(result) => println!("{}", result),
    Err(e) => println!("Error: {}", e),
}`,
    advanced:`// ? propagates error
fn read_config(path: &str) -> Result<String, std::io::Error> {
    let content = std::fs::read_to_string(path)?;
    Ok(content.trim().to_string())
}

// thiserror custom errors
#[derive(Debug, thiserror::Error)]
enum AppError {
    #[error("io error: {0}")] Io(#[from] std::io::Error),
    #[error("parse error: {0}")] Parse(String),
}`
  },
  {
    name:'Iterators', cat:'functional',
    when:'Process collections — filter, transform, aggregate.',
    avoid:'Complex multi-step mutations with early returns — for loop is more readable.',
    tip:'Iterators are lazy — nothing runs until collect() or a terminal method.',
    interview:'"Rust iterators are lazy zero-cost abstractions. The compiler often optimizes a chain of .map().filter() to be as fast as a hand-written loop."',
    basic:`let nums = vec![1,2,3,4,5,6];
let result: Vec<i32> = nums.iter()
    .filter(|&&x| x % 2 == 0)
    .map(|&x| x * x)
    .collect();   // [4, 16, 36]

// .iter() = &T, .iter_mut() = &mut T, .into_iter() = T`,
    advanced:`// Custom iterator
impl Iterator for Counter {
    type Item = u32;
    fn next(&mut self) -> Option<u32> {
        if self.count < self.max { self.count += 1; Some(self.count) }
        else { None }
    }
}
// zip, flat_map, chain, enumerate, peekable
let pairs: Vec<_> = (1..=3).zip(["a","b","c"]).collect();`
  },
  {
    name:'Concurrency', cat:'async',
    when:'Parallel CPU work, shared mutable state across threads, message passing.',
    avoid:'IO-bound work — use async instead. Single-threaded code.',
    tip:'Send and Sync are marker traits — compiler checks automatically. Rc is not Send.',
    interview:'"Rust prevents data races at compile time. If a type is not Send, the compiler rejects moving it to another thread. These are compile-time guarantees, not runtime checks."',
    basic:`use std::sync::{Arc, Mutex};
use std::thread;

let data = Arc::new(Mutex::new(vec![]));
let mut handles = vec![];
for i in 0..5 {
    let d = Arc::clone(&data);
    handles.push(thread::spawn(move || {
        d.lock().unwrap().push(i);
    }));
}
for h in handles { h.join().unwrap(); }`,
    advanced:`use std::sync::{Arc, RwLock};

// RwLock — many readers OR one writer
let cache = Arc::new(RwLock::new(std::collections::HashMap::<String,String>::new()));
let r = cache.read().unwrap();   // many concurrent reads
drop(r);
cache.write().unwrap().insert("key".into(), "val".into());`
  },
  {
    name:'Async / Await', cat:'async',
    when:'IO-bound work — network, file, database. Many concurrent connections.',
    avoid:'CPU-bound work — async does not parallelize compute. Use threads or rayon.',
    tip:'async fn returns a Future — it does nothing until .awaited.',
    interview:'"Async in Rust is zero-cost. async fn compiles to a state machine — no heap allocation per future by default. .await suspends the task and yields the thread."',
    basic:`#[tokio::main]
async fn main() {
    let result = fetch_data().await;
    println!("{}", result);
}
async fn fetch_data() -> String {
    tokio::time::sleep(std::time::Duration::from_millis(100)).await;
    "data".to_string()
}
// Concurrent (not sequential):
let (a, b) = tokio::join!(fetch_data(), fetch_data());`,
    advanced:`use tokio::sync::{mpsc, Mutex};
use std::sync::Arc;

// Use tokio::sync::Mutex in async, NOT std::sync::Mutex
let state = Arc::new(Mutex::new(0u32));

// select! — race multiple futures
tokio::select! {
    val = fetch_data() => println!("got: {}", val),
    _ = tokio::time::sleep(std::time::Duration::from_secs(1)) => {
        println!("timeout");
    }
}`
  },
  {
    name:'Unsafe Rust', cat:'advanced',
    when:'FFI (calling C code), performance-critical low-level ops, custom allocators.',
    avoid:'Anything safe Rust can express. Unsafe is not for avoiding the borrow checker.',
    tip:'unsafe unlocks 5 specific capabilities. Borrow checker still runs inside unsafe blocks.',
    interview:'"unsafe unlocks five capabilities: deref raw pointers, call unsafe functions, access mutable statics, implement unsafe traits, read union fields. The borrow checker still runs — you are promising what it cannot verify."',
    basic:`// 1. Dereference raw pointer
let x = 5;
let r = &x as *const i32;
unsafe { println!("{}", *r); }

// 2. Call unsafe function
unsafe fn dangerous() { println!("danger"); }
unsafe { dangerous(); }

// 3. Mutable static
static mut COUNTER: u32 = 0;
unsafe { COUNTER += 1; }`,
    advanced:`// Safe abstraction over unsafe internals
pub fn split_at_mut(slice: &mut [i32], mid: usize)
    -> (&mut [i32], &mut [i32])
{
    assert!(mid <= slice.len());
    let ptr = slice.as_mut_ptr();
    unsafe {
        (std::slice::from_raw_parts_mut(ptr, mid),
         std::slice::from_raw_parts_mut(ptr.add(mid), slice.len()-mid))
    }
    // safe: two non-overlapping slices, both in bounds
}`
  },
];

const PROGRAMS = [
  {title:'Struct + Methods + Self',cats:['Struct','impl','&self','&mut self'],
   code:`struct User { username: String, active: bool }
impl User {
    fn new(username: &str) -> Self {
        Self { username: username.to_string(), active: true }
    }
    fn display(&self) { println!("{}: {}", self.username, self.active); }
    fn deactivate(&mut self) { self.active = false; }
}
fn main() {
    let mut u = User::new("Divyank");
    u.display();
    u.deactivate();
    u.display();
}`,done:false},
  {title:'Generics + Traits',cats:['trait','Generics<T>','impl Trait'],
   code:`trait Summary { fn summarize(&self) -> String; }
struct Tweet { user: String, content: String }
impl Summary for Tweet {
    fn summarize(&self) -> String { format!("{}: {}", self.user, self.content) }
}
fn notify<T: Summary>(item: &T) {
    println!("Breaking: {}", item.summarize());
}`,done:false},
  {title:'Box — Enum LinkedList',cats:['Box<T>','recursive','enum'],
   code:`#[derive(Debug)]
enum List { Cons(i32, Box<List>), Nil }
use List::{Cons, Nil};
fn main() {
    let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));
    println!("{:?}", list);
}`,done:false},
  {title:'Box — Struct LinkedList',cats:['Box<T>','Option<Box<T>>','prepend'],
   code:`#[derive(Debug)]
struct Node<T> { value: T, next: Option<Box<Node<T>>> }
impl<T> Node<T> {
    fn new(value: T) -> Self { Self { value, next: None } }
    fn prepend(self, value: T) -> Self {
        Self { value, next: Some(Box::new(self)) }
    }
}
fn main() {
    let head = Node::new(10).prepend(20).prepend(30);
    println!("{:#?}", head);
}`,done:false},
  {title:'Binary Tree (Generics + Box)',cats:['Box<T>','Generics<T>','recursive'],
   code:`#[derive(Debug)]
struct TreeNode<T> {
    value: T,
    left: Option<Box<TreeNode<T>>>,
    right: Option<Box<TreeNode<T>>>,
}
impl<T> TreeNode<T> {
    fn new(v: T) -> Self { Self { value: v, left: None, right: None } }
}`,done:false},
  {title:'Option + Match + Type Alias',cats:['Option<T>','match','type alias'],
   code:`type ID = u32;
fn find_user(id: ID) -> Option<String> {
    if id == 1 { Some("Alice".to_string()) } else { None }
}
fn main() {
    match find_user(2) {
        Some(name) => println!("Found: {}", name),
        None => println!("Not found"),
    }
}`,done:false},
  {title:'Iterators + Closures',cats:['iter()','filter()','map()','collect()'],
   code:`fn main() {
    let numbers = vec![1,2,3,4,5,6,7,8];
    let even_squares: Vec<i32> = numbers
        .into_iter()
        .filter(|x| x % 2 == 0)
        .map(|x| x * x)
        .collect();
    println!("{:?}", even_squares); // [4,16,36,64]
}`,done:false},
  {title:'Custom Iterator',cats:['Iterator trait','type Item','next()'],
   code:`struct Counter { count: u32, max: u32 }
impl Counter { fn new(max: u32) -> Self { Self { count: 0, max } } }
impl Iterator for Counter {
    type Item = u32;
    fn next(&mut self) -> Option<u32> {
        if self.count < self.max { self.count += 1; Some(self.count) }
        else { None }
    }
}
fn main() {
    Counter::new(5).for_each(|v| println!("{}", v));
}`,done:false},
  {title:'Box<dyn Trait> — Dynamic Dispatch',cats:['dyn Trait','vtable','polymorphism'],
   code:`trait Component { fn render(&self); }
struct Button { text: String }
impl Component for Button {
    fn render(&self) { println!("Button: {}", self.text); }
}
fn main() {
    let components: Vec<Box<dyn Component>> = vec![
        Box::new(Button { text: "Submit".into() }),
    ];
    for c in &components { c.render(); }
}`,done:false},
  {title:'Rc<T> — Shared Ownership',cats:['Rc<T>','Rc::clone','strong_count'],
   code:`use std::rc::Rc;
struct Config { env: String }
fn main() {
    let config = Rc::new(Config { env: "prod".into() });
    let worker1 = Rc::clone(&config);
    let worker2 = Rc::clone(&config);
    println!("{}", worker1.env);
    println!("refs: {}", Rc::strong_count(&config)); // 3
}`,done:false},
  {title:'Arc<Mutex<T>> — Thread-Safe Counter',cats:['Arc<T>','Mutex','thread::spawn'],
   code:`use std::sync::{Arc, Mutex};
use std::thread;
fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    for _ in 0..10 {
        let c = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            *c.lock().unwrap() += 1;
        }));
    }
    for h in handles { h.join().unwrap(); }
    println!("Result: {}", *counter.lock().unwrap()); // 10
}`,done:false},
  {title:'mpsc Channels — Producer/Consumer',cats:['mpsc','Sender','Receiver'],
   code:`use std::sync::mpsc;
use std::thread;
fn main() {
    let (tx, rx) = mpsc::channel();
    let tx2 = tx.clone();
    thread::spawn(move || tx.send("from thread 1").unwrap());
    thread::spawn(move || tx2.send("from thread 2").unwrap());
    for msg in rx.iter().take(2) { println!("got: {}", msg); }
}`,done:false},
  {title:'Result + ? Operator',cats:['Result<T,E>','? operator','error propagation'],
   code:`use std::num::ParseIntError;
fn double(s: &str) -> Result<i32, ParseIntError> {
    let n = s.trim().parse::<i32>()?;  // ? propagates on error
    Ok(n * 2)
}
fn main() {
    match double("21") {
        Ok(v) => println!("doubled: {}", v),
        Err(e) => println!("error: {}", e),
    }
}`,done:false},
  {title:'Lifetimes — Longest String',cats:["lifetime 'a",'borrow checker','dangling ref'],
   code:`fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
fn main() {
    let s1 = String::from("long string");
    let result;
    {
        let s2 = String::from("xyz");
        result = longest(s1.as_str(), s2.as_str());
        println!("{}", result);
    }
}`,done:false},
  {title:'Closures — Fn / FnMut / FnOnce',cats:['Fn','FnMut','FnOnce','move ||'],
   code:`fn apply<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 { f(x) }
fn apply_mut<F: FnMut() -> i32>(mut f: F) -> i32 { f() }

fn main() {
    let offset = 10;
    let add = |x| x + offset;        // Fn — borrows offset
    println!("{}", apply(add, 5));    // 15

    let mut count = 0;
    let mut inc = || { count += 1; count };  // FnMut
    println!("{}", apply_mut(&mut inc));     // 1

    let text = String::from("hello");
    let consume = move || println!("{}", text); // FnOnce
    consume();
}`,done:false},
];

const DSA_PATTERNS = [
  {name:'Two Pointers', probs:[
    {n:'Pair with Target Sum',u:'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/'},
    {n:'Rearrange 0 and 1',u:'https://www.geeksforgeeks.org/problems/segregate-0s-and-1s5106/1'},
    {n:'Remove Duplicates',u:'https://leetcode.com/problems/remove-duplicates-from-sorted-array/'},
    {n:'Squares of Sorted Array',u:'https://leetcode.com/problems/squares-of-a-sorted-array/'},
    {n:'3Sum',u:'https://leetcode.com/problems/3sum/'},
    {n:'3Sum Closest',u:'https://leetcode.com/problems/3sum-closest/'},
    {n:'Subarray Product < K',u:'https://leetcode.com/problems/subarray-product-less-than-k/'},
    {n:'Sort Colors (Dutch Flag)',u:'https://leetcode.com/problems/sort-colors/'},
    {n:'4Sum',u:'https://leetcode.com/problems/4sum/'},
    {n:'Backspace String Compare',u:'https://leetcode.com/problems/backspace-string-compare/'},
    {n:'Shortest Unsorted Subarray',u:'https://leetcode.com/problems/shortest-unsorted-continuous-subarray/'},
  ]},
  {name:'Fast & Slow Pointers', probs:[
    {n:'Linked List Cycle',u:'https://leetcode.com/problems/linked-list-cycle/'},
    {n:'Linked List Cycle II',u:'https://leetcode.com/problems/linked-list-cycle-ii/'},
    {n:'Happy Number',u:'https://leetcode.com/problems/happy-number/'},
    {n:'Find Duplicate Number',u:'https://leetcode.com/problems/find-the-duplicate-number/'},
    {n:'Middle of LinkedList',u:'https://leetcode.com/problems/middle-of-the-linked-list/'},
    {n:'Palindrome LinkedList',u:'https://leetcode.com/problems/palindrome-linked-list/'},
    {n:'Reorder List',u:'https://leetcode.com/problems/reorder-list/'},
    {n:'Circular Array Loop',u:'https://leetcode.com/problems/circular-array-loop/'},
  ]},
  {name:'Sliding Window', probs:[
    {n:'Max Sum Subarray Size K',u:'https://www.geeksforgeeks.org/problems/max-sum-subarray-of-size-k5313/1'},
    {n:'Min Size Subarray Sum',u:'https://leetcode.com/problems/minimum-size-subarray-sum/'},
    {n:'Longest K Distinct Chars',u:'https://www.geeksforgeeks.org/problems/longest-k-unique-characters-substring0853/1'},
    {n:'Fruits into Baskets',u:'https://leetcode.com/problems/fruit-into-baskets/'},
    {n:'Longest Substring No Repeat',u:'https://leetcode.com/problems/longest-substring-without-repeating-characters/'},
    {n:'Longest Repeating Char Replace',u:'https://leetcode.com/problems/longest-repeating-character-replacement/'},
    {n:'Max Consecutive Ones III',u:'https://leetcode.com/problems/max-consecutive-ones-iii/'},
    {n:'Minimum Window Substring',u:'https://leetcode.com/problems/minimum-window-substring/'},
    {n:'Permutation in String',u:'https://leetcode.com/problems/permutation-in-string/'},
  ]},
  {name:'Kadane / Prefix Sum', probs:[
    {n:'Maximum Subarray',u:'https://leetcode.com/problems/maximum-subarray/'},
    {n:'Maximum Product Subarray',u:'https://leetcode.com/problems/maximum-product-subarray/'},
    {n:'Maximum Sum Circular Subarray',u:'https://leetcode.com/problems/maximum-sum-circular-subarray/'},
    {n:'Subarray Sum Equals K',u:'https://leetcode.com/problems/subarray-sum-equals-k/'},
    {n:'Find Pivot Index',u:'https://leetcode.com/problems/find-pivot-index/'},
    {n:'Subarray Sums Divisible by K',u:'https://leetcode.com/problems/subarray-sums-divisible-by-k/'},
    {n:'Contiguous Array',u:'https://leetcode.com/problems/contiguous-array/'},
  ]},
  {name:'Binary Search', probs:[
    {n:'Binary Search',u:'https://leetcode.com/problems/binary-search/'},
    {n:'First and Last Position',u:'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/'},
    {n:'Peak Index in Mountain',u:'https://leetcode.com/problems/peak-index-in-a-mountain-array/'},
    {n:'Find Peak Element',u:'https://leetcode.com/problems/find-peak-element/'},
    {n:'Find Min in Rotated Array',u:'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/'},
    {n:'Search in Rotated Array',u:'https://leetcode.com/problems/search-in-rotated-sorted-array/'},
    {n:'Koko Eating Bananas',u:'https://leetcode.com/problems/koko-eating-bananas/'},
    {n:'Min Days to Make Bouquets',u:'https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/'},
    {n:'Aggressive Cows',u:'https://www.geeksforgeeks.org/problems/aggressive-cows/1'},
    {n:'Capacity to Ship in D Days',u:'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/'},
    {n:'Split Array Largest Sum',u:'https://leetcode.com/problems/split-array-largest-sum/'},
    {n:'Search 2D Matrix',u:'https://leetcode.com/problems/search-a-2d-matrix/'},
    {n:'Kth Smallest in Sorted Matrix',u:'https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/'},
    {n:'Median of Two Sorted Arrays',u:'https://leetcode.com/problems/median-of-two-sorted-arrays/'},
  ]},
  {name:'Stack', probs:[
    {n:'Valid Parentheses',u:'https://leetcode.com/problems/valid-parentheses/'},
    {n:'Next Greater Element II',u:'https://leetcode.com/problems/next-greater-element-ii/'},
    {n:'Daily Temperatures',u:'https://leetcode.com/problems/daily-temperatures/'},
    {n:'Remove Adjacent Duplicates',u:'https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/'},
    {n:'Remove Adjacent Duplicates II',u:'https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/'},
    {n:'Remove K Digits',u:'https://leetcode.com/problems/remove-k-digits/'},
  ]},
  {name:'Heap / Priority Queue', probs:[
    {n:'Kth Largest Element',u:'https://leetcode.com/problems/kth-largest-element-in-an-array/'},
    {n:'Top K Frequent Elements',u:'https://leetcode.com/problems/top-k-frequent-elements/'},
    {n:'K Closest Points to Origin',u:'https://leetcode.com/problems/k-closest-points-to-origin/'},
    {n:'Merge K Sorted Arrays',u:'https://www.geeksforgeeks.org/problems/merge-k-sorted-arrays/1'},
    {n:'Find Median from Data Stream',u:'https://leetcode.com/problems/find-median-from-data-stream/'},
    {n:'Last Stone Weight',u:'https://leetcode.com/problems/last-stone-weight/'},
    {n:'Task Scheduler',u:'https://leetcode.com/problems/task-scheduler/'},
    {n:'Reorganize String',u:'https://leetcode.com/problems/reorganize-string/'},
    {n:'Sliding Window Median',u:'https://leetcode.com/problems/sliding-window-median/'},
  ]},
  {name:'Trees (BFS/DFS)', probs:[
    {n:'Inorder Traversal',u:'https://leetcode.com/problems/binary-tree-inorder-traversal/'},
    {n:'Level Order Traversal',u:'https://leetcode.com/problems/binary-tree-level-order-traversal/'},
    {n:'Zigzag Level Order',u:'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/'},
    {n:'Max Depth',u:'https://leetcode.com/problems/maximum-depth-of-binary-tree/'},
    {n:'Invert Tree',u:'https://leetcode.com/problems/invert-binary-tree/'},
    {n:'Symmetric Tree',u:'https://leetcode.com/problems/symmetric-tree/'},
    {n:'LCA of Binary Tree',u:'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/'},
    {n:'LCA of BST',u:'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/'},
    {n:'Kth Smallest in BST',u:'https://leetcode.com/problems/kth-smallest-element-in-a-bst/'},
    {n:'Validate BST',u:'https://leetcode.com/problems/validate-binary-search-tree/'},
    {n:'Diameter of Binary Tree',u:'https://leetcode.com/problems/diameter-of-binary-tree/'},
    {n:'Binary Tree Max Path Sum',u:'https://leetcode.com/problems/binary-tree-maximum-path-sum/'},
  ]},
  {name:'Backtracking', probs:[
    {n:'Generate Parentheses',u:'https://leetcode.com/problems/generate-parentheses/'},
    {n:'Letter Combinations Phone',u:'https://leetcode.com/problems/letter-combinations-of-a-phone-number/'},
    {n:'Permutations',u:'https://leetcode.com/problems/permutations/'},
    {n:'Combination Sum',u:'https://leetcode.com/problems/combination-sum/'},
    {n:'Palindrome Partitioning',u:'https://leetcode.com/problems/palindrome-partitioning/'},
  ]},
  {name:'Graphs', probs:[
    {n:'Graph DFS',u:'https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1'},
    {n:'Graph BFS',u:'https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1'},
    {n:'Number of Islands',u:'https://leetcode.com/problems/number-of-islands/'},
  ]},
];

const OS_CONCEPTS = [
  {
    name:'Process vs Thread vs Task',
    def:'Process = isolated program with own memory space. Thread = lightweight execution unit sharing process memory. Task (green thread) = userspace cooperative unit managed by Tokio.',
    when:'Process: isolation needed. Thread: CPU-bound parallelism. Task: IO-bound concurrency, thousands cheaply.',
    avoid:'Avoid OS threads for IO-bound work — 1MB stack, expensive context switch. Avoid async for CPU-bound.',
    tip:'Cost order: Process > Thread > Task. A process can have many threads. A thread can have many async tasks.',
    interview:'"A process has isolated memory. Threads share memory — faster but data race risk. Async tasks are lighter — many run on few OS threads cooperatively."',
    code:`// Process — isolated
std::process::Command::new("snarkjs").spawn();

// Thread — shared memory, CPU parallelism
std::thread::spawn(|| ntt_forward(&mut poly));

// Async task — IO concurrency, ~KB overhead
tokio::spawn(async { fetch_proof().await });`
  },
  {
    name:'Parallelism vs Concurrency',
    def:'Concurrency = dealing with many things at once (structure). Parallelism = doing many things simultaneously (execution). You can have concurrency on one core (async). Parallelism needs multiple cores.',
    when:'Concurrency: many IO tasks, event handling, web servers. Parallelism: CPU-intensive — NTT, MSM, FFT.',
    avoid:'Do not add threads to IO-bound code for speed. Do not use async for CPU-bound parallel work.',
    tip:'Rob Pike: "Concurrency is about structure, parallelism is about execution." Tokio = concurrency. Rayon = parallelism.',
    interview:'"Async gives concurrency — structure. Threads give parallelism — actual simultaneous execution. ZK proof generation needs both: Tokio for concurrent requests, Rayon for parallel NTT."',
    code:`// Concurrency — one thread, many tasks interleaved
tokio::join!(fetch(1), fetch(2), fetch(3));

// Parallelism — multiple threads simultaneous
polys.par_iter_mut().for_each(|p| ntt_forward(p));`
  },
  {
    name:'Scheduling: Preemptive vs Cooperative',
    def:'Preemptive: OS forcefully switches threads at any time (timer interrupt). Cooperative: task voluntarily yields at defined points (.await). OS threads are preemptive. Async tasks are cooperative.',
    when:'Preemptive: cannot modify code to add yield points. Cooperative: control the code, add .await at IO boundaries.',
    avoid:'Never do CPU-heavy work inside cooperative task without yielding — starves other tasks.',
    tip:'tokio::task::yield_now().await — manually yield in long CPU loops. spawn_blocking for work that cannot yield.',
    interview:'"OS threads are preemptively scheduled — OS can switch at any instruction. Async tasks yield only at .await points. Blocking inside async starves the runtime: task never reaches an await."',
    code:`// GOOD — yield periodically
async fn good_compute() {
    for i in 0..10_000_000 {
        work(i);
        if i % 1000 == 0 { tokio::task::yield_now().await; }
    }
}
// BEST — offload to blocking pool
async fn best() {
    tokio::task::spawn_blocking(|| heavy_work()).await.unwrap();
}`
  },
  {
    name:'Stack vs Heap Memory',
    def:'Stack: contiguous LIFO, fast allocation (move pointer), fixed-size, auto freed on scope exit. Heap: dynamic allocation, any order, slower (malloc/free), variable-size, managed by Drop in Rust.',
    when:'Stack: small fixed-size data, Copy types, local variables. Heap: large data, dynamic-size, data outliving creator.',
    avoid:'Never put large arrays on stack — overflow risk. Default stack is 8MB on Linux. ZK witness files must go on heap.',
    tip:'Stack allocation is just a register increment — essentially free. Box<T> = one heap allocation.',
    interview:'"Stack allocation is a register increment — free. Heap involves the allocator finding a free block — much slower. Rust gives you control: stack by default, heap with Box/Vec only when needed."',
    code:`// Stack — fixed, auto freed
let arr = [0u8; 64];  // 64 bytes on stack

// Heap — dynamic, Drop frees
let v = Vec::with_capacity(1_000_000);  // heap allocation

// ZK: large witness on heap
let witness = std::fs::read("witness.wtns").unwrap(); // 100MB+ → heap`
  },
  {
    name:'Synchronization Primitives',
    def:'Mutex: exclusive access — one at a time. RwLock: many concurrent readers OR one exclusive writer. Semaphore: limit N concurrent accesses. Barrier: synchronize N threads at checkpoint.',
    when:'Mutex: write-heavy. RwLock: read-heavy config/cache. Semaphore: limit GPU provers. Barrier: sync NTT stages.',
    avoid:'Do not hold Mutex across .await — use tokio::sync::Mutex. Do not use Mutex for message passing — use channels.',
    tip:'Lock granularity matters: one big Mutex = simple but slow. Many small Mutexes = faster but deadlock risk.',
    interview:'"Mutex is one owner at a time. RwLock is smarter for read-heavy workloads. Semaphore limits concurrency to N. For a ZK proof service, I would use Semaphore to limit concurrent GPU prover instances."',
    code:`use tokio::sync::Semaphore;
use std::sync::Arc;

const MAX_GPU_PROVERS: usize = 4;
let sem = Arc::new(Semaphore::new(MAX_GPU_PROVERS));

async fn prove(witness: Vec<u8>, sem: Arc<Semaphore>) {
    let _permit = sem.acquire().await.unwrap();
    // at most 4 here simultaneously
    run_gpu_prover(witness).await;
    // permit auto-released on drop
}`
  },
  {
    name:'Cache Locality & False Sharing',
    def:'Cache miss: CPU needs data not in L1/L2/L3 — costs 100-300ns vs 1-5ns in cache. False sharing: two threads modify different variables on same 64-byte cache line — causes unnecessary cache invalidation.',
    when:'Cache locality matters in ZK provers — NTT, MSM process large arrays. False sharing matters in parallel accumulators.',
    avoid:'Never access random memory in hot loops — causes cache thrashing. Never put parallel-written counters on same cache line.',
    tip:'ZK optimization: process polynomial coefficients sequentially. Align data to 64-byte cache lines. Use SIMD for multiple field elements per instruction.',
    interview:'"Cache locality is often more important than algorithmic complexity. A cache-friendly O(n²) can beat a cache-unfriendly O(n log n) for moderate n. In NTT, the butterfly accesses memory non-sequentially — data layout is critical."',
    code:`// Cache-friendly: sequential access
fn sum_seq(data: &[u64]) -> u64 { data.iter().sum() }

// False sharing — bad
struct Bad { a: u64, b: u64 } // same 64-byte cache line

// Fixed: pad to separate cache lines
#[repr(align(64))]
struct Good { val: u64, _pad: [u8; 56] }`
  },
];

const DB_CONCEPTS = [
  {
    name:'ACID Transactions',
    def:'Atomicity: all-or-nothing. Consistency: DB moves between valid states. Isolation: concurrent txns do not interfere. Durability: committed data survives crashes.',
    when:'Financial systems, compliance records, multi-step atomic operations.',
    avoid:'ACID adds overhead — for read-heavy analytics consider eventual consistency (BASE).',
    tip:'Isolation levels: READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE. Higher = fewer anomalies but more locking.',
    interview:'"In Z-RWA, minting a compliance token needs atomicity — either the KYC proof is verified AND token minted, or neither. A partial state violates compliance."',
    code:`// Rust with sqlx — atomic KYC + token mint
let mut tx = pool.begin().await?;
sqlx::query!("INSERT INTO kyc_verifications ...").execute(&mut tx).await?;
sqlx::query!("UPDATE token_balances ...").execute(&mut tx).await?;
tx.commit().await?;  // atomic — both or neither`
  },
  {
    name:'Indexes & Query Performance',
    def:'Index: B-Tree or Hash structure to find rows without full table scan. B-Tree: sorted, supports range queries. Hash: equality only. Composite: covers multiple columns — column order matters.',
    when:'Index on WHERE, JOIN, ORDER BY columns and all foreign keys.',
    avoid:'Do not index every column — slows writes. LIKE \'%text%\' cannot use index. LIKE \'text%\' can.',
    tip:'EXPLAIN ANALYZE is your best friend. Partial index for sparse conditions. pg_stat_user_indexes to find unused indexes.',
    interview:'"A B-Tree index is like a phone book — sorted, so finding a range is O(log n). Without index, every query is full table scan O(n)."',
    code:`-- Create targeted indexes
CREATE INDEX idx_proofs_user ON proofs(user_id);
CREATE INDEX idx_proofs_time ON proofs(verified_at DESC);

-- Explain query plan
EXPLAIN ANALYZE
SELECT * FROM proofs WHERE user_id = 42;
-- Look for: "Index Scan" (good) vs "Seq Scan" (bad)`
  },
  {
    name:'N+1 Problem',
    def:'N+1 happens when you fetch N records then make N additional queries for related data — N+1 total round trips. For 100 users, fetching their proofs individually = 101 DB round trips instead of 1 JOIN.',
    when:'Any time you have a loop that queries inside — classic ORM/Rust pattern.',
    avoid:'Never query inside a for loop over results. Never SELECT * in production.',
    tip:'Cursor-based pagination: WHERE id > last_id LIMIT 20 — O(log n). OFFSET pagination — O(n), scans everything.',
    interview:'"N+1 is subtle — it looks fine in code but devastates performance. 100 users × 1 query each = 101 round trips. One JOIN returns the same data in 1 round trip."',
    code:`// N+1 PROBLEM — bad
let users = get_users().await;
for user in &users {
    let proofs = get_proofs(user.id).await; // 100 extra queries
}

// FIX — one JOIN
let rows = sqlx::query!(
    "SELECT u.id, p.proof_hash FROM users u
     LEFT JOIN proofs p ON p.user_id = u.id"
).fetch_all(&pool).await?;`
  },
  {
    name:'Connection Pooling',
    def:'Connection pooling maintains pre-created DB connections and reuses them. Creating a new connection costs 50-200ms. A pool of 10-20 connections serves hundreds of requests efficiently.',
    when:'Any production application. Especially critical for web servers with concurrent requests.',
    avoid:'Never create new connection per request — exhausts DB connection limit (PostgreSQL default: 100).',
    tip:'Pool size formula: (CPU cores × 2) + spindles. For 4-core SSD server: ~10 connections.',
    interview:'"Each Postgres connection costs a backend process. Connection pooling reuses pre-created connections. In Z-RWA, sqlx PgPool is the connection pool — clone cheaply, returns on drop."',
    code:`use sqlx::postgres::PgPoolOptions;

let pool = PgPoolOptions::new()
    .max_connections(20)
    .min_connections(5)
    .acquire_timeout(std::time::Duration::from_secs(3))
    .connect(DATABASE_URL).await?;

// Clone cheaply — Arc internally
async fn query(pool: sqlx::PgPool) {
    // acquires connection, returns on drop
    sqlx::query!("SELECT 1").fetch_one(&pool).await?;
}`
  },
  {
    name:'CAP Theorem',
    def:'Distributed system can guarantee at most two of: Consistency, Availability, Partition tolerance. Since partitions always occur, choose CP or AP. CP: consistent + partition tolerant. AP: available + partition tolerant.',
    when:'CP: financial systems, compliance records — correctness critical. AP: social feeds, analytics, caches.',
    avoid:'CAP is about distributed systems — single-node DBs are not subject to it.',
    tip:'CP databases: PostgreSQL, etcd. AP databases: DynamoDB, Cassandra. Modern systems offer tunable consistency.',
    interview:'"For Z-RWA compliance records, I choose CP. If two nodes disagree on KYC status, I must be consistent — stale data = compliance violation. I accept occasional unavailability over incorrect state."',
    code:`-- CP: PostgreSQL sync replication
-- Write returns only after all replicas confirm
-- Strong consistency, possible timeout during partition

-- AP: DynamoDB eventual consistency
-- Write returns immediately, reads may be stale

-- For Z-RWA: compliance status = CP
-- For Z-RWA: analytics/stats = AP acceptable`
  },
];

const RUST_QA = [
  {cat:'Ownership',difficulty:'Basic',q:'What is ownership in Rust and why does it exist?',
   a:'Ownership means each value has exactly one owner. When the owner goes out of scope, the value is automatically freed — no garbage collector needed. This eliminates memory leaks and use-after-free bugs at compile time with zero runtime overhead.',
   code:`let s1 = String::from("hello");
let s2 = s1;  // s1 MOVED to s2
// println!("{}", s1); // ERROR: moved
// When s2 goes out of scope → memory freed automatically`},
  {cat:'Borrowing',difficulty:'Basic',q:'Explain the borrowing rules in Rust.',
   a:'Rule 1: you can have any number of immutable references (&T) simultaneously. Rule 2: you can have exactly one mutable reference (&mut T) at a time. Rule 3: you cannot have both at the same time. These rules prevent all data races at compile time.',
   code:`let mut s = String::from("hello");
let r1 = &s;     // OK — immutable borrow
let r2 = &s;     // OK — second immutable borrow
// let r3 = &mut s; // ERROR: cannot borrow mutably while immutably borrowed
println!("{} {}", r1, r2);
let r3 = &mut s; // OK — r1, r2 no longer used above`},
  {cat:'Smart Pointers',difficulty:'Intermediate',q:'What is the difference between Rc and RefCell? Can you combine them?',
   a:'Rc gives shared ownership — multiple parts of code can own the same data. RefCell gives interior mutability — mutation through a shared reference with runtime borrow checking. Combined as Rc<RefCell<T>>, you get shared mutable data on a single thread. Common for graph nodes.',
   code:`use std::rc::Rc;
use std::cell::RefCell;
let shared = Rc::new(RefCell::new(vec![1, 2, 3]));
let a = Rc::clone(&shared);
let b = Rc::clone(&shared);
a.borrow_mut().push(4);      // mutate through 'a'
println!("{:?}", b.borrow()); // [1, 2, 3, 4] — b sees it`},
  {cat:'Smart Pointers',difficulty:'Advanced',q:'What is Weak<T> and when do you use it?',
   a:'Weak is a non-owning reference to Rc/Arc data. It does not prevent the value from being dropped. Weak::upgrade() returns Option<Rc<T>> — None if data was already freed. Use it to break reference cycles in graphs/trees where a child needs a back-pointer to parent.',
   code:`use std::rc::{Rc, Weak};
use std::cell::RefCell;
struct Node { val: i32, parent: RefCell<Weak<Node>> }
let parent = Rc::new(Node { val: 1, parent: RefCell::new(Weak::new()) });
let child = Rc::new(Node { val: 2, parent: RefCell::new(Rc::downgrade(&parent)) });
if let Some(p) = child.parent.borrow().upgrade() {
    println!("parent: {}", p.val); // 1
}`},
  {cat:'Concurrency',difficulty:'Intermediate',q:'What are Send and Sync? Give an example of a type that is neither.',
   a:'Send means it is safe to transfer ownership of T to another thread. Sync means it is safe to share &T across threads. Rc<T> is neither — its reference count is not atomic. Moving Rc across threads would cause data races on the count.',
   code:`use std::rc::Rc;
let rc = Rc::new(5);
// thread::spawn(move || println!("{}", rc)); // ERROR: Rc is not Send

use std::sync::Arc;
let arc = Arc::new(5);
std::thread::spawn(move || println!("{}", arc)); // OK: Arc is Send+Sync`},
  {cat:'Async',difficulty:'Intermediate',q:'What does .await actually do?',
   a:'.await checks if a Future is ready via poll(). If Poll::Ready — returns value. If Poll::Pending — suspends the current task as a state machine and returns control to the runtime. Runtime runs other tasks. When future is ready, runtime wakes the task and resumes from exact point of suspension.',
   code:`async fn fetch() -> String {
    // HERE: task suspends, thread is FREE to run other tasks
    tokio::time::sleep(std::time::Duration::from_millis(100)).await;
    // HERE: runtime wakes task, resumes execution
    "data".to_string()
}
// Sequential ~200ms vs Concurrent ~100ms:
let (a, b) = tokio::join!(fetch(), fetch());`},
  {cat:'Async',difficulty:'Advanced',q:'Why can you not use std::sync::Mutex inside async code?',
   a:'std::sync::Mutex blocks the OS thread while waiting. Inside an async runtime, blocking a thread prevents other async tasks from running on that thread — it starves the runtime. Use tokio::sync::Mutex — it suspends the current task while waiting, freeing the thread.',
   code:`// WRONG — blocks the async thread
// let _guard = std::sync::Mutex::new(0).lock().unwrap();
// some_future.await; // runtime starved!

// CORRECT — async-aware mutex
use tokio::sync::Mutex;
use std::sync::Arc;
let data = Arc::new(Mutex::new(0u32));
let mut val = data.lock().await; // .await — suspends task, not thread
*val += 1;`},
  {cat:'Traits',difficulty:'Intermediate',q:'What is the difference between impl Trait and dyn Trait?',
   a:'impl Trait is static dispatch — compiler generates a separate version for each concrete type. Zero overhead, type fixed at compile time. dyn Trait is dynamic dispatch — vtable lookup at runtime. Small overhead, allows heterogeneous collections like Vec<Box<dyn Animal>>.',
   code:`// impl Trait — static, zero overhead
fn process(item: &impl Summary) { item.summarize(); }

// dyn Trait — dynamic dispatch, runtime vtable
fn process_dyn(item: &dyn Summary) { item.summarize(); }

// Only dyn allows heterogeneous vec:
let items: Vec<Box<dyn Summary>> = vec![
    Box::new(Tweet { .. }),
    Box::new(Article { .. }),
];`},
  {cat:'Unsafe',difficulty:'Advanced',q:'What does unsafe unlock in Rust? Does it disable the borrow checker?',
   a:'unsafe unlocks five capabilities: dereference raw pointers, call unsafe functions, access mutable statics, implement unsafe traits, read union fields. The borrow checker STILL runs inside unsafe blocks. unsafe is a contract — you promise what the compiler cannot verify.',
   code:`let x = 42i32;
let ptr = &x as *const i32;
unsafe { println!("{}", *ptr); } // deref raw pointer

// Borrow checker still runs inside unsafe:
let s = String::from("hello");
let r = &s;
// unsafe { drop(s); } // ERROR: compiler still catches this!`},
  {cat:'Iterators',difficulty:'Basic',q:'Are Rust iterators lazy? What does that mean?',
   a:'Yes, iterators in Rust are lazy. Calling .map() or .filter() does not execute anything — it builds a chain of transformations. Execution only happens when you call a consuming adaptor like .collect(), .sum(), or .for_each(). This means no intermediate allocations.',
   code:`let nums = vec![1,2,3,4,5];
// This builds a chain — nothing runs yet:
let chain = nums.iter().filter(|&&x| x > 2).map(|&x| x * 2);
// Only NOW does it execute:
let result: Vec<i32> = chain.collect(); // [6, 8, 10]`},
];

const OS_QA = [
  {cat:'OS',difficulty:'Basic',q:'What is the difference between a process, thread, and async task?',
   a:'A process has isolated memory — crash in one does not affect others, separate address space, expensive to create. A thread shares memory within a process — faster communication but data race risk, costs ~1MB stack. An async task is a userspace green thread managed by Tokio — extremely lightweight, yield only at await points, thousands on few OS threads.',
   code:`// Process: isolated
std::process::Command::new("snarkjs").spawn();
// Thread: shared memory, OS-scheduled
std::thread::spawn(|| heavy_compute());
// Task: cooperative, lightweight
tokio::spawn(async { fetch_data().await });`},
  {cat:'OS',difficulty:'Basic',q:'What is the difference between parallelism and concurrency?',
   a:'Concurrency is structure — how your program handles multiple tasks (can be on one core). Parallelism is execution — actually running tasks simultaneously on multiple cores. Async gives concurrency. Rayon gives parallelism. A ZK prover needs both.',
   code:`// Concurrency — interleaved on same thread
tokio::join!(fetch(1), fetch(2), fetch(3));
// Parallelism — simultaneous on multiple cores
polys.par_iter_mut().for_each(|p| ntt_forward(p));`},
  {cat:'OS',difficulty:'Intermediate',q:'What is cache locality and why does it matter in ZK provers?',
   a:'Cache locality means accessing memory addresses that are close together, so CPU finds them in L1/L2 cache (1-5ns) rather than main RAM (100-300ns). NTT butterfly patterns access memory non-sequentially — a major bottleneck. Sequential access and SIMD improve cache hit rates significantly.',
   code:`// Cache-friendly: sequential access
let sum: u64 = data.iter().sum(); // stride-1, cache-friendly

// Cache-hostile: random access
let sum: u64 = indices.iter().map(|&i| data[i]).sum(); // cache miss per access`},
  {cat:'DB',difficulty:'Basic',q:'Explain ACID properties with a real-world example.',
   a:'Atomicity: all-or-nothing. Consistency: DB always valid state. Isolation: concurrent txns do not interfere. Durability: committed data survives crashes. Example: in Z-RWA, KYC proof verification + token mint must be atomic — either both happen or neither.',
   code:`let mut tx = pool.begin().await?;
sqlx::query!("INSERT INTO kyc_verifications ...").execute(&mut tx).await?;
sqlx::query!("UPDATE token_balances ...").execute(&mut tx).await?;
tx.commit().await?;  // atomic — if either fails, both rolled back`},
  {cat:'DB',difficulty:'Basic',q:'What is the N+1 query problem and how do you fix it?',
   a:'N+1 happens when you fetch N records then make N additional queries for related data — N+1 total round trips. Fix: use JOIN to fetch related data in one query.',
   code:`// BAD — N+1
for user in &users {
    let proofs = get_proofs(user.id).await; // separate query per user!
}
// GOOD — one JOIN
let rows = sqlx::query!(
    "SELECT u.id, p.proof_hash FROM users u
     LEFT JOIN proofs p ON p.user_id = u.id"
).fetch_all(&pool).await?;`},
  {cat:'DB',difficulty:'Advanced',q:'Explain CAP theorem and which tradeoff you would choose for a compliance system.',
   a:'CAP: distributed system can guarantee at most two of Consistency, Availability, Partition tolerance. Since partitions always occur, choose CP or AP. For compliance systems — choose CP. I cannot allow stale data saying "user is KYC verified" when they are not. Stale data = compliance violation.',
   code:`-- CP (PostgreSQL sync replication):
-- Write only confirms when replica also committed
-- Strong consistency, possible timeout during partition

-- For Z-RWA compliance status: CP required
-- For Z-RWA analytics/stats: AP acceptable`},
];

const ALL_QUIZ = [...RUST_QA, ...OS_QA];
