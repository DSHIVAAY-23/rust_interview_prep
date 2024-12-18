# Object-Oriented Programming (OOP) in Rust

Rust is not a purely object-oriented programming language, but it provides powerful features to achieve key OOP principles such as encapsulation, polymorphism, and inheritance-like behavior through structs and traits.

---

## **Encapsulation with Structs**

In Rust, encapsulation is achieved using `struct` and `impl` blocks to define and implement behavior. Private fields and public methods ensure controlled access to data.

### Example: Rectangle with Encapsulation

```rust
pub struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // Constructor for Rectangle
    pub fn new(width: u32, height: u32) -> Rectangle {
        Rectangle { width, height }
    }

    // Method to calculate area
    pub fn area(&self) -> u32 {
        self.width * self.height
    }
}

let rect = Rectangle::new(10, 20);
println!("Area: {}", rect.area());
```

---

## **Polymorphism with Traits**

Traits in Rust allow the definition of shared behavior for different types, enabling polymorphism.

### Example: Shape Trait

```rust
pub trait Shape {
    fn area(&self) -> f64;
}

pub struct Circle {
    radius: f64,
}

impl Shape for Circle {
    fn area(&self) -> f64 {
        3.14 * self.radius * self.radius
    }
}

pub struct Rectangle {
    width: f64,
    height: f64,
}

impl Shape for Rectangle {
    fn area(&self) -> f64 {
        self.width * self.height
    }
}

fn print_area(shape: &dyn Shape) {
    println!("Area: {}", shape.area());
}

fn main() {
    let circle = Circle { radius: 5.0 };
    let rectangle = Rectangle { width: 4.0, height: 6.0 };

    // Using polymorphism to call the `area` method
    print_area(&circle);
    print_area(&rectangle);
}

```

---

## **Dynamic Dispatch with Trait Objects**

Trait objects, created using `dyn`, enable runtime polymorphism. This is useful when the exact type implementing a trait is unknown at compile time.

### Example: Dynamic Dispatch

```rust
fn print_area(shape: &dyn Shape) {
    println!("Area: {}", shape.area());
}

let c = Circle { radius: 5.0 };
print_area(&c);
```

---

## **Inheritance-like Behavior with Traits**

Rust does not support traditional class-based inheritance, but traits can extend other traits to achieve similar functionality.

### Example: Extending Traits

```rust
trait Shape {
    fn area(&self) -> f64;
}

trait Perimeter: Shape {
    fn perimeter(&self) -> f64;
}
```

In this example, any type implementing `Perimeter` must also implement `Shape`.

---

## **Key Takeaways**

1. **Encapsulation**: Use `struct` and `impl` to define types and methods while restricting access with privacy controls.
2. **Polymorphism**: Use traits to define shared behavior and implement them for multiple types.
3. **Dynamic Dispatch**: Use `dyn` with trait objects for runtime polymorphism.
4. **Inheritance-like Behavior**: Extend traits to create hierarchical relationships.

Rust's approach to OOP focuses on composition over inheritance, making it a flexible and powerful tool for modern programming needs.
