import {
    button,
    copyable,
    divider,
    form,
    heading,
    image,
    input,
    panel,
    row,
    text,
  } from '@metamask/snaps-sdk';
  import { UserAccount, getBooking } from './state';
  
  export async function showForm_Home(userAccount: UserAccount): Promise<string> {
    return await snap.request({
      method: 'snap_createInterface',
      params: {
        ui: panel([
          //text('I WILL USE THIS HOME PAGE TO HOW ENTROPY AND ADDRESS WALLET PARAMS FROM BITMASK CORE enxrypt_wallet'),
          
          text(`Hi ${userAccount.firstName}, your Frequent Flyer Number is`),
          copyable(`${userAccount.frequentFlyerNumber}`),
          text('Your last flight was on [01/16/2024 to Cancun](https://aa.com)'),
          text(
            'Your upcoming flight to Denver is on [02/22/2024](https://aa.com). It is on time.',
          ),
          divider(),
          text('You can book your next Flight now.'),
          button({
            value: 'Book your next Flight',
            buttonType: 'button',
            name: 'btnBookFlight',
            variant: 'primary',
          }),
        ]),
      },
    });
  }
   // BUTTON HERE IS PRIMARY

  // show form getEntropy
  //////////////////////  id where from SNAP PLATFORM KNOWS THIS  \\\\\\\\\\\\\\\\\\\\\\\\\\\
  export async function showForm_GetName(id: string, errors: string[] = []) {
    const snapState = await getBooking();
  
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: panel([
          row("Who's the passenger ?", text('Pg: 1 of 5')),
          form({
            name: 'formName',
            children: [
              input({
                name: 'firstName',
                value: snapState.firstName,
                placeholder: 'First name',
              }),
              input({
                name: 'lastName',
                value: snapState.lastName,
                placeholder: 'Last name',
              }),
              button({
                name: 'formName_btnNext',
                value: 'Next >',
                buttonType: 'button',
                variant: 'secondary',
              }),
            ],
          }),
          ...createErrorFields(errors),
        ]),
      },
    });
  }
  // BUTTON HERE IS SECONDARY
  // first time around the errors are empty or clean
  export function createErrorFields(errors: string[]) {
    const panelItems: any[] = [];
    if (errors.length != 0) {
      panelItems.push(divider());
      panelItems.push(heading('Errors'));
      for (const err of errors) {
        panelItems.push(text(err));
      }
    }
    return panelItems;
  }