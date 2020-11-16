<template>
  <div class="box">
    <div v-if="lang == 'enUS'" class="content">
      <div id="sec-privacy">
        <div class="secTitle">Privacy Policy</div>
      </div>
    </div>
    <div v-if="lang == 'ptBR'" class="content">
      <div id="sec-privacy">
        <div class="secTitle">Políticas de Privacidade</div>
        <p>
          Esta ferramenta pode coletar dados de seus usuários para fins de (a) avaliação nos exercícios e (b) pesquisas futuras.
           No segundo caso (b), o material exportado a nossos parceiros não possui dados sensíveis como nome ou identificador em 
           sua instituição de ensino. Caso o usuário não se sinta confortável em fornecer informações detalhadas sobre seu perfil de
           uso, basta desabilitar este mecanismo nas <router-link to="/user">configurações de perfil</router-link> a qualquer momento.
        </p>
        <p>
          A gestão do banco de dados gerado pela ferramenta é de total responsabilidade de seu provedor e não dos desenvolvedores da
          ferramenta. Portanto, contate-o para quaisquer dúvidas ou esclarecimentos quanto a este aspecto.
        </p>
      </div>
    </div>
    <div class="textBy">
      <p>{{uiText.textThanks}}</p>
      <div class="listParther">
        <ul>
          <li>
            <img src="../assets/logo.png" width="32px"><br>
            Vue.JS
          </li>
          <li>
            <img src="../assets/unb_logo.png" width="32px"><br>
            UnB
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import About from './about'
export default About
</script>

<style lang="scss" scoped>
  .box {
    max-width: 520px;
    margin: 2em auto 0 auto;
  }

  .secTitle{
    font-weight: bold;
    font-size: x-large;
  }

  .textBy {
    text-align: center;
    font-size: small;
  }

  .listParther {
    ul {
      list-style-type: none;
      margin: 0 0;
    }
    li {
      display: inline-block;
    }
    li + li {
      margin-left: 1em;
    }
  }
</style>