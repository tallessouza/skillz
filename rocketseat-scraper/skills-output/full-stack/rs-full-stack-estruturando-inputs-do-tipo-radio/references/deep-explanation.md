# Deep Explanation: Estruturando Inputs do Tipo Radio

## Por que fieldset + legend?

O fieldset agrupa elementos de formulario que pertencem a uma mesma categoria logica. Para radio buttons, isso e essencial porque:

1. **Acessibilidade**: leitores de tela anunciam o legend antes de cada radio, dando contexto. Sem fieldset, o usuario ouve "morning, radio button" sem saber que e sobre turno de estudo.
2. **Semantica HTML**: o navegador entende que os radios formam um grupo. Isso e especialmente importante para formularios complexos com multiplos grupos de radio.

## O atributo name: o mecanismo de exclusao mutua

O `name` compartilhado e o que faz radios serem mutuamente exclusivos. O browser agrupa todos os inputs radio com o mesmo name e permite selecionar apenas um. Se voce esquecer o name ou usar names diferentes, todos os radios podem ser selecionados simultaneamente — quebrando o comportamento esperado.

## Padrao de wrappers: radio-wrapper > radio-inner

O instrutor usa uma hierarquia de divs:

```
radio-wrapper (container do grupo inteiro)
  └── radio-inner (container de cada opcao individual)
       ├── radio-image (div vazia para imagem decorativa via CSS)
       ├── input[type="radio"]
       ├── img (icone descritivo)
       └── label
```

**Por que div vazia para imagem?** A `.radio-image` e uma div vazia que sera estilizada via CSS com `background-image`. Isso separa conteudo decorativo do HTML semantico. A imagem decorativa nao precisa de alt text porque nao carrega significado — e puramente visual.

**Por que img separada?** O `<img>` com alt text (ex: "Icone de sol com nuvem") e informativo e acompanha o label. Ele ajuda visualmente o usuario a associar o icone ao turno.

## Label com for vs Label sem for

Na estrutura do instrutor, existem dois tipos de label:

1. **Label descritivo do grupo** (sem `for`): "Selecione o turno de estudo" — descreve a instrucao geral. Nao aponta para nenhum input porque nao pertence a um radio especifico.
2. **Label de cada opcao** (com `for`): "Manha", "Tarde" — cada um aponta para o `id` do radio correspondente. Clicar no label seleciona o radio.

## Tecnica de edicao: Ctrl+D para selecao multipla

O instrutor demonstra usar Ctrl+D (ou Cmd+D no Mac) no editor para selecionar multiplas ocorrencias do mesmo texto e editar simultaneamente. Ao duplicar o bloco do primeiro radio (morning), ele seleciona todas as ocorrencias de "morning" e substitui por "evening" de uma vez. Isso evita erros de edicao parcial onde voce muda o id mas esquece o value ou o for do label.

## Value semantico em ingles

Os values usados sao em ingles (`morning`, `evening`) porque:
- Sao os dados enviados ao servidor
- Convencao comum em desenvolvimento web
- O texto visivel para o usuario ("Manha", "Tarde") fica no label, que e separado do value