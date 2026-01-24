# Stack Agnosticity

**Version:** 1.0.0
**Last Updated:** 2026-01-24
**Status:** Binding Design Principle

This document establishes Settler's **provider-agnostic architecture**, ensuring the OSS components and protocol work with any financial system, payment processor, or accounting platform without vendor-specific coupling.

---

## 🎯 Core Principle

> **Settler OSS is a neutral reconciliation protocol, not a Stripe tool or QuickBooks plugin.
> It works with any system that produces financial transactions.**

---

## 📋 What Settler Intentionally Does NOT Assume

### ❌ Provider-Specific Assumptions (Forbidden)

#### Payment Processors
**NO assumptions about:**
- Stripe's charge object schema
- PayPal's transaction API format
- Square's payment types
- Braintree's settlement timing
- Any specific provider's ID format

**Example violation:**
```typescript
// ❌ WRONG - Assumes Stripe charge IDs
function isValidTransactionId(id: string): boolean {
  return id.startsWith('ch_') || id.startsWith('pi_');  // Stripe-specific!
}

// ✅ CORRECT - Generic validation
function isValidTransactionId(id: string): boolean {
  return id.length > 0 && typeof id === 'string';
}
```

#### E-commerce Platforms
**NO assumptions about:**
- Shopify's order object structure
- WooCommerce's payment statuses
- Magento's transaction lifecycle
- Any platform's product taxonomy

**Example:**
```typescript
// ❌ WRONG - Shopify-specific field
interface Transaction {
  shopifyOrderId?: string;  // Too specific!
}

// ✅ CORRECT - Generic metadata
interface Transaction {
  id: string;
  amount: Decimal;
  date: string;
  metadata?: Record<string, unknown>;  // ← Provider data goes here
}
```

#### Accounting Systems
**NO assumptions about:**
- QuickBooks' chart of accounts structure
- Xero's account codes
- NetSuite's multi-entity model
- GAAP vs IFRS accounting standards

---

### ❌ Infrastructure Assumptions (Forbidden)

#### Cloud Providers
**NO assumptions about:**
- AWS services (S3, Lambda, DynamoDB)
- GCP equivalents (Cloud Storage, Cloud Functions, Firestore)
- Azure services
- Specific database vendors (PostgreSQL, MySQL, MongoDB)

**Why it matters:**
- OSS users may run on any infrastructure
- Self-hosted users choose their own stack
- Cloud provider lock-in violates OSS principles

#### Authentication
**NO assumptions about:**
- OAuth 2.0 implementation (provider-specific)
- JWT token format
- API key prefixes
- SAML assertions

**Example:**
```typescript
// ❌ WRONG - Assumes OAuth
interface Credentials {
  accessToken: string;
  refreshToken: string;
}

// ✅ CORRECT - Generic credentials
interface Credentials {
  [key: string]: unknown;  // Provider-specific credential format
}
```

---

### ❌ Regional Assumptions (Forbidden)

#### Currency
**NO assumptions about:**
- USD as default currency
- Currency symbol formats ($, €, £, ¥)
- Decimal vs non-decimal currencies (JPY, KRW)
- Exchange rate sources or timing

**Enforcement:**
```typescript
// ✅ CORRECT - Explicit currency required
interface Transaction {
  amount: Decimal;
  currency?: string;  // ISO 4217 code (USD, EUR, GBP, JPY, etc.)
}

// Validation: Warn if mixed currencies
function validateCurrency(transactions: Transaction[]) {
  const currencies = new Set(transactions.map(t => t.currency || 'UNKNOWN'));
  if (currencies.size > 1) {
    console.warn(`Warning: Mixed currencies detected: ${Array.from(currencies).join(', ')}`);
  }
}
```

#### Date/Time
**NO assumptions about:**
- Timezones (always UTC or user-specified)
- Date formats (always ISO 8601: YYYY-MM-DD)
- Fiscal year start date (varies by country/company)
- Weekend/holiday calendars

#### Regulations
**NO assumptions about:**
- US tax regulations (1099-K thresholds, etc.)
- EU GDPR specifics
- Country-specific compliance (SOX, HIPAA, PCI-DSS)
- Industry-specific rules (FINRA, etc.)

