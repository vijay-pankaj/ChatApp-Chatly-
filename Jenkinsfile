pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git(
                    url: 'https://github.com/vijay-pankaj/ChatApp-Chatly-.git',
                    branch: 'main'
                )
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('chatapp') {   
                    sh 'npm install'  
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('chatapp') {   
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Stop Old Containers') {
            steps {
                sh 'docker-compose down'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        success {
            echo 'Build & Deployment successful'
        }
        failure {
            echo 'Build or Deployment failed'
        }
    }
}
