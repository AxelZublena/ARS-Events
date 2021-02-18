window.addEventListener("load", init);

function init(): void {
    const app = new App();
}

fetch("/firstTime")
    .then((response) => {
        console.log(response);
        return response.json();
    })
    .then((data) => {
        console.log(data);
        if (data.value === true) {
            window.location.href = "/firstTimeSetup";
        }
    })
    .catch((err) => console.error(err));
