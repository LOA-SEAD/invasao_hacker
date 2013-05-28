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
	
	function privGerarProg(pNum, pDificuldade) {
		var Prog = []
		var a1, razao, tipo

		pDificuldade = pDificuldade || 'normal'
		if(pNum < 1 || isNaN(pNum)) // numero invalido
			pNum = 10

		if (pDificuldade == 'sobrevivente')
			pNum = CONST.PROG.numProgSobrevivente
		
		while(pNum--) {
			tipo = ~~(Math.random() *100)
			
			// As probabilidades abaixo podem ser alteradas na linha 10 do arq. invasao_hacker.js
			if (pDificuldade == 'facil' 	   && tipo < CONST.PROG.probPAFacil  		|| // todas as progressoes sao PAs!
				pDificuldade == 'normal' 	   && tipo < CONST.PROG.probPANormal  		|| // 50% das progressoes sao PAs e 50% sao PGs.
				pDificuldade == 'sobrevivente' && tipo < CONST.PROG.probPASobrevivente  || // 50% das progressoes sao PAs e 50% sao PGs.
				pDificuldade == 'dificil' 	   && tipo < CONST.PROG.probPADificil) 		{  // 80% das progressoes sao PGs.
				tipo = 'pa'
				
				// razao nao pode ser zero, usuario nao conseguiria distinguir se a prog e uma PA ou uma PG.
				razao = 0
				while ( razao == 0 ) razao = ~~(Math.random() * 100)
				
				a1 = ~~(Math.random() * 10)
			} else {
				tipo = 'pg'
				
				// razao nao pode ser um, usuario nao conseguiria distinguir se a prog e uma PA ou uma PG.
				razao = 1
				while ( razao == 1 ) razao = ~~(Math.random() * 10)
				
				//	Termo a1 nao pode ser igual a zero em pgs, pois usuario nao conseguiria definir a razao.
				a1 = ~~(Math.random() * 10)
				if(a1 == 0) a1++
			}
			
			Prog.push({
				a1: a1,
				razao: razao,
				tipo: tipo
			})
		}

		return Prog
	}
	
	return { GerarProgressoes: privGerarProg }
})
