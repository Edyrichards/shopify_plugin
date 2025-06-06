variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "staging"
}
