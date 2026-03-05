# Deep Explanation: Referência de Funções CSS por Categoria

## A visão do instrutor sobre o estudo de CSS Functions

O ponto central desta aula de encerramento não é ensinar uma função específica, mas transmitir uma mentalidade de estudo contínuo. O instrutor enfatiza que o curso cobriu "apenas algumas" funções de cada categoria, e que o universo real é muito maior.

### Anatomia de uma função CSS

Toda função CSS segue o mesmo padrão:

```
propriedade: funcao(argumento);
```

Pode ter um ou mais argumentos, dependendo da função. Essa consistência sintática significa que, uma vez que você entende o padrão, aprender novas funções se torna questão de conhecer os argumentos e o comportamento.

### A importância da compatibilidade

O instrutor demonstra ao vivo no DevDocs que diferentes funções têm diferentes níveis de suporte:

- Algumas funcionam em "vários lugares" (boa compatibilidade)
- Outras "quase não funcionam" (suporte parcial ou experimental)
- Funções experimentais de imagens "já não vão estar funcionando quase nada mesmo"

Isso não é apenas uma curiosidade — é uma decisão de engenharia. Usar uma função sem suporte em produção quebra a experiência para parte dos usuários.

### O DevDocs como ferramenta de referência

O instrutor recomenda especificamente o DevDocs (não o MDN diretamente, embora o DevDocs agregue dados do MDN) como a ferramenta de consulta. O fluxo recomendado:

1. Abrir DevDocs
2. Buscar "CSS Functions"
3. Navegar pela lista de "CSS Value Functions"
4. Clicar em cada função para ver compatibilidade

### Mentalidade de estudo contínuo

A frase chave do instrutor: "é um estudo aí para a vida toda". CSS functions não é um tópico que se "completa" — novas funções são adicionadas regularmente às especificações, e o suporte dos navegadores evolui constantemente.

### Categorias vistas no curso vs. disponíveis

| Categoria | Visto no curso | Total disponível |
|-----------|---------------|-----------------|
| Transformação | Algumas | Muitas (translate, rotate, scale, skew, matrix, perspective, e variações 3D) |
| Cálculo | Apenas algumas | Muitas (calc, min, max, clamp, exponenciais, trigonométricas) |
| Filtros | Vários | Lista completa de filter functions |
| Cores | 2-3 funções | Muitas (rgb, hsl, hwb, lab, lch, oklch, oklab, color, color-mix) |
| Gradients | 2 | 3+ (linear, radial, conic, repeating variants) |
| Referência | Quase todas | var, attr, env, url |
| Grid | - | repeat, minmax, fit-content |
| Contadores | - | counter, counters |
| Fontes | - | Funções tipográficas |
| Animação | - | cubic-bezier, steps, linear |
| Imagens | - | Maioria experimental |

### Edge case: funções experimentais

O instrutor mostra que funções de imagem são "experimentais" — isso significa:

- Podem ser removidas da especificação
- Podem mudar de sintaxe
- Não devem ser usadas em produção
- Podem ser úteis para prototipagem ou testes locais

A recomendação implícita é: use polyfills ou fallbacks se precisar de algo experimental, mas preferencialmente espere o suporte estabilizar.