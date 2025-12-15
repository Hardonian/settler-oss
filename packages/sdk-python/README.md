# Settler Python SDK

Official Python SDK for Settler.

## Installation

```bash
pip install settler-sdk
```

## Usage

```python
from settler import SettlerClient

client = SettlerClient(api_key=os.environ['SETTLER_API_KEY'])

# Reconcile transactions
result = client.reconcile({
    'source': [...],
    'target': [...],
    'rules': {...},
})
```

## Documentation

See the [full documentation](https://docs.settler.dev/sdk/python) for more details.
