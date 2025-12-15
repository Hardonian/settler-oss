package settler

import (
	"context"
	"os"
)

// Config holds configuration for the Settler client
type Config struct {
	APIKey  string
	BaseURL string
}

// Client is the main client for interacting with Settler API
type Client struct {
	config Config
}

// NewClient creates a new Settler client
func NewClient(config Config) *Client {
	if config.APIKey == "" {
		config.APIKey = os.Getenv("SETTLER_API_KEY")
	}
	if config.BaseURL == "" {
		config.BaseURL = "https://api.settler.dev"
	}
	return &Client{config: config}
}

// ReconcileRequest represents a reconciliation request
type ReconcileRequest struct {
	Source interface{} `json:"source"`
	Target interface{} `json:"target"`
	Rules  interface{} `json:"rules"`
}

// Reconcile reconciles transactions
func (c *Client) Reconcile(ctx context.Context, req ReconcileRequest) (interface{}, error) {
	// Implementation will be added from private repo
	panic("not implemented yet")
}
