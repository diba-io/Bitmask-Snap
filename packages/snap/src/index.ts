import { 
  UserInputEventType,
  type OnHomePageHandler,
  type OnUserInputHandler,
  OnRpcRequestHandler,
  SeverityLevel,
  OnSignatureHandler,
 } from '@metamask/snaps-sdk';
import { 
  panel, 
  text, 
  heading,
  copyable,
  divider,
  button,
  image,
  row,
 } from '@metamask/snaps-sdk';

import {
  Booking,
  UserAccount,
  getUserAccount,
  initBooking,
  updateBooking,
  validateForm,
} from './state';

import { 
  showForm_Home, 
  showForm_Final, 
  showForm_GetAirport, 
  showForm_GetDate, 
  showForm_GetName, 
  showForm_Review, 
  showForm_ReturnToHome 
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
            text(`Hello Alien, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
            text(
              'Lets make this do something greate for Bitmask, if you want to!',
            ),
          ]),
        },
      });

      case 'home':
        return snap.request({
          method: 'snap_dialog',
          params: {
            type: 'confirmation',
            content: panel([
              heading('Hello Alien!'),
              row("Mucho Congratulations !", image(
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="59" height="55" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><g stroke="none" fill-rule="nonzero"><path d="M21.0927 13.3143l25.0466 22.0361L3.2391 51.0578l8.927-18.872z" fill="#f1b31c"/><path d="M34.8613 26.3043L20.6065 13.7438 2.0734 52.0833z" fill="#fcea2b"/><path d="M10.1773 35.3196l11.0209 9.6964-5.5097 1.9739-7.7679-6.8347z" fill="#ea5a47"/><path d="M12.2883 44.0526l3.3996 2.9362 5.5091-1.972-4.782-4.2075z" fill="#d22f27"/><path d="M15.7373 23.8178l18.3271 16.1235-6.2502 2.51-14.7219-12.952z" fill="#ea5a47"/><path d="M21.4482 36.8491l6.3762 5.6096 6.2499-2.509-7.8108-6.8705z" fill="#d22f27"/><use xlink:href="#B" fill="#8967aa"/><use xlink:href="#B" x="29.8886" y="3.5062" fill="#f1b31c"/><use xlink:href="#B" x="26.8997" y="21.9133" fill="#d22f27"/></g><g fill="none" stroke-width="4.1667"><path d="M45.4845 35.6305l.1673.1476L2.0834 52.0745 20.6165 13.735"/><path d="M20.7138 13.8387l24.7706 21.7921m-24.8771-21.887l.0996.0878M41.3373 2.0833c.2339.3945.4015.8265.498 1.2913.4481 2.4076-1.4417 4.7452-4.2246 5.2212"/><path d="M37.7835 8.5775c-.5178.0347-1.0257.1425-1.5045.3191-2.5605.9378-3.8138 3.5874-2.7897 5.9164m23.0842 4.231c-.1023.4474-.2846.8778-.54 1.2749-1.367 2.1228-4.5064 2.8921-7.0121 1.7351"/><path d="M49.183 22.1463c-.4155-.2515-.885-.4496-1.399-.5812-2.663-.6811-5.5296.6899-6.3981 3.0627"/></g><defs ><path id="B" d="M23.1997 8.2986c0-.957.8885-1.7275 1.9926-1.7275s1.9923.7705 1.9923 1.7275-.8885 1.728-1.9923 1.728-1.9926-.771-1.9926-1.728z"/></defs></svg>',
            )),
              // text(`Welcome Home, **${origin}**!`),
              // text('This needs to be the show Home Form Page'),
              // divider(),
              // copyable(
              //   'Lets make this do something greate for Bitmask, if you want to!',
              // ),
              divider(),
              button({
                value: "Create a Bitmask Wallet",
                buttonType: 'button',
                name: "btnBookFlight",
                variant: 'primary'
            }),
            ]),
          },
        });
    default:
      throw new Error('Method not found.');
  }
};

// export const onHomePage: OnHomePageHandler = async () => {
//   //  Get this info using an API call to the backend.
//   await initBooking();

//   userAccount = await getUserAccount();

//   const interfaceId = await showForm_Home(userAccount);
//   return { id: interfaceId };
// };

export const onSigntaure: OnSignatureHandler = async ({ signature }) => {
  const { signatureMethod, from, data } = signature;

  if (signatureMethod == 'eth_signTypedData_v4') {
    const domain = data.domain;
    if (domain.verifyingContract === MALICIOUS_CONTRACT) {
      //  Logic to detect malicious info
      return {
        content: panel([
          heading('Danger!'),
          text(
            `${domain.verifyingContract} has been identified as a malicious verifying contract.`,
          ),
        ]),
        severity: SeverityLevel.Critical,
      };
    }
  }
  return null;
};

export const onHomePage: OnHomePageHandler = async () => {
  return {
    content: panel([
      heading('Hello world!'),
      text('Welcome to my Alien Snap home page!'),
    ]),
  };
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
      case 'formName_btnNext': {
        const errors = await validateForm(id, "formName");
        if (errors.length == 0) {
          await showForm_GetDate(id);
        } else {
          await showForm_GetName(id, errors);
        }
        break;
      }

      // ------------ While on Flight Date Page
      case 'formFlightDate_btnNext': {
        const errors = await validateForm(id, "formFlightDate");
        if (errors.length == 0) {
          await showForm_GetAirport(id);
        } else {
          await showForm_GetDate(id, errors);
        }
        break;
      }

      case 'formFlightDate_btnBack': {
        await validateForm(id, "formFlightDate");
        await showForm_GetName(id);
        break;
      }

      // ------------ While on Airport Code Page
      case 'formAirport_btnReview': {
        const errors = await validateForm(id, "formAirport");
        if (errors.length == 0) {
          await showForm_Review(id);
        } else {
          await showForm_GetAirport(id, errors);
        }
        break;
      }

      case 'formAirport_btnBack': {
        await validateForm(id, "formAirport");
        await showForm_GetDate(id);
        break;
      }

      // ------------ While on Review Page
      case 'btnCreateVoucher': {
        await showForm_Final(id);
        break;
      }

      case 'btnReviewBack': {
        await showForm_GetAirport(id);
        break;
      }

      // ------------ While on Final Page
      case 'btnReturnHome': {
        await initBooking();
        await showForm_ReturnToHome(id, userAccount);
        break;
      }

      default:
        break;
    }
  }
};