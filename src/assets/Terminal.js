import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40" fill="none" {...props}>
      <Path
        d="M36.484 17.578H24.922V3.594A3.52 3.52 0 0021.406.078H3.516A3.52 3.52 0 000 3.594v32.812a3.52 3.52 0 003.516 3.516h17.89a3.52 3.52 0 003.516-3.516v-1.484h11.562A3.52 3.52 0 0040 31.406V21.094a3.52 3.52 0 00-3.516-3.516zm0 2.344c.646 0 1.172.526 1.172 1.172v1.484H24.922v-2.656h11.562zM22.578 36.406c0 .646-.526 1.172-1.172 1.172H3.516a1.173 1.173 0 01-1.172-1.172V3.594c0-.646.525-1.172 1.172-1.172h17.89c.646 0 1.172.526 1.172 1.172v32.812zm13.906-3.828H24.922v-7.656h12.734v6.484c0 .646-.526 1.172-1.172 1.172z"
        fill="#333"
      />
      <Path
        d="M8.65 22.271a1.172 1.172 0 10-2.299.458 1.172 1.172 0 002.298-.458zM13.15 21.526a1.173 1.173 0 00-1.8 1.203 1.172 1.172 0 101.8-1.203zM18.65 22.271a1.172 1.172 0 10-2.3.46 1.172 1.172 0 002.3-.46zM8.65 27.271a1.171 1.171 0 10-2.299.457 1.171 1.171 0 002.298-.457zM13.15 26.526c-.867-.571-1.993.17-1.8 1.203a1.173 1.173 0 101.8-1.203zM18.65 27.271a1.172 1.172 0 10-.809 1.35c.611-.2.916-.777.809-1.35zM8.649 32.271a1.171 1.171 0 10-2.298.457 1.171 1.171 0 002.298-.457zM13.151 31.526a1.171 1.171 0 10-1.302 1.948 1.171 1.171 0 001.302-1.948zM18.65 32.271a1.172 1.172 0 10-2.3.46 1.172 1.172 0 002.3-.46zM18.75 5.078H6.25c-.647 0-1.172.525-1.172 1.172v10c0 .647.525 1.172 1.172 1.172h12.5c.647 0 1.172-.525 1.172-1.172v-10c0-.647-.525-1.172-1.172-1.172zm-1.172 10H7.422V7.422h10.156v7.656z"
        fill="#333"
      />
    </Svg>
  );
}

export default SvgComponent;