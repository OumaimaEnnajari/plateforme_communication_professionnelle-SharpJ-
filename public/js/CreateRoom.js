
let forme = document.getElementById('create-form');
const displayName = localStorage.getItem('display_Name') || "";

console.log("name= ", displayName)
if(displayName) {
    forme.name.value= displayName
}

let uIdAnnimateur = localStorage.getItem('uIdAnnimateur') || ""   //reste valable durant que la session (onglet) de user est ouverte 
if(!uIdAnnimateur) 
{
    uIdAnnimateur = String(Math.floor(Math.random() * 10000))
    localStorage.setItem('uIdAnnimateur', uIdAnnimateur)

}
sessionStorage.setItem('uId', uIdAnnimateur)

  
forme.addEventListener('submit', (e) => {
    e.preventDefault();

    let roomIDsArray = JSON.parse(localStorage.getItem('roomIDsArray')) || [];
    localStorage.setItem('display_Name', e.target.name.value);
    sessionStorage.setItem('displayName', e.target.name.value)

    let roomID = Math.floor(Math.random() * 10000);
    let found = false;

    if (roomIDsArray.length > 0) {
        while (1) {
            found = roomIDsArray.includes(roomID);
            if (!found) {
                break;
            }
            roomID = Math.floor(Math.random() * 10000);
        }
    }

    roomIDsArray.push(roomID);
    localStorage.setItem('roomIDsArray', JSON.stringify(roomIDsArray));
    window.location = `/room.html?room=${roomID}`;
});

