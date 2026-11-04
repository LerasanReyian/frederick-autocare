variable "project_name" {
  type        = string
  description = "Short project name used in Azure resource names."
  default     = "frederick-autocare"
}

variable "location" {
  type        = string
  description = "Azure region for all resources."
  default     = "southeastasia"
}

variable "resource_group_name" {
  type        = string
  description = "Resource group name. Leave empty to derive it from project_name."
  default     = ""
}

variable "app_name" {
  type        = string
  description = "Globally unique Azure App Service name."
}

variable "mysql_server_name" {
  type        = string
  description = "Globally unique Azure MySQL Flexible Server name."
}

variable "mysql_admin_user" {
  type        = string
  description = "MySQL administrator username."
  default     = "frederickadmin"
}

variable "mysql_admin_password" {
  type        = string
  description = "MySQL administrator password."
  sensitive   = true
}

variable "app_admin_password" {
  type        = string
  description = "Initial application administrator password."
  sensitive   = true
}

variable "app_employee_password" {
  type        = string
  description = "Initial application employee password."
  sensitive   = true
}

variable "operator_ip" {
  type        = string
  description = "Public IPv4 address allowed to connect to MySQL during setup. Use 0.0.0.0 to disable this rule."
  default     = "0.0.0.0"
}

variable "allow_azure_services" {
  type        = bool
  description = "Allow Azure-hosted services, including this App Service, to reach MySQL."
  default     = true
}

variable "db_ssl_ca_base64" {
  type        = string
  description = "Optional base64-encoded Azure MySQL CA certificate."
  default     = ""
  sensitive   = true
}

variable "db_ssl_reject_unauthorized" {
  type        = bool
  description = "Reject invalid MySQL TLS certificates. Keep true when db_ssl_ca_base64 is provided."
  default     = true
}
