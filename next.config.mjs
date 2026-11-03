import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

/** Keep production builds from replacing assets used by a running dev server. */
export default function config(phase) {
  return {
    output: 'standalone',
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
  };
}
