pipeline {
    agent any
    // tools {
    //     jdk 'jdk-17.0.6'
    //     gradle 'gradle-8.2'
    // }
    stages {
        // stage('clone project') {
        //     steps {
        //         git branch: 'dev', credentialsId: 'locngo', url: 'https://gitlab.sful.com.vn/document/pda-pccc/rms'
        //     }
        // }
        // stage('Init') {
        //     steps {
        //         sh 'env | grep -e PATH -e JAVA_HOME'
        //         sh 'which java'
        //         sh 'java -version'
        //         sh 'gradle --version'
        //         sh 'chmod +x ./gradlew'
            
        //     }
        // }
  
        // stage('build docker image') { 
        //     steps {
        //         sh 'gradle --stop'
        //         sh 'gradle bootBuildImage' 
        //     }
        // }
        stage('Run Docker Image') {
            steps {
                sh '''
                    docker compose up -d --build
                '''
            }
        }
        
    }
}
