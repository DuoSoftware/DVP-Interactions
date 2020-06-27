module.exports = {
  DB: {
    Type: "SYS_DATABASE_TYPE",
    User: "SYS_DATABASE_POSTGRES_USER",
    Password: "SYS_DATABASE_POSTGRES_PASSWORD",
    Port: "SYS_SQL_PORT",
    Host: "SYS_DATABASE_HOST",
    Database: "SYS_DATABASE_NAME",
  },

  Redis: {
    mode: "SYS_REDIS_MODE",
    ip: "SYS_REDIS_HOST",
    port: "SYS_REDIS_PORT",
    user: "SYS_REDIS_USER",
    password: "SYS_REDIS_PASSWORD",
    sentinels: {
      hosts: "SYS_REDIS_SENTINEL_HOSTS",
      port: "SYS_REDIS_SENTINEL_PORT",
      name: "SYS_REDIS_SENTINEL_NAME",
    },
  },

  Security: {
    ip: "SYS_REDIS_HOST",
    port: "SYS_REDIS_PORT",
    user: "SYS_REDIS_USER",
    password: "SYS_REDIS_PASSWORD",
    mode: "SYS_REDIS_MODE",
    sentinels: {
      hosts: "SYS_REDIS_SENTINEL_HOSTS",
      port: "SYS_REDIS_SENTINEL_PORT",
      name: "SYS_REDIS_SENTINEL_NAME",
    },
  },

  Mongo: {
    ip: "SYS_MONGO_HOST",
    port: "SYS_MONGO_PORT",
    dbname: "SYS_MONGO_DB",
    password: "SYS_MONGO_PASSWORD",
    user: "SYS_MONGO_USER",
    replicaset: "SYS_MONGO_REPLICASETNAME",
  },

  Host: {
    vdomain: "LB_FRONTEND",
    domain: "HOST_NAME",
    port: "HOST_INTERACTIONS_PORT",
    version: "HOST_VERSION",
    profilesearch: "EXTERNAL_PROFILE_SEARCH",
  },

  LBServer: {
    ip: "LB_FRONTEND",
    port: "LB_PORT",
  },

  RabbitMQ: {
    ip: "SYS_RABBITMQ_HOST",
    port: "SYS_RABBITMQ_PORT",
    user: "SYS_RABBITMQ_USER",
    password: "SYS_RABBITMQ_PASSWORD",
    vhost: "SYS_RABBITMQ_VHOST",
  },

  Services: {
    accessToken: "HOST_TOKEN",
    resourceServiceHost: "SYS_RESOURCESERVICE_HOST",
    resourceServicePort: "SYS_RESOURCESERVICE_PORT",
    resourceServiceVersion: "SYS_RESOURCESERVICE_VERSION",
    sipuserendpointserviceHost: "SYS_SIPUSERENDPOINTSERVICE_HOST",
    sipuserendpointservicePort: "SYS_SIPUSERENDPOINTSERVICE_PORT",
    sipuserendpointserviceVersion: "SYS_SIPUSERENDPOINTSERVICE_VERSION",
    clusterconfigserviceHost: "SYS_CLUSTERCONFIG_HOST",
    clusterconfigservicePort: "SYS_CLUSTERCONFIG_PORT",
    clusterconfigserviceVersion: "SYS_CLUSTERCONFIG_VERSION",
  },
};

//NODE_CONFIG_DIR
