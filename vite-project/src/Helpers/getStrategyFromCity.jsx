const getStrategyFromCity = (city) => {
    if (!city || typeof city !== "string") return "";

    const c = city.trim().toLowerCase();

    if (c.includes("mars")) return "refuel";
    if (c.includes("olympus")) return "stay";
    if (c.includes("phobos")) return "return";

    return "stay"; // default
};

export default getStrategyFromCity;
