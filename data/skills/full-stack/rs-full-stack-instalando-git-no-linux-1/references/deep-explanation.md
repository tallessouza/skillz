# Deep Explanation: Instalando e Configurando Git no Linux

## Por que configurar email e nome e critico

O instrutor enfatiza que a configuracao `user.email` e o que vincula seus commits locais ao seu perfil no GitHub. Quando voce faz `git push`, o GitHub usa o email do commit para associar aquele commit ao seu usuario. Se o email local nao bater com o email do GitHub, seus commits aparecem como "fantasmas" — sem vinculo ao perfil.

### Ordem importa

1. Primeiro instala o Git
2. Depois configura nome e email
3. So entao comeca a trabalhar com repositorios

Essa ordem garante que todo commit feito na maquina ja tera a identidade correta desde o inicio.

## Flag --global

O `--global` aplica a configuracao para todos os repositorios do usuario na maquina. Sem essa flag, a configuracao seria apenas para o repositorio atual (util quando se trabalha com emails diferentes para projetos pessoais e profissionais).

Hierarquia de configuracao Git:
- `--system` → todos os usuarios da maquina (`/etc/gitconfig`)
- `--global` → todos os repos do usuario (`~/.gitconfig`)
- `--local` → apenas o repo atual (`.git/config`)

## Sobre distros diferentes

O instrutor menciona que o comando `sudo apt-get install git` e especifico para Ubuntu/Debian. Outras distros usam gerenciadores de pacotes diferentes:

- **Fedora:** `sudo dnf install git`
- **Arch:** `sudo pacman -S git`
- **openSUSE:** `sudo zypper install git`

A documentacao oficial do Git cobre todas as distros.

## Maquina virtual como ambiente de demonstracao

O instrutor usou uma maquina virtual Ubuntu para simular o ambiente Linux. Isso e uma pratica comum em cursos para demonstrar instalacao em ambientes limpos sem afetar a maquina principal.