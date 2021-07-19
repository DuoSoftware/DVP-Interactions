module.exports = {
  DB: {
    Type: "postgres",
    User: "duo",
    Password: "DuoS123",
    Port: 5432,
    Host: "localhost",
    Database: "dvpdb",
  },

  Redis: {
    mode: "instance", //instance, cluster, sentinel
    ip: "13.59.52.179",
    port: 6379,
    user: "",
    password: "DuoS123",
    sentinels: {
      hosts: "138.197.90.92,45.55.205.92,138.197.90.92",
      port: 16389,
      name: "redis-cluster",
    },
  },

  Security: {
    ip: "13.59.52.179",
    port: 6379,
    user: "",
    password: "DuoS123",
    mode: "instance", //instance, cluster, sentinel
    sentinels: {
      hosts: "138.197.90.92,45.55.205.92,138.197.90.92",
      port: 16389,
      name: "redis-cluster",
    },
  },

  Host: {
    profilesearch: "secondaryonly",
    resource: "cluster",
    vdomain: "localhost",
    domain: "localhost",
    port: "3637",
    version: "1.0.0.0",
  },

  LBServer: {
    ip: "localhost",
    port: "3434",
  },

  Mongo: {
    ip: "facetone-prod.2xyao.mongodb.net",
    port: "",
    dbname: "dvpdb",
    password: "DuoS123",
    user: "duo",
    type: "mongodb"

  },

  //mongodb+srv://facetone:Hds7236YD@facetone-prod.2xyao.mongodb.net/dvpdb
  //mongodb+srv://facetone:Hds7236YD@facetone-prod.2xyao.mongodb.net/test?authSource=admin&replicaSet=atlas-unwxnp-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true

  RabbitMQ: {
    ip: "13.59.52.179",
    port: 5672,
    user: "admin",
    password: "admin",
    vhost: "/",
  },

  Services: {
    accessToken:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdWtpdGhhIiwianRpIjoiMTdmZTE4M2QtM2QyNC00NjQwLTg1NTgtNWFkNGQ5YzVlMzE1Iiwic3ViIjoiNTZhOWU3NTlmYjA3MTkwN2EwMDAwMDAxMjVkOWU4MGI1YzdjNGY5ODQ2NmY5MjExNzk2ZWJmNDMiLCJleHAiOjE4OTMzMDI3NTMsInRlbmFudCI6LTEsImNvbXBhbnkiOi0xLCJzY29wZSI6W3sicmVzb3VyY2UiOiJhbGwiLCJhY3Rpb25zIjoiYWxsIn1dLCJpYXQiOjE0NjEyOTkxNTN9.YiocvxO_cVDzH5r67-ulcDdBkjjJJDir2AeSe3jGYeA",
    resourceServiceHost: "resourceservice.104.131.67.21.xip.io",
    resourceServicePort: "8831",
    resourceServiceVersion: "1.0.0.0",
    sipuserendpointserviceHost: "sipuserendpointservice.104.131.67.21.xip.io",
    sipuserendpointservicePort: "8831",
    sipuserendpointserviceVersion: "1.0.0.0",
    clusterconfigserviceHost: "clusterconfig.104.131.67.21.xip.io",
    clusterconfigservicePort: "8831",
    clusterconfigserviceVersion: "1.0.0.0",
  },
};
