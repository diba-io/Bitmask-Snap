import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { panel, text } from '@metamask/snaps-sdk';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */

// THIS IS DETECTED BY METAMASK
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'hello':
      //return snap.request({
        const result = await snap.request({

        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Greetings Bitmask User, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
            text('A likely transaction is to first fund your vault.'),

            text(
              'But you can edit the snap source code to make it do something, if you want to!',
            ),
          ]),
        },
      });
      console.log("Dialog result", result);

      return false;
    case "create wallet":
            //return snap.request({
              const result_wallet = await snap.request({

                method: 'snap_dialog',
                params: {
                  type: 'confirmation',
                  content: panel([
                    text(`Greetings Bitmask User, **${origin}**!`),
                    text('This custom confirmation is just for display purposes.'),
                    text('A likely transaction is to first fund your vault.'),
        
                    text(
                      'But you can edit the snap source code to make it do something, if you want to!',
                    ),
                  ]),
                },
              });
              console.log("Dialog result", result_wallet);
    default:
      throw new Error('Method not found.');
  }
};
