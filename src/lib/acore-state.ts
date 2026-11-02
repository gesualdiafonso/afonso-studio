/**
 * Live state shared between sections and the persistent A-CORE.
 * Plain mutable refs read every frame by the 3D scene — writing to them never
 * re-renders React. Sections write; the stage/canvas only read.
 *
 *  explode: 0 = assembled · 1 = separated into its four frame modules
 *  focus:   index of the highlighted frame module (see frameSegments), -1 = none
 *  assembly: -1 = off (assembled) · 0…5 = Process stages assembling the core
 */
export const acoreState = {
  explode: { current: 0 },
  focus: { current: -1 },
  assembly: { current: -1 },
};

export function resetACoreState() {
  acoreState.explode.current = 0;
  acoreState.focus.current = -1;
  acoreState.assembly.current = -1;
}
