import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"

function FlavorBotLogo(props) {
  return (
    <Svg
      width={25}
      height={29}
      viewBox="0 0 25 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        x={0.5}
        y={4.5}
        width={22}
        height={14}
        rx={1.5}
        fill="#FFBA09"
        stroke="#fff"
      />
      <Path fill="#D00000" stroke="#fff" d="M9 1H14V4H9z" />
      <Path
        d="M1 6a1 1 0 011-1h3v13H2a1 1 0 01-1-1V6zM5 16h17v1a1 1 0 01-1 1H5v-2z"
        fill="#DC2F02"
      />
      <Path
        d="M6 19h4a1 1 0 011 1v8a1 1 0 01-1 1H7a1 1 0 01-1-1v-9z"
        fill="#fff"
      />
      <Rect x={2} y={21} width={3} height={6} rx={1} fill="#fff" />
      <Rect
        x={19}
        y={24}
        width={3}
        height={6}
        rx={1}
        transform="rotate(-90 19 24)"
        fill="#fff"
      />
      <Path
        d="M13 20a1 1 0 011-1h4v9a1 1 0 01-1 1h-3a1 1 0 01-1-1v-8z"
        fill="#fff"
      />
      <Path fill="#fff" d="M10 19H15V25H10z" />
      <Rect x={9} y={7} width={4} height={6} rx={1} fill="#000" />
      <Rect x={16} y={7} width={4} height={6} rx={1} fill="#000" />
    </Svg>
  )
}

export default FlavorBotLogo;
