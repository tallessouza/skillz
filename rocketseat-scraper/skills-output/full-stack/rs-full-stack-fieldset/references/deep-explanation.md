# Deep Explanation: Fieldset

## Por que fieldset existe

O `<fieldset>` resolve três problemas simultaneamente:

1. **Semântica** — O HTML ganha significado estrutural. Um parser ou crawler entende que "nome" e "email" pertencem ao grupo "Contato", não ao grupo "Dados Bancários".

2. **Acessibilidade** — Leitores de tela (NVDA, JAWS, VoiceOver) anunciam o `<legend>` quando o usuário navega para dentro do fieldset. Um usuário cego ouve "Contato, grupo" antes de ouvir os campos. Sem fieldset, ele ouve inputs soltos sem contexto.

3. **Controle de estado em bloco** — O atributo `disabled` no fieldset propaga para todos os elementos de formulário internos. Isso é nativo do HTML, sem JavaScript.

## O comportamento do disabled (detalhe crítico)

Quando um `<fieldset>` recebe o atributo `disabled`:

- **Todos os form elements internos ficam desabilitados** — inputs, selects, textareas, buttons
- **Campos desabilitados NÃO são incluídos no FormData** — ao submeter o formulário, esses dados simplesmente não existem na requisição
- **Isso inclui buttons** — se o botão de submit está dentro de um fieldset disabled, o usuário não consegue clicar nele

### A armadilha do disabled

O instrutor enfatiza: "muita atenção, os dados eles não vão ser enviados ao submeter o formulário". Isso é uma fonte comum de bugs:

1. Desenvolvedor desabilita um fieldset para "travar" a edição
2. Usuário submete o formulário
3. Os dados do fieldset disabled simplesmente desaparecem
4. Backend recebe dados incompletos

### Soluções para manter dados visíveis mas não editáveis:

```html
<!-- Opção 1: readonly em vez de disabled (dados SÃO enviados) -->
<fieldset>
  <legend>Dados Confirmados</legend>
  <input type="text" name="banco" value="Banco A" readonly>
</fieldset>

<!-- Opção 2: disabled visual + hidden inputs (dados SÃO enviados) -->
<fieldset disabled>
  <legend>Dados Confirmados</legend>
  <input type="text" name="banco_display" value="Banco A">
</fieldset>
<input type="hidden" name="banco" value="Banco A">
```

## Legend como primeiro filho

O `<legend>` deve ser o primeiro elemento dentro do `<fieldset>`. Embora browsers modernos renderizem corretamente mesmo fora de ordem, a especificação HTML define que o legend deve ser o primeiro filho. Leitores de tela dependem dessa ordem para anunciar o grupo corretamente.

## Múltiplos fieldsets

Um formulário pode ter quantos fieldsets forem necessários. Cada um opera independentemente:

- Cada um tem seu próprio `<legend>`
- Cada um pode ser habilitado/desabilitado independentemente
- O botão de submit geralmente fica fora de qualquer fieldset para não ser afetado por disabled

## Fieldset vs div

Uma `<div>` com classe "form-group" não tem valor semântico. Leitores de tela não anunciam divs como agrupamentos. O `<fieldset>` é o elemento HTML correto para agrupar campos relacionados.