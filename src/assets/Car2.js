import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg width={57} height={40} viewBox="0 0 57 40" fill="none" {...props}>
      <Path
        d="M.875 8.75H25.25l1.875 3.75H2.75L.875 8.75zm2.5 7.5H27.75L29.625 20H5.25l-1.875-3.75zM44 36.25a3.745 3.745 0 003.75-3.75A3.745 3.745 0 0044 28.75a3.745 3.745 0 00-3.75 3.75A3.745 3.745 0 0044 36.25zm3.75-22.5H41.5V20h11.15l-4.9-6.25zM19 36.25a3.745 3.745 0 003.75-3.75A3.745 3.745 0 0019 28.75a3.745 3.745 0 00-3.75 3.75A3.745 3.745 0 0019 36.25zM49 10l7.5 10v12.5h-5c0 4.15-3.35 7.5-7.5 7.5a7.49 7.49 0 01-7.5-7.5h-10c0 4.15-3.375 7.5-7.5 7.5a7.49 7.49 0 01-7.5-7.5h-5v-8.75h5v3.75h1.9A7.533 7.533 0 0119 25c2.225 0 4.225.975 5.6 2.5h11.9V5h-30c0-2.775 2.225-5 5-5h30v10H49z"
        fill="#FFC700"
      />
    </Svg>
  );
}

export default SvgComponent;