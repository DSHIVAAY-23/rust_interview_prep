package main

import (
    "fmt"
    "time"
)

func say_hello(){
fmt.Println("hello")
}

func main(){
go say_hello()
time.Sleep(10*time.Second)
fmt.Println("done")
}