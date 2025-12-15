# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### DO NOT:
- Open a public GitHub issue
- Discuss the vulnerability publicly
- Share details on social media

### DO:
1. **Email us directly** at: security@settler.dev
   - Include "SECURITY" in the subject line
   - Provide a detailed description
   - Include steps to reproduce
   - Suggest a fix if possible

2. **Wait for response**:
   - We'll acknowledge within 48 hours
   - We'll provide an estimated timeline for a fix
   - We'll keep you updated on progress

3. **Disclosure timeline**:
   - We'll work with you to coordinate disclosure
   - Public disclosure after a fix is released
   - Credit will be given if desired

## Security Best Practices

When using Settler SDKs:

- **Keep dependencies updated**: Regularly update to the latest versions
- **Use HTTPS**: Always use HTTPS endpoints
- **Protect API keys**: Never commit API keys to version control
- **Validate input**: Validate all user input before processing
- **Use environment variables**: Store sensitive configuration in environment variables
- **Review dependencies**: Regularly audit your dependencies for vulnerabilities

## Security Updates

Security updates will be:
- Released as patch versions (e.g., 1.2.3 → 1.2.4)
- Documented in CHANGELOG.md
- Announced via GitHub releases
- Backported to supported versions when possible

## Known Vulnerabilities

We maintain a list of known vulnerabilities and their status. Check [GitHub Security Advisories](https://github.com/shardie-github/settler-oss/security/advisories) for details.

## Security Contact

For security-related questions or concerns:
- Email: security@settler.dev
- PGP Key: [Available on request]

Thank you for helping keep Settler secure!
