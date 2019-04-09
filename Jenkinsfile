pipeline {
    agent {
        docker {
            image 'registry.buk.cn/node:8.11.2' 
            args '-p 3000:3000' 
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh 'npm install' 
            }
        }
    }
}