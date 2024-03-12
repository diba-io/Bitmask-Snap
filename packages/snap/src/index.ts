import {
  UserInputEventType,
  type OnHomePageHandler,
  type OnUserInputHandler,
  OnRpcRequestHandler,
  panel,
  text,
  OnSignatureHandler,
  row,
  heading,
  SeverityLevel,
} from '@metamask/snaps-sdk';
import {
  showForm_Home,
  showForm_Final,
  showForm_GetAirport,
  showForm_GetDate,
  showForm_GetName,
  showForm_Review,
  showForm_ReturnToHome,
} from './ui';
import {
  Booking,
  UserAccount,
  getUserAccount,
  initBooking,
  updateBooking,
  validateForm,
} from './state';

const MALICIOUS_CONTRACT = '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC';
let userAccount: UserAccount;

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

export const onSignature: OnSignatureHandler = async ({ signature }) => {
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
  //  Get this info using an API call to the backend.
  await initBooking();
  userAccount = await getUserAccount();

  const interfaceId = await showForm_Home(userAccount);
  return { id: interfaceId };
};

export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  if (event.type === UserInputEventType.ButtonClickEvent) {
    switch (event.name) {
      // ------------ While on Home Page
      case 'btnBookFlight':
        const formValue: Booking = {};
        await updateBooking(formValue);
        await showForm_GetName(id);
        break;

      // ------------ While on Name Page
      case 'formName_btnNext': {
        const errors = await validateForm(id, 'formName');
        if (errors.length == 0) {
          await showForm_GetDate(id);
        } else {
          await showForm_GetName(id, errors);
        }
        break;
      }

      // ------------ While on Flight Date Page
      case 'formFlightDate_btnNext': {
        const errors = await validateForm(id, 'formFlightDate');
        if (errors.length == 0) {
          await showForm_GetAirport(id);
        } else {
          await showForm_GetDate(id, errors);
        }
        break;
      }

      case 'formFlightDate_btnBack': {
        await validateForm(id, 'formFlightDate');
        await showForm_GetName(id);
        break;
      }

      // ------------ While on Airport Code Page
      case 'formAirport_btnReview': {
        const errors = await validateForm(id, 'formAirport');
        if (errors.length == 0) {
          await showForm_Review(id);
        } else {
          await showForm_GetAirport(id, errors);
        }
        break;
      }

      case 'formAirport_btnBack': {
        await validateForm(id, 'formAirport');
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
