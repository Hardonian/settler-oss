# Security Policy

**Version:** 1.1.0
**Last Updated:** 2026-01-24

---

## 🎯 Security Philosophy

> **Settler is a tool for financial reconciliation, not a security product.
> We provide secure SDKs and protocols. You remain responsible for securing your systems and data.**

---

## 📋 Responsibility Boundaries

### What Settler Is Responsible For

**OSS Components:**
- ✅ SDK code free from vulnerabilities (XSS, injection, etc.)
- ✅ Secure defaults (HTTPS, input validation)
- ✅ Timely patches for disclosed vulnerabilities
- ✅ Transparent disclosure of security issues

**Enterprise (Cloud) Components:**
- ✅ API authentication and authorization
- ✅ Encryption in transit (TLS 1.3)
- ✅ Encryption at rest (AES-256)
- ✅ Infrastructure security (AWS security best practices)
- ✅ Regular security audits and penetration testing
- ✅ SOC 2 Type II compliance (Enterprise tier)

### What YOU Are Responsible For

**Data Security:**
- ⚠️ Securing your API keys (environment variables, secrets managers)
- ⚠️ Validating transaction data before sending to Settler
- ⚠️ Sanitizing sensitive data (PII, PCI) before reconciliation
- ⚠️ Access control to your Settler Console account
- ⚠️ Monitoring for unauthorized API usage

**Operational Security:**
- ⚠️ Keeping dependencies updated (npm audit, pip check, etc.)
- ⚠️ Securing your infrastructure (servers, databases, networks)
- ⚠️ Managing team permissions and access control
- ⚠️ Compliance with regulations (GDPR, PCI-DSS, SOX, HIPAA)

**Financial Security:**
- ⚠️ Verifying reconciliation results before taking action
- ⚠️ Not automating financial decisions without human review
- ⚠️ Maintaining audit trails of reconciliation runs
- ⚠️ Testing reconciliation logic with non-production data first

---

## 🚨 Supported Versions

We provide security updates for the following versions:

| Version | Supported          | Notes |
| ------- | ------------------ | ----- |
| 1.x.x   | ✅ Yes | Active development and security patches |
| < 1.0.0 | ❌ No  | Pre-release, not recommended for production |

**Upgrade policy:**
- Critical vulnerabilities: Patched within 24 hours
- High severity: Patched within 7 days
- Medium/Low severity: Included in next release

---

## 🔐 What Qualifies as a Security Issue

Before reporting, understand what constitutes a security vulnerability:

### ✅ Security Vulnerabilities (Report Privately)

**Code execution & injection:**
- Remote code execution (RCE)
- SQL injection
- Command injection
- Cross-site scripting (XSS)
- XML external entity (XXE) attacks

**Authentication & authorization:**
- Authentication bypass
- Authorization bypass
- Privilege escalation
- Session fixation
- Insecure defaults that expose data

**Cryptography & data protection:**
- Weak cryptography implementation
- Hardcoded credentials in source code
- Sensitive data exposure (PII, API keys in logs)
- Insecure data transmission (forced HTTP when HTTPS expected)

**Supply chain:**
- Malicious dependencies
- Compromised build artifacts
- Vulnerable dependencies with known CVEs (if no patch available)

### ❌ NOT Security Issues (Use Normal Issues Instead)

**General bugs:**
- Functional bugs that don't expose data or enable unauthorized access
- Performance issues
- UI/UX issues
- Documentation errors

**Configuration issues:**
- User misconfiguration (insecure API key storage in your code)
- Infrastructure security (your AWS, your firewall, your network)
- Third-party service issues
- Environment-specific issues

