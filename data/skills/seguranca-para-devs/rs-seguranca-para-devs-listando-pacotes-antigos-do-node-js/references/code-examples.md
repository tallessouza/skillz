# Code Examples: Auditoria de Pacotes Node.js com Retire.js

## Instalacao global do retire

```bash
npm install -g retire
```

Se ja estiver instalado, o comando executa rapidamente.

## Execucao basica em um projeto

```bash
# Navegar ate o projeto
cd old-project

# Executar retire (output vai para stderr)
retire
```

O retire vai:
1. Ler o repositorio de vulnerabilidades do GitHub do retire.js
2. Varrer o projeto inteiro
3. Listar pacotes com vulnerabilidades conhecidas

## Salvando relatorio em arquivo

### Tentativa incorreta (nao captura output)
```bash
# NAO funciona — retire usa stderr, nao stdout
retire > report.txt
```

### Forma correta
```bash
# Redirecionar stderr para stdout, depois salvar
retire 2>&1 > report.txt
```

Explicacao do redirecionamento:
- `2` = stderr (file descriptor de erro)
- `>&1` = redirecionar para stdout (file descriptor 1)
- `> report.txt` = salvar stdout em arquivo

## Exemplo de output do retire

```
gaze > helpers > lodash 1.0.1
lodash 1.0.1 has known vulnerabilities:
  severity: medium
  info: https://github.com/nicktall/retire.js/...

vue 2.7.16
vue 2.7.16 has known vulnerabilities:
  severity: low
  severity: low
  severity: low
  (lista extensa de vulnerabilidades)
```

Observe que o output mostra a cadeia de dependencias: `gaze > helpers > lodash`. Isso significa que voce nao instalou lodash diretamente — ele veio como dependencia transitiva do gaze.

## Opcoes adicionais do retire

```bash
# Salvar em formato JSON
retire --outputformat json --outputpath report.json

# Salvar em outros formatos suportados
retire --outputformat text --outputpath report.txt
```

O instrutor menciona que o retire tem diversas opcoes de formato de saida, e que o tema sera aprofundado em uma aula dedicada a gestao de dependencias.

## Uso pratico recomendado

```bash
# 1. Instalar retire globalmente (uma vez)
npm install -g retire

# 2. Para cada projeto Node.js antigo:
cd /path/to/project
retire 2>&1 > security-audit-$(date +%Y%m%d).txt

# 3. Analisar o relatorio
cat security-audit-*.txt | grep "severity: high"
cat security-audit-*.txt | grep "severity: medium"

# 4. Agir sobre vulnerabilidades encontradas
npm update <pacote-vulneravel>
# ou
npm install <pacote-vulneravel>@latest
```

## Comparacao de ecossistemas mencionados

| Ecossistema | Gerenciador | Risco relativo |
|-------------|-------------|----------------|
| Node.js | npm | Alto — muitas dependencias, JS exposto no front |
| PHP | Composer | Medio |
| Ruby | RubyGems | Medio |
| Rust | Cargo | Menor |
| Python | PyPI | Medio |