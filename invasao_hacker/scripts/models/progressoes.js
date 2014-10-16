/* PROGRESSOES.js
 * 
 * DESCRICAO: declaracao das progressoes inseridas no jogo
 * CRIADO EM: 13/12/2012
 
 * Exemplo de progressoes geradas:
    [
    { a1: 0, razao:10, tipo:'pa' },
    { a1: 1, razao: 2, tipo:'pg' },
    { a1: 0, razao: 9, tipo:'pa' },
    { a1: 0, razao:30, tipo:'pa' },
    { a1: 0, razao:12, tipo:'pa' },
    { a1: 0, razao: 5, tipo:'pa' },
    { a1: 0, razao:88, tipo:'pa' }
    ]
*/
define(['jquery', './const'], function ( $, CONST ) {
    
    function privGerarProg(numeroDeProgressoes, dificuldade) {
        var progressoes = []
        var a1, razao, tipo

        // dificuldade = dificuldade ou padrao 'normal'
        dificuldade = dificuldade || 'normal'
        // numero invalido
        if(numeroDeProgressoes < 1 || isNaN(numeroDeProgressoes)) 
            numeroDeProgressoes = 10
 
        while(numeroDeProgressoes--)
        {
            tipo  =    Math.random()
            a1    = ~~(Math.random() * 10)
            razao = ~~(Math.random() * CONST.PROGRESSOES[dificuldade].razaoMaxima)

            // A probabilidade de PA pode ser alterada na linha 10 do arq. invasao_hacker.js
            if (tipo < CONST.PROGRESSOES[dificuldade].probabilidadePa)
            {
                tipo = 'pa'

                // razao nao pode ser zero, usuario nao conseguiria distinguir se a prog e uma PA ou uma PG.
                if ( razao == 0 ) razao++
            }
            else
            {
                tipo = 'pg'
                
                if ( razao == 1 ) razao++ // razao nao pode ser um, usuario nao conseguiria distinguir se a prog e uma PA ou uma PG.
                if(a1 == 0) a1++           // Termo a1 nao pode ser igual a zero em pgs, pois usuario nao conseguiria definir a razao.
            }
          
            progressoes.push({
                a1: a1,
                razao: razao,
                tipo: tipo
            })
        }

        return progressoes
    }
    
    return { GerarProgressoes: privGerarProg }
})
