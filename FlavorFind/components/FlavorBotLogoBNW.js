import * as React from "react";
import Svg, { Rect, Mask, Path, Line } from "react-native-svg";
const FlavorBotLogoBNW = (props) => (
  <Svg
      width={25}
      height={29}
      viewBox="0 0 25 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      >
      <Rect x={0.5} y={4.5} width={22} height={14} rx={1.5} stroke={props.theme} />
      <Path stroke={props.theme} d="M9 1H14V4H9z" />
      <Path
        d="M6 19h4a1 1 0 011 1v8a1 1 0 01-1 1H7a1 1 0 01-1-1v-9z"
        fill={props.theme}
      />
      <Rect x={2} y={21} width={3} height={6} rx={1} fill={props.theme} />
      <Rect
        x={19}
        y={24}
        width={3}
        height={6}
        rx={1}
        transform="rotate(-90 19 24)"
        fill={props.theme}
      />
      <Path
        d="M13 20a1 1 0 011-1h4v9a1 1 0 01-1 1h-3a1 1 0 01-1-1v-8z"
        fill={props.theme}
      />
      <Path fill={props.theme} d="M10 19H15V25H10z" />
      <Rect x={9} y={7} width={4} height={6} rx={1} fill={props.theme} />
      <Rect x={16} y={7} width={4} height={6} rx={1} fill={props.theme} />
    </Svg>
);
export default FlavorBotLogoBNW;
