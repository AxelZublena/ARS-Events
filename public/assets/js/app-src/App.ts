class App{
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
                this.raceEvents.sort((a,b) => b.getDateObject().getTime() - a.getDateObject().getTime());
                this.currentRaceEvent = this.raceEvents[0];
                this.display.update(this.currentRaceEvent, this.raceEvents);

            });
	}
}
