# Code Examples: Atualização Baseada na Minor

## Exemplo da aula: Express ^3.19.0

### Estado inicial

```json
// package.json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "dependencies": {
    "express": "^3.19.0"
  }
}
```

### Listar versões compatíveis

```bash
# Ver todas as versões do express na série 3.x
npm view express versions --json

# Saída inclui: "3.19.0", "3.19.1", "3.20.0", "3.21.0", "3.21.1", "3.21.2", etc.
```

### Executar atualização

```bash
# Instalar/atualizar express para a mais recente compatível com ^3.19.0
npm i express
```

### Estado final

```json
// package.json — após npm i express
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "dependencies": {
    "express": "^3.21.2"
  }
}
```

## Variações do mesmo padrão

### Com múltiplas dependências

```json
// package.json
{
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.0",
    "dotenv": "^16.0.0"
  }
}
```

```bash
# Atualizar todas para a mais recente compatível
npm i express cors dotenv

# Ou atualizar todas de uma vez
npm update
```

### Fixar versão exata (quando necessário)

```bash
# Instalar versão exata sem caret
npm i express@4.18.2 --save-exact

# Resultado no package.json:
# "express": "4.18.2"  (sem ^)
```

### Verificar o que seria atualizado antes de executar

```bash
# Ver quais dependências estão desatualizadas
npm outdated

# Saída:
# Package   Current  Wanted  Latest  Location
# express   3.19.0   3.21.2  4.21.0  meu-projeto
#
# Current = instalada agora
# Wanted = mais recente dentro do range ^
# Latest = mais recente absoluta (pode ser major diferente)
```

### Usando tilde (~) em vez de caret (^)

```json
// Se package.json tiver:
{ "express": "~3.19.0" }

// npm i express atualizaria apenas para 3.19.x (patch)
// Não atualizaria para 3.20.0 ou 3.21.2
```

### Verificar versão efetivamente instalada

```bash
# Ver a versão instalada no node_modules
npm ls express

# Saída:
# meu-projeto@1.0.0
# └── express@3.21.2
```