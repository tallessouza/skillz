# Code Examples: Validacao Local Pre-Deploy

## Fluxo completo de preparacao

### 1. Download e setup do projeto

```bash
# Opcao A: Clone via git
git clone https://github.com/rocketseat-education/fullstack-adivinhe.git
cd fullstack-adivinhe

# Opcao B: Download manual
# Baixe o ZIP do GitHub, extraia, e navegue ate a pasta
cd fullstack-adivinhe
```

### 2. Instalacao de dependencias

```bash
# Instala todas as dependencias listadas no package.json
npm install

# Verificar que node_modules foi criada
ls node_modules
```

Saida esperada: pasta `node_modules` populada com as dependencias.

### 3. Executar em modo desenvolvimento

```bash
npm run dev
```

Saida esperada no terminal (projeto Vite):
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 4. Abrir no navegador

```
http://localhost:5173
```

Ou segure `Ctrl` e clique no link exibido no terminal — o navegador abre automaticamente.

## Comandos uteis para diagnostico

### Verificar se a porta esta em uso

```bash
# Linux/Mac
lsof -i :5173

# Windows
netstat -ano | findstr :5173
```

### Verificar versao do Node

```bash
node --version
# Deve ser compativel com o projeto (geralmente Node 18+)
```

### Limpar cache e reinstalar

```bash
# Se npm install falhar ou o projeto se comportar de forma estranha
rm -rf node_modules package-lock.json
npm install
```

### Verificar scripts disponiveis

```bash
# Ver todos os scripts definidos no package.json
npm run
```

Saida tipica para um projeto Vite:
```
Scripts available via `npm run-script`:
  dev
    vite
  build
    vite build
  preview
    vite preview
```

## Checklist pre-deploy

```bash
# 1. Dependencias instaladas
ls node_modules/.package-lock.json && echo "OK: node_modules existe"

# 2. Dev server funciona
npm run dev &
sleep 3
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
# Deve retornar 200

# 3. Build funciona (importante para deploy)
npm run build
ls dist/index.html && echo "OK: build gerada com sucesso"
```