
## Sorting Algorithms

Sorting algorithms are techniques used to arrange elements in a defined order, generally **ascending** or **descending**.
1. **Merge Sort**
   - **Explanation**: A divide-and-conquer algorithm that recursively divides the array and merges the sorted halves..
   - **Time Complexity**: O(n log n) (all cases)..

```rust
    fn merge(arr: &mut Vec<i32>, low: usize, mid: usize, high: usize) {
    let mut temp: Vec<i32> = Vec::new();
    let mut left = low;
    let mut right = mid + 1;

    while left <= mid && right <= high {
        if arr[left] <= arr[right] {
            temp.push(arr[left]);
            left += 1;
        } else {
            temp.push(arr[right]);
            right += 1;
        }
    }

    while left <= mid {
        temp.push(arr[left]);
        left += 1;
    }

    while right <= high {
        temp.push(arr[right]);
        right += 1;
    }

    for i in low..=high {
        arr[i] = temp[i - low];
    }
}

fn merge_sort(arr: &mut Vec<i32>, low: usize, high: usize) {
    if low >= high {
        return;
    }
    let mid = (low + high) / 2;
    merge_sort(arr, low, mid);
    merge_sort(arr, mid + 1, high);
    merge(arr, low, mid, high);
}

fn main() {
    let mut arr = vec![9, 4, 7, 6, 3, 1, 5];
    println!("Before Sorting: {:?}", arr);
    let n = arr.len();
    merge_sort(&mut arr, 0, n - 1);
    println!("After Sorting: {:?}", arr);
}

```
---

2. **Selection Sort**
 ```rust
 fn selection_sort(arr: &mut Vec<i32>) {
    let n = arr.len();
    for i in 0..n - 1 {
        let mut min_idx = i;
        for j in i + 1..n {
            if arr[j] < arr[min_idx] {
                min_idx = j;
            }
        }
        if min_idx != i {
            arr.swap(i, min_idx);
        }
    }
    }

 fn main() {
    let mut arr = vec![64, 25, 12, 22, 11];
    println!("Before Sorting: {:?}", arr);
    selection_sort(&mut arr);
    println!("After Sorting: {:?}", arr);
  }

```

3. **Insertion Sort**
  - **Explanation:** A divide-and-conquer algorithm that recursively divides the array and merges the sorted halves.
 ```rust
  fn insertion_sort(arr: &mut Vec<i32>) {
    let n = arr.len();
    for i in 1..n {
        let key = arr[i];
        let mut j = i;
        while j > 0 && arr[j - 1] > key {
            arr[j] = arr[j - 1];
            j -= 1;
        }
        arr[j] = key;
    }
 }

 fn main() {
    let mut arr = vec![12, 11, 13, 5, 6];
    println!("Before Sorting: {:?}", arr);
    insertion_sort(&mut arr);
    println!("After Sorting: {:?}", arr);
 }

```

4. **Bubble Sort**
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


***Binary search***

1. **Binary search**
   - **Explanation**: Compares adjacent elements and swaps them until the array is sorted.
   - **Time Complexity**: O(n²) (worst case), O(n) (best case for optimized version).

   ```rust
   fn binary_search(arr: &[i32], target: i32) -> Option<usize> {
    let mut low = 0;
    let mut high = arr.len();

    while low < high {
        let mid = low + (high - low) / 2;
        if arr[mid] == target {
            return Some(mid);
        } else if arr[mid] < target {
            low = mid + 1;
        } else {
            high = mid;
        }
    }

    None
   }

    fn lower_bound(arr: &[i32], target: i32) -> usize {
    let mut low = 0;
    let mut high = arr.len();

    while low < high {
        let mid = low + (high - low) / 2;
        if arr[mid] < target {
            low = mid + 1;
        } else {
            high = mid;
        }
    }

    low
  }

    fn upper_bound(arr: &[i32], target: i32) -> usize {
    let mut low = 0;
    let mut high = arr.len();

    while low < high {
        let mid = low + (high - low) / 2;
        if arr[mid] <= target {
            low = mid + 1;
        } else {
            high = mid;
        }
    }

    low
   }

     fn main() {
     let arr = vec![1, 3, 5, 5, 5, 7, 9];
     let target = 5;

     match binary_search(&arr, target) {
        Some(index) => println!("Found {} at index {}", target, index),
        None => println!("{} not found in the array", target),
    }

    let lb = lower_bound(&arr, target);
    println!("Lower bound of {} is at index {}", target, lb);

    let ub = upper_bound(&arr, target);
    println!("Upper bound of {} is at index {}", target, ub);
  }

```

