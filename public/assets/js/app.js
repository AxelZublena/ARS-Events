var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class App {
    constructor() {
        console.log("App is ready");
        this.display = new Display();
        this.raceEvents = [];
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
            this.display.update(this.currentRaceEvent, this.raceEvents);
        });
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
        const participantButton = document.getElementsByClassName("playerButton-popup")[0];
        participantButton.addEventListener("click", () => {
            this.addParticipant();
            this.saveParticipant();
        });
        if (raceEvents.length > 0 || this.raceEvent !== undefined) {
            this.updateDate();
            this.updateParticipantMax();
            this.updatePlacesLeft();
            this.updateInfo();
            this.updateTracks();
            this.updateCars();
            this.updateImgs();
            this.updateParticipant();
            this.updateEventList(raceEvents);
        }
    }
    updateEventList(raceEvents) {
        const container = document.querySelector(".event-container");
        let children = container.children;
        while (children.length > 0) {
            const event = children.item(children.length - 1);
            event.remove();
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
            const options = { weekday: 'long', month: 'long', day: 'numeric' };
            const localDate = dateObject.toLocaleDateString("fr-FR", options);
            date.innerText = localDate.charAt(0).toUpperCase() + localDate.slice(1) + "\n" + dateObject.getFullYear();
            blur.append(date);
            main.append(blur);
            container.append(main);
            main.addEventListener("click", () => {
                this.raceEvent = raceEvent;
                console.log(raceEvent.getId());
                this.update(this.raceEvent, raceEvents);
            });
        });
    }
    updateDate() {
        const field = document.getElementById("infoDate");
        const dateObject = this.raceEvent.getDateObject();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const localDate = dateObject.toLocaleDateString("fr-FR", options);
        const localTime = dateObject.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
        field.innerText = localDate.charAt(0).toUpperCase() + localDate.slice(1) + " à " + localTime;
    }
    updateParticipantMax() {
        const field = document.getElementById("infoParticipantMax");
        field.innerText = this.raceEvent.getParticipantMax().toString();
        this.updateParticipant();
    }
    updatePlacesLeft() {
        const field = document.getElementById("infoPlacesLeft");
        field.innerText = (this.raceEvent.getParticipantMax() - this.raceEvent.getParticipants().length).toString();
    }
    updateInfo() {
        const field = document.getElementById("infoText");
        field.innerText = this.raceEvent.getInfo();
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
            item.append(text);
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
            item.append(text);
            container.append(item);
        });
    }
    updateImgs() {
        const trackContainer = document.getElementById("track-img");
        const carContainer = document.getElementById("car-img");
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
            item.append(player);
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
    }
    addParticipant() {
        this.raceEvent.addParticipant(document.getElementById("playerName").value);
        this.updateParticipant();
    }
    saveParticipant() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.raceEvent.generateJSON();
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
        });
    }
    getCurrentRaceEvent() {
        return this.raceEvent;
    }
    createInitDOM() {
        const html = document.createElement("div");
        html.className = "event";
        html.innerHTML = `<div class="event-tile" id="track">
					<div class="event-tile-img" id="track-img"></div>
					<div class="event-tile-text" id="track-text">
						<h2>Circuit :</h2>
						<div class="element">
						</div>
					</div>
				</div>
				<div class="event-tile" id="car">
					<div class="event-tile-img" id="car-img"></div>
					<div class="event-tile-text" id="car-text">
						<h2>Voiture :</h2>
						<div class="element">
						</div>
					</div>
				</div>
				<div class="event-tile" id="info">
					<div class="event-tile-text" id="info-text">
						<h2>Informations :</h2>
						<div class="element">
							<div class="info-element">
								<p>Date : <span id="infoDate"></span></p>
							</div>
							<div class="info-element">
								<p>
									Participants maximum : <span id="infoParticipantMax"></span>
								</p>
							</div>
							<div class="info-element">
								<p>Places restantes : <span id="infoPlacesLeft"></span></p>
							</div>
							<div class="info-element">
								<p>Détails supplémentaires :<br />
									<span id="infoText"></span>
								</p>
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
								<h2>S'inscrire</h2>
								<a class="close" href="#">&times;</a>
								<div class="content">
									<p>Nom/pseudo :</p>
									<input
										type="text"
										name="playerName"
										id="playerName"
										class="trackORcar-field"
									/>
									<div class="playerButton-popup"></div>
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
    const app = new App();
}
fetch("/firstTime")
    .then((response) => {
    console.log(response);
    return response.json();
})
    .then((data) => {
    console.log(data);
    if (data.value === true) {
        window.location.href = "/firstTimeSetup";
    }
})
    .catch((err) => console.error(err));
//# sourceMappingURL=app.js.map