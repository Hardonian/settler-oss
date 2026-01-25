package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
)

type ExpectedCounts struct {
	MissingRecord  int `json:"missing_record"`
	AmountMismatch int `json:"amount_mismatch"`
}

type Schema struct {
	Required []string `json:"required"`
}

func TestFixtureRun(t *testing.T) {
	fixtureDir := filepath.Join("fixtures", "basic")
	inputPath := filepath.Join(fixtureDir, "engine_input.json")
	outputDir := filepath.Join(t.TempDir(), "output")

	inputBytes, err := os.ReadFile(inputPath)
	if err != nil {
		t.Fatalf("read fixture input: %v", err)
	}

	var input EngineInput
	if err := json.Unmarshal(inputBytes, &input); err != nil {
		t.Fatalf("parse fixture input: %v", err)
	}
	absFixtureDir, err := filepath.Abs(fixtureDir)
	if err != nil {
		t.Fatalf("resolve fixture dir: %v", err)
	}
	input.InputFiles = []string{
		filepath.Join(absFixtureDir, "source_a.csv"),
		filepath.Join(absFixtureDir, "source_b.json"),
	}
	input.RulesetPath = filepath.Join(absFixtureDir, "ruleset.json")
	input.OutputDir = outputDir

	updatedBytes, err := json.Marshal(input)
	if err != nil {
		t.Fatalf("marshal input: %v", err)
	}

	updatedInputPath := filepath.Join(outputDir, "engine_input.json")
	if err := os.MkdirAll(outputDir, 0o755); err != nil {
		t.Fatalf("create temp output dir: %v", err)
	}
	if err := os.WriteFile(updatedInputPath, updatedBytes, 0o644); err != nil {
		t.Fatalf("write temp input: %v", err)
	}

	output, err := RunEngine(updatedInputPath)
	if err != nil {
		t.Fatalf("run engine: %v", err)
	}

	assertSchemaRequired(t, filepath.Join("schemas", "engine_input.schema.json"), inputPath)
	outputPath := filepath.Join(outputDir, "engine_output.json")
	assertSchemaRequired(t, filepath.Join("schemas", "engine_output.schema.json"), outputPath)

	expectedCountsPath := filepath.Join(fixtureDir, "expected_counts.json")
	expectedBytes, err := os.ReadFile(expectedCountsPath)
	if err != nil {
		t.Fatalf("read expected counts: %v", err)
	}

	var expected ExpectedCounts
	if err := json.Unmarshal(expectedBytes, &expected); err != nil {
		t.Fatalf("parse expected counts: %v", err)
	}

	if output.VarianceSummary.CountsByType["missing_record"] != expected.MissingRecord {
		t.Fatalf("missing_record count mismatch: got %d want %d", output.VarianceSummary.CountsByType["missing_record"], expected.MissingRecord)
	}
	if output.VarianceSummary.CountsByType["amount_mismatch"] != expected.AmountMismatch {
		t.Fatalf("amount_mismatch count mismatch: got %d want %d", output.VarianceSummary.CountsByType["amount_mismatch"], expected.AmountMismatch)
	}

	manifestPath := filepath.Join(outputDir, "evidence", "manifest.json")
	if _, err := os.Stat(manifestPath); err != nil {
		t.Fatalf("manifest not created: %v", err)
	}

	secondOutputDir := filepath.Join(t.TempDir(), "output")
	input.OutputDir = secondOutputDir
	updatedBytes, err = json.Marshal(input)
	if err != nil {
		t.Fatalf("marshal input for second run: %v", err)
	}
	secondInputPath := filepath.Join(secondOutputDir, "engine_input.json")
	if err := os.MkdirAll(secondOutputDir, 0o755); err != nil {
		t.Fatalf("create second output dir: %v", err)
	}
	if err := os.WriteFile(secondInputPath, updatedBytes, 0o644); err != nil {
		t.Fatalf("write second input: %v", err)
	}
	if _, err := RunEngine(secondInputPath); err != nil {
		t.Fatalf("run engine second time: %v", err)
	}

	firstVariance := filepath.Join(outputDir, "evidence", "variances.jsonl")
	secondVariance := filepath.Join(secondOutputDir, "evidence", "variances.jsonl")
	firstHash, err := hashFileForTest(firstVariance)
	if err != nil {
		t.Fatalf("hash first variance: %v", err)
	}
	secondHash, err := hashFileForTest(secondVariance)
	if err != nil {
		t.Fatalf("hash second variance: %v", err)
	}
	if firstHash != secondHash {
		t.Fatalf("variance hash mismatch: %s vs %s", firstHash, secondHash)
	}
}

func assertSchemaRequired(t *testing.T, schemaPath string, payloadPath string) {
	t.Helper()

	schemaBytes, err := os.ReadFile(schemaPath)
	if err != nil {
		t.Fatalf("read schema: %v", err)
	}

	var schema Schema
	if err := json.Unmarshal(schemaBytes, &schema); err != nil {
		t.Fatalf("parse schema: %v", err)
	}

	payloadBytes, err := os.ReadFile(payloadPath)
	if err != nil {
		t.Fatalf("read payload: %v", err)
	}

	var payload map[string]any
	if err := json.Unmarshal(payloadBytes, &payload); err != nil {
		t.Fatalf("parse payload: %v", err)
	}

	for _, field := range schema.Required {
		if _, ok := payload[field]; !ok {
			t.Fatalf("missing required field %s in %s", field, payloadPath)
		}
	}
}

func hashFileForTest(path string) (string, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}
	digest := sha256.Sum256(data)
	return hex.EncodeToString(digest[:]), nil
}
