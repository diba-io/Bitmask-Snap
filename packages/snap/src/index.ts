import bip39 from 'bip39';

import { 
  UserInputEventType,
  type OnHomePageHandler,
  type OnUserInputHandler,
  OnRpcRequestHandler,
  SeverityLevel,
  OnSignatureHandler,
  MethodNotFoundError,
  UnsupportedMethodError,
  ParseError,
  UnauthorizedError,
  LimitExceededError,
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
            image(
              '<svg width="512" height="108" viewBox="0 0 512 108" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M430.479 83.722C426.927 83.722 423.707 83.3894 420.821 82.7244C417.934 82.0594 415.437 81.0619 413.327 79.7318C411.218 78.3463 409.553 76.6006 408.332 74.4947C407.111 72.3888 406.389 69.9503 406.167 67.1794L417.907 63.2723C418.073 65.6 418.739 67.5396 419.905 69.0914C421.071 70.6431 422.625 71.8069 424.568 72.5827C426.566 73.3032 428.786 73.6634 431.229 73.6634C433.56 73.6634 435.503 73.3863 437.057 72.8321C438.667 72.2225 439.86 71.4744 440.637 70.5877C441.47 69.6455 441.886 68.648 441.886 67.595C441.886 66.3758 441.359 65.3783 440.304 64.6024C439.249 63.7711 437.806 63.0784 435.974 62.5242C434.143 61.9146 432.006 61.3327 429.563 60.7785C426.788 60.1134 424.068 59.393 421.404 58.6172C418.739 57.8413 416.325 56.8437 414.16 55.6245C411.995 54.3499 410.274 52.7427 408.998 50.8031C407.777 48.808 407.166 46.3141 407.166 43.3215C407.166 39.9409 408.026 37.0037 409.747 34.5099C411.468 32.016 413.993 30.0764 417.324 28.6909C420.654 27.25 424.762 26.5295 429.647 26.5295C434.476 26.5295 438.583 27.2223 441.969 28.6078C445.355 29.9932 447.964 31.9329 449.796 34.4268C451.628 36.8652 452.627 39.7193 452.793 42.989L440.804 46.3973C440.804 44.7901 440.526 43.3769 439.971 42.1577C439.471 40.9385 438.75 39.9409 437.806 39.1651C436.863 38.3338 435.697 37.7242 434.309 37.3363C432.922 36.8929 431.34 36.6712 429.563 36.6712C427.454 36.6712 425.65 36.9206 424.151 37.4194C422.708 37.9182 421.626 38.5832 420.904 39.4145C420.183 40.1903 419.822 41.1047 419.822 42.1577C419.822 43.4878 420.377 44.5961 421.487 45.4828C422.653 46.3141 424.207 47.0346 426.15 47.6442C428.148 48.1984 430.34 48.7526 432.727 49.3067C435.114 49.8055 437.584 50.4428 440.137 51.2187C442.691 51.9392 445.078 52.909 447.298 54.1282C449.518 55.3474 451.295 57.01 452.627 59.1159C454.014 61.1664 454.708 63.7711 454.708 66.93C454.708 70.3106 453.792 73.2755 451.961 75.8247C450.184 78.3186 447.492 80.2583 443.884 81.6438C440.276 83.0292 435.808 83.722 430.479 83.722Z" fill="#0F0F0F"/><path fill-rule="evenodd" clip-rule="evenodd" d="M152.181 82.5581V27.6933H175.91C179.352 27.6933 182.432 27.9981 185.152 28.6078C187.928 29.162 190.287 30.0487 192.229 31.2679C194.172 32.4317 195.643 33.9557 196.642 35.8399C197.697 37.6688 198.224 39.8578 198.224 42.4071C198.224 44.5684 197.752 46.4527 196.809 48.0598C195.921 49.667 194.505 50.9693 192.562 51.9669C190.62 52.9644 188.039 53.6294 184.819 53.9619V55.3751C190.148 55.7077 194.089 56.9823 196.642 59.1991C199.196 61.4158 200.472 64.4084 200.472 68.1769C200.472 71.3912 199.612 74.0513 197.891 76.1573C196.17 78.2632 193.645 79.8704 190.314 80.9787C186.984 82.0317 182.876 82.5581 177.992 82.5581H152.181ZM165.003 71.9177H177.492C180.878 71.9177 183.376 71.4466 184.986 70.5046C186.595 69.507 187.4 67.9553 187.4 65.8493C187.4 63.5217 186.429 61.776 184.486 60.6122C182.543 59.4484 179.574 58.8665 175.577 58.8665H165.003V71.9177ZM165.003 50.7199H173.745C177.686 50.7199 180.573 50.1935 182.405 49.1405C184.236 48.0321 185.152 46.3973 185.152 44.2359C185.152 42.13 184.292 40.606 182.571 39.6638C180.906 38.6663 178.352 38.1675 174.911 38.1675H165.003V50.7199Z" fill="#0F0F0F"/><path d="M207.332 82.5581V27.6933H220.986V82.5581H207.332Z" fill="#0F0F0F"/><path d="M241.613 38.8326V82.5581H255.101V38.8326H271.254V27.6933H225.627V38.8326H241.613Z" fill="#0F0F0F"/><path d="M275.759 82.5581V27.6933H295.825L310.146 67.1794H310.562L324.55 27.6933H343.7V82.5581H331.044L331.794 41.3264H330.878L314.975 82.5581H303.984L288.414 41.3264H287.499L288.248 82.5581H275.759Z" fill="#0F0F0F"/><path fill-rule="evenodd" clip-rule="evenodd" d="M366.853 27.6933L348.203 82.5581H362.857L365.911 72.2502H387.445L390.499 82.5581H405.153L386.503 27.6933H366.853ZM377.344 38.1675H376.012L368.572 63.2723H384.784L377.344 38.1675Z" fill="#0F0F0F"/><path d="M460.97 27.6933V82.5581H474.375V61.8592H479.204C482.09 61.8592 484.449 62.1917 486.281 62.8567C488.113 63.4663 489.584 64.4915 490.694 65.9325C491.804 67.318 492.692 69.2299 493.358 71.6683L496.439 82.5581H511.676L506.93 69.2576C506.097 66.8192 505.098 64.741 503.933 63.023C502.822 61.2495 501.49 59.781 499.936 58.6172C498.437 57.4533 496.689 56.5944 494.691 56.0402C492.748 55.486 490.5 55.2089 487.946 55.2089V53.9619C490.444 52.8536 492.887 51.3573 495.273 49.473C497.716 47.5888 499.992 45.4551 502.101 43.0721C504.21 40.6337 506.014 38.1121 507.513 35.5074C509.012 32.8473 510.094 30.2426 510.76 27.6933H495.273C494.718 29.9101 493.83 32.1823 492.609 34.5099C491.443 36.7821 489.945 38.9988 488.113 41.1602C486.337 43.3215 484.283 45.3166 481.952 47.1454C479.62 48.9742 477.095 50.4983 474.375 51.7175V27.6933H460.97Z" fill="#0F0F0F"/><g clip-path="url(#clip0_229_4989)"><rect y="1" width="108" height="107" rx="27" fill="#0F0F0F"/><path fill-rule="evenodd" clip-rule="evenodd" d="M27 0C12.0883 0 0 12.0936 0 27.0117V81.0352C0 84.5545 0.672771 87.9167 1.89667 91C4.27506 75.9787 7.36071 62.1511 11.0253 49.9002C13.8442 40.4763 17.0057 31.9854 20.4514 24.6018C20.76 23.9404 21.5187 23.618 22.1952 23.8912C30.2262 27.1352 37.7318 35.3211 44.3571 47.3895C44.6164 47.862 45.1158 48.1564 45.6546 48.1477C48.4197 48.1033 51.2021 48.0809 54 48.0809C56.798 48.0809 59.5803 48.1033 62.3455 48.1477C62.8842 48.1564 63.3836 47.862 63.6429 47.3895C70.2682 35.3211 77.7738 27.1352 85.8048 23.8912C86.4813 23.618 87.24 23.9404 87.5486 24.6018C90.9943 31.9854 94.1558 40.4763 96.9748 49.9002C97.0233 50.0626 97.0718 50.2253 97.1202 50.3883C100.721 62.518 103.756 76.1779 106.103 91C107.327 87.9167 108 84.5545 108 81.0352V27.0117C108 12.0936 95.9117 0 81 0H27ZM59.6374 19.0883C58.9559 19.0883 58.4447 18.4645 58.5784 17.7959L60.5005 8.18128C60.71 7.13301 59.4333 6.44946 58.6778 7.20537L41.4437 24.4469C40.7633 25.1276 41.2452 26.2914 42.2074 26.2914H48.3626C49.0441 26.2914 49.5553 26.9152 49.4216 27.5838L47.4995 37.1984C47.29 38.2467 48.5667 38.9302 49.3223 38.1743L66.5563 20.9328C67.2367 20.2521 66.7548 19.0883 65.7927 19.0883H59.6374Z" fill="url(#paint0_radial_229_4989)"/><path d="M76.9279 79.5287C76.6961 80.2039 77.2322 80.9404 77.8836 80.758C82.5535 79.4508 86.3625 76.3175 88.6671 72.244C89.3312 71.0701 89.1081 69.5492 88.1348 68.6157C84.7574 65.3764 80.2092 63.4702 75.3608 63.5604C74.6844 63.573 74.3825 64.4326 74.7984 65.0126C76.2959 67.1005 77.2921 69.4526 77.6667 72.0059C78.0413 74.5592 77.7626 77.0984 76.9279 79.5287Z" fill="url(#paint1_radial_229_4989)"/><path d="M71.8911 65.4317C72.1229 64.7578 71.5892 64.0219 70.9382 64.2016C66.2399 65.4983 62.4073 68.6413 60.0924 72.733C59.4283 73.9069 59.6514 75.4278 60.6247 76.3613C64.017 79.6149 68.5907 81.5237 73.4633 81.4152C74.1385 81.4002 74.4384 80.5419 74.0228 79.963C72.5225 77.8734 71.5245 75.5189 71.1495 72.9628C70.7746 70.4066 71.0543 67.8645 71.8911 65.4317Z" fill="url(#paint2_radial_229_4989)"/><path d="M32.1736 65.0184C32.5827 64.435 32.2732 63.5801 31.5979 63.5726C26.7244 63.5186 22.1724 65.4785 18.8166 68.7699C17.8538 69.7143 17.6477 71.2376 18.325 72.404C20.6854 76.4694 24.5529 79.5693 29.2654 80.8134C29.9184 80.9858 30.4439 80.2439 30.2046 79.5726C29.3406 77.1494 29.0324 74.6106 29.3788 72.0504C29.7252 69.4902 30.6968 67.1247 32.1736 65.0184Z" fill="url(#paint3_radial_229_4989)"/><path d="M33.1164 79.9592C32.707 80.5438 33.0185 81.4 33.695 81.405C38.5441 81.441 43.0707 79.4839 46.4116 76.207C47.3744 75.2627 47.5805 73.7394 46.9033 72.573C44.5533 68.5255 40.7095 65.4351 36.0253 64.1802C35.3718 64.0052 34.844 64.7476 35.0834 65.4201C35.9452 67.841 36.2522 70.3769 35.9063 72.9343C35.5603 75.4917 34.5904 77.8547 33.1164 79.9592Z" fill="url(#paint4_radial_229_4989)"/></g><defs><radialGradient id="paint0_radial_229_4989" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(54.4219 38.8294) rotate(90) scale(35.8749 54.4233)"><stop stop-color="#FFF6D7"/><stop offset="1" stop-color="#FFCB12"/></radialGradient><radialGradient id="paint1_radial_229_4989" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(54.4219 38.8294) rotate(90) scale(35.8749 54.4233)"><stop stop-color="#FFF6D7"/><stop offset="1" stop-color="#FFCB12"/></radialGradient><radialGradient id="paint2_radial_229_4989" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(54.4219 38.8294) rotate(90) scale(35.8749 54.4233)"><stop stop-color="#FFF6D7"/><stop offset="1" stop-color="#FFCB12"/></radialGradient><radialGradient id="paint3_radial_229_4989" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(54.4219 38.8294) rotate(90) scale(35.8749 54.4233)"><stop stop-color="#FFF6D7"/><stop offset="1" stop-color="#FFCB12"/></radialGradient><radialGradient id="paint4_radial_229_4989" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(54.4219 38.8294) rotate(90) scale(35.8749 54.4233)"><stop stop-color="#FFF6D7"/><stop offset="1" stop-color="#FFCB12"/></radialGradient><clipPath id="clip0_229_4989"><rect width="108" height="108" fill="white"/></clipPath></defs></svg>',
            ),
            text(`Hello Alien, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
            text(
              'Lets make this do something greate for Bitmask, if you want to!',
            ),
          ]),
        },
      });

      case 'home':
        onHomePage();
        return snap.request({
          method: 'snap_dialog',
          params: {
            type: 'confirmation',
            content: panel([
              image(
                '<svg width="512" height="108" viewBox="0 0 512 108" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M430.479 83.722C426.927 83.722 423.707 83.3894 420.821 82.7244C417.934 82.0594 415.437 81.0619 413.327 79.7318C411.218 78.3463 409.553 76.6006 408.332 74.4947C407.111 72.3888 406.389 69.9503 406.167 67.1794L417.907 63.2723C418.073 65.6 418.739 67.5396 419.905 69.0914C421.071 70.6431 422.625 71.8069 424.568 72.5827C426.566 73.3032 428.786 73.6634 431.229 73.6634C433.56 73.6634 435.503 73.3863 437.057 72.8321C438.667 72.2225 439.86 71.4744 440.637 70.5877C441.47 69.6455 441.886 68.648 441.886 67.595C441.886 66.3758 441.359 65.3783 440.304 64.6024C439.249 63.7711 437.806 63.0784 435.974 62.5242C434.143 61.9146 432.006 61.3327 429.563 60.7785C426.788 60.1134 424.068 59.393 421.404 58.6172C418.739 57.8413 416.325 56.8437 414.16 55.6245C411.995 54.3499 410.274 52.7427 408.998 50.8031C407.777 48.808 407.166 46.3141 407.166 43.3215C407.166 39.9409 408.026 37.0037 409.747 34.5099C411.468 32.016 413.993 30.0764 417.324 28.6909C420.654 27.25 424.762 26.5295 429.647 26.5295C434.476 26.5295 438.583 27.2223 441.969 28.6078C445.355 29.9932 447.964 31.9329 449.796 34.4268C451.628 36.8652 452.627 39.7193 452.793 42.989L440.804 46.3973C440.804 44.7901 440.526 43.3769 439.971 42.1577C439.471 40.9385 438.75 39.9409 437.806 39.1651C436.863 38.3338 435.697 37.7242 434.309 37.3363C432.922 36.8929 431.34 36.6712 429.563 36.6712C427.454 36.6712 425.65 36.9206 424.151 37.4194C422.708 37.9182 421.626 38.5832 420.904 39.4145C420.183 40.1903 419.822 41.1047 419.822 42.1577C419.822 43.4878 420.377 44.5961 421.487 45.4828C422.653 46.3141 424.207 47.0346 426.15 47.6442C428.148 48.1984 430.34 48.7526 432.727 49.3067C435.114 49.8055 437.584 50.4428 440.137 51.2187C442.691 51.9392 445.078 52.909 447.298 54.1282C449.518 55.3474 451.295 57.01 452.627 59.1159C454.014 61.1664 454.708 63.7711 454.708 66.93C454.708 70.3106 453.792 73.2755 451.961 75.8247C450.184 78.3186 447.492 80.2583 443.884 81.6438C440.276 83.0292 435.808 83.722 430.479 83.722Z" fill="#0F0F0F"/><path fill-rule="evenodd" clip-rule="evenodd" d="M152.181 82.5581V27.6933H175.91C179.352 27.6933 182.432 27.9981 185.152 28.6078C187.928 29.162 190.287 30.0487 192.229 31.2679C194.172 32.4317 195.643 33.9557 196.642 35.8399C197.697 37.6688 198.224 39.8578 198.224 42.4071C198.224 44.5684 197.752 46.4527 196.809 48.0598C195.921 49.667 194.505 50.9693 192.562 51.9669C190.62 52.9644 188.039 53.6294 184.819 53.9619V55.3751C190.148 55.7077 194.089 56.9823 196.642 59.1991C199.196 61.4158 200.472 64.4084 200.472 68.1769C200.472 71.3912 199.612 74.0513 197.891 76.1573C196.17 78.2632 193.645 79.8704 190.314 80.9787C186.984 82.0317 182.876 82.5581 177.992 82.5581H152.181ZM165.003 71.9177H177.492C180.878 71.9177 183.376 71.4466 184.986 70.5046C186.595 69.507 187.4 67.9553 187.4 65.8493C187.4 63.5217 186.429 61.776 184.486 60.6122C182.543 59.4484 179.574 58.8665 175.577 58.8665H165.003V71.9177ZM165.003 50.7199H173.745C177.686 50.7199 180.573 50.1935 182.405 49.1405C184.236 48.0321 185.152 46.3973 185.152 44.2359C185.152 42.13 184.292 40.606 182.571 39.6638C180.906 38.6663 178.352 38.1675 174.911 38.1675H165.003V50.7199Z" fill="#0F0F0F"/><path d="M207.332 82.5581V27.6933H220.986V82.5581H207.332Z" fill="#0F0F0F"/><path d="M241.613 38.8326V82.5581H255.101V38.8326H271.254V27.6933H225.627V38.8326H241.613Z" fill="#0F0F0F"/><path d="M275.759 82.5581V27.6933H295.825L310.146 67.1794H310.562L324.55 27.6933H343.7V82.5581H331.044L331.794 41.3264H330.878L314.975 82.5581H303.984L288.414 41.3264H287.499L288.248 82.5581H275.759Z" fill="#0F0F0F"/><path fill-rule="evenodd" clip-rule="evenodd" d="M366.853 27.6933L348.203 82.5581H362.857L365.911 72.2502H387.445L390.499 82.5581H405.153L386.503 27.6933H366.853ZM377.344 38.1675H376.012L368.572 63.2723H384.784L377.344 38.1675Z" fill="#0F0F0F"/><path d="M460.97 27.6933V82.5581H474.375V61.8592H479.204C482.09 61.8592 484.449 62.1917 486.281 62.8567C488.113 63.4663 489.584 64.4915 490.694 65.9325C491.804 67.318 492.692 69.2299 493.358 71.6683L496.439 82.5581H511.676L506.93 69.2576C506.097 66.8192 505.098 64.741 503.933 63.023C502.822 61.2495 501.49 59.781 499.936 58.6172C498.437 57.4533 496.689 56.5944 494.691 56.0402C492.748 55.486 490.5 55.2089 487.946 55.2089V53.9619C490.444 52.8536 492.887 51.3573 495.273 49.473C497.716 47.5888 499.992 45.4551 502.101 43.0721C504.21 40.6337 506.014 38.1121 507.513 35.5074C509.012 32.8473 510.094 30.2426 510.76 27.6933H495.273C494.718 29.9101 493.83 32.1823 492.609 34.5099C491.443 36.7821 489.945 38.9988 488.113 41.1602C486.337 43.3215 484.283 45.3166 481.952 47.1454C479.62 48.9742 477.095 50.4983 474.375 51.7175V27.6933H460.97Z" fill="#0F0F0F"/><g clip-path="url(#clip0_229_4989)"><rect y="1" width="108" height="107" rx="27" fill="#0F0F0F"/><path fill-rule="evenodd" clip-rule="evenodd" d="M27 0C12.0883 0 0 12.0936 0 27.0117V81.0352C0 84.5545 0.672771 87.9167 1.89667 91C4.27506 75.9787 7.36071 62.1511 11.0253 49.9002C13.8442 40.4763 17.0057 31.9854 20.4514 24.6018C20.76 23.9404 21.5187 23.618 22.1952 23.8912C30.2262 27.1352 37.7318 35.3211 44.3571 47.3895C44.6164 47.862 45.1158 48.1564 45.6546 48.1477C48.4197 48.1033 51.2021 48.0809 54 48.0809C56.798 48.0809 59.5803 48.1033 62.3455 48.1477C62.8842 48.1564 63.3836 47.862 63.6429 47.3895C70.2682 35.3211 77.7738 27.1352 85.8048 23.8912C86.4813 23.618 87.24 23.9404 87.5486 24.6018C90.9943 31.9854 94.1558 40.4763 96.9748 49.9002C97.0233 50.0626 97.0718 50.2253 97.1202 50.3883C100.721 62.518 103.756 76.1779 106.103 91C107.327 87.9167 108 84.5545 108 81.0352V27.0117C108 12.0936 95.9117 0 81 0H27ZM59.6374 19.0883C58.9559 19.0883 58.4447 18.4645 58.5784 17.7959L60.5005 8.18128C60.71 7.13301 59.4333 6.44946 58.6778 7.20537L41.4437 24.4469C40.7633 25.1276 41.2452 26.2914 42.2074 26.2914H48.3626C49.0441 26.2914 49.5553 26.9152 49.4216 27.5838L47.4995 37.1984C47.29 38.2467 48.5667 38.9302 49.3223 38.1743L66.5563 20.9328C67.2367 20.2521 66.7548 19.0883 65.7927 19.0883H59.6374Z" fill="url(#paint0_radial_229_4989)"/><path d="M76.9279 79.5287C76.6961 80.2039 77.2322 80.9404 77.8836 80.758C82.5535 79.4508 86.3625 76.3175 88.6671 72.244C89.3312 71.0701 89.1081 69.5492 88.1348 68.6157C84.7574 65.3764 80.2092 63.4702 75.3608 63.5604C74.6844 63.573 74.3825 64.4326 74.7984 65.0126C76.2959 67.1005 77.2921 69.4526 77.6667 72.0059C78.0413 74.5592 77.7626 77.0984 76.9279 79.5287Z" fill="url(#paint1_radial_229_4989)"/><path d="M71.8911 65.4317C72.1229 64.7578 71.5892 64.0219 70.9382 64.2016C66.2399 65.4983 62.4073 68.6413 60.0924 72.733C59.4283 73.9069 59.6514 75.4278 60.6247 76.3613C64.017 79.6149 68.5907 81.5237 73.4633 81.4152C74.1385 81.4002 74.4384 80.5419 74.0228 79.963C72.5225 77.8734 71.5245 75.5189 71.1495 72.9628C70.7746 70.4066 71.0543 67.8645 71.8911 65.4317Z" fill="url(#paint2_radial_229_4989)"/><path d="M32.1736 65.0184C32.5827 64.435 32.2732 63.5801 31.5979 63.5726C26.7244 63.5186 22.1724 65.4785 18.8166 68.7699C17.8538 69.7143 17.6477 71.2376 18.325 72.404C20.6854 76.4694 24.5529 79.5693 29.2654 80.8134C29.9184 80.9858 30.4439 80.2439 30.2046 79.5726C29.3406 77.1494 29.0324 74.6106 29.3788 72.0504C29.7252 69.4902 30.6968 67.1247 32.1736 65.0184Z" fill="url(#paint3_radial_229_4989)"/><path d="M33.1164 79.9592C32.707 80.5438 33.0185 81.4 33.695 81.405C38.5441 81.441 43.0707 79.4839 46.4116 76.207C47.3744 75.2627 47.5805 73.7394 46.9033 72.573C44.5533 68.5255 40.7095 65.4351 36.0253 64.1802C35.3718 64.0052 34.844 64.7476 35.0834 65.4201C35.9452 67.841 36.2522 70.3769 35.9063 72.9343C35.5603 75.4917 34.5904 77.8547 33.1164 79.9592Z" fill="url(#paint4_radial_229_4989)"/></g><defs><radialGradient id="paint0_radial_229_4989" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(54.4219 38.8294) rotate(90) scale(35.8749 54.4233)"><stop stop-color="#FFF6D7"/><stop offset="1" stop-color="#FFCB12"/></radialGradient><radialGradient id="paint1_radial_229_4989" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(54.4219 38.8294) rotate(90) scale(35.8749 54.4233)"><stop stop-color="#FFF6D7"/><stop offset="1" stop-color="#FFCB12"/></radialGradient><radialGradient id="paint2_radial_229_4989" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(54.4219 38.8294) rotate(90) scale(35.8749 54.4233)"><stop stop-color="#FFF6D7"/><stop offset="1" stop-color="#FFCB12"/></radialGradient><radialGradient id="paint3_radial_229_4989" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(54.4219 38.8294) rotate(90) scale(35.8749 54.4233)"><stop stop-color="#FFF6D7"/><stop offset="1" stop-color="#FFCB12"/></radialGradient><radialGradient id="paint4_radial_229_4989" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(54.4219 38.8294) rotate(90) scale(35.8749 54.4233)"><stop stop-color="#FFF6D7"/><stop offset="1" stop-color="#FFCB12"/></radialGradient><clipPath id="clip0_229_4989"><rect width="108" height="108" fill="white"/></clipPath></defs></svg>',
              ),
              divider(),
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
      throw new MethodNotFoundError();
  }
};

export const createMnemonic = async (entropy: string) => {

  // const random = bip39.mnemonicToEntropy("12"); // 256 bits
  console.log("Entropy:", entropy);

let mnemonic = "null";
try {    
  // BIP39 MAY NOT BE BROWSER SAFE FORM
  //mnemonic = bip39.entropyToMnemonic(entropy); // Ensure this is valid entropy
  mnemonic = "happy go lucky clown"; // Ensure this is valid entropy

  // if (!mnemonic) {
  //   throw new Error('Failed to generate mnemonic');
  // }
  return mnemonic;
} catch (error) {
  console.error('Error generating mnemonic:', error);
  throw new LimitExceededError();
}
};

export const testBip  = async () => {
  const bitmaskNode = await snap.request({
    method: 'snap_getBip32Entropy',
    params: {
      // Must be specified exactly in the manifest
      path: ['m', "44'", "3'"],
      curve: 'secp256k1',
    },
  });
  return bitmaskNode;
}



export const onHomePage: OnHomePageHandler = async () => {
  
  let bip = testBip();
  let privateKey: any;
  let publicKey: any;
  await bip.then((x) => {
    privateKey = x.privateKey;
    publicKey = x.publicKey;
  });

  //console.log("Entropy:", publicKey);


  let mnemonic = await createMnemonic(publicKey);

  await initBooking();

  userAccount = await getUserAccount();

  const interfaceId = await showForm_Home(privateKey, publicKey, mnemonic, userAccount);
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