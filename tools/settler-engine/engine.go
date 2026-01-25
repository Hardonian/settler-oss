package main

import (
	"bufio"
	"crypto/sha256"
	"encoding/csv"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"
)

const (
	ToolVersion   = "0.1.0"
	SchemaVersion = "1.0.0"
)

func RunEngine(inputPath string) (*EngineOutput, error) {
	inputBytes, err := os.ReadFile(inputPath)
	if err != nil {
		return nil, fmt.Errorf("read input file: %w", err)
	}

	var input EngineInput
	if err := json.Unmarshal(inputBytes, &input); err != nil {
		return nil, fmt.Errorf("parse input json: %w", err)
	}

	if err := validateInput(&input); err != nil {
		return nil, err
	}

	baseDir := filepath.Dir(inputPath)
	input.InputFiles = resolvePaths(baseDir, input.InputFiles)
	input.RulesetPath = resolvePath(baseDir, input.RulesetPath)
	if input.MappingConfigPath != nil && *input.MappingConfigPath != "" {
		resolved := resolvePath(baseDir, *input.MappingConfigPath)
		input.MappingConfigPath = &resolved
	}
	input.OutputDir = resolvePath(baseDir, input.OutputDir)

	ruleset, err := loadRuleset(input.RulesetPath)
	if err != nil {
		return nil, err
	}

	mapping, err := loadMapping(input.MappingConfigPath)
	if err != nil {
		return nil, err
	}

	sources := resolveSources(ruleset, input.InputFiles)
	if len(sources) == 0 {
		return nil, errors.New("ruleset must define at least one source")
	}

	location, err := time.LoadLocation(input.Timezone)
	if err != nil {
		return nil, fmt.Errorf("invalid timezone: %w", err)
	}

	outputDir := input.OutputDir
	if err := os.MkdirAll(outputDir, 0o755); err != nil {
		return nil, fmt.Errorf("create output dir: %w", err)
	}

	evidenceDir := filepath.Join(outputDir, "evidence")
	logsDir := filepath.Join(evidenceDir, "logs")
	if err := os.MkdirAll(logsDir, 0o755); err != nil {
		return nil, fmt.Errorf("create evidence dir: %w", err)
	}

	logFile, err := os.Create(filepath.Join(logsDir, "engine.log"))
	if err != nil {
		return nil, fmt.Errorf("create log file: %w", err)
	}
	defer logFile.Close()

	writer := bufio.NewWriter(logFile)
	defer writer.Flush()

	if _, err := writer.WriteString("settler-engine run started\n"); err != nil {
		return nil, fmt.Errorf("write log: %w", err)
	}

	normalizedRecords := make([]NormalizedRecord, 0)
	warnings := make([]string, 0)
	recordsProcessed := 0
	recordsSkipped := 0

	for index, path := range input.InputFiles {
		source := sources[index]
		format := input.InputFormat
		if format == "auto" {
			format = detectFormat(path)
		}

		records, err := loadRecords(path, format)
		if err != nil {
			return nil, err
		}

		for _, record := range records {
			mapped := mapRecord(record, source, ruleset, mapping)
			key, keyWarnings := buildKey(mapped, ruleset.KeyFields)
			if len(keyWarnings) > 0 {
				warnings = append(warnings, keyWarnings...)
			}
			if key == "" {
				recordsSkipped++
				continue
			}

			amountValue := mapped[ruleset.AmountField]
			amountCents, amountWarning := parseAmount(amountValue, input.RoundingMode)
			if amountWarning != "" {
				warnings = append(warnings, fmt.Sprintf("%s: %s", source, amountWarning))
			}

			currency := mapped[ruleset.CurrencyField]
			if currency == "" && input.Currency != nil {
				currency = *input.Currency
			}

			timestamp := mapped[ruleset.TimestampField]
			if timestamp != "" {
				normalizedTimestamp, tsWarning := normalizeTimestamp(timestamp, location)
				if tsWarning != "" {
					warnings = append(warnings, fmt.Sprintf("%s: %s", source, tsWarning))
				}
				timestamp = normalizedTimestamp
			}

			recordID := mapped["id"]
			account := mapped["account"]

			normalizedRecords = append(normalizedRecords, NormalizedRecord{
				Source:      source,
				Key:         key,
				ID:          recordID,
				Account:     account,
				AmountCents: amountCents,
				Currency:    currency,
				Timestamp:   timestamp,
			})
			recordsProcessed++
		}
	}

	sort.Slice(normalizedRecords, func(i, j int) bool {
		if normalizedRecords[i].Key != normalizedRecords[j].Key {
			return normalizedRecords[i].Key < normalizedRecords[j].Key
		}
		if normalizedRecords[i].Source != normalizedRecords[j].Source {
			return normalizedRecords[i].Source < normalizedRecords[j].Source
		}
		if normalizedRecords[i].AmountCents != normalizedRecords[j].AmountCents {
			return normalizedRecords[i].AmountCents < normalizedRecords[j].AmountCents
		}
		return normalizedRecords[i].ID < normalizedRecords[j].ID
	})

	normalizedPath := filepath.Join(evidenceDir, "normalized.jsonl")
	if err := writeJSONLines(normalizedPath, normalizedRecords); err != nil {
		return nil, err
	}

	varianceItems, varianceSummary := computeVariances(normalizedRecords, sources)

	variancesPath := filepath.Join(evidenceDir, "variances.jsonl")
	if err := writeJSONLines(variancesPath, varianceItems); err != nil {
		return nil, err
	}

	manifest := EvidenceManifest{
		GeneratedAt:   time.Unix(0, 0).UTC(),
		ToolVersion:   ToolVersion,
		SchemaVersion: SchemaVersion,
		Files:         []ManifestFile{},
	}

	manifestFiles := []string{
		filepath.Join("evidence", "normalized.jsonl"),
		filepath.Join("evidence", "variances.jsonl"),
		filepath.Join("evidence", "logs", "engine.log"),
	}

	for _, relPath := range manifestFiles {
		absPath := filepath.Join(outputDir, relPath)
		fileInfo, err := os.Stat(absPath)
		if err != nil {
			return nil, fmt.Errorf("stat %s: %w", absPath, err)
		}
		hash, err := hashFile(absPath)
		if err != nil {
			return nil, fmt.Errorf("hash %s: %w", absPath, err)
		}
		manifest.Files = append(manifest.Files, ManifestFile{
			Path:   relPath,
			SHA256: hash,
			Bytes:  fileInfo.Size(),
		})
	}

	sort.Slice(manifest.Files, func(i, j int) bool {
		return manifest.Files[i].Path < manifest.Files[j].Path
	})

	manifestPath := filepath.Join(evidenceDir, "manifest.json")
	if err := writeJSONFile(manifestPath, manifest); err != nil {
		return nil, err
	}

	output := EngineOutput{
		SchemaVersion: SchemaVersion,
		ToolVersion:   ToolVersion,
		NormalizationSummary: NormalizationSummary{
			RecordsProcessed: recordsProcessed,
			RecordsSkipped:   recordsSkipped,
			Warnings:         warnings,
		},
		VarianceSummary:        varianceSummary,
		VarianceItemsPath:      filepath.Join("evidence", "variances.jsonl"),
		EvidenceManifest:       manifest,
		DeterministicStatement: buildDeterministicStatement(input),
	}

	if _, err := writer.WriteString("settler-engine run completed\n"); err != nil {
		return nil, fmt.Errorf("write log: %w", err)
	}

	outputPath := filepath.Join(outputDir, "engine_output.json")
	if err := writeJSONFile(outputPath, output); err != nil {
		return nil, err
	}

	return &output, nil
}

