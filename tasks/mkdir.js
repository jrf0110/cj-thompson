var wrench = require('wrench');

module.exports = function( grunt ){
  grunt.registerMultiTask( 'mkdir', function(){
    this.data.dir.forEach( function( dir ){
      // Remove if it currently exists
      if ( fs.existsSync( dir ) ) wrench.rmdirSyncRecursive( dir );

      fs.mkdirSync( dir );
    });
  });
};