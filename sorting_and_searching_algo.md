### Sorting Algorithms:

Sorting algorithms wo techniques hain jo elements ko kisi defined order mein arrange karne ke liye use hoti hain. Sorting generally **ascending** ya **descending** order mein ki jati hai.

---

#### Common Sorting Algorithms:
1. **Bubble Sort**:
   - Explanation: Adjacent elements ko compare karke swap karte hain jab tak array sorted na ho jaye.
   - Time Complexity: O(n²) in worst case, O(n) in best case (optimized version).

2. **Selection Sort**:
   - Explanation: Har pass mein minimum element ko select karke usse first unsorted position pe swap karte hain.
   - Time Complexity: O(n²) in all cases.

3. **Insertion Sort**:
   - Explanation: Array ke elements ko ek ek karke sorted portion mein insert karte hain.
   - Time Complexity: O(n²) in worst case, O(n) in best case.

4. **Merge Sort**:
   - Explanation: Divide and conquer technique use karta hai, jisme array ko recursively divide kiya jata hai aur phir merge karke sorted array banaya jata hai.
   - Time Complexity: O(n log n) in all cases.

5. **Quick Sort**:
   - Explanation: Ek pivot element choose karke array ko partition karta hai, phir recursively dono partitions ko sort karta hai.
   - Time Complexity: O(n log n) in average case, O(n²) in worst case.

6. **Heap Sort**:
   - Explanation: Binary heap data structure ka use karke elements ko efficiently sort karta hai.
   - Time Complexity: O(n log n) in all cases.

7. **Radix Sort**:
   - Explanation: Numbers ko unke individual digits ke basis pe sort karta hai.
   - Time Complexity: O(nk), jahan **n** number of elements hain aur **k** maximum digit count.

8. **Bucket Sort**:
   - Explanation: Numbers ko buckets mein distribute karte hain aur phir har bucket ko sort karte hain.
   - Time Complexity: O(n + k), jahan **k** bucket size hai.

---

### Searching Algorithms:

Searching algorithms ka use hota hai kisi particular element ko array ya list mein dhoondhne ke liye.

#### Common Searching Algorithms:
1. **Linear Search**:
   - Explanation: Array ke har element ko sequentially check karte hain jab tak required element nahi mil jata.
   - Time Complexity: O(n) in all cases.

2. **Binary Search**:
   - Explanation: Sorted array mein element ko efficiently dhoondhne ke liye divide and conquer technique ka use karta hai. Har time array ko half mein divide kiya jata hai.
   - Time Complexity: O(log n), lekin sirf sorted array ke liye.

3. **Jump Search**:
   - Explanation: Sorted array mein ek fixed step size (jump) pe element ko search karta hai, aur agar step size se zyada bada element milta hai, tab linear search shuru karta hai.
   - Time Complexity: O(√n).

4. **Exponential Search**:
   - Explanation: Ek element ko find karne ke liye array ko exponentially search karta hai, aur phir binary search apply karta hai.
   - Time Complexity: O(log n).

5. **Interpolation Search**:
   - Explanation: Binary search se milta julta hai, lekin interpolation search estimate karta hai ki element kis position par ho sakta hai, based on its value.
   - Time Complexity: O(log log n) in best case, O(n) in worst case.

---

### Summary of Time Complexities:
| Algorithm         | Best Case   | Worst Case  | Average Case  |
|-------------------|-------------|-------------|---------------|
| Bubble Sort       | O(n)        | O(n²)       | O(n²)         |
| Selection Sort    | O(n²)       | O(n²)       | O(n²)         |
| Insertion Sort    | O(n)        | O(n²)       | O(n²)         |
| Merge Sort        | O(n log n)  | O(n log n)  | O(n log n)    |
| Quick Sort        | O(n log n)  | O(n²)       | O(n log n)    |
| Heap Sort         | O(n log n)  | O(n log n)  | O(n log n)    |
| Radix Sort        | O(nk)       | O(nk)       | O(nk)         |
| Bucket Sort       | O(n + k)    | O(n²)       | O(n + k)      |
| Linear Search     | O(n)        | O(n)        | O(n)          |
| Binary Search     | O(log n)    | O(log n)    | O(log n)      |
| Jump Search       | O(√n)       | O(√n)       | O(√n)         |
| Exponential Search| O(log n)    | O(log n)    | O(log n)      |
| Interpolation Search| O(log log n)| O(n)       | O(n)          |

---

### Conclusion:
- **Sorting Algorithms**: Use them to arrange data in a specific order.
- **Searching Algorithms**: Use them to find an element in a collection efficiently.

