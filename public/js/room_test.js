// choose a roomId n'est pas occupe
// lorsque aucun particpant ne reste dans room, il faut supprimer roomId+ leurs participants



const APP_ID = "df3eb88999f9456f9ed05dbc7dd81f05"
let listeUsers = JSON.parse(localStorage.getItem('listeUsers')) || {};

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
let roomId = urlParams.get('room')
var stompClient = null;

if(!roomId){
  window.location='/login'
  throw new Error('Redirection to login page');

}

let name= sessionStorage.getItem('displayName')
if(name === null) {
    window.location = `login?room=${roomId}&error=name`;
    throw new Error('Redirection to login page');
}

let uId = sessionStorage.getItem('uId')    //reste valable durant que la session (onglet) de user est ouverte 

if(!uId) 
{
    
        uId = String(Math.floor(Math.random() * 10000))
        sessionStorage.setItem('uId', uId)
    

}

console.log('uid= ', uId)
// Retrieve listeUsersName from localStorage
let listeUsersName = JSON.parse(localStorage.getItem('listeUsersName')) || [] ;
// Check if listeUsersName exists in localStorage
if (listeUsersName==[]) {
    // If it doesn't exist, initialize it with a default value
    listeUsersName = [{roomID:roomId , users: []}];
    localStorage.setItem('listeUsersName', JSON.stringify(listeUsersName));
    
} else {

    let found = false;

    for (let i = 0; i < listeUsersName.length; i++) {
        console.log('roomID= ', listeUsersName[i].roomID );
    
        if (listeUsersName[i].roomID === roomId) {
            found = true;
            break;
        }
    }
    
    if (!found) {
        // Add the new room ID if it wasn't found
        listeUsersName.push({ roomID: roomId, users: [] });
        localStorage.setItem('listeUsersName', JSON.stringify(listeUsersName));
    }
    

} 


// Now listeUsersName is either initialized with a default value or retrieved from localStorage

//all users in the same channel must have the same type of uid 



let roomIDsArray = JSON.parse(localStorage.getItem('roomIDsArray')) ;

let token = null;
let client;
let RTMClient;

let localTracks = []
let remoteUsers = {}

function copyLink() {
    // Texte à copier
    var textToCopy = "http://localhost:3000/room.html?room="+roomId;

    // Créer un élément de texte temporaire
    var tempElement = document.createElement("textarea");
    tempElement.value = textToCopy;

    // Ajouter l'élément à la fin du document
    document.body.appendChild(tempElement);

    // Sélectionner le texte dans l'élément temporaire
    tempElement.select();

    // Copier le texte sélectionné dans le presse-papiers
    document.execCommand("copy");

    // Supprimer l'élément temporaire
    document.body.removeChild(tempElement);

    // Afficher un message pour indiquer que le texte a été copié
    alert("Le texte a été copié !");
}

let joinRoomInit = async () => {

    client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})  //mode= type de communication effectue par ce client est le temps reel 
                                                              // codec : le codec utilise pour le tracks video trasportee, videos tracks se transport suivant codec vp8
    
    listeUsersName.forEach(element => {
        if(element.roomID== roomId) {
            console.log('repeat')
            element.users.push({uid: uId, name: name})
        }
    });

    localStorage.setItem('listeUsersName', JSON.stringify(listeUsersName))

    client.on('user-joined', handleUserJoined)
    await client.join(APP_ID, roomId, token, uId)  // se connecter au serveur Agora en save token, uid , roomid : changer le protocol from http to websocket  
    
    await ConnectToWebSocketServer()
    
    addUserTOList(uId)
    console.log("i am inside joinRoomInit ")

    client.on('user-published', handleUserPublished)
    client.on('user-left', handleUserLeft)
    
    console.log('users= ', listeUsers)
    joinStream()
    

}

