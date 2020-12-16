class Dashboard {
    constructor() {
        console.log("App is ready");
        this.display = new Display();
        this.raceEvents = [];
        for (let i = 0; i < 6; i++) {
            this.raceEvents.push(new RaceEvent());
        }
        const newEventButton = document.getElementById("newEvent");
        newEventButton.addEventListener("click", () => this.newEvent());
    }
    newEvent() {
        this.raceEvents.push(new RaceEvent());
        this.currentRaceEvent = this.raceEvents[this.raceEvents.length - 1];
        this.display.update(this.currentRaceEvent, this.raceEvents);
        console.log(this.raceEvents);
    }
    createRaceEvent(raceEvent) {
    }
    removeRaceEvent(raceEvent) {
    }
}
class Display {
    constructor() {
        this.eventContent = document.querySelector(".app-main");
        this.eventList = document.querySelector(".event-container");
        this.initDOM = this.createInitDOM();
    }
    update(currentRaceEvent, raceEvents) {
        this.eventContent.append(this.initDOM);
        this.raceEvent = currentRaceEvent;
        document.getElementById("addTrackButton").addEventListener("click", () => this.addTrack());
        document.getElementById("addCarButton").addEventListener("click", () => this.addCar());
        document.getElementById("addParticipantButton").addEventListener("click", () => this.addParticipant());
        const trackImg = document.getElementById("trackImg");
        trackImg.addEventListener("change", () => console.log(trackImg.files[0]));
        this.updateDate();
        this.updateParticipantMax();
        this.updateInfo();
        this.updateTracks();
        this.updateCars();
        this.updateImgs();
        this.updateParticipant();
        this.updateEventList(raceEvents);
    }
    updateEventList(raceEvents) {
        const container = document.querySelector(".event-container");
        let children = container.children;
        console.log(children.item(5));
        while (children.length > 1) {
            const event = children.item(children.length - 1);
            if (event.id !== "newEvent") {
                event.remove();
            }
        }
        raceEvents.forEach((raceEvent) => {
            const main = document.createElement("div");
            main.className = "event-main-img";
            const blur = document.createElement("div");
            blur.className = "blur";
            const date = document.createElement("p");
            date.className = "event-img-date";
            date.innerText = raceEvent.getDate();
            blur.append(date);
            main.append(blur);
            container.append(main);
        });
    }
    updateDate() {
        const field = document.getElementById("dateInput");
        field.value = this.raceEvent.getDate().toString();
    }
    updateParticipantMax() {
        const field = (document.getElementById("participantInput"));
        field.value = this.raceEvent.getParticipantMax().toString();
    }
    updateInfo() {
        const field = document.getElementById("textInfo");
        field.value = this.raceEvent.getInfo();
    }
    updateTracks() {
        const container = document.getElementById("track-text").children[1];
        container.innerHTML = "";
        this.raceEvent.getTracks().forEach((track) => {
            const item = document.createElement("div");
            item.className = "item";
            const text = document.createElement("a");
            text.innerText = track.name;
            if (track.link !== "") {
                text.href = track.link;
                text.target = "_blank";
            }
            else {
                text.style.color = "black";
            }
            const remove = document.createElement("p");
            remove.className = "delete-element track-item";
            remove.innerHTML = "&times";
            remove.addEventListener("click", (event) => this.removeElement(event));
            item.append(text);
            item.append(remove);
            container.append(item);
        });
    }
    updateCars() {
        const container = document.getElementById("car-text").children[1];
        container.innerHTML = "";
        this.raceEvent.getCars().forEach((car) => {
            const item = document.createElement("div");
            item.className = "item";
            const text = document.createElement("a");
            text.innerText = car.name;
            if (car.link !== "") {
                text.href = car.link;
                text.target = "_blank";
            }
            else {
                text.style.color = "black";
            }
            const remove = document.createElement("p");
            remove.className = "delete-element car-item";
            remove.innerHTML = "&times";
            remove.addEventListener("click", (event) => this.removeElement(event));
            item.append(text);
            item.append(remove);
            container.append(item);
        });
    }
    removeElement(event) {
        const element = event.target.parentElement.children[0];
        if (element.parentElement.parentElement.parentElement.id ===
            "track-text") {
            this.raceEvent.removeTrack(element.innerHTML);
            this.updateTracks();
            return 0;
        }
        if (element.parentElement.parentElement.parentElement.id === "car-text") {
            this.raceEvent.removeCar(element.innerHTML);
            this.updateCars();
            return 0;
        }
        if (element.parentElement.parentElement.parentElement.id ===
            "participants-text") {
            this.raceEvent.removeParticipant(element.innerHTML);
            this.updateParticipant();
            return 0;
        }
        return 1;
    }
    updateImgs() {
        const trackContainer = document.getElementById("trackImg");
        const carContainer = document.getElementById("carImg");
        trackContainer.style.backgroundImage = `url("${this.raceEvent.getTrackImg()}")`;
        trackContainer.style.backgroundSize = "auto 100%";
        trackContainer.style.backgroundPosition = "center";
        trackContainer.style.animation = "none";
        carContainer.style.backgroundImage = `url("${this.raceEvent.getCarImg()}")`;
        carContainer.style.backgroundSize = "auto 100%";
        carContainer.style.backgroundPosition = "center";
        carContainer.style.animation = "none";
    }
    updateParticipant() {
        const container = document.querySelector(".players");
        container.innerHTML = "";
        this.raceEvent.getParticipants().forEach((participant) => {
            const item = document.createElement("div");
            item.className = "item";
            const player = document.createElement("p");
            player.className = "player";
            player.innerText = participant;
            const remove = document.createElement("p");
            remove.className = "delete-element participant-item";
            remove.innerHTML = "&times";
            remove.addEventListener("click", (event) => this.removeElement(event));
            item.append(player);
            item.append(remove);
            container.append(item);
        });
        for (let i = 0; i < this.raceEvent.getParticipantMax(); i++) {
            const item = document.createElement("div");
            item.className = "item empty-place";
            const button = document.createElement("a");
            button.className = "playerButton";
            button.href = "#popupPlayer";
            const plusSign = document.createElement("p");
            plusSign.className = "add-element";
            plusSign.innerHTML = "&#43;";
            button.append(plusSign);
            item.append(button);
            container.append(item);
        }
    }
    addTrack() {
        this.raceEvent.addTrack({
            name: document.getElementById("trackName").value,
            link: document.getElementById("trackLink").value
        });
        this.updateTracks();
    }
    addCar() {
        this.raceEvent.addCar({
            name: document.getElementById("carName").value,
            link: document.getElementById("carLink").value
        });
        this.updateCars();
    }
    addParticipant() {
        this.raceEvent.addParticipant(document.getElementById("playerName").value);
        this.updateParticipant();
    }
    createInitDOM() {
        let html = document.createElement("div");
        html.className = "event";
        html.innerHTML = `<div class="event-tile" id="track">
                <input type="file" class="file-opener" name="trackImg" id="trackImg" accept="image/png, image/jpeg">
                <div class="event-tile-text" id="track-text">
                    <h2>Circuit :</h2>
                    <div class="element">
                    </div>
                    <a class="button" href="#popupTrack">
                        <div class="add-trackORcar"></div>
                    </a>
                    <div id="popupTrack" class="overlay">
                        <div class="popup" id="addTrack">
                            <h2>Ajouter un circuit</h2>
                            <a class="close" href="#">&times;</a>
                            <div class="content">
                                <p>Nom du circuit :</p>
                                <input
                                    type="text"
                                    name="trackName"
                                    id="trackName"
                                    class="trackORcar-field"
                                />
                                <p>Lien du mod :</p>
                                <input
                                    type="text"
                                    name="trackLink"
                                    id="trackLink"
                                    class="trackORcar-field"
                                    placeholder="Ne rien inserer si pas de lien"
                                />
                                <div class="add-trackORcar-popup" id="addTrackButton"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="event-tile" id="car">
                <input type="file" class="file-opener" name="carImg" id="carImg" accept="image/png, image/jpeg">
                <div class="event-tile-text" id="car-text">
                    <h2>Voiture :</h2>
                    <div class="element">
                    </div>
                    <a class="button" href="#popupCar">
                        <div class="add-trackORcar"></div>
                    </a>
                    <div id="popupCar" class="overlay">
                        <div class="popup" id="addCar">
                            <h2>Ajouter une voiture</h2>
                            <a class="close" href="#">&times;</a>
                            <div class="content">
                                <p>Nom de la voiture :</p>
                                <input
                                    type="text"
                                    name="carName"
                                    id="carName"
                                    class="trackORcar-field"
                                />
                                <p>Lien de la voiture :</p>
                                <input
                                    type="text"
                                    name="carLink"
                                    id="carLink"
                                    class="trackORcar-field"
                                    placeholder="Ne rien inserer si pas de lien"
                                />
                                <div class="add-trackORcar-popup" id="addCarButton"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="event-tile" id="info">
                <div class="event-tile-text" id="info-text">
                    <h2>Informations :</h2>
                    <div class="element">
                            <div class="info-element">
                                <p>Date :</p>
                                <input class="infoInput" type="datetime-local" name="dateInput" id="dateInput">
                            </div>
                            <div class="info-element">
                                <p>Participants maximum :</p>
                                <input class="infoInput" type="number" name="participantInput" id="participantInput">
                            </div>
                            <div class="info-element">
                                <p>Détails supplémentaires :</p>
                                <textarea class="infoInput" name="textInfo" id="textInfo" cols="10" rows="10"></textarea>
                            </div>
                    </div>
                </div>
            </div>
            <div class="event-tile" id="participants">
                <div class="event-tile-text" id="participants-text">
                    <h2>Participants :</h2>
                    <div class="players">
                    </div>
                    <div id="popupPlayer" class="overlay">
                        <div class="popup" id="addPlayer">
                            <h2>Ajouter un participant</h2>
                            <a class="close" href="#">&times;</a>
                            <div class="content">
                                <p>Nom du participant :</p>
                                <input
                                    type="text"
                                    name="playerName"
                                    id="playerName"
                                    class="trackORcar-field"
                                />
                                <div class="playerButton-popup" id="addParticipantButton"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        return html;
    }
}
class RaceEvent {
    constructor() {
        this.tracks = [
            {
                name: "Adria Karting Raceway (Paid DLC – KartSim)",
                link: "https://steamcommunity.com/workshop/about/?appid=365960",
            },
            {
                name: "Adria Karting Raceway (Paid DLC – KartSim)",
                link: "https://steamcommunity.com/workshop/about/?appid=365960",
            },
        ];
        this.cars = [
            {
                name: "2019 Aston Martin Vantage GT3 (Paid DLC)",
                link: "https://steamcommunity.com/workshop/about/?appid=365960",
            },
            {
                name: "2020 Bentley Continental GT3 (Paid DLC)",
                link: "",
            },
        ];
        this.trackImg = "/assets/img/rf2.jpg";
        this.carImg = "/assets/img/rf2.jpg";
        this.participants = ["Bob Panda", "Taulier", "Frednz"];
        this.maxParticipants = 24;
        this.date = new Date(2020, 11, 19, 20, 30, 0, 0);
        this.eventImg = this.carImg || "/assets/img/rf2.jpg";
        this.info =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus faucibus leo vel massa facilisis, et imperdiet ipsum dictum. Cras ullamcorper placerat ligula, aliquam mollis erat tempus a.";
    }
    setTrackImg(src) {
        this.trackImg = "/assets/img/" + src;
    }
    removeTrack(name) {
        this.tracks = this.tracks.filter((track) => track.name !== name);
    }
    removeCar(name) {
        this.cars = this.cars.filter((car) => car.name !== name);
    }
    removeParticipant(name) {
        this.participants = this.participants.filter((participant) => participant !== name);
    }
    addTrack(track) {
        let exist = false;
        this.tracks.forEach((existingTrack) => {
            if (existingTrack.link === track.link && existingTrack.name === track.name) {
                exist = true;
            }
        });
        if (!exist) {
            this.tracks.push(track);
        }
        console.log(this.tracks);
    }
    addCar(car) {
        let exist = false;
        this.cars.forEach((existingCar) => {
            if (existingCar.link === car.link && existingCar.name === car.name) {
                exist = true;
            }
        });
        if (!exist) {
            this.cars.push(car);
        }
        console.log(this.cars);
    }
    addParticipant(participant) {
        let exist = false;
        this.participants.forEach((existingParticipant) => {
            if (existingParticipant === participant) {
                exist = true;
            }
        });
        if (!exist) {
            this.participants.push(participant);
        }
        console.log(this.participants);
    }
    getDate() {
        return this.date.toISOString().slice(0, 16);
    }
    getParticipantMax() {
        return this.maxParticipants;
    }
    getInfo() {
        return this.info;
    }
    getTracks() {
        return this.tracks;
    }
    getCars() {
        return this.cars;
    }
    getTrackImg() {
        return this.trackImg;
    }
    getCarImg() {
        return this.carImg;
    }
    getParticipants() {
        return this.participants;
    }
}
window.addEventListener("load", init);
function init() {
    const dashboard = new Dashboard();
}
//# sourceMappingURL=dashboard.js.map