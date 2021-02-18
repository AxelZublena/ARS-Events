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
		console.log(container);
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
			date.innerText = raceEvent.getDate();

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
		field.innerText = this.raceEvent.getDate().toString();
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

			const remove = document.createElement("p");
			remove.className = "delete-element track-item";
			remove.innerHTML = "&times";

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

			item.append(text);
			item.append(remove);

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

			const remove = document.createElement("p");
			remove.className = "delete-element participant-item";
			remove.innerHTML = "&times";

			item.append(player);
			item.append(remove);

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
								<p>Date : <span id="infoDate">27-12-2020 a 20h30</span></p>
							</div>
							<div class="info-element">
								<p>
									Participants maximum : <span id="infoParticipantMax">32</span>
								</p>
							</div>
							<div class="info-element">
								<p>Places restantes : <span id="infoPlacesLeft">14</span></p>
							</div>
							<div class="info-element">
								<p>Détails supplémentaires :<br />
									<span id="infoText">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
										Morbi vel purus at velit elementum tempor. Ut in ultrices
										ante, et faucibus metus. Etiam sed eros tempor, posuere
										purus ut, feugiat ante.</span
									>
								</p>
							</div>
						</div>
					</div>
				</div>
				<div class="event-tile" id="participants">
					<div class="event-tile-text" id="participants-text">
						<h2>Participants :</h2>
						<div class="players">
							<div class="item">
								<p class="player">Bob Panda</p>
							</div>
							<div class="item">
								<p class="player">Taulier</p>
							</div>
							<div class="item">
								<p class="player">Frednz</p>
							</div>
							<div class="item">
								<p class="player">Bob Panda</p>
							</div>
							<div class="item">
								<p class="player">Taulier</p>
							</div>
							<div class="item">
								<p class="player">Frednz</p>
							</div>
							<div class="item">
								<p class="player">Bob Panda</p>
							</div>
							<div class="item">
								<p class="player">Taulier</p>
							</div>
							<div class="item">
								<p class="player">Frednz</p>
							</div>
							<div class="item">
								<p class="player">Bob Panda</p>
							</div>
							<div class="item">
								<p class="player">Taulier</p>
							</div>
							<div class="item">
								<p class="player">Frednz</p>
							</div>
							<div class="item empty-place">
								<a class="playerButton" href="#popupPlayer">
									<p class="add-element">&#43;</p>
								</a>
							</div>
							<div class="item empty-place">
								<a class="playerButton" href="#popupPlayer">
									<p class="add-element">&#43;</p>
								</a>
							</div>
							<div class="item empty-place">
								<a class="playerButton" href="#popupPlayer">
									<p class="add-element">&#43;</p>
								</a>
							</div>
							<div class="item empty-place">
								<a class="playerButton" href="#popupPlayer">
									<p class="add-element">&#43;</p>
								</a>
							</div>
							<div class="item empty-place">
								<a class="playerButton" href="#popupPlayer">
									<p class="add-element">&#43;</p>
								</a>
							</div>
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
