const object = {data:"hello"};

let cars = [];
getCars();

let tracks = [];
getTracks();


// Retrieve the cars stored in the server db and display it
async function getCars(){
    cars = [];
    const response = await fetch("/rf2_cars");
    const data = await response.json();
    data.forEach(entry => {
        const car = entry.car;
        console.log(car);
        cars.push(car);
    });

    loadCars();
}

// Retrieve the tracks stored in the server db and display it
async function getTracks(){
    tracks = [];
    const response = await fetch("/rf2_tracks");
    const data = await response.json();
    data.forEach(entry => {
        const track = entry.track;
        console.log(track);
        tracks.push(track);
    });

    loadTracks();
}

// Load the cars to the DOM
function loadCars(){
    const carSelector = document.getElementById("carSelector");
    carSelector.innerHTML = "";

    cars.forEach(car => {
        carSelector.innerHTML += `<option value="${car}">${car}</option>`
    });
}

// Load the tracks to the DOM
function loadTracks(){
    const trackSelector = document.getElementById("trackSelector");
    trackSelector.innerHTML = "";

    tracks.forEach(track => {
        trackSelector.innerHTML += `<option value="${track}">${track}</option>`
    });
}

// send a post method => insert a car/send data to server
async function postData(dataToSend){
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
    };
    const response = await fetch("/api", options);
    const data = await response.json();
    console.log(data);
}

//postData(data);


