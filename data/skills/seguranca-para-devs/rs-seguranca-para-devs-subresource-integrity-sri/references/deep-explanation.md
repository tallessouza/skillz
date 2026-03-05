# Deep Explanation: Subresource Integrity (SRI)

## Por que scripts de terceiros sao perigosos

Ao incluir um `<script src="...">` de um dominio que voce nao controla, voce esta delegando execucao de codigo na sua pagina para a infraestrutura de outra pessoa. Mesmo CDNs conhecidas pegam JavaScript do GitHub de alguem — e essa pessoa pode ter a conta invadida.

### Os tres riscos principais

1. **Quebra de comportamento** — o JavaScript e modificado na origem e sua aplicacao para de funcionar sem voce ter mudado nada
2. **Codigo malicioso** — um atacante injeta codigo que captura dados dos seus usuarios ou minera criptomoeda usando os recursos dos seus usuarios
3. **Vazamento de dados de privacidade** — dados sensíveis dos usuarios sao exfiltrados pelo script comprometido

O instrutor enfatiza: "acredita, esse negocio acontece, acontece bastante, e um ataque comum" — comprometer mantenedores de bibliotecas open source para injetar codigo malicioso e um vetor de ataque real e frequente.

## Estrategias de protecao (do mais ao menos seguro)

### 1. Self-hosting (maxima seguranca)

Baixar o script para o seu projeto:
- Va ao GitHub do projeto, pegue o codigo original (nao minificado)
- Leia e audite o codigo
- Minifique voce mesmo
- Versione no seu controle de versao
- Sirva do seu proprio servidor

**Vantagem:** eliminacao total da dependencia externa
**Desvantagem:** custo operacional, perde vantagens de CDN (cache distribuido, latencia)

O instrutor recomenda: "voce tem um grande projeto em que seguranca e fator chave, cara, baixa o script pro seu projeto e se garante."

### 2. SRI (Subresource Integrity)

Para quem precisa ou prefere usar CDNs, o atributo `integrity` garante que se o arquivo for modificado, o navegador bloqueia a execucao.

**Como funciona internamente:**
1. Voce calcula o hash criptografico (SHA-256/384/512) do arquivo que conferiu e testou
2. Coloca esse hash no atributo `integrity` da tag `<script>` ou `<link>`
3. Quando o navegador baixa o arquivo, ele recalcula o hash
4. Se o hash calculado != hash no atributo → **recurso bloqueado**
5. Qualquer modificacao, mesmo um unico espaco, muda completamente o hash (propriedade do algoritmo de digest)

**Requisito:** o servidor de origem precisa ter CORS habilitado (header HTTP Access-Control-Allow-Origin).

## Por que versionamento e pre-requisito

O instrutor faz um ponto forte: "se voce esta servindo de um projeto Open Source que nao versiona a sua biblioteca, entao voce nem deveria usar esse projeto."

Razoes:
- Sem versao fixa, o autor pode modificar o codigo a qualquer momento
- Sua aplicacao quebra sem voce ter feito nada
- SRI so funciona com versao fixa (o hash muda se o conteudo muda)
- Projetos que nao versionam demonstram imaturidade de engenharia

## Propriedade dos algoritmos de digest

O instrutor demonstra ao vivo: adicionar um unico espaco ao arquivo muda completamente o hash. Isso e a propriedade de "avalanche" dos algoritmos de hash criptografico — qualquer modificacao, por menor que seja, produz um hash totalmente diferente. E exatamente isso que torna o SRI eficaz: nao existe modificacao "pequena demais" para escapar da detecao.

## Trade-off: funcionalidade vs seguranca

Com SRI, se o arquivo for modificado:
- A funcionalidade que dependia daquele script vai quebrar (mascaras de formulario, por exemplo)
- MAS nao vai executar codigo malicioso

O instrutor reconhece: "vai quebrar a funcionalidade e tal, vai dar um defeito ali, mas nao vai executar o codigo do hacker, que e o que voce quer que aconteca."

Esse e o trade-off correto: melhor perder funcionalidade do que executar codigo malicioso.