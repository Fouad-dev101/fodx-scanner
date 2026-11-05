import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  frame: string;
  accent: string;
}

/** FODX mark: four scan-frame corners around an X. */
export function FodxMark({ size = 32, frame, accent }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M4 14V8a4 4 0 0 1 4-4h6M34 4h6a4 4 0 0 1 4 4v6M44 34v6a4 4 0 0 1-4 4h-6M14 44H8a4 4 0 0 1-4-4v-6"
        stroke={frame}
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M17 17l14 14M31 17L17 31" stroke={accent} strokeWidth={3.5} strokeLinecap="round" />
    </Svg>
  );
}
