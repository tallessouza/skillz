# Skill Validation Report

Generated: 2026-03-08T01:13:45-03:00

## Summary

| Router | Total | Pass | Warn | Fail | Rate |
|--------|-------|------|------|------|------|
| rs-clean-code | 21 | 18 | 0 | 3 | 85% |
| **TOTAL** | **21** | **18** | **0** | **3** | |

## Gate Failure Breakdown

| Gate | Fails | Description |
|------|-------|-------------|
| G01 | 0 | Missing frontmatter |
| G02 | 0 | Missing name: field |
| G03 | 0 | Name not kebab-case |
| G04 | 0 | Name > 64 chars |
| G05 | 0 | Missing description: |
| G06 | 0 | Description < 200 chars |
| G07 | 1 | No 3rd person verb |
| G08 | 0 | Missing 'Make sure to use' |
| G09 | 0 | Missing 'Not for' boundary |
| G10 | 0 | Multi-line description |
| G11 | 0 | Angle brackets in description |
| G12 | 0 | Missing metadata: block |
| G13 | 0 | Missing metadata.author |
| G14 | 0 | Missing metadata.version |
| G15 | 0 | Missing metadata.course |
| G16 | 0 | Missing metadata.tags |
| G17 | (warn only) | Over 300 lines |
| G18 | 2 | No code examples |
| G19 | 0 | Missing Troubleshooting |
| G20 | 0 | Missing Deep reference library |
| G21 | 0 | Contains fluff |
| G22 | 1 | Missing main content section |

## Detailed Failures

FAILURES_START
FAIL rs-clean-code/numeros-magicos.md
  FAIL G07: Description doesn't start with 3rd person verb

FAIL rs-clean-code/o-que-e-ou-nao-e-clean-code.md
  FAIL G18: No code examples found
  FAIL G22: Missing main content section (## Rules / ## Steps / ## Key concept)

FAIL rs-clean-code/principios-do-codigo-limpo.md
  FAIL G18: No code examples found


FAILURES_END
