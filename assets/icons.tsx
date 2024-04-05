import Colors from "@/constants/Colors";
import { SVGProps } from "react";

export function WalletIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      width="800px"
      height="800px"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="48" height="48" fill="white" fillOpacity="0.01" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.9821 11.9689L31.7847 4L36.3971 11.9889L17.9821 11.9689Z"
        stroke="#000000"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 14C4 12.8954 4.89543 12 6 12H42C43.1046 12 44 12.8954 44 14V42C44 43.1046 43.1046 44 42 44H6C4.89543 44 4 43.1046 4 42V14Z"
        fill="#2F88FF"
        stroke="#000000"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M35.25 33H44V23H35.25C32.3505 23 30 25.2386 30 28C30 30.7614 32.3505 33 35.25 33Z"
        fill="#43CCF8"
        stroke="white"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M44 16.5V40.5"
        stroke="#000000"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function TelegramIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      version="1.1"
      id="Uploaded to svgrepo.com"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="800px"
      height="800px"
      viewBox="0 0 32 32"
      xmlSpace="preserve"
      {...props}
    >
      <style type="text/css"></style>
      <path
        className="stone_een"
        fill={Colors.systemTintDark.blue}
        d="M10.774,23.619l-1.625,5.691C9.06,29.164,9,28.992,9,28.794v-5.57l13.09-12.793L10.774,23.619z
	 M10.017,29.786c0.243-0.002,0.489-0.084,0.69-0.285l3.638-3.639l-2.772-1.386L10.017,29.786z M28.835,2.009L3.802,14.326
	c-2.226,1.095-2.236,4.266-0.017,5.375l4.89,2.445L27.464,3.79c0.204-0.199,0.516-0.234,0.759-0.086
	c0.326,0.2,0.396,0.644,0.147,0.935l-16.3,18.976l8.84,4.4c1.746,0.873,3.848-0.128,4.27-2.034l5.071-22.858
	C30.435,2.304,29.588,1.639,28.835,2.009z"
      />
    </svg>
  );
}
export function HistoryIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      width="800px"
      height="800px"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill={Colors.systemTintDark.blue}
        d="M10.6972,0.468433 C12.354,1.06178 13.7689,2.18485 14.7228,3.66372 C15.6766,5.14258 16.1163,6.89471 15.9736,8.64872 C15.8309,10.4027 15.1138,12.0607 13.9334,13.366 C12.753,14.6712 11.1752,15.5508 9.4443,15.8685 C7.71342,16.1863 5.92606,15.9244 4.35906,15.1235 C2.79206,14.3226 1.53287,13.0274 0.776508,11.4384 C0.539137,10.9397 0.750962,10.343 1.24963,10.1057 C1.74831,9.86829 2.34499,10.0801 2.58236,10.5788 C3.14963,11.7705 4.09402,12.742 5.26927,13.3426 C6.44452,13.9433 7.78504,14.1397 9.08321,13.9014 C10.3814,13.6631 11.5647,13.0034 12.45,12.0245 C13.3353,11.0456 13.8731,9.80205 13.9801,8.48654 C14.0872,7.17103 13.7574,5.85694 13.042,4.74779 C12.3266,3.63864 11.2655,2.79633 10.0229,2.35133 C8.78032,1.90632 7.42568,1.88344 6.1688,2.28624 C5.34644,2.54978 4.59596,2.98593 3.96459,3.5597 L4.69779,4.29291 C5.32776,4.92287 4.88159,6.00002 3.99069,6.00002 L1.77635684e-15,6.00002 L1.77635684e-15,2.00933 C1.77635684e-15,1.11842 1.07714,0.672258 1.70711,1.30222 L2.54916,2.14428 C3.40537,1.3473 4.43126,0.742882 5.55842,0.381656 C7.23428,-0.155411 9.04046,-0.124911 10.6972,0.468433 Z M8,4 C8.55229,4 9,4.44772 9,5 L9,7.58579 L10.7071,9.29289 C11.0976,9.68342 11.0976,10.3166 10.7071,10.7071 C10.3166,11.0976 9.68342,11.0976 9.29289,10.7071 L7,8.41421 L7,5 C7,4.44772 7.44772,4 8,4 Z"
      />
    </svg>
  );
}
