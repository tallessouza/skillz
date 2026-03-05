# Code Examples: Instalando e Configurando Git no Linux

## Instalacao por distro

### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install git
```

### Fedora
```bash
sudo dnf install git
```

### Arch Linux
```bash
sudo pacman -S git
```

### openSUSE
```bash
sudo zypper install git
```

## Verificacao completa

```bash
# Verificar versao
git --version

# Verificar todas as configuracoes
git config --list

# Verificar configuracoes especificas
git config user.name
git config user.email
```

## Configuracao basica (como mostrado na aula)

```bash
# Nome do usuario
git config --global user.name "Mayk Brito"

# Email (mesmo do GitHub)
git config --global user.email "mayk@exemplo.com"
```

## Configuracoes adicionais uteis

```bash
# Definir editor padrao
git config --global core.editor "code --wait"

# Definir branch padrao como main
git config --global init.defaultBranch main

# Ver onde as configs estao salvas
git config --list --show-origin
```

## Configuracao por repositorio (sem --global)

```bash
cd meu-projeto/
git config user.name "Nome Profissional"
git config user.email "email@empresa.com"
```

Util quando o email do trabalho e diferente do email pessoal do GitHub.

## Troubleshooting

### Git nao encontrado apos instalar
```bash
# Verificar se esta no PATH
which git
# Deve retornar /usr/bin/git

# Se nao encontrar, adicionar ao PATH
export PATH=$PATH:/usr/bin
```

### Atualizar Git para versao mais recente (Ubuntu)
```bash
sudo add-apt-repository ppa:git-core/ppa
sudo apt-get update
sudo apt-get install git
```