---
name: rs-seguranca-devs-sast
description: "Applies SAST (Static Application Security Testing) practices when setting up code analysis, CI pipelines, or security tooling. Use when user asks to 'add security scanning', 'setup static analysis', 'integrate SAST', 'find vulnerabilities in code', or 'configure SonarQube/Bandit'. Guides tool selection between language-specific and generic analyzers, integration in git hooks and CI. Make sure to use this skill whenever configuring code security analysis or choosing SAST tools. Not for runtime security, WAF configuration, or penetration testing."
---

# SAST — Static Application Security Testing

> Sempre tenha pelo menos duas camadas de analise estatica: uma ferramenta especifica da linguagem (rapida, git hooks) e uma generica centralizada (CI, visibilidade do time).

## Rules

1. **Use ferramenta especifica da linguagem nos git hooks** — Bandit (Python), ESLint security plugins (JS/TS), Brakeman (Ruby), porque sao rapidas e nao precisam de configuracao, o dev recebe feedback antes do commit
2. **Use ferramenta generica no CI** — SonarQube, Semgrep, ou similar, porque captura o que o dev esqueceu e centraliza a gestao de riscos para o time todo
3. **Exclua dependencias/vendor do scan** — ignore `node_modules/`, `venv/`, `.venv/`, `vendor/`, porque gera ruido e demora desnecessaria
4. **Bloqueie commits com severity HIGH/CRITICAL** — configure o git hook para impedir commit quando a ferramenta encontrar issues criticas, porque a camada humana falha
5. **SAST nao substitui revisao humana** — regras de negocio, access control e logica de autorizacao nao sao detectaveis por ferramentas, porque dependem de contexto de dominio
6. **Projeto multi-linguagem = uma ferramenta por linguagem + uma generica** — 3 linguagens = 3 ferramentas especificas + 1 SonarQube, porque cada ferramenta conhece melhor os padroes da sua linguagem

## How to configure

### Ferramenta especifica (exemplo: Bandit para Python)

```bash
# Instalar
pip install bandit

# Rodar no diretorio do codigo (nao no venv)
bandit -r src/ -f html -o bandit-report.html

# Git hook (pre-commit)
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/PyCQA/bandit
    rev: 1.7.5
    hooks:
      - id: bandit
        args: ["-r", "src/", "--severity-level", "high"]
```

### Ferramenta generica (exemplo: SonarQube via Docker)

```bash
# Subir SonarQube
docker run -d --name sonarqube -p 9000:9000 sonarqube:community

# Instalar scanner Python
pip install pysonar-scanner

# Rodar analise (token gerado na UI do SonarQube)
sonar-scanner \
  -Dsonar.projectKey=my-project \
  -Dsonar.sources=src/ \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=YOUR_TOKEN
```

## Decision framework

| Situacao | Ferramenta | Onde roda |
|----------|-----------|-----------|
| Feedback rapido ao dev | Especifica da linguagem (Bandit, ESLint) | Git hook pre-commit |
| Visibilidade do time | Generica (SonarQube, Semgrep) | Pipeline CI |
| Projeto pessoal simples | So a especifica ja basta | Local |
| Equipe com varios devs | Ambas obrigatoriamente | Hook + CI |

## Example

**Vulnerabilidades que SAST detecta:**

```python
# SQL Injection — concatenacao de string em query
query = "SELECT * FROM users WHERE username = '" + username + "'"  # DETECTADO

# Hash inseguro — MD5 para seguranca
hashlib.md5(password.encode())  # DETECTADO

# Request sem timeout — risco de DDoS
requests.get(url)  # DETECTADO — sempre use timeout

# Cliente sincrono em funcao async
async def get_data():
    return requests.get(url)  # DETECTADO — use httpx ou aiohttp
```

**Vulnerabilidades que SAST NAO detecta:**
- Regras de negocio incorretas (quem pode ver o que)
- Falhas de access control por logica
- Problemas de autorizacao entre tenants

## Heuristics

| Situacao | Acao |
|----------|------|
| Bandit encontrou severity LOW | Avaliar caso a caso, nao bloquear commit |
| SonarQube mostra Security Hotspot | Revisar manualmente e classificar como safe/unsafe |
| Ferramenta nao encontrou nada | Nao significa que o codigo e seguro — SAST e camada extra, nao garantia |
| Novo dev entrou no time | Garantir que o hook local esta configurado na maquina dele |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Depender so de SAST para seguranca | SAST + code review humano + testes |
| Rodar SAST no venv/node_modules | Excluir pastas de dependencias do scan |
| Ignorar todos os findings de uma vez | Revisar cada finding e documentar decisao |
| Rodar SAST so no CI | Rodar tambem no pre-commit para feedback rapido |
| Usar so ferramenta generica | Adicionar tambem a especifica da linguagem |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
