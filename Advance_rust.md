# Trait Objects and Trait bound in rust

In Rust, we can use Trait Bounds for static dispatch and Trait Objects for dynamic dispatch.

```rust

// Define a trait `Speak`
trait Speak {
    fn speak(&self);
}

// Implement `Speak` for `Dog`
struct Dog;
impl Speak for Dog {
    fn speak(&self) {
        println!("Woof! Woof!");
    }
}

// Implement `Speak` for `Cat`
struct Cat;
impl Speak for Cat {
    fn speak(&self) {
        println!("Meow! Meow!");
    }
}

// 🚀 1️⃣ Static Dispatch using Trait Bound
// The function is compiled separately for each type (faster, no runtime cost)
fn static_speak<T: Speak>(animal: T) {
    animal.speak(); // Statically determined at compile-time
}

// 🚀 2️⃣ Dynamic Dispatch using Trait Object
// Uses `&dyn Speak`, meaning the function call is resolved at runtime
fn dynamic_speak(animal: &dyn Speak) {
    animal.speak(); // Dynamically determined at runtime (slower)
}

fn main() {
    let dog = Dog;
    let cat = Cat;

    // ✅ Static Dispatch (Fast, Monomorphization)
    static_speak(dog); // Generates a separate version of `static_speak` for Dog
    
    // ✅ Dynamic Dispatch (Flexible, Uses Virtual Table)
    dynamic_speak(&cat); // Uses a vtable lookup for `speak`
}

```
### Key Differences

## 1. Static Dispatch (Compile-time):
Uses generics with trait bounds (T: Trait).
Monomorphization: The compiler generates a separate function for each type used.
Faster, but increases binary size.

## 2.Dynamic Dispatch (Runtime):

Uses trait objects (&dyn Trait or Box<dyn Trait>).
Uses Virtual Table (vtable) to look up methods at runtime.
More flexible, but incurs runtime overhead.


### When to Use Which?
Use Static Dispatch if performance is a priority and you don't need heterogeneous types.
Use Dynamic Dispatch if you need flexibility (e.g., storing different types in a collection).


# Trait Objects in Rust

This example demonstrates the use of trait objects in Rust for dynamic dispatch.

## Problem Statement

We want to create a collection of different shapes (`Circle` and `Rectangle`) and calculate their area without knowing the exact type of each shape at compile time.

## Code Example

```rust
// Define a trait with a common behavior
trait Shape {
    fn area(&self) -> f64;
}

// Implement the trait for Circle
struct Circle {
    radius: f64,
}

impl Shape for Circle {
    fn area(&self) -> f64 {
        3.14159 * self.radius * self.radius
    }
}

// Implement the trait for Rectangle
struct Rectangle {
    width: f64,
    height: f64,
}

impl Shape for Rectangle {
    fn area(&self) -> f64 {
        self.width * self.height
    }
}

fn main() {
    // Create a collection of shapes using Box<dyn Shape>
    let shapes: Vec<Box<dyn Shape>> = vec![
        Box::new(Circle { radius: 5.0 }),
        Box::new(Rectangle { width: 4.0, height: 6.0 }),
    ];

    // Iterate over the shapes and print their areas
    for shape in shapes {
        println!("The area is: {}", shape.area());
    }
}
```

### Trait bound -- Trait bounds specify constraints on generic types, ensuring they implement specific traits.

```rust
use std::fmt::Display;

struct Pair<T> {
    x: T,
    y: T,
}

impl<T> Pair<T> {
    fn new(x: T, y: T) -> Self {
        Self { x, y }
    }
}

impl<T: Display + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.x >= self.y {
            println!("The largest member is x = {}", self.x);
        } else {
            println!("The largest member is y = {}", self.y);
        }
    }
}
```
3. Supertraits
A trait can depend on other traits, requiring implementors to also implement the supertraits.

### Example: Using Supertraits
```rust
trait Display {
    fn show(&self);
}

trait Debug: Display {
    fn debug(&self);
}

struct Point;

impl Display for Point {
    fn show(&self) {
        println!("Displaying Point");
    }
}

impl Debug for Point {
    fn debug(&self) {
        self.show(); // Access method from the supertrait
        println!("Debugging Point");
    }
}

fn main() {
    let point = Point;
    point.debug();
}
```
