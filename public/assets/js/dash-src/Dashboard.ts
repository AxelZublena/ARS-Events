class Dashboard {
	private raceEvents: RaceEvent[];
	private currentRaceEvent: RaceEvent;

	private display: Display;
    
    private saveButton: HTMLElement;

	public constructor() {
		console.log("App is ready");

		this.display = new Display();

		this.raceEvents = [];

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
                            raceEvent.carImg,
                            raceEvent.info,
                            raceEvent._id
                        )
                    );
                });
                this.raceEvents.sort((a,b) => b.getDateObject().getTime() - a.getDateObject().getTime());
                this.currentRaceEvent = this.raceEvents[0];
                console.log(this.currentRaceEvent);
                this.display.update(this.currentRaceEvent, this.raceEvents);
                console.log(this.raceEvents);


                this.saveButton = document.getElementById("save-btn");
                this.saveButton.addEventListener("click", () => {
                    this.saveToDB()
                });

                // event listener doesn't update the value
                const deleteButton = document.getElementById("delete-btn");
                deleteButton.addEventListener("click", () => this.removeFromDB());
            });

	}

	private newEvent(): void {
        this.raceEvents.unshift(new RaceEvent);

		this.currentRaceEvent = this.raceEvents[this.raceEvents.length - 1];

		this.display.update(this.currentRaceEvent, this.raceEvents);
        this.saveToDB();
        //this.saveButton.style.backgroundColor = "dodgerblue";
	}

	// insert a new raceEvent in db (by calling the server)
	private async saveToDB() {
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
		const response = await fetch("/update", options);
		const json = await response.json();
		console.log(json);

        if(json.success === "true"){
            this.saveButton.style.backgroundColor = "grey";
        }

        this.raceEvents.sort((a,b) => b.getDateObject().getTime() - a.getDateObject().getTime());
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

        this.raceEvents.splice(this.raceEvents.indexOf(this.currentRaceEvent), 1);
        this.raceEvents.sort((a,b) => b.getDateObject().getTime() - a.getDateObject().getTime());
        //console.log(this.raceEvents);
        this.currentRaceEvent = this.raceEvents[0];
        //console.log(this.currentRaceEvent);
        this.display.update(this.currentRaceEvent, this.raceEvents);

	}

    public getSaveButton(){
        return this.saveButton;
    }
}
