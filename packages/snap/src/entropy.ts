// import bip39 from 'bip39';
// import bitcoin from 'bitcoinjs-lib';

// async function generateBIP32RootKey() {
//     // Generate random entropy
//     const entropy = bip39.randomBytes(32); // 256 bits
//     console.log("Entropy:", entropy.toString('hex'));

//     // Convert entropy to mnemonic (you can also directly generate a mnemonic without generating entropy first)
//     const mnemonic = bip39.entropyToMnemonic(entropy);
//     console.log("Mnemonic:", mnemonic);

//     // Convert the mnemonic to a seed
//     const seed = await bip39.mnemonicToSeed(mnemonic);
//     console.log("Seed:", seed.toString('hex'));

//     // Use the seed to generate a BIP32 root key
//     const root = bitcoin.bip32.fromSeed(seed);
//     console.log("BIP32 Root Key:", root.toBase58());

//     // Example: Deriving a child key using BIP32 path
//     const childKey = root.derivePath("m/0'/0/0");
//     console.log("Child Key:", childKey.toBase58());
// }

// generateBIP32RootKey().catch(console.error);