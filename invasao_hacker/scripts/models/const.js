define( function() {
    // objeto contem todas as constantes utilizadas a execucao do codigo
    var CONST = {
        INTERFACE: {
            ocultarTextosEmTelasPequenas: true,
            tamanhoMinimoTelaAntesOcultarTextos: 1024
        },
        JOGO: {
            intervaloClockFacil:        2000,
            intervaloClockNormal:       1500,
            intervaloClockDificil:      1000,
            intervaloClockSobrevivente: 1500,
            intervaloPausa:             5000,
            numVezesMercadoApar:            2
        },
        PROG: {
            numProgressoes:        10,
            numProgSobrevivente: 1000,

            probPAFacil:           50,
            probPANormal:          50,
            probPADificil:         20,
            probPASobrevivente:    50,

            numTentativas:          2, // para -1, numero de tentativas ee infinito
            retrocessoAoPerder:    20  // quando o hacker tem exito ao invadir o sistema, porem o jogador ainda nao esgotou
                                       // seu numero de tentativas o progresso da invasao voltara a este valor (em %)
        },
        PONTUACAO: {
            acerto: 50,
            erro:  -25,
            tempo:   1
        },
        CONQUISTAS: {
            maxTempo:   45,
            maxNumErros: 0
        },
        EMAIL: {
            MSG: {
                bemvindo:      'Ei!!! Você está aqui! Acho que agora nós podemos ganhar!',
                boaCompra:     'Ótima compra! acho que podemos ganhar agora!',
                creditosInsuf: 'Sinto muito amigão, mas você está sem créditos pra fazer essa compra.',
                semHabRest:    'Essa habilidade não pode mais ser utilizada, compre-a no mercado.',
                naoPdUtilAb:   'Você não tem essa abilidadade! Compre-a na próxima vez que ver o Mercado!',
                parabens:      'Isso aí! Você conseguiu!!!',
                porpouco:      'Nossa... Essa foi por pouco! Não deixe que isso aconteça novamente!',
                cuidado:       'Eles estão quase nos invadindo! Faça alguma coisa!',
                quasela:       'Estamos quase lá! Continue expulsando esses hackers!',
                raiva:         'O QUE VOCÊ ESTÁ FAZENDO?!?!?!?!?!?!?',
                desanimo:      'Não vamos conseguir... Desista...'
            },
            LIST_AMIGOS: ['<span lang="en-us">NETWORK ADMIN</span>', 'João Paulo', 'Jully', 'Emerson', 'Aaron']
        },
        HABILIDADES: {
            nome:  ['ajuda', 'imper', 'desconec'],
            desc:  [
                'Requisita que um amigo o ajude com a invasão, reduzindo a porcentagem de invasão pela metade.',
                'O servidor se tornará imune a invasões por um curto período de tempo.',
                ('O servidor terminará um grande número de conexões potencialmente perigosas. Apesar de eficiente,' +
                 'essa medida gera um grande dano colateral e, portanto, exige um alto número de créditos. Utilize-a somente em casos extremos!')
            ],
            custo: [50, 100, 250],
            icone: ['icon-plus-sign', 'icon-fire', 'icon-check'],
            acao: [
                function() {
                    // um amigo enviara uma mensagem informando um intervalo em que a razao esta.
                    var razao = Invasao.getRazao()
                    
                    Email.ReceberMensagem(
                        'Hum... Acho que a resposta está entre ' + ~~(razao -Math.random() *5) + ' e ' + ~~(razao +Math.random() *5) + '. Tente aí!'
                    )
                },
                function() {
                    // faz uma pausa de @intervaloPausa milissegundos no jogo.
                    Prompt.Imprimir('Infiltração congelada por ' + intervaloPausa +' milissegundos.', 'Sistema')
                    pausa = true
                    console.log('Jogo congelado.')
                    setTimeout(function() {
                        pausa = false
                        console.log('Jogo descongelado.')
                        Prompt.Imprimir('Não é possível conter a infiltração por mais tempo!', 'Sistema')
                    }, intervaloPausa)
                },
                function() {
                    Interpretar( parseInt(Invasao.getRazao()) )
                }
            ]
        }
    }

    return CONST
})