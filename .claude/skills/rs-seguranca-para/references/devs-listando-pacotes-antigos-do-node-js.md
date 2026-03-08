---
name: rs-seguranca-devs-listando-pacotes-antigos
description: "Applies Node.js dependency auditing with retire.js when user asks to 'check outdated packages', 'audit dependencies', 'find vulnerabilities in node_modules', 'scan npm packages', or 'secure my Node project'. Guides detection of outdated and vulnerable JavaScript packages using retire.js. Make sure to use this skill whenever reviewing Node.js project security or dependency health. Not for general code review, Python/Ruby dependency management, or application logic security."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: infrastructure-security
  tags: [security, npm, retire-js, vulnerability-scanning]
---

# Auditoria de Pacotes Node.js com Retire.js

> Identifique e reporte pacotes npm desatualizados e vulneraveis usando retire.js antes que atacantes os descubram no JavaScript exposto ao navegador.

## Rules

1. **Sempre audite dependencias npm** — projetos Node acumulam centenas de pacotes transitivos, cada um trazendo responsabilidade de manutencao e risco de vulnerabilidade
2. **Use retire.js para varredura** — `npx retire` ou instalacao global com `npm install -g retire`, porque ele cruza suas dependencias com um repositorio JSON de vulnerabilidades conhecidas
3. **Salve o relatorio em arquivo** — `retire 2>&1 > report.txt`, porque retire envia output para stderr e voce precisa redirecionar corretamente para manter registro
4. **Priorize projetos front-end** — JavaScript compilado e entregue ao navegador expoe dependencias ao atacante via DevTools, diferente de backend onde descobrir versoes exige mais esforco
5. **Trate com urgencia** — dependencias JavaScript expostas no client-side sao descobertas trivialmente, entao vulnerabilidades conhecidas devem ser corrigidas com pressa

## How to write

### Instalacao e execucao basica

```bash
# Instalar globalmente
npm install -g retire

# Entrar no projeto e rodar
cd /path/to/project
retire
```

### Salvando relatorio corretamente

```bash
# retire envia output para stderr, nao stdout
# Redirecionar stderr para stdout antes de salvar:
retire 2>&1 > report.txt

# Ou usar as opcoes nativas do retire para formato especifico
retire --outputformat json --outputpath report.json
```

### Exemplo de output

```
lodash 1.0.1 has known vulnerabilities: severity: medium
vue 2.7.16 has known vulnerabilities: severity: low
```

## Example

**Before (projeto sem auditoria):**
```bash
# Dev instala dependencias e nunca mais verifica
npm install
# Meses depois: centenas de pacotes desatualizados com CVEs conhecidas
```

**After (com retire.js no fluxo):**
```bash
npm install -g retire
cd my-project
retire 2>&1 > security-report.txt
# Analisa report, atualiza pacotes criticos, documenta decisoes
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto antigo sem manutencao recente | Rodar retire imediatamente e gerar relatorio |
| Projeto front-end (React, Vue, Angular) | Prioridade maxima — JS exposto ao cliente |
| Projeto backend Node.js | Importante mas menos urgente — dependencias nao sao diretamente visiveis |
| Severidade medium/high no relatorio | Atualizar ou substituir o pacote afetado |
| Severidade low no relatorio | Documentar, avaliar mitigacao, planejar atualizacao |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Ignorar dependencias transitivas | Auditar todo o node_modules com retire |
| Redirecionar saida com `> report.txt` apenas | Usar `2>&1 > report.txt` porque retire usa stderr |
| Assumir que backend esconde versoes | Verificar mesmo assim — tecnicas de fingerprinting existem |
| Rodar auditoria uma unica vez | Integrar no pipeline de CI/CD ou rodar periodicamente |
| Confiar que poucos pacotes instalados = poucas dependencias | Verificar — poucos pacotes diretos geram centenas de transitivos |

## Troubleshooting

### Configuracao ou implementacao nao funciona como esperado
**Symptom:** Comportamento inesperado ao aplicar as regras desta skill
**Cause:** Configuracao parcial ou conflito com outras regras de seguranca
**Fix:** Verifique que todas as regras foram aplicadas em conjunto. Consulte o deep-explanation.md para entender o raciocinio completo do instrutor.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-listando-pacotes-antigos-do-node-js/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-listando-pacotes-antigos-do-node-js/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
