# Deep Explanation: Desabilitando Botao com Template Driven Forms

## Por que form-level validation?

O instrutor explica o raciocinio central: se voce tem multiplos campos e precisa desabilitar um botao quando algum esta vazio, a abordagem ingenua seria verificar cada signal individualmente no `[disabled]`. Isso funciona, mas nao escala.

A solucao e transformar o container em um `<form>` e usar a diretiva `ngForm` do Angular. Quando qualquer campo dentro do formulario esta invalido, o formulario inteiro fica invalido. Entao voce verifica apenas `movieForm.invalid` em vez de N condicoes.

## Como ngForm funciona

1. **Referencia de template**: `#movieForm="ngForm"` cria uma variavel de template que armazena o estado do formulario
2. **ngForm e uma diretiva exportada pelo FormsModule**: ela rastreia todos os controles registrados dentro do form
3. **Cada input com `ngModel` + `name` se registra automaticamente**: o Angular precisa do `name` para diferenciar os campos internamente
4. **`required` marca o campo como obrigatorio**: sem ele, campo vazio = valido

## O erro comum: ngModel sem name

O instrutor mostra que ao salvar apos adicionar o `<form>`, o Angular reclama: inputs com `ngModel` dentro de um Template Driven Form precisam do atributo `name`. Isso e um requisito do Angular para registrar cada controle no formulario.

## Combinando validacao do form com estado externo

O arquivo selecionado (imagem) nao e um campo do formulario — e um signal que guarda o binario do upload. Por isso, o `[disabled]` precisa combinar duas condicoes:

```
movieForm.invalid || !selectedFile()
```

Isso mostra que Template Driven Forms resolve a validacao dos campos, mas estado externo ao form ainda precisa ser tratado separadamente.

## Escolha de Template Driven Forms vs outros

O instrutor menciona explicitamente que existem tres opcoes no Angular:
- **Template Driven Forms** (usado aqui) — ideal para formularios simples
- **Reactive Forms** — melhor para formularios complexos com validacoes dinamicas
- **Signal Forms** — abordagem mais recente

A escolha foi Template Driven Forms por ser um formulario simples, e tambem para demonstrar que signals funcionam com ngModel nessa abordagem.

## UX do botao desabilitado

O instrutor destaca um problema de UX: o botao desabilitado sem estilo visual nao comunica ao usuario que esta desabilitado. A solucao e usar classes Tailwind:
- `disabled:opacity-50` — reduz opacidade
- `disabled:cursor-not-allowed` — muda cursor para indicar que nao e clicavel
- `disabled:hover:bg-purple-800` — mantem cor no hover (evita feedback visual de hover em botao desabilitado)