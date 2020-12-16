class Display {
	private initDOM: HTMLElement;
	private body: HTMLElement;

	private eventContent: HTMLElement;
	private eventList: HTMLElement;

	private raceEvent: RaceEvent;

	public constructor() {
		this.eventContent = document.querySelector(".app-main");
		this.eventList = document.querySelector(".event-container");

		this.initDOM = this.createInitDOM();
	}

	public update(currentRaceEvent: RaceEvent, raceEvents: RaceEvent[]) {
		this.eventContent.append(this.initDOM);
		this.raceEvent = currentRaceEvent;

        document.getElementById("addTrackButton").addEventListener("click", () => this.addTrack());
        document.getElementById("addCarButton").addEventListener("click", () => this.addCar());
        document.getElementById("addParticipantButton").addEventListener("click", () => this.addParticipant());

        const trackImg = <HTMLInputElement>document.getElementById("trackImg"); 
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

	public updateEventList(raceEvents: RaceEvent[]) {
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

	private updateDate() {
		const field = <HTMLInputElement>document.getElementById("dateInput");
		field.value = this.raceEvent.getDate().toString();
	}
	private updateParticipantMax() {
		const field = <HTMLInputElement>(
			document.getElementById("participantInput")
		);
		field.value = this.raceEvent.getParticipantMax().toString();
	}
	private updateInfo() {
		const field = <HTMLTextAreaElement>document.getElementById("textInfo");
		field.value = this.raceEvent.getInfo();
	}
	private updateTracks() {
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
			} else {
				text.style.color = "black";
			}

			const remove = document.createElement("p");
			remove.className = "delete-element track-item";
			remove.innerHTML = "&times";

			remove.addEventListener("click", (event) =>
				this.removeElement(event)
			);

			item.append(text);
			item.append(remove);

			container.append(item);
		});
	}
	private updateCars() {
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
			} else {
				text.style.color = "black";
			}

			const remove = document.createElement("p");
			remove.className = "delete-element car-item";
			remove.innerHTML = "&times";

			remove.addEventListener("click", (event) =>
				this.removeElement(event)
			);

			item.append(text);
			item.append(remove);

			container.append(item);
		});
	}

	private removeElement(event: Event) {
		const element = (event.target as Element).parentElement.children[0];

		if (
			element.parentElement.parentElement.parentElement.id ===
			"track-text"
		) {
			this.raceEvent.removeTrack(element.innerHTML);
			this.updateTracks();
			return 0;
		}
		if (
			element.parentElement.parentElement.parentElement.id === "car-text"
		) {
			this.raceEvent.removeCar(element.innerHTML);
			this.updateCars();
			return 0;
		}
		if (
			element.parentElement.parentElement.parentElement.id ===
			"participants-text"
		) {
			this.raceEvent.removeParticipant(element.innerHTML);
			this.updateParticipant();
			return 0;
		}
		return 1;
	}

	private updateImgs() {
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

	private updateParticipant() {
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

			remove.addEventListener("click", (event) =>
				this.removeElement(event)
			);

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

    private addTrack(){
        this.raceEvent.addTrack({
            name: (document.getElementById("trackName") as HTMLInputElement).value,
            link: (document.getElementById("trackLink") as HTMLInputElement).value
        });
        this.updateTracks();
    }
    private addCar(){
        this.raceEvent.addCar({
            name: (document.getElementById("carName") as HTMLInputElement).value,
            link: (document.getElementById("carLink") as HTMLInputElement).value
        });
        this.updateCars();
    }
    private addParticipant(){
        this.raceEvent.addParticipant((document.getElementById("playerName") as HTMLInputElement).value);
        this.updateParticipant();
    }
    

	private createInitDOM(): HTMLElement {
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
