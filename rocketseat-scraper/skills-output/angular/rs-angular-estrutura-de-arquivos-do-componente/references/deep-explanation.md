# Deep Explanation: Estrutura de Arquivos do Componente Angular

## Os 4 arquivos base de um componente

Quando o Angular CLI gera um componente, cria 4 arquivos:

1. **`.component.ts`** — A classe TypeScript com o decorator `@Component`. Guarda estado, métodos e propriedades. É o "cérebro" do componente.
2. **`.component.html`** — O template HTML. Pode conter qualquer estrutura HTML: divs, parágrafos, botões, outros componentes. Não precisa ser um único elemento raiz.
3. **`.component.css`** — Folha de estilo encapsulada. Classes criadas aqui só afetam este componente (encapsulation padrão do Angular). Usando CSS puro, sem frameworks como Tailwind.
4. **`.component.spec.ts`** — Testes unitários (não abordado nesta aula).

## A conexão entre os 3 arquivos principais

O decorator `@Component` é a cola que conecta tudo:

```typescript
@Component({
  selector: 'app-meu-botao',      // Como referenciar em outros templates
  imports: [],                      // Dependências (standalone)
  templateUrl: './meu-botao.component.html',  // Aponta para o template
  styleUrl: './meu-botao.component.css'       // Aponta para o CSS
})
```

O `templateUrl` diz ao Angular qual arquivo HTML renderizar. O `styleUrl` diz qual CSS aplicar. O TypeScript fornece os métodos e propriedades que o template consome.

## Event binding: a ponte template → TypeScript

No HTML, `(click)="limpar()"` cria um event binding. Quando o usuário clica no botão, o Angular executa o método `limpar()` declarado na classe TypeScript. Essa é a forma padrão de conectar interações do usuário à lógica do componente.

O instrutor enfatiza que essa ligação é automática — basta declarar o método na classe e referenciá-lo no template com a sintaxe de parênteses `()`.

## Template pode ter múltiplos elementos

Um ponto importante: o template não precisa ter apenas um elemento. Pode agrupar vários botões, divs aninhadas, parágrafos — toda uma estrutura HTML. Isso é o poder dos componentes: encapsular uma estrutura complexa e reutilizá-la referenciando um único selector.

## Standalone vs Modules (contexto histórico)

Em versões mais antigas do Angular, o array `imports` não existia no decorator `@Component`. As dependências eram declaradas no módulo (`@NgModule`) ao qual o componente pertencia. Com standalone components (padrão atual), o `imports` vai direto no decorator, eliminando a necessidade de módulos.

## Por que manter a nomenclatura padrão

O instrutor é enfático: **não mude os nomes**. Se o arquivo é `meu-botao.component.ts`, a classe deve ser `MeuBotaoComponent` e o selector `app-meu-botao`. Criar inconsistências como `meus-botoes.component` na classe e `app-botao` no selector torna o projeto "muito desorganizado e difícil de dar manutenção".

## Propriedades adicionais do @Component

O decorator aceita muitas propriedades além das básicas:
- **`standalone`** — booleano, `true` por padrão
- **`styles`** — CSS inline (array de strings) em vez de arquivo externo
- **`template`** — HTML inline em vez de arquivo externo
- **`encapsulation`** — controla encapsulação de CSS (ViewEncapsulation). O padrão é usado em 99% dos casos.

## Dica do instrutor: salve o arquivo

Se o VS Code mostra uma bolinha no tab do arquivo, significa que há alterações não salvas. Essas alterações não refletem no navegador. Sempre salvar (Ctrl+S) antes de verificar o resultado.