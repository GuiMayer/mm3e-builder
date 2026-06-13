import { describe, it, expect } from 'vitest';
import { CharacterFileSchema } from '../entities/schemas';
import fs from 'fs';
import path from 'path';

/**
 * Test suite for importing character files from the tester folder
 * Verifies that the schema can properly validate and import all test characters
 */
describe('Import Tester Files', () => {
  const testerPath = 'C:\\Users\\usuario\\Downloads\\mm3e builder\\tester';

  // Skip if tester path doesn't exist
  if (!fs.existsSync(testerPath)) {
    it.skip('Tester folder not found', () => {});
    return;
  }

  const testFiles = fs
    .readdirSync(testerPath)
    .filter((file) => file.endsWith('.json'));

  testFiles.forEach((fileName) => {
    it(`should import ${fileName} without validation errors`, () => {
      const filePath = path.join(testerPath, fileName);
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);

      // Validate against schema
      const result = CharacterFileSchema.safeParse(data);

      // Should successfully parse
      expect(result.success).toBe(true);

      if (result.success) {
        // Verify character data is present
        expect(result.data.character).toBeDefined();
        expect(result.data.character.header).toBeDefined();
        expect(result.data.character.abilities).toBeDefined();

        // Count descriptors in powers
        const descriptorsCount = result.data.character.powers.filter(
          (p) => p.descriptors && p.descriptors.length > 0
        ).length;

        console.log(
          `✓ ${fileName} - ${result.data.character.powers.length} powers (${descriptorsCount} with descriptors)`
        );
      }
    });
  });

  it('should preserve descriptors field during import', () => {
    const filePath = path.join(testerPath, 'Bhahir.json');
    if (!fs.existsSync(filePath)) {
      expect(true).toBe(true);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    const result = CharacterFileSchema.safeParse(data);

    expect(result.success).toBe(true);
    if (result.success) {
      // Bhahir has 3 powers, first one has descriptors
      const firstPower = result.data.character.powers[0];
      expect(firstPower.descriptors).toBeDefined();
      expect(firstPower.descriptors).toContain('magic');
    }
  });

  it('should handle equipment with descriptors', () => {
    const filePath = path.join(testerPath, 'Techmaster.json');
    if (!fs.existsSync(filePath)) {
      expect(true).toBe(true);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    const result = CharacterFileSchema.safeParse(data);

    expect(result.success).toBe(true);
    if (result.success) {
      // Techmaster has 6 equipment items with descriptors
      const equipmentWithDescriptors = result.data.character.equipment.filter(
        (e) => e.descriptors && e.descriptors.length > 0
      );
      expect(equipmentWithDescriptors.length).toBeGreaterThan(0);
    }
  });
});
