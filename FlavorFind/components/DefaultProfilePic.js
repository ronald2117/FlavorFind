import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

function DefaultProfilePic(props) {
  const strokeColor = props.stroke || {strokeColor};
  return (
    <Svg
    width={props.width || 40}
    height={props.width || 40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle
        cx={20}
        cy={16.6667}
        r={5}
        stroke={strokeColor}
        strokeWidth={3.33333}
        strokeLinecap="round"
      />
      <Circle cx={20} cy={20} r={15} stroke={strokeColor} strokeWidth={3.33333} />
      <Path
        d="M29.634 31.377a.477.477 0 00.223-.592c-.643-1.61-1.881-3.03-3.555-4.063C24.494 25.605 22.28 25 20 25s-4.494.605-6.302 1.722c-1.674 1.034-2.912 2.452-3.555 4.063-.09.224.01.476.223.592a20.019 20.019 0 0019.268 0z"
        fill={strokeColor}
      />
    </Svg>
  )
}

export default DefaultProfilePic;

