# Settler Node.js/TypeScript SDK

Official Node.js and TypeScript SDK for Settler.

## Installation

```bash
npm install @settler/sdk
```

## Usage

```typescript
import { SettlerClient } from '@settler/sdk';

const client = new SettlerClient({
  apiKey: process.env.SETTLER_API_KEY,
  baseURL: 'https://api.settler.dev', // optional
});

// Reconcile transactions
const result = await client.reconcile({
  source: [...],
  target: [...],
  rules: {...},
});
```

## Documentation

See the [full documentation](https://docs.settler.dev/sdk/nodejs) for more details.
