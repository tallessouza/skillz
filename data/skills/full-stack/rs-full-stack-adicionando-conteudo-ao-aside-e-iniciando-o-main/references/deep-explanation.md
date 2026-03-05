# Deep Explanation: Estrutura Aside/Main e Imagens Responsivas

## Por que max-width: 100% global?

O instrutor (Mike) explica que ao definir `max-width: 100%` no seletor global `img`, todas as imagens do projeto automaticamente se ajustam ao container pai. A sacada e: se uma imagem e maior que o espaco disponivel, ela "vai ficando menorzinha pra tentar se encaixar no local onde ela precisa ficar".

Isso elimina a necessidade de repetir `max-width: 100%` em cada contexto especifico. E uma regra defensiva — nao faz nada quando a imagem ja cabe, mas previne estouro quando a imagem e grande demais.

### Height auto como garantia

O `height: auto` ja e o comportamento padrao do browser, mas o instrutor adiciona explicitamente "so questao de garantia mesmo, pra nao ficar meio bugado". Em certos contextos (quando height foi definido em outro lugar via heranca ou reset CSS), o auto explicito garante que a proporcao da imagem seja mantida.

## Seletores de filho direto vs descendente

O caso concreto da aula: `.aside-container` tem duas imagens — uma dentro do `<header>` (o logo) e outra como filho direto (a ilustracao). Usando `.aside-container img`, ambas seriam afetadas. Usando `.aside-container > img`, apenas a ilustracao recebe o estilo.

O instrutor destaca: "aside-container, essezinho ta se referindo a esse cara aqui" — o `>` e o "essezinho" que faz toda a diferenca.

## Span vs Strong dentro de headings

A pergunta surge na aula: por que usar `<span>` e nao `<strong>` dentro do `<h2>`?

Resposta do instrutor: "o H2 todo ele ja e strong, ne? Ele ja e negrito, entao colocar um span ele fica diferente." Strong dentro de h2 nao muda visualmente nada — o texto ja e bold. Span permite aplicar uma classe ou cor diferente (como `var(--text-highlight)`) para destacar parte do texto.

## Custom properties para cores e fontes

A abordagem da aula segue um padrao de 3 niveis:
1. **Body** recebe `font-family` e `color` base (text-secondary)
2. **Headings** sobrescrevem com cor mais forte (text-primary)
3. **Destaques** usam cor especifica (text-highlight)

Isso cria hierarquia visual automatica — todo texto novo herda as propriedades do body, e so headings e destaques precisam de overrides.

## Criando fontes quando o design diverge

O instrutor encontra um caso onde o Figma pede `font-weight: 600` (semi-bold) mas as variaveis de fonte existentes so tem bold (700). A decisao: "nesses casos especificos que ele ta um pouco diferente, ta tudo bem, a gente vai la e arruma" — cria a propriedade inline ou uma nova variavel.

Nao improvisa usando bold quando o design pede semi-bold. A diferenca visual existe e respeitar o design e mais importante que manter o sistema de variaveis limpo.

## Estrutura semantica do aside

O aside da aula contem:
- `<header>` com logo + h2 + paragrafo (identificacao da marca)
- `<img>` como filho direto (ilustracao decorativa)

O header dentro do aside nao e o header da pagina — e o header daquela secao. HTML5 permite multiplos headers, cada um no contexto do seu container.

## Margin-top vs margin-bottom para espacamento

O instrutor usa `margin-top: 2rem` na ilustracao ao inves de `margin-bottom` no header. Preferencia por empurrar o elemento "pra baixo" ao inves de o anterior "empurrar pra baixo". Ambos funcionam, mas margin-top no elemento final e mais previsivel quando o conteudo acima pode variar.