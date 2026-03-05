# Code Examples: Sistemas Operacionais

## Verificando informacoes do SO via terminal

### Linux/macOS
```bash
# Qual SO estou usando?
uname -a

# Quanto de memoria RAM disponivel?
free -h          # Linux
vm_stat          # macOS

# Quanto de disco disponivel?
df -h

# Quais processos estao rodando?
ps aux

# Uso de CPU e memoria em tempo real
top
htop             # versao melhorada (instalar separadamente)
```

### Windows (PowerShell)
```powershell
# Informacoes do SO
Get-ComputerInfo | Select-Object OsName, OsVersion

# Memoria disponivel
Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 10

# Disco disponivel
Get-PSDrive -PSProvider FileSystem
```

## Demonstrando a diferenca memoria vs disco

### Arquivo temporario (vive na RAM do processo)
```javascript
// Este dado existe APENAS na memoria do processo Node.js
// Se o processo morrer, o dado desaparece
let users = []
users.push({ name: 'Joao', email: 'joao@email.com' })
// 'users' vive na RAM — nao sobrevive a um restart
```

### Arquivo persistente (gravado no disco pelo SO)
```javascript
const fs = require('fs')

// Agora pedimos ao SO para gravar no disco
fs.writeFileSync('users.json', JSON.stringify(users))
// Mesmo que o processo morra, o arquivo persiste no disco
```

## Diferenca de paths entre SOs

```javascript
// Windows usa backslash
const winPath = 'C:\\Users\\dev\\project\\index.js'

// Linux/macOS usa forward slash
const unixPath = '/home/dev/project/index.js'

// Solucao cross-platform em Node.js
const path = require('path')
const safePath = path.join('home', 'dev', 'project', 'index.js')
// O modulo path usa o separador correto para o SO atual
```

## Verificando o SO em codigo (util para scripts cross-platform)

```javascript
const os = require('os')

console.log('SO:', os.platform())     // 'linux', 'darwin', 'win32'
console.log('Arquitetura:', os.arch()) // 'x64', 'arm64'
console.log('RAM total:', os.totalmem() / 1024 / 1024 / 1024, 'GB')
console.log('RAM livre:', os.freemem() / 1024 / 1024 / 1024, 'GB')
console.log('CPUs:', os.cpus().length)
console.log('Home dir:', os.homedir())
console.log('Temp dir:', os.tmpdir())
```

## Line endings — um bug classico causado por diferenca de SO

```bash
# Windows salva arquivos com \r\n (CRLF)
# Linux/macOS salva com \n (LF)

# Isso causa bugs em scripts bash vindos do Windows:
# "/bin/bash^M: bad interpreter"

# Solucao: configurar git para normalizar
git config --global core.autocrlf input   # Linux/macOS
git config --global core.autocrlf true    # Windows
```

## Permissoes de arquivo (conceito do SO)

```bash
# Linux/macOS — o SO controla quem pode ler/escrever/executar
ls -la index.js
# -rw-r--r-- 1 dev dev 1234 Jan 01 12:00 index.js
# owner: read+write | group: read | others: read

# Tornar um script executavel
chmod +x deploy.sh

# Windows nao usa o mesmo sistema de permissoes
# Por isso scripts .sh podem nao funcionar direto no Windows
```