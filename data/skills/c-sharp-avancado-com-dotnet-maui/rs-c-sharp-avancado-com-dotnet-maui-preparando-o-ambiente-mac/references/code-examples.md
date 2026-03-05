# Code Examples: Ambiente Mac para .NET MAUI

## Comandos executados no terminal

### Verificar se .NET esta instalado

```bash
dotnet --version
# Se nao instalado: "command not found"
# Se instalado: "9.0.200" (ou versao similar)
```

### Instalar MAUI workload

```bash
# SEM sudo — vai falhar com erro de permissao
dotnet workload install maui
# Erro: "permission denied" ou similar

# COM sudo — correto
sudo dotnet workload install maui
# Solicita senha do Mac
# Faz download e instalacao de multiplos componentes
```

### Verificar workloads instalados

```bash
dotnet workload list
# Deve mostrar "maui" na lista
```

### Verificar Xcode

```bash
xcode-select -p
# /Applications/Xcode.app/Contents/Developer

xcode-select --install
# Instala command line tools se necessario
```

### Verificar Mono

```bash
mono --version
# Mono JIT compiler version 6.12.0.206 (ou similar)
```

## Ordem completa de instalacao

```bash
# 1. Xcode → App Store (GUI)
# 2. .NET SDK → Instalador .pkg (GUI)

# 3. MAUI Workload (Terminal)
sudo dotnet workload install maui

# 4. Rider → Instalador .dmg (GUI, drag to Applications)

# 5. Mono → Instalador .pkg (GUI)
```

## Otimizacao de tempo (paralelismo)

```
Terminal: sudo dotnet workload install maui  ← deixar rodando
Browser: baixar Rider .dmg simultaneamente   ← ~1.8 GB
Browser: baixar Mono .pkg simultaneamente    ← ~370 MB
```

Enquanto o workload instala no terminal, os downloads do Rider e Mono podem acontecer em paralelo pelo navegador.