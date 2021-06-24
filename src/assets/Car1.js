import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg width={60} height={46} viewBox="0 0 60 46" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 6.125A5.625 5.625 0 015.625.5h33.75A5.625 5.625 0 0145 6.125v26.25h-3.75V6.125a1.875 1.875 0 00-1.875-1.875H5.625A1.875 1.875 0 003.75 6.125v26.25a1.875 1.875 0 001.875 1.875V38A5.625 5.625 0 010 32.375V6.125zM16.875 34.25h22.5V38h-22.5v-3.75z"
        fill="#FAEC45"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M41.25 11.75h7.575a5.626 5.626 0 014.387 2.111l5.554 6.938A5.625 5.625 0 0160 24.316v8.059A5.625 5.625 0 0154.375 38h-3.75v-3.75h3.75a1.875 1.875 0 001.875-1.875v-8.063c0-.425-.146-.838-.413-1.17l-5.55-6.937a1.875 1.875 0 00-1.462-.705H45v16.875h-3.75V11.75zm-30 30a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zm0 3.75a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
        fill="#FAEC45"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M45 41.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zm0 3.75a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
        fill="#FAEC45"
      />
    </Svg>
  );
}

export default SvgComponent;
