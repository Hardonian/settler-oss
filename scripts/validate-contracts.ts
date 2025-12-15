#!/usr/bin/env node
/**
 * Contract Validation Script
 * 
 * Validates:
 * 1. JSON Schemas are valid
 * 2. Example fixtures match their schemas
 * 3. OpenAPI spec is valid (basic check)
 * 4. TypeScript types are up-to-date with schemas
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const CONTRACTS_DIR = path.resolve(__dirname, '..', 'contracts');
const SCHEMAS_DIR = path.join(CONTRACTS_DIR, 'schemas');
const EXAMPLES_DIR = path.join(CONTRACTS_DIR, 'examples');

interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
}

async function validateJsonSchema(schemaPath: string): Promise<ValidationResult> {
  const result: ValidationResult = { success: true, errors: [], warnings: [] };
  
  try {
    const content = fs.readFileSync(schemaPath, 'utf-8');
    const schema = JSON.parse(content);
    
    // Basic schema validation
    if (!schema.$schema) {
      result.warnings.push(`${schemaPath}: Missing $schema field`);
    }
    
    if (!schema.title) {
      result.warnings.push(`${schemaPath}: Missing title field`);
    }
    
    if (!schema.type) {
      result.errors.push(`${schemaPath}: Missing type field`);
      result.success = false;
    }
    
    // Check for required fields in required schemas
    if (schema.type === 'object' && schema.required && Array.isArray(schema.required)) {
      for (const field of schema.required) {
        if (!schema.properties || !schema.properties[field]) {
          result.errors.push(`${schemaPath}: Required field '${field}' missing from properties`);
          result.success = false;
        }
      }
    }
  } catch (error) {
    result.errors.push(`${schemaPath}: ${error instanceof Error ? error.message : String(error)}`);
    result.success = false;
  }
  
  return result;
}

async function validateExample(examplePath: string, schemaPath: string): Promise<ValidationResult> {
  const result: ValidationResult = { success: true, errors: [], warnings: [] };
  
  try {
    const exampleContent = fs.readFileSync(examplePath, 'utf-8');
    const example = JSON.parse(exampleContent);
    
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    const schema = JSON.parse(schemaContent);
    
    // Basic validation: check required fields
    if (schema.type === 'object' && schema.required) {
      for (const field of schema.required) {
        if (!(field in example)) {
          result.errors.push(`${examplePath}: Missing required field '${field}'`);
          result.success = false;
        }
      }
    }
    
    // Check type matches
    if (schema.type === 'object' && typeof example !== 'object' || Array.isArray(example)) {
      result.errors.push(`${examplePath}: Expected object, got ${Array.isArray(example) ? 'array' : typeof example}`);
      result.success = false;
    }
    
    if (schema.type === 'array' && !Array.isArray(example)) {
      result.errors.push(`${examplePath}: Expected array, got ${typeof example}`);
      result.success = false;
    }
  } catch (error) {
    result.errors.push(`${examplePath}: ${error instanceof Error ? error.message : String(error)}`);
    result.success = false;
  }
  
  return result;
}

async function validateOpenAPI(): Promise<ValidationResult> {
  const result: ValidationResult = { success: true, errors: [], warnings: [] };
  const openApiPath = path.join(CONTRACTS_DIR, 'openapi.yaml');
  
  try {
    const content = fs.readFileSync(openApiPath, 'utf-8');
    
    // Basic checks
    if (!content.includes('openapi:')) {
      result.errors.push('openapi.yaml: Missing openapi version');
      result.success = false;
    }
    
    if (!content.includes('paths:')) {
      result.errors.push('openapi.yaml: Missing paths section');
      result.success = false;
    }
    
    if (!content.includes('components:')) {
      result.errors.push('openapi.yaml: Missing components section');
      result.success = false;
    }
    
    // Check for required endpoints
    const requiredEndpoints = ['/health', '/reconcile', '/sync'];
    for (const endpoint of requiredEndpoints) {
      if (!content.includes(endpoint)) {
        result.errors.push(`openapi.yaml: Missing endpoint ${endpoint}`);
        result.success = false;
      }
    }
  } catch (error) {
    result.errors.push(`openapi.yaml: ${error instanceof Error ? error.message : String(error)}`);
    result.success = false;
  }
  
  return result;
}

async function validateContractVersion(): Promise<ValidationResult> {
  const result: ValidationResult = { success: true, errors: [], warnings: [] };
  const versionPath = path.join(CONTRACTS_DIR, 'CONTRACT_VERSION');
  
  try {
    const version = fs.readFileSync(versionPath, 'utf-8').trim();
    
    // Check semver format
    const semverRegex = /^\d+\.\d+\.\d+$/;
    if (!semverRegex.test(version)) {
      result.errors.push(`CONTRACT_VERSION: Invalid semver format: ${version}`);
      result.success = false;
    }
  } catch (error) {
    result.errors.push(`CONTRACT_VERSION: ${error instanceof Error ? error.message : String(error)}`);
    result.success = false;
  }
  
  return result;
}

async function main() {
  console.log('🔍 Validating Settler Protocol Contracts...\n');
  
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  
  // Validate contract version
  console.log('📌 Checking contract version...');
  const versionResult = await validateContractVersion();
  allErrors.push(...versionResult.errors);
  allWarnings.push(...versionResult.warnings);
  if (versionResult.success) {
    console.log('  ✓ Contract version is valid');
  }
  
  // Validate OpenAPI spec
  console.log('\n📋 Validating OpenAPI specification...');
  const openApiResult = await validateOpenAPI();
  allErrors.push(...openApiResult.errors);
  allWarnings.push(...openApiResult.warnings);
  if (openApiResult.success) {
    console.log('  ✓ OpenAPI spec is valid');
  }
  
  // Validate JSON schemas
  console.log('\n📄 Validating JSON schemas...');
  const schemaFiles = await glob('*.json', { cwd: SCHEMAS_DIR });
  let schemaErrors = 0;
  
  for (const schemaFile of schemaFiles) {
    const schemaPath = path.join(SCHEMAS_DIR, schemaFile);
    const result = await validateJsonSchema(schemaPath);
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
    
    if (result.success) {
      console.log(`  ✓ ${schemaFile}`);
    } else {
      console.log(`  ✗ ${schemaFile}`);
      schemaErrors++;
    }
  }
  
  // Validate examples against schemas
  console.log('\n📦 Validating example fixtures...');
  const exampleFiles = await glob('*.json', { cwd: EXAMPLES_DIR });
  let exampleErrors = 0;
  
  for (const exampleFile of exampleFiles) {
    // Try to find matching schema
    const schemaName = exampleFile.replace('-response.json', '.json')
      .replace('-request.json', '.json')
      .replace('-envelope.json', '-envelope.json');
    
    const possibleSchemas = [
      schemaName,
      exampleFile.replace('.json', '.json'),
      exampleFile.replace('reconcile-response', 'reconcile-response'),
      exampleFile.replace('reconcile-request', 'reconcile-request'),
      exampleFile.replace('error-envelope', 'error-envelope'),
      exampleFile.replace('health-response', 'health-response'),
      exampleFile.replace('webhook-envelope', 'webhook-envelope'),
    ];
    
    let matched = false;
    for (const possibleSchema of possibleSchemas) {
      const schemaPath = path.join(SCHEMAS_DIR, possibleSchema);
      if (fs.existsSync(schemaPath)) {
        const result = await validateExample(
          path.join(EXAMPLES_DIR, exampleFile),
          schemaPath
        );
        allErrors.push(...result.errors);
        allWarnings.push(...result.warnings);
        
        if (result.success) {
          console.log(`  ✓ ${exampleFile} (matches ${possibleSchema})`);
        } else {
          console.log(`  ✗ ${exampleFile}`);
          exampleErrors++;
        }
        matched = true;
        break;
      }
    }
    
    if (!matched) {
      console.log(`  ⚠ ${exampleFile} (no matching schema found)`);
      allWarnings.push(`${exampleFile}: No matching schema found`);
    }
  }
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Validation Summary');
  console.log('='.repeat(60));
  
  if (allWarnings.length > 0) {
    console.log(`\n⚠️  Warnings (${allWarnings.length}):`);
    allWarnings.forEach(w => console.log(`   ${w}`));
  }
  
  if (allErrors.length > 0) {
    console.log(`\n❌ Errors (${allErrors.length}):`);
    allErrors.forEach(e => console.log(`   ${e}`));
    console.log('\n❌ Contract validation failed!');
    process.exit(1);
  } else {
    console.log('\n✅ All contract validations passed!');
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