**Out of scope:**
- Vulnerabilities in dependencies with patches available (run `npm audit fix`)
- Theoretical attacks without practical proof-of-concept
- Denial of service through resource exhaustion (rate limiting is user's responsibility)
- Social engineering attacks
- Physical security
- Issues requiring compromised credentials or physical access

**Compliance questions:**
- "Is Settler HIPAA compliant?" (use GitHub Discussions)
- Requests for compliance documentation
- Questions about security practices

### 🤔 Not Sure?

When in doubt, report it privately. False positives are okay. Public disclosure of vulnerabilities is not.

---

## 🔐 How to Report a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### ❌ DO NOT:
- Open a public GitHub issue
- Discuss the vulnerability publicly before disclosure
- Share details on social media or forums
- Exploit the vulnerability beyond proof-of-concept

### ✅ DO:

**1. Email us directly:** security@settler.dev
   - Subject: `[SECURITY] <Brief description>`
   - Include:
     - Detailed description of the vulnerability
     - Steps to reproduce (proof-of-concept)
     - Affected versions or components
     - Potential impact assessment
     - Suggested fix (if you have one)
     - Your contact information (for credit)

**2. Wait for acknowledgment:**
   - We'll acknowledge receipt within 48 hours (business days)
   - We'll provide an initial assessment within 5 business days
   - We'll keep you updated on fix progress

**3. Coordinated disclosure:**
   - We'll work with you on disclosure timeline
   - Typical timeline: 90 days from report to public disclosure
   - We'll credit you in security advisory (if desired)
   - We'll notify you before public disclosure

**4. Recognition and rewards:**
   - **No bug bounty program** for OSS vulnerabilities at this time
   - Public acknowledgment and credit in security advisory (if you wish)
   - Hall of Fame listing for responsible disclosures
   - Enterprise customers: Contact your account manager about bounty eligibility

   **Important:** Do not expect financial compensation for OSS vulnerability reports. We deeply appreciate responsible disclosure, but cannot offer monetary rewards currently.

---

## 🛡️ Security Best Practices

### For All Users

**1. Protect API Keys**
```bash
# ✅ CORRECT - Environment variable
export SETTLER_API_KEY="sk_live_..."
settler reconcile --source data.csv

# ❌ WRONG - Hardcoded in code
const client = new SettlerClient({ apiKey: 'sk_live_...' });
```

**2. Use HTTPS Endpoints**
```typescript
// ✅ CORRECT - HTTPS
const client = new SettlerClient({
  apiKey: process.env.SETTLER_API_KEY,
  baseURL: 'https://api.settler.dev',  // ← HTTPS
});

// ❌ WRONG - HTTP (insecure)
const client = new SettlerClient({
  baseURL: 'http://api.settler.dev',  // ← Never use HTTP!
});
```

**3. Validate Input Data**
```typescript
// ✅ CORRECT - Validate before sending
function sanitizeTransactions(transactions: unknown[]): Transaction[] {
  return transactions
    .filter(t => t && typeof t === 'object')
    .map(t => ({
      id: String(t.id || '').slice(0, 255),  // Limit length
      amount: validateAmount(t.amount),
      date: validateDate(t.date),
      // Remove PII if present
      description: sanitizePII(t.description),
    }));
}
```

**4. Keep Dependencies Updated**
```bash
# Check for vulnerabilities
npm audit
npm audit fix

# Or with pnpm
pnpm audit
pnpm audit --fix

# Python
pip-audit
```

**5. Review Dependency Changes**
- Enable Dependabot or Renovate for automated PRs
- Review changelogs before upgrading
- Test after dependency updates

### For Self-Hosted Users

**6. Secure Your Infrastructure**
- Use firewalls and network segmentation
- Enable encryption at rest for databases
- Use secrets managers (AWS Secrets Manager, HashiCorp Vault, etc.)
- Implement monitoring and alerting
- Regular security patches for OS and dependencies

**7. Access Control**
- Principle of least privilege (minimal permissions)
- Rotate credentials regularly
- Use multi-factor authentication (MFA)
- Log and monitor access

**8. Data Sanitization**
- Redact sensitive fields before reconciliation
- Use test data for development environments
- Implement data retention policies

---

## 🚫 Common Security Mistakes (Avoid These!)

### ❌ Committing API Keys
```bash
# ❌ WRONG - API key in git history
git add .env
git commit -m "Add config"

# ✅ CORRECT - Use .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

### ❌ Logging Sensitive Data
```typescript
// ❌ WRONG - Logs API key
console.log('API request:', { apiKey, data });

// ✅ CORRECT - Redact secrets
console.log('API request:', { apiKey: '[REDACTED]', data });
```

### ❌ Trusting User Input
```typescript
// ❌ WRONG - No validation
const amount = req.body.amount;  // Could be negative, NaN, etc.

// ✅ CORRECT - Validate and sanitize
const amount = validatePositiveDecimal(req.body.amount);
```

### ❌ Ignoring TLS Certificate Errors
```typescript
// ❌ WRONG - Disables certificate validation
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// ✅ CORRECT - Fix certificate issues properly
// (Install proper CA certificates, use valid certs)
```

---

## 📊 Security Updates

Security updates will be:
- Released as patch versions (e.g., 1.2.3 → 1.2.4)
- Documented in CHANGELOG.md with `[SECURITY]` prefix
- Announced via:
  - GitHub Security Advisories
  - GitHub Releases
  - Email to Enterprise customers (critical issues)
  - Twitter/social media (for critical CVEs)
- Backported to supported versions when possible

**Severity levels:**
- **Critical:** Remote code execution, authentication bypass
- **High:** SQL injection, XSS, privilege escalation
- **Medium:** Information disclosure, denial of service
- **Low:** Minor issues with limited impact

---

## 🔍 Known Vulnerabilities

We maintain a list of known vulnerabilities and their status:

**Current vulnerabilities:** None known (as of 2026-01-24)

**Check for updates:**
- [GitHub Security Advisories](https://github.com/shardie-github/settler-oss/security/advisories)
- [npm audit](https://www.npmjs.com/package/@settler/sdk?activeTab=versions)

---

## 🛠️ Compliance & Certifications

### Enterprise (Cloud)
- **SOC 2 Type II:** Annual audit available (Enterprise tier)
- **GDPR:** EU data residency options, data processing agreements available
- **ISO 27001:** Information security management (in progress)

**Payment Card Data:**
- Settler does not store payment card data
- For PCI DSS requirements, contact sales for compliance documentation

### OSS
- **No compliance guarantees:** OSS is provided "as is" (MIT license)
- **Self-hosted compliance:** Your responsibility

**Important:** Settler is a **tool**, not a compliance solution. You are responsible for meeting your regulatory requirements.

---

## ⚠️ Security Disclaimers

### Settler Is NOT:
- ❌ A compliance guarantee (SOX, PCI, GDPR, HIPAA)
- ❌ A fraud detection system
- ❌ A financial audit tool (use for operational reconciliation)
- ❌ A substitute for manual review by qualified personnel
- ❌ Insurance against financial losses

### What This Means:
- **Reconciliation finds differences, but doesn't prevent fraud**
- **You must validate results before taking financial actions**
- **Settler doesn't replace accountants, auditors, or compliance officers**
- **No warranty or guarantee of financial accuracy (see MIT license)**

### Appropriate Uses:
- ✅ Operational reconciliation (daily/monthly transaction matching)
- ✅ Engineering tool for finance teams
- ✅ Data quality checks
- ✅ Automation of manual comparison tasks

### Inappropriate Uses:
- ❌ Sole basis for financial reporting (use alongside accounting systems)
- ❌ Automated transaction approvals without human review
- ❌ Compliance certification (tool doesn't guarantee compliance)
- ❌ Regulated financial advice or services

---

## 🏛️ Regulatory Context

**Financial Regulations:**
- Settler does not provide financial advice
- Not a registered financial institution
- Not subject to banking regulations (we don't hold funds)
- Users remain responsible for compliance with:
  - SOX (Sarbanes-Oxley) if applicable
  - GDPR (EU data protection)
  - PCI DSS (if processing payment card data)
  - HIPAA (if handling health data)
  - Local financial regulations

**Data Privacy:**
- Enterprise: Data processing agreements available
- OSS: You control data (self-hosted)
- No data sold to third parties
- Transparent data handling policies

---

## 📞 Security Contact

**For security vulnerabilities:**
- Email: security@settler.dev
- PGP Key: Available on request
- Response time: 48 hours (business days)

**For general security questions:**
- GitHub Discussions: [Security tag](https://github.com/shardie-github/settler-oss/discussions)
- Enterprise support: support@settler.dev (24/7 for critical issues)

**Bug bounty inquiries:**
- No active bounty program for OSS
- Enterprise customers: Contact your account manager

---

## 🔗 Related Documentation

- **[INVARIANTS.md](./docs/INVARIANTS.md)** - Financial and data integrity invariants
- **[OSS_VS_ENTERPRISE_BOUNDARY.md](./docs/OSS_VS_ENTERPRISE_BOUNDARY.md)** - OSS/Enterprise security boundaries
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Security architecture

---

## ✅ Security Checklist for Production

Before using Settler in production, verify:

**OSS Users:**
- [ ] API keys stored in environment variables (not code)
- [ ] HTTPS endpoints only (no HTTP)
- [ ] Input validation implemented
- [ ] Dependencies audited (npm audit, pip-audit)
- [ ] Error handling doesn't leak sensitive data
- [ ] Logs don't contain API keys or PII
- [ ] Test data used for development (not production data)
- [ ] Access control implemented (who can run reconciliations)
- [ ] Results reviewed by qualified personnel before action

**Enterprise Users:**
- [ ] All of the above, plus:
- [ ] Team permissions configured (RBAC)
- [ ] API key rotation schedule established
- [ ] Webhook endpoints secured (signature verification)
- [ ] Data residency requirements met (EU/US/APAC)
- [ ] Audit logs enabled and monitored
- [ ] Incident response plan includes Settler

---

**Thank you for helping keep Settler secure!**

If you have questions about this security policy, open a GitHub Discussion or email security@settler.dev.

**Last Updated:** 2026-01-24 • **Version:** 1.1.0
