# Deep Explanation: Nomes para Variáveis JavaScript

## Case-sensitivity em JavaScript

JavaScript diferencia maiúsculas de minúsculas. `username` e `userName` são variáveis completamente diferentes. Isso é fundamental porque:

- Um typo de capitalização cria uma variável nova silenciosamente
- Não gera erro — gera `undefined` quando você lê a variável errada
- É uma das fontes mais comuns de bugs para iniciantes

```javascript
let username = "rodrigo"
let userName = "ana"
// São duas variáveis distintas — JS não avisa
```

## Por que escrever em inglês?

O instrutor Rodrigo enfatiza que **mesmo em empresas brasileiras**, o padrão é inglês. Razões práticas:

1. **Elimina acentos automaticamente** — inglês não tem `ç`, `ã`, `é`
2. **Código universal** — qualquer dev no mundo lê seu código
3. **Consistência com APIs/libs** — todas as APIs são em inglês, misturar português gera `user.getNome()` que é horrível
4. **Aprendizado de vocabulário** — usar Google Tradutor para cada variável te ensina inglês gradualmente

### A dica do Google Tradutor

Não sabe como escrever "cadastrar" em inglês? Abre o Google Tradutor: `cadastrar → register`. Pronto. Você aprendeu uma palavra nova e sua variável ficou correta.

## camelCase — a corcunda do camelo

O nome vem da analogia visual: a letra maiúscula no meio da palavra parece a corcunda de um camelo.

```
productName
       ^— "corcunda"
```

### Regra mecânica:
1. Primeira palavra: toda minúscula
2. Palavras seguintes: primeira letra maiúscula
3. Sem espaços, sem underlines

### Por que é o padrão em JS?

- A linguagem em si usa camelCase: `getElementById`, `addEventListener`, `toString`
- Todos os frameworks (React, Vue, Angular) seguem camelCase
- É a convenção da comunidade — quebrar significa que seu código destoa

## snake_case — o rastejar da cobra

Tudo minúsculo, separado por `_` (underline). O instrutor faz a analogia com cobra rastejando — tudo no mesmo nível, rente ao chão.

```
product_name
first_name
last_name
```

### Quando usar em JS?
- Propriedades de objetos que mapeiam APIs externas (Python APIs usam snake_case)
- Constantes: `MAX_RETRY_COUNT` (UPPER_SNAKE_CASE)
- Arquivos: `user_controller.js` (alguns projetos adotam)

## Outros padrões mencionados

O instrutor mostrou uma tabela com vários padrões:

| Padrão | Formato | Uso em JS |
|--------|---------|-----------|
| camelCase | `productName` | Variáveis, funções (PRINCIPAL) |
| snake_case | `product_name` | Configs, objetos de API |
| PascalCase | `ProductName` | Classes, componentes React |
| kebab-case | `product-name` | CSS classes, URLs, nomes de arquivo |
| UPPER_SNAKE | `PRODUCT_NAME` | Constantes |

## O que JavaScript permite (mas você não deveria usar)

### Acentos — tecnicamente válidos, praticamente péssimos
```javascript
let ação = "cadastro"  // Funciona, mas NÃO FAÇA
```
Problemas: encoding de arquivo, copy-paste quebra, confusão com teclados diferentes.

### Caracteres especiais no início
```javascript
let _private = "internal"  // Convenção: "privado"
let $element = document.body  // Convenção: DOM element
```
Estes dois (`_` e `$`) são os únicos caracteres especiais que têm uso idiomático em JS.

### O que NÃO é permitido
```javascript
let 1user = "Ana"  // ERRO DE SINTAXE — número no início
let product name = "X"  // ERRO — espaço no meio
```

## Nomes descritivos — a regra de ouro

O instrutor enfatiza: se você cria `let x = "Rodrigo"`, ninguém sabe o que `x` significa. Mas `let firstName = "Rodrigo"` é auto-explicativo.

**Teste mental:** alguém lendo seu código pela primeira vez consegue entender o que a variável guarda sem ler o contexto ao redor? Se sim, o nome é bom.