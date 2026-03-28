pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git(
                    url: 'https://github.com/vijay-pankaj/ChatApp-Chatly-.git',
                    branch: 'main'
                    // credentialsId: 'github-pat-id' // optional for public repo
                )
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('chatapp') {   
                    bat 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                dir('chatapp') {   
                    bat 'npm run build'
                }
            }
        }

       stage('Archive') {
    steps {
        dir('chatapp') {
            archiveArtifacts artifacts: 'dist/**', fingerprint: true
        }
    }
}

    }

    post {
        success {
            echo 'Build successful!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
