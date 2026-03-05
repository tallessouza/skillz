# Deep Explanation: Configuração Centralizada de API

## Por que centralizar a URL base?

O instrutor usa uma analogia prática: imagine que sua API muda de porta (de 3333 para 4000). Se a URL está espalhada em 15 arquivos diferentes, você precisa encontrar e alterar todos os 15. Com a configuração centralizada, muda em um único lugar.

Isso é o princípio DRY (Don't Repeat Yourself) aplicado à configuração de infraestrutura.

## A pasta `services/` como camada de abstração

O instrutor escolhe o nome `services` porque representa exatamente o que a API faz para a aplicação: **serve funcionalidades**. Não é `api/` (genérico demais), não é `network/` (baixo nível demais). É `services/` porque cada arquivo dentro representa um serviço que a API provê.

Essa convenção é comum em projetos React/React Native e cria uma separação clara:
- `components/` → UI
- `services/` → comunicação com API
- `screens/` ou `pages/` → telas

## Por que separar config de consumo?

O arquivo `api.js` contém APENAS a configuração. Os serviços específicos (`schedules.js`, `users.js`) importam essa configuração e adicionam a lógica de cada recurso.

Benefícios:
1. **Reuso**: todos os serviços compartilham a mesma base
2. **Flexibilidade**: cada serviço define seu próprio recurso/endpoint
3. **Manutenção**: mudança de ambiente (dev → prod) em um único lugar

## HTTP vs HTTPS

O instrutor faz uma distinção importante:
- **`http://`** — usado para APIs locais (desenvolvimento)
- **`https://`** — usado para APIs remotas (produção)

Em produção, SEMPRE use HTTPS. O HTTP só é aceitável em localhost durante desenvolvimento.

## baseURL termina na porta, sem barra final

A URL base é `http://localhost:3333` (sem `/` no final). O recurso é adicionado na hora do consumo com template literal:

```javascript
`${apiConfig.baseURL}/schedules`
```

Isso mantém a composição limpa e previsível. Se a base tivesse `/` no final e o recurso também começasse com `/`, teríamos `//` na URL.

## Interpolação com template literals

O instrutor demonstra o uso de template literals do JavaScript para compor URLs:

```javascript
`${apiConfig.baseURL}/recurso`
```

Isso é preferível à concatenação com `+` porque:
- Mais legível
- Menos propenso a erros de espaço/barra
- Padrão moderno do JavaScript