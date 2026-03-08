# Code Examples: Gerenciamento de Dependências — Introdução

## Instalação com versão fixa (contexto de aprendizado)

O padrão usado ao longo do curso para garantir reprodutibilidade:

```bash
# Formato: npm i <pacote>@<versão-exata>
npm i express@4.21.1
```

O `@` seguido do número da versão garante que exatamente aquela versão será instalada, independente de versões mais novas existirem.

### Resultado no package.json

```json
{
  "dependencies": {
    "express": "4.21.1"
  }
}
```

Sem o prefixo `^` ou `~`, a versão é exatamente `4.21.1`. Isso significa que qualquer pessoa que rode `npm install` neste projeto obterá essa versão específica.

## Comparação: com e sem versão fixa

### Com versão fixa (usado no curso)
```bash
npm i express@4.21.1
# Instala exatamente 4.21.1
# package.json: "express": "4.21.1"
```

### Sem versão fixa (padrão do npm)
```bash
npm i express
# Instala a versão mais recente disponível
# package.json: "express": "^4.21.1" (com caret)
# O ^ permite atualizações minor/patch automáticas
```

## Cenário: projeto legado em empresa

Ao clonar um projeto existente em uma empresa, você pode encontrar:

```json
{
  "dependencies": {
    "express": "4.17.1",
    "mongoose": "5.13.2",
    "jsonwebtoken": "8.5.1"
  }
}
```

Essas versões podem estar "desatualizadas" comparadas às mais recentes, mas o projeto funciona com elas. Atualizar requer planejamento — não é simplesmente trocar os números.

## Cenário: projeto novo

Ao criar um projeto do zero, faz sentido usar versões recentes:

```bash
# Verificar a versão mais recente
npm view express version

# Instalar a versão mais recente
npm i express
```

Isso dá acesso às melhorias, correções de segurança e novas funcionalidades mais recentes.

## Cenário: atualização que quebra código

Exemplo conceitual de como uma atualização pode exigir refatoração:

```javascript
// Antes (versão antiga da biblioteca)
const result = library.oldMethod(data)

// Depois da atualização (método foi renomeado ou removido)
const result = library.newMethod(data)  // refatoração necessária
```

O módulo subsequente vai ensinar como identificar e lidar com essas situações concretamente.