package main

import (
    "bufio"
    "fmt"
    "os"
)

func main() {
    file, err := os.Open("/data/Rust_Chemistry/GO_PRATICE/bigdata.txt")
    if err != nil {
        panic(err)
    }
    defer file.Close()

    scanner := bufio.NewScanner(file)
    for scanner.Scan() {
        line := scanner.Text()
        process(line) // your logic here
    }

    if err := scanner.Err(); err != nil {
        fmt.Println("Error reading file:", err)
    }
}

func process(data string) {
    fmt.Println("Processing:", data)
}
