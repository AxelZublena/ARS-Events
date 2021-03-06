class Display {
	private initDOM: HTMLElement;

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

	public updateEventList(raceEvents: RaceEvent[]) {
		const container = document.querySelector(".event-container");

		let children = container.children;

        // clear the container 
		while (children.length > 0) {
			const event = children.item(children.length - 1);
            event.remove();
		}

		raceEvents.forEach((raceEvent) => {
			const main = document.createElement("div");
			main.className = "event-main-img";
			//main.style.backgroundImage = "url(" + raceEvent.getCarImg();
			main.style.backgroundImage = "url(" + raceEvent.getEventImg();

			const blur = document.createElement("div");
			if (raceEvent === this.raceEvent) {
				blur.className = "blur event-img-selected";
			} else {
				blur.className = "blur";
			}

			const date = document.createElement("p");
			date.className = "event-img-date";
			const dateObject = raceEvent.getDateObject();
            const options = { weekday: 'long',  month: 'long', day: 'numeric' };
            const localDate = dateObject.toLocaleDateString("fr-FR", options);
            date.innerText = localDate.charAt(0).toUpperCase() + localDate.slice(1) + "\n" + dateObject.getFullYear();

			blur.append(date);
			main.append(blur);
			container.append(main);

			// Add event listener
			main.addEventListener("click", () => {
				this.raceEvent = raceEvent;
				console.log(raceEvent.getId());
				this.update(this.raceEvent, raceEvents);
			});
		});
	}

	private updateDate() {
		const field = document.getElementById("infoDate");
        const dateObject = this.raceEvent.getDateObject();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const localDate = dateObject.toLocaleDateString("fr-FR", options);
        const localTime = dateObject.toLocaleTimeString("fr-FR", {hour: '2-digit', minute: '2-digit'});
        field.innerText = localDate.charAt(0).toUpperCase() + localDate.slice(1) + " à " + localTime;
	}
	private updateParticipantMax() {
		const field = document.getElementById("infoParticipantMax");
		field.innerText = this.raceEvent.getParticipantMax().toString();
		this.updateParticipant();
	}
	private updatePlacesLeft() {
		const field = document.getElementById("infoPlacesLeft");
		field.innerText = (
			this.raceEvent.getParticipantMax() - this.raceEvent.getParticipants().length
		).toString();
	}
	private updateInfo() {
		const field = document.getElementById("infoText");
		field.innerText = this.raceEvent.getInfo();
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

			item.append(text);
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

			item.append(text);
			container.append(item);
		});
	}

	private updateImgs() {
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

	private updateParticipant() {
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

		for (
			let i = 0;
			i < this.raceEvent.getParticipantMax() - this.raceEvent.getParticipants().length;
			i++
		) {
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

	private addParticipant() {
		this.raceEvent.addParticipant(
			(document.getElementById("playerName") as HTMLInputElement).value
		);
		this.updateParticipant();
	}
    private async saveParticipant() {
		const data = this.raceEvent.generateJSON();
        console.log("raceEvent being saved: " + data._id);
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		};
		const response = await fetch("/update", options);
		const json = await response.json();
		console.log(json);
    }

	public getCurrentRaceEvent(): RaceEvent {
		return this.raceEvent;
	}

	private createInitDOM(): HTMLElement {
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
