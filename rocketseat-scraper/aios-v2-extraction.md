# AIOS v2 Architecture Extraction (legendsagents/.aios-core)

> Extraído em 2026-02-27 para informar a pipeline Rocketseat Transcrições → Skills

---

## 1. CORE ARCHITECTURE

### 1.1 Constitution (`constitution.md`)

Documento supremo (~170 linhas) com 6 princípios non-negotiable enforced via quality gates.

| Principle | Level | Gate |
|---|---|---|
| CLI First | NON-NEGOTIABLE | `dev-develop-story.md` (WARN if UI before CLI) |
| Agent Authority | NON-NEGOTIABLE | Defined via agent .md files |
| Story-Driven Development | MUST | `dev-develop-story.md` (BLOCK if no story) |
| No Invention | MUST | `spec-write-spec.md` (BLOCK if spec invents) |
| Quality First | MUST | `pre-push.md` (BLOCK if any check fails) |
| Absolute Imports | SHOULD | ESLint rule |

**Gate Severity Levels:**
- BLOCK: Impede execution, requires correction
- WARN: Allows continuation with alert
- INFO: Reports only

**Agent Authority Table (Constitutional Exclusives):**
```
git push      → @devops only
PR creation   → @devops only
Release/Tag   → @devops only
Story creation → @sm, @po only
Architecture decisions → @architect only
Quality verdicts → @qa only
```

### 1.2 Core Config — Key Patterns

```yaml
markdownExploder: true
lazyLoading:
  enabled: true
  heavySections: [pvMindContext, squads, registry]

decisionLogging:
  enabled: true
  async: true
  location: .ai/
  format: adr  # Architecture Decision Record

projectStatus:
  autoLoadOnAgentActivation: true
  showInGreeting: true
  cacheTimeSeconds: 60

boundary:
  frameworkProtection: true
  protected:
    - .aios-core/core/**
    - .aios-core/development/tasks/**
    - .aios-core/development/templates/**
  exceptions:
    - .aios-core/data/**
    - .aios-core/development/agents/*/MEMORY.md
```

---

## 2. DEV AGENT (Dex) — Full Configuration

### 2.1 Identity

```yaml
agent:
  name: Dex
  id: dev
  title: Full Stack Developer
  icon: 💻
  whenToUse: 'Use for code implementation, debugging, refactoring'

persona_profile:
  archetype: Builder
  zodiac: '♒ Aquarius'
  communication:
    tone: pragmatic
    emoji_frequency: medium
```

### 2.2 Activation Protocol (5 Steps)

1. Read ENTIRE agent .md file
2. Adopt persona from `agent` and `persona` sections
3. Display greeting using native context (zero JS execution)
   - GREENFIELD GUARD: If no git repo, skip branch display, suggest `*environment-bootstrap`
   - Read unconsumed handoff from `.aios/handoffs/`
   - Look up position in `workflow-chains.yaml`, suggest next command
   - Mark artifact as `consumed: true`
4. Display assembled greeting
5. HALT and await user input

### 2.3 Command Set

**Story Development:**
- `*develop {story-id}` — Interactive mode (default)
- `*develop-yolo` — Autonomous mode
- `*develop-preflight` — Planning first, then execute

**ADE Coder Agent:**
- `*execute-subtask {subtask-id}` — 13-step Coder Agent workflow
- `*verify-subtask` — Verify via command/api/browser/e2e

**Recovery:**
- `*track-attempt` — Register in `recovery/attempts.json`
- `*rollback` — Rollback to last good state
- Max 3 retries → auto-escalate to human

**Build System:**
- `*build-autonomous {story-id}` — Coder Agent Loop with retries
- `*build {story-id}` — Full pipeline: worktree → plan → execute → verify → merge
- `*build-resume {story-id}` — Resume from checkpoint

**Gotchas Memory:**
- `*gotcha {title} - {description}` — Add gotcha manually
- `*gotchas [--category X]` — List/search gotchas
- `*gotcha-context` — Get relevant gotchas for current task

**Worktree Isolation:**
- `*worktree-create/list/cleanup/merge {story-id}`

### 2.4 develop-story Workflow

