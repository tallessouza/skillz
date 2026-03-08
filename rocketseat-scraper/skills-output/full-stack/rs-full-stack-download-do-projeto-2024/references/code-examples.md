# Code Examples: Scaffold de Projeto React com Formulários

## Estrutura completa do formulário no template

```tsx
// App.tsx
export function App() {
  return (
    <div>
      <h1>Cadastro de Evento</h1>

      <form>
        {/* Campo: Nome do evento */}
        <label htmlFor="nome">Nome do evento</label>
        <input type="text" id="nome" name="nome" />
        <span className="error">Nome obrigatório</span>

        {/* Campo: Data */}
        <label htmlFor="data">Data</label>
        <input type="date" id="data" name="data" />

        {/* Campo: Tema (select) */}
        <label htmlFor="tema">Tema</label>
        <select id="tema" name="tema">
          <option value="evento">Evento</option>
          <option value="palestra">Palestra</option>
        </select>

        {/* Campo: Descrição (textarea) */}
        <label htmlFor="descricao">Descrição</label>
        <textarea id="descricao" name="descricao" placeholder="Um pouco sobre o evento" />

        {/* Botão de envio */}
        <button type="submit">Salvar</button>
      </form>
    </div>
  )
}
```

## CSS da classe de erro

```css
/* Estilo para mensagens de validação */
.error {
  color: red;
  font-size: 12px;
  margin-left: 7px;
}
```

## Comandos de setup completos

```bash
# 1. Download do template
git clone https://github.com/rocketseat-education/fullstack-react-template-forms.git

# 2. Renomear pasta
mv fullstack-react-template-forms fullstack-react-forms

# 3. Entrar no projeto
cd fullstack-react-forms

# 4. Instalar dependências
npm install

# 5. Rodar dev server
npm run dev

# 6. Abrir no navegador (Vite default)
# http://localhost:5173
```

## Variação: Setup com yarn ou pnpm

```bash
# Com yarn
yarn install
yarn dev

# Com pnpm
pnpm install
pnpm dev
```

## Verificação rápida no terminal

```bash
# Confirmar que o projeto está rodando
curl -s http://localhost:5173 | head -20

# Verificar se node_modules foi criado
ls node_modules | head -5
```

## Próximos passos (preparação para as próximas aulas)

O formulário está pronto para receber:

```tsx
// 1. Estado controlado com useState
const [nome, setNome] = useState('')

// 2. Handler de submit
function handleSubmit(event: FormEvent) {
  event.preventDefault()
  // validação e envio
}

// 3. Validação condicional nos spans de erro
<span className="error">
  {errors.nome && 'Nome obrigatório'}
</span>
```