module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "search-app-${var.environment}"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  enable_dns_hostnames = true
}

module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "~> 20.0"
  cluster_name    = "search-app-${var.environment}"
  cluster_version = "1.29"
  subnets         = module.vpc.private_subnets
  vpc_id          = module.vpc.vpc_id

  node_groups = {
    default = {
      desired_capacity = 2
      max_capacity     = 3
      min_capacity     = 1
      instance_type    = "t3.medium"
    }
  }
}

module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 6.0"

  identifier = "search-app-${var.environment}"
  engine     = "postgres"
  engine_version = "15"
  instance_class = "db.t3.medium"
  allocated_storage = 20
  subnet_ids       = module.vpc.private_subnets
  vpc_security_group_ids = [module.vpc.default_security_group_id]
  publicly_accessible = false
  username = "search"
  create_random_password = true
}

module "redis" {
  source  = "terraform-aws-modules/elasticache/aws"
  version = "~> 6.0"

  name                = "search-app-${var.environment}"
  engine              = "redis"
  node_type           = "cache.t3.micro"
  number_cache_nodes  = 1
  subnet_group_name   = module.vpc.name
  security_group_ids  = [module.vpc.default_security_group_id]
}

resource "elasticstack_deployment" "es" {
  provider = elastic

  name       = "search-app-${var.environment}"
  region     = var.aws_region
  version    = "8.12.0"
  deployment_template_id = "gcp-io-optimized"
}