```
Read task → Implement Task and subtasks → Write tests → Execute validations →
Only if ALL pass → Update checkbox [x] → Update File List →
Repeat until complete
```

**Story File Update Restrictions — Dev ONLY touches:**
- Tasks/Subtasks Checkboxes
- Dev Agent Record (Debug Log, Completion Notes, File List, Change Log, Status)

**NEVER modifies:** Status, Story, Acceptance Criteria, Dev Notes, Testing sections.

**HALT conditions:**
- Unapproved dependencies needed
- Ambiguous after story check
- 3 failures on same implementation
- Missing config
- Failing regression

### 2.5 Git Restrictions

```yaml
allowed:  git add, commit, status, diff, log, branch, checkout, merge
blocked:  git push, git push --force, gh pr create, gh pr merge
```

### 2.6 Self-Healing CodeRabbit Loop

```yaml
coderabbit_integration:
  self_healing:
    type: light
    max_iterations: 2
    timeout_minutes: 15
    trigger: story_completion
    severity_filter: [CRITICAL]
    behavior:
      CRITICAL: auto_fix     # Fix and re-check (max 2x)
      HIGH: document_only
      MEDIUM: ignore
      LOW: ignore
```

If CRITICAL remains after 2 iterations → HALT, DO NOT mark complete.

### 2.7 Decision Logging (YOLO Mode)

All autonomous decisions logged:
- Description, timestamp, reason, alternatives
- Files created/modified/deleted
- Tests and results
- Git hash before execution (rollback point)
- Performance metrics

Output: `.ai/decision-log-{story-id}.md`

### 2.8 AutoClaude Capability Matrix

```yaml
autoClaude:
  version: '3.0'
  execution:
    canCreatePlan: false    # Architect's job
    canCreateContext: false
    canExecute: true
    canVerify: true
    selfCritique:
      enabled: true
      checklistRef: story-dod-checklist.md
  recovery:
    canTrack: true
    canRollback: true
    maxAttempts: 3
    stuckDetection: true
  memory:
    canCaptureInsights: true
    canExtractPatterns: false
```

### 2.9 Agent MEMORY.md

Persistent per-agent memory:
- `Active Patterns`: Verified patterns for this agent/project
- `Promotion Candidates`: Same pattern in 3+ agents → candidate for CLAUDE.md
- `Archived`: Patterns no longer relevant

---

## 3. HOOKS SYSTEM (Observability)

### 3.1 Hook Files (All Python)

| Hook | Event | Purpose |
|---|---|---|
| `pre_tool_use.py` | Before tool call | Capture tool + inputs |
| `post_tool_use.py` | After tool call | Capture results |
| `user_prompt_submit.py` | User sends prompt | Capture prompt |
| `stop.py` | Claude stops | Capture stop event |
| `subagent_stop.py` | Subagent stops | Capture termination |
| `pre_compact.py` | Before compaction | Capture pre-compact |

### 3.2 Architecture

```python
data = json.load(sys.stdin)       # Read event from Claude
data = enrich_event(data)         # Add project, agent, story context
send_event("EventType", data)     # POST to monitor server
```

**Enrichment adds:** project name, agent ID, story ID (from env vars or regex detection)

**Delivery:** POST to `localhost:4001/events`, 500ms timeout, **silent fail always**.

### 3.3 Truncation Limits

- Tool inputs: 500 chars/field
- Tool results: 1000 chars total
- User prompts: 1000 chars

---

## 4. SUBAGENT / ORCHESTRATION SYSTEM

### 4.1 SubagentPromptBuilder

Builds prompts from REAL task files:
1. Load complete agent definition (.md)
2. Load complete task definition (.md)
3. Extract and load referenced checklists (from frontmatter)
4. Extract and load referenced templates
5. Build context from previous phases
6. Assemble complete prompt

### 4.2 AgentInvoker

```javascript
const SUPPORTED_AGENTS = {
  pm:        { capabilities: ['planning', 'coordination', 'story-management'] },
  architect: { capabilities: ['design', 'architecture', 'technical-decisions'] },
  dev:       { capabilities: ['implementation', 'coding', 'debugging'] },
  qa:        { capabilities: ['testing', 'quality', 'validation'] },
  devops:    { capabilities: ['deployment', 'infrastructure', 'ci-cd'] },
  // ...
}
```

