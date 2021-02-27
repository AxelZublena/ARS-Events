var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Dashboard {
    constructor() {
        console.log("App is ready");
        this.display = new Display();
        this.raceEvents = [];
        const newEventButton = document.getElementById("newEvent");
        newEventButton.addEventListener("click", () => this.newEvent());
        fetch("/loadEvent")
            .then((response) => {
            return response.json();
        })
            .then((json) => {
            json.array.forEach((raceEvent) => {
                this.raceEvents.push(new RaceEvent(raceEvent.tracks, raceEvent.cars, raceEvent.trackImg, raceEvent.carImg, raceEvent.participants, raceEvent.maxParticipants, new Date(raceEvent.date), raceEvent.carImg, raceEvent.info, raceEvent._id));
            });
            this.raceEvents.sort((a, b) => b.getDateObject().getTime() - a.getDateObject().getTime());
            this.currentRaceEvent = this.raceEvents[0];
            console.log(this.currentRaceEvent);
            this.display.update(this.currentRaceEvent, this.raceEvents);
            console.log(this.raceEvents);
            this.saveButton = document.getElementById("save-btn");
            this.saveButton.addEventListener("click", () => {
                this.saveToDB();
            });
            const deleteButton = document.getElementById("delete-btn");
            deleteButton.addEventListener("click", () => this.removeFromDB());
        });
    }
    newEvent() {
        const tracks = [
            {
                name: "Adria Karting Raceway (Paid DLC – KartSim)",
                link: "https://steamcommunity.com/workshop/about/?appid=365960"
            },
            {
                name: "Adria Karting Raceway (Paid DLC – KartSim)",
                link: "https://steamcommunity.com/workshop/about/?appid=365960"
            }
        ];
        const cars = [
            {
                name: "2019 Aston Martin Vantage GT3 (Paid DLC)",
                link: "https://steamcommunity.com/workshop/about/?appid=365960"
            },
            {
                name: "2020 Bentley Continental GT3 (Paid DLC)",
                link: ""
            }
        ];
        const trackImg = "/assets/img/rf2.jpg";
        const carImg = "/assets/img/rf2.jpg";
        const participants = ["Bob Panda", "Taulier", "Frednz"];
        const maxParticipants = 24;
        const date = new Date();
        const eventImg = "/assets/img/rf2.jpg";
        const info = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus faucibus leo vel massa facilisis, et imperdiet ipsum dictum. Cras ullamcorper placerat ligula, aliquam mollis erat tempus a.";
        this.raceEvents.unshift(new RaceEvent(tracks, cars, trackImg, carImg, participants, maxParticipants, date, eventImg, info));
        this.currentRaceEvent = this.raceEvents[this.raceEvents.length - 1];
        this.display.update(this.currentRaceEvent, this.raceEvents);
        this.saveToDB();
    }
    saveToDB() {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentRaceEvent = this.display.getCurrentRaceEvent();
            const data = this.currentRaceEvent.generateJSON();
            console.log("raceEvent being saved: " + data._id);
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            };
            const response = yield fetch("/update", options);
            const json = yield response.json();
            console.log(json);
            if (json.success === "true") {
                this.saveButton.style.backgroundColor = "grey";
            }
            this.raceEvents.sort((a, b) => b.getDateObject().getTime() - a.getDateObject().getTime());
            this.display.updateEventList(this.raceEvents);
        });
    }
    removeFromDB() {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentRaceEvent = this.display.getCurrentRaceEvent();
            console.log("event to delete: " + this.currentRaceEvent.getId());
            const data = { _id: this.currentRaceEvent.generateJSON()._id };
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            };
            const response = yield fetch("/remove", options);
            const json = yield response.json();
            console.log(json);
            this.raceEvents.splice(this.raceEvents.indexOf(this.currentRaceEvent), 1);
            this.raceEvents.sort((a, b) => b.getDateObject().getTime() - a.getDateObject().getTime());
            this.currentRaceEvent = this.raceEvents[0];
            this.display.update(this.currentRaceEvent, this.raceEvents);
        });
    }
    getSaveButton() {
        return this.saveButton;
    }
}
class Display {
    constructor() {
        this.eventContent = document.querySelector(".app-main");
        this.eventList = document.querySelector(".event-container");
        this.initDOM = this.createInitDOM();
    }
    update(currentRaceEvent, raceEvents) {
        if (raceEvents.length === 0) {
            const event = document.querySelector(".event");
            event.remove();
            this.updateEventList(raceEvents);
        }
        else {
            this.eventContent.append(this.initDOM);
            this.raceEvent = currentRaceEvent;
            const trackButton = document.getElementById("addTrackButton");
            trackButton.addEventListener("click", () => {
                this.addTrack();
                this.updateSaveButtonColor("dodgerblue");
            });
            const carButton = document.getElementById("addCarButton");
            carButton.addEventListener("click", () => {
                this.addCar();
                this.updateSaveButtonColor("dodgerblue");
            });
            const participantButton = document.getElementById("addParticipantButton");
            participantButton.addEventListener("click", () => {
                this.addParticipant();
                this.updateSaveButtonColor("dodgerblue");
            });
            const trackImg = document.getElementById("trackImg");
            trackImg.addEventListener("change", (event) => {
                this.uploadTrackImg(event);
                this.updateSaveButtonColor("dodgerblue");
            });
            const carImg = document.getElementById("carImg");
            carImg.addEventListener("change", (event) => {
                this.uploadCarImg(event);
                this.updateSaveButtonColor("dodgerblue");
            });
            const dateInput = document.getElementById("dateInput");
            dateInput.addEventListener("change", () => {
                this.changeDate();
                this.updateSaveButtonColor("dodgerblue");
            });
            const participantMaxInput = (document.getElementById("participantInput"));
            participantMaxInput.addEventListener("change", () => {
                this.changeParticipantMax();
                this.updateSaveButtonColor("dodgerblue");
            });
            const infoInput = document.getElementById("textInfo");
            infoInput.addEventListener("change", () => {
                this.changeInfo();
                this.updateSaveButtonColor("dodgerblue");
            });
            if (raceEvents.length > 0 || this.raceEvent !== undefined) {
                this.updateDate();
                this.updateParticipantMax();
                this.updateInfo();
                this.updateTracks();
                this.updateCars();
                this.updateImgs();
                this.updateParticipant();
                this.updateEventList(raceEvents);
            }
        }
    }
    updateSaveButtonColor(color) {
        const saveBtn = document.getElementById("save-btn");
        saveBtn.style.backgroundColor = color;
    }
    uploadTrackImg(event) {
        const files = event.target.files;
        const formData = new FormData();
        formData.append("myFile", files[0]);
        formData.append("id", this.raceEvent.getId().toString());
        formData.append("type", "track");
        fetch("/store-img", {
            method: "POST",
            body: formData
        })
            .then((response) => response.json())
            .then((data) => {
            console.log(data);
            this.raceEvent.setTrackImg("/assets/events-img/" + data.name);
            this.updateImgs();
        })
            .catch((error) => {
            console.error(error);
        });
    }
    uploadCarImg(event) {
        const files = event.target.files;
        const formData = new FormData();
        formData.append("myFile", files[0]);
        formData.append("id", this.raceEvent.getId().toString());
        formData.append("type", "car");
        fetch("/store-img", {
            method: "POST",
            body: formData
        })
            .then((response) => response.json())
            .then((data) => {
            console.log(data);
            this.raceEvent.setCarImg("/assets/events-img/" + data.name);
            this.updateImgs();
        })
            .catch((error) => {
            console.error(error);
        });
    }
    updateEventList(raceEvents) {
        const container = document.querySelector(".event-container");
        let children = container.children;
        while (children.length > 1) {
            const event = children.item(children.length - 1);
            if (event.id !== "newEvent") {
                event.remove();
            }
        }
        raceEvents.forEach((raceEvent) => {
            const main = document.createElement("div");
            main.className = "event-main-img";
            main.style.backgroundImage = "url(" + raceEvent.getEventImg();
            const blur = document.createElement("div");
            if (raceEvent === this.raceEvent) {
                blur.className = "blur event-img-selected";
            }
            else {
                blur.className = "blur";
            }
            const date = document.createElement("p");
            date.className = "event-img-date";
            const dateObject = raceEvent.getDateObject();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const localDate = dateObject.toLocaleDateString("fr-FR", options);
            date.innerText = localDate.charAt(0).toUpperCase() + localDate.slice(1);
            blur.append(date);
            main.append(blur);
            container.append(main);
            main.addEventListener("click", () => {
                this.raceEvent = raceEvent;
                console.log(raceEvent.getId());
                this.update(this.raceEvent, raceEvents);
                this.updateSaveButtonColor("dodgerblue");
            });
        });
    }
    updateDate() {
        const field = document.getElementById("dateInput");
        field.value = this.raceEvent.getDate().toString();
    }
    updateParticipantMax() {
        const field = document.getElementById("participantInput");
        field.value = this.raceEvent.getParticipantMax().toString();
        this.updateParticipant();
    }
    updateInfo() {
        const field = document.getElementById("textInfo");
        field.value = this.raceEvent.getInfo();
    }
    changeDate() {
        const field = document.getElementById("dateInput");
        this.raceEvent.setDate(new Date(field.value));
    }
    changeParticipantMax() {
        const field = document.getElementById("participantInput");
        const number = parseInt(field.value);
        if (number > this.raceEvent.getParticipants().length) {
            this.raceEvent.setParticipantMax(number);
        }
        else {
            this.raceEvent.setParticipantMax(this.raceEvent.getParticipants().length);
        }
        this.updateParticipantMax();
    }
    changeInfo() {
        const field = document.getElementById("textInfo");
        this.raceEvent.setInfo(field.value);
        this.raceEvent.generateJSON();
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
        this.updateSaveButtonColor("dodgerblue");
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
        this.updateSaveButtonColor("dodgerblue");
    }
    removeElement(event) {
        const element = event.target.parentElement.children[0];
        if (element.parentElement.parentElement.parentElement.id === "track-text") {
            this.raceEvent.removeTrack(element.innerHTML);
            this.updateTracks();
            return 0;
        }
        if (element.parentElement.parentElement.parentElement.id === "car-text") {
            this.raceEvent.removeCar(element.innerHTML);
            this.updateCars();
            return 0;
        }
        if (element.parentElement.parentElement.parentElement.id === "participants-text") {
            this.raceEvent.removeParticipant(element.innerHTML);
            this.updateParticipant();
            return 0;
        }
        return 1;
    }
    updateImgs() {
        const trackContainer = document.getElementById("trackImg");
        const carContainer = document.getElementById("carImg");
        trackContainer.style.backgroundImage = `url("")`;
        trackContainer.style.backgroundImage = `url("${this.raceEvent.getTrackImg()}")`;
        trackContainer.style.backgroundSize = "auto 100%";
        trackContainer.style.backgroundPosition = "center";
        trackContainer.style.animation = "none";
        carContainer.style.backgroundImage = `url("")`;
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
        for (let i = 0; i < this.raceEvent.getParticipantMax() - this.raceEvent.getParticipants().length; i++) {
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
        this.updateSaveButtonColor("dodgerblue");
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
    getCurrentRaceEvent() {
        return this.raceEvent;
    }
    createInitDOM() {
        const title = document.querySelector(".dashboard-title");
        title.innerHTML = `<div id="save-del">
                <h2 id="save-btn">Enregistrer</h2>
                <h2 id="delete-btn">Supprimer</h2>
            </div>`;
        const html = document.createElement("div");
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
    constructor(tracks, cars, trackImg, carImg, participants, maxParticipants, date, eventImg, info, id = "") {
        this.tracks = tracks;
        this.cars = cars;
        this.trackImg = trackImg;
        this.carImg = carImg;
        this.participants = participants;
        this.maxParticipants = maxParticipants;
        this.date = date;
        this.eventImg = eventImg;
        this.info = info;
        this.id = id;
        if (this.id === "") {
            console.log("Create new raceEvent.");
            const data = this.generateJSON();
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            };
            fetch("/newRaceEvent", options)
                .then((response) => response.json())
                .then((data) => {
                console.log(data);
                this.id = data._id;
            })
                .catch((error) => {
                console.error(error);
            });
        }
        console.log(this.id + " carImg path: ", this.carImg);
    }
    generateJSON() {
        const json = {
            tracks: this.tracks,
            cars: this.cars,
            trackImg: this.trackImg,
            carImg: this.carImg,
            participants: this.participants,
            maxParticipants: this.maxParticipants,
            date: this.date,
            info: this.info,
            eventImg: this.eventImg,
            _id: this.id
        };
        console.log(this.id + " carImg path is : ", this.carImg);
        return json;
    }
    setDate(date) {
        this.date = date;
    }
    setParticipantMax(number) {
        this.maxParticipants = number;
    }
    setInfo(text) {
        this.info = text;
    }
    setTrackImg(src) {
        this.trackImg = src;
    }
    setCarImg(src) {
        this.carImg = src;
    }
    setEventImg(src) {
        this.eventImg = src;
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
    getId() {
        return this.id;
    }
    getDate() {
        return this.date.toISOString().slice(0, 16);
    }
    getDateObject() {
        return this.date;
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
    getEventImg() {
        return this.eventImg;
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