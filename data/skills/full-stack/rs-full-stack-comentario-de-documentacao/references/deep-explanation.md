# Deep Explanation: Comentário de Documentação (JSDoc)

## Por que JSDoc existe

O instrutor diferencia três tipos de comentários em JavaScript:
1. **Linha única** (`//`) — notas rápidas inline
2. **Múltiplas linhas** (`/* */`) — blocos explicativos
3. **Documentação** (`/** */`) — padrão JSDoc que integra com IDEs

A diferença fundamental: apenas `/** */` é interpretado por ferramentas. O editor (VS Code) lê esse formato e exibe as informações no hover, autocomplete e signature help. Comentários normais são ignorados por essas ferramentas.

## O momento certo para introduzir JSDoc

O instrutor explicitamente diz que **esperou** até o aluno aprender funções para mostrar JSDoc, porque o valor principal é documentar funções — especificamente funções que serão consumidas por outras pessoas ou pelo próprio desenvolvedor no futuro.

A motivação central: quando você passa o mouse sobre uma função no editor, sem JSDoc você vê apenas `signIn(email: any, password: any): number`. Com JSDoc, você vê o resumo, o que cada parâmetro espera, restrições, e o significado do retorno.

## O padrão de escrita

### Atalho do editor
O instrutor mostra que ao digitar `/**` e pressionar Enter acima de uma função, o editor auto-gera a estrutura com `@param` para cada parâmetro detectado e `@returns`. Isso é um snippet do VS Code, não uma feature do JavaScript.

### Estrutura manual
Também é possível escrever manualmente: `/**`, depois cada linha com `*` alinhado, fechando com `*/`. O instrutor enfatiza que cada linha intermediária deve ter o asterisco para manter o padrão visual.

## Anatomia de um bloco JSDoc

```
/**
 * [Linha de resumo - o que a função faz]        ← aparece no autocomplete
 * @param {tipo} nome - Descrição do parâmetro.  ← tipo + restrições
 * @returns {tipo} O que retorna.                 ← significado do retorno
 */
```

### Tipos no @param
O instrutor mostra que sem tipo definido, o IDE exibe `*` (any). Ao colocar `{string}`, o IDE passa a mostrar o tipo correto. Isso é puramente documentacional em JS (não há enforcement em runtime), mas dá informação crucial para quem consome a função.

### Descrições nos parâmetros
O instrutor adiciona `User email` no parâmetro email e `More than 6 characters` no password. A ideia é comunicar **restrições e formato esperado**, não apenas repetir o nome do parâmetro.

## Quando usar

O instrutor destaca o caso de uso principal: **funções que podem ser utilizadas por outras pessoas**. Isso inclui:
- Funções exportadas de módulos/bibliotecas
- Funções de API pública
- Utilitários compartilhados
- Qualquer função onde o nome sozinho não comunica todos os requisitos

## Integração com IDE

O instrutor demonstra dois pontos de integração:
1. **Autocomplete** — ao começar a digitar o nome da função, o dropdown mostra o resumo e parâmetros documentados
2. **Hover** — ao passar o mouse sobre a chamada da função, exibe toda a documentação formatada

Antes do JSDoc: apenas assinatura crua.
Depois do JSDoc: resumo + tipos + descrições + retorno — tudo visível sem abrir o arquivo da função.