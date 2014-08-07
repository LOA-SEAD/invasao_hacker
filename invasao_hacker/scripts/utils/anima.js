/* 
 * ANIMA.js
 *
 * DESCRICAO: descreve uma animacao no jogo.
 * 
 * UTILIZACAO: {nomModulo}.init(
 *      @param string _autoInit
 *      @param object _attributes = { interval, duration, softTransition }
 * )
 *
 * CRIADO EM: 20/11/2012
 *
 */

define(['jquery', 'audio'], function ( $, Audio ) {

    var sequence = {},
    valid,
    playing;

   /* Initialize the current animation module.
    * @param _attributes : attributes of current animation module
    * @param _autoInit : defines if animation should starts immediately after created
    */
    function init( _autoInit, _attributes ) {
        
        // invalid call of init() method of a animation which is currently playing
        if ( playing === true ) {
            return false;
        }
        
        // reconstructing animation. At this point, it isn't valid anymore.
        valid = false;
        
        sequence.current  = 1000 * (0);
        sequence.interval = 1000 * (2);
        sequence.duration = 1000 * (1);
        sequence.softTransition = true;

        // if defined, set attributes
        if ( _attributes ) {
            if ( _attributes.interval ) sequence.interval = 1000 * _attributes.interval;
            if ( _attributes.duration ) sequence.duration = 1000 * _attributes.duration;
            
            // if not softTranstioned, set transition's duration to zero.
            if ( _attributes.softTransition === false ) sequence.duration = 0;
        }

        playing = false;
        valid   = true;

        if ( _autoInit ) {
            return start();
        }

        return false;
    }

    function start( ) {
        
        if ( valid !== true ) {
            return false;
        }
		
		// all sounds which are currently playing must stop
		if ( Audio ) {
			// Audio.interruptOrReturnToPreviousStatus();
		}

        // the starting visibility of all frames is hidden
        $('.anima-frame').hide();
        // initiate container
        $('#anima-container').show();
        
        sequence.current = 0;
        playing = true;
              
        $('.anima-frame').eq(0).fadeIn(sequence.duration, function() {
            setTimeout(nextFrame, sequence.interval);
        });

        return true;
    }

    function nextFrame( ) {

        // the animation was forcibly stopped
        if ( playing !== true ) {
            return stop();
        }

        var $previousFrame = $('.anima-frame').eq(sequence.current++);
        var $currentFrame  = $('.anima-frame').eq(sequence.current);

        $previousFrame.fadeOut(sequence.duration, function( ) {

            // the last frame was reached
            if ( $currentFrame.length == 0 )
                return stop();

            $currentFrame.fadeIn(sequence.duration, function() {
                setTimeout( nextFrame, sequence.interval );
            });
        });
    }

    function stop( ) {

        if ( playing !== true )
            return false;

        $('#anima-container').slideUp('normal');
        $('.anima-frame')    .hide();
        
        playing = false;
        sequence.current  = 0;

        return true;
    }

    return {
        init    : init,
        start   : start,
        stop    : stop
    }
});
