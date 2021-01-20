class Dashboard {
	private raceEvents: RaceEvent[];
	private currentRaceEvent: RaceEvent;

	private display: Display;

	public constructor() {
		console.log("App is ready");

		this.display = new Display();

		this.raceEvents = [];
		//for(let i = 0; i < 6; i++){
		//this.raceEvents.push(new RaceEvent());
		//}
		//this.raceEvents.push(new RaceEvent());

		// New event button
		const newEventButton = document.getElementById("newEvent");
		newEventButton.addEventListener("click", () => this.newEvent());

        fetch("/loadEvent")
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                console.log(json);
                json.array.forEach((raceEvent: any) => {
                    this.raceEvents.push(
                        new RaceEvent(
                            raceEvent.tracks,
                            raceEvent.cars,
                            raceEvent.trackImg,
                            raceEvent.carImg,
                            raceEvent.participants,
                            raceEvent.maxParticipants,
                            new Date(raceEvent.date),
                            raceEvent.eventImg,
                            raceEvent.info,
                            raceEvent._id
                        )
                    );
                });
                //this.raceEvents = json.array;
                this.display.updateEventList(this.raceEvents);
                console.log(this.raceEvents);
            });
	}

	private newEvent(): void {
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

		// months range: 0-11
		const date = new Date(2020, 11, 19, 20, 30, 0, 0);
		const eventImg = "/assets/img/rf2.jpg";
		const info =
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus faucibus leo vel massa facilisis, et imperdiet ipsum dictum. Cras ullamcorper placerat ligula, aliquam mollis erat tempus a.";

		this.raceEvents.push(
			new RaceEvent(
				tracks,
				cars,
				trackImg,
				carImg,
				participants,
				maxParticipants,
				date,
				eventImg,
				info
			)
		);
		this.currentRaceEvent = this.raceEvents[this.raceEvents.length - 1];

		this.display.update(this.currentRaceEvent, this.raceEvents);

		const saveButton = document.getElementById("save-btn");
		saveButton.addEventListener("click", () => this.saveToDB());

		const deleteButton = document.getElementById("delete-btn");
		deleteButton.addEventListener("click", () => this.removeFromDB());

		console.log(this.raceEvents);
	}

	// insert a new raceEvent in db (by calling the server)
	private async saveToDB() {
		const data = this.currentRaceEvent.generateJSON();
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

	// remove a raceEvent in db (by calling the server)
	private async removeFromDB() {
		const data = { _id: this.currentRaceEvent.generateJSON()._id };
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		};
		const response = await fetch("/remove", options);
		const json = await response.json();
		console.log(json);
	}
}
