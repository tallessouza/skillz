# Deep Explanation: Convidar Novo Usuario

## Filosofia do layout inline

O instrutor escolhe deliberadamente colocar email, select de role e botao na mesma linha. A razao e que convites sao acoes rapidas e repetitivas — o admin pode querer convidar 5 pessoas seguidas. Um form vertical com labels ocupa espaco demais e cria friccao visual desnecessaria para uma acao tao simples.

O truque e usar `flex items-center gap-2` na div container e `flex-1` no campo de email para que ele ocupe o espaco restante, enquanto o select de role e o botao mantêm tamanho fixo.

## Por que nao mostrar mensagem de sucesso

O instrutor faz uma reflexao importante sobre UX: quando o resultado de uma acao ja e visivel na interface (o convite aparece na lista abaixo), adicionar um toast ou alert de sucesso e redundante. O usuario ja percebe que funcionou porque "da um pulinho na interface" quando o novo item aparece.

Isso contrasta com acoes onde o resultado nao e imediatamente visivel (ex: salvar configuracoes), onde um feedback explicito e necessario.

## RequestFormReset do ReactDOM

Em vez de resetar campo por campo com `useState`, o instrutor usa `RequestFormReset` que e uma API do ReactDOM especificamente desenhada para resetar forms apos server actions. Isso e mais limpo e funciona com todos os campos do form automaticamente, incluindo o select que voltara ao `defaultValue`.

## Reaproveitamento de codigo como metodologia

O instrutor explicitamente copia o `project-form` como base e adapta. Isso nao e preguica — e uma metodologia. Ao copiar um form que ja funciona, voce herda:
- O padrao de error handling
- A integracao com `useFormState`
- O layout base dos componentes UI
- Os imports corretos

Depois adapta os campos especificos. Isso e mais rapido e menos propenso a erros do que criar do zero.

## Bug do split de email no backend

O instrutor menciona um bug real que encontrou: na API de create invite, havia logica para verificar o dominio do email (para auto-join de membros da mesma organizacao). O bug era que faltava o `.split('@')` no email — estava pegando o segundo caractere do email como dominio em vez do dominio real.

Isso ilustra a importancia da feature de auto-join: se a organizacao tem a opcao "auto join new members" habilitada e o email do convidado tem o mesmo dominio da organizacao, a API retorna um erro informando que usuarios daquele dominio entram automaticamente, sem necessidade de convite.

## Cache invalidation com revalidateTag

O padrao usado e `revalidateTag(\`\${currentOrg}/invites\`)`. O formato `{org}/invites` permite invalidar apenas os invites daquela organizacao especifica, sem afetar o cache de outras orgs. Isso e consistente com o padrao usado em `getInvites` onde a mesma tag e definida.

## Estrutura da server action

A action segue o padrao do projeto:
1. Parse dos dados com zod schema
2. Obtencao do `currentOrg` do contexto
3. Chamada HTTP para a API (`createInvite`)
4. `revalidateTag` para atualizar o cache
5. Retorno de sucesso ou erro formatado

A camada HTTP (`create-invite.ts`) segue o padrao RESTful: `POST /organizations/{slug}/invites` enviando `email` e `role` no body.