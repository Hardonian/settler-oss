# Settler Go SDK

Official Go SDK for Settler.

## Installation

```bash
go get github.com/shardie-github/settler-oss/packages/sdk-go
```

## Usage

```go
import "github.com/shardie-github/settler-oss/packages/sdk-go"

client := settler.NewClient(settler.Config{
    APIKey: os.Getenv("SETTLER_API_KEY"),
})

ctx := context.Background()
result, err := client.Reconcile(ctx, settler.ReconcileRequest{
    Source: [...],
    Target: [...],
    Rules: {...},
})
```

## Documentation

See the [full documentation](https://docs.settler.dev/sdk/go) for more details.
