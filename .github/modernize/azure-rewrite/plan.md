# Modernization Plan: Frederick AutoCare Azure Rewrite

**Project**: Frederick Car Accessories

## Technical Framework

- **Language**: JavaScript and TypeScript
- **Framework**: React 19, Vite 8, NestJS 11
- **Build Tool**: npm and Vite
- **Database**: MySQL/MariaDB
- **Key Dependencies**: Express-compatible API routes, MySQL2, React, NestJS

## Overview

This migration rewrites and deploys the Frederick Car Accessories storefront and
inventory backend on Azure. The current application uses a React/Vite frontend,
a minimal NestJS adapter around Express routes, and a local XAMPP MariaDB
database.

The new architecture will:

- Host the React frontend on Azure App Service.
- Host the fully rewritten NestJS backend on Azure Container Apps.
- Move production persistence to Azure Database for MySQL Flexible Server.
- Preserve existing public booking, staff access, authentication, inventory,
  booking, and account-request behavior.
- Establish repeatable Azure provisioning, deployment, security scanning, and
  real-resource integration verification.

The migration will be performed in phases: capture the current behavior, create
Azure infrastructure, rewrite the backend, validate against Azure resources,
remediate security findings, and deploy.

## Migration Impact Summary

| Application | Original Service | New Azure Service | Authentication | Comments |
|-------------|------------------|-------------------|-------------|----------|
| React storefront | Vite static output | Azure App Service | Existing staff auth | Preserve public booking UX |
| Inventory API | Express routes in Nest adapter | Azure Container Apps | Nest guards and sessions | Full NestJS rewrite |
| Local database | XAMPP MariaDB | Azure MySQL Flexible Server | Database credentials | Import existing schema and data |

## Azure Environment

- **Region**: Southeast Asia
- **Resource group**: `frederick-autocare-rg`
- **Environment**: `production`
- **Subscription ID**: To be supplied during provisioning
- **Infrastructure as Code**: Bicep
- **Backend target**: Azure Container Apps
- **Frontend target**: Azure App Service
- **Database target**: Azure Database for MySQL Flexible Server
- **Source control and CI/CD**: GitHub repository and GitHub Actions

## Scope and Constraints

- Rewrite the existing backend into idiomatic NestJS modules, controllers,
  services, guards, DTOs, validation, and error handling.
- Preserve the existing API capabilities and user-facing behavior unless a
  migration defect requires a documented correction.
- Keep secrets out of source control and frontend build variables.
- Use managed identity and Azure-native secret handling where supported.
- Do not provision resources until an Azure subscription ID is supplied.
- Retain local XAMPP support for development while separating production
  configuration.
- Deploy from pushes to `main` through GitHub Actions after build, test, and
  security checks pass.

## GitHub Deployment Workflow

The repository already contains
[azure-webapps-node.yml](../../workflows/azure-webapps-node.yml), but it is a
starter workflow with a placeholder App Service name and only one App Service
deployment target. It must be replaced or split into workflows that:

1. Build and test the repository.
2. Deploy the React/Vite frontend to Azure App Service.
3. Build and deploy the NestJS backend to Azure Container Apps.
4. Run health and smoke checks after deployment.
5. Use GitHub environments and secrets rather than committed credentials.

Required GitHub configuration will include the Azure resource names, a
production environment, and federated Azure credentials or deployment secrets.
Database credentials must remain in Azure App Service/Container Apps
configuration or Key Vault references, never in the repository.

## Open Questions & Questionnaire

- [x] Q: Should new Azure infrastructure be provisioned? → A: Yes, using Bicep
  for `frederick-autocare-rg`; subscription ID remains pending.
- [x] Q: Which backend deployment target should be used? → A: Azure Container
  Apps.
- [x] Q: Which frontend deployment target should be used? → A: Azure App
  Service.
- [x] Q: Which production database should be used? → A: Azure Database for
  MySQL Flexible Server.
- [x] Q: How deeply should NestJS be adopted? → A: Full NestJS rewrite.
- [x] Q: Which Azure region should be used? → A: Southeast Asia.
- [x] Q: Should integration testing be included? → A: Yes, against provisioned
  Azure resources.
- [x] Q: Should security and CVE remediation be included? → A: Yes.
