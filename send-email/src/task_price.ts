import { Cron } from "croner";
import "dotenv/config.js";
import { DBPrice } from "./db.js";
const symbols = {
    SOL: "SOLUSDT",
    ETH: "ETHUSDT",
};

Cron(
    "* * * * *",
    {
        timezone: "UTC",
    },
    syncPrice
);
async function syncPrice() {
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const current = await DBPrice.get();
    // @ts-ignore
    if (!current || current.time + ONE_DAY - 30 * 1000 < Date.now()) {
        Promise.all(
            Object.entries(symbols).map(async ([key, value]) => {
                return getPrice({ symbol: value });
            })
        )
            .then((prices) => {
                const data = {};
                Object.keys(symbols).forEach((key, index) => {
                    data[key] = prices[index];
                });
                DBPrice.set(data);
            })
            .catch((err) => {
                console.log("fetch price error", err);
            });
    }
}

async function getPrice({ symbol }) {
    const response = await fetch("https://api.api-ninjas.com/v1/cryptoprice?symbol=" + symbol, {
        headers: {
            "X-Api-Key": process.env.PRICE_API_KEY!!,
        },
    });
    const data = await response.json();
    console.log("get api data", data);
    return data.price;
}
