    const getStrategyFromCity = (city) => {
        if (!city) return "unknown";

        const c = city.toLowerCase();

        if (c.includes("mars")) return "refuel";
        if (c.includes("olympus")) return "stay";
        if (c.includes("phobos")) return "return";

        return "stay";
    };

export default getStrategyFromCity;