func validateInput(input *EngineInput) error {
	if len(input.InputFiles) == 0 {
		return errors.New("input_files must not be empty")
	}
	if input.RulesetPath == "" {
		return errors.New("ruleset_path is required")
	}
	if input.OutputDir == "" {
		return errors.New("output_dir is required")
	}
	if input.RoundingMode == "" {
		input.RoundingMode = "bankers"
	}
	if input.Timezone == "" {
		input.Timezone = "UTC"
	}
	if input.InputFormat == "" {
		input.InputFormat = "auto"
	}
	if input.Mode == "" {
		input.Mode = "local"
	}

	if input.RoundingMode != "bankers" && input.RoundingMode != "half_up" {
		return fmt.Errorf("unsupported rounding_mode: %s", input.RoundingMode)
	}
	if input.InputFormat != "auto" && input.InputFormat != "csv" && input.InputFormat != "json" {
		return fmt.Errorf("unsupported input_format: %s", input.InputFormat)
	}
	if input.Mode != "local" && input.Mode != "ci" {
		return fmt.Errorf("unsupported mode: %s", input.Mode)
	}

	if input.Determinism.Rounding == "" {
		input.Determinism.Rounding = input.RoundingMode
	}
	if input.Determinism.Timezone == "" {
		input.Determinism.Timezone = input.Timezone
	}
	if len(input.Determinism.SortKeys) == 0 {
		input.Determinism.SortKeys = []string{"key", "source"}
	}

	return nil
}

