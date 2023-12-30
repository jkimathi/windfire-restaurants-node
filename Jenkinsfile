pipeline {
    options {
        // set a timeout of 60 minutes for this pipeline
        timeout(time: 60, unit: 'MINUTES')
    }

    environment {
        APP_NAME = "windfire-restaurants-backend"
        DEV_PROJECT = "morning-dew"
        STAGE_PROJECT = "morning-dew-stage"
        PROD_PROJECT = "morning-dew-prod"
        APP_GIT_URL = "https://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@github.com/jkimathi/windfire-restaurants-node"
    }
    
    agent {
      node {
        label 'nodejs'
      }
    }

    stages {
        stage('Deploy to DEV environment') {
            steps {
                echo '###### Deploy to DEV environment ######'
                script {
                    openshift.withCluster() {
                        openshift.withProject("$DEV_PROJECT") {
                            echo "Using project: ${openshift.project()}"
                            // If BuildConfig already exists, start a new build to update the application
                            if (openshift.selector("bc", APP_NAME).exists()) {
                                echo "BuildConfig " + APP_NAME + " exists, start new build to update app ..."
                                // Start new build (it corresponds to oc start-build <buildconfig>)
                                def bc = openshift.selector("bc", "${APP_NAME}")
                                bc.startBuild()
                                // If a Route does not exist, expose the Service and create the Route
                                if (!openshift.selector("route", APP_NAME).exists()) {
                                    echo "Route " + APP_NAME + " does not exist, exposing service ..." 
                                    def service = openshift.selector("service", APP_NAME)
                                    service.expose()
                                }
                            } 
                            // If BuildConfig does not exist, deploy a new application using an OpenShift Templates
                            else{
                                echo "BuildConfig " + APP_NAME + " does not exist, creating app ..."
                                openshift.newApp('deployment/openshift/windfire-restaurants-backend-template.yaml')
                            }
                            def route = openshift.selector("route", APP_NAME)
                            echo "Test application with "
                            def result = route.describe()   
                        }
                    }
                }
            }
        }
    }
}
