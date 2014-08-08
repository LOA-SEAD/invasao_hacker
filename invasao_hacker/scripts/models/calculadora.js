/* CALCULADORA.js
 * 
 * DESCRICAO: define quais acoes tomar quando o jogador opera a calculadora
 * CRIADO EM: 09/01/2013
 */
define(['jquery'], function($) {
    
    var Calc = {
        acabouDeCalcular: false,
        simbolosAceitos:  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '/', '*', '(', ')', ' ']
    }

    /*
     * function Operar(pDado)
     * Parametros:
     *     @pDado: simbolo de entrada. Este deve pertencer ao conjunto @simbolosAceitos.
     *     Caso seja '=', deve calcular a expressão, caso contrário adiciona-o aa expressao.
     * 
     * Retorna: true, se expressao final ee valida. Falso caso contrario.
     */
    function Operar(pDado) {
        var expressao, tmp, ret
            
        if(pDado != '=') { // um botao foi pressionado, mas nao ee o "=", logo concatenamos aquele botao com o resto da expressao no input!
            expressao = $('#calc > input').val()

            if (Calc.acabouDeCalcular && pDado >= '0' && pDado <= '9') // O jogador acabou de calcular uma expressao.
                expressao = ''                                         // Caso o proximo digito seja numerico, limpamos a calculadora.
            
            $('#calc > input').val(expressao +pDado)
            Calc.acabouDeCalcular = false
        }
        else { // O jogador pressionou o botao de "=", devemos calcular o resultado da expressao   
            expressao = tmp = $('#calc > input').val()
            
            // verificando se a expressao contem caracteres invalidos (ha uma possibilidade de scriptinjection)
            var i
            for (i = 0; i < tmp.length; i++) {
                var carAt = tmp.charAt(i)
                
                // o simbolo nao ee um simbolo valido, pois nao esta no vetor simbolosAceitos
                if(Calc.simbolosAceitos.indexOf(carAt) == -1) { 
                    $('#calc > input').val('Expressão incorreta!')
                    return false
                }
            }
            
            try { // executa a expressao
                ret = eval(expressao)
            }
            catch(err) {
                $('#calc > input').val('Expressão incorreta!')
                return false
            }
            
            $('#calc > input').val(ret)
            Calc.acabouDeCalcular = true
        }

        return true
    }

    function Reiniciar() {
        Calc.acabouDeCalcular = false
        $('#calc > input').val('')

        return true
    }

    // retorna elemento publico
    return {
        Operar: Operar,
        Reiniciar: Reiniciar
    }
})