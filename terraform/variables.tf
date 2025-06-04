# core

variable "region" {
  description = "The AWS region to create resources in."
  default     = "eu-north-1"
}

# networking

variable "public_subnet_1_cidr" {
  description = "CIDR Block for Public Subnet 1"
  default     = "10.0.1.0/24"
}
variable "public_subnet_2_cidr" {
  description = "CIDR Block for Public Subnet 2"
  default     = "10.0.2.0/24"
}
variable "private_subnet_1_cidr" {
  description = "CIDR Block for Private Subnet 1"
  default     = "10.0.3.0/24"
}
variable "private_subnet_2_cidr" {
  description = "CIDR Block for Private Subnet 2"
  default     = "10.0.4.0/24"
}
variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["eu-north-1a", "eu-north-1c"]
}

# load balancer

variable "health_check_path_client" {
  description = "Health check path for the default target group"
  default     = "/"
}
variable "health_check_path_users" {
  description = "Health check path for the default target group"
  default     = "/ping"
}


# ecs

variable "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  default     = "flask-react-fargate"
}
variable "docker_image_url_client" {
  description = "Docker client image to run in the ECS cluster"
  default     = "992487938048.dkr.ecr.eu-north-1.amazonaws.com/test-driven-client-fargate:prod"
}
variable "docker_image_url_users" {
  description = "Docker users image to run in the ECS cluster"
  default     = "992487938048.dkr.ecr.eu-north-1.amazonaws.com/test-driven-users-fargate:prod"
}
variable "app_count" {
  description = "Number of Docker containers to run"
  default     = 1
}
variable "secret_key" {
  description = "Flask Secret Key"
  default     = "956b310e7bb5c301c8ddc37960a4604d44b47a687877f2e5"
}

# logs

variable "log_retention_in_days" {
  default = 30
}

# key pair

variable "ssh_pubkey_file" {
  description = "Path to an SSH public key"
  default     = "~/.ssh/id_ed25519.pub"
}