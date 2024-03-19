import { ManageStateOperation } from '@metamask/snaps-sdk';

export interface UserAccount {
  firstName?: string;
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
}

export async function getUserAccount() {
  return {
    firstName: 'Wesley',
    lastName: 'Snipes',
    frequentFlyerNumber: '1231234',
  };
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
        booking: {},
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

