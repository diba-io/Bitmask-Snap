import { ManageStateOperation } from '@metamask/snaps-sdk';

export interface UserAccount {
  userName?: string;
  lastName?: string;
  frequentFlyerNumber?: string;
}

export interface Booking extends UserAccount {
  startDate?: string;
  returnDate?: string;
  fromAirportCode?: string;
  toAirportCode?: string;
  flexDays?: number;
  voucher?: string;
  entropy?: string;
  mnemonic?: string;
}

export async function getUserAccount() {
  return {
      userName: "Wesley",
      lastName: "Parr",
      frequentFlyerNumber: "JHF7889JVB"
  }
}

export async function getBooking() {
  const snapState = await snap.request({
      method: 'snap_manageState',
      params: {
          operation: ManageStateOperation.GetState,
          encrypted: false,
      },
  });
  return (snapState?.booking || {}) as Booking;
}

export async function initBooking() {
  await snap.request({
      method: 'snap_manageState',
      params: {
          operation: ManageStateOperation.UpdateState,
          newState: {
              booking: {}
          },
          encrypted: false,
      },
  });
}

export async function updateBooking(info: Booking) {
  const snapState = await getBooking();
  const newState = { ...snapState, ...info };
  try {
    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: ManageStateOperation.UpdateState,
        newState: {
          booking: newState,
        },
        encrypted: false,
      },
    });
  } catch (err) {}
}

export async function getInterfaceState(id: string) {
  const state = await snap.request({
    method: 'snap_getInterfaceState',
    params: {
      id,
    },
  });
  return state;
}

export async function validateForm(id: string, formName: string) {
  const errors: string[] = [];
  switch (formName) {
      case "formName": {
          const interfaceState = await getInterfaceState(id);
          const formValue = interfaceState[formName] as Booking;
          if (!formValue.entropy || formValue.entropy.length == 0) {
            errors.push("Entropy value cannot be empty")
          }
          if (!formValue.userName || formValue.userName.length == 0) {
              errors.push("User name cannot be empty")
          }
          await updateBooking({
              entropy: formValue.entropy || "",
              userName: formValue.userName || ""
          });
          break;
      }

      case "formFlightDate": {
          const interfaceState = await getInterfaceState(id);
          const formValue = interfaceState[formName] as Booking;
          if (!formValue.startDate || formValue.startDate.length == 0) {
              errors.push("Start date cannot be empty")
          }
          if (!formValue.returnDate || formValue.returnDate.length == 0) {
              errors.push("Return date cannot be empty")
          }
          if ((formValue.flexDays as any) == 'undefined') {
              errors.push("Flex days should be 0 or more")
          }
          await updateBooking({
              startDate: formValue.startDate || "",
              returnDate: formValue.returnDate || "",
              flexDays: (formValue.flexDays as any) == 'undefined' ? 0 : formValue.flexDays as number
          });
          break;
      }

      case "formAirport": {
          const interfaceState = await getInterfaceState(id);
          const formValue = interfaceState[formName] as Booking;
          if (!formValue.fromAirportCode || formValue.fromAirportCode.length == 0) {
              errors.push("Starting Airport code cannot be empty")
          }
          if (!formValue.toAirportCode || formValue.toAirportCode.length == 0) {
              errors.push("Destination Airport code cannot be empty")
          }
          await updateBooking({
              fromAirportCode: formValue.fromAirportCode || "",
              toAirportCode: formValue.toAirportCode || ""
          });
          break;
      }
  }
  return errors;
}
