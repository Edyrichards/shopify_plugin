terraform {
  required_version = ">= 1.3"
  required_providers {
    aws    = { source = "hashicorp/aws", version = "~> 5.0" }
    elastic = { source = "elastic/ec", version = "~> 0.7" }
  }
}

provider "aws" {
  region = var.aws_region
}
