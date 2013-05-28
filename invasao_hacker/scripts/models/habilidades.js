/* HABILIDADES.js
 * 
 * DESCRICAO: define o objeto habilidades.
 * CRIADO EM: 04/03/2013
 */
define(['jquery', './const'], function( $, CONST ) {
    var Habilidades = {
        i:   [],
        lst: {}
    }

    function obterCusto( _habilidade ) {
        return Habilidades.lst[_habilidade] ? Habilidades.lst[_habilidade].custo : undefined
    }
    function atualizarBotoes() {
        $(Habilidades.i).each(function(i, el) {
            var elHTML = $('#hab-ut-' + el).children()
            
            if ( Habilidades.lst[el].disponiveis == 0 )
                elHTML.removeClass('icon-white')
            else if ( !elHTML.hasClass('icon-white') )
                elHTML.addClass('icon-white')
        })
    } 

    function comprar( _habilidade ) {
        if ( !Habilidades.lst[_habilidade] )
            return false // abilidade nao encontrada

        var numHabRest = ++Habilidades.lst[_habilidade].disponiveis

        $('#hab-' + _habilidade + '-rest').html( numHabRest != 0 ? numHabRest.toString() : '' )
        return numHabRest
    }
    function podeComprar( _habilidade, _pontuacao ) {
        if ( !Habilidades.lst[_habilidade] )
            return false // abilidade nao encontrada
        
        return _pontuacao -Habilidades.lst[_habilidade].custo >= 0
    }
    function utilizar( _habilidade ) {
        if ( !Habilidades.lst[_habilidade] )
            return null

        var numHabRest = --Habilidades.lst[_habilidade].disponiveis

        $('#hab-' + _habilidade + '-rest').html( numHabRest != 0 ? numHabRest.toString() : '' )
        return Habilidades.lst[_habilidade].acao
    }
    function podeUtilizar( _habilidade ) {
        if ( !Habilidades.lst[_habilidade] )
            return false // abilidade nao encontrada

        return Habilidades.lst[_habilidade].disponiveis > 0
    }

    function Reiniciar() {
        $('#lst-habilidades').empty()
        $('#lst-mercado').empty()

        var numHab = 0

        $(CONST.HABILIDADES.nome).each(function( i ) {
            var _hab = this.toString()
            
            Habilidades.i.push( _hab )
            Habilidades.lst[ _hab ] = {
                id: i,
                nome: _hab,
                desc: CONST.HABILIDADES.desc[i],
                custo: CONST.HABILIDADES.custo[i],
                icone: CONST.HABILIDADES.icone[i],
                acao: CONST.HABILIDADES.acao[i],
                disponiveis: 0
            }

            var el = Habilidades.lst[ _hab ]
            $('#lst-habilidades').append(
                '<a id="hab-ut-' + el.nome + '" class="hab-utilizar" data-hab="' + el.nome + '" title="' + el.desc + '"><i class="' + el.icone + '"></i> ' +
                '<i id="hab-' + el.nome + '-rest" class="hab-rest"></i></a>'
            )
            $('#lst-mercado').append(
                '<tr><td><button data-hab="' + el.nome + '" class="hab-comprar btn btn-small" title="Habilidade '
                + el.nome + ' (+' + el.custo + ' créditos): ' + el.desc + '"><i class="icon-plus-sign"></i></button></td>'
                + '<td>' + el.nome + ' (+' + el.custo + ' créditos)</td><td>' + el.desc + '</td></tr>'
            )
        })

        atualizarBotoes()
    }

    return { // retorna elemento publico
        Reiniciar: Reiniciar,
        obterCusto: obterCusto,
        atualizarBotoes: atualizarBotoes,

        comprar: comprar,
        utilizar: utilizar,
        podeUtilizar: podeUtilizar,
        podeComprar: podeComprar
    }
})