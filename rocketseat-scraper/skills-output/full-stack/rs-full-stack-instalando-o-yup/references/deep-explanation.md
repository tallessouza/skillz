# Deep Explanation: Validação com Yup + React Hook Form

## Por que validação baseada em schema?

O React Hook Form oferece integração nativa com validação baseada em schemas. A ideia é a mesma independente da biblioteca escolhida (Yup, Zod, Joi, SuperStruct): definir um esquema que descreve a estrutura e as regras dos dados, e deixar o resolver fazer a ponte entre o schema e o formulário.

A vantagem sobre validação inline (campo a campo no `register`) é centralização: todas as regras ficam num único objeto, fácil de ler, testar e reutilizar.

## Por que Yup em vez de Zod?

O instrutor faz uma escolha deliberada: como os alunos já aprenderam Zod no backend, usar Yup no frontend amplia o repertório. A mensagem é clara — **a ideia é a mesma, mesmo formato, mesma pegada**. Aprender múltiplas bibliotecas de schema validation confirma que o conceito é transferível entre ferramentas.

Na prática:
- **Zod** — mais popular em projetos TypeScript-first, inferência de tipos nativa
- **Yup** — mais estabelecido no ecossistema React Hook Form, API fluida e expressiva
- Ambos resolvem o mesmo problema de formas muito similares

## Arquitetura da integração

O fluxo é:

```
Schema (Yup) → Resolver (@hookform/resolvers) → useForm (React Hook Form)
```

1. **Yup** define as regras de validação como um objeto schema
2. **@hookform/resolvers** traduz o formato do Yup para o formato que o React Hook Form entende
3. **useForm** recebe o resolver e automaticamente valida os dados contra o schema

Isso significa que trocar de Yup para Zod é questão de mudar o import do resolver e reescrever o schema na sintaxe da outra biblioteca — o `useForm` não muda.

## Schema fora do componente

O instrutor declara o schema fora da função do componente. Isso é uma prática importante porque:
- O schema é um valor estático — não depende de props ou state
- Evita recriação do objeto a cada render
- Fica disponível para testes unitários independentes do componente

## Versões específicas

O instrutor fixa versões (`@3.9.1` e `@1.5.0`) para garantir compatibilidade. Em projetos reais, isso evita breaking changes inesperados. As versões indicadas são:
- `@hookform/resolvers@3.9.1`
- `yup@1.5.0`

## Conflito de tipos com schema vazio

Ao criar `yup.object({})` sem campos, o TypeScript pode reclamar porque o schema não corresponde aos campos registrados no formulário. Isso é esperado — o schema vazio é apenas o ponto de partida. Na aula seguinte, os campos são adicionados e o conflito desaparece.