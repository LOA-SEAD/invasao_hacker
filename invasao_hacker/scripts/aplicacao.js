/**
 * APLICACAO.js
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
    Difficulty,
    IsPaused,
    Time,
    NumberOfMistakes,
    Market,
    LastKeyPressed

    /** 
     * Application startup
     */ 
    function Init() {
        InitHTML()
        Anima.init('autoplay', { duration: 2, interval: 1 })
        setTimeout(ShowIntroduction, 8000)
    }

    /** 
     * Game start.
     * Executed when the player hit the button "jogar"
     */
    function InitGame() {
        // the game was already started
        if ( IsPlaying ) {
            return false
        }   

        Time             = 0
        NumberOfMistakes = 0
        IsPaused         = true
        IsPlaying        = true
        LastKeyPressed   = null

        PauseInterval      = CONST.JOGO.intervaloPausa

        $('.tela')
            .css('display', 'none')
            .filter('#tela-jogo')
            .fadeIn(200)

        if ( Difficulty == 'facil' ) {
            UserName = 'Noob'
            ProgressionInterval = CONST.JOGO.intervaloClockFacil
        } else if ( Difficulty == 'normal' || !Difficulty ) {
            Difficulty = 'normal'
            UserName = 'Junior'
            ProgressionInterval = CONST.JOGO.intervaloClockNormal
        } else if ( Difficulty == 'dificil' ) {
            UserName = 'Expert'
            ProgressionInterval = CONST.JOGO.intervaloClockDificil
        } else if ( Difficulty == 'sobrevivente' ) {
            UserName = 'White Hat'
            ProgressionInterval = CONST.JOGO.intervaloClockSobrevivente
        }

        // writes down the name of user on the start menu
        $('#nome-usr-logado').html( UserName )

        Prompt     .Reiniciar(UserName)
        Email      .Reiniciar()
        //Conquista  .Reiniciar() // Quando comentado, conquistas nunca se perdem.
        //Habilidades.Reiniciar() // Quando comentado, habilidades nunca se perdem.
        Calculadora.Reiniciar()
        Invasao    .Reiniciar( Difficulty )

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

    /**
     * Interprets input from user.
     * It can be the ratio or an literal command.
     */
    function InterpretInput( input ) {
        var n = Invasao.getTermoN(),
        faseAtual = Invasao.getFaseAtual()

        if ( isNaN(input) )
            input = input.toLowerCase()
	
        if (Prompt.VerificarComandoValido(input) == false) {
            return false

        // it is a valid command and it's not a answer try
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

        // it is a answer try
        } else {
            Prompt.Imprimir('Testando valor ' +input +'...')

            // jogador pediu a interpretacao de uma razao incorreta.
            if ( ! Invasao.verificarTermo(input) ) {
                NumberOfMistakes++
                Audio.iniciarSom('erro')
                Invasao.incPont('erro') // reduz pontuacao
                Prompt.Imprimir('Erro! O termo geral não e ' +input
                    +'. Créditos do sistema reduzidos para ' + Invasao.getPontuacao() + "!", 'Sistema') // exibe mensagem de erro
            } else { // jogador acertou a razao
                IsPaused = true

                Audio.iniciarSom('acerto')
                Invasao.incPont('acerto') // incrementa pontuacao
                Invasao.avancarFase()     // avanca de fase
                StartProgressBar()
            
                if (Invasao.verificarVitoria()) {
                    // verifica se alguma das conquistas foi alcancada
                    if ( Difficulty == 'facil'   )                 Conquista.Alcancar(0)
                    if ( Difficulty == 'normal'  )                 Conquista.Alcancar(1)
                    if ( Difficulty == 'dificil' )                 Conquista.Alcancar(2)
                    if ( Difficulty == 'sobrevivente' )            Conquista.Alcancar(3)
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
                    
                    if ( faseAtual == CONST.PROGRESSOES[Difficulty].numeroDeProgressoes -1 )
                        Email.ReceberMensagem('quasela', 3, 2000)
                }
            }
        }

        return true
    }

    /**
     * Defines market's behavior when interacted by the user
     */
    function OperateAbilities( ability, action ) {
        var pontuacao = Invasao.getPontuacao()

        if ( typeof ability === 'number' ) {
            if (CONST.HABILIDADES.nome.length <= ability) return false
            ability = CONST.HABILIDADES.nome[ ability ]
        }

        if ( action == 'comprar' ) {
            if ( !Habilidades.podeComprar(ability, pontuacao) ) {
                Audio.iniciarSom('erro_upgrade')
                Email.ReceberMensagem( 'creditosInsuf' )
                return false
            }
            Audio.iniciarSom('upgrade')
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

            // uses selected ability
            eval('(' + Habilidades.utilizar(ability)+'())')
        }
        
        Habilidades.atualizarBotoes()
        return true
    }

    /**
     * Shows current time to user
     */
    function IncrementClock() {
        if (!IsPlaying)
            return

        if (!IsPaused) {
            var tmpMin = ~~(++Time /60),
            tmpSeg = ~~((Time /60 -tmpMin) *60)

            // standard timestamp
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

    /**
     * Main progression function,
     * simulating temporal progression of the game when the game is not paused
     */
    function IncrementProgression() {
        if (!IsPlaying)
            return

        // nao ha nenhum processamento quando o jogo esta pausado
        // ocorre enquanto uma mensagem ee exibida
        if ( ! IsPaused ) {
            var termoN = Invasao.avancarTermoN()          

            
            Prompt.Imprimir('A(' +termoN +') = ' +Invasao.getElemProgress(), 'Monitor')
            Audio.iniciarSom('prompt_notification')

            var rStatus = Invasao.verificaDerrota()
            if (rStatus == 'derrota') {
                IsPlaying = false
                Audio.iniciarSom('derrota')
                ShowDefeat()
                return
            }
            else if (rStatus == 'reset') {
                StartProgressBar()
                Audio.iniciarSom('falha')
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

    /**
     * Displays a title and a message to the user
     *
     */
    function ShowModalMessage( pMsg, pTitulo ) {
        Market.hide()
        
        pTitulo = pTitulo || 'Você tem uma nova mensagem!'
        $('#msgModal-corpo-msg').html(pMsg)
        $('#msgModal-titulo')   .html(pTitulo)
        $('#msgModal')          .modal('show')
        
        return false
    }

    /**
     * Shows a specific @window, an child of the element #ih-container-os
     * @params string window
     *
     * @returns false
     */
    function ShowWindow( _window ) {
        if (_window) {
            var $windows = $('#ih-container-os').children().not('#' +_window)
            $windows.each(function() { AlternatePlane($(this), 'fundo') })
            AlternatePlane($('#' +_window), 'frente')

            $('#'          +_window).slideDown(200)
            $('#itemInic-' +_window).fadeIn(200)
        }

        return false
    }

    /**
     * Closes a specific @window, an child of the element #ih-container-os
     * @params string _window
     *
     * @returns false
     */
    function CloseWindow( _window ) {
        if (_window) {
            $('#itemInic-' +_window).fadeOut(200)
            $('#' +_window)			.slideUp(200)

            if (_window == 'email') Email.TrocFechado()
        }

        return false
    }

    /**
     * Alternate the plane (foreground/background) of a specific @window
     * @params string _window
     * @params string _plane
     *
     * @returns false
     */
    function AlternatePlane( $_window, _plane ) {
        // $_window is a valid element
        if ($_window) {
            _plane = _plane == 'fundo' ? 0 : 1
            $_window.css('z-index', _plane)
        }
        
        return false
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

    /**
     * Configures all HTML elements presented through the game necessary to its correct functionality
     *
     */
    function InitHTML() {
        var $windows = $('#ih-container-os').children()
        Market      = $('#modal-mercado')

        // corrects height and width to current, in case of window resizing
        $(window).on('resize', function() {

            $('.container').css('max-height', 0.8 * document.height + 'px')

            // hide optional elements, when screen's size is bellow minimum
            if (
                CONST.INTERFACE.ocultarTextosEmTelasPequenas &&
                document.width < CONST.INTERFACE.tamanhoMinimoTelaAntesOcultarTextos
               )
                $('.texto-colapsavel').hide()
            else
                $('.texto-colapsavel').show()
        })

        $('.container').css('max-height', 0.8 * document.height + 'px')

        // note blocks is closed by default
        CloseWindow('blocoNotas')

        // calculator is closed, when screen's size is bellow minimum
        if ( document.width < CONST.INTERFACE.tamanhoMinimoTelaAntesOcultarTextos ) {

            CloseWindow('calc')

            $('#email') .css('left', '50%')
            $('#prompt').css('top', '1%')

            if ( CONST.INTERFACE.ocultarTextosEmTelasPequenas )
                $('.texto-colapsavel').hide()
            else
                $('.texto-colapsavel').show()
        }

        // define draggable behavior of windows
        $windows.each(function() {
            // selects elements .icon-remove and add to them the 'close window' behavior
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
                        
                        // prevents windows from being dragged out of the screen
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

        // For each item in the start menu, defines the action .click to open their respective window
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

        // tooltips
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

        // modal messages
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

        // calculator events
        $('#calc > input').on('keypress', function(event) {
            var input = event.keyCode || event.which

            if ( input == 13 )
                Calculadora.Operar('=')
            else
                Calculadora.Operar(String.fromCharCode(input))

            return false
        })
        $('.calc-btn')
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

        // Abilities menu events
        Habilidades.Reiniciar()
        $('.hab-utilizar')
            .accessButton({ accessibleLabel: "Utilizar a habilidade" })
            .data("accessButton")
            .clickOrActivate(function () {
                OperateAbilities( $(this).data('hab'), 'utilizar' )
              
                return false
            })

        // Market events
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

        // Email events
        $('#Email').hide()

        // Nullify right click of the mouse
        $('html').on('contextmenu', function() {
            return false
        })

        $('#txt-prompt-cmd').on('keypress', function(event) {
            if (event.keyCode == 13) InterpretInput($(this).val())
        })

        // difines application shorcuts usable throughout the game
        $(document).on('keypress', function( event ) {
            var evtobj = event
            var key  = evtobj.keyCode | evtobj.which
                key  = String.fromCharCode( key )

            if ( IsPlaying && !IsPaused ) {
                // um num foi pressionado, jogador pode estar tentando utilizar um atalho
                if ( '1' <= key && '9' >= key ) {
                    if ('p' == LastKeyPressed) {
                        var elCount = $('#console').children().filter('.cons-msg').length;
                        
                        $('#console').children().filter('.cons-msg').eq( elCount -parseInt(key) ).focus()
                        $('#txt-prompt-cmd').val('')
                    
                    } else if ( 'h' == LastKeyPressed ) {
                        OperateAbilities( key -49, 'utilizar' )
                        lendoAtalho.habilidade = false
                        $('#txt-prompt-cmd').val('')
                    }
                }
            }

            LastKeyPressed = key
        })

        // configures selection fields of difficulty
        $('#lst-dificuldade').children().click(function() {
            
            // remove selection from siblings
            $(this)
                .siblings()
                .removeClass('active')
            
            // add selection to clicked difficult
            $(this).addClass('active')
            
            // determines level
            Difficulty = $(this).data('nivel')
            
            // validates difficulty variable
            if (Difficulty != 'facil' && Difficulty != 'normal' && Difficulty != 'dificil' && Difficulty != 'sobrevivente')
                Difficulty = 'normal'
            
            $('#lst-dificuldade').dropdown('toggle')
            return false
        })
    }

    // returns public element
    return { Init: Init }
})
