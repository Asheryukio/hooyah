import "dotenv/config.js";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { sendMail } from "./core.js";
import { DBPrice } from "./db.js";
import "./task_price.js";
const app = new Hono();

app.get("/price", async (c) => {
    const data = await DBPrice.get();
    return c.json(data);
});

app.post(
    "/send",
    zValidator(
        "json",
        z.object({
            name: z.string(),
            chain: z.string(),
            amount: z.string(),
            sender: z.string(),
            hash: z.string(),
            order: z.string(),
            to: z.string().email(),
        })
    ),
    async (c) => {
        const body = await c.req.json();
        await sendMail(body);
        return c.json({ success: true });
    }
);
app.onError((err, c) => {
    if (err instanceof HTTPException) {
        return err.getResponse();
    }
    console.log(err);
    return c.text("internal error", 500);
});

serve(
    {
        fetch: app.fetch,
        port: 8787,
    },
    (info) => {
        console.log("server started", info.address + ":" + info.port);
    }
);
