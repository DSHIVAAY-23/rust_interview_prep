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

### Trait bound

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
