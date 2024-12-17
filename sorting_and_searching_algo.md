# Sorting and Searching Algorithms

This repository provides a collection of sorting and searching algorithms implemented in Rust, along with explanations and code examples.

---

## Sorting Algorithms

Sorting algorithms are techniques used to arrange elements in a defined order, generally **ascending** or **descending**.

### Common Sorting Algorithms:

1. **Bubble Sort**
   - **Explanation**: Compares adjacent elements and swaps them until the array is sorted.
   - **Time Complexity**: O(n²) (worst case), O(n) (best case for optimized version).

   ```rust
   fn bubble_sort(arr: &mut Vec<i32>) {
       let n = arr.len();
       for i in 0..n - 1 {
           let mut swapped = false;
           for j in 0..n - i - 1 {
               if arr[j] > arr[j + 1] {
                   arr.swap(j, j + 1);
                   swapped = true;
               }
           }
           if !swapped {
               break;
           }
       }
   }

   fn main() {
       let mut arr = vec![64, 34, 25, 12, 22, 11, 90];
       println!("Before Sorting: {:?}", arr);
       bubble_sort(&mut arr);
       println!("After Sorting: {:?}", arr);
   }
```
