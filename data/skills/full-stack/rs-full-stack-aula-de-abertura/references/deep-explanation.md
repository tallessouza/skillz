# Deep Explanation: JavaScript Intermediário — Roadmap

## Filosofia da jornada

O instrutor da Skillz apresenta o aprendizado de JavaScript como uma **jornada progressiva**. A metáfora é clara: cada etapa se aprofunda mais, construindo sobre o que veio antes.

A ideia central é que JavaScript intermediário não é "outro assunto" — é o **mesmo JavaScript**, só que com mais profundidade. Objetos, arrays e classes são extensões naturais dos tipos primitivos e funções já aprendidos.

## Por que essa ordem?

### Objetos primeiro
Objetos são a base de tudo em JavaScript. Arrays são objetos. Funções são objetos. O DOM é feito de objetos. Entender objetos destrava todo o resto.

### Métodos de texto em seguida
Strings são o tipo de dado mais comum em interfaces. Saber manipular texto é imediatamente útil — validação de formulários, formatação de exibição, parsing de dados.

### Arrays depois de objetos
Arrays são coleções ordenadas de dados. Na prática, quase toda API retorna arrays de objetos. Sem dominar arrays, não se consegue consumir APIs.

### Repetições e iterações
Aqui é onde arrays ganham poder. forEach, map, filter, reduce transformam listas de dados. É o padrão mais usado em React, Vue, e qualquer framework moderno.

### Data e hora
Trabalhar com tempo é notoriamente difícil em qualquer linguagem. JavaScript tem suas peculiaridades (Date é mutável, meses começam em 0). Esse tópico prepara para cenários reais como agendamentos, prazos e timestamps.

### Classes por último
Classes são açúcar sintático sobre protótipos. Exigem entendimento de objetos, métodos e escopo. Por isso vêm por último — consolidam tudo que veio antes numa estrutura organizada.

## Conexão com o mundo real

Cada um desses tópicos aparece diariamente no desenvolvimento web:
- **Objetos**: estado de componentes, configurações, respostas de API
- **Métodos de texto**: validação, sanitização, formatação
- **Arrays**: listas de produtos, usuários, posts
- **Iterações**: renderização de listas, transformação de dados
- **Data/hora**: timestamps, agendamentos, countdowns
- **Classes**: models, services, controllers em aplicações maiores