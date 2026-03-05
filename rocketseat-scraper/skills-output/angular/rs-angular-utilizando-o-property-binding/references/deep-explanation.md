# Deep Explanation: Property Binding no Angular

## O que é Binding no Angular

Binding é a ligação entre a classe do componente e o template do componente, conectando dados às representações visuais nos elementos HTML. Existem vários tipos:

- **Property Binding** — classe → template (direita para esquerda)
- **Event Binding** — template → classe (esquerda para direita)
- **Two-Way Data Binding** — bidirecional
- **Class Binding** — vincula classes CSS
- **Style Binding** — vincula estilos inline

## Propriedade vs Atributo: A distinção crítica

Quando o navegador cria o DOM, cada elemento HTML recebe uma **instância** — um objeto JavaScript com propriedades acessíveis. O instrutor enfatiza:

- **Atributo**: o valor "chumbado" diretamente no HTML (ex: `<input id="meu-input">`)
- **Propriedade**: a propriedade da instância JavaScript daquele elemento no DOM

Ambos podem ter nomes parecidos (como `value`, `disabled`, `type`), mas são coisas diferentes. Ao fazer Property Binding no Angular, estamos manipulando as **propriedades da instância DOM**, não os atributos HTML.

Para inspecionar as propriedades de um elemento, use o Chrome DevTools: selecione o elemento e veja a aba "Properties" no painel inferior. Ali estão todas as propriedades da instância: `disabled`, `value`, `type`, `innerHTML`, `innerText`, etc.

## Fluxo de dados unidirecional

O instrutor destaca um ponto crucial: **Property Binding é unidirecional**.

Quando você faz `[value]="texto"`, o valor da propriedade `texto` da classe é repassado para o input. Porém, se o usuário digitar algo no input, a propriedade `texto` **não é atualizada**. O valor flui apenas da classe para o template.

Isso é demonstrado com um botão "Logar Texto" que sempre mostra o valor original da propriedade, mesmo após o usuário digitar no input.

## Como o Change Detection entra

Quando uma propriedade da classe muda (ex: `this.inputDisabled = true`), o Angular:
1. Roda o **Change Detection**
2. Verifica quais propriedades estão sendo usadas no template
3. Atualiza **apenas** as partes do template que dependem dessas propriedades

Isso é o que faz os botões "Habilitar" e "Desabilitar" funcionarem — ao mudar `inputDisabled`, o Angular detecta a mudança e atualiza o atributo `disabled` do input automaticamente.

## Simulando Two-Way Binding manualmente

O instrutor demonstra como combinar Event Binding + Property Binding para manter a propriedade sincronizada com o input:

1. `[value]="texto"` — envia o valor da classe para o input
2. `(input)="onInputChange($event)"` — captura o evento de digitação
3. No método, faz casting `(event.target as HTMLInputElement).value` para obter o valor digitado
4. Atribui o valor à propriedade: `this.texto = value`

Isso não é um Two-Way Data Binding verdadeiro (que usa `[(ngModel)]`), mas é uma forma manual de manter os dois sincronizados usando os conceitos já aprendidos.

## O casting do event.target

O `event.target` tem tipo genérico (`EventTarget | null`) porque pode ser qualquer elemento HTML. Como sabemos que o evento vem de um `<input>`, é seguro fazer o casting: `(event.target as HTMLInputElement).value`. O instrutor alerta que se o método fosse chamado por vários tipos de elementos, esse casting chumbado não seria apropriado.

## Resumo dos fluxos

| Tipo | Sintaxe | Direção | Exemplo |
|------|---------|---------|---------|
| Event Binding | `(evento)="metodo()"` | template → classe | `(click)="habilitar()"` |
| Property Binding | `[prop]="valor"` | classe → template | `[disabled]="isDisabled"` |
| Two-Way Binding | `[(ngModel)]="prop"` | bidirecional | `[(ngModel)]="texto"` |