let joinStream= async () => {

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks({}, {encoderConfig:{
        width:{min:640, ideal:1920, max:1920},
        height:{min:480, ideal:1080, max:1080}
    }})
    let player = `
                    
                    <div class="video__container" id="user-container-${uId}">
                        <div class="video-player" id="user-${uId}"></div>
                        <div id='name'> ${name} </div>
                    </div>
                    `

    document.getElementById('streams__container').insertAdjacentHTML('beforeend', player)

    console.log("i am inside joinStream ")
    localTracks[1].play(`user-${uId}`)  //localTracks'[1] stockent videos tracks
                                        // localTracks[0] stockent audio tracks 
    await client.publish([localTracks[0], localTracks[1]])  // server Agora fait un broadcast aux ce tracks, browser de remote user recoit ces tracks (kayda9 fl bab), il declenche event handlePublish
    document.getElementById(`user-container-${uId}`).addEventListener('click', expandVideoFrame)
   
}


let handleUserPublished = async (user, mediaType) => {

    remoteUsers[user.uid]= user
    await client.subscribe(user, mediaType)  //user accepte de voir les trackes (ouvre la porte aux tracks envoyees par user)
    let player = document.getElementById(`user-container-${user.uid}`)
    let fullName=null

    listeUsersName.forEach(obj=> {
         if(obj.roomID === roomId ) {
            obj.users.forEach(element=> {
                if(element.uid===user.uid) {
                    fullName= element.name
                }

            })
         }
    })

    if(player === null){
        
        player = `
        
            <div class="video__container" id="user-container-${user.uid}">
                <div class="video-player" id="user-${user.uid}"></div>
                <div id='name'> ${fullName} </div>
            </div>
            
           
            `

            console.log("user= ", user)

        document.getElementById('streams__container').insertAdjacentHTML('beforeend', player)
        document.getElementById(`user-container-${user.uid}`).addEventListener('click', expandVideoFrame)

    }

   
    if(mediaType === 'video') {
       
        console.log("video")
        user.videoTrack.play(`user-${user.uid}`)
    }
  
    if(mediaType === 'audio') {
        user.audioTrack.play()
    }

    document.getElementById(`user-container-${user.uid}`).addEventListener('click', expandVideoFrame)
   
    if(displayFrame.style.display) {
        document.getElementById(`user-container-${user.uid}`).style.height= '100px'
        document.getElementById(`user-container-${user.uid}`).style.width= '100px'
    }

    
}


let handleUserLeft= async (user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).style.display= 'none'
    videoFrames= document.getElementsByClassName('video__container')
   
    if(userIdInDisplayFrame == `user-container-${user.uid}` ) {
        displayFrame.style.display= 'none'
        for( let i=0; videoFrames.length >i ; i++) {
        
                videoFrames[i].style.height= '300px'
                videoFrames[i].style.width= '300px'
            
        }
    }
    console.log("user left= ", user.uid)
    removeUserFromListe(user.uid)
    listeUsersName.forEach(element => {
        if(element.roomID== roomId) {
            
            element.users.forEach( (utilisateur, index) => {
                if(utilisateur.uid== user.uid) {
                    element.users.splice(index, 1)
                    console.log('user removed : ', user.uid)
                }
            })
        }
    });
    localStorage.setItem('listeUsersName', JSON.stringify(listeUsersName))

    CheckUsersInRoomId()
}

let removeRoomId= async() => {
    for(let index=0; index<roomIDsArray.length ; index++) {
        if(roomIDsArray[index]==roomId) {
            roomIDsArray.splice(index, 1)
        }
    }
    localStorage.setItem('roomIDArray'. JSON.stringify(roomIDsArray))
}

let CheckUsersInRoomId = async() => {
    
    listeUsersName.forEach(element => {
        if(element.roomID== roomId  && element.users.length==0) {
            removeRoomId()
           
        }
    })
}
let removeUserFromListe= async(UserId) => {

    let userDOM= document.getElementById(`member__${UserId}__wrapper`)
    userDOM.remove()
    document.getElementById('members__count').textContent = String(parseInt(document.getElementById('members__count').textContent) - 1);

    let index = listeUsersName.findIndex(item => item.roomID === roomId);

    // Check if an object with the specified roomID exists
    if (index !== -1) 
    {
        // Find the index of the user with the specified userID within the users array
        let userIndex = listeUsersName[index].users.findIndex(user => user.uid === UserId);

        // Check if a user with the specified userID exists within the users array
        if (userIndex !== -1) {
            // Remove the user from the users array using splice
            listeUsersName[index].users.splice(userIndex, 1);
            console.log("User deleted successfully.");
        } else {
            console.log("User with userID " + UserId + " not found in roomID " + roomId + ".");
        }
    } else {
        console.log("RoomID " + roomId + " not found in listeUsersName.");
    }
    localStorage.setItem('listeUsersName', JSON.stringify(listeUsersName))


}

