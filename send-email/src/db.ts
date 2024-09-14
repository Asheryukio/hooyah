import { kvsEnvStorage } from "@kvs/env";

const DB_PRICE = await kvsEnvStorage({
    name: "token-price",
    version: 1,
});
const key = "token-price";

export class DBPrice {
    static async get() {
        return DB_PRICE.get(key);
    }

    static async set(data: any) {
        return DB_PRICE.set(key, {
            ...data,
            time: Date.now(),
        });
    }
}
