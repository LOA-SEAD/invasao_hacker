define(['jquery', 'jquery.accessWidgetToolkit.AccessButton'], function ( $ ) {

    var $controles,
        $btnTrocarMudo,

    listaSons = {
        menu: {
            arquivo: 'invasao_hacker/audio/menu',
            repetir: true,
        },
        jogo: {
            arquivo: 'invasao_hacker/audio/jogo',
            repetir: true,
        },
        acerto: {
            arquivo: 'invasao_hacker/audio/acerto',
            repetir: false,
        },
        erro: {
            arquivo: 'invasao_hacker/audio/erro',
            repetir: false,
        },
        prompt_notification: {
            arquivo: 'invasao_hacker/audio/prompt_notification',
            repetir: false,

        },
        falha: {
            arquivo: 'invasao_hacker/audio/falha',
            repetir: false,

        },
        derrota: {
            arquivo: 'invasao_hacker/audio/derrota',
            repetir: false,

        },
        erro_upgrade: {
            arquivo: 'invasao_hacker/audio/erro_upgrade',
            repetir: false,

        },
        upgrade: {
            arquivo: 'invasao_hacker/audio/upgrade',
            repetir: false,

        },
    }
    
    function suportaAudioElement() {
        return 'undefined' !== typeof document.createElement('audio').canPlayType
    }

    function suportaOgg() {
        return new Audio().canPlayType('audio/ogg') !== ''
    }

    function iniciarSom( _som ) {
        var atualEl = listaSons[_som].el

        // undefined sound file or atualently muted
        if ( atualEl === undefined )
            return false

        atualEl.play()
        return true
    }

    function pararSom( _som ) {
        if ( _som == 'todos' || _som == 'all' || _som == 'a' ) {
            for ( var atual in listaSons ) {
                listaSons[atual].el.pause()
            }
        } else {
            var atual = listaSons[_som].el
            
            if ( atual === undefined )
                return false // arquivo de som indefinido, retorna um erro

            atual.pause()
        }
        return true
    }
        
    function salvaEstadoAtualEInterrompe() {
        for ( var atual in listaSons ) {
            // salva estado anterior
            listaSons[atual].estadoAnterior = listaSons[atual].el.paused
                ? 'paused'
                : 'playing'
            listaSons[atual].el.pause()
        }
    }

    function retomarEstadoAnterior() {
        for ( var atual in listaSons ) {
            if ( listaSons[atual].estadoAnterior == 'playing' )
                listaSons[atual].play()
        }
    }

    /* 
     * se _estadoForcado esta definido, forca que ele seja o proximo estado
     * a aplicado aos sons. Caso contrario inverte mudo de cada som.
     */
    function trocarMudo( _estadoForcado ) {
        for ( var atual in listaSons ) {
            listaSons[atual].el.muted = typeof _estadoForcado == 'boolean'
                                     ? _estadoForcado
                                     : ! listaSons[atual].el.muted
        }

        $btnTrocarMudo.html(
            $btnTrocarMudo.html() == '<i class="icon-music"></i> som'
            ? '<i class="icon-remove"></i> mudo'
            : '<i class="icon-music"></i> som'
        )
    }

    /*
     * Closure de inicializacao
     * 
     * Cria elementos de audios definidos pelo array listaSons
     * e adiciona elementos de controle ao html
     */
    (function() {
        if ( suportaAudioElement() ) {
            var format = suportaOgg() ? '.ogg' : '.mp3'
            
            for ( var atual in listaSons ) {
                // create a new Audio element with arquivo + format path
                listaSons[atual].el      = new Audio(listaSons[atual].arquivo + format)
                // repetir attribute declared as true in listaSons's element
                listaSons[atual].el.loop = ( listaSons[atual].repetir )
            }

            // defining controls' html elements
            $controles = $('<div />')
                .attr({
                    id: 'audio-util-controls',
                    class: 'audio-util-controls',
                })
            $btnTrocarMudo = $('<button />')
                .attr({
                    id: 'audio-util-btn-toogleMuted',
                    accesskey: "m",
                    class: 'btn',
                })
                .html('<i class="icon-music"></i> som')
            
            $controles.append( $btnTrocarMudo )
            $('body')  .append( $controles )
            
            $btnTrocarMudo.click(trocarMudo)
        }
    } ())

    return {
        iniciarSom : iniciarSom,
        pararSom   : pararSom,
        salvaEstadoAtualEInterrompe : salvaEstadoAtualEInterrompe,
        retomarEstadoAnterior       : retomarEstadoAnterior,
    }
})
