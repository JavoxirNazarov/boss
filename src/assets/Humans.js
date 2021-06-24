import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg width={50} height={50} viewBox="0 0 50 50" fill="none" {...props}>
      <Path
        d="M39.257 16.406c-.286 3.972-3.232 7.032-6.445 7.032s-6.164-3.06-6.445-7.032c-.293-4.132 2.575-7.031 6.445-7.031s6.738 2.975 6.445 7.031z"
        stroke="#FFC700"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M32.812 29.688c-6.364 0-12.484 3.16-14.017 9.317-.203.814.307 1.62 1.144 1.62h25.747c.837 0 1.345-.806 1.145-1.62-1.533-6.255-7.653-9.318-14.019-9.318z"
        stroke="#FFC700"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
      <Path
        d="M19.532 18.158c-.229 3.172-2.61 5.67-5.176 5.67-2.566 0-4.951-2.497-5.176-5.67-.233-3.3 2.084-5.658 5.176-5.658s5.41 2.419 5.176 5.658z"
        stroke="#FFC700"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.118 29.883c-1.763-.808-3.704-1.119-5.762-1.119-5.078 0-9.97 2.525-11.196 7.442-.161.65.247 1.294.915 1.294H15.04"
        stroke="#FFC700"
        strokeWidth={2}
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default SvgComponent;
