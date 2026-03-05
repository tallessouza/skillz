# Code Examples: Instalando Git no Windows

## Verificar arquitetura do Windows

No menu iniciar, buscar "System Information" ou "Informacoes do Sistema". Procurar por "System Type":
- `x64-based PC` → 64-bit (mais comum)
- `x86-based PC` → 32-bit (raro hoje em dia)
- `ARM64` → ARM (em maquinas virtuais ou Surface com ARM)

## Download

URL direta: `https://git-scm.com/download/win`

O site detecta automaticamente a arquitetura e sugere a versao correta.

## Verificar instalacao

```bash
# No Git Bash
git -v
# Saida esperada: git version 2.x.x
```

## Configurar credenciais

```bash
# Nome (usado nos commits)
git config --global user.name "Seu Nome Completo"

# E-mail (DEVE ser o mesmo do GitHub)
git config --global user.email "seuemail@exemplo.com"
```

**Atencao:** Nao ha espaco entre `--global` (e um unico argumento com dois hifens). O instrutor nota que a documentacao pode mostrar com espaco incorretamente.

## Verificar configuracao

```bash
# Ver todas as configs
git config --list

# Ver configs individuais
git config --global user.name
git config --global user.email
```

## Alterar credenciais depois

Se precisar mudar o e-mail ou nome depois, basta rodar o mesmo comando novamente — ele sobrescreve o valor anterior:

```bash
git config --global user.email "novoemail@exemplo.com"
```

## Onde ficam as configs?

O `--global` salva em `~/.gitconfig` (no home do usuario). No Windows com Git Bash, isso geralmente e `C:\Users\SeuUsuario\.gitconfig`.

```bash
# Ver o arquivo diretamente
cat ~/.gitconfig
```

## Troubleshooting

### Git nao reconhecido no CMD/PowerShell

Se `git -v` funciona no Git Bash mas nao no CMD:
```bash
# Opcao 1: Usar Git Bash (recomendado)
# Opcao 2: Reinstalar Git e marcar "Add to PATH" durante instalacao
```

### E-mail errado nos commits

```bash
# Verificar e-mail atual
git config --global user.email

# Corrigir
git config --global user.email "emailcorreto@exemplo.com"
```

Commits antigos com e-mail errado NAO sao corrigidos automaticamente — apenas novos commits usarao o e-mail atualizado.