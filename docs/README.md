# Documentation guide

## Current release

The current application release is **v1.11.0** (2026-08-16). Its principal
changes are the Resource library, Targeted Effects, safer Draft persistence and
transfer, Power Builder/rule refinements, centralized identity, and the
selectable-text PDF workflow. See the [changelog](../CHANGELOG.md) for the
complete release record.

## Current references

- [Refined architecture](./ARCHITECTURE_REFINED.md) is the authoritative guide for product scope, module boundaries, persistence, import/export compatibility, and verification gates.
- [Project README](../README.md) describes the user-facing capabilities and local setup.
- [Contributing guide](../CONTRIBUTING.md) explains translation and data contributions.
- [Changelog](../CHANGELOG.md) records released changes and work awaiting release.
- [Future expansions](../FUTURE_EXPANSIONS.md) records deferred product work and
  distinguishes it from functionality delivered in v1.11.0.
- [Test suite guide](../src/__tests__/README.md) explains how to run and extend tests.

## Historical records

The following files preserve prior plans, audits, sprint notes, and implementation conversations. They are useful for context, but do not describe the current codebase or feature status:

- `ARCHITECTURE.md` and `ARCHITECTURE_PT.md`
- `sprints.md`
- `Refactoring Power Builder Architecture.md` and `MiMoChat.md`
- `INDICE_AUDITORIA.md`, `AUDITORIA_COMPLETA_MM3E.md`, `RESUMO_EXECUTIVO.md`, and `audit/`
- `FUNCIONALIDADES-AUSENTES-POWER-BUILDER.md`
- `architecture-refactor-baseline.md` (the pre-refactor verification snapshot)
- `validation-summary.md` and `testing/rules-coverage-report.md`

## Rule references

- `sources/` contains source material for M&M 3e rules.
- `REGRAS_CALCULO_MM3E.md` and `modifiers-checklist.md` are rule-oriented references. Verify proposed code changes against the JSON data and tests as well as these documents.
