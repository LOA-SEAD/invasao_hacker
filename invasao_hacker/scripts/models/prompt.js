/* PROMPT.js
 * 
 * DESCRICAO: define quais acoes tomar quando o jogador interage com o prompt
 * CRIADO EM: 09/01/2013
 */
define(['jquery'], function($) {
    var Prompt = {
        id: 0,
        UltimoComando: '',
        ComandosValidos: [
            'shutdown now -p',
            'apt-get install firewall',
            'apt-get moo',
            'whoami'
        ]
    }
    
    function privReiniciar(pUserName) {
        Prompt.id = 2;

        $('#console').html(
            '<span class="ConsNomeUsuario" aria-hidden="true" id="console-item-0">Sistema: </span> Tentando logar...<br />'+
            '<span class="ConsNomeUsuario" aria-hidden="true" id="console-item-1">Sistema: </span> Usuário confirmado. Logado como ' + pUserName +'!<br />'
        )

        $('#txt-prompt-cmd').val('') // Inicializa input do prompt

        $('#progInvasao')    .css('width', 0)
        $('#lbl-progInvasao').html('0%')
        return true
    }

    // Recebe uma mensagem e um agente e escreve no console
    function privImprimir(pMsg, pUsr) {
        if(!pMsg) // mensagem invalida. Nada a fazer.
            return false

        pUsr = pUsr || '<span lang="en-us">root</span>' // define a string 'root' como valor padrao
        
        $('#console').append('<span class="ConsNomeUsuario" aria-hidden="true" id="console-item-' + Prompt.id + '">'
            + pUsr + ':</span> <span tabindex="1" class="cons-msg">' + pMsg + '</span><br />')

        $('#console-item-' + (Prompt.id++))[0].scrollIntoView(true)
        return true
    }
    
    function privVerificarComandoValido(pEntrada) {
        if(!pEntrada)
            return false

        $('#txt-prompt-cmd').val('')

        // insercao de uma cadeia nao numerica e que nao pertence ao conjunto dos comandos validos
        if(isNaN(pEntrada) && Prompt.ComandosValidos.indexOf(pEntrada) == -1) { 
            privImprimir('Erro! Comando inserido não foi encontrado!', 'Sistema')
            return false
        }
        else {
            Prompt.UltimoComando = pEntrada
            return true
        }
    }

    function getUltimoComando() {
        return Prompt.UltimoComando
    }

    function getUltimaID() {
        return Prompt.id -1
    }

    return { // retorna elemento publico
        Reiniciar: privReiniciar,
        Imprimir: privImprimir,
        VerificarComandoValido: privVerificarComandoValido,

        getUltimoComando: getUltimoComando,
        getUltimaID: getUltimaID,
    }
})
