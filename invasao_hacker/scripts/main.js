require.config({
    paths: {
        'jquery':    './libs/jquery-1.8.min',
        'jqueryui':  './libs/jquery-ui-1.9.2.min',
        'bootstrap': './libs/bootstrap',
        
        'jquery.accessWidgetToolkit.core':         './libs/jquery.accessWidgetToolkit.core',  
        'jquery.accessWidgetToolkit.AccessButton': './libs/jquery.accessWidgetToolkit.AccessButton'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        }
    }
});

require(['jquery', 'aplicacao', 'bootstrap'], function ( $, aplicacao, bootstrap ) {

    $(document).ready(function () {
        aplicacao.Init()
    })
})
