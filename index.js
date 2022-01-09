import console from "color-log"
import { 
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  Account
} from "@solana/web3.js"
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const newPair = new Keypair() 

const publicKey = process.env.PUBLIC_KEY || new PublicKey(newPair.publicKey).toString();

const secretKey = process.env.SECRET_KEY ? Uint8Array.from(process.env.SECRET_KEY.split(',')) : newPair.secretKey;

process.env.PUBLIC_KEY || fs.appendFileSync('./.env', `\nPUBLIC_KEY=${publicKey}`);
process.env.SECRET_KEY || fs.appendFileSync('./.env', `\nSECRET_KEY=${secretKey}`);
// console.log(`Public Key: ${publicKey}`);
// console.log(`Secret Key: ${secretKey}`);

const connection = new Connection(clusterApiUrl('devnet', 'confirmed'));
const wallet = Keypair.fromSecretKey(secretKey);

const getWalletBalance = async () => {
  try {
    const balance = await connection.getBalance(wallet.publicKey)
      console.log.info(`${publicKey} => ${parseInt(balance) / LAMPORTS_PER_SOL} SOL`);
  } catch (err) {
    console.log.error(err);
  }
};
getWalletBalance();

const airDropSol = async () => {
  const airdropSig = await connection.requestAirdrop(wallet.publicKey, 2 * LAMPORTS_PER_SOL);
  console.log.warn('Airdropping 2 SOL...');
  await connection.confirmTransaction(airdropSig);
  console.log.success('Airdrop complete');
  try {
  } catch (err) {
    console.log.error(err);
  }
};

airDropSol().then(() => {
  getWalletBalance();
})