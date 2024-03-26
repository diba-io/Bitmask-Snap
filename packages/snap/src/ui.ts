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
  import { UserAccount, getBooking, updateBooking } from './state';
  
  export async function showForm_Home(entropy: any, mnemonic:any, userAccount: UserAccount): Promise<string> {
    console.log(">>>>called showForm_Home userAccount", userAccount);    
    console.log(">>>>called showForm_Home entropy", entropy);
    
    const formValue = {"entropy": entropy, "mnemonic": mnemonic };
    await updateBooking(formValue);

    return await snap.request({
      method: 'snap_createInterface',
      params: {
        ui: panel([
        text('ENTROPY BITMASK CORE enxrypt_wallet'),
        text(`Private Key ${entropy}, your entropy`),
         //text(`Public Key ${publicKey}, your Frequent Flyer Number is`),
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
    
    console.log("Snap State frequentFlyerNumber: ",snapState.frequentFlyerNumber);
    console.log("Snap State userName: ",snapState.userName);

    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: panel([
          row("Define your Wallet", text('Pg: 1 of 5')),

          text(`Entropy/Seed Phrase`),
          form({
            name: 'formName',
            children: [
              input({
                name: 'entropy',
                value: snapState.entropy,
                placeholder: 'Entropy',
              }),
              input({
                name: 'mnemonic',
                value: snapState.mnemonic,
                placeholder: 'Memonic',
              }),
              input({
                name: 'userName',
                value: snapState.userName,
                placeholder: 'User name',
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

  export async function showForm_GetDate(id: string, errors: string[] = []) {
    const snapState = await getBooking();

    await snap.request({
        method: 'snap_updateInterface',
        params: {
            id,
            ui: panel([
                row("When are you flying ?", text("Pg: 2 of 5")),
                row("Public frequentFlyerNumber", text(`${snapState.userName}`)),
                form({
                    name: 'formFlightDate',
                    children: [
                        input({
                            name: 'startDate',
                            value: snapState.startDate,
                            placeholder: "Start date: mm/dd/yyyy",
                        }),
                        input({
                            name: 'returnDate',
                            value: snapState.returnDate,
                            placeholder: "Return date: mm/dd/yyyy",
                        }),
                        input({
                            name: 'flexDays',
                            value: String(snapState.flexDays),
                            placeholder: "+/- Days",
                            inputType: 'number',
                        }),
                        button({
                            name: "formFlightDate_btnBack",
                            value: "< Back",
                            buttonType: 'button',
                            variant: 'secondary'
                        }),
                        button({
                            name: "formFlightDate_btnNext",
                            value: "Next >",
                            buttonType: 'button',
                            variant: 'secondary'
                        }),
                    ],
                }),
                ...createErrorFields(errors)
            ]),
        },
    });
}

  export async function showForm_GetAirport(id: string, errors: string[] = []) {
    const snapState = await getBooking();

    await snap.request({
        method: 'snap_updateInterface',
        params: {
            id,
            ui: panel([
                row("Where are you going ?", text("Pg: 3 of 5")),
                form({
                    name: 'formAirport',
                    children: [
                        input({
                            name: 'fromAirportCode',
                            value: snapState.fromAirportCode,
                            placeholder: "Starting Airport code",
                        }),
                        input({
                            name: 'toAirportCode',
                            value: snapState.toAirportCode,
                            placeholder: "Destination Airport code",
                        }),
                        button({
                            name: "formAirport_btnBack",
                            value: "< Back",
                            buttonType: 'button',
                            variant: 'secondary'
                        }),
                        button({
                            name: "formAirport_btnReview",
                            value: "Next >",
                            buttonType: 'button',
                            variant: 'secondary'
                        }),
                    ],
                }),
                ...createErrorFields(errors)
            ]),
        },
    });
}

export async function showForm_Review(id: string) {
  const snapState = await getBooking();

  await snap.request({
      method: 'snap_updateInterface',
      params: {
          id,
          ui: panel([
              row("Please review your flight", text("Pg: 4 of 5")),
              row("Passenger Name", text(`${snapState.lastName}, ${snapState.userName}`)),
              row("Start Date", text(`${snapState.startDate}`)),
              row("Return Date", text(`${snapState.returnDate}`)),
              row("Flex Days", text(`${snapState.flexDays}`)),
              row("From", text(`${snapState.fromAirportCode}`)),
              row("To", text(`${snapState.toAirportCode}`)),
              button({
                  name: "btnReviewBack",
                  value: "< Back",
                  buttonType: 'button',
                  variant: 'secondary'
              }),
              button({
                  name: "btnCreateVoucher",
                  value: "Create Voucher",
                  buttonType: 'button',
                  variant: 'primary'
              })
          ]),
      },
  });
}

  export async function showForm_Final(id: string) {
    const snapState = await getBooking();

    await snap.request({
        method: 'snap_updateInterface',
        params: {
            id,
            ui: panel([
                row("Congratulations !", image(
                    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="59" height="55" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><g stroke="none" fill-rule="nonzero"><path d="M21.0927 13.3143l25.0466 22.0361L3.2391 51.0578l8.927-18.872z" fill="#f1b31c"/><path d="M34.8613 26.3043L20.6065 13.7438 2.0734 52.0833z" fill="#fcea2b"/><path d="M10.1773 35.3196l11.0209 9.6964-5.5097 1.9739-7.7679-6.8347z" fill="#ea5a47"/><path d="M12.2883 44.0526l3.3996 2.9362 5.5091-1.972-4.782-4.2075z" fill="#d22f27"/><path d="M15.7373 23.8178l18.3271 16.1235-6.2502 2.51-14.7219-12.952z" fill="#ea5a47"/><path d="M21.4482 36.8491l6.3762 5.6096 6.2499-2.509-7.8108-6.8705z" fill="#d22f27"/><use xlink:href="#B" fill="#8967aa"/><use xlink:href="#B" x="29.8886" y="3.5062" fill="#f1b31c"/><use xlink:href="#B" x="26.8997" y="21.9133" fill="#d22f27"/></g><g fill="none" stroke-width="4.1667"><path d="M45.4845 35.6305l.1673.1476L2.0834 52.0745 20.6165 13.735"/><path d="M20.7138 13.8387l24.7706 21.7921m-24.8771-21.887l.0996.0878M41.3373 2.0833c.2339.3945.4015.8265.498 1.2913.4481 2.4076-1.4417 4.7452-4.2246 5.2212"/><path d="M37.7835 8.5775c-.5178.0347-1.0257.1425-1.5045.3191-2.5605.9378-3.8138 3.5874-2.7897 5.9164m23.0842 4.231c-.1023.4474-.2846.8778-.54 1.2749-1.367 2.1228-4.5064 2.8921-7.0121 1.7351"/><path d="M49.183 22.1463c-.4155-.2515-.885-.4496-1.399-.5812-2.663-.6811-5.5296.6899-6.3981 3.0627"/></g><defs ><path id="B" d="M23.1997 8.2986c0-.957.8885-1.7275 1.9926-1.7275s1.9923.7705 1.9923 1.7275-.8885 1.728-1.9923 1.728-1.9926-.771-1.9926-1.728z"/></defs></svg>',
                )),
                text("You can use this Voucher on the [American Airlines website](https://aa.com) to purchase your Ticket."),
                copyable({
                    value: "WcQIoTTyelqT2EhT8QWIRiOYik5Ls8UQRmGCSeeAZyg"
                }),
                divider(),
                button({
                    name: "btnReturnHome",
                    value: "Return to Home Page",
                    buttonType: 'button',
                    variant: 'primary'
                })
            ]),
        },
    });
}

  export async function showForm_ReturnToHome(id: string, userAccount: UserAccount) {
    await snap.request({
        method: 'snap_updateInterface',
        params: {
            id,
            ui: panel([
                text(`Hi ${userAccount.userName}, your Frequent Flyer Number is`),
                copyable(`${userAccount.frequentFlyerNumber}`),
                text('Your last flight was on [01/16/2024 to Cancun](https://aa.com)'),
                text(
                    'Your upcoming flight to Denver is on [02/22/2024](https://aa.com). It is on time.',
                ),
                divider(),
                text('You can book your next Flight now.'),
                button({
                    value: "Book your next Flight",
                    buttonType: 'button',
                    name: "btnBookFlight",
                    variant: 'primary'
                }),
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