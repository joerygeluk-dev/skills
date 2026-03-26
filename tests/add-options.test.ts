/**
 * Unit tests for parseAddOptions in add.ts
 *
 * Covers the three primary usage patterns:
 *   npx skills add coreyhaines31/marketingskills
 *   npx skills add coreyhaines31/marketingskills --skill page-cro copywriting
 *   npx skills add coreyhaines31/marketingskills --list
 */

import { describe, it, expect } from 'vitest';
import { parseAddOptions } from '../src/add.ts';

describe('parseAddOptions', () => {
  describe('install all skills', () => {
    it('parses owner/repo shorthand as source', () => {
      const { source, options } = parseAddOptions(['coreyhaines31/marketingskills']);
      expect(source).toEqual(['coreyhaines31/marketingskills']);
      expect(options.skill).toBeUndefined();
      expect(options.list).toBeUndefined();
    });
  });

  describe('install specific skills with --skill', () => {
    it('collects multiple skill names after --skill', () => {
      const { source, options } = parseAddOptions([
        'coreyhaines31/marketingskills',
        '--skill',
        'page-cro',
        'copywriting',
      ]);
      expect(source).toEqual(['coreyhaines31/marketingskills']);
      expect(options.skill).toEqual(['page-cro', 'copywriting']);
      expect(options.list).toBeUndefined();
    });

    it('collects a single skill name after --skill', () => {
      const { source, options } = parseAddOptions([
        'coreyhaines31/marketingskills',
        '--skill',
        'page-cro',
      ]);
      expect(source).toEqual(['coreyhaines31/marketingskills']);
      expect(options.skill).toEqual(['page-cro']);
    });

    it('accepts -s as shorthand for --skill', () => {
      const { source, options } = parseAddOptions([
        'coreyhaines31/marketingskills',
        '-s',
        'page-cro',
        'copywriting',
      ]);
      expect(source).toEqual(['coreyhaines31/marketingskills']);
      expect(options.skill).toEqual(['page-cro', 'copywriting']);
    });
  });

  describe('list available skills with --list', () => {
    it('sets list flag when --list is passed', () => {
      const { source, options } = parseAddOptions(['coreyhaines31/marketingskills', '--list']);
      expect(source).toEqual(['coreyhaines31/marketingskills']);
      expect(options.list).toBe(true);
      expect(options.skill).toBeUndefined();
    });

    it('accepts -l as shorthand for --list', () => {
      const { source, options } = parseAddOptions(['coreyhaines31/marketingskills', '-l']);
      expect(source).toEqual(['coreyhaines31/marketingskills']);
      expect(options.list).toBe(true);
    });
  });

  describe('combined flags', () => {
    it('supports --global flag', () => {
      const { source, options } = parseAddOptions(['coreyhaines31/marketingskills', '--global']);
      expect(source).toEqual(['coreyhaines31/marketingskills']);
      expect(options.global).toBe(true);
    });

    it('supports --yes flag', () => {
      const { source, options } = parseAddOptions(['coreyhaines31/marketingskills', '--yes']);
      expect(source).toEqual(['coreyhaines31/marketingskills']);
      expect(options.yes).toBe(true);
    });

    it('supports --all flag', () => {
      const { source, options } = parseAddOptions(['coreyhaines31/marketingskills', '--all']);
      expect(source).toEqual(['coreyhaines31/marketingskills']);
      expect(options.all).toBe(true);
    });
  });
});
