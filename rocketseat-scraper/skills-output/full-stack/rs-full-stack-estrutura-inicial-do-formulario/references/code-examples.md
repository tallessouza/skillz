# Code Examples: Estrutura Inicial de Formulários HTML

## Exemplo completo da aula

O formulário construído durante a aula, com todos os campos do fieldset "Informações da Criança":

```html
<main>
  <div>
    <p><!-- texto introdutório --></p>

    <form action="" method="post" enctype="multipart/form-data">
      <fieldset class="child-info">
        <legend>Informações da Criança</legend>

        <div class="input-wrapper">
          <label for="fullName">Nome completo</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Qual o nome da criança?"
          />
        </div>

        <div class="input-wrapper">
          <label for="birth">Data de nascimento</label>
          <input
            type="date"
            id="birth"
            name="birth"
            lang="pt-BR"
          />
        </div>

        <div class="select-wrapper">
          <label for="gender">Sexo</label>
          <select id="gender" name="gender">
            <option value="female">Feminino</option>
            <option value="male">Masculino</option>
            <option value="na">Prefiro não responder</option>
          </select>
        </div>

        <div class="textarea-wrapper">
          <label for="medicalInfo">Informações médicas</label>
          <textarea
            id="medicalInfo"
            name="medicalInfo"
            cols="30"
            rows="10"
            placeholder="Se a criança possui alguma condição médica que a escola deve estar ciente, especifique"
          ></textarea>
        </div>

        <div class="droparea-wrapper">
          <input type="file" id="birthFile" name="birthFile" />
          <img src="./assets/icons/cloud-upload.svg" alt="Upload" />
          <p>Clique aqui para<br />selecionar os arquivos</p>
        </div>
      </fieldset>
    </form>
  </div>
</main>
```

## Variação: Formulário de contato simples

Aplicando os mesmos padrões em outro contexto:

```html
<form action="/api/contact" method="post">
  <fieldset class="contact-info">
    <legend>Fale Conosco</legend>

    <div class="input-wrapper">
      <label for="contactName">Seu nome</label>
      <input type="text" id="contactName" name="contactName"
        placeholder="Como podemos te chamar?" />
    </div>

    <div class="input-wrapper">
      <label for="contactEmail">E-mail</label>
      <input type="email" id="contactEmail" name="contactEmail"
        placeholder="seu@email.com" />
    </div>

    <div class="select-wrapper">
      <label for="subject">Assunto</label>
      <select id="subject" name="subject">
        <option value="doubt">Dúvida</option>
        <option value="complaint">Reclamação</option>
        <option value="suggestion">Sugestão</option>
      </select>
    </div>

    <div class="textarea-wrapper">
      <label for="message">Mensagem</label>
      <textarea id="message" name="message" cols="30" rows="8"
        placeholder="Escreva sua mensagem aqui"></textarea>
    </div>
  </fieldset>
</form>
```

## Variação: Formulário com múltiplos fieldsets

Quando o formulário tem seções distintas:

```html
<form action="/api/enrollment" method="post" enctype="multipart/form-data">
  <fieldset class="child-info">
    <legend>Informações da Criança</legend>
    <!-- campos da criança -->
  </fieldset>

  <fieldset class="guardian-info">
    <legend>Informações do Responsável</legend>

    <div class="input-wrapper">
      <label for="guardianName">Nome do responsável</label>
      <input type="text" id="guardianName" name="guardianName"
        placeholder="Nome completo do responsável" />
    </div>

    <div class="input-wrapper">
      <label for="guardianPhone">Telefone</label>
      <input type="tel" id="guardianPhone" name="guardianPhone"
        placeholder="(11) 99999-9999" />
    </div>

    <div class="input-wrapper">
      <label for="guardianEmail">E-mail</label>
      <input type="email" id="guardianEmail" name="guardianEmail"
        placeholder="email@exemplo.com" />
    </div>
  </fieldset>

  <fieldset class="address-info">
    <legend>Endereço</legend>

    <div class="input-wrapper">
      <label for="street">Rua</label>
      <input type="text" id="street" name="street" />
    </div>

    <div class="input-wrapper">
      <label for="city">Cidade</label>
      <input type="text" id="city" name="city" />
    </div>
  </fieldset>
</form>
```

## Padrão wrapper isolado — referência rápida

```html
<!-- Input de texto -->
<div class="input-wrapper">
  <label for="{id}">{Label}</label>
  <input type="text" id="{id}" name="{name}" placeholder="{hint}" />
</div>

<!-- Input de data -->
<div class="input-wrapper">
  <label for="{id}">{Label}</label>
  <input type="date" id="{id}" name="{name}" lang="pt-BR" />
</div>

<!-- Select -->
<div class="select-wrapper">
  <label for="{id}">{Label}</label>
  <select id="{id}" name="{name}">
    <option value="{val}">{Text}</option>
  </select>
</div>

<!-- Textarea -->
<div class="textarea-wrapper">
  <label for="{id}">{Label}</label>
  <textarea id="{id}" name="{name}" cols="30" rows="10"
    placeholder="{hint}"></textarea>
</div>

<!-- File upload -->
<div class="droparea-wrapper">
  <input type="file" id="{id}" name="{name}" />
  <p>Clique para selecionar arquivos</p>
</div>
```