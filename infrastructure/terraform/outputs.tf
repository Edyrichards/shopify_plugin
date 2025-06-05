output "kubeconfig" {
  value = module.eks.kubeconfig
  sensitive = true
}

output "rds_endpoint" {
  value = module.rds.db_instance_endpoint
}

output "redis_endpoint" {
  value = module.redis.primary_endpoint_address
}

output "elastic_endpoint" {
  value = elasticstack_deployment.es.elasticsearch[0].https_endpoint
}
