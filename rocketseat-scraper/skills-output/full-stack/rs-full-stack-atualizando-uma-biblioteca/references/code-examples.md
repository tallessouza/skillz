# Code Examples: Atualizando Uma Biblioteca

## Exemplo 1: Atualizar Express para a ultima versao

Comando executado pelo instrutor:

```bash
npm i express@latest
```

Resultado no terminal: a versao do Express subiu automaticamente no package.json de `4.19.0` para `4.21.1`.

### O que acontece internamente

1. O npm consulta o registry para resolver a tag `latest` para um numero de versao
2. Baixa o pacote na versao resolvida
3. Atualiza `node_modules/express`
4. Atualiza a entrada no `package.json`
5. Atualiza o `package-lock.json`

## Exemplo 2: Reverter para versao anterior

```bash
npm i express@4.19.0
```

Isso reinstala exatamente a versao 4.19.0, sobrescrevendo a versao que estava instalada.

## Variacoes e cenarios adicionais

### Atualizar outros pacotes comuns

```bash
# Atualizar cors para a ultima versao
npm i cors@latest

# Atualizar nodemon como devDependency para a ultima versao
npm i -D nodemon@latest

# Atualizar typescript para a ultima versao
npm i -D typescript@latest
```

### Instalar versao com tag especifica

```bash
# Instalar versao beta (se disponivel)
npm i express@next

# Instalar versao canary
npm i react@canary
```

### Verificar a versao instalada apos atualizar

```bash
# Ver versao de um pacote especifico
npm list express

# Ver apenas pacotes de nivel raiz
npm list --depth=0
```

### Fluxo completo: verificar, atualizar, validar

```bash
# 1. Verificar quais pacotes estao desatualizados
npm outdated

# 2. Atualizar o pacote desejado
npm i express@latest

# 3. Verificar se a versao foi atualizada
npm list express

# 4. Testar a aplicacao
npm start

# 5. Se algo quebrou, reverter
npm i express@4.19.0
```

### Comparacao de comandos de atualizacao

```bash
# Atualiza DENTRO do range semver do package.json
npm update express

# Atualiza para a ULTIMA versao absoluta (ignora range)
npm i express@latest

# Atualiza TODOS os pacotes dentro dos ranges
npm update

# Atualiza TODOS para latest (cuidado!)
npx npm-check-updates -u && npm install
```