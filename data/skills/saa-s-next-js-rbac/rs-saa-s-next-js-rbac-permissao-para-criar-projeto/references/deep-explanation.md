# Deep Explanation: Permissao para Criar Projeto

## Por que verificar no server component?

O Diego enfatiza que a verificacao de permissao deve acontecer **dentro do server component da pagina**, nao em middleware ou client-side. Isso porque:

1. **Server components tem acesso direto ao contexto de autenticacao** — a funcao `ability()` retorna as permissoes do usuario atual sem necessidade de API calls adicionais
2. **O redirect acontece antes de qualquer HTML ser enviado** — o usuario nunca ve a pagina, nem por um flash
3. **Reutiliza o mesmo padrao do header** — o Diego menciona "da mesma forma que a gente fez no header", indicando que o pattern de acessar `permissions` dentro de server components ja e estabelecido na aplicacao

## O uso de `cannot()` vs `can()`

O Diego escolhe `cannot()` propositalmente:

```typescript
if (permissions.cannot('create', 'Project')) {
  redirect('/')
}
```

Isso e mais natural como "guard clause" — o codigo expressa "se NAO pode, saia". Se usasse `can()`, precisaria negar: `if (!permissions.can(...))`, que e menos legivel.

## Permissoes implicitas — quando NAO adicionar guard

Um insight importante do Diego: na aplicacao dele, **quem pode listar projetos automaticamente pode criar projetos**. Isso significa que o botao "Create Project" no `ProjectSwitcher` (que so aparece se o usuario pode listar projetos) ja esta implicitamente protegido.

O Diego reconhece: "eu poderia tambem fazer uma verificacao aqui dentro desse botao tambem, mas aqui nao vai ser necessario". Isso mostra maturidade — nao adicionar verificacoes redundantes que poluem o codigo sem ganho real de seguranca.

Porem, o guard na **pagina** de criacao ainda e necessario, porque o usuario pode digitar a URL diretamente no navegador, bypassing o botao.

## Teste manual demonstrado

O Diego testa acessando uma organizacao onde ele tem role de billing (`Acme billing`), copiando a URL de criar projeto e colando manualmente. O redirect funciona — ele e enviado de volta para a home. Isso valida que:

1. O guard funciona contra acesso direto por URL
2. O redirect e suave (nao mostra erro, apenas redireciona)
3. A permissao e avaliada corretamente por organizacao

## Relacao com CASL/ability

A funcao `ability()` retorna um objeto CASL que expoe `can()` e `cannot()`. Esse padrao vem da biblioteca `@casl/ability`, que e o padrao de RBAC utilizado no curso. O mesmo objeto e usado tanto em server components quanto potencialmente em API routes, mantendo a logica de permissao centralizada.