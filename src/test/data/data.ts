export const jenkinsfileSimple = `
pipeline {
    options {

    }
    agent none
}
`;

export const jenkinsfileFull = `
// This is a comment with stage("Test 1") {}
/*
    And a multiline comment
    stage("Test 2") {

    }
*/

pipeline {
    options { // inline comment after code

    }
    agent none
    stages {
        stage("Setup") {
            parallel {
                stage('Pre-action') {
                    stages {
                        stage('One') {

                        }
                        stage('Two') {

                        }
                    }
                }
                stage('Downloading') {
                    sh '''
                        # triple \'quote test {{}
                    '''
                }
            }
        }
        stage('Static Scan') {
            when { 
                beforeAgent true
                expression {true}
            }
            agent { label 'my-agent' }
            steps {
                container('my-agent') {

                }
                container('other-container') {
                    sh """
                        # triple \"quote test }}}
                    """
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
                            echo "Do Build for \${PLATFORM} - \${BROWSER}"
                        }
                    }
                    stage('Test') {
                        steps {
                            echo "Do Test for \${PLATFORM} - \${BROWSER}"
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
`;