let handleUserJoined= async(user) => {

    console.log('new user joined= ', user.uid)
    addUserTOList(user.uid)

}

let addUserTOList= async(UserId) => {

    let MembresListe= document.getElementById('member__list')
    listeUsersName=  JSON.parse(localStorage.getItem('listeUsersName'))
    let nom=null
    let nbr=0
    let uIdAnnimateur= localStorage.getItem('uIdAnnimateur')

    listeUsersName.forEach(obj=> {
         if(obj.roomID === roomId ) {
            nbr= obj.users.length
            obj.users.forEach(element=> {
                if(element.uid===UserId) {
                    nom= element.name
                }

            })
         }
    })
    let player
    if(UserId === uIdAnnimateur) {
         player=  `<div class="member__wrapper" id="member__${UserId}__wrapper">
                        <div style="display: flex;">
                            <div style="display: flex; align-items: center;"> <!-- Utilisation de flexbox sur le conteneur parent -->
                                <span class="green__icon" style="display: inline-block;"></span>
                                
                                <p class="member_name" style="padding-left: 20px">${nom} :</p>
                            </div>
                            <!-- Deuxième div -->
                            <div style="display: flex; align-items: center;">
                            
                            </div>
                        </div>
     
                        <p class="member_name" style="padding-left: 30px"> annimateur de reunion </p>
                    </div> ` 
        MembresListe.insertAdjacentHTML('afterbegin', player);
    } else {
         player=  `<div class="member__wrapper" id="member__${UserId}__wrapper">
                        <div style="display: flex;">
                        <div style="display: flex; align-items: center;"> <!-- Utilisation de flexbox sur le conteneur parent -->
                        <span class="green__icon"></span>
                        <p class="member_name" style="padding-left: 20px">${nom} </p>
                        </div> 
                    </div> 
                    </div>` 
            MembresListe.insertAdjacentHTML('beforeend',player)
    }

  
   
    document.getElementById('members__count').textContent= nbr;
    
}

let leaveChannel= async() => {

    await client.leave()


}

let onMessageReceived= async(payload) => {

    let message = JSON.parse(payload.body);
    console.log("message = ", message);
    addMessageToDOM(message)

}

let addMessageToDOM= async(message) => 
{

    let messageWrapper= document.getElementById("messages")

    let newMessage= ` <div class="message__wrapper">
                            <div class="message__body">
                                <strong class="message__author">${message.sender}</strong>
                                <p class="message__text">${message.content}</p>
                        </div>
                      </div>`
                      
                      
    messageWrapper.insertAdjacentHTML('beforeend', newMessage)

    let lastMessage= document.querySelector('#messages .message__wrapper:last-child')
    if(lastMessage) {
        lastMessage.scrollIntoView()
    }
} 

let onConnected= async() => {

    console.log("user is connected")
    stompClient.subscribe('/room/' + roomId, onMessageReceived);

    // Tell your username to the server
    stompClient.send("/app/addUser",
        {},
        JSON.stringify({Sender: uId, Content: ''})
    )

    
}

let ConnectToWebSocketServer= async() => {

    var socket = new SockJS('http://localhost:8080/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, onConnected, onError);  // websocket protocol s'etablit  

} 
let onError = async() => {
    console.log("error d'eatablissement de la connection")
}

let sendMessage= async(e) => {
    
    e.preventDefault()
    let messageContent= document.getElementById('messageInput').value;
    if(messageContent && stompClient) {
        var chatMessage = {
            sender: name,
            content: messageContent,
           
        };
        console.log('message a envoye est : ',JSON.stringify(chatMessage))
        stompClient.send("/app/send/"+roomId, {}, JSON.stringify(chatMessage));
        document.getElementById('messageInput').value=''
        
    }
    console.log("message received")
}

let leaveStream = async (e) => {
    window.location='/CreateRoom'
    throw new Error('Redirection to create page');
}


window.addEventListener('beforeunload', leaveChannel)
document.getElementById('message__form').addEventListener('submit', sendMessage)
document.getElementById('leave-btn').addEventListener('click', leaveStream)
joinRoomInit()
