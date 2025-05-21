import type { Config } from "@react-router/dev/config";

/**
 * The default configuration for React Router.
 *
 * @remarks
 * This configuration is used by React Router unless you provide a custom
 * configuration.
 *
 * @property {boolean} ssr - Whether to use server-side rendering (SSR).
 *     Defaults to `true`.
 */
export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
} satisfies Config;
