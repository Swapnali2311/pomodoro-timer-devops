@'
pipeline {
    agent any

    environment {
        IMAGE_NAME = "swapnali2311/pomodoro-timer"
    }

    stages {
        stage("Clone Repository") {
            steps {
                git branch: "main", url: "https://github.com/Swapnali2311/pomodoro-timer-devops.git"
            }
        }

        stage("Build Docker Image") {
            steps {
                script {
                    sh "docker build -t $IMAGE_NAME:latest ."
                }
            }
        }

        stage("Push to DockerHub") {
            steps {
                withCredentials([string(credentialsId: "dockerhub-token", variable: "DOCKER_TOKEN")]) {
                    sh '''
                    echo $DOCKER_TOKEN | docker login -u swapnali2311 --password-stdin
                    docker push $IMAGE_NAME:latest
                    '''
                }
            }
        }

        stage("Deploy to Kubernetes") {
            steps {
                sh "kubectl apply -f k8s-deployment.yaml"
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}
'@ | Out-File -Encoding UTF8 Jenkinsfile
