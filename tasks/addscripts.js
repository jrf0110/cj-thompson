var async = require('async');
var jsdom = require('jsdom');

module.exports = function( grunt ){
  grunt.registerMultiTask( 'addscripts', function(){
    var done = this.async();
    var paths = this.data.scripts;
    var tmpl = '<script type="text/javascript" src="{{path}}"></script>';

    async.series(
      grunt.file.expand( this.data.src ).map( function( file ){
        return function( next ){
          jsdom.env( file, ["http://code.jquery.com/jquery.js"], function( errors, window ){
            var doc = window.document;
            var $ = window.$;
            var $scripts = $();

            paths.reverse().forEach( function( p ){
              $scripts = $scripts.add(
                $( tmpl.replace( '{{path}}', p ) )
              );
            });

            $('script').eq(0).before( $scripts );

            fs.writeFileSync( file, [
              '<!DOCTYPE HTML>'
            , '<html>'
            , '  <head>'
            , doc.head.innerHTML
            , '  </head>'
            , '  <body class="' + doc.body.className + '">'
            , doc.body.innerHTML
            , '  </body>'
            , '</html>'
            ].join('\n'));

            next();
          });
        };
      })
    , function( error ){ done( !error ); }
    );
  });
};