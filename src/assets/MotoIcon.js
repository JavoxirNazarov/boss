import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg width={66} height={50} viewBox="0 0 66 50" fill="none" {...props}>
      <Path
        d="M2.654 15.427h8.479a2.657 2.657 0 012.653 2.655v9.76h3.172c-.177-.641-.242-1.397-.199-2.277.069-3.716.743-6.849 2.005-9.31.98-1.91 2.122-3.056 3.103-3.741-1.151-1.184-1.817-2.868-1.817-4.81 0-3.494 2.788-6.337 6.214-6.337 3.426 0 6.213 2.843 6.213 6.337a.732.732 0 01-.732.733h-.498a5.086 5.086 0 01-4.016 5.826c.244.905.365 1.972.365 3.185l1.827 1.572 4.445.36 5.127-1.696c.47-.156 1.002-.333 1.464 0 .456.33.456.904.456 1.093v3.813a.732.732 0 01-.733.732h-.872l1.338 4.621a.733.733 0 01-1.408.408l-1.455-5.03h-2.082c2.59 7.898 1.112 13.17-1.16 18.505h1.317l5.484-6.131-1.16-4.006a.732.732 0 111.408-.407l1.109 3.832a7.367 7.367 0 017.28 5.71.732.732 0 01-.55.878l-1.039.239c.266 2.759-1.551 5.362-4.322 6a5.564 5.564 0 01-4.23-.713 5.567 5.567 0 01-2.278-2.795l-.82.189c-.245.056-.477.085-.708-.04a.84.84 0 01-.413-.562 7.289 7.289 0 01-.118-.729H20.185c-.49 3.046-3.081 5.342-6.176 5.342s-5.686-2.296-6.176-5.342h-.56l-.135.001c-.21 0-.512-.023-.76-.276a.939.939 0 01-.26-.712c.02-.688.124-1.352.3-1.984-.583-3.542-.022-5.699.81-7.387a1.928 1.928 0 01-.875-1.614v-2.013h-3.7A2.657 2.657 0 010 26.651v-8.569a2.657 2.657 0 012.654-2.655zm37.963 30.56a4.108 4.108 0 003.124.526 4.15 4.15 0 003.208-4.239l-7.944 1.829a4.116 4.116 0 001.612 1.884zm-3.665-2.917l11.393-2.621c-.879-2.408-3.245-4.002-5.831-3.864l-5.581 6.24c.005.082.011.164.02.245zM25.89 30.307c.213.561.213 1.252.213 2.21v2.763h2.682v-3.792c0-4.287-2.34-5.05-3.39-5.177h-7.18c.029.973.248 1.665.665 2.104.486.511 1.317.76 2.54.762l2.63.003c.937 0 1.557.379 1.84 1.127zm.213 6.438v1.749h5.223c-.059-.543-.228-.962-.505-1.253-.413-.432-.994-.496-1.304-.496h-3.414zm-7.856-11.898h6.66c.268-.842.507-1.764.703-2.711l-2.025-1.314c-1.106-.718-1.68-1.733-1.578-2.784.09-.931.724-1.763 1.613-2.12.812-.325 1.686-.223 2.458.271a8.643 8.643 0 00-.353-1.857 5.156 5.156 0 01-.927-.182 6.066 6.066 0 01-1.71-.678c-1.41.843-4.513 3.577-4.841 11.375zM30.959 6.972c-.346-2.34-2.32-4.14-4.695-4.14-2.619 0-4.749 2.186-4.749 4.872 0 2.185 1.048 3.946 2.737 4.721V8.571c0-.667.256-1.485 1.472-1.596a.72.72 0 01.066-.003h5.169zM29.852 9.28c0-.29-.033-.572-.097-.844h-3.929c-.045.005-.078.01-.102.015a.873.873 0 00-.007.12v4.284c.175.026.35.039.526.039h.005a3.615 3.615 0 003.604-3.614zm.95 11.32l-1.735-.14a.733.733 0 01-.419-.175l-3.13-2.693h-.001c-.303-.261-.626-.395-.94-.395-.14 0-.28.026-.413.08-.387.155-.662.51-.7.903-.049.494.277.996.917 1.412l3.489 2.264h2.932v-1.256zm3.095.25l-1.63-.131v1.137h1.894c.246 0 .306-.204.313-.375.004-.097-.005-.584-.577-.63zm1.734-.505a2.143 2.143 0 01.27 1.505v.006h3.549v-2.78l-3.822 1.263.003.006zm-1.474 2.976h-6.504a.732.732 0 01-.398-.118l-.332-.215a28.66 28.66 0 01-.539 2.038c1.494.441 3.865 1.866 3.865 6.461v3.865a3.057 3.057 0 011.63.876c.536.56.842 1.321.916 2.265h1.477c1.489-4.291 2.055-8.857-.115-15.172zM32.95 41.824c.27-.623.532-1.243.777-1.865h-7.604c-.986 0-1.486-.45-1.486-1.334v-5.377h-5.781a.732.732 0 110-1.464h5.776c-.01-.416-.036-.757-.113-.957-.036-.098-.068-.183-.47-.183l-2.63-.002c-1.647-.002-2.826-.4-3.602-1.219-.036-.037-.07-.077-.105-.117H7.818v2.013a.47.47 0 00.463.465h7.292a.732.732 0 110 1.465H8.712c-.58 1.074-1.1 2.411-1.069 4.523a7.92 7.92 0 016.457-3.307c2.138 0 4.144.84 5.65 2.362a8.068 8.068 0 012.302 5l10.898-.003zm-18.941 5.344c2.29 0 4.22-1.65 4.688-3.877H9.32c.467 2.227 2.398 3.877 4.688 3.877zm-5.52-5.341H20.58c-.36-3.312-3.129-5.897-6.48-5.897-2.944 0-5.415 1.94-6.234 4.657l-.008.026a6.76 6.76 0 00-.242 1.214h.872zM1.465 26.65c0 .657.533 1.19 1.189 1.19h9.667V24.06H1.465v2.592zm0-4.057H12.32v-1.558H1.465v1.558zm0-3.022H12.32v-1.49a1.19 1.19 0 00-1.188-1.19h-8.48a1.19 1.19 0 00-1.188 1.19v1.49zM66 25l-9.375-6.25v3.367H50v5.766h6.625v3.367L66 25z"
        fill="#FFC700"
      />
    </Svg>
  );
}

export default SvgComponent;
