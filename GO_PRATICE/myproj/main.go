package main

import (
    "fmt"
    "myproject/utils" // assumes your module name is myproject and utils.Add exists
)

func doubleValues(s []int) {
    for i := range s {
        s[i] *= 2
    }
}
func main() {
    result := utils.Add(10, 5)
    fmt.Println("10 + 5 =", result)

    nums := []int{1, 2, 3, 4}

	doubleValues(nums)
    fmt.Println(nums) // [2 4 6]
   

}
