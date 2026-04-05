/* ================================================
   Application-wide constants
   ================================================ */

/**
 * Version of the character file schema.
 * Increment when the exported JSON structure changes in a breaking way.
 *
 * History:
 * - 1.0.0: Initial format (effectId + ranks + modifiers at power root level)
 * - 2.0.0: Multi-component format (components[] replaces flat effectId)
 */
export const SCHEMA_VERSION = '2.0.0';

/**
 * All schema versions that the application can import.
 * Files with unknown versions are rejected with a warning-level error.
 */
export const SUPPORTED_SCHEMA_VERSIONS: readonly string[] = ['1.0.0', '2.0.0'];
