# Azure deployment with Terraform

This configuration provisions:

- An Azure resource group.
- An Azure Linux App Service plan and Node.js 20 web app.
- An Azure Database for MySQL Flexible Server.
- The `frederick_autocare` database.
- MySQL firewall access for Azure services and, optionally, the operator's
  temporary public IP.

Terraform provisions infrastructure and App Service settings. It does not
upload the application source. Deploy the application after provisioning with
GitHub Actions, Azure CLI, or the App Service deployment center.

## Prerequisites

- An Azure subscription with an active student or other credit entitlement.
- Terraform 1.6 or newer.
- Azure CLI.
- The repository's production build passing locally.

Authenticate without putting credentials in Terraform files:

```powershell
az login
az account set --subscription "<SUBSCRIPTION_ID>"
```

## Provision infrastructure

From the repository root:

```powershell
Copy-Item terraform\terraform.tfvars.example terraform\terraform.tfvars
```

Edit `terraform\terraform.tfvars`:

- Set globally unique `app_name` and `mysql_server_name` values.
- Set strong database, Admin, and Employee passwords.
- Set `operator_ip` to your public IPv4 address for initial schema import.
- Supply `db_ssl_ca_base64` for strict MySQL certificate validation.

Then run:

```powershell
terraform -chdir=terraform init
terraform -chdir=terraform fmt -check
terraform -chdir=terraform validate
terraform -chdir=terraform plan
terraform -chdir=terraform apply
```

Review the plan before typing `yes`. Terraform state contains infrastructure
metadata and may contain sensitive values; keep it private and use an Azure
Storage remote backend before sharing the project with collaborators.

## Import the schema

Get the database hostname:

```powershell
$MYSQL_HOST = terraform -chdir=terraform output -raw mysql_hostname
```

Import the schema with the MySQL client:

```powershell
C:\xampp\mysql\bin\mysql.exe `
  --host="$MYSQL_HOST" `
  --port=3306 `
  --user="frederickadmin" `
  --password `
  frederick_autocare `
  < database\schema.sql
```

After importing, set `operator_ip = "0.0.0.0"` and run `terraform apply` again
to remove the temporary public access rule. Keep
`allow_azure_services = true` so App Service can reach the database.

## Deploy application code

The App Service is configured to run `npm start` and install dependencies with
`SCM_DO_BUILD_DURING_DEPLOYMENT=true`. Use the App Service Deployment Center
or a deployment command such as:

```powershell
$RESOURCE_GROUP = terraform -chdir=terraform output -raw resource_group_name
$APP_HOSTNAME = terraform -chdir=terraform output -raw app_hostname
$APP_NAME = $APP_HOSTNAME.Split('.')[0]
az webapp up `
  --resource-group $RESOURCE_GROUP `
  --name $APP_NAME `
  --runtime "NODE:20-lts"
```

The resulting URL is available with:

```powershell
terraform -chdir=terraform output -raw app_url
```

## Destroy

Only run this when you intentionally want to delete the deployment:

```powershell
terraform -chdir=terraform destroy
```
