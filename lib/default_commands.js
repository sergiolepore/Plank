var default_commands = module.exports = {
  exit: {
    command: function(cli, args) {
      cli.close();
    },
    help: function(cli) {
      cli.log(cli.tabulation + 'The ' + cli.text_color('exit', 'green') + ' command is used to quit the console session.\n');
    },
    settings: {
      description: 'Quits this console.',
      usage: 'exit',
      arguments: [],
      namespace: ''
    }
  },

  help: {
    command: function(cli, args) {
      var p_names = args.getParameterNames(),
          help_func = null,
          cmd_settings = null,
          cmd_name = '';

      if (p_names.length > 0) {
        var command_name = cmd_name = p_names[0];

        if (cli.hasCommand(command_name)) {
          if (cli.command_repository[command_name].hasOwnProperty('help')) {
            help_func = cli.command_repository[command_name].help;
            cmd_settings = cli.command_repository[command_name].settings;
          } else {
            cli.log(cli.tabulation + 'This command has no help :(');
          }
        } else {
          throw new Error('The command "' + command_name + '" does not exits.');
        }
      } else {
        help_func = default_commands.help.help;
        cmd_settings = default_commands.help.settings;
        cmd_name = 'help';
      }

      if (help_func) {
        cli.log(cli.text_color('Usage:', 'yellow'));
        cli.log(cli.tabulation + cmd_settings.usage);
        
        var max_len = 0,
            _arg_ct = [];

        if (cmd_settings.arguments.length > 0) {
          cli.log('\n' + cli.text_color('Arguments:', 'yellow'));
        }

        for (var i in cmd_settings.arguments) {
          var _arg = cmd_settings.arguments[i];

          if (_arg.name.length > max_len) {
            max_len = _arg.name.length;
          }

          _arg_ct.push(_arg);
        }

        for (var i in _arg_ct) {
          var arg_name = _arg_ct[i].name;
          cli.log(cli.tabulation + cli.text_color(arg_name, 'green') + getPadding(arg_name.length, max_len) + cli.tabulation + _arg_ct[i].description);
        }

        cli.log('\n' + cli.text_color(capitaliseFirstLetter(cmd_name) + ':', 'yellow'));
 
        help_func(cli);
      }
    },
    help: function(cli) {
      cli.log(cli.tabulation + 'The ' + cli.text_color('help', 'green') + ' command displays useful information for a given command:');
      cli.log(cli.tabulation + 'Example:');
      cli.log('\n' + cli.tabulation + cli.tabulation + cli.text_color('help list', 'green') + '\n');
    },
    settings: {
      description: 'Displays help for a given command.',
      usage: 'help [command]',
      arguments: [{ name: 'command', description: 'The command who needs help.' }],
      namespace: ''
    }
  },

  list: {
    command: function(cli, args) {
      cli.log(cli.text_color('Usage for all commands:', 'yellow'));
      cli.log(cli.tabulation + 'command [arg] [arg2] [arg_with_value="value"]\n');

      var without_ns = [],
          with_ns = {},
          max_len = 0;

      for (var cmd_name in cli.command_repository) {
        if (cmd_name.length > max_len) {
          max_len = cmd_name.length;
        }

        var cmd = cli.command_repository[cmd_name],
            cmd_ns = null,
            cmd_desc = '';

        if (cmd.hasOwnProperty('settings')) {
          if (cmd.settings.hasOwnProperty('namespace')) {
            cmd_ns = cmd.settings.namespace;
          }

          if (cmd.settings.hasOwnProperty('description')) {
            cmd_desc = cmd.settings.description;
          }
        }

        if (cmd_ns) {
          if (!with_ns.hasOwnProperty(cmd_ns)) {
            with_ns[cmd_ns] = [];
          }

          with_ns[cmd_ns].push({ name: cmd_name, description: cmd_desc });
        } else {
          without_ns.push({ name: cmd_name, description: cmd_desc });
        }
      }

      cli.log(cli.text_color('Available commands:', 'yellow'));
      
      for (var i=0;i<without_ns.length;i++) {
        outputCommand(without_ns[i].name, without_ns[i].description);
      }

      for (var ns in with_ns) {
        cli.log(cli.colors.yellow + ns + cli.colors.reset);

        for (var i in with_ns[ns]) {
          outputCommand(with_ns[ns][i].name, with_ns[ns][i].description);
        }
      }

      function outputCommand(name, description) {
        cli.log(cli.text_color(cli.tabulation + name,'green') + getPadding(name.length, max_len) + cli.tabulation + description);
      }
    },
    help: function(cli) {
      cli.log(cli.tabulation + 'The ' + cli.text_color('list', 'green') + ' command shows all available commands.');
      cli.log(cli.tabulation + 'Optionally, the commands can be filtered by their ' + cli.text_color('namespace', 'green') + '.');
      cli.log(cli.tabulation + 'Example:');
      cli.log('\n' + cli.tabulation + cli.tabulation + cli.text_color('list plank', 'green') + '\n');
    },
    settings: {
      description: 'Shows all available commands.',
      usage: 'list [namespace]',
      arguments: [{ name: 'namespace', description: 'Namespace used to filter commands.' }],
      namespace: ''
    }
  }
};

function getPadding(length, max_len) {
  var padding = '';

  for(var i=0;i<(max_len-length);i++) {
    padding += ' ';
  }

  return padding;
}

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}