package main

import "time"

type EngineInput struct {
	InputFiles        []string          `json:"input_files"`
	InputFormat       string            `json:"input_format"`
	MappingConfigPath *string           `json:"mapping_config_path"`
	RulesetPath       string            `json:"ruleset_path"`
	Currency          *string           `json:"currency"`
	RoundingMode      string            `json:"rounding_mode"`
	Timezone          string            `json:"timezone"`
	OutputDir         string            `json:"output_dir"`
	Mode              string            `json:"mode"`
	Determinism       DeterminismConfig `json:"determinism"`
}

type DeterminismConfig struct {
	SortKeys []string `json:"sort_keys"`
	Rounding string   `json:"rounding"`
	Timezone string   `json:"timezone"`
}

type Ruleset struct {
	SchemaVersion  string   `json:"schema_version" yaml:"schema_version"`
	Sources        []string `json:"sources" yaml:"sources"`
	KeyFields      []string `json:"key_fields" yaml:"key_fields"`
	AmountField    string   `json:"amount_field" yaml:"amount_field"`
	CurrencyField  string   `json:"currency_field" yaml:"currency_field"`
	TimestampField string   `json:"timestamp_field" yaml:"timestamp_field"`
	AccountField   string   `json:"account_field" yaml:"account_field"`
}

type MappingConfig struct {
	Sources map[string]FieldMapping `json:"sources"`
}

type FieldMapping struct {
	ID        string `json:"id"`
	Amount    string `json:"amount"`
	Currency  string `json:"currency"`
	Timestamp string `json:"timestamp"`
	Account   string `json:"account"`
}

type NormalizedRecord struct {
	Source      string `json:"source"`
	Key         string `json:"key"`
	ID          string `json:"id"`
	Account     string `json:"account,omitempty"`
	AmountCents int64  `json:"amount_cents"`
	Currency    string `json:"currency"`
	Timestamp   string `json:"timestamp,omitempty"`
}

type NormalizationSummary struct {
	RecordsProcessed int      `json:"records_processed"`
	RecordsSkipped   int      `json:"records_skipped"`
	Warnings         []string `json:"warnings"`
}

type VarianceSummary struct {
	Total        int            `json:"total"`
	CountsByType map[string]int `json:"counts_by_type"`
}

type EvidenceManifest struct {
	GeneratedAt   time.Time      `json:"generated_at"`
	ToolVersion   string         `json:"tool_version"`
	SchemaVersion string         `json:"schema_version"`
	Files         []ManifestFile `json:"files"`
}

type ManifestFile struct {
	Path   string `json:"path"`
	SHA256 string `json:"sha256"`
	Bytes  int64  `json:"bytes"`
}

type EngineOutput struct {
	SchemaVersion          string               `json:"schema_version"`
	ToolVersion            string               `json:"tool_version"`
	NormalizationSummary   NormalizationSummary `json:"normalization_summary"`
	VarianceSummary        VarianceSummary      `json:"variance_summary"`
	VarianceItemsPath      string               `json:"variance_items_path"`
	EvidenceManifest       EvidenceManifest     `json:"evidence_manifest"`
	DeterministicStatement string               `json:"deterministic_statement"`
}

type VarianceItem struct {
	Key             string         `json:"key"`
	Type            string         `json:"type"`
	Currency        string         `json:"currency"`
	AmountsBySource []SourceAmount `json:"amounts_by_source,omitempty"`
	MissingSources  []string       `json:"missing_sources,omitempty"`
}

type SourceAmount struct {
	Source      string `json:"source"`
	AmountCents int64  `json:"amount_cents"`
}
