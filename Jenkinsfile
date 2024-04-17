pipeline {
    agent any
    
    environment {
        DOCKER_HUB_PASSWORD = credentials('dockerhub-pwd')
        // AWS_DEFAULT_REGION = 'ap-south-1'
        // AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        // AWS_SECRET_ACCESS_KEY_ID = credentials('aws-secret-access-key-id')
    }

    stages {
        stage('Git checkout') {
            steps{
                git branch: 'prod', url: 'https://github.com/rcy08/ticketvibe-docker'
            }
        }
        stage('Build the docker images') {
            steps {
                script {
                    // Build client, server, and nginx Docker images

                    bat 'docker build -t rcy08/ticketvibe-client ./client'
                    bat 'docker build -t rcy08/ticketvibe-server ./server'
                    bat 'docker build -t rcy08/ticketvibe-nginx ./nginx'
                }
            }
        }
        stage('Push the images to docker hub') {
            steps {
                script {
                    // Push Docker images to Docker Hub

                    bat 'docker login -u rcy08 -p %DOCKER_HUB_PASSWORD%'

                    bat 'docker push rcy08/ticketvibe-client'
                    bat 'docker push rcy08/ticketvibe-server'
                    bat 'docker push rcy08/ticketvibe-nginx'

                    // SSH into EC2 instance and pull Docker images
                    
                    // sshagent(credentials: ['your-ec2-ssh-key']) {
                    //     sh 'ssh -o StrictHostKeyChecking=no ec2-user@<IP> "docker pull rcy08/ticketvibe-client"'
                    //     sh 'ssh -o StrictHostKeyChecking=no ec2-user@<IP> "docker pull rcy08/ticketvibe-server"'
                    //     sh 'ssh -o StrictHostKeyChecking=no ec2-user@<IP> "docker pull rcy08/ticketvibe-nginx"'
                    // }
                }
            }
        }
        stage('Run the application') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'ticketvibe-env', variable: 'envFile')]) {

                        // Read the content of the secret file
                        def content = readFile(file: "${envFile}")
                        
                        // Write the content to a .env file
                        writeFile file: './server/.env', text: content

                    }

                    // Run the application
                    bat 'docker-compose up --build -d'
                }
            }
        }
    }
}

