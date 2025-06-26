pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('docker')
        // App
        appGroup = 'cyberadvance'
        appName = 'example-app'
        appVersion = '0.1'
    }
    stages {
        stage('Build') {
            steps {
                sh "docker build -t ${appGroup}/${appName}:${appVersion}.${env.BUILD_NUMBER} ."
            }
            post {
                success {
                    echo 'Build success...'
                }
                failure {
                    echo 'Build failure !!'
                }
            }
        }
        stage('Push image') {
            steps {
                script {
                    sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin"
                    sh "docker push ${appGroup}/${appName}:${appVersion}.${env.BUILD_NUMBER}"
                }
            }
            post {
                success {
                    echo 'Push image success...'
                }
                failure {
                    echo 'Push image failure !!'
                }
            }
        }
    }
    post {
        always {
            sh "docker image rm -f ${appGroup}/${appName}:${appVersion}.${env.BUILD_NUMBER}"
            sh 'docker logout'
            cleanWs()
        }
    }
}