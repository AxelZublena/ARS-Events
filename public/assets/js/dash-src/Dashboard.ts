class Dashboard{
    private raceEvents: RaceEvent[];
    private currentRaceEvent: RaceEvent;


    private display: Display;

    public constructor(){
        console.log("App is ready");

        this.display= new Display();

        this.raceEvents = [];
        for(let i = 0; i < 6; i++){
            this.raceEvents.push(new RaceEvent());
        }

        // New event button
        const newEventButton = document.getElementById("newEvent");
        newEventButton.addEventListener("click", () => this.newEvent());
    }

    private newEvent(): void{
        this.raceEvents.push(new RaceEvent());
        this.currentRaceEvent = this.raceEvents[this.raceEvents.length - 1];

        this.display.update(this.currentRaceEvent, this.raceEvents);
        console.log(this.raceEvents);
    }

    // insert a new raceEvent in db (by calling the server)
    private createRaceEvent(raceEvent: RaceEvent):void{

    }

    // remove a raceEvent in db (by calling the server)
    private removeRaceEvent(raceEvent: RaceEvent):void{

    }
}
