# Deep Explanation: Passando Métodos como Props em Componentes React

## Raciocínio do instrutor

O instrutor constrói o conceito de forma incremental: primeiro lembra que props podem ser strings, números e booleanos (dados primitivos), depois revela que **métodos também podem ser passados como propriedades**. A mensagem central é que componentes React não recebem apenas dados — recebem **comportamento**.

## O que acontece por baixo

Quando você escreve:

```tsx
<Button onClick={() => alert('Criado!')} />
```

O React passa essa arrow function como uma propriedade comum no objeto `props`. Não há mágica — é JavaScript passando uma função como argumento para outra função (o componente). O componente então decide o que fazer com ela.

## Props são a API do componente

O instrutor demonstra que o componente `Button` cria sua própria prop `onClick` — que **não é** o `onClick` nativo do HTML. É uma prop customizada que **por convenção** tem o mesmo nome. Dentro do componente, essa prop é explicitamente repassada para o `onClick` do `<button>` nativo:

```tsx
function Button({ title, onClick }: ButtonProps) {
  return <button onClick={onClick}>{title}</button>
}
```

Esse padrão de "receber e repassar" é fundamental: o componente age como intermediário, controlando quais eventos o pai pode escutar.

## Por que usar `?` (opcional)

O instrutor destaca que usar `onClick?` com interrogação torna a prop opcional. Isso significa que o componente pode ser usado sem passar um handler:

```tsx
<Button title="Desabilitado" />  // Sem onClick — válido
<Button title="Ativo" onClick={() => doSomething()} />  // Com onClick — válido
```

O TypeScript garante que ambos os usos são seguros em tempo de compilação.

## Por que `() => void` e não `Function`

A notação `() => void` é precisa:
- Diz que a função não recebe parâmetros
- Diz que não retorna nada útil
- O TypeScript valida a assinatura no momento do uso

Usar `Function` aceita qualquer coisa — perde toda a segurança de tipos.

## Analogia: componente como controle remoto

O componente é como um controle remoto com botões. As props de dados (title, color) configuram a **aparência**. As props de callback (onClick, onSubmit) configuram o **comportamento**. O pai decide o que cada botão faz; o controle remoto apenas executa.

## Edge cases

### Callback com parâmetros
Quando o filho precisa enviar dados para o pai:

```tsx
interface InputProps {
  onChange?: (value: string) => void
}

function Input({ onChange }: InputProps) {
  return <input onChange={(e) => onChange?.(e.target.value)} />
}
```

Aqui o `?.` (optional chaining) é necessário porque `onChange` é opcional.

### Múltiplos callbacks
Componentes complexos podem receber vários callbacks:

```tsx
interface ModalProps {
  onConfirm: () => void
  onCancel: () => void
  onClose?: () => void
}
```

### Callback com evento nativo
Quando precisa acessar o evento original:

```tsx
interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}
```

## Conexão com outros conceitos

- **Lifting state up**: callbacks são o mecanismo pelo qual filhos comunicam mudanças para pais
- **Composição**: componentes reutilizáveis recebem comportamento via callbacks em vez de implementar lógica interna
- **Inversão de controle**: o pai controla O QUE acontece, o filho controla QUANDO acontece