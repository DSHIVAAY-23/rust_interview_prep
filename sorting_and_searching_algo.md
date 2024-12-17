### Sorting Algorithms:

Sorting algorithms wo techniques hain jo elements ko kisi defined order mein arrange karne ke liye use hoti hain. Sorting generally **ascending** ya **descending** order mein ki jati hai.

---

#### Common Sorting Algorithms:
1. **Bubble Sort**:
   - Explanation: Adjacent elements ko compare karke swap karte hain jab tak array sorted na ho jaye.
   - Time Complexity: O(n²) in worst case, O(n) in best case (optimized version).
     ```rust
fn bubble_sort(arr: &mut Vec<i32>) {
    let n = arr.len();
    for i in 0..n - 1 {
        let mut swapped = false; // Optimization to stop if array is already sorted
        for j in 0..n - i - 1 {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
                swapped = true;
            }
        }
        if !swapped {
            break; // No swaps means array is already sorted
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

2. **Selection Sort**:
   - Explanation: Har pass mein minimum element ko select karke usse first unsorted position pe swap karte hain.
   - Time Complexity: O(n²) in all cases.
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

3. **Insertion Sort**:
   - Explanation: Array ke elements ko ek ek karke sorted portion mein insert karte hain.
   - Time Complexity: O(n²) in worst case, O(n) in best case.
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


4. **Merge Sort**:
   - Explanation: Divide and conquer technique use karta hai, jisme array ko recursively divide kiya jata hai aur phir merge karke sorted array banaya jata hai.
   - Time Complexity: O(n log n) in all cases.
     
fn merge(arr: &mut Vec<i32>, low: usize, mid: usize, high: usize) {
    let mut temp: Vec<i32> = Vec::new();
    let mut left = low;
    let mut right = mid + 1;

    // Merging elements into temp in sorted order
    while left <= mid && right <= high {
        if arr[left] <= arr[right] {
            temp.push(arr[left]);
            left += 1;
        } else {
            temp.push(arr[right]);
            right += 1;
        }
    }

    // Adding remaining elements from the left half
    while left <= mid {
        temp.push(arr[left]);
        left += 1;
    }

    // Adding remaining elements from the right half
    while right <= high {
        temp.push(arr[right]);
        right += 1;
    }

    // Copying sorted elements back into the original array
    for i in low..=high {
        arr[i] = temp[i - low];
    }
}

fn merge_sort(arr: &mut Vec<i32>, low: usize, high: usize) {
    if low >= high {
        return;
    }
    let mid = (low + high) / 2;
    merge_sort(arr, low, mid);      // Sorting the left half
    merge_sort(arr, mid + 1, high); // Sorting the right half
    merge(arr, low, mid, high);     // Merging the sorted halves
}

fn main() {
    let mut arr = vec![9, 4, 7, 6, 3, 1, 5];
    println!("Before Sorting Array: {:?}", arr);
    let n = arr.len();
    merge_sort(&mut arr, 0, n - 1);
    println!("After Sorting Array: {:?}", arr);
}


5. **Quick Sort**:
   - Explanation: Ek pivot element choose karke array ko partition karta hai, phir recursively dono partitions ko sort karta hai.
   - Time Complexity: O(n log n) in average case, O(n²) in worst case.


### Searching Algorithms:

2. **Binary Search**:
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


---

### Summary of Time Complexities:
| Algorithm         | Best Case   | Worst Case  | Average Case  |
|-------------------|-------------|-------------|---------------|
| Bubble Sort       | O(n)        | O(n²)       | O(n²)         |
| Selection Sort    | O(n²)       | O(n²)       | O(n²)         |
| Insertion Sort    | O(n)        | O(n²)       | O(n²)         |
| Merge Sort        | O(n log n)  | O(n log n)  | O(n log n)    |
| Binary Search     | O(log n)    | O(log n)    | O(log n)      |


---

### Conclusion:
- **Sorting Algorithms**: Use them to arrange data in a specific order.
- **Searching Algorithms**: Use them to find an element in a collection efficiently.

