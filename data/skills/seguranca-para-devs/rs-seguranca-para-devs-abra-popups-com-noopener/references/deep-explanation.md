# Deep Explanation: Abra Pop-ups com noopener

## Por que iframes e janelas sao um campo comum de ataques

O instrutor enfatiza que aplicacoes modernas frequentemente integram servicos de terceiros — help desks, canais de atendimento, CMSs para paginas institucionais. Cada integracao que abre em pop-up ou iframe com origem diferente expande a superficie de ataque. Uma vulnerabilidade em qualquer uma dessas partes pode comprometer a aplicacao principal.

### Cenarios reais mencionados

1. **Servico de atendimento terceirizado** — abre num pop-up quando o usuario clica em "canal de atendimento". Se a plataforma terceira tiver uma vulnerabilidade, pode impactar sua aplicacao via `opener`.

2. **CMS para paginas institucionais** — instalado no servidor para gerenciar FAQ, politica de privacidade, termos de uso. Como e "um negocio que voce mexe pouco", o CMS fica desatualizado. Um dia surge um problema de seguranca nesse CMS, e a forma como voce abre essas paginas faz com que a falha se propague para sua aplicacao.

## O ataque: Tab-nabbing

Quando `window.open()` e chamado sem `noopener`, a janela aberta recebe a propriedade `opener` apontando para a janela pai. O instrutor demonstrou ao vivo:

```javascript
// Na janela aberta:
opener                    // → Window (a janela pai)
opener.location.href      // → URL onde o usuario esta
opener.alert('teste')     // → Executa alert na janela pai
opener.eval('codigo')     // → Executa JavaScript arbitrario na janela pai
```

O ataque tab-nabbing funciona assim:
1. Atacante encontra uma pagina vulneravel a script injection (parte mais fraca da infraestrutura)
2. Faz com que outra pagina abra essa pagina vulneravel
3. Usa `opener` para acessar e manipular a pagina original
4. Pode redirecionar o usuario para uma pagina de phishing: `opener.location.href = 'https://fake-login.com'`

## Correcao dos navegadores vs. responsabilidade do dev

O instrutor menciona que os navegadores corrigiram esse problema para links normais (clicar com Ctrl, botao direito > nova aba). Nesses casos, `opener` ja e `null`. Porem, quando voce usa `window.open()` via JavaScript, o `opener` ainda e preenchido por padrao. Por isso a responsabilidade e do desenvolvedor.

## A solucao: terceiro parametro

```javascript
window.open(url, nomeJanela, propriedades)
```

- **Primeiro parametro:** URL
- **Segundo parametro (opcional):** nome da janela
- **Terceiro parametro (opcional):** propriedades da janela (noopener, width, height, etc.)

Ao passar `noopener` no terceiro parametro, `opener` sera `null` na janela aberta.

## Filosofia do instrutor

> "Esse nivel de paranoia e o que faz a gente diminuir a superficie de ataque, diminuir o tipo de coisas que um agressor pode tentar. Um comandinho extra ali, vale a pena ser paranoico com essas coisas."

A mensagem central: o custo de adicionar `noopener` e zero (um parametro extra), mas o beneficio de seguranca e significativo. Sempre prefira ser paranoico com seguranca.