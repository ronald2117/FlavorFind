import * as React from "react"
import Svg, { Mask, Path, Rect } from "react-native-svg"

function FlavorBotLogo(props) {
  return (
    <Svg
      width={40}
      height={29}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Mask
        id="a"
        maskUnits="userSpaceOnUse"
        x={9}
        y={27}
        width={10}
        height={17}
        fill="#000"
      >
        <Path fill="#fff" d="M9 27H19V44H9z" />
        <Path d="M11 27h4.667c.736 0 1.333.597 1.333 1.333v12.334c0 .736-.597 1.333-1.333 1.333h-3.334A1.333 1.333 0 0111 40.667V27z" />
      </Mask>
      <Path
        d="M11 27h4.667c.736 0 1.333.597 1.333 1.333v12.334c0 .736-.597 1.333-1.333 1.333h-3.334A1.333 1.333 0 0111 40.667V27z"
        fill="#fff"
      />
      <Path
        d="M11 27h6-6zm8 13.667A3.333 3.333 0 0115.667 44h-3.334A3.333 3.333 0 019 40.667L13 40h2l4 .667zM12.333 44A3.333 3.333 0 019 40.667V27h4v13l-.667 4zm3.334-17A3.333 3.333 0 0119 30.333v10.334A3.333 3.333 0 0115.667 44L15 40V28.333 27h.667z"
        fill="#111"
        mask="url(#a)"
      />
      <Mask
        id="b"
        maskUnits="userSpaceOnUse"
        x={21}
        y={27}
        width={10}
        height={17}
        fill="#000"
      >
        <Path fill="#fff" d="M21 27H31V44H21z" />
        <Path d="M23 28.333c0-.736.597-1.333 1.333-1.333H29v13.667c0 .736-.597 1.333-1.333 1.333h-3.334A1.333 1.333 0 0123 40.667V28.333z" />
      </Mask>
      <Path
        d="M23 28.333c0-.736.597-1.333 1.333-1.333H29v13.667c0 .736-.597 1.333-1.333 1.333h-3.334A1.333 1.333 0 0123 40.667V28.333z"
        fill="#fff"
      />
      <Path
        d="M23 27h6-6zm8 13.667A3.333 3.333 0 0127.667 44h-3.334A3.333 3.333 0 0121 40.667L25 40h2l4 .667zM24.333 44A3.333 3.333 0 0121 40.667V30.333A3.333 3.333 0 0124.333 27H25v13l-.667 4zM31 27v13.667A3.333 3.333 0 0127.667 44L27 40V27h4z"
        fill="#111"
        mask="url(#b)"
      />
      <Mask
        id="c"
        maskUnits="userSpaceOnUse"
        x={17}
        y={27}
        width={6}
        height={11}
        fill="#000"
      >
        <Path fill="#fff" d="M17 27H23V38H17z" />
        <Path d="M17 27h6v9h-6v-9z" />
      </Mask>
      <Path d="M17 27h6v9h-6v-9z" fill="#fff" />
      <Path d="M23 36v-2h-6v4h6v-2z" fill="#111" mask="url(#c)" />
      <Path stroke="#111" d="M19 36.5L21 36.5" />
      <Rect
        x={3}
        y={5.83325}
        width={32.625}
        height={20.9583}
        rx={2.45833}
        fill="#FFBA09"
        stroke="#111"
        strokeWidth={2}
      />
      <Path
        fill="#D00000"
        stroke="#111"
        strokeWidth={2}
        d="M15.6667 1H22.958370000000002V5.375H15.6667z"
      />
      <Path
        d="M4 8.292c0-.806.653-1.459 1.458-1.459h4.375v18.959H5.458A1.458 1.458 0 014 24.333V8.292zM9.833 22.875h24.792v1.458c0 .806-.653 1.459-1.458 1.459H9.833v-2.917z"
        fill="#DC2F02"
      />
      <Path
        d="M4.917 30.25c1.22 0 2.208.989 2.208 2.208v5.834c0 1.22-.989 2.208-2.208 2.208H3.458a2.208 2.208 0 01-2.208-2.208v-5.834l.012-.226a2.208 2.208 0 012.196-1.982h1.459z"
        fill="#fff"
        stroke="#111"
        strokeWidth={1.5}
      />
      <Rect
        x={32.25}
        y={35.125}
        width={5.875}
        height={10.25}
        rx={2.20833}
        transform="rotate(-90 32.25 35.125)"
        fill="#fff"
        stroke="#111"
        strokeWidth={1.5}
      />
      <Rect
        x={15.6667}
        y={9.75}
        width={5.83333}
        height={8.75}
        rx={1.45833}
        fill="#111"
      />
      <Rect
        x={25.875}
        y={9.75}
        width={5.83333}
        height={8.75}
        rx={1.45833}
        fill="#111"
      />
    </Svg>
  )
}

export default FlavorBotLogo;