---

## ✅ What Settler DOES Assume (Minimal Contract)

### Required Transaction Fields

```typescript
interface Transaction {
  id: string;         // Unique identifier (format: provider-defined)
  amount: Decimal;    // Numeric amount (currency-agnostic)
  date: string;       // ISO 8601 date (YYYY-MM-DD)
  [key: string]: unknown;  // Additional provider-specific fields
}
```

**That's it.** These three fields are the only hard requirements.

### Optional Common Fields

```typescript
interface Transaction {
  id: string;
  amount: Decimal;
  date: string;

  // Optional but recommended:
  description?: string;      // Human-readable description
  currency?: string;         // ISO 4217 code (USD, EUR, etc.)
  status?: string;           // Provider-defined (e.g., "completed", "pending")
  metadata?: Record<string, unknown>;  // Arbitrary provider data
}
```

**Why optional:**
- Not all systems provide descriptions
- Some systems have implicit currency (single-currency accounts)
- Status semantics vary wildly by provider

---

## 🏗️ Provider-Agnostic Architecture

### Adapter Pattern (Enterprise Only)

**Purpose:** Translate provider-specific data to Settler's generic Transaction format.

```typescript
/**
 * Generic adapter interface (OSS protocol)
 */
interface DataAdapter {
  authenticate(credentials: unknown): Promise<void>;
  fetchTransactions(query: unknown): Promise<Transaction[]>;
}

/**
 * Example: Stripe adapter (Enterprise implementation)
 */
class StripeAdapter implements DataAdapter {
  async authenticate(credentials: { apiKey: string }): Promise<void> {
    // Stripe-specific OAuth or API key validation
  }

  async fetchTransactions(query: { startDate: string; endDate: string }): Promise<Transaction[]> {
    // Fetch Stripe charges
    const charges = await stripe.charges.list(query);

    // Translate to generic Transaction format
    return charges.data.map(charge => ({
      id: charge.id,
      amount: new Decimal(charge.amount).div(100),  // Stripe uses cents
      date: new Date(charge.created * 1000).toISOString().split('T')[0],
      description: charge.description || '',
      currency: charge.currency.toUpperCase(),
      metadata: {
        stripeChargeId: charge.id,
        customerId: charge.customer,
        // ... other Stripe-specific fields
      },
    }));
  }
}
```

**Key insight:** Adapter complexity is **hidden from OSS users**. They only see generic `Transaction[]`.

---

### OSS User Strategy: Direct Integration

**OSS users don't have managed adapters.** Instead, they:

1. **Use provider SDKs directly** (Stripe SDK, Shopify SDK, etc.)
2. **Transform to Settler's Transaction format**
3. **Call reconciliation API**

**Example:**
```typescript
import Stripe from 'stripe';
import { SettlerClient } from '@settler/sdk';

const stripe = new Stripe(process.env.STRIPE_API_KEY);
const settler = new SettlerClient({ apiKey: process.env.SETTLER_API_KEY });

// Fetch Stripe charges (using Stripe SDK)
const charges = await stripe.charges.list({
  created: { gte: startTimestamp, lte: endTimestamp },
});

// Transform to Settler format
const stripeTransactions = charges.data.map(charge => ({
  id: charge.id,
  amount: charge.amount / 100,  // Convert cents to dollars
  date: new Date(charge.created * 1000).toISOString().split('T')[0],
  description: charge.description || '',
  currency: charge.currency.toUpperCase(),
}));

// Reconcile with accounting system transactions
const result = await settler.reconcile({
  source: stripeTransactions,
  target: quickbooksTransactions,
});
```

**No Settler-specific Stripe code in OSS.** User handles provider integration.

---

## 🌍 Supported Categories (Not Vendors)

Settler is designed to work with **categories of systems**, not specific vendors.

### Category 1: Payment Processors
**Common characteristics:**
- Produce transaction records (charges, refunds, payouts)
- Time-based queries (fetch transactions in date range)
- Unique transaction IDs
- Amount in currency units or subunits (dollars vs cents)

**Examples:** Stripe, PayPal, Square, Braintree, Adyen, Authorize.Net