Flow: `invokeAgent() → validateAgent() → loadTask() → buildContext() → executeWithRetry() → validateOutput()`

Statuses: SUCCESS, FAILED, TIMEOUT, SKIPPED

### 4.3 MasterOrchestrator

State machine: `INITIALIZED → READY → IN_PROGRESS → BLOCKED → COMPLETE`

Epics pipeline:
- Epic 3: Spec/Requirements
- Epic 4: Planning/Implementation
- Epic 5: Recovery/Retry
- Epic 6: QA/Validation

### 4.4 GateEvaluator

Verdicts: APPROVED, NEEDS_REVISION (loop back), BLOCKED (halt)

```javascript
epic3_to_epic4: {
  blocking: true, minScore: 3.0,
  checks: ['spec_exists', 'complexity_assessed', 'requirements_defined']
}
epic4_to_epic6: {
  blocking: true, requireTests: true,
  checks: ['plan_complete', 'implementation_exists', 'no_critical_errors']
}
```

### 4.5 RecoveryHandler

Strategies:
- `RETRY_SAME_APPROACH`
- `ROLLBACK_AND_RETRY`
- `SKIP_PHASE`
- `ESCALATE_TO_HUMAN`
- `TRIGGER_RECOVERY_WORKFLOW`

Max retries: 3 → auto-escalate.

---

## 5. WORKFLOW INTELLIGENCE (WIS)

### 5.1 Wave Analyzer

Uses **Kahn's topological sort** to detect parallel execution opportunities.

```
analyzeWaves() → buildDependencyGraph() → findCycle() → kahnWaveAnalysis() → findCriticalPath()
```

Output: waves (parallel task groups), critical path, optimization gain %.

Default durations (min): read-story=5, setup-branch=2, implement=30, write-tests=10, run-tests=5, review-qa=15.

### 5.2 Suggestion Engine (3-Tier)

1. **Runtime-first** (git status, story status) → deterministic, highest priority
2. **Pattern matching** (workflow-patterns.yaml) → confidence-scored
3. **Learned boost** → successful past sequences get confidence boost

```javascript
occurrenceBoost = Math.min(occurrences * 0.02, 0.1)
successBoost = successRate * 0.05
totalBoost = 0.15 + above  // Max ~0.35
```

5-min cache keyed on: `agentId|lastCommand|storyPath|branch`

### 5.3 Pattern Learning

```
PatternCapture   → Captures command sequences from sessions
PatternValidator → Validates (min length, known commands)
PatternStore     → Persists to learned-patterns.yaml
GotchaRegistry   → Tracks bugs/traps by context
```

---

## 6. ELICITATION SYSTEM

### 6.1 ElicitationEngine

Uses `inquirer` for interactive CLI. Features:

**Progressive disclosure:**
```javascript
{ field: 'taskId', operator: 'equals'|'notEquals'|'includes'|'exists', value }
```

**Smart defaults:**
```javascript
{ type: 'fromAnswer', source: 'fieldName', transform: fn }
{ type: 'generated', generator: 'kebabCase'|'timestamp'|'version' }
{ type: 'conditional', condition, ifTrue, ifFalse }
```

**Security:** Blocks eval(), Function(), `<script`, javascript: patterns. ReDoS-safe regex.

**Session persistence:** Saves after each step to `.aios-sessions/{type}-{timestamp}.json`

### 6.2 Task Creation Wizard (7 Steps)

1. Basic Info (id, title, agent, description)
2. Context & Prerequisites
3. Workflow type (sequential/conditional/iterative/parallel)
4. Define Steps (dynamic)
5. Output & Success Criteria
6. Error Handling (fail-fast/collect/retry/fallback)
7. Security & Validation

---

## 7. MONITOR SYSTEM

Sidecar server on `localhost:4001` receiving events from hooks.

```
Claude Code → Python Hooks → POST /events → Monitor Server
```

Event envelope:
```json
{
  "type": "PostToolUse",
  "timestamp": 1709123456789,
  "data": {
    "tool_name": "Write",
    "project": "legendsagents",
    "aios_agent": "dev",
    "aios_story_id": "story-8.1"
  }
}
```

