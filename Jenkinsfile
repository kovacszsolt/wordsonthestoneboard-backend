node {
    def DOCKERREPOSITORYNAME = "kovacszsolt/wordsonthestoneboard-backend"
    def DOCKERCREDENTIAL = "dockerhub"
    def now = new Date()
    stage("Clone") {
        git credentialsId: "github-kovacszsolt", url: "https://github.com/kovacszsolt/wordsonthestoneboard-backend"
        writeFile file: "version.json", text: "{\"version\":\"${BUILD_NUMBER}\",\"createdate\":\"${now.format("MM-dd-YYYY HH:mm", TimeZone.getTimeZone("UTC"))}\" }"
    }
    stage("Build") {
        dockerImage = docker.build "${DOCKERREPOSITORYNAME}"
        dockerImage.tag("latest")
        dockerImage.tag("${currentBuild.number}")
        dockerImage.push("latest")
        dockerImage.push("${currentBuild.number}")
    }
    stage("Deploy") {
        sh "ssh docker@itcrowd.hu './wordsonthestoneboard.sh'"
    }
    stage("Clear") {
        cleanWs()
    }
}
