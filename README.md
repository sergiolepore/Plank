Plank
=====

[![Join the chat at https://gitter.im/sergiolepore/Plank](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/sergiolepore/Plank?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

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

* Write, at least, a minimal documentation :D
* For "list" command, enable filters by namespace (execute `help list` to read about namespace argument)

Changelog
---------

0.1.3:
* Fixed static name on console bootup (always showing `plank` instead of the setted name).