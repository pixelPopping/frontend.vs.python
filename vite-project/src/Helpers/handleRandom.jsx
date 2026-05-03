function handleRandom(options, setValue) {
    if (options.rockets.length > 0 && options.astronauts.length > 2) {

        const randomR = options.rockets[Math.floor(Math.random() * options.rockets.length)];
        const shuffledCrew = [...options.astronauts].sort(() => 0.5 - Math.random());
        const randomLaunch = options.launches[Math.floor(Math.random() * options.launches.length)];
        const randomLand = options.landpads[Math.floor(Math.random() * options.landpads.length)];

        setValue("rocket", randomR.name);
        setValue("captain", shuffledCrew[0].name);
        setValue("crewMember1", shuffledCrew[1].name);
        setValue("crewMember2", shuffledCrew[2].name);
        setValue("launchPad", randomLaunch.name);
        setValue("landingPad", randomLand.full_name);
        setValue("marsAction", "refuel");
        setValue("city", "Mars Base");
    }
}



export default handleRandom;