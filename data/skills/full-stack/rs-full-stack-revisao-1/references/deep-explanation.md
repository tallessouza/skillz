# Deep Explanation: HTML Forms

## Por que formulários importam

Formulários são o mecanismo principal de captura de dados em aplicações web. Existem dados de **entrada** (o que o usuário fornece) e dados de **saída** (o que a aplicação retorna). Formulários cobrem desde login e cadastro até calculadoras, players de vídeo e controles interativos.

O instrutor enfatiza: "isso aqui é um estudo constante". A tag `<input>` é uma das mais poderosas do HTML por ter dezenas de combinações via o atributo `type`, e cada browser/sistema operacional pode renderizar de forma diferente.

## GET vs POST — Quando usar cada um

### GET (padrão)
- Dados vão na URL: `pagina.html?nome=valor&campo=valor`
- Visível para o usuário e no histórico do browser
- Útil para buscas e filtros (permite compartilhar URL com parâmetros)
- Os dados podem ser consumidos no front-end diretamente pela URL

### POST
- Dados vão no body da requisição HTTP (escondidos da URL)
- Geralmente processados no back-end
- Obrigatório para dados sensíveis (senhas, dados pessoais)
- Não fica no histórico do browser

**Regra prática do instrutor:** "o GET já está por padrão, geralmente a gente coloca o método POST ali"

## A importância do `<label>` para acessibilidade

Labels não são decoração. Eles:
1. Permitem que leitores de tela anunciem o campo corretamente
2. Aumentam a área de clique (clicar no label foca o input)
3. São essenciais para conformidade com WCAG

Duas formas de associar:
```html
<!-- Via for/id -->
<label for="email">E-mail</label>
<input type="email" id="email" name="email">

<!-- Via wrapping -->
<label>
  E-mail
  <input type="email" name="email">
</label>
```

## Tipos de input disponíveis

O instrutor listou os tipos cobertos na aula:

| Type | Uso | Comportamento especial |
|------|-----|----------------------|
| `text` | Texto genérico | Padrão |
| `number` | Números | Setas de incremento, teclado numérico em mobile |
| `email` | E-mail | Validação nativa de formato, teclado com @ em mobile |
| `password` | Senha | Caracteres mascarados |
| `file` | Upload de arquivo | Abre seletor de arquivo |
| `range` | Slider numérico | Barra deslizante |
| `color` | Seletor de cor | Color picker nativo |
| `checkbox` | Seleção múltipla | Toggle on/off |
| `radio` | Seleção única | Exclusivo dentro do mesmo `name` |
| `hidden` | Dado invisível | Enviado mas não visível ao usuário |

O instrutor enfatiza que existem mais tipos e recomenda consultar a documentação e o site "Can I Use" para verificar compatibilidade.

## Botões no formulário

Três tipos principais:
- `type="submit"` — Envia o formulário (padrão dentro de `<form>`)
- `type="reset"` — Limpa todos os campos do formulário
- `type="button"` — Botão sem comportamento padrão (para JavaScript)

## `<fieldset>` e `<legend>` — Agrupamento semântico

Agrupam campos com o mesmo propósito. Benefícios:
- Semântica clara para o browser e leitores de tela
- Visualmente cria uma borda ao redor do grupo
- O `<legend>` serve como título do grupo

## `<select>` — Opções de seleção

Três variações:
1. **Simples** — dropdown com uma opção selecionável
2. **Múltiplo** (`multiple`) — permite selecionar várias opções
3. **Agrupado** (`<optgroup>`) — organiza opções em categorias

## `<textarea>` — Texto multilinha

Para quando um `<input type="text">` não é suficiente. Aceita `rows` e `cols` para dimensionamento inicial. Ideal para comentários, descrições, mensagens.

## Próximos passos mencionados pelo instrutor

1. **JavaScript** — Para validação avançada e controle de comportamento dos formulários
2. **CSS** — Para estilização e customização visual dos campos
3. **Prática constante** — Criar muitos formulários para internalizar os conceitos
4. **Documentação** — Consultar MDN e Can I Use para descobrir mais atributos e tipos