**Adapter responsibilities:**
- Fetch transactions via provider API
- Normalize amounts (cents → dollars, etc.)
- Extract date from timestamp
- Map provider statuses to generic format

---

### Category 2: E-commerce Platforms
**Common characteristics:**
- Order-based model (orders contain payments)
- Multi-channel (online, POS, mobile)
- Inventory and fulfillment data (may not be relevant for reconciliation)

**Examples:** Shopify, WooCommerce, Magento, BigCommerce

**Adapter responsibilities:**
- Extract payment transactions from orders
- Handle refunds and chargebacks
- Normalize tax and shipping (if included in amounts)
- Deduplicate multi-payment orders

---

### Category 3: Accounting Systems
**Common characteristics:**
- Double-entry bookkeeping (debits/credits)
- Chart of accounts (categories for transactions)
- Journal entries and ledger
- Multi-entity support (subsidiaries, departments)

**Examples:** QuickBooks, Xero, NetSuite, FreshBooks, Sage

**Adapter responsibilities:**
- Query specific accounts (e.g., "Revenue" account)
- Filter by date range
- Translate debits/credits to amounts (sign convention)
- Handle multi-currency accounts

---

### Category 4: Banking / Financial Institutions
**Common characteristics:**
- Account statements (deposits, withdrawals, transfers)
- ACH, wire, check transactions
- Balance tracking
- Regulatory reporting (1099, etc.)

**Examples:** Plaid, Yodlee, bank APIs (Wells Fargo, Chase, etc.)

**Adapter responsibilities:**
- Fetch account transactions
- Normalize pending vs posted transactions
- Handle holds and reversals
- Sanitize sensitive data (account numbers, etc.)

---

### Category 5: Custom / Proprietary Systems
**Common characteristics:**
- Internal databases (PostgreSQL, MySQL, etc.)
- CSV exports from legacy systems
- Spreadsheet-based workflows
- API-less systems (file-based integration)

**Adapter responsibilities:**
- Query database or parse files
- Map custom schemas to Settler Transaction format
- Handle missing fields (infer or default)

---

## 🔧 How to Add New Providers Safely

### For OSS Users (Self-Hosted)

**Step 1: Identify provider API**
- Documentation URL
- Authentication method (API key, OAuth, etc.)
- Transaction query endpoint
- Rate limits and pagination

**Step 2: Choose integration method**
- Use official provider SDK (recommended)
- Or: Direct HTTP API calls

**Step 3: Transform to Settler format**
```typescript
function transformProviderTransactions(providerData: unknown[]): Transaction[] {
  return providerData.map(item => ({
    id: extractId(item),
    amount: extractAmount(item),
    date: extractDate(item),
    description: extractDescription(item),
    currency: extractCurrency(item),
    metadata: { original: item },  // Preserve raw data
  }));
}
```

**Step 4: Test with sample data**
- Ensure all required fields present
- Validate amount precision
- Check date format
- Run reconciliation with known matches

**Step 5: (Optional) Contribute back to OSS**
- Share example adapter in `examples/integrations/`
- Document provider quirks (e.g., "Stripe amounts are in cents")
- Community can learn from your work

---

### For Enterprise Users (Managed Adapters)

**Step 1: Request new adapter**
- Email: support@settler.dev
- Include: Provider name, API docs, use case
- Enterprise SLA: New adapters within 30 days (subject to feasibility)

**Step 2: Settler builds and tests adapter**
- Implements OAuth flow (if required)
- Tests with sandbox/test accounts
- Validates data quality

**Step 3: Adapter available in Console**
- Configure credentials in UI
- Select accounts/date ranges
- Adapter handles API calls automatically

---

## 🚫 Anti-Patterns to Avoid

### ❌ Hardcoding Provider Names
```typescript
// ❌ WRONG - Hardcoded provider check
if (transaction.source === 'stripe') {
  // Stripe-specific logic
}

// ✅ CORRECT - Provider-agnostic logic
if (transaction.metadata?.providerName === 'stripe') {
  // Optional metadata-based logic (if needed)
}
```

### ❌ Assuming Field Names
```typescript
// ❌ WRONG - Assumes QuickBooks field names
const invoiceNumber = transaction.qboInvoiceNumber;

// ✅ CORRECT - Generic metadata access
const invoiceNumber = transaction.metadata?.invoiceNumber;
```

