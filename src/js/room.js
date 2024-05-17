
export function Room () {

let displayFrame= document.getElementById('stream__box')
let videoFrames= document.getElementsByClassName('video__container')
let userIdInDisplayFrame= null;

let localScreenTracks;
let sharingScreen = false;
let uid = sessionStorage.getItem('uId') 
let nom= sessionStorage.getItem('displayName') 

let expandVideoFrame= (e) => {

    videoFrames= document.getElementsByClassName('video__container')
    let child= displayFrame.children[0] // child= <div class= video__container> </div?
    if(child) {

        //vider streaam box + ajouetr dans video__container
        document.getElementById('streams__container').appendChild(child)
    }

    displayFrame.style.display= 'block'
    displayFrame.appendChild(e.currentTarget)
    userIdInDisplayFrame= e.currentTarget.id
    for( let i=0; videoFrames.length >i ; i++) {
        if(videoFrames[i].id != userIdInDisplayFrame) {
              videoFrames[i].style.height= '100px'
              videoFrames[i].style.width= '100px'
        }
    }

}

for (let i=0; videoFrames.length >i ; i++) {
    console.log("passed 1")
    videoFrames[i].addEventListener('click', expandVideoFrame)
}

let hideDisplayFrame = () => {

    let child= displayFrame.children[0] // child= <div class= video__container> </div?
    document.getElementById('streams__container').appendChild(child)
    userIdInDisplayFrame=null
    displayFrame.style.display= 'none'

    for(let i = 0; videoFrames.length > i; i++){
        videoFrames[i].style.height = '300px'
        videoFrames[i].style.width = '400px'
    }
    

}

let toggleCamera = async (e) => {
    let button = e.currentTarget

    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        console.log("passed 2")
        button.classList.add('active')
  
    }else{
        await localTracks[1].setMuted(true)
        button.classList.remove('active')

    }


}

let toggleMic = async (e) => {
    let button = e.currentTarget

    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        console.log("passed 3")
        button.classList.add('active')
    }else{
        await localTracks[0].setMuted(true)
        button.classList.remove('active')
    }
}



let switchToCamera = async () => {
    let player = `
    <div class="video__container" id="user-container-${uId}">
                    <div class="video-player" id="user-${uId}"></div>
                    <div id='name'> ${nom} </div>
                 </div>
                 `
    displayFrame.insertAdjacentHTML('beforeend', player)

    await localTracks[0].setMuted(true)
    await localTracks[1].setMuted(true)

    document.getElementById('mic-btn').classList.remove('active')
    document.getElementById('screen-btn').classList.remove('active')

    localTracks[1].play(`user-${uId}`)
    await client.publish([localTracks[1]])
}

let toggleScreen = async (e) => {
    let screenButton = e.currentTarget
    let cameraButton = document.getElementById('camera-btn')

    if(!sharingScreen){
        sharingScreen = true

        screenButton.classList.add('active')
        cameraButton.classList.remove('active')
        cameraButton.style.display = 'none'

        localScreenTracks = await AgoraRTC.createScreenVideoTrack()

        document.getElementById(`user-container-${uId}`).remove()
        displayFrame.style.display = 'block'

        let player = `<div class="video__container" id="user-container-${uId}">
                <div class="video-player" id="user-${uId}"></div>
                <div id='name'> ${nom} </div>
            </div>`

        displayFrame.insertAdjacentHTML('beforeend', player)
        document.getElementById(`user-container-${uId}`).addEventListener('click', expandVideoFrame)

        userIdInDisplayFrame = `user-container-${uId}`
        localScreenTracks.play(`user-${uId}`)

        await client.unpublish([localTracks[1]])
        await client.publish([localScreenTracks])

        let videoFrames = document.getElementsByClassName('video__container')
        for(let i = 0; videoFrames.length > i; i++){
            if(videoFrames[i].id != userIdInDisplayFrame){
              videoFrames[i].style.height = '100px'
              videoFrames[i].style.width = '100px'
            }
          }


    }else{
        sharingScreen = false 
        cameraButton.style.display = 'block'
        document.getElementById(`user-container-${uId}`).remove()
        await client.unpublish([localScreenTracks])

        switchToCamera()
    }
}


document.getElementById('camera-btn').addEventListener('click', toggleCamera)
document.getElementById('mic-btn').addEventListener('click', toggleMic)
document.getElementById('screen-btn').addEventListener('click', toggleScreen)
displayFrame.addEventListener('click', hideDisplayFrame)

}
