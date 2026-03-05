# Code Examples: Corrigindo Simuladores iOS no Rider

## Navegacao no terminal

```bash
# Entrar na pasta Downloads
cd ~/Downloads

# Limpar a tela do terminal
clear
# Ou usar atalho: Ctrl + L

# Listar arquivos na pasta
ls
```

## Comando de importacao

```bash
# Sintaxe geral
xcodebuild -importPlatform <NomeDaImagem.dmg>

# Exemplo concreto com iOS 18.2
xcodebuild -importPlatform iOS_18.2_Simulator_Runtime.dmg
```

### Detalhes do comando

- `xcodebuild`: ferramenta CLI do Xcode
- `-importPlatform`: flag para importar um Simulator Runtime (atencao ao P maiusculo — e case-sensitive)
- O argumento e o caminho para o arquivo `.dmg` baixado
- Dica: usar Tab para autocompletar o nome do arquivo

## Links uteis

```
# Criar conta Apple Developer (gratuita)
https://developer.apple.com/register/profile/

# Pagina de downloads (requer login)
https://developer.apple.com/download/all/

# Filtro direto para iOS Simulator Runtime
https://developer.apple.com/download/all/?q=iOS%20Simulator%20Runtime

# Download direto do iOS 18.2 Simulator Runtime
https://download.developer.apple.com/Developer_Tools/iOS_18.2_Simulator_Runtime/iOS_18.2_Simulator_Runtime.dmg
```

## Verificacao pos-instalacao

```
Xcode → Settings → Components:
  ✓ iOS 18.2 Simulator (deve aparecer na lista)

Rider → Device Selector:
  ✓ iPhone 15, iPhone 16 Pro, etc. (devem aparecer)
```

## Limpeza pos-instalacao

```bash
# Opcional: deletar o .dmg apos importacao bem-sucedida
rm ~/Downloads/iOS_18.2_Simulator_Runtime.dmg
```