export const LOGO_PATH = "M610 1240 l0 -120 190 0 c105 0 190 -3 190 -8 0 -4 -85 -93 -190 -197 l-190 -190 -78 78 -77 77 -168 0 c-92 0 -167 -2 -167 -4 0 -6 483 -486 490 -486 3 0 61 56 130 125 69 69 129 125 135 125 6 0 91 -81 190 -180 l180 -180 170 0 170 0 -270 270 -270 270 270 270 270 270 -488 0 -487 0 0 -120z";
export function Logo({ size = 26, color = "#00E05A" }: { size?: number; color?: string }) {
  return <svg viewBox="0 0 184 163" width={size} height={Math.round(size * 163 / 184)} aria-hidden="true"><g transform="translate(0,163) scale(0.1,-0.1)" fill={color}><path d={LOGO_PATH} /></g></svg>;
}
