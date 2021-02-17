window.addEventListener("load", init);
//window.addEventListener("beforeunload", () => {
    //return "Etes vous sure de quitter la page?";
//})

// Show popup when exiting /dashboard
//window.onbeforeunload = function (e: Event) {
    //e = e || window.event;
    //// For Safari
    //return 'Sure?';
//};

function init(): void {
	const dashboard = new Dashboard();
}
