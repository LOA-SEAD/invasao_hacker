/* CONQUISTA.js
 * 
 * DESCRICAO: descricao das conquistas obtidas por meio de eventos pelos quais o jogador passa.
 * CRIADO EM: 29/01/2013
 */

define(['jquery', './const'], function($, CONST) {
    var Conquista = {
        alcancaveis:[
        {
            titulo: 'Usuário iniciante.', 
            descricao: 'Vença o modo \'Noob\'.', 
            atingido: false
        },
{
            titulo: 'Usuário experiente!', 
            descricao: 'Vença o modo \'Aprendiz\'.',
            atingido: false
        },
{
            titulo: 'Administrador imbatível.',
            descricao: 'Vença o modo \'Expert\'.',
            atingido: false
        },
{
            titulo: 'Por que você não dedica algum tempo de sua vida para dormir?',
            descricao: 'Reset o jogo no modo \'White Hat\'.',
            atingido: false
        },
{
            titulo: 'Matemático', 
            descricao: (CONST.CONQUISTAS.maxNumErros == 0
                       ? 'Não erre uma única vez.'
                       : ('Cometa no máximo ' +CONST.CONQUISTAS.maxNumErros +' erros.')),
            atingido: false
        },
{
            titulo: 'Velocidade da luz.', 
            descricao: 'Impeça a invasão utilizando no máximo ' +CONST.CONQUISTAS.maxTempo +' segundos.', 
            atingido: false
        }
        ]
    }
	
    // Reinicia todas as conquistas para falso. IE, faz com que o jogador volte a nao ter nenhuma conquista.
    function privReiniciar() {
        for (var i = 0; i < Conquista.alcancaveis.length; i++)
            Conquista.alcancaveis[i].atingido = false
        return false
    }
	
    // Recebe como parametro um numero (indexador) ou o titulo de uma conquista.
    // retorna verdadeiro, caso encontre a conquista e a marque como alcancada ou falso,
    // caso o parametro enviado seja invalido.
    function privAlcancar(pConquista) {
        
        // pConquista e um numero. Verifica se e um indexador valido.
        if (!isNaN(pConquista)) {
            if (pConquista >= Conquista.alcancaveis.length) // valor invalido, nada a fazer
                return false
            else 
                return Conquista.alcancaveis[pConquista].atingido = true
        }
        // pConquista nao e um numero. Verifica se existe alguma conquista com aquele titulo
        else {
            for (var i = 0; i < Conquista.alcancaveis.length; i++)
                if (Conquista.alcancaveis[i].titulo == pConquista)
                    return (Conquista.alcancaveis[i].atingido = true)

            return false
        }
    }
	
    function privGetAlcancaveis(pConquista) {
        if (!pConquista) // pConquista nao foi definido! Retorna todas as conquistas.
            return Conquista.alcancaveis
        else {

            if (!isNaN(pConquista)) { // pConquista ee um indexador
                return Conquista.alcancaveis[pConquista]
            }
            else {
                if (pConquista == 'alcancados' || pConquista == 'restantes') {
                    var ret = []
                                        
                    // verificamos quais itens queremos como resultado,
                    // as conquistas que ja foram alcancadas ou nao.
                    var quaisConq = pConquista == 'alcancados' ? true : false

                    for (var i = 0; i < Conquista.alcancaveis.length; i++)
                        if (Conquista.alcancaveis[i].atingido == quaisConq)
                            ret.push(Conquista.alcancaveis[i])

                    return ret
                }
                else {
                    // pConquista ee o titulo de uma conquista
                    for (var i = 0; i < Conquista.alcancaveis.length; i++)
                        if (Conquista.alcancaveis[i].titulo == pConquista)
                            return Conquista.alcancaveis[i]

                    return false // nao achou pConquista
                }
            }
        }
    }

    return { // retorna elemento publico
        Reiniciar: privReiniciar,
        Alcancar: privAlcancar,
        getAlcancaveis: privGetAlcancaveis
    }
})