---

## 8. QUALITY GATES (3 Layers)

```
Layer 1: Pre-commit (fast, local)
  ├── lint (60s timeout)
  ├── test (5min, 80% coverage min)
  └── typecheck (2min)

Layer 2: PR Automation
  ├── CodeRabbit (block CRITICAL, warn HIGH)
  └── QA Agent (block CRITICAL, warn HIGH+MEDIUM)

Layer 3: Human Review
  ├── requireSignoff: true
  ├── defaultReviewer: @architect
  └── signoff expiry: 24h
```

---

## 9. WORKFLOW CHAINS (Cross-Agent)

**Story Development Cycle:**
```
@sm *draft → @po *validate-story-draft → @dev *develop → @qa *review → @devops *push
```

**QA Loop (max 5 iterations):**
```
@qa *review → @dev *apply-qa-fixes → @qa *review (repeat)
```

**Spec Pipeline:**
```
@pm *gather-requirements → @architect *analyze-impact → @analyst *research →
@pm *write-spec → @qa *critique-spec → @architect *plan
```

**Brownfield Discovery (10-phase):**
```
@architect *analyze-brownfield → @data-engineer *db-schema-audit →
@ux *audit-frontend → @qa *review → @pm *create-epic
```

Handoff artifacts in `.aios/handoffs/` enable stateful cross-session continuity.

---

## 10. NOVEL PATTERNS (Key Innovations)

### 10.1 Handoff Artifacts + Workflow Chain Lookup
Agents leave YAML in `.aios/handoffs/`. Next agent reads, looks up `workflow-chains.yaml`, suggests next command. Stateful cross-session continuity.

### 10.2 Agent MEMORY.md + Cross-Agent Promotion
Pattern in 3+ agents → promotion candidate → elevate to CLAUDE.md. Self-improving docs.

### 10.3 13-Step Coder Protocol
Steps 5.5 and 6.5 are self-critique phases. No step skippable — violations trigger HALT.

### 10.4 Self-Healing CodeRabbit Loop
Story complete → CodeRabbit → auto-fix CRITICAL → re-run (max 2x). If persists → HALT.

### 10.5 Wave Analysis (Kahn's Algorithm)
Topological sort to find parallelizable tasks. Calculates critical path and optimization gain %.

### 10.6 3-Tier Suggestion Engine
Runtime signals (deterministic) > Pattern matching (scored) > Learned boost (historical).

### 10.7 Constitution → Gate Mapping
Every constitutional principle maps to a gate with severity (BLOCK/WARN/INFO).

### 10.8 Self-Contained Agent Files
All config in one .md. Dependencies lazy-loaded on command invocation only. Zero startup overhead.

### 10.9 Greenfield Guard
Every agent detects "no git repo" → skips git ops → suggests `*environment-bootstrap`.

### 10.10 AutoClaude v3.0 Capability Matrix
Per-agent `canCreatePlan`, `canExecute`, `canVerify`, `selfCritique`, `recovery` formal contract.

---

## 11. APPLICATION TO SKILLS PIPELINE

| Pattern | How to Apply |
|---------|-------------|
| 13-Step Protocol | Skills with mandatory implementation steps |
| Self-Critique Checkpoints | Agent verifies own code against skill rules |
| Recovery/Rollback | "Se falhar, faça X" built into skill |
| Capability Matrix | Skill defines what agent CAN/CANNOT do under that lens |
| Wave Analysis | Complex skills with parallelizable tasks |
| Handoff Pattern | Skills that produce artifacts for next skill |
| Constitution Gates | Skill rules mapped to severity levels |
| Agent MEMORY | Skills that learn from repeated usage |

---

## Pipeline Context: Rocketseat Transcrições → Skills

**Estado atual:**
- Task `lesson-to-skill` v2.0 criada em `.aios-core/development/tasks/lesson-to-skill.md`
- Piloto validado: `rs-nomenclatura-de-variaveis` em `.claude/skills/`
- Framing: lente ativa de desenvolvimento (regras → como escrever → heurísticas → anti-patterns)
- Próximo: escalar para ~4,740 aulas via batch workflow
- 37 cursos com ~34.8M chars de transcrições disponíveis em `transcricoes/`
