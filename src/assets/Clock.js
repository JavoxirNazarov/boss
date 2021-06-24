import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg width={38} height={44} viewBox="0 0 38 44" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.917 6.448V4.25h-2.084V.083h8.334V4.25h-2.084v2.198c3.616.4 6.922 1.827 9.619 3.984l3.488-3.504 2.953 2.94-3.495 3.51a18.67 18.67 0 014.102 11.705c0 10.356-8.395 18.75-18.75 18.75S.25 35.44.25 25.083c0-9.65 7.292-17.599 16.667-18.635zM19 39.667c8.054 0 14.583-6.53 14.583-14.584C33.583 17.03 27.054 10.5 19 10.5S4.417 17.03 4.417 25.083c0 8.055 6.529 14.584 14.583 14.584zm2.083-12.5v-12.5h-4.166v12.5h4.166z"
        fill="#FFC700"
      />
    </Svg>
  );
}

export default SvgComponent;
