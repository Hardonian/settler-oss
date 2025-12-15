# Settler Ruby SDK

Official Ruby SDK for Settler.

## Installation

```bash
gem install settler-sdk
```

Or add to your Gemfile:

```ruby
gem 'settler-sdk'
```

## Usage

```ruby
require 'settler-sdk'

client = Settler::Client.new(api_key: ENV['SETTLER_API_KEY'])

# Reconcile transactions
result = client.reconcile({
  source: [...],
  target: [...],
  rules: {...},
})
```

## Documentation

See the [full documentation](https://docs.settler.dev/sdk/ruby) for more details.
