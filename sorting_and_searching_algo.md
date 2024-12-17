1. Bubble Sort
Bubble Sort compares adjacent elements and swaps them if they are in the wrong order. It repeats until the array is sorted.

Time Complexity:
Best Case: O(n) (optimized version)
Worst Case: O(n²)
rust
Copy code
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
2. Selection Sort
Selection Sort finds the smallest element from the unsorted portion and swaps it with the first unsorted position.

Time Complexity:
O(n²) in all cases.
rust
Copy code
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
3. Insertion Sort
Insertion Sort inserts each element into its correct position in the sorted portion of the array.

Time Complexity:
Best Case: O(n)
Worst Case: O(n²)
rust
Copy code
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
4. Merge Sort
Merge Sort uses the divide-and-conquer approach to recursively divide the array into halves and merge them in sorted order.

Time Complexity:
O(n log n) in all cases.
rust
Copy code
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
    println!("Before Sorting Array: {:?}", arr);
    let n = arr.len();
    merge_sort(&mut arr, 0, n - 1);
    println!("After Sorting Array: {:?}", arr);
}
Searching Algorithms
1. Binary Search
Binary Search repeatedly divides the search range in half to locate the target element.

Time Complexity: O(log n)
rust
Copy code
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

fn main() {
    let arr = vec![1, 3, 5, 7, 9];
    let target = 5;

    match binary_search(&arr, target) {
        Some(index) => println!("Found {} at index {}", target, index),
        None => println!("{} not found in the array", target),
    }
}
Summary of Time Complexities
Algorithm	Best Case	Worst Case	Average Case
Bubble Sort	O(n)	O(n²)	O(n²)
Selection Sort	O(n²)	O(n²)	O(n²)
Insertion Sort	O(n)	O(n²)	O(n²)
Merge Sort	O(n log n)	O(n log n)	O(n log n)
Binary Search	O(log n)	O(log n)	O(log n)
