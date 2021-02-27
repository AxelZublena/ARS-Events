class RaceEvent {
	private id: string;

	private tracks: Array<any>;
	private cars: Array<any>;
	private trackImg: string;
	private carImg: string;

	private participants: string[];
	private maxParticipants: number;

	private date: Date; // day + hour
	private eventImg: string;
	private info: string;

	public constructor(tracks: Array<any> = [], cars: Array<any> = [], trackImg: string = "", carImg: string = "", participants: string[] = [], maxParticipants: number = 24, date: Date = new Date(), eventImg: string = "", info: string = "", id = "") {

        this.tracks = tracks;
        this.cars = cars;
        this.trackImg = trackImg;
        this.carImg = carImg;
        this.participants = participants;
        this.maxParticipants = maxParticipants;
        this.date = date;
        this.eventImg = eventImg;
        this.info = info;

		this.id = id;
		if (this.id === "") {
			console.log("Create new raceEvent.");
			const data = this.generateJSON();
			const options = {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(data)
			};
			fetch("/newRaceEvent", options)
				.then((response) => response.json())
				.then((data) => {
					console.log(data);
                    this.id = data._id;
				})
				.catch((error) => {
					console.error(error);
				});
		}
        console.log(this.id + " carImg path: ", this.carImg);
	}

	public generateJSON() {
		const json = {
			tracks: this.tracks,
			cars: this.cars,
			trackImg: this.trackImg,
			carImg: this.carImg,
			participants: this.participants,
			maxParticipants: this.maxParticipants,
			date: this.date,
			info: this.info,
			eventImg: this.eventImg,
			_id: this.id
		};
        console.log(this.id + " carImg path is : ", this.carImg);

		return json;
	}

	public setDate(date: Date) {
		this.date = date;
	}
	public setParticipantMax(number: number) {
		this.maxParticipants = number;
	}
	public setInfo(text: string) {
		this.info = text;
	}

	public setTrackImg(src: string) {
		this.trackImg = src;
	}
	public setCarImg(src: string) {
		this.carImg = src;
	}
    public setEventImg(src: string) {
        this.eventImg = src;
    }

	public removeTrack(name: string) {
		this.tracks = this.tracks.filter((track) => track.name !== name);
	}
	public removeCar(name: string) {
		this.cars = this.cars.filter((car) => car.name !== name);
	}
	public removeParticipant(name: string) {
		this.participants = this.participants.filter((participant) => participant !== name);
	}

	public addTrack(track: any) {
		let exist = false;
		this.tracks.forEach((existingTrack) => {
			if (existingTrack.link === track.link && existingTrack.name === track.name) {
				exist = true;
			}
		});
		if (!exist) {
			this.tracks.push(track);
		}
		console.log(this.tracks);
	}
	public addCar(car: any) {
		let exist = false;
		this.cars.forEach((existingCar) => {
			if (existingCar.link === car.link && existingCar.name === car.name) {
				exist = true;
			}
		});
		if (!exist) {
			this.cars.push(car);
		}
		console.log(this.cars);
	}
	public addParticipant(participant: string) {
		let exist = false;
		this.participants.forEach((existingParticipant) => {
			if (existingParticipant === participant) {
				exist = true;
			}
		});
		if (!exist) {
			this.participants.push(participant);
		}
		console.log(this.participants);
	}

	public getId(): string {
		return this.id;
	}

	public getDate(): string {
		return this.date.toISOString().slice(0, 16);
	}
    public getDateObject(): Date {
        return this.date;
    }

	public getParticipantMax(): number {
		return this.maxParticipants;
	}

	public getInfo(): string {
		return this.info;
	}

	public getTracks(): Array<any> {
		return this.tracks;
	}

	public getCars(): Array<any> {
		return this.cars;
	}

	public getTrackImg(): string {
		return this.trackImg;
	}
	public getCarImg(): string {
		return this.carImg;
	}
    public getEventImg():string {
        return this.eventImg;
    }

	public getParticipants(): string[] {
		return this.participants;
	}
}
