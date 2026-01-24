/**
 * Adapters command - List available adapters
 */

export function adapters(): void {
  console.log('');
  console.log('🔌 Settler Adapters');
  console.log('');
  console.log('OSS Adapters (Built-in):');
  console.log('─'.repeat(80));
  console.log('  • csv           Local CSV file adapter (built-in to CLI)');
  console.log('  • json          Local JSON file adapter (coming soon)');
  console.log('');
  console.log('Cloud Adapters (Managed, requires Cloud subscription):');
  console.log('─'.repeat(80));
  console.log('  • stripe        Stripe payment processor');
  console.log('  • shopify       Shopify e-commerce platform');
  console.log('  • square        Square payment processor');
  console.log('  • quickbooks    QuickBooks accounting software');
  console.log('  • xero          Xero accounting software');
  console.log('  • paypal        PayPal payment processor');
  console.log('  • plaid         Plaid banking data');
  console.log('  • ...and 40+ more');
  console.log('');
  console.log('Custom Adapters:');
  console.log('─'.repeat(80));
  console.log('  You can build custom adapters using the Settler SDK.');
  console.log('  See: https://docs.settler.dev/adapters/custom');
  console.log('');
  console.log('Need managed adapters?');
  console.log('  Sign up for Settler Cloud: https://settler.dev');
  console.log('');
}
