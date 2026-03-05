# Deep Explanation: Ciclo de Vida — NgOnInit

## Por que ngOnInit e nao o constructor?

O instructor explica que o ngOnInit e o lugar correto para carregar informacoes iniciais do componente. O constructor do TypeScript executa antes do Angular ter terminado de configurar o componente (bindings, inputs, etc). O ngOnInit executa depois que o Angular ja preparou tudo.

Caso de uso principal mencionado: **requisicoes a APIs**. "Vamos supor que voce queira fazer uma requisicao para uma API, para exibir esses dados da API no seu componente. Entao, tudo isso voce vai colocar no ngOnInit."

## O erro classico do this

O instructor enfatiza fortemente: "Eu ja vi muita gente esquecendo do this, quebrando a cabeca para saber o que houve, porque a aplicacao esta dando erro e e simplesmente porque faltou o this."

Em TypeScript/JavaScript, metodos e atributos de classe precisam de `this.` para serem referenciados dentro de outros metodos da mesma classe. Sem o `this`, o runtime procura uma variavel local ou global com aquele nome, gerando erro ou comportamento inesperado.

## A diferenca crucial: @if vs [hidden]

O instructor demonstra na pratica a diferenca fundamental:

### Com @if (ou *ngIf): componente NAO e criado
- O Angular nem instancia o componente
- O ngOnInit NAO executa
- O componente nao existe no DOM
- "Utilizando o if, eu posso controlar o que pode ser inicializado ou nao na minha tela. Isso significa que ele nao foi nem criado."

### Com [hidden]: componente e criado mas escondido
- O Angular instancia o componente normalmente
- O ngOnInit EXECUTA (o console.log aparece)
- O componente existe no DOM, apenas invisivel
- "Ele nao esta exibindo a minha navbar mas nos sabemos que a minha navbar inicializou"

Essa distincao tem impacto real em performance: se voce tem 50 componentes pesados em abas, usar `[hidden]` inicializa todos de uma vez. Usar `@if` so inicializa a aba ativa.

## @if vs *ngIf — evolucao do Angular

O instructor menciona que `*ngIf` era usado antes do Angular 17 e requer importacao do `CommonModule`. A partir do Angular 17, o `@if` (control flow syntax) e a forma recomendada e nao precisa de importacao adicional.

"Pode ser que eu utilize o ngIf ou o arroba-if, mas fica ao seu criterio." Ambos tem o mesmo comportamento — impedem a criacao do componente quando a condicao e falsa.

## Interface OnInit como contrato

Ao usar `implements OnInit`, o TypeScript obriga voce a implementar o metodo `ngOnInit()`. Isso garante que:
1. O nome do metodo esta correto (sem typo)
2. A assinatura esta correta
3. O editor oferece autocomplete