func loadRuleset(path string) (*Ruleset, error) {
	bytes, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("read ruleset: %w", err)
	}

	var ruleset Ruleset
	if err := json.Unmarshal(bytes, &ruleset); err != nil {
		return nil, fmt.Errorf("parse ruleset json: %w", err)
	}

	if len(ruleset.KeyFields) == 0 {
		return nil, errors.New("ruleset key_fields must not be empty")
	}
	if ruleset.AmountField == "" {
		return nil, errors.New("ruleset amount_field is required")
	}
	if ruleset.CurrencyField == "" {
		ruleset.CurrencyField = "currency"
	}
	if ruleset.TimestampField == "" {
		ruleset.TimestampField = "timestamp"
	}
	if ruleset.AccountField == "" {
		ruleset.AccountField = "account"
	}

	return &ruleset, nil
}

func loadMapping(path *string) (*MappingConfig, error) {
	if path == nil || *path == "" {
		return &MappingConfig{Sources: map[string]FieldMapping{}}, nil
	}
	bytes, err := os.ReadFile(*path)
	if err != nil {
		return nil, fmt.Errorf("read mapping config: %w", err)
	}
	var mapping MappingConfig
	if err := json.Unmarshal(bytes, &mapping); err != nil {
		return nil, fmt.Errorf("parse mapping config: %w", err)
	}
	if mapping.Sources == nil {
		mapping.Sources = map[string]FieldMapping{}
	}
	return &mapping, nil
}

func resolveSources(ruleset *Ruleset, inputFiles []string) []string {
	if len(ruleset.Sources) == len(inputFiles) {
		return append([]string{}, ruleset.Sources...)
	}
	sources := make([]string, 0, len(inputFiles))
	for _, path := range inputFiles {
		base := filepath.Base(path)
		name := strings.TrimSuffix(base, filepath.Ext(base))
		sources = append(sources, name)
	}
	return sources
}

func resolvePath(baseDir string, path string) string {
	if filepath.IsAbs(path) {
		return path
	}
	return filepath.Join(baseDir, path)
}

func resolvePaths(baseDir string, paths []string) []string {
	resolved := make([]string, 0, len(paths))
	for _, path := range paths {
		resolved = append(resolved, resolvePath(baseDir, path))
	}
	return resolved
}

func detectFormat(path string) string {
	ext := strings.ToLower(filepath.Ext(path))
	if ext == ".csv" {
		return "csv"
	}
	if ext == ".json" {
		return "json"
	}
	return "csv"
}

func loadRecords(path string, format string) ([]map[string]string, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, fmt.Errorf("open input file %s: %w", path, err)
	}
	defer file.Close()

	switch format {
	case "csv":
		return readCSV(file)
	case "json":
		return readJSON(file)
	default:
		return nil, fmt.Errorf("unsupported format: %s", format)
	}
}

func readCSV(reader io.Reader) ([]map[string]string, error) {
	csvReader := csv.NewReader(reader)
	csvReader.TrimLeadingSpace = true
	rows, err := csvReader.ReadAll()
	if err != nil {
		return nil, fmt.Errorf("read csv: %w", err)
	}
	if len(rows) == 0 {
		return []map[string]string{}, nil
	}

	headers := rows[0]
	records := make([]map[string]string, 0, len(rows)-1)
	for _, row := range rows[1:] {
		record := make(map[string]string, len(headers))
		for i, header := range headers {
			if i < len(row) {
				record[strings.TrimSpace(header)] = strings.TrimSpace(row[i])
			}
		}
		records = append(records, record)
	}
	return records, nil
}

func readJSON(reader io.Reader) ([]map[string]string, error) {
	bytes, err := io.ReadAll(reader)
	if err != nil {
		return nil, fmt.Errorf("read json: %w", err)
	}
	var raw any
	if err := json.Unmarshal(bytes, &raw); err != nil {
		return nil, fmt.Errorf("parse json: %w", err)
	}

	records := make([]map[string]string, 0)
	switch typed := raw.(type) {
	case []any:
		for _, item := range typed {
			if object, ok := item.(map[string]any); ok {
				records = append(records, stringifyMap(object))
			}
		}
	case map[string]any:
		if items, ok := typed["records"].([]any); ok {
			for _, item := range items {
				if object, ok := item.(map[string]any); ok {
					records = append(records, stringifyMap(object))
				}
			}
		}
	default:
		return nil, errors.New("unsupported json structure")
	}
	return records, nil
}