### ❌ Vendor-Specific Validations
```typescript
// ❌ WRONG - Stripe charge ID validation
function isValidId(id: string) {
  return /^(ch_|pi_)/.test(id);
}

// ✅ CORRECT - Generic validation
function isValidId(id: string) {
  return typeof id === 'string' && id.length > 0;
}
```

### ❌ Currency Assumptions
```typescript
// ❌ WRONG - Assumes USD
function formatAmount(amount: Decimal): string {
  return `$${amount.toFixed(2)}`;
}

// ✅ CORRECT - Currency-agnostic
function formatAmount(amount: Decimal, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount.toNumber());
}
```

---

## ✅ Provider-Agnostic Checklist

**Before adding any provider-specific code, verify:**

- [ ] Is this logic truly provider-specific, or can it be generalized?
- [ ] Can I use metadata instead of hardcoded fields?
- [ ] Am I assuming a specific data format (dates, amounts, IDs)?
- [ ] Will this code work with other providers in the same category?
- [ ] Is this coupling necessary, or just convenient?

**Golden rule:** If you're checking `if (provider === 'X')`, you're probably doing it wrong.

---

## 🔬 Testing Stack Agnosticity

### Test with Multiple Providers

**Example test:**
```typescript
describe('Stack Agnosticity', () => {
  const providers = ['stripe', 'paypal', 'square', 'manual'];

  providers.forEach(provider => {
    test(`Reconciliation works with ${provider} transactions`, () => {
      const transactions = loadSampleData(provider);
      const result = reconcile(transactions, targetTransactions);

      expect(result.matched.length).toBeGreaterThan(0);
      assertBalancePreserved(result);
    });
  });
});
```

### Test with Generic Data

**Synthetic transactions (no provider):**
```typescript
const genericTransactions: Transaction[] = [
  { id: 'txn_001', amount: new Decimal(100), date: '2026-01-15' },
  { id: 'txn_002', amount: new Decimal(250), date: '2026-01-16' },
];

// Should work just fine
const result = reconcile(genericTransactions, targetTransactions);
```

---

## 📊 Provider Compatibility Matrix

| Provider Category | OSS Compatible | Enterprise Managed Adapter | Notes |
|-------------------|----------------|---------------------------|-------|
| **Payment Processors** | ✅ Yes | ✅ Yes (50+ providers) | Use provider SDK + transform |
| **E-commerce** | ✅ Yes | ✅ Yes | Extract payments from orders |
| **Accounting** | ✅ Yes | ✅ Yes | Query revenue/expense accounts |
| **Banking** | ✅ Yes | ✅ Yes (via Plaid/Yodlee) | May require aggregator |
| **Custom CSV** | ✅ Yes | ⚠️ Manual setup | Parse CSV → Transaction[] |
| **Internal DB** | ✅ Yes | ⚠️ Custom integration | SQL query → Transaction[] |
| **Spreadsheets** | ✅ Yes | ❌ No | Export to CSV first |

---

## 🌟 Why Stack Agnosticity Matters

### For OSS Users
- ✅ Works with any data source (not locked to specific providers)
- ✅ Future-proof (add new providers without SDK updates)
- ✅ Enables hybrid workflows (mix Stripe + custom systems)

### For Enterprise Users
- ✅ Faster adapter development (consistent patterns)
- ✅ Reliable behavior across providers
- ✅ Easy to add new providers (standard interface)

### For Settler (Business)
- ✅ Avoids vendor partnerships (no Stripe/QuickBooks dependencies)
- ✅ Market agnostic (works in any geography)
- ✅ Competitive moat (not "yet another Stripe tool")

---

## 🔗 Related Documentation

- **[INVARIANTS.md](./INVARIANTS.md)** - Financial and data invariants
- **[OSS_VS_ENTERPRISE_BOUNDARY.md](./OSS_VS_ENTERPRISE_BOUNDARY.md)** - OSS/Enterprise boundaries
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture

---

**This document is binding.** All Settler code must adhere to stack-agnostic principles.

**Last Updated:** 2026-01-24 • **Version:** 1.0.0
