# Deep Explanation: Listando Agendamentos e Tratativa de Erros

## Por que passar dados via props do server component?

O instrutor mostra uma transicao importante: sair de dados mockados para dados reais. No Next.js App Router, o server component busca os dados no servidor e passa como props para o client component. Isso elimina a necessidade de `useEffect` + `useState` para fetch, simplifica o codigo e garante que os dados estejam disponiveis no primeiro render.

O instrutor menciona: "a gente não vai utilizar o nosso dado mocado mais" — esse e o momento em que a aplicacao passa de prototipo para funcional.

## Estrutura do retorno da server action

A server action do Next.js pode retornar diferentes formatos. No caso da aplicacao Pet Shop, ela retorna:
- `undefined` quando tudo da certo (sem erro)
- `{ error: string }` quando ha uma falha de validacao

O instrutor destaca dois cenarios de erro especificos:
1. **Horario ja reservado** — "Esse horário já está reservado"
2. **Fora do horario de atendimento** — "Agendamento só pode ser feitos..." com descricao das regras

Esses erros vem do backend e sao exibidos diretamente no toast, sem necessidade de traduzir ou reformatar no frontend.

## O padrao if/return para erros

O instrutor usa um padrao simples e eficaz:

```typescript
const result = await createAppointment(formData)

if (result?.error) {
  toast.error(result.error)
  return  // IMPORTANTE: para a execucao aqui
}

// Codigo de sucesso so executa se nao houver erro
toast.success("Agendamento criado!")
form.reset()
```

O `return` apos o toast de erro e crucial — sem ele, o fluxo de sucesso executaria mesmo com erro, mostrando dois toasts e limpando o formulario indevidamente.

## Problema de revalidacao mencionado

O instrutor nota: "ele não tá fechando, né? Também não tá atualizando ainda" — apos criar um agendamento, a lista nao atualiza automaticamente. Precisa de F5. Isso e resolvido com `revalidatePath` ou `revalidateTag` na server action, que sera abordado em aulas futuras. O instrutor chama isso de "um ponto do Next que é muito massa".

## Estilizacao do estado vazio

Para a mensagem "nenhum agendamento", o instrutor aplica classes utilitarias:
- `text-sm` — tamanho pequeno
- `text-content-secondary` — cor secundaria (provavelmente custom)
- `px-5` — padding horizontal
- `py-5` — padding vertical

Isso garante que o estado vazio nao fique visualmente "perdido" na interface.