/* CHAT.js
 * 
 * DESCRICAO: define o objeto Email.
 * CRIADO EM: 09/01/2013
 */
define(['jquery', './const'], function($, CONST) {
    var Email = {
        NumMsg:                0,
        permanecerFechado: false,
        listaMensagens:null,
        listaAmigos:null
    }
	
    /*
     * function privReceberMensagem( pMsg, pAmigo, pTempoEspera )
     * Parametros:
     *     @pMsg: mensagem que ja esta definida em Email.listaMensagens
	 *     @pAmigo: opcional. Caso nao seja informado, um amigo sera sorteado.
	 *	   @pTempoEspera: opcional. Define o tempo de espera (milissegundos) ate exibir a mensagem.
	 *		Caso nao seja informado, infere-se zero.
     * 
     * Retorna: true, se mensagem ee valida e foi inserida no email. Falso caso contrario
     */	
    function privReceberMensagem( pMsg, pAmigo, pTempoEspera ) {
        
        // amigo     = um amigo definido ou um qualquer randomico
        var amigo    = Email.listaAmigos [pAmigo] || Email.listaAmigos[~~(Math.random() *10) %Email.listaAmigos.length]
        var msg      = Email.listaMensagens[pMsg] || pMsg // msg = uma mensagem pre-definida ou uma qualquer diferente de nulo.
		var $elemMsg = null

        if (!msg)	return false // mensagem invalida. Nada a fazer.
        
		pTempoEspera = !isNaN(pTempoEspera) && pTempoEspera > 0 ? pTempoEspera : 0
		
        Email.NumMsg++

        $elemMsg = $('<div />', {
            id: 'msg-' +Email.NumMsg,
            class: 'msg-item'
        })
        .html(
            '<div class="msg-amigo">'
            +'<i class="icon-user"></i> <strong>' +amigo +'</strong>, <span class="msg-tempo">' +$('#spn-tempo').html()
            +'</span></div>'
            +'<div class="msg-corpo"><i class="icon-envelope"></i> ' +msg +'</div>'
            +'</div>'
        )
        .hide()

        $('#email-lista-msg').prepend($elemMsg)
		
		setTimeout(function() {
			$('#email').slideDown(200, function() { $elemMsg.slideDown() })
			
			if (Email.permanecerFechado)
				setTimeout(function() { $('#email').slideUp(200) }, 5000)
		}, pTempoEspera)
        
        return true
    }

    /*
     * function privReiniciarEmail()
     * Retorna: true
     */ 
    function privReiniciar() {
        Email.NumMsg            = 0
        Email.permanecerFechado = false

        Email.listaMensagens = CONST.EMAIL.MSG
        Email.listaAmigos    = CONST.EMAIL.LIST_AMIGOS

        $('#email-lista-msg').empty()
        $('#email') .hide()
    }

    function privTrocPermFechado() {
        Email.permanecerFechado = !Email.permanecerFechado
    }
        
    return { // retorna elemento publico
        Reiniciar: privReiniciar,
        ReceberMensagem: privReceberMensagem,
        TrocFechado: privTrocPermFechado
    }
})