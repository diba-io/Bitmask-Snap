import { 
  UserInputEventType,
  OnHomePageHandler,
  OnUserInputHandler,
  OnRpcRequestHandler,
 } from '@metamask/snaps-sdk';
import { panel, text } from '@metamask/snaps-sdk';

import {
  Booking,
  UserAccount,
  getUserAccount,
  initBooking,
  updateBooking,
  //validateForm,
} from './state';

import {
  showForm_Home,
  showForm_GetName,
} from './ui';

const MALICIOUS_CONTRACT = '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC';
let userAccount: UserAccount;
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
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'hello':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
            text(
              'But you can edit the snap source code to make it do something, if you want to!',
            ),
          ]),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};

export const onHomePage: OnHomePageHandler = async () => {
  //  Get this info using an API call to the backend.
  await initBooking();

  userAccount = await getUserAccount();

  const interfaceId = await showForm_Home(userAccount);
  return { id: interfaceId };
};

//////////////////// MAIN FOCUS \\\\\\\\\\\\\\\\\\\\\\\\\\\\
// ANY BUTTON CLICK COMES HERE TO BE HANDLED
export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  if (event.type === UserInputEventType.ButtonClickEvent) {
    switch (event.name) {
      // ------------ While on Home Page
      // event.name is btnBookFlight
      case 'btnBookFlight':
        const formValue: Booking = {};
        await updateBooking(formValue);
        await showForm_GetName(id);
        break;

      // ------------ While on Name Page
      // case 'formName_btnNext': {
      //   const errors = await validateForm(id, 'formName');
      //   if (errors.length == 0) {
            // if no errors we can go to the next showForm_GetDate(id);
      //     await showForm_GetDate(id);
      //   } else {
      //     await showForm_GetName(id, errors);
      //   }
      //   break;
      // }
      default:
        break;
    }
  }
};