# Code Examples: Fieldset

## Exemplo 1: Fieldset básico (da aula)

```html
<form>
  <fieldset>
    <legend>Contato</legend>
    <input type="text" name="nome">
    <input type="email" name="email">
    <button type="submit">Enviar</button>
  </fieldset>
</form>
```

**Resultado:** Renderiza com borda visual ao redor do grupo, legend aparece na borda superior.

## Exemplo 2: Fieldset com disabled (da aula)

```html
<form>
  <fieldset disabled>
    <legend>Contato</legend>
    <input type="text" name="nome">
    <input type="email" name="email">
    <button type="submit">Enviar</button>
  </fieldset>
</form>
```

**Resultado:** Todos os campos ficam cinza/não-clicáveis. O botão também fica desabilitado. Ao submeter (se possível por outro meio), nome e email NÃO são enviados.

## Exemplo 3: Múltiplos fieldsets (da aula)

```html
<form>
  <fieldset disabled>
    <legend>Contato</legend>
    <input type="text" name="nome">
    <input type="email" name="email">
  </fieldset>

  <fieldset>
    <legend>Dados Bancários</legend>
    <input type="text" name="banco" value="Banco A">
  </fieldset>

  <button type="submit">Enviar</button>
</form>
```

**Resultado ao submeter:** Apenas `banco=Banco+A` aparece na URL/body. Nome e email são ignorados porque o fieldset está disabled. O botão submit está fora dos fieldsets, então funciona normalmente.

## Exemplo 4: Removendo disabled para enviar todos os dados

```html
<form>
  <fieldset>
    <legend>Contato</legend>
    <input type="text" name="nome" value="Mike">
    <input type="email" name="email" value="mike@email.com">
  </fieldset>

  <fieldset>
    <legend>Dados Bancários</legend>
    <input type="text" name="banco" value="Banco A">
  </fieldset>

  <button type="submit">Enviar</button>
</form>
```

**Resultado ao submeter:** `nome=Mike&email=mike%40email.com&banco=Banco+A` — todos os dados são enviados.

## Exemplo 5: Formulário de cadastro completo

```html
<form action="/cadastro" method="POST">
  <fieldset>
    <legend>Dados Pessoais</legend>
    <label for="nome">Nome completo</label>
    <input type="text" id="nome" name="nome" required>

    <label for="cpf">CPF</label>
    <input type="text" id="cpf" name="cpf" required>

    <label for="nascimento">Data de nascimento</label>
    <input type="date" id="nascimento" name="nascimento">
  </fieldset>

  <fieldset>
    <legend>Endereço</legend>
    <label for="cep">CEP</label>
    <input type="text" id="cep" name="cep">

    <label for="rua">Rua</label>
    <input type="text" id="rua" name="rua">

    <label for="cidade">Cidade</label>
    <input type="text" id="cidade" name="cidade">
  </fieldset>

  <fieldset>
    <legend>Acesso</legend>
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>

    <label for="senha">Senha</label>
    <input type="password" id="senha" name="senha" required>
  </fieldset>

  <button type="submit">Cadastrar</button>
</form>
```

## Exemplo 6: Fieldset com readonly vs disabled

```html
<form>
  <!-- readonly: campos não editáveis MAS dados são enviados -->
  <fieldset>
    <legend>Plano Atual (não editável)</legend>
    <input type="text" name="plano" value="Premium" readonly>
    <input type="text" name="valor" value="99.90" readonly>
  </fieldset>

  <!-- disabled: campos não editáveis E dados NÃO são enviados -->
  <fieldset disabled>
    <legend>Plano Anterior (apenas visual)</legend>
    <input type="text" name="plano_anterior" value="Basic">
    <input type="text" name="valor_anterior" value="49.90">
  </fieldset>

  <button type="submit">Confirmar</button>
</form>
```

**Resultado ao submeter:** `plano=Premium&valor=99.90` — dados do readonly são enviados, dados do disabled não.