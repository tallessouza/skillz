#!/usr/bin/env node
'use strict';

/**
 * Plan Mode Enforcer — UserPromptSubmit hook
 *
 * Detects development intent in user prompts and injects a plan mode reminder.
 * Lightweight nudge — never blocks, just reminds.
 *
 * Exit 0 = allow (always), output = injected context.
 */

// Keywords that signal development intent (case-insensitive)
const DEV_INTENT_PATTERNS = [
  /\bimplementa/i,
  /\bcriar?\b/i,
  /\bbuild\b/i,
  /\bdevelop/i,
  /\bfeature\b/i,
  /\brefactor/i,
  /\bconstru/i,
  /\bcodificar/i,
  /\bescrever?\s+(código|code|função|function|componente|component)/i,
  /\badicionar?\s+(rota|route|endpoint|página|page|módulo|module)/i,
  /\bsetup\b/i,
  /\bconfigurar?\b/i,
  /\bmigra/i,
  /\bintegra/i,
  /\b\*develop\b/i,
  /\b\*task\b/i,
];

// Keywords that signal NON-development intent (exempt from plan mode)
const EXEMPT_PATTERNS = [
  /\b\*help\b/i,
  /\b\*status\b/i,
  /\b\*exit\b/i,
  /\b\*coverage/i,
  /\b\*prioritize\b/i,
  /\bo\s+que\s+[eé]/i,      // "o que é X?"
  /\bonde\s+fica/i,          // "onde fica Y?"
  /\bexplica/i,              // "explica X"
  /\bmostra/i,               // "mostra X"
  /\bleia?\b/i,              // "lê o arquivo"
  /\bcommit\b/i,
  /\bpush\b/i,
  /\bgit\s+(status|log|diff|branch)/i,
  /^\/\w/,                   // slash commands
  /^@\w/,                    // agent activation
];

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('error', (e) => reject(e));
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => {
      try { resolve(JSON.parse(data)); }
      catch (e) { reject(e); }
    });
  });
}

async function main() {
  try {
    const input = await readStdin();
    const prompt = (input.prompt || '').trim();

    if (!prompt || prompt.length < 5) {
      process.exit(0);
      return;
    }

    // Check exemptions first
    const isExempt = EXEMPT_PATTERNS.some(p => p.test(prompt));
    if (isExempt) {
      process.exit(0);
      return;
    }

    // Check for development intent
    const hasDev = DEV_INTENT_PATTERNS.some(p => p.test(prompt));
    if (!hasDev) {
      process.exit(0);
      return;
    }

    const message = `<plan-mode-required>
REGRA #0: Esta tarefa requer PLAN MODE antes de qualquer implementação.
→ Use EnterPlanMode ANTES de escrever código
→ O plano deve incluir: Skills Map + arquivos afetados + sequência de passos
→ Consulte skills relevantes E faça web research (EXA/Context7) durante o planejamento
→ Só saia do plan mode quando o plano estiver completo
</plan-mode-required>`;

    process.stdout.write(message);
    process.exit(0);
  } catch (err) {
    // Never block the user
    process.exit(0);
  }
}

main();
