/*
  _____  _             _    
 |  __ \| |           | |   
 | |__) | | __ _ _ __ | | __
 |  ___/| |/ _` | '_ \| |/ /
 | |    | | (_| | | | |   < 
 |_|    |_|\__,_|_| |_|_|\_\

    The CLI module for Node.js
    
*/
var readline = require('readline'),
    default_commands = require('./default_commands.js'),
    command_parser = require('./command_parser.js')(),
    readline_interface = null;

var plank = module.exports = function(options) {
  var default_options = {
    name: 'Plank',
    header: function(cli) {
      cli.log(cli.colors.green);
      cli.log('  _____  _             _    ');
      cli.log(' |  __ \\| |           | |   ');
      cli.log(' | |__) | | __ _ _ __ | | __');
      cli.log(' |  ___/| |/ _` | \'_ \\| |/ /');
      cli.log(' | |    | | (_| | | | |   < ');
      cli.log(' |_|    |_|\\__,_|_| |_|_|\\_\\');
      cli.log('                             ');
      cli.log('    The CLI module for Node.js')
      cli.log(cli.colors.reset + '\n');
    }
  }

  plank.options = options || default_options;
  
  plank.colors = {};
  plank.colors.red    = '\u001b[31m';
  plank.colors.green  = '\u001b[32m';
  plank.colors.blue   = '\u001b[34m';
  plank.colors.yellow = '\u001b[33m';
  plank.colors.cyan  = '\u001b[36m';
  plank.colors.white  = '\u001b[37m';
  plank.colors.inverse= '\u001b[7m';
  plank.colors.reset  = '\u001b[0m';

  plank.tabulation = '  ';

  plank.command_repository = default_commands;

  plank.command_parser = new command_parser();

  return plank;
};

plank.lineListener = function(line) {
  plank.command_parser.parseCommandLine(line);
  var command = plank.command_parser.getBaseCommand();

  if (plank.command_repository.hasOwnProperty(command)) {
    plank.command_repository[command].command(plank, plank.command_parser);
  } else {
    throw new Error('Command not found. Type "list" to see all available commands.');
  }

  readline_interface.prompt();
}

plank.setCommands = function(commands) {
  // merge command_repository with new commands
  for (var cmd_name in commands) {
    if (plank.command_repository.hasOwnProperty(cmd_name)) {
      throw new Error('Error loading commands. Duplicate name for ' + plank.text_color(cmd_name, 'yellow') + '.');
    }

    plank.command_repository[cmd_name] = commands[cmd_name];
  }
}

plank.hasCommand = function(name) {
  var ret = false;

  if(plank.command_repository.hasOwnProperty(name)) {
    ret = true;
  }

  return ret;
}

plank.log = function(data) {
  console.log(data);
}

plank.text_color = function(text, color) {
  return plank.colors[color] + text + plank.colors.reset;
}

plank.run = function() {
  process.on('uncaughtException', plank.errorListener);

  plank.options.header(plank);
  plank.log('Welcome to the ' + plank.text_color(plank.options.name,'yellow') + ' console.\n');
  plank.log('Type ' + plank.text_color('help', 'yellow') + ' to learn how to use plank console or');
  plank.log('type ' + plank.text_color('list', 'yellow') + ' for a list of available commands.');
  plank.log('To quit the console, type ' + plank.text_color('exit', 'yellow') + '\n');

  readline_interface = readline.createInterface(process.stdin, process.stdout);
  readline_interface.setPrompt(plank.options.name + ' > ');
  readline_interface.prompt();

  readline_interface.on('line', plank.lineListener);
  readline_interface.on('close', function() {
    plank.log('\n- ' + plank.text_color('bye!', 'yellow') + '\n');
    process.exit(0);
  });
}

plank.close = function() {
  readline_interface.close();
}

plank.errorListener = function(err) {
  plank.log('\n' + '\u001b[41m' + plank.colors.white);
  plank.log('\n' + plank.tabulation +'[UncaughtException]');
  plank.log(plank.tabulation + err.message);
  plank.log('\n' + plank.colors.reset + '\n');

  readline_interface.prompt();
}