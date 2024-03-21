import { defaultSnapOrigin } from '../config';
import type { MetaMaskInpageProvider } from '@metamask/providers';
import type { GetSnapsResponse, Snap } from '../types';

/**
 * Check if a snap ID is a local snap ID.
 *
 * @param snapId - The snap ID.
 * @returns True if it's a local Snap, or false otherwise.
 */
// const handleSendHelloClick = async () => {
//   await invokeSnap({ method: 'hello' });
// };

export const createBitmaskWallet = async () => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: { snapId: defaultSnapOrigin, request: { method: 'home' } },
  });
};

export const signMessage = async () => {
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  await window.ethereum.request({
    "method": "eth_signTypedData_v4",
    "params": [
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      {
        "types": {
          "EIP712Domain": [
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "version",
              "type": "string"
            },
            {
              "name": "chainId",
              "type": "uint256"
            },
            {
              "name": "verifyingContract",
              "type": "address"
            }
          ],
          "Person": [
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "wallet",
              "type": "address"
            }
          ],
          "Mail": [
            {
              "name": "from",
              "type": "Person"
            },
            {
              "name": "to",
              "type": "Person"
            },
            {
              "name": "contents",
              "type": "string"
            }
          ]
        },
        "primaryType": "Mail",
        "domain": {
          "name": "Ether Mail",
          "version": "1",
          "chainId": 1,
          "verifyingContract": "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
        },
        "message": {
          "from": {
            "name": "Cow",
            "wallet": "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"
          },
          "to": {
            "name": "Bob",
            "wallet": "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"
          },
          "contents": "Hello, Bob!"
        }
      }
    ]
  });
};
export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');

  