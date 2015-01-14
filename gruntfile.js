module.exports = function( grunt ) {

  grunt.initConfig({

    aws: grunt.file.readJSON( '../../Amazon/freedom@agencycloud.io/rvdm.json' ),

    s3: {

      options: {

        accessKeyId: "<%= aws.accessKeyId %>",
        secretAccessKey: "<%= aws.secretAccessKey %>",
        bucket: "freedommodels",
        region: "us-west-1",
        headers: {

          CacheControl: 60

        }

      },

      public : {

        cwd : 'public/',
        src : '**'

      },

      lab : {

        cwd : 'lab/',
        src : '**'

      }

    }

  });

  grunt.loadNpmTasks( 'grunt-aws' );

  grunt.registerTask( 'default' , [ 's3' ]);

};
