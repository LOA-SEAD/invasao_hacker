/* 
 * APLICACAO.js
 *
 * DESCRICAO: controlador do jogo.
 * CRIADO EM: 26/11/2012
 *
 */

define(['jquery', 'jqueryui', 'audio', 'anima', './models/const',
    './models/invasao_hacker', './models/calculadora', './models/email', './models/prompt', './models/habilidades', './models/conquista',
     'jquery.accessWidgetToolkit.AccessButton'],
function ( $, jul, Audio, Anima, CONST, Invasao, Calculadora, Email, Prompt, Habilidades, Conquista ) {

    var
    UserName,
    ProgressionInterval,
    PauseInterval,
    IsPlaying,
    dificuldade,
    IsPaused,
    Time,
    NumberOfMistakes,
    Market,
    LastKeyPressed

    /** 
     * Application startup
     *
     */ 
    function Init() {
        InitHTML()
        Anima.init('autoplay', { duration: 2, interval: 1 })
        setTimeout(ShowIntroduction, 8000)
    }

    /** 
     * Game start. Executed when the player hit the button "jogar"
     *
     */
    function InitGame() {
        // the game was already started
        if ( IsPlaying ) {
            return false
        }   

        Time       = 0
        NumberOfMistakes    = 0
        IsPaused       = true
        IsPlaying = true
        LastKeyPressed = null

        PauseInterval      = CONST.JOGO.intervaloPausa

        $('.tela')
            .css('display', 'none')
            .filter('#tela-jogo')
            .fadeIn(200)

        if ( dificuldade == 'facil' ) {
            UserName = 'Iniciante'
            ProgressionInterval = CONST.JOGO.intervaloClockFacil
        } else if ( dificuldade == 'normal' || !dificuldade ) {
            dificuldade = 'normal'
            UserName = 'Usuário'
            ProgressionInterval = CONST.JOGO.intervaloClockNormal
        } else if ( dificuldade == 'dificil' ) {
            UserName = 'Administrador'
            ProgressionInterval = CONST.JOGO.intervaloClockDificil
        } else if ( dificuldade == 'sobrevivente' ) {
            UserName = 'Sobrevivente'
            ProgressionInterval = CONST.JOGO.intervaloClockSobrevivente
        }

        // write down name of user on the start menu
        $('#nome-usr-logado').html( UserName )

        Prompt     .Reiniciar()
        Email      .Reiniciar()
        //Conquista  .Reiniciar() // Quando comentado, conquistas nunca se perdem.
        //Habilidades.Reiniciar() // Quando comentado, habilidades nunca se perdem.
        Calculadora.Reiniciar()
        Invasao    .Reiniciar( dificuldade )

        ShowModalMessage('<p>Que bom que você está de volta, pois estamos com sérios problemas!</p>'
            + '<p>Hoje, <i lang="en">hackers</i> malígnos estão tentando nos invadir! '
            + 'O <strong lang="en">firewall</strong> está lutando firme, mas não vai aguentar por muito mais tempo... '
            + 'Por favor, nos ajude a acabar com a festa deles!</p>'
            + '<p>Mas como? Simples: os <i lang="en">hackers</i> estão rodando algoritmos pesados para romper nossas defesas. '
            + 'Tais algoritmos exigem tempo para decifrarem nossos códigos. '
            + 'Entretanto, o <strong lang="en">firewall</strong> está do nosso lado! E tentará te ajudar sempre que o algoritmo estiver acabando. '
            + 'Mas <strong>atenção:</strong> ele não conseguirá fazer isso para sempre, então faça sua parte!</p>'
            + '<p>'
            + 'Também temos monitores do progresso da invasão, o que será muito útil. Eles lhe informarão como a progressão se comporta '
            + '(como uma P.A. ou P.G.), isto é, será exibido constantemente termos An pertencentes a progressão. Por exemplo:</p>'
            + '<p><strong>1, 2, 3, 4, 5, 6, 7, 8, 9, ...</strong></p>'
            + '<p>No exemplo assim, temos uma P.A. com termo <strong>A1 = 1</strong> e <strong>razão 1</strong>.</p>'
            + '<p>Seu objetivo aqui é <strong>identificar a razão</strong> da P.A. ou P.G. antes que a invasão se conclua, utilizando a ajuda '
            + 'dos recursos mencionados acima. Boa sorte!'
            + '</p>'
            , 'Bem-vindo, ' +UserName +'!')

        Email.ReceberMensagem('bemvindo', undefined, 3000)

        setTimeout(IncrementProgression, ProgressionInterval)
        setTimeout(IncrementClock, 1000)
        StartProgressBar()

        Audio.pararSom('todos')
        Audio.iniciarSom('jogo')

        return true
    }

    // interpreta comando ou valor inserido pelo jogador
    function InterpretInput( input ) {
        var n = Invasao.getTermoN(),
        faseAtual = Invasao.getFaseAtual()

        if ( isNaN(input) )
            input = input.toLowerCase()
	
        if (Prompt.VerificarComandoValido(input) == false) {
            return false

        // o comando ee valido e nao ee uma sequencia
        } else if ( isNaN(input) ) {
            if ( input == 'shutdown now -p' || input == 'init 0' ) {
                ShowIntroduction()
            } else if ( input == 'apt-get install firewall' ) {
                // faz uma pausa de @PauseInterval milissegundos no jogo.
                Prompt.Imprimir('Infiltração congelada por ' +PauseInterval +' milissegundos.', 'Sistema')
                IsPaused = true
                
                setTimeout(function() {
                    IsPaused = false
                    Prompt.Imprimir('Não é possível conter a infiltração por mais tempo!', 'Sistema')
                }, PauseInterval)

            } else if ( input == 'apt-get moo' ) {
                Prompt.Imprimir('Have you mooed today?', 'Sistema')

            } else if ( input == 'whoami' ) {
                Prompt.Imprimir( UserName, 'Sistema' )
            }
        } else {
            Prompt.Imprimir('Testando valor ' +input +'...')

            // jogador pediu a interpretacao de uma razao incorreta.
            if ( ! Invasao.verificarTermo(input) ) {
                NumberOfMistakes++
                Invasao.incPont('erro') // reduz pontuacao
                Prompt.Imprimir('Erro! O termo geral não e ' +input
                    +'. Créditos do sistema reduzidos para ' + Invasao.getPontuacao() + "!", 'Sistema') // exibe mensagem de erro
            } else { // jogador acertou a razao
                IsPaused = true

                Invasao.incPont('acerto') // incrementa pontuacao
                Invasao.avancarFase()     // avanca de fase
                StartProgressBar()
            
                if (Invasao.verificarVitoria()) {
                    // verifica se alguma das conquistas foi alcancada
                    if ( dificuldade == 'facil'   )                 Conquista.Alcancar(0)
                    if ( dificuldade == 'normal'  )                 Conquista.Alcancar(1)
                    if ( dificuldade == 'dificil' )                 Conquista.Alcancar(2)
                    if ( dificuldade == 'sobrevivente' )            Conquista.Alcancar(3)
                    if ( NumberOfMistakes == CONST.CONQUISTAS.maxNumErros ) Conquista.Alcancar(4)
                    if ( Time <= CONST.CONQUISTAS.maxTempo )       Conquista.Alcancar(5)
                    // fim das conquistas

                    Invasao.incPont('vitoria')
                    IsPlaying = false
                    ShowVictory()
                } else {
                    IsPaused = true
                    Prompt.Imprimir('Porta fechada, a invasão foi impedida e o servidor acumulou '
                        + Invasao.getPontuacao() + " créditos!", '<span lang="en-us">Network agent</span>')

                    ShowModalMessage (
                        'Porta fechada, a invasão de id #' + faseAtual + ' foi impedida com a inserção da razão ' + input + '!',
                        'Invasão impedida, ' + UserName + '!'
                    )

                    $('#market-creditos').html( Invasao.getPontuacao() )
                    Market.show()
                    Email.ReceberMensagem(n >= 15 ? 'porpouco' : 'parabens')
                    
                    if ( faseAtual == CONST.PROGRESSOES[dificuldade].numeroDeProgressoes -1 )
                        Email.ReceberMensagem('quasela', 3, 2000)
                }
            }
        }

        return true
    }

    // define o que fazer quando o jogador integrage com o market.
    function OperateAbilities( ability, action ) {
        var pontuacao = Invasao.getPontuacao()

        if ( typeof ability === 'number' ) {
            if (CONST.HABILIDADES.nome.length <= ability) return false
            ability = CONST.HABILIDADES.nome[ ability ]
        }

        if ( action == 'comprar' ) {
            if ( !Habilidades.podeComprar(ability, pontuacao) ) {
                Email.ReceberMensagem( 'creditosInsuf' )
                return false
            }

            Habilidades.comprar( ability )
            Invasao    .incPont( -Habilidades.obterCusto(ability) )

            Email      .ReceberMensagem( 'boaCompra' )
            $('#market-creditos').html('<strong style="color:red">' +Invasao.getPontuacao() +'</strong>')
        }
        else if ( action == 'utilizar' ) {
            if ( !Habilidades.podeUtilizar(ability) ) {
                Email.ReceberMensagem( 'semHabRest' )
                return false
            }

            // utiliza habilidade selecionada
            eval('(' + Habilidades.utilizar(ability)+'())')
        }
        
        Habilidades.atualizarBotoes()
        return true
    }

    // analisa o tempo atual e o exibe para o jogador
    function IncrementClock() {
        if (!IsPlaying)
            return

        if (!IsPaused) {
            var tmpMin = ~~(++Time /60),
            tmpSeg = ~~((Time /60 -tmpMin) *60)

            // timeStamp padrao
            tmpMin = tmpMin < 10 ? '0' +tmpMin.toString() : tmpMin.toString()
            tmpSeg = tmpSeg < 10 ? '0' +tmpSeg.toString() : tmpSeg.toString()

            $('#spn-tempo').html(tmpMin + ':' +tmpSeg)
        }

        setTimeout(IncrementClock, 1000)
    }

    var clockProgressBar = 50
    var offsetProgressBar = 0
    var refProgressBar = null
    function StartProgressBar() {
        StopProgressBar()
        refProgressBar = setInterval(IncrementProgressBar, clockProgressBar)
    }
    function StopProgressBar() {
        offsetProgressBar = 0
        $('#progInvasao').css('width', '0%')
        $('#lbl-progInvasao').html('0%')
        
        if ( refProgressBar ) {
            clearInterval(refProgressBar)
            refProgressBar = null
        }
    }
    function IncrementProgressBar() {
        if (IsPaused) return

        offsetProgressBar++
        var termoN = Invasao.getTermoN()

        var porcentage = Math.round(100 * offsetProgressBar * clockProgressBar / (20 * ProgressionInterval))

        $('#progInvasao')    .css('width', porcentage  +'%')
        $('#lbl-progInvasao').html(porcentage + '%')
    }

    // Clock do jogo, simula a progressao temporal do jogo.
    // Quando o jogo esta em pausa, ele nao faz nada, simplesmente "progredindo" o tempo.
    function IncrementProgression() {
        if (!IsPlaying)
            return

        // nao ha nenhum processamento quando o jogo esta pausado
        // ocorre enquanto uma mensagem ee exibida
        if ( ! IsPaused ) {
            var termoN = Invasao.avancarTermoN()          

            Prompt.Imprimir('A(' +termoN +') = ' +Invasao.getElemProgress(), 'Monitor')

            var rStatus = Invasao.verificaDerrota()
            if (rStatus == 'derrota') {
                IsPlaying = false
                ShowDefeat()
                return
            }
            else if (rStatus == 'reset') {
                StartProgressBar()
                if (Invasao.getTentativa() > 0) {
                    ShowModalMessage('Uma invasão quase foi concretizada, mas o firewall conseguiu impedí-la a tempo. '
                        +'Entretanto, houve um custo alto. ele so conseguirá se manter ativo por mais algumas vezes.', 'Alerta de segurança!')
                }
                else {
                    ShowModalMessage('Oh não! Como último esforço antes de morrer, o firewall impediu que uma invasão se concretizasse. '
                        +'Tome cuidado, você agora está sozinho!', 'Alerta de segurança!')
                    Email.ReceberMensagem('raiva', 0)
                }
            }
            else if (termoN == 17)
                Email.ReceberMensagem('cuidado')
        }
        setTimeout(IncrementProgression, ProgressionInterval)
    }

    // Recebe uma mensagem e um titulo, o jogo entao ee pausado e
    // uma mensagem ee exibida para o jogador
    function ShowModalMessage( pMsg, pTitulo ) {
        Market.hide()
        
        pTitulo = pTitulo || 'Você tem uma nova mensagem!'
        $('#msgModal-corpo-msg').html(pMsg)
        $('#msgModal-titulo')   .html(pTitulo)
        $('#msgModal')          .modal('show')
        
        return false
    }

    // Recebe como parametro uma string que faz referencia a id de uma janela do sistema operacional
    function ShowWindow( _janela ) {
        if (_janela) {
            var $windows = $('#ih-container-os').children().not('#' +_janela)
            $windows.each(function() { AlternatePlane($(this), 'fundo') })
            AlternatePlane($('#' +_janela), 'frente')

            $('#'          +_janela).slideDown(200)
            $('#itemInic-' +_janela).fadeIn(200)
        }
        return false
    }
    function CloseWindow( _janela ) {
        if (_janela) {
            $('#itemInic-' +_janela).fadeOut(200)
            $('#' +_janela)			.slideUp(200)

            if (_janela == 'email') Email.TrocFechado()
        }

        return false
    }
    function AlternatePlane( $_janela, _plano ) {
        if (!$_janela) // $janela invalida, nada a ser feito.
            return false
        else {
            _plano = (_plano == 'fundo') ? 0 : 1

            $_janela.css('z-index', _plano)
            return false
        }
    }

    function ShowVictory() {
        StopProgressBar()
        var conqObtidas = Conquista.getAlcancaveis('alcancados'),
            conqRestantes = Conquista.getAlcancaveis('restantes')
        
        $('#spn-pontuacao').html(Invasao.getPontuacao()) // exibe pontuacao alcancada pelo jogador
        $('#conquistas-1').hide()
        $('#conquistas-2').hide()

        var tr = '', i
        for (i = 0; i < conqObtidas.length; i++) {
            tr  += '<tr>'
            +'<td>' +(i +1) +'</td>'
            +'<td>' +conqObtidas[i].titulo +'</td>'
            +'<td>' +conqObtidas[i].descricao +'</td>'
            +'</tr>'
        }
        for (i = 0; i < conqRestantes.length; i++) {
            tr += '<tr class="error">'
            +'<td><i class="icon-lock"></i></td>'
            +'<td>' +conqRestantes[i].titulo +'</td>'
            +'<td>' +conqRestantes[i].descricao +'</td>'
            +'</tr>'
        }
        $('#lst-conquistas-obt').html(tr)

        // exibe a tela de vitoria, aguarda 200 ms e exibe as conquistas, caso elas existam.
        $('.tela')
            .css('display', 'none')
            .filter('#tela-vitoria').fadeIn(200)
        
        // se existem conquistas alcancadas exibe mensagem "Voce obteve conquistas!"
        if (conqObtidas.length > 0)
            $('#conquistas-1').fadeIn(200)

        $('#conquistas-2').fadeIn(200)
    }
    function ShowDefeat() {
        StopProgressBar()
        $('.tela')
            .css('display', 'none')
            .filter('#tela-derrota').fadeIn(200)
    }
    function ShowIntroduction() {
        IsPlaying = false
        StopProgressBar()
        
        $('#btn-login')     .addClass('disabled')
        $('#progInicio')    .css('width', 0)
        
        $('#msg-inicio')    .attr('aria-hidden', 'true')
        $('#msg-inicio')    .hide()
        
        $('#msg-carregando').attr('aria-hidden', 'false')
        $('#msg-carregando').show()
        
        $('.tela')
            .css('display', 'none')
            .filter('#tela-intro').fadeIn(200, function() {
                $('#progInicio').animate({
                    width: '+=100%'
                }, 200)
                setTimeout(function() {
                    $('#btn-login').removeClass('disabled')
                    
                    $('#msg-carregando').attr('aria-hidden', 'true')
                    $('#msg-carregando').slideUp('fast', function() {
                        $('#msg-inicio').attr('aria-hidden', 'false')
                        $('#msg-inicio').slideDown()
                    })  
                }, 800)
            })

        Audio.pararSom  ('todos')
        Audio.iniciarSom('menu')
    }
    function ShowInformation() {
        $('.tela')
            .css('display', 'none')
            .filter('#tela-informacoes')
                .fadeIn(200)
    }
    function ShowCredits() {
        $('.tela')
            .css('display', 'none')
            .filter('#tela-creditos')
                .fadeIn(200)
    }

    // Configura os elementos HTML necessarios ao jogo.
    function InitHTML() {
        var $windows = $('#ih-container-os').children()
        Market      = $('#modal-mercado')

        // corrige altura e largura para as atuais, caso a tela seja modificada.
        $(window).on('resize', function() {

            $('.container').css('max-height', 0.8 * document.height + 'px')

            // esconde elementos ocultaveis caso a tela seja pequena
            if (
                CONST.INTERFACE.ocultarTextosEmTelasPequenas &&
                document.width < CONST.INTERFACE.tamanhoMinimoTelaAntesOcultarTextos
               )
                $('.texto-colapsavel').hide()
            else
                $('.texto-colapsavel').show()
        })

        $('.container').css('max-height', 0.8 * document.height + 'px')

        // bloco de notas fechado por padrao
        CloseWindow('blocoNotas')

        // caso a tela seja pequena, esconde calculadora        
        if ( document.width < CONST.INTERFACE.tamanhoMinimoTelaAntesOcultarTextos ) {

            CloseWindow('calc')

            $('#email') .css('left', '50%')
            $('#prompt').css('top', '1%')
            
            // esconde elementos ocultaveis caso a tela seja pequena
            // e o atributo definido em INTERFACE permita
            if ( CONST.INTERFACE.ocultarTextosEmTelasPequenas )
                $('.texto-colapsavel').hide()
            else
                $('.texto-colapsavel').show()
        }

        // todas as janelas podem ser arrastadas e quando clicadas
        // serao colocadas sobre as demais.
        $windows.each(function() {
            // Para cada janela selecionamos o icone '.icon-remove',
            // definindo como acao deste icone o fechamento de sua respectiva janela.
            var idAtual = this.id
            $('#' +idAtual +' > h5 > span > .icon-remove').on('click', function() {
                CloseWindow(idAtual)
                return false
            })

            $( this )
                .on('mousedown', function () {
                    $windows.each(function() {
                        AlternatePlane($(this), 'fundo')
                    })

                    AlternatePlane($(this), 'frente')
                })
                .draggable({
                    stop: function( event, ui ) {
                        // inpedindo que as janelas sejam jogadas para fora da tela
                        // quando movimentadas utilizando o metodo draggable()
                    
                        var currentWindow = ui.helper,
                        X_Atual = parseInt(ui.position.top +currentWindow.height() /2),
                        Y_Atual = parseInt(ui.position.left +currentWindow.width() /2)
                    
                        if (X_Atual > document.height)
                            $(currentWindow).css('top', (0.9 *document.height -currentWindow.height()) +'px')

                        if (Y_Atual > document.width)
                            $(currentWindow).css('left', (0.9 *document.width -currentWindow.width()) +'px')
                    }
                })
        })

        // Para cada item da barra inicial, definimos como acao do 'click'
        // abrir a janela a qual este determinado item se refere
        $('.itemInic')
            .accessButton({
                accessibleLabel: function() {
                    "Iniciar programa " +this.id.split('-')[1]
                }
            })
            .data("accessButton")
            .clickOrActivate(function () {
                var currentWindow = this.id.split('-')[1]
                ShowWindow( currentWindow )
                
                return false
            })

        // tooltips dos elementos
        $('#btn-logoff').tooltip({
            title:     'Efetuar logoff',
            placement: 'left'
        })
        $('#txt-prompt-cmd').tooltip({
            title: 'Digite o termo da P.A./P.G.',
            trigger: 'hover'
        })
        $('#btn-prompt-cmd').tooltip({
            title:     'Testar termo',
            trigger:   'hover',
            placement: 'left'
        })

        // mensagem modais
        $('#msgModal').on('shown', function () {
            IsPaused = true
            $('body').children().not('#msgModal').not('.modal-backdrop')
                .attr({
                    'aria-hidden': true
                })
            
            $('#msgModal-btn-fechar').focus()
        })
        $('#msgModal').on('hidden', function () {
            IsPaused = false
            $('body').children().not('#msgModal').not('.modal-backdrop')
                .attr({
                    'aria-hidden': false
                })

            $('#txt-prompt-cmd').focus()
        })

        // eventos da calculadora
        $('#calc > input').on('keypress', function(event) {
            var input = event.keyCode || event.which

            if ( input == 13 )
                Calculadora.Operar('=')
            else
                Calculadora.Operar(String.fromCharCode(input))

            return false
        })
        $('.calc-btn')
            // .accessButton({ accessibleLabel: "Calcular expressão atual" })
            // .data("accessButton")
            .click(function () {
                Calculadora.Operar($(this).html())
                return false
            })
        $('#calc-apagar')
            .accessButton({ accessibleLabel: "Limpar expressão" })
            .data("accessButton")
            .clickOrActivate(function () {
                $('#calc > input').val('')

                return false
            })
        $('#calc-c')
            .accessButton({ accessibleLabel: "Remove o último digito presente na expressão" })
            .data("accessButton")
            .clickOrActivate(function () {
                var expressao = $('#calc > input').val()
                expressao = expressao.substr(0, expressao.length -1)

                $('#calc > input').val(expressao)

                return false
            })

        // eventos de utilizacao habilidades
        Habilidades.Reiniciar()
        $('.hab-utilizar')
            .accessButton({ accessibleLabel: "Utilizar a habilidade" })
            .data("accessButton")
            .clickOrActivate(function () {
                OperateAbilities( $(this).data('hab'), 'utilizar' )
              
                return false
            })

        // eventos do mercado
        $('.hab-comprar')
            .accessButton({ accessibleLabel: 'Comprar habilidade' })
            .data("accessButton")
            .clickOrActivate(function () {
                OperateAbilities( $(this).data('hab'), 'comprar' )
                
                return false
            })              

        $('#btn-login')
            .accessButton({ accessibleLabel: "Logar no sistema" })
            .data("accessButton")
            .clickOrActivate(function () {
                if ( ! $(this).hasClass('disabled') )
                    InitGame()

                return false
            })
        $('#btn-informacoes')
            .accessButton({ accessibleLabel: "Exibir informações" })
            .data("accessButton")
            .clickOrActivate(function () {
                ShowInformation()
              
                return false
            })
        $('#btn-creditos')
            .accessButton({ accessibleLabel: "Exibir créditos" })
            .data("accessButton")
            .clickOrActivate(function () {
                ShowCredits()
             
                return false
            })
        $('.btn-voltar')
            .accessButton({ accessibleLabel: "Voltar à introdução" })
            .data("accessButton")
            .clickOrActivate(function () {
                ShowIntroduction()
            
                return false
            })
        
        $('#btn-prompt-cmd')
            .accessButton({ accessibleLabel: "Verificar valor ou executar comando inserido acima" })
            .data("accessButton")
            .clickOrActivate(function () {
                InterpretInput($('#txt-prompt-cmd').val())
            
                return false
            })

        // eventos do Email
        $('#Email').hide()

        // anula clique direito do mouse
        $('html').on('contextmenu', function() {
            return false
        })

        $('#txt-prompt-cmd').on('keypress', function(event) {
            if (event.keyCode == 13) InterpretInput($(this).val())
        })

        // atalhos da aplicacao durante o jogo (nao se aplica a menus)
        $(document).on('keypress', function( event ) {
            var evtobj = window.event ? event : e
            var tecla  = evtobj.keyCode | evtobj.which
                tecla  = String.fromCharCode( tecla )

            if ( IsPlaying && !IsPaused ) {
                // um num foi pressionado, jogador pode estar tentando utilizar um atalho
                if ( '1' <= tecla && '9' >= tecla ) {
                    if ('p' == LastKeyPressed) {
                        var elCount = $('#console').children().filter('.cons-msg').length;
                        
                        $('#console').children().filter('.cons-msg').eq( elCount -parseInt(tecla) ).focus()
                        $('#txt-prompt-cmd').val('')
                    
                    } else if ( 'h' == LastKeyPressed ) {
                        OperateAbilities( tecla -49, 'utilizar' )
                        lendoAtalho.habilidade = false
                        $('#txt-prompt-cmd').val('')
                    }
                }
            }

            LastKeyPressed = tecla
        })

        // configurando campos de selecao de dificuldade
        $('#lst-dificuldade').children().click(function() {
            
            // remove selecao dos irmaos
            $(this)
                .siblings()
                .removeClass('active')
            
            // adiciona selecao a dificuldade clicada
            $(this).addClass('active')
            
            // determ nivel
            dificuldade = $(this).data('nivel')
            
            // valida a variavel dificuldade
            if (dificuldade != 'facil' && dificuldade != 'normal' && dificuldade != 'dificil' && dificuldade != 'sobrevivente')
                dificuldade = 'normal'
            
            $('#lst-dificuldade').dropdown('toggle')
            return false
        })
    }

    return {
        Init: Init
    }
})