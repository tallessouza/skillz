# Code Examples: Tecnologias Basicas da Web

## Frontend: a triade em acao

### HTML — Estrutura

```html
<!-- HTML transforma texto puro em conteudo navegavel -->
<!-- A "grande sacada" do instrutor: links, imagens, videos -->

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Minha Pagina</title>
</head>
<body>
  <h1>Titulo da Pagina</h1>
  <p>Texto puro, como pagina de um livro.</p>

  <!-- A diferenca: links que levam a outras paginas -->
  <a href="https://skillz.com.br">Ir para Skillz</a>

  <!-- Imagens e videos que texto puro nao suporta -->
  <img src="foto.jpg" alt="Descricao da imagem">
  <video src="video.mp4" controls></video>
</body>
</html>
```

### CSS — Estilo (a "beleza")

```css
/* CSS transforma HTML "feio" em algo bonito */
/* Sem CSS: texto preto em fundo branco, sem formatacao */

body {
  font-family: 'Inter', sans-serif;
  background-color: #121214;
  color: #e1e1e6;
  margin: 0;
  padding: 2rem;
}

h1 {
  color: #00b37e;
  font-size: 2rem;
}

a {
  color: #81d8f7;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
```

### JavaScript — Inteligencia (interacao)

```javascript
// JavaScript ja esta no navegador — nao precisa instalar nada
// Ele adiciona "inteligencia" a estrutura (HTML) e beleza (CSS)

// Exemplo: interacao com o usuario
const botao = document.querySelector('#meuBotao')

botao.addEventListener('click', () => {
  alert('Voce interagiu com o site!')
})

// Exemplo: modificar estrutura (HTML) dinamicamente
const lista = document.querySelector('#listaUsuarios')

const usuarios = ['Ana', 'Bruno', 'Carla']
usuarios.forEach(usuario => {
  const item = document.createElement('li')
  item.textContent = usuario
  lista.appendChild(item)
})

// Exemplo: modificar estilo (CSS) dinamicamente
const card = document.querySelector('.card')
card.style.backgroundColor = '#00b37e'
```

## Backend: JavaScript fora do navegador

### Node.js — JS no servidor

```javascript
// JavaScript, por padrao, esta no browser (Chrome, Firefox, Safari)
// Node.js permite rodar JS "sem precisar daqueles carinhas" (navegadores)

// Servidor HTTP basico com Node.js
const http = require('node:http')

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ message: 'Backend rodando com JavaScript!' }))
})

server.listen(3333, () => {
  console.log('Servidor rodando na porta 3333')
})
```

## Banco de dados: guardando dados com seguranca

### SQL — Linguagem de consulta relacional

```sql
-- SQL: "guardar dados e consulta-los, pegar esses dados de volta"
-- "Maneira segura de guardar dados no backend"

-- Criar tabela para armazenar usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Guardar dados
INSERT INTO usuarios (nome, email)
VALUES ('Ana Silva', 'ana@email.com');

-- Consultar dados (pegar de volta)
SELECT nome, email FROM usuarios WHERE id = 1;
```

### NoSQL — Abordagem nao-relacional

```javascript
// NoSQL (N-O-S-Q-L como o instrutor soletra)
// Outra maneira de guardar e proteger dados

// Exemplo com MongoDB (documento JSON)
const usuario = {
  nome: 'Ana Silva',
  email: 'ana@email.com',
  criadoEm: new Date()
}

// Guardar
await collection.insertOne(usuario)

// Consultar
const resultado = await collection.findOne({ email: 'ana@email.com' })
```

## Visualizando a stack completa

```
Navegador (Frontend)
┌─────────────────────────────────┐
│  HTML ── estrutura do conteudo  │
│  CSS ─── aparencia visual       │
│  JS ──── interacao e logica     │
└──────────────┬──────────────────┘
               │ requisicao HTTP
               ▼
Servidor (Backend)
┌─────────────────────────────────┐
│  Node.js / Java / Python / C#  │
│  (processa a requisicao)        │
│           │                     │
│           ▼                     │
│  Banco de Dados (SQL / NoSQL)   │
│  (guarda e consulta dados)      │
└─────────────────────────────────┘
```