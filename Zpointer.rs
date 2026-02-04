// ================= IMPORTS =================

// Box / Rc / RefCell
use std::rc::Rc;
use std::cell::RefCell;

// Arc / Mutex / Channel
use std::sync::{Arc, Mutex, mpsc};

// Threads / Time
use std::thread;
use std::time::Duration;


// ================= MAIN =================

fn main() {

    // ==================================================
    // 1️⃣ Box<T> → Heap allocation
    // ==================================================

    // Value heap pe store hota hai
    let b = Box::new(10);

    // *b = dereference
    println!("Box value = {}", *b);


    // Recursive type needs Box
    enum List {
        Cons(i32, Box<List>),
        Nil,
    }

    use List::*;

    let _list = Cons(1, Box::new(Cons(2, Box::new(Nil))));


    // ==================================================
    // 2️⃣ Rc<T> → Reference counting (Single Thread)
    // ==================================================

    let rc = Rc::new(5);

    println!("RC count = {}", Rc::strong_count(&rc)); // 1

    let rc2 = Rc::clone(&rc);
    println!("RC count = {}", Rc::strong_count(&rc)); // 2


    // ==================================================
    // 3️⃣ RefCell<T> → Interior Mutability (Runtime Check)
    // ==================================================

    let data = RefCell::new(100);

    {
        // Mutable borrow at runtime
        let mut borrow = data.borrow_mut();
        *borrow += 1;
    }

    println!("RefCell value = {}", data.borrow());


    // ==================================================
    // 4️⃣ Arc<T> → Thread-safe Rc
    // ==================================================

    let shared = Arc::new(vec![1, 2, 3]);

    let mut arc_handles = vec![];

    for i in 0..3 {

        // Arc clone
        let data = Arc::clone(&shared);

        let handle = thread::spawn(move || {
            println!("Thread {} sees {:?}", i, data);
        });

        arc_handles.push(handle);
    }

    for h in arc_handles {
        h.join().unwrap();
    }


    // ==================================================
    // 5️⃣ Threads + move (Ownership transfer)
    // ==================================================

    let v = vec![10, 20, 30];

    let handle = thread::spawn(move || {

        // v ownership yahan aa gaya
        println!("From thread: {:?}", v);

    });

    handle.join().unwrap();


    // ==================================================
    // 6️⃣ Channel → Message Passing
    // ==================================================

    // tx = sender, rx = receiver
    let (tx, rx) = mpsc::channel();

    // Producer thread
    thread::spawn(move || {

        let msg = "Hello from channel".to_string();

        // Send message
        tx.send(msg).unwrap();

    });

    // Consumer
    let received = rx.recv().unwrap();

    println!("Received: {}", received);


    // ==================================================
    // 7️⃣ Arc + Mutex → Shared Mutable State
    // ==================================================

    let counter = Arc::new(Mutex::new(0));

    let mut mutex_handles = vec![];

    for _ in 0..10 {

        let counter = Arc::clone(&counter);

        let handle = thread::spawn(move || {

            // Lock acquire
            let mut num = counter.lock().unwrap();

            *num += 1;

            // Lock automatically released here
        });

        mutex_handles.push(handle);
    }

    for h in mutex_handles {
        h.join().unwrap();
    }

    println!("Final Counter = {}", *counter.lock().unwrap());


    // ==================================================
    // 8️⃣ Channel vs Mutex (Mental Difference Demo)
    // ==================================================

    let (tx2, rx2) = mpsc::channel();

    // Producer
    thread::spawn(move || {
        for i in 1..=5 {
            tx2.send(i).unwrap();
            thread::sleep(Duration::from_millis(100));
        }
    });

    // Consumer (State Machine)
    let mut sum = 0;

    for val in rx2 {
        sum += val;
        println!("Sum now = {}", sum);

        if sum >= 15 {
            break;
        }
    }

    println!("Channel Final Sum = {}", sum);

}
