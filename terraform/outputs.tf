output "resource_group_name" {
  value = azurerm_resource_group.app.name
}

output "app_url" {
  value = "https://${azurerm_linux_web_app.app.default_hostname}"
}

output "app_hostname" {
  value = azurerm_linux_web_app.app.default_hostname
}

output "mysql_hostname" {
  value = azurerm_mysql_flexible_server.database.fqdn
}

output "database_name" {
  value = azurerm_mysql_flexible_database.app.name
}
