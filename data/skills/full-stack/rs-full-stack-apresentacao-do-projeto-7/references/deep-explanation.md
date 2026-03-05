# Deep Explanation: Setup de Projeto de Formulário HTML

## Por que SVG e não PNG?

O instrutor escolhe SVG para todos os assets gráficos do projeto. A razão fundamental: SVG é XML — tem tags, atributos, e uma sintaxe que se parece com HTML. Isso permite uma estratégia "bem interessante" mencionada pelo instrutor: inserir o SVG diretamente no HTML ao invés de referenciá-lo como imagem.

Isso será explorado em aulas futuras, mas a decisão de exportar como SVG no setup já prepara esse caminho.

## Por que evitar acentos em nomes de pastas?

O instrutor explica diretamente: "eu acho melhor quando a gente faz os códigos e não coloca muito acento assim nas pastas, nos arquivos, porque isso daí a gente evita qualquer tipo de erro que possa ter por causa de acentuações."

Problemas reais com acentos em paths:
- Encoding UTF-8 vs Latin-1 entre sistemas operacionais
- URLs precisam de encoding especial para caracteres acentuados
- Ferramentas de build podem falhar silenciosamente
- Git em diferentes OS pode tratar acentos de forma inconsistente

## Layout com lado fixo + scroll

O projeto possui um layout split: um lado fixo (a ilustração) e outro lado com rolagem (o formulário). Essa é uma decisão de design comum para formulários longos — mantém contexto visual enquanto o usuário preenche campos.

## Inputs desafiadores: Radio e Checkbox

O instrutor destaca que radio e checkbox são "inputs que são desafiadores de customizar." A razão: navegadores renderizam esses inputs com aparência nativa que é difícil de sobrescrever com CSS puro. O projeto vai cobrir técnicas de customização visual desses elementos.

## Workflow de export em lote do Figma

A técnica de seleção em lote é crucial para produtividade:
1. Clique no primeiro elemento
2. Shift + clique no último
3. Todos os intermediários são selecionados
4. O botão de export mostra "Export N layers" — confirme que o número bate com a quantidade de ícones esperada

O instrutor nota que "o projeto não está ajustado para o export" — isso significa que os ícones precisam ser selecionados manualmente no Figma antes de exportar, não basta clicar no grupo.

## Style Guide como referência

O projeto inclui um style guide no Figma que serve como referência para cores, fontes e componentes. O instrutor menciona que "vai nos ajudar aqui com várias questões do nosso projeto." Fontes e cores serão definidas via CSS usando as referências do style guide.

## Escopo do projeto

O instrutor deixa claro que "as funcionalidades totais de um formulário não fazem parte do escopo." O foco é:
- HTML semântico para formulários
- CSS para estilização (incluindo inputs difíceis)
- Layout split (fixo + scroll)

Não inclui: validação JavaScript, envio para backend, processamento de dados.