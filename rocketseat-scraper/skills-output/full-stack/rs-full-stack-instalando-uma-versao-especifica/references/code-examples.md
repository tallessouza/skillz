# Code Examples: Instalando Versao Especifica de Pacotes NPM

## Instalacao basica com versao

```bash
# Formato geral
npm install <nome-do-pacote>@<versao>

# Exemplos reais
npm install json-server@1.0.0-alpha.23
npm install express@4.18.2
npm install typescript@5.3.3
```

## Verificando versoes disponiveis

```bash
# Todas as versoes publicadas
npm view json-server versions

# Apenas a versao mais recente
npm view json-server version

# Informacoes detalhadas (inclui data de publicacao)
npm view json-server time
```

## Verificando o que foi instalado

```bash
# Ver versao instalada de um pacote especifico
npm list json-server

# Ver todas as dependencias com versoes
npm list --depth=0
```

## Exemplo completo do fluxo mostrado na aula

```bash
# 1. Verificar versao atual instalada
cat package.json
# "json-server": "^1.0.0-alpha.24"  (versao mais recente instalada antes)

# 2. Instalar a versao especifica do curso
npm install json-server@1.0.0-alpha.23

# 3. Confirmar que mudou
cat package.json
# "json-server": "^1.0.0-alpha.23"  (versao alinhada com o instrutor)
```

## Versoes com rotulos (tags)

```bash
# Versoes alpha/beta/rc sao comuns
npm install pacote@1.0.0-alpha.1
npm install pacote@2.0.0-beta.3
npm install pacote@3.0.0-rc.1

# Instalar pela tag (latest, next, canary)
npm install pacote@latest
npm install pacote@next
```

## Consultando o npmjs.com

1. Acesse `https://www.npmjs.com/package/{nome-do-pacote}`
2. Clique na aba **Versions**
3. Identifique a versao desejada pela data ou numero
4. Use o comando `npm install pacote@versao` com o numero exato

## Troubleshooting

```bash
# Se a versao nao existe
npm install pacote@99.99.99
# npm ERR! No matching version found for pacote@99.99.99

# Se voce nao lembra a versao exata
npm view pacote versions --json | grep "1.0"
# Filtra versoes que contem "1.0"

# Forcar reinstalacao da mesma versao
npm install pacote@1.0.0 --force
```