func stringifyMap(data map[string]any) map[string]string {
	result := make(map[string]string, len(data))
	for key, value := range data {
		switch typed := value.(type) {
		case string:
			result[key] = typed
		case float64:
			result[key] = strconv.FormatFloat(typed, 'f', -1, 64)
		case bool:
			result[key] = strconv.FormatBool(typed)
		case nil:
			result[key] = ""
		default:
			bytes, _ := json.Marshal(typed)
			result[key] = string(bytes)
		}
	}
	return result
}

func mapRecord(record map[string]string, source string, ruleset *Ruleset, mapping *MappingConfig) map[string]string {
	fieldMapping, ok := mapping.Sources[source]
	if !ok {
		fieldMapping = FieldMapping{
			ID:        "id",
			Amount:    ruleset.AmountField,
			Currency:  ruleset.CurrencyField,
			Timestamp: ruleset.TimestampField,
			Account:   ruleset.AccountField,
		}
	}

	mapped := make(map[string]string, len(record)+2)
	for key, value := range record {
		mapped[key] = value
	}

	if fieldMapping.ID != "" {
		mapped["id"] = record[fieldMapping.ID]
	}
	if fieldMapping.Amount != "" {
		mapped[ruleset.AmountField] = record[fieldMapping.Amount]
	}
	if fieldMapping.Currency != "" {
		mapped[ruleset.CurrencyField] = record[fieldMapping.Currency]
	}
	if fieldMapping.Timestamp != "" {
		mapped[ruleset.TimestampField] = record[fieldMapping.Timestamp]
	}
	if fieldMapping.Account != "" {
		mapped["account"] = record[fieldMapping.Account]
	}

	return mapped
}

func buildKey(record map[string]string, fields []string) (string, []string) {
	parts := make([]string, 0, len(fields))
	warnings := make([]string, 0)
	for _, field := range fields {
		value := strings.TrimSpace(record[field])
		if value == "" {
			warnings = append(warnings, fmt.Sprintf("missing key field %s", field))
			return "", warnings
		}
		parts = append(parts, fmt.Sprintf("%s=%s", field, value))
	}
	return strings.Join(parts, "|"), warnings
}

func parseAmount(value string, rounding string) (int64, string) {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return 0, "missing amount"
	}

	negative := false
	if strings.HasPrefix(trimmed, "-") {
		negative = true
		trimmed = strings.TrimPrefix(trimmed, "-")
	}

	parts := strings.SplitN(trimmed, ".", 2)
	wholePart := parts[0]
	fractionPart := ""
	if len(parts) == 2 {
		fractionPart = parts[1]
	}
	if wholePart == "" {
		wholePart = "0"
	}
	wholeValue, err := strconv.ParseInt(wholePart, 10, 64)
	if err != nil {
		return 0, fmt.Sprintf("invalid amount: %s", value)
	}

	fractionDigits := fractionPart
	for len(fractionDigits) < 3 {
		fractionDigits += "0"
	}

	centsDigits := fractionDigits[:2]
	thirdDigit := fractionDigits[2]
	remainingDigits := ""
	if len(fractionDigits) > 3 {
		remainingDigits = fractionDigits[3:]
	}

	centsValue, err := strconv.ParseInt(centsDigits, 10, 64)
	if err != nil {
		return 0, fmt.Sprintf("invalid amount: %s", value)
	}

	if thirdDigit != '0' || remainingDigits != "" {
		switch rounding {
		case "half_up":
			if thirdDigit >= '5' {
				centsValue++
			}
		case "bankers":
			roundedUp := false
			if thirdDigit > '5' {
				centsValue++
				roundedUp = true
			} else if thirdDigit == '5' {
				if hasNonZero(remainingDigits) {
					centsValue++
					roundedUp = true
				} else if centsValue%2 == 1 {
					centsValue++
					roundedUp = true
				}
			}
			if roundedUp {
				// no-op, used for clarity
			}
		}
	}

	if centsValue >= 100 {
		wholeValue += centsValue / 100
		centsValue = centsValue % 100
	}

	result := wholeValue*100 + centsValue
	if negative {
		result = -result
	}
	return result, ""
}

func normalizeTimestamp(value string, location *time.Location) (string, string) {
	layouts := []string{
		time.RFC3339,
		"2006-01-02 15:04:05",
		"2006-01-02",
	}
	for _, layout := range layouts {
		if parsed, err := time.ParseInLocation(layout, value, location); err == nil {
			return parsed.In(location).Format(time.RFC3339), ""
		}
	}
	return value, fmt.Sprintf("unparsed timestamp: %s", value)
}

func computeVariances(records []NormalizedRecord, sources []string) ([]VarianceItem, VarianceSummary) {
	byKey := map[string]map[string]int64{}
	currencyByKey := map[string]string{}
	for _, record := range records {
		if _, ok := byKey[record.Key]; !ok {
			byKey[record.Key] = map[string]int64{}
		}
		byKey[record.Key][record.Source] += record.AmountCents
		if currencyByKey[record.Key] == "" {
			currencyByKey[record.Key] = record.Currency
		}
	}

	keys := make([]string, 0, len(byKey))
	for key := range byKey {
		keys = append(keys, key)
	}
	sort.Strings(keys)

	items := make([]VarianceItem, 0)
	counts := map[string]int{"missing_record": 0, "amount_mismatch": 0}

	for _, key := range keys {
		sourceAmounts := byKey[key]
		missingSources := make([]string, 0)
		amounts := make([]SourceAmount, 0, len(sources))
		for _, source := range sources {
			amount, ok := sourceAmounts[source]
			if !ok {
				missingSources = append(missingSources, source)
				continue
			}
			amounts = append(amounts, SourceAmount{Source: source, AmountCents: amount})
		}
		sort.Strings(missingSources)

		if len(missingSources) > 0 {
			items = append(items, VarianceItem{
				Key:             key,
				Type:            "missing_record",
				Currency:        currencyByKey[key],
				AmountsBySource: amounts,
				MissingSources:  missingSources,
			})
			counts["missing_record"]++
			continue
		}

		amountValues := make([]int64, 0, len(amounts))
		for _, amount := range amounts {
			amountValues = append(amountValues, amount.AmountCents)
		}
		allEqual := true
		for i := 1; i < len(amountValues); i++ {
			if amountValues[i] != amountValues[0] {
				allEqual = false
				break
			}
		}
		if !allEqual {
			items = append(items, VarianceItem{
				Key:             key,
				Type:            "amount_mismatch",
				Currency:        currencyByKey[key],
				AmountsBySource: amounts,
			})
			counts["amount_mismatch"]++
		}
	}

	sort.Slice(items, func(i, j int) bool {
		if items[i].Key != items[j].Key {
			return items[i].Key < items[j].Key
		}
		return items[i].Type < items[j].Type
	})

	summary := VarianceSummary{
		Total:        counts["missing_record"] + counts["amount_mismatch"],
		CountsByType: counts,
	}

	return items, summary
}

func writeJSONLines(path string, records any) error {
	file, err := os.Create(path)
	if err != nil {
		return fmt.Errorf("create %s: %w", path, err)
	}
	defer file.Close()

	writer := bufio.NewWriter(file)
	encoder := json.NewEncoder(writer)
	encoder.SetEscapeHTML(false)

	switch typed := records.(type) {
	case []NormalizedRecord:
		for _, record := range typed {
			if err := encoder.Encode(record); err != nil {
				return fmt.Errorf("write jsonl: %w", err)
			}
		}
		return writer.Flush()
	case []VarianceItem:
		for _, record := range typed {
			if err := encoder.Encode(record); err != nil {
				return fmt.Errorf("write jsonl: %w", err)
			}
		}
		return writer.Flush()
	default:
		return errors.New("unsupported jsonl record type")
	}
}

func writeJSONFile(path string, data any) error {
	file, err := os.Create(path)
	if err != nil {
		return fmt.Errorf("create %s: %w", path, err)
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	encoder.SetEscapeHTML(false)
	if err := encoder.Encode(data); err != nil {
		return fmt.Errorf("write json: %w", err)
	}
	return nil
}

func hashFile(path string) (string, error) {
	file, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer file.Close()

	hasher := sha256.New()
	if _, err := io.Copy(hasher, file); err != nil {
		return "", err
	}
	return fmt.Sprintf("%x", hasher.Sum(nil)), nil
}

func buildDeterministicStatement(input EngineInput) string {
	return fmt.Sprintf(
		"Outputs are deterministic for identical inputs when using sort keys %s, rounding mode %s, and timezone %s. The engine surfaces discrepancies based on the normalized inputs; evidence hashes cover emitted files.",
		strings.Join(input.Determinism.SortKeys, ", "),
		input.Determinism.Rounding,
		input.Determinism.Timezone,
	)
}

func hasNonZero(value string) bool {
	for _, char := range value {
		if char != '0' {
			return true
		}
	}
	return false
}
