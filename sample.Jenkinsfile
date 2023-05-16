pipeline {
    options {

    }
    agent none
    stages {
        stage('Setup') {
            parallel {
                stage('Pre-action') {

                }
                stage('Downloading') {

                }
            }
        }
        stage('Static Scan') {
            when { 
                beforeAgent true
                expression { true }
            }
            agent { label 'my-agent' }
            steps {
                container('my-agent') {

                }
                container('other-container') {

                }
            }
        }
        stage('Build and Test') {
            matrix {
                agent any
                axes {
                    axis {
                        name 'PLATFORM'
                        values 'linux', 'windows', 'mac'
                    }
                    axis {
                        name 'BROWSER'
                        values 'firefox', 'chrome', 'safari', 'edge'
                    }
                }
                stages {
                    stage('Build') {
                        steps {
                            echo "Do Build for ${PLATFORM} - ${BROWSER}"
                        }
                    }
                    stage('Test') {
                        steps {
                            echo "Do Test for ${PLATFORM} - ${BROWSER}"
                        }
                    }
                }
            }
        }
        stage('Report') {
            agent any
            steps {

            }
        }
    }
}
