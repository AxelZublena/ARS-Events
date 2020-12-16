class RaceEvent {
	private tracks: Array<any>;
	private cars: Array<any>;
	private trackImg: string;
	private carImg: string;

	private participants: string[];
	private maxParticipants: number;

	//private date: Date; // day + hour
	private date: Date; // day + hour
	private eventImg: string;
	private info: string;

	public constructor() {
		this.tracks = [
			{
				name: "Adria Karting Raceway (Paid DLC – KartSim)",
				link: "https://steamcommunity.com/workshop/about/?appid=365960",
			},
			{
				name: "Adria Karting Raceway (Paid DLC – KartSim)",
				link: "https://steamcommunity.com/workshop/about/?appid=365960",
			},
		];
		this.cars = [
			{
				name: "2019 Aston Martin Vantage GT3 (Paid DLC)",
				link: "https://steamcommunity.com/workshop/about/?appid=365960",
			},
			{
				name: "2020 Bentley Continental GT3 (Paid DLC)",
				link: "",
			},
		];
		this.trackImg = "/assets/img/rf2.jpg";
		this.carImg = "/assets/img/rf2.jpg";

		this.participants = ["Bob Panda", "Taulier", "Frednz"];
		this.maxParticipants = 24;

		// months range: 0-11
		this.date = new Date(2020, 11, 19, 20, 30, 0, 0);
		this.eventImg = this.carImg || "/assets/img/rf2.jpg";
		this.info =
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus faucibus leo vel massa facilisis, et imperdiet ipsum dictum. Cras ullamcorper placerat ligula, aliquam mollis erat tempus a.";
	}

    public setTrackImg(src: string){
        this.trackImg = "/assets/img/"+src;
    }

    public removeTrack(name: string){
        this.tracks = this.tracks.filter((track) => track.name !== name);
    }
    public removeCar(name: string){
        this.cars = this.cars.filter((car) => car.name !== name);
    }
    public removeParticipant(name: string){
        this.participants = this.participants.filter((participant) => participant !== name);
    }

    public addTrack(track: any){
        let exist = false;
        this.tracks.forEach((existingTrack) => {
            if(existingTrack.link === track.link && existingTrack.name === track.name){
                exist = true;
            }
        });
        if(!exist){
            this.tracks.push(track);
        }
        console.log(this.tracks);
    }
    public addCar(car: any){
        let exist = false;
        this.cars.forEach((existingCar) => {
            if(existingCar.link === car.link && existingCar.name === car.name){
                exist = true;
            }
        });
        if(!exist){
            this.cars.push(car);
        }
        console.log(this.cars);
    }
    public addParticipant(participant: string){
        let exist = false;
        this.participants.forEach((existingParticipant) => {
            if(existingParticipant === participant){
                exist = true;
            }
        });
        if(!exist){
            this.participants.push(participant);
        }
        console.log(this.participants);
    }

	public getDate(): string {
		return this.date.toISOString().slice(0, 16);
	}

	public getParticipantMax(): number {
		return this.maxParticipants;
	}

	public getInfo(): string {
		return this.info;
	}

    public getTracks(): Array<any>{
        return this.tracks;
    }

    public getCars(): Array<any>{
        return this.cars;
    }

    public getTrackImg(): string{
        return this.trackImg;
    }
    public getCarImg(): string{
        return this.carImg;
    }

    public getParticipants(): string[]{
        return this.participants;
    }
}
