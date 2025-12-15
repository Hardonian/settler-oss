# Settler React Components

Official React components for Settler.

## Installation

```bash
npm install @settler/react-settler
```

## Usage

```tsx
import { SettlerProvider, ReconciliationView } from '@settler/react-settler';

function App() {
  return (
    <SettlerProvider apiKey={process.env.SETTLER_API_KEY}>
      <ReconciliationView />
    </SettlerProvider>
  );
}
```

## Documentation

See the [full documentation](https://docs.settler.dev/sdk/react) for more details.
