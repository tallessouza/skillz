# Deep Explanation: Restringindo Valores com Type Aliases

## Por que string aberta eh um problema

O instrutor demonstra um insight fundamental: quando voce declara `let size: string`, o TypeScript sabe que eh uma string, mas aceita **qualquer** string. Isso cria um universo de possibilidades indesejadas:

- `"pequeno"` (portugues quando o sistema usa ingles)
- `"small"` (correto)
- `"sm"` (abreviacao)
- `"s"` (uma letra)
- `" small "` (com espacos)
- `"Small"` (case diferente)

O instrutor enfatiza: **"tem muitas possibilidades, ta em aberto"**. Esse "em aberto" eh exatamente o problema — voce perde o controle sobre quais valores sao validos.

## A solucao: type com union de literais

A abordagem do TypeScript usa o operador pipe `|` para criar uma **union type** de valores literais:

```typescript
type Size = "small" | "medium" | "large"
```

Isso nao eh apenas documentacao — eh uma **restricao enforced pelo compilador**. Qualquer tentativa de atribuir um valor fora do conjunto gera erro em tempo de compilacao.

## Por que isso importa para logica condicional

O instrutor destaca um ponto critico: **"as vezes voce usa esses valores em condicoes"**. Quando voce faz:

```typescript
if (size === "small") { ... }
else if (size === "medium") { ... }
else if (size === "large") { ... }
```

Se `size` for `string`, nenhuma dessas condicoes eh garantida. Alguem pode passar `"tiny"` e cair em nenhum branch. Com o type restritivo, o compilador **garante** que so existem essas tres possibilidades.

## Autocomplete como beneficio colateral

O instrutor mostra que ao pressionar `Ctrl+Espaco` dentro das aspas, o editor lista apenas `"small"`, `"medium"` e `"large"`. Isso transforma o type de uma ferramenta de validacao em uma **ferramenta de produtividade** — o desenvolvedor nao precisa lembrar os valores, o editor mostra.

## Analogia mental

Pense em um type literal union como um **formulario com radio buttons** vs um **campo de texto livre**:
- `string` = campo de texto livre (qualquer coisa)
- `type Size = "small" | "medium" | "large"` = radio buttons (so as opcoes listadas)

## Quando usar enum vs type union

Para conjuntos simples de strings (2-10 valores), type unions sao preferidos porque:
- Nao geram codigo JavaScript extra (enums geram objetos)
- Funcionam naturalmente com inferencia de tipo
- Sao mais faceis de compor (`type AllSizes = Size | "extra-large"`)

Enums sao uteis quando voce precisa de:
- Valores numericos associados
- Reverse mapping (numero → nome)
- Namespace para agrupar constantes

## Edge cases

- **Valores case-sensitive:** `"Small"` !== `"small"` — o type eh exato
- **Extensao:** Use intersection ou novo type: `type ExtSize = Size | "xl"`
- **Arrays:** `const sizes: Size[] = ["small", "large"]` — cada elemento eh validado
- **Exhaustiveness check:** Com `switch` + `never`, o compilador avisa se voce esqueceu um caso