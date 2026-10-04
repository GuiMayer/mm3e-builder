/* ================================================
   Application-wide constants
   ================================================ */

/**
 * Version of the character file schema.
 * Increment when the exported format gains versioned features.
 *
 * History:
 * - 1.0.0: Initial format (effectId + ranks + modifiers at power root level)
 * - 2.0.0: Multi-component format (components[] replaces flat effectId)
 * - 2.1.0: Optional fixed campaign budget and advancement metadata
 * - 2.2.0: Optional remote portrait URL; image bytes are never embedded
 * - 2.3.0: Optional trait targets, circumstance modifiers and per-character power usage
 */
export const SCHEMA_VERSION = '2.3.0';

/**
 * All schema versions that the application can import.
 * Structurally compatible unknown versions are accepted with a warning.
 */
export const SUPPORTED_SCHEMA_VERSIONS: readonly string[] = ['1.0.0', '2.0.0', '2.1.0', '2.2.0', '2.3.0'];
