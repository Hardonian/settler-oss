# Reconcile Your First Dataset in 10 Minutes

**Estimated time:** 10 minutes
**Difficulty:** Beginner
**Prerequisites:** Node.js 18+ or Python 3.8+

This guide gets you from zero to your first reconciliation in under 10 minutes.

---

## 🎯 What You'll Build

By the end of this guide, you'll reconcile two transaction datasets (e.g., payment processor vs accounting system) and see:
- ✅ Which transactions matched
- ⚠️ Which transactions are missing from each side
- 📊 Summary statistics

---

## 🚀 Quick Start Paths

Choose your preferred path:

- **Path A:** [CLI Demo (Fastest)](#path-a-cli-demo-fastest---2-minutes) — 2 minutes, no coding
- **Path B:** [Local CSV Reconciliation](#path-b-local-csv-reconciliation---5-minutes) — 5 minutes, your own data
- **Path C:** [Cloud API Integration](#path-c-cloud-api-integration---10-minutes) — 10 minutes, production-ready

---

## Path A: CLI Demo (Fastest) — 2 Minutes

**Perfect for:** Seeing Settler in action immediately.

### Step 1: Install CLI

```bash
npm install -g @settler/cli
```

**Or with npx (no install):**
```bash
npx @settler/cli demo
```

### Step 2: Run Demo

```bash
settler demo
```

**Output:**
```
🎬 Running Settler Demo...

Source transactions: 5
Target transactions: 5

Running reconciliation...

✅ MATCHED (4 pairs)
Source ID    Target ID    Amount     Date
ch_1234      inv_001      $100.00    2026-01-15
ch_1235      inv_002      $250.50    2026-01-16
ch_1236      inv_003      $75.25     2026-01-17
ch_1237      inv_004      $500.00    2026-01-18

⚠️ UNMATCHED SOURCE (1)
ch_1238      $120.00    2026-01-19    Payment from Customer E

⚠️ UNMATCHED TARGET (1)
inv_006      $200.00    2026-01-20    Invoice 006 - Customer F

📚 What happened:
  • 4 transactions matched perfectly
  • 1 payment(s) with no matching invoice
  • 1 invoice(s) with no matching payment
```

**✅ Done!** You just ran your first reconciliation.

**Next steps:**
- Try [Path B](#path-b-local-csv-reconciliation---5-minutes) to reconcile your own CSV files
- Or [Path C](#path-c-cloud-api-integration---10-minutes) for production setup

---

## Path B: Local CSV Reconciliation — 5 Minutes

**Perfect for:** Testing with your own transaction data (no cloud account needed).

### Step 1: Prepare Your CSV Files

Create two CSV files with your transaction data:

**source.csv** (e.g., payment processor)
```csv
id,amount,date,description
ch_001,100.00,2026-01-15,Payment from Customer A
ch_002,250.50,2026-01-16,Payment from Customer B
ch_003,75.25,2026-01-17,Payment from Customer C
```

**target.csv** (e.g., accounting system)
```csv
id,amount,date,description
inv_001,100.00,2026-01-15,Invoice 001 - Customer A
inv_002,250.50,2026-01-16,Invoice 002 - Customer B
inv_004,200.00,2026-01-18,Invoice 004 - Customer D (no payment yet)
```

**Required columns:** `id`, `amount`, `date`
**Optional columns:** `description`, `currency`, or any custom fields

### Step 2: Install CLI

```bash
npm install -g @settler/cli
```

### Step 3: Run Reconciliation

```bash
settler reconcile --source source.csv --target target.csv
```

**Output:**
```
📊 Reconciliation Results

✅ MATCHED (2 pairs)
Source      Target      Amount     Date        Confidence
ch_001      inv_001     $100.00    2026-01-15  100%
ch_002      inv_002     $250.50    2026-01-16  100%

⚠️ UNMATCHED SOURCE (1)
ch_003      $75.25     2026-01-17    Payment from Customer C

⚠️ UNMATCHED TARGET (1)
inv_004     $200.00    2026-01-18    Invoice 004 - Customer D

Summary:
  Total source:      3 transactions    $425.75
  Total target:      3 transactions    $550.50
  Matched:           2 pairs            $350.50
  Unmatched source:  1 transaction     $75.25
  Unmatched target:  1 transaction     $200.00
  Match rate:        66.7%
```

### Step 4: (Optional) Export Results

```bash
settler reconcile \
  --source source.csv \
  --target target.csv \
  --output results.json \
  --format json
```

**results.json:**
```json
{
  "matched": [
    {
      "source": { "id": "ch_001", "amount": 100.00, "date": "2026-01-15" },
      "target": { "id": "inv_001", "amount": 100.00, "date": "2026-01-15" },
      "confidence": 1.0
    }
  ],
  "unmatched": {
    "source": [{ "id": "ch_003", "amount": 75.25, "date": "2026-01-17" }],
    "target": [{ "id": "inv_004", "amount": 200.00, "date": "2026-01-18" }]
  },
  "summary": {
    "matched": 2,
    "unmatchedSource": 1,
    "unmatchedTarget": 1
  }
}
```

**✅ Done!** You reconciled your own data locally.

**Limitations of local CLI:**
- ✅ Works offline (no cloud needed)
- ✅ Great for testing and development
- ⚠️ Only exact matching (amount + date)
- ❌ No fuzzy matching or advanced rules
- ❌ No webhooks or scheduled jobs

**For production use:** See [Path C](#path-c-cloud-api-integration---10-minutes) below.

---

## Path C: Cloud API Integration — 10 Minutes

**Perfect for:** Production workflows with advanced matching, webhooks, and managed adapters.

### Step 1: Get Free API Key

1. Visit [settler.dev](https://settler.dev)
2. Sign up (free tier: 100 transactions/month)
3. Copy your API key from the dashboard

### Step 2: Install SDK

**TypeScript/Node.js:**
```bash
npm install @settler/sdk
```

**Python:**
```bash
pip install settler-sdk
```

**Go:**
```bash
go get github.com/shardie-github/settler-oss/packages/sdk-go
```

### Step 3: Set API Key

```bash
export SETTLER_API_KEY="sk_live_..."
```

**Or create `.env` file:**
```bash
SETTLER_API_KEY=sk_live_...
```

### Step 4: Write Reconciliation Code

**TypeScript:**
```typescript
import { SettlerClient } from '@settler/sdk';

const client = new SettlerClient({
  apiKey: process.env.SETTLER_API_KEY,
});

async function reconcile() {
  const sourceTransactions = [
    { id: 'ch_001', amount: 100.00, date: '2026-01-15', description: 'Payment A' },
    { id: 'ch_002', amount: 250.50, date: '2026-01-16', description: 'Payment B' },
    { id: 'ch_003', amount: 75.25, date: '2026-01-17', description: 'Payment C' },
  ];

  const targetTransactions = [
    { id: 'inv_001', amount: 100.00, date: '2026-01-15', description: 'Invoice A' },
    { id: 'inv_002', amount: 250.50, date: '2026-01-16', description: 'Invoice B' },
    { id: 'inv_004', amount: 200.00, date: '2026-01-18', description: 'Invoice D' },
  ];

  const result = await client.reconcile({
    source: sourceTransactions,
    target: targetTransactions,
  });

  console.log('Matched:', result.summary.matched);
  console.log('Unmatched source:', result.summary.unmatchedSource);
  console.log('Unmatched target:', result.summary.unmatchedTarget);

  // Display matches
  result.matched.forEach(match => {
    console.log(`✅ ${match.source.id} → ${match.target.id} ($${match.source.amount})`);
  });

  // Display unmatched
  result.unmatched.source.forEach(txn => {
    console.log(`⚠️ Unmatched source: ${txn.id} ($${txn.amount})`);
  });
}

reconcile().catch(console.error);
```

**Python:**
```python
from settler_sdk import SettlerClient
import os

client = SettlerClient(api_key=os.getenv('SETTLER_API_KEY'))

source_transactions = [
    {'id': 'ch_001', 'amount': 100.00, 'date': '2026-01-15'},
    {'id': 'ch_002', 'amount': 250.50, 'date': '2026-01-16'},
    {'id': 'ch_003', 'amount': 75.25, 'date': '2026-01-17'},
]

target_transactions = [
    {'id': 'inv_001', 'amount': 100.00, 'date': '2026-01-15'},
    {'id': 'inv_002', 'amount': 250.50, 'date': '2026-01-16'},
    {'id': 'inv_004', 'amount': 200.00, 'date': '2026-01-18'},
]

result = client.reconcile(
    source=source_transactions,
    target=target_transactions
)

print(f"Matched: {result['summary']['matched']}")
print(f"Unmatched source: {result['summary']['unmatchedSource']}")
print(f"Unmatched target: {result['summary']['unmatchedTarget']}")
```

### Step 5: Run Your Code

```bash
node reconcile.js
# or: python reconcile.py
```

**Output:**
```
Matched: 2
Unmatched source: 1
Unmatched target: 1
✅ ch_001 → inv_001 ($100)
✅ ch_002 → inv_002 ($250.5)
⚠️ Unmatched source: ch_003 ($75.25)
```

**✅ Done!** You just used the Cloud API.

### Step 6: (Optional) Enable Advanced Features

**Fuzzy matching (tolerance bands):**
```typescript
const result = await client.reconcile({
  source: sourceTransactions,
  target: targetTransactions,
  rules: {
    tolerance: 0.01,  // Match if amounts within $0.01
    dateRange: 3,     // Match if dates within 3 days
  },
});
```

**Webhooks (get notified when reconciliation completes):**
```typescript
const result = await client.reconcile({
  source: sourceTransactions,
  target: targetTransactions,
  webhookUrl: 'https://myapp.com/webhooks/settler',
});

// Your webhook receives:
// POST https://myapp.com/webhooks/settler
// { type: 'reconcile.completed', jobId: '...', data: {...} }
```

**Scheduled jobs (automate daily reconciliations):**
- Configure in [Settler Console](https://settler.dev/console)
- Set schedule: Daily at 2am UTC
- Select data sources (Stripe, QuickBooks, etc.)
- Add webhook URL for notifications

---

## 🎓 What You've Learned

✅ **Run a demo reconciliation** (Path A)
✅ **Reconcile CSV files locally** (Path B)
✅ **Use Settler Cloud API** (Path C)
✅ **Understand matched vs unmatched transactions**
✅ **See summary statistics**

---

## 🚀 Next Steps

### 1. Connect Real Data Sources

**With Cloud (Enterprise):**
- Use managed adapters for Stripe, Shopify, QuickBooks, etc.
- Configure OAuth in Developer Console
- No code changes needed

**With OSS (Self-Hosted):**
```typescript
import Stripe from 'stripe';
import { SettlerClient } from '@settler/sdk';

const stripe = new Stripe(process.env.STRIPE_API_KEY);
const settler = new SettlerClient({ apiKey: process.env.SETTLER_API_KEY });

// Fetch Stripe charges
const charges = await stripe.charges.list({ limit: 100 });

// Transform to Settler format
const stripeTransactions = charges.data.map(charge => ({
  id: charge.id,
  amount: charge.amount / 100,  // Stripe uses cents
  date: new Date(charge.created * 1000).toISOString().split('T')[0],
  description: charge.description || '',
  currency: charge.currency.toUpperCase(),
}));

// Reconcile with accounting system
const result = await settler.reconcile({
  source: stripeTransactions,
  target: quickbooksTransactions,
});
```

### 2. Build a UI

Use React components to visualize results:

```tsx
import { ReconcileForm, ResultsTable } from '@settler/react-settler';

function ReconciliationDashboard() {
  const [results, setResults] = useState(null);

  const handleReconcile = async (config) => {
    const result = await settlerClient.reconcile(config);
    setResults(result);
  };

  return (
    <div>
      <ReconcileForm onSubmit={handleReconcile} />
      {results && <ResultsTable results={results} />}
    </div>
  );
}
```

### 3. Automate Reconciliations

**Schedule daily/weekly jobs:**
- Cloud: Configure in Developer Console (cron schedules)
- Self-hosted: Use cron, Celery, or cloud functions

**Example cron job:**
```bash
# Run daily at 2am
0 2 * * * /usr/bin/node /path/to/reconcile.js >> /var/log/reconcile.log 2>&1
```

### 4. Handle Exceptions

**Review unmatched transactions:**
```typescript
const result = await settler.reconcile({ source, target });

// Log unmatched for manual review
result.unmatched.source.forEach(txn => {
  console.warn('Missing in target:', txn.id, txn.amount, txn.date);
  // Send to Slack, create Jira ticket, etc.
});
```

**Export for auditing:**
```typescript
import fs from 'fs';

// Export results to CSV for accountants
const csv = convertToCsv(result);
fs.writeFileSync('reconciliation_2026-01-24.csv', csv);
```

---

## 📚 Learn More

**Documentation:**
- [SDK Reference](../packages/sdk/README.md) - Full API documentation
- [Protocol Types](../packages/protocol/README.md) - Type definitions
- [Architecture](./ARCHITECTURE.md) - How Settler works
- [Invariants](./INVARIANTS.md) - Financial correctness guarantees

**Examples:**
- [Advanced Matching](../examples/advanced-matching/) - Fuzzy matching, tolerance bands
- [Integrations](../examples/integrations/) - Stripe, Shopify, QuickBooks examples
- [Scenarios](../examples/scenarios/) - Real-world use cases

**Community:**
- [GitHub Discussions](https://github.com/shardie-github/settler-oss/discussions) - Ask questions
- [Issues](https://github.com/shardie-github/settler-oss/issues) - Report bugs
- [Contributing](../CONTRIBUTING.md) - Contribute code or docs

---

## 💡 Tips & Tricks

**Performance:**
- Batch large datasets (reconcile 10k transactions at a time)
- Use pagination for very large result sets
- Cache reconciliation results (they're deterministic)

**Accuracy:**
- Always validate data before reconciliation (check for nulls, invalid dates)
- Test with known matches first (sanity check)
- Review unmatched transactions regularly (they indicate data issues)

**Security:**
- Never commit API keys to git (use environment variables)
- Rotate API keys regularly (especially if exposed)
- Use HTTPS endpoints only (never HTTP)

**Debugging:**
- Start with small datasets (10-20 transactions)
- Use `settler demo` to verify CLI is working
- Check API key is correct (test with `settler doctor`)

---

## ❓ Troubleshooting

### "API key invalid"
- Check your API key is correct: `echo $SETTLER_API_KEY`
- Verify you copied the full key (starts with `sk_live_...`)
- Regenerate key in Settler Console if needed

### "No matches found"
- Check date format is YYYY-MM-DD (not MM/DD/YYYY)
- Verify amounts are numeric (not strings with $ or commas)
- Ensure IDs are unique (no duplicates)
- Try with a known matching pair first

### "Module not found"
- Install SDK: `npm install @settler/sdk`
- Check Node.js version: `node --version` (need 18+)
- Try clearing cache: `rm -rf node_modules && npm install`

### "Connection timeout"
- Check internet connection
- Verify firewall allows HTTPS to api.settler.dev
- Try with smaller dataset (might be rate limited)

**Still stuck?** Open an issue: https://github.com/shardie-github/settler-oss/issues

---

## 🎉 You're Ready!

You've successfully reconciled your first dataset. Here's what you can do now:

- ✅ Reconcile real transaction data
- ✅ Build production workflows
- ✅ Automate daily reconciliations
- ✅ Integrate with your accounting systems

**Happy reconciling!** 🚀

---

**Questions?** Join the discussion: https://github.com/shardie-github/settler-oss/discussions

**Need help?** Check out the [FAQ](../FAQ.md) or [open an issue](https://github.com/shardie-github/settler-oss/issues)

---

**Last Updated:** 2026-01-24
