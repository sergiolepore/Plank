Plank
=====

CLI Module for Node.js

Installation
------------

    npm install plank

Usage
-----

    var cli = require('plank')();  

    cli.setCommands({  
      test: {  
        command: function(cli, args) {  
          cli.log('hi!');  
        },  
        help: function(cli) {  
          cli.log(cli.tabulation + 'Hi, I am the help for this command...');  
          cli.log(cli.tabulation + 'I describe the command.........\n');  
        },  
        settings: {  
          usage: 'test [arguments]',  
          description: 'Testing...',  
          arguments: [{name: 'a', description: 'A is a...' }],  
          namespace: 'ns'  
        }  
      },  
    });  
    
    cli.run();

TODOs
-----

* For "list" command, enable filters by namespace (execute `help list` to read about namespace argument)