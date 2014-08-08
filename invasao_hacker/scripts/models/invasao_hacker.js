/* INVASAO_HACKER.js
 * 
 * DESCRICAO: modelo do jogo.
 * CRIADO EM: 26/11/2012
 */
define(['./progressoes', './const'], function(progressoes, CONST) {

    // objeto principal
    var Invasao = {
        tentativaAtual: CONST.PROGRESSOES.numeroDeTentativas,
        pontuacao: 0,
        dificuldade: 'normal',
        fases: {
            atual: 0,
            progressao: [],
            termoN: 1
        }
    }

    // verifica se a fase atual supera o numero de elementos no vetor que armazena todas as
    // progressoes. Se sim, o jogador completou todos, e a tela de vitoria ee exibida
    function privVerifVit() {
        return Invasao.fases.atual == Invasao.fases.progressao.length
    }

    // Descobre se o termo N ee maior ou igual 100, o que implica que a progressao chegou ao seu limite e o jogador nao conseguiu identificar a razao a tempo.
    // Neste caso, ee verificado se o jogador ainda tem tentativas restantes (o valor -1 indica infinitas tentativas restantes).
    // O valor de retorno ee sempre uma string, pertencente ao conjunto {padrao, infinito, derrota, reset} e ee descrito abaixo:
    // "padrao": o termo N ainda nao superou 100
    // "infinto": o numero de tentativas ee infinito
    // "derrota": o termo N superou 100 e o jogador superou seu numero de tentativas
    // "reset": o termo N superou 100, porem o jogador ainda tem tentativas restantes
    function privVerifDerr() {
        if (Invasao.fases.termoN < 20) {  		//	o hacker invadiu o sistema com sucesso
            return 'padrao'
        } else if (Invasao.tentativaAtual == -1) {  	//	o numero de tentativas restantes ee infinito
            Invasao.fases.termoN -= CONST.PROGRESSOES.retrocessoAoPerder
            return 'infinito'
        } else if (Invasao.tentativaAtual-- == 0) { 	//	as tentativas do usuario acabaram
            return 'derrota'
        } else {
            Invasao.fases.termoN -= CONST.PROGRESSOES.retrocessoAoPerder
            return 'reset'
        }
    }

    // utilizada sempre durante o inicio de um jogo, reseta as variaveis do objeto Invasao para as constantes.
    function privReiniciar(pDificuldade) {
        console.log(pDificuldade);
        Invasao.fases.termoN = 0
        Invasao.fases.atual = 0
        Invasao.pontuacao = 0

        Invasao.fases.progressao = progressoes.GerarProgressoes(CONST.PROGRESSOES[pDificuldade].numeroDeProgressoes, pDificuldade)

        Invasao.tentativaAtual = CONST.PROGRESSOES.numeroDeTentativas
        Invasao.janelaAtiva = ''
        Invasao.numAcertos = 0
        Invasao.numErros = 0
    }

    // verifica se a razao inserida pelo jogador corresponde a razao da progressao atual
    function privVerifTermo(pTermo) {
        var tmpAtual = Invasao.fases.progressao[Invasao.fases.atual]

        return parseInt(pTermo) == tmpAtual.razao
    }
    // chamado quando o jogador descobre a razao da progressao i -1. a progressao entao ee alterada.
    function privAvancarFase() {
        Invasao.fases.atual++
        Invasao.fases.termoN = 0

        return true
    }

    // avanca e retorna o termo N da progressao atual
    function privAvancarTermoN() {
        var tmpTermo = 20

        if (Invasao.fases.termoN < 20)
            tmpTermo = ++Invasao.fases.termoN

        return tmpTermo
    }

    function privGetFaseAtual() {
        return Invasao.fases.atual
    }
    function privGetTermoN() {
        return Invasao.fases.termoN
    }
    function privGetNumProg() {
        return Invasao.fases.progressao.length
    }
    function privGetRazao() {
        return Invasao.fases.progressao[Invasao.fases.atual].razao
    }

    // retorna o numero de tentativas restantes do jogador
    function privGetTentativa() {
        return Invasao.tentativaAtual
    }

    // retorna termo An da progressao atual
    function privGetElemProgress() {
        var tmpElem = Invasao.fases.progressao[Invasao.fases.atual];

        if (tmpElem.tipo == 'pa')
            return tmpElem = tmpElem.a1 + (Invasao.fases.termoN - 1) * tmpElem.razao
        // tmpElem.tipo == 'pg'
        else
            return tmpElem = tmpElem.a1 * Math.pow(tmpElem.razao, Invasao.fases.termoN - 1)
    }

    //	recebe um evento ou numero e incrementa a pontuacao
    function privIncPont(_pont) {
        var tm_pont

        if (isNaN(_pont) && _pont != 'acerto' && _pont != 'erro' && _pont != 'vitoria')
            return false

        if (!isNaN(_pont))
            tm_pont = _pont
        else if (_pont == 'acerto')
            tm_pont = CONST.PONTUACAO.acerto
        else if (_pont == 'erro')
            tm_pont = CONST.PONTUACAO.erro
        else if (_pont == 'vitoria') {
            // constante de pontos por tempo multiplicado pela quantidade de tempo restante
            tm_pont = CONST.PONTUACAO.tempo
            tm_pont *= (20 - Invasao.fases.termoN)
        }

        Invasao.pontuacao += tm_pont
        if (Invasao.pontuacao < 0)
            Invasao.pontuacao = 0

        return Invasao.pontuacao
    }

    function privGetPontuacao() {
        return Invasao.pontuacao
    }

    return { // retorna elemento publico

        verificarTermo: privVerifTermo,
        avancarFase: privAvancarFase,
        avancarTermoN: privAvancarTermoN,
        incPont: privIncPont,
        verificaDerrota: privVerifDerr,
        verificarVitoria: privVerifVit,
        getTermoN: privGetTermoN,
        getRazao: privGetRazao,
        getNumProg: privGetNumProg,
        getFaseAtual: privGetFaseAtual,
        getTentativa: privGetTentativa,
        getPontuacao: privGetPontuacao,
        getElemProgress: privGetElemProgress,
        Reiniciar: privReiniciar
    }
})
