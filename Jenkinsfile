pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    CI = 'true'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Validate environment') {
      steps {
        powershell '''
          node --version
          npm --version
        '''
      }
    }

    stage('Install dependencies') {
      steps {
        powershell '''
          npm.cmd --prefix backend ci --no-audit --no-fund
          npm.cmd --prefix frontend ci --no-audit --no-fund
        '''
      }
    }

    stage('Backend tests') {
      steps {
        powershell 'npm.cmd --prefix backend test -- --reporter dot'
      }
    }

    stage('Frontend tests') {
    steps {
        dir('frontend') {
            powershell 'npm test -- --passWithNoTests'
        }
    }
}

    stage('Frontend production build') {
      steps {
        powershell 'npm.cmd --prefix frontend run build'
      }
    }
  }
}
