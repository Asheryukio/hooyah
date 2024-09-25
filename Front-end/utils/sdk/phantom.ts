import { Buffer } from 'buffer';
import { Token } from '@solana/spl-token';
import basex from 'bs58';
import { Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram, LAMPORTS_PER_SOL, TransactionInstruction } from '@solana/web3.js';
import { mul } from './tools';
(window as any).Buffer = Buffer;
let currentCluster: 'mainnet-beta' | 'testnet' | 'devnet' = 'devnet';

export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
function getProvider() {
    if ('phantom' in window) {
        //@ts-ignore
        const provider = window.phantom?.solana;
        if (provider?.isPhantom) {
            return provider;
        }
    }
    window.open('https://phantom.app/', '_blank');
}


export const phaChainId = 132546;
export async function signSolana(message?: string) {
    const provider1 = getProvider();
    if (!message) {
        message = `To avoid digital dognappers, sign below to authenticate with CryptoCorgis`;
    }
    const encodedMessage = new TextEncoder().encode(message);
    let res = { code: 1, sign: "" };
    try {
        const signedMessage = await provider1.signMessage(encodedMessage, "utf8");
        const signatureBytes = Buffer.from(signedMessage.signature, 'hex');
        res.sign = basex.encode(signatureBytes);
    } catch (e: any) {
        res = { code: -1, sign: e.message };
    }
    return res;
}

const provider = getProvider();

export async function connectWallet(callback: (data: { account: string; chainID: number; chain: string, message: string; }) => void) {
    try {
        if(!provider||!provider.connect) return { message: "phantom not installed" };
        const resp = await provider.connect();
        window["provider"] = provider;
        console.log("resp", resp);
        if (provider) {
            provider.on('accountChanged', (publicKey: any) => {
                if (publicKey) {
                    callback({ account: publicKey.toBase58(), chain: currentCluster, chainID: phaChainId, message: "phantom" });
                }
            });
        }
        return { publicKey: resp.publicKey, account: resp.publicKey.toString(), chainID: phaChainId, chain: currentCluster, message: "phantom" };
    } catch (err) {
        return { "Error": err };
    }
}

export async function getTokenBalance(mintAddress: string) {
    let balance = "0";
    let solana = 0;
    const resp = await provider.connect();
    try {
        const connection = new Connection(clusterApiUrl(currentCluster), 'confirmed');
        solana = await connection.getBalance(resp.publicKey)
        const mintPublicKey = new PublicKey(mintAddress);

        const accounts = await connection.getParsedTokenAccountsByOwner(resp.publicKey, {
            mint: mintPublicKey
        });

        accounts.value.forEach((accountInfo) => {
            balance = accountInfo.account.data.parsed.info.tokenAmount.uiAmount;
        });
    } catch (error) {
        console.log("Error fetching token balance:", error);
    }
    return [{ id: mintAddress, balance }, { id: "0x0", balance: solana / LAMPORTS_PER_SOL }];
}

export async function transferSol(toPublicKey: string, amount: string) {
    try {
        const resp = await provider.connect();
        const connection = new Connection(clusterApiUrl(currentCluster), 'confirmed');
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: resp.publicKey,
                toPubkey: new PublicKey(toPublicKey),
                lamports: +(amount)   //+mul(amount, LAMPORTS_PER_SOL+"", 0)
            })
        );
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = resp.publicKey;
        const signedTransaction = await provider.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());
        await connection.confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight
        }, 'confirmed');
        return { code: 1, hash: signature };
    } catch (e: any) {
        return { code: -1, hash: e.message };
    }
}

export async function logoutPhantom() {
    provider?.disconnect();
    return { account: "", chainID: phaChainId, chain: currentCluster, message: "logout" }
}

export async function transferToken(destinationAddress: string, tokenMintAddress: string, amount: string) {
    try {
        const resp = await provider.connect();
        const connection = new Connection(clusterApiUrl(currentCluster), 'confirmed');
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
        const igs = new PublicKey(tokenMintAddress);
        const toWalletPubKey = new PublicKey(destinationAddress);
        const token = new Token(connection, igs, TOKEN_PROGRAM_ID, resp);
        const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(resp.publicKey);
        const associatedDestTokenAddr = await Token.getAssociatedTokenAddress(
            token.associatedProgramId,
            token.programId,
            igs,
            toWalletPubKey
        );
        const instructions: TransactionInstruction[] = [];
        const receiverAccount = await connection.getAccountInfo(associatedDestTokenAddr);
        if (receiverAccount === null) {
            instructions.push(
                Token.createAssociatedTokenAccountInstruction(
                    token.associatedProgramId,
                    token.programId,
                    igs,
                    associatedDestTokenAddr,
                    toWalletPubKey,
                    resp.publicKey
                )
            )
        }
        instructions.push(
            Token.createTransferInstruction(
                TOKEN_PROGRAM_ID,
                fromTokenAccount.address,
                associatedDestTokenAddr,
                resp.publicKey,
                [],
                +amount //Number(+amount * 1e6)
            )
        )
        const transaction = new Transaction().add(...instructions);
        transaction.feePayer = resp.publicKey;
        transaction.recentBlockhash = blockhash;
        const signed = await provider.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signed.serialize())
        await connection.confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight
        }, 'confirmed');
        return { code: 1, hash: signature };
    } catch (e: any) {
        return { code: -1, hash: e.message };
    }
}