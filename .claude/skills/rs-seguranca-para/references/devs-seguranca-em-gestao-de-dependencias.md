---
name: rs-seguranca-devs-gestao-dependencias
description: "Enforces dependency security management practices when setting up projects, adding packages, or auditing vulnerabilities. Use when user asks to 'add a dependency', 'check vulnerabilities', 'audit packages', 'setup dependency tracking', or 'secure dependencies'. Applies SBOM generation, Dependency Track setup, language-specific audit tools, and continuous monitoring patterns. Make sure to use this skill whenever installing packages or reviewing project security posture. Not for static code analysis, authentication, or infrastructure hardening."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: infrastructure-security
  tags: [security, dependencies, npm-audit, sbom]
---

# Gestao de Dependencias Seguras

> Dependencias sem monitoramento continuo sao portas abertas — vulnerabilidades novas surgem a qualquer momento, mesmo em pacotes considerados seguros hoje.

## Rules

1. **Monitore continuamente** — nunca confie que uma dependencia segura hoje sera segura amanha, porque vulnerabilidades sao descobertas constantemente e exigem verificacao automatizada
2. **Use software para monitorar** — monitoramento manual nao escala, configure ferramentas que rodem auditorias automaticamente a cada 24h no minimo
3. **Combine ferramentas locais e centralizadas** — use audit local (pip-audit, npm audit) para feedback imediato ao dev + ferramenta centralizada (Dependency Track) para monitoramento continuo de todos os projetos
4. **Gere SBOM padronizado** — exporte dependencias no formato CycloneDX (JSON/XML), porque e o formato padrao aceito por ferramentas de gestao de dependencias
5. **Prefira falsos positivos a falsos negativos** — ative matching agressivo (CPE + PURL) e trate falsos positivos manualmente, porque uma vulnerabilidade real nao reportada e pior
6. **Nao envie codigo, envie dependencias** — Dependency Track analisa listas de dependencias (SBOM), nao codigo fonte

## How to write

### Setup Dependency Track (Docker Compose)

```bash
# Baixar e subir Dependency Track
mkdir dt && cd dt
curl -LO https://dependencytrack.org/docker-compose.yml
docker compose up -d

# Acesso: http://localhost:8080 (admin/admin, trocar senha imediatamente)
# Logs: /var/lib/docker/volumes/dt-trackdata/_data/
```

### Gerar SBOM (Python)

```bash
# Instalar ferramentas de exportacao
pip install pipdeptree cyclonedx-bom

# Gerar arvore de dependencias (visualizacao)
pipdeptree --freeze > requirements-tree.txt

# Gerar SBOM no formato CycloneDX
cyclonedx-py -r --format json -o sbom.json
```

### Audit local (Python)

```bash
pip install pip-audit
pip-audit  # Executa auditoria contra banco de vulnerabilidades
```

### Audit local (Node.js)

```bash
npm audit
# ou
npx auditjs ossi  # alternativa com Sonatype OSS Index
```

## Example

**Before (projeto sem monitoramento):**
```bash
# Dev instala pacote antigo e nunca mais verifica
pip install django==4.0
# Meses depois: 10+ vulnerabilidades criticas acumuladas
# Equipe so descobre quando atacada
```

**After (com gestao de dependencias):**
```bash
# Dev instala e audita localmente
pip install django==4.0
pip-audit
# ALERTA: django 4.0 tem vulnerabilidades criticas (CVE-...)
# Correcao: pip install django>=4.2

# Dependency Track monitora continuamente
# Equipe recebe email quando nova vulnerabilidade surge
# Mesmo em projetos legados em manutencao
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Adicionou nova dependencia | Rodar audit local antes de commitar |
| Projeto em producao/legado | Configurar Dependency Track com alertas por email |
| Projeto multi-linguagem | Dependency Track centralizado + audit local por linguagem |
| Vulnerabilidade critica encontrada | Atualizar imediatamente, verificar breaking changes |
| Falso positivo no Dependency Track | Marcar como falso positivo na interface, nao ignorar silenciosamente |
| Precisa de chave NVD API | Cadastrar em https://nvd.nist.gov/ (gratuito, necessario para mirroring) |

## Anti-patterns

| Never do | Do instead |
|----------|------------|
| Monitorar dependencias manualmente | Configurar ferramenta automatizada (Dependency Track, pip-audit) |
| Ignorar alertas de vulnerabilidade | Triar cada alerta: corrigir, mitigar ou marcar falso positivo |
| Enviar codigo fonte para Dependency Track | Enviar apenas SBOM (lista de dependencias) |
| Usar feed NVD direto (deprecated) | Ativar mirroring via API com chave registrada |
| Confiar que "hoje esta seguro" | Assumir que vulnerabilidades serao descobertas amanha |
| Ter so ferramenta local OU so centralizada | Ter ambas: local para feedback rapido, centralizada para monitoramento continuo |

## Troubleshooting

### Configuracao ou implementacao nao funciona como esperado
**Symptom:** Comportamento inesperado ao aplicar as regras desta skill
**Cause:** Configuracao parcial ou conflito com outras regras de seguranca
**Fix:** Verifique que todas as regras foram aplicadas em conjunto. Consulte o deep-explanation.md para entender o raciocinio completo do instrutor.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-seguranca-em-gestao-de-dependencias/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-seguranca-em-gestao-de-dependencias/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
