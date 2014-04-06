var jsdom = require('jsdom');
var async = require('async');

module.exports = function( grunt ){
  grunt.registerMultiTask( 'rmscripts', function(){
    var done = this.async();
    var replacement = this.data.replaceWith || '';

    async.series(
      grunt.file.expand( this.data.src ).map( function( file ){
        return function( next ){
          jsdom.env( file, ["http://code.jquery.com/jquery.js"], function( errors, window ){
            var doc = window.document;
            var $ = window.$;
            var $scripts = $('script').filter( function( s ){
              return !!$(this).attr('src');
            });
            $scripts.last().after( doc.createTextNode( replacement ) );
            $scripts.remove();

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