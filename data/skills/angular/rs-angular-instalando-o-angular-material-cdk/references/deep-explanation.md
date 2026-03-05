# Deep Explanation: Angular Material CDK vs Angular Material Completo

## Por que CDK e nao Angular Material?

O instrutor explica que o Angular Material vem com componentes **pre-estilizados** e com **temas aplicados**. Para projetos com layout unico e peculiar, isso e desperdicio — voce instalaria dezenas de componentes estilizados para usar apenas dois primitivos (drag-drop e dialog).

O CDK (Component Dev Kit) e a camada de baixo nivel do Angular Material. Ele fornece os **comportamentos** sem nenhuma estilizacao. Voce importa o componente "cru" e estiliza na mao. Isso e ideal quando:

- O design do projeto nao segue Material Design
- Voce precisa de controle total sobre o CSS
- Apenas funcionalidades especificas sao necessarias

## Diferenca na instalacao

- **Angular Material completo:** `ng add @angular/material` — instala temas, tipografia, animacoes, todos os componentes
- **CDK apenas:** `npm install @angular/cdk@versao` — instala so os primitivos sem estilizacao

O `ng add` roda schematics que modificam `angular.json`, adicionam temas CSS e alteram `styles.css`. O `npm install` do CDK nao faz nada disso — e uma instalacao limpa.

## Por que fixar a versao?

O instrutor enfatiza instalar a **mesma versao** (19.2.11) independente de quando o aluno assiste. Isso porque:

1. APIs mudam entre versoes major do Angular Material/CDK
2. Funcionalidades podem ser removidas ou renomeadas
3. Garante que os exemplos do curso funcionem sem adaptacao

Na pratica, em projetos reais voce acompanha a versao do Angular core. Mas durante aprendizado, fixar versao elimina variaveis de confusao.

## Funcionalidades do CDK que serao usadas

1. **Drag and Drop** (`@angular/cdk/drag-drop`) — para reordenar tarefas arrastando
2. **Dialog** (`@angular/cdk/dialog`) — para abrir modais sem estilizacao pre-definida

Ambas serao estilizadas manualmente pelo instrutor nas proximas aulas.