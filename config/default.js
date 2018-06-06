module.exports = {
  "DB": {
    "Type":"postgres",
    "User":"",
    "Password":"",
    "Port":5432,
    "Host":"localhost",
    "Database":""
  },


  "Redis":
  {
    "mode":"sentinel",//instance, cluster, sentinel
    "ip": "",
    "port": 6389,
    "user": "",
    "password": "",
    "sentinels":{
      "hosts": "",
      "port":16389,
      "name":"redis-cluster"
    }

  },


  "Security":
  {

    "ip" : "",
    "port": 6389,
    "user": "",
    "password": "",
    "mode":"sentinel",//instance, cluster, sentinel
    "sentinels":{
      "hosts": "",
      "port":16389,
      "name":"redis-cluster"
    }
  },


  "Host":
  {
    "profilesearch":"secondaryonly",
    "resource": "cluster",
    "vdomain": "localhost",
    "domain": "localhost",
    "port": "3637",
    "version": "1.0.0.0"
  },

  "LBServer" : {

    "ip": "localhost",
    "port": "3434"

  },


  "Mongo":
  {

    "ip":"",
    "port":"27017",
    "dbname":"",
    "password":"",
    "user":"",
    "replicaset" :""

  },

  "RabbitMQ":
  {
    "ip": "",
    "port": 5672,
    "user": "",
    "password": "",
    "vhost":'/'
  },


    "Services" : {
      "accessToken":"",
      "resourceServiceHost": "",
      "resourceServicePort": "8831",
      "resourceServiceVersion": "1.0.0.0",
      "sipuserendpointserviceHost": "",
      "sipuserendpointservicePort": "8831",
      "sipuserendpointserviceVersion": "1.0.0.0",
      "clusterconfigserviceHost": "",
      "clusterconfigservicePort": "8831",
      "clusterconfigserviceVersion": "1.0.0.0"
    }
};
