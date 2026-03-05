# Deep Explanation: Títulos e Parágrafos HTML

## A analogia do livro

O instrutor usa a analogia de abrir um livro ou site e encontrar um bloco de texto sem qualquer organização. A pergunta que ele faz é: "Faz sentido pra você ler um monte de texto assim, numa página?" — a resposta óbvia é não. Sem títulos e parágrafos, o leitor não sabe:

- Sobre o que é a página
- Onde uma seção termina e outra começa
- Qual é a hierarquia de importância das informações

Isso é exatamente o que acontece no HTML quando você coloca texto solto sem tags semânticas.

## Por que apenas um H1 por página

O H1 é o **tópico principal** da página. O instrutor enfatiza: "um H1 por página, porque é isso aqui que você vai dizer que esse é o tópico principal da sua página." Tudo na página existe subordinado ao H1. Múltiplos H1 criariam ambiguidade sobre qual é o tema central.

## A hierarquia H1-H6 como árvore de conteúdo

O instrutor demonstra a hierarquia construindo uma página "Sobre Mim":

```
H1: Sobre Mim (tópico da página)
├── H2: Trabalho (seção)
│   └── H3: Carga Horária (subseção)
└── H2: Estilo de Vida (seção)
```

Cada nível de heading cria um ramo na árvore. O H2 "Estilo de Vida" não está subordinado ao H2 "Trabalho" — são seções irmãs. Já o H3 "Carga Horária" está dentro de "Trabalho".

## Headings vs. tamanho visual

Os headings H1-H6 diminuem de tamanho visualmente por padrão do navegador, mas o instrutor deixa implícito que a função principal é **semântica**, não visual. O H1 é visualmente maior, o H2 menor, etc. Mas o propósito real é comunicar hierarquia de conteúdo.

## Parágrafos como unidades de pensamento

A tag `<p>` não é apenas "quebra de linha". O instrutor mostra que sem ela, mesmo adicionando quebras de linha no código, o navegador renderiza tudo junto. O parágrafo é uma **unidade semântica** — agrupa frases sobre um mesmo ponto.

## Edge cases mencionados

- **Quantos parágrafos quiser** — não há limite para `<p>` ou subtítulos
- **H3 dentro de H2 é válido** — o instrutor demonstra com "Carga Horária" dentro de "Trabalho"
- **Conteúdo sem sentido contextual ainda funciona** — o instrutor admite que "carga horária" como H3 "não faz sentido, mas tudo bem" para fins de demonstração da hierarquia

## O que o texto desorganizado comunica

Sem headings e parágrafos, o texto comunica: "não sei o que é isso, onde estou entrando, sobre o que é isso." Com a estrutura adequada, cada seção tem propósito claro e o leitor navega o conteúdo com facilidade.