locals {
  resource_group_name = var.resource_group_name != "" ? var.resource_group_name : "${var.project_name}-rg"
  database_name       = "frederick_autocare"
  common_tags = {
    application = var.project_name
    managed_by  = "terraform"
  }
}

resource "azurerm_resource_group" "app" {
  name     = local.resource_group_name
  location = var.location
  tags     = local.common_tags
}

resource "azurerm_service_plan" "app" {
  name                = "${var.project_name}-plan"
  resource_group_name = azurerm_resource_group.app.name
  location            = azurerm_resource_group.app.location
  os_type             = "Linux"
  sku_name            = "B1"
  tags                = local.common_tags
}

resource "azurerm_mysql_flexible_server" "database" {
  name                   = var.mysql_server_name
  resource_group_name    = azurerm_resource_group.app.name
  location               = azurerm_resource_group.app.location
  administrator_login    = var.mysql_admin_user
  administrator_password = var.mysql_admin_password
  version                = "8.0.21"
  sku_name               = "B_Standard_B1ms"
  storage {
    size_gb = 32
  }
  backup_retention_days = 7
  tags                  = local.common_tags
}

resource "azurerm_mysql_flexible_database" "app" {
  name                = local.database_name
  resource_group_name = azurerm_resource_group.app.name
  server_name         = azurerm_mysql_flexible_server.database.name
  charset             = "utf8mb4"
  collation            = "utf8mb4_unicode_ci"
}

resource "azurerm_mysql_flexible_server_firewall_rule" "operator" {
  count               = var.operator_ip != "0.0.0.0" ? 1 : 0
  name                = "operator-setup"
  resource_group_name = azurerm_resource_group.app.name
  server_name         = azurerm_mysql_flexible_server.database.name
  start_ip_address    = var.operator_ip
  end_ip_address      = var.operator_ip
}

resource "azurerm_mysql_flexible_server_firewall_rule" "azure_services" {
  count               = var.allow_azure_services ? 1 : 0
  name                = "allow-azure-services"
  resource_group_name = azurerm_resource_group.app.name
  server_name         = azurerm_mysql_flexible_server.database.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "0.0.0.0"
}

resource "azurerm_linux_web_app" "app" {
  name                = var.app_name
  resource_group_name = azurerm_resource_group.app.name
  location            = azurerm_resource_group.app.location
  service_plan_id     = azurerm_service_plan.app.id
  https_only          = true
  tags                = local.common_tags

  site_config {
    always_on = true
    application_stack {
      node_version = "20-lts"
    }
  }

  app_settings = {
    API_HOST                     = "0.0.0.0"
    DB_CONNECTION_LIMIT          = "10"
    DB_CONNECT_TIMEOUT           = "10000"
    DB_HOST                      = azurerm_mysql_flexible_server.database.fqdn
    DB_NAME                      = local.database_name
    DB_PASSWORD                  = var.mysql_admin_password
    DB_PORT                      = "3306"
    DB_SSL                      = "true"
    DB_SSL_CA_BASE64             = var.db_ssl_ca_base64
    DB_SSL_REJECT_UNAUTHORIZED   = tostring(var.db_ssl_reject_unauthorized)
    DB_USER                      = var.mysql_admin_user
    EMPLOYEE_EMAIL               = "employee@frederickauto.local"
    EMPLOYEE_PASSWORD            = var.app_employee_password
    ADMIN_EMAIL                  = "admin@frederickauto.local"
    ADMIN_PASSWORD               = var.app_admin_password
    SCM_DO_BUILD_DURING_DEPLOYMENT = "true"
    WEBSITE_NODE_DEFAULT_VERSION = "20-lts"
  }
}
