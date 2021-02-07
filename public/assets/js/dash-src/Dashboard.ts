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
                //this.display.updateEventList(this.raceEvents);
                console.log(this.currentRaceEvent);
                this.currentRaceEvent = this.raceEvents[this.raceEvents.length - 1];
                this.display.update(this.currentRaceEvent, this.raceEvents);
                console.log(this.raceEvents);


                const saveButton = document.getElementById("save-btn");
                saveButton.addEventListener("click", () => this.saveToDB());

                console.log("test " + this.currentRaceEvent.getId());

                // event listener doesn't update the value
                const deleteButton = document.getElementById("delete-btn");
                deleteButton.addEventListener("click", () => this.removeFromDB());
                //deleteButton.addEventListener("click", () => console.log("raceEvent to delete: " + this.currentRaceEvent.getId()));
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
        //const date = new Date(2020, 11, 19, 20, 30, 0, 0);
        const date = new Date();
		const eventImg = "/assets/img/rf2.jpg";
		const info =
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus faucibus leo vel massa facilisis, et imperdiet ipsum dictum. Cras ullamcorper placerat ligula, aliquam mollis erat tempus a.";

        // TODO: Wrong ids
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

	}

	// insert a new raceEvent in db (by calling the server)
	private async saveToDB() {
        console.log("saving to db");
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
		console.log("saved: " + json);
		this.display.updateEventList(this.raceEvents);
	}

	// remove a raceEvent in db (by calling the server)
	private async removeFromDB() {
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
        const response = await fetch("/remove", options);
        const json = await response.json();
        console.log(json);
		this.display.updateEventList(this.raceEvents);
	}
}
