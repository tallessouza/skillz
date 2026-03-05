# Code Examples: Plan Mode na Pratica

## Exemplo: Historico de Pesquisas com localStorage

### Contexto do projeto

O projeto permite ao usuario:
1. Inserir uma chave de API do Gemini
2. Selecionar um jogo
3. Fazer perguntas sobre builds/estrategias
4. Receber respostas da IA

### Problema identificado

Apos usar 5 vezes, o usuario precisa reescrever perguntas anteriores. Nao ha historico.

### Prompt usado no Plan mode

```
Crie um historico de pesquisas e salve no localStorage
```

### Perguntas geradas pelo Plan

```
1. Como deve ser armazenado?
   - Somente perguntas
   - Perguntas e respostas
   - Com o jogo selecionado
   - Com data e hora
   - Tudo acima ✓

2. Onde colocar o historico na UI?
   - Pop-up
   - Sidebar lateral ✓
   - Nova aba
   - Abaixo do formulario

3. Quais funcionalidades?
   - Clicar para reutilizar a pergunta ✓
   - Deletar itens individuais ✓
   - Limpar tudo ✓
   - Exportar historico

4. Limite de itens?
   - Sem limite
   - Ultimos 10 ✓
   - Ultimos 50
   - Configuravel pelo usuario
```

### Plano resultante (exemplo de output)

```markdown
## Plano: Historico de Pesquisas

### Passo 1: Definir estrutura de dados
- Criar interface para item do historico
- Campos: pergunta, resposta, jogo, timestamp

### Passo 2: Criar funcoes de localStorage
- Salvar item no historico
- Recuperar historico completo
- Deletar item individual
- Limpar todo historico
- Manter limite de 10 itens

### Passo 3: Criar componente Sidebar
- Sidebar lateral com lista de itens
- Botao de toggle para abrir/fechar
- Cada item mostra pergunta resumida + jogo + data

### Passo 4: Adicionar interacoes
- Click no item → preenche formulario com pergunta e jogo
- Botao de deletar por item
- Botao de limpar tudo com confirmacao

### Passo 5: Integrar com fluxo existente
- Apos receber resposta da IA, salvar no historico
- Atualizar sidebar em tempo real
```

### Fluxo de aprendizado apos o plano

```
1. Ler o plano completo
2. Tentar implementar Passo 1 sozinho
3. Se travou → Ask: "Como criar uma interface TypeScript para historico?"
4. Tentar Passo 2 sozinho
5. Se travou → Ask: "Como limitar array a 10 itens no localStorage?"
6. Continuar ate completar
7. Se desistir → Agent: gerar, depois Ask para explicar
```

### Exemplo de implementacao (o que voce tentaria sozinho)

```typescript
// Passo 1: Estrutura de dados
interface SearchHistoryItem {
  question: string
  answer: string
  game: string
  timestamp: Date
}

// Passo 2: Funcoes de localStorage
const STORAGE_KEY = 'search-history'
const MAX_ITEMS = 10

function saveToHistory(item: SearchHistoryItem): void {
  const history = getHistory()
  history.unshift(item)

  if (history.length > MAX_ITEMS) {
    history.pop()
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

function getHistory(): SearchHistoryItem[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function deleteFromHistory(index: number): void {
  const history = getHistory()
  history.splice(index, 1)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}
```

### O ponto-chave

O codigo acima e o que voce tentaria escrever **sozinho** apos ver o plano. O Plan mode te deu a estrutura; o Active Recall te forca a lembrar a sintaxe e os padroes. So se nao conseguir, voce pede ajuda ao Ask ou gera com Agent.