# Deep Explanation: Criando Pagina de Novo Prompt

## Raciocinio do instrutor

### Por que criar a rota primeiro com conteudo minimo?

O instrutor demonstra um padrao importante: ele cria a pagina com apenas um `<div>` e `<h2>` antes de construir qualquer coisa. Isso serve para validar que o roteamento do Next.js App Router esta funcionando — o 404 sumiu. So depois ele começa a construir o formulario.

Essa abordagem evita um problema comum: construir um formulario complexo e so depois descobrir que a rota esta errada, o arquivo esta no lugar errado, ou o App Router nao esta reconhecendo a pagina.

### Por que extrair o formulario para um componente?

O instrutor nao escreve o formulario diretamente na `page.tsx`. Ele cria `components/prompts/prompt-form.tsx`. Isso segue o principio de que paginas no Next.js devem ser finas — elas sao pontos de entrada de rota, nao containers de logica.

O `PromptForm` como componente separado pode ser:
- Reutilizado em uma pagina de edicao futura
- Testado isoladamente
- Modificado sem tocar na estrutura de rotas

### Construcao incremental

O instrutor enfatiza varias vezes que esta construindo por camadas:
1. Primeiro a rota (confirmar navegacao)
2. Depois o componente com estrutura basica (form + header + button)
3. Depois os campos (Input + Textarea)
4. Estilizacao basica (classes utilitarias)
5. Validacao ficara para proximas aulas

Ele diz explicitamente: "a gente vai deixar assim e ai a gente vai incrementando ele agora nas proximas aulas ali a parte de validacao e etc". Isso mostra que ele conscientemente separa as preocupacoes em etapas.

### Header com acoes no topo

O padrao de colocar botoes de acao (Salvar, Copiar) no header do formulario ao inves do footer e uma decisao de UX. O instrutor usa `justify-end` para alinhar a direita, `flex-wrap` para responsividade, e `gap-2` para espacamento entre botoes.

### Componentes UI como sistema de design

Os componentes `Input`, `Textarea` e `Button` ja existem no projeto (possivelmente ShadCN ou sistema proprio). O instrutor usa props como `variant="transparent"`, `size="large"` e `size="small"` — indicando um sistema de design com variantes pre-definidas.

Ele inclusive instala o Textarea antes de usar: "vamos vir aqui e instalar o nosso textarea tambem". Isso sugere uso de CLI como `npx shadcn-ui add textarea`.

## Decisoes de estilizacao

- `space-y-4` no form: espacamento vertical entre campos
- `mb-6` no header: separacao visual entre acoes e campos
- `autoFocus` no primeiro input: UX — cursor ja posicionado ao abrir a pagina