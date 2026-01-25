package main

import (
	"flag"
	"fmt"
	"os"
)

func main() {
	inputPath := flag.String("input", "", "Path to engine input JSON")
	flag.Parse()

	if *inputPath == "" {
		fmt.Fprintln(os.Stderr, "input path is required")
		os.Exit(1)
	}

	if _, err := RunEngine(*inputPath); err != nil {
		fmt.Fprintln(os.Stderr, err.Error())
		os.Exit(1)
	}
}
