define(function () {

    var erro = 'quiForca/audio/erro',
    acerto = 'quiForca/audio/acerto',
    efeitoDeErro,
    efeitoDeAcerto;

    (function inicializar() {
        if (suportaAudioElement()) {

            if (suportaWav()) {
                efeitoDeAcerto = new Audio(acerto + '.wav');
                efeitoDeErro = new Audio(erro + '.wav');
            } else {
                efeitoDeAcerto = new Audio(acerto + '.mp3');
                efeitoDeErro = new Audio(erro + '.mp3');
            }

        }
    } ());

    function suportaAudioElement() {
        return typeof document.createElement('audio').canPlayType !== 'undefined';
    }

    function suportaWav() {
        return new Audio().canPlayType('audio/wav') !== '';
    }

    return {

        notificarErro: function () {
            if (efeitoDeErro !== undefined)
                efeitoDeErro.play();
        },

        notificarAcerto: function () {
			if (efeitoDeAcerto !== undefined)
                efeitoDeAcerto.play();
		},
    };
});
