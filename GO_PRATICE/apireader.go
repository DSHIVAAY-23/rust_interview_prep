package main

import (
    "encoding/json"
    "fmt"
    "os"
)

type Record struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}

func main() {
    cwd, _ := os.Getwd()
    fmt.Println("Looking for file in:", cwd)

    file, err := os.Open("records.jsonl")
    if err != nil {
        fmt.Println("Error opening file:", err)
        return
    }
    defer file.Close()

    decoder := json.NewDecoder(file)
    for decoder.More() {
        var rec Record
        err := decoder.Decode(&rec)
        if err != nil {
            fmt.Println("Decode error:", err)
            continue
        }
        fmt.Printf("Record: %+v\n", rec)
    }
}
