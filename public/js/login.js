

let form = document.getElementById('login-form')
const displayName = localStorage.getItem('display_Name') || "";

console.log("name= ", displayName)
if(displayName) {
    form.name.value= displayName
}

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
let error = urlParams.get('error')
let roomId = urlParams.get('room')

 if(error==='name') {
    let doc= document.getElementById('errorName')
    let element= '<div>Error<div>'
    doc.insertAdjacentHTML('beforeend',element)
 }

 if(roomId) {

    document.getElementById('roomId').value=String(roomId);
 }

form.addEventListener('submit', (e) => {
    e.preventDefault();
   
    localStorage.setItem('display_Name', e.target.name.value);
    sessionStorage.setItem('displayName', e.target.name.value)

    // localStorage.setItem('display_name', e.target.name.value)
    // localStorage.setItem('roomID', e.target.room.value)

    let roomID = e.target.room.value

    let roomIDsArray = JSON.parse(localStorage.getItem('roomIDsArray')) || [];
    console.log("roomIds= ", JSON.parse(localStorage.getItem('roomIDsArray')) )
    
    if ((roomIDsArray.length > 0) &&  (roomIDsArray.includes(parseInt(roomID)))) 
    {
        window.location = `/room.html?room=${roomID}`;
    }

    let error= document.getElementById('error')
    let element= '<div>Error<div>'
    error.insertAdjacentHTML('beforeend', element)
})
