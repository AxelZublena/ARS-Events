class App {
	private raceEvents: RaceEvent[];
	private currentRaceEvent: RaceEvent;

	private display: Display;

	private saveButton: HTMLElement;

	public constructor() {
		console.log("App is ready");

		this.display = new Display();

		this.raceEvents = [];

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
				this.raceEvents.sort(
					(a, b) => b.getDateObject().getTime() - a.getDateObject().getTime()
				);
				this.currentRaceEvent = this.raceEvents[0];
				this.display.update(this.currentRaceEvent, this.raceEvents);
			});
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
}
