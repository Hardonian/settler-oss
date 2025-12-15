# Enterprise Instances

This document describes enterprise instance deployment options and architecture for Settler Console.

## Overview

Enterprise instances provide dedicated, isolated deployments of Settler Console with enhanced security, compliance, and operational features. These are part of the **licensed SaaS management layer** and require a commercial enterprise license.

---

## Deployment Options

### Dedicated Cloud Instance

**Description**: Isolated instance in your preferred cloud region with dedicated resources.

**Features**:
- Single-tenant architecture
- Dedicated compute and storage
- Isolated network resources
- Custom resource sizing
- Regional deployment options

**Use Cases**:
- Organizations requiring data isolation
- High-performance workloads
- Custom infrastructure requirements

---

### Data Residency

**Description**: Deploy in specific regions to meet data residency and compliance requirements.

**Available Regions**:
- **EU**: GDPR-compliant deployments in EU data centers
- **US**: Deployments in US regions (East, West, Central)
- **APAC**: Deployments in Asia-Pacific regions
- **Custom**: Other regions available on request

**Compliance**:
- GDPR compliance (EU deployments)
- SOC 2 Type II
- ISO 27001
- HIPAA (available with custom agreements)

**Use Cases**:
- GDPR compliance requirements
- Industry-specific regulations
- Government contracts
- Multi-region deployments

---

### VPC / Private Networking

**Description**: Connect via private networking to your existing infrastructure.

**Features**:
- Private VPC peering
- VPN connectivity
- Direct Connect / ExpressRoute support
- Private API endpoints
- No public internet exposure

**Architecture**:
```
Your Infrastructure
    ↓ (Private Network)
Settler Enterprise Instance
    ↓ (Private Network)
Your Data Sources
```

**Use Cases**:
- Enterprise security policies
- Hybrid cloud architectures
- On-premises integration
- Network isolation requirements

---

### BYO-Key / KMS Integration

**Description**: Bring your own encryption keys and integrate with your Key Management Service (KMS).

**Supported KMS**:
- AWS KMS
- Azure Key Vault
- Google Cloud KMS
- HashiCorp Vault
- Custom KMS (via API)

**Features**:
- Customer-managed encryption keys (CMEK)
- Key rotation support
- Audit logging of key usage
- Multi-region key replication
- Key access policies

**Use Cases**:
- Regulatory compliance (encryption at rest)
- Key management policies
- Multi-cloud deployments
- Enhanced security requirements

---

### Audit Export / SIEM Forwarding

**Description**: Export audit logs and forward to your Security Information and Event Management (SIEM) system.

**Supported SIEM**:
- Splunk
- Datadog
- New Relic
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Custom SIEM (via webhook/API)

**Audit Events**:
- Authentication events
- Authorization changes
- Data access logs
- Configuration changes
- API usage
- Connector activity
- Tenant operations

**Export Formats**:
- JSON (structured logs)
- CEF (Common Event Format)
- Syslog
- Custom formats (via transformation)

**Use Cases**:
- Security monitoring
- Compliance auditing
- Incident response
- Operational visibility

---

## Architecture

### Single-Tenant Architecture

Enterprise instances use a single-tenant architecture:

```
┌─────────────────────────────────────┐
│   Enterprise Instance (Dedicated)  │
├─────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐ │
│  │   Console   │  │  Enterprise  │ │
│  │   App       │  │  Connectors  │ │
│  └─────────────┘  └──────────────┘ │
│  ┌───────────────────────────────┐ │
│  │      Protocol API Layer        │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │      Data Layer (Encrypted)   │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Multi-Region Deployment

For global organizations:

```
Region 1 (EU)          Region 2 (US)          Region 3 (APAC)
┌──────────┐          ┌──────────┐          ┌──────────┐
│ Instance │ ←──────→ │ Instance │ ←──────→ │ Instance │
└──────────┘          └──────────┘          └──────────┘
     ↓                      ↓                      ↓
  EU Data                US Data              APAC Data
```

---

## Security Features

### Network Security
- Private networking only (optional)
- DDoS protection
- WAF (Web Application Firewall)
- Network segmentation

### Data Security
- Encryption at rest (BYO-key support)
- Encryption in transit (TLS 1.3)
- Data isolation (single-tenant)
- Secure key management

### Access Control
- SSO integration (SAML, OIDC)
- MFA enforcement
- RBAC with custom roles
- IP allowlisting
- Audit logging

### Compliance
- SOC 2 Type II
- ISO 27001
- GDPR compliance
- HIPAA (custom agreements)
- Industry-specific certifications

---

## Instance Management

### Provisioning

1. **Request**: Contact sales to discuss requirements
2. **Design**: Architecture review and sizing
3. **Deploy**: Instance provisioning (1-2 weeks)
4. **Configure**: Initial setup and integration
5. **Go Live**: Production deployment

### Monitoring

- Health checks and alerts
- Performance metrics
- Usage analytics
- Cost tracking
- SLA monitoring

### Support

- Dedicated support channel
- 24/7 support (Enterprise tier)
- On-call engineering
- Custom SLAs

---

## Pricing

Enterprise instances are priced based on:

- Instance size and resources
- Region and data residency requirements
- Network connectivity options
- Support tier
- Custom features

**Contact**: [sales@settler.dev](mailto:sales@settler.dev) for pricing

---

## Comparison: Protocol vs Enterprise Instance

| Feature | Protocol (OSS) | Enterprise Instance |
|---------|----------------|---------------------|
| Deployment | Self-hosted | Managed by Settler |
| Multi-tenancy | Single tenant | Single tenant (dedicated) |
| Data Residency | Your choice | Guaranteed regions |
| Encryption | Your implementation | BYO-key / KMS |
| Networking | Your infrastructure | VPC / Private networking |
| Audit Logs | Your implementation | SIEM forwarding |
| Support | Community | Dedicated support |
| SLA | None | Custom SLAs |
| License | MIT | Proprietary |

---

## Getting Started

1. **Contact Sales**: [sales@settler.dev](mailto:sales@settler.dev)
2. **Requirements Review**: Discuss your needs
3. **Architecture Design**: Plan your deployment
4. **Provisioning**: Deploy your instance
5. **Integration**: Connect your systems

---

## Related Documentation

- [CONNECTOR_MODEL.md](./CONNECTOR_MODEL.md) - Enterprise connector architecture
- [BOUNDARY_MAP.md](./BOUNDARY_MAP.md) - Protocol vs Management boundary
- [LICENSING.md](./LICENSING.md) - Licensing information

---

Last updated: 2024-01-XX
