import { readFileSync } from "fs";
import { HTTPException } from "hono/http-exception";
import Nodemailer from "nodemailer";

const htmlTemplate = readFileSync("template/receipt.html", "utf8");
const fromEmail = "info@hooyah.io";
const transporter = Nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: fromEmail,
        pass: process.env.EMAIL_PASS,
    },
});
export function sendMail(opt) {
    return new Promise((res, rej) => {
        const toEmail = opt?.to || "shaokuning@gmail.com";
        console.log("sending email opt ", opt);
        const html = renderMail({
            name: "shaokun",
            chain: "ETH",
            amount: "0.1 ETH",
            sender: "0x3cabD917A0AA75D804cCa9dd86969711abB6C505",
            hash: "0x26ff5901e05eec5e11b3a37bb6b8c93fe0d641c5c46020860bbb70d86af9fd6a",
            order: "oid1234556",
            ...opt,
        });

        const mailOptions = {
            from: fromEmail,
            to: toEmail,
            subject: "Hooyah Payment Notification",
            html,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error, info);
                rej(new HTTPException(500, { message: "Email failed to send" }));
                return;
            }
            res(1);
        });
    });
}
function renderMail(opt) {
    const { name, chain, amount, sender, order, hash } = opt;
    return htmlTemplate
        .replace("{{NAME}}", name)
        .replace("{{WALLET_ADDRESS}}", sender)
        .replace("{{TX_AMOUNT}}", amount)
        .replace("{{ORDER_ID}}", order)
        .replace("{{TX_CHAIN}}", chain)
        .replace("{{TX_HASH}}", hash);
}
