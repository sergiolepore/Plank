var parser = module.exports = function(){
  parser.command_line = null;
  parser.assignment_char = '=';
  parser.parameter_value_delimiter = '"';

  parser.base_command = null;
  parser.parameter_bag = [];

  return parser;
};

parser.parseCommandLine = function(command_line) {
  parser.reset();

  var command_pieces = null;

  parser.command_line = command_line.trim();
  command_pieces = parser.command_line.split(' ');
  // first argument has to be base command
  parser.base_command = command_pieces[0];

  //remove the command, now we have parameters
  command_pieces.shift();

  for (var i in command_pieces) {
    var param_pieces = null,
        param = null,
        value = null;

    param_pieces = command_pieces[i].split(parser.assignment_char);
    // first piece must be parameter, followed by the value (if exists)
    param = param_pieces[0];
    
    if (param_pieces.length > 1) {
      //only if parameter has value...
      var re = new RegExp(parser.parameter_value_delimiter, 'g');
      // replace param delimiter with empty...from this: "value" to value
      value = param_pieces[1].replace(re, '');
    }

    parser.parameter_bag.push({ name: param, value: value });
  }
}

parser.getBaseCommand = function() {
  return parser.base_command;
}

parser.getParameterNames = function() {
  var ret = [];

  for (var i in parser.parameter_bag) {
    ret.push(parser.parameter_bag[i].name);
  }

  return ret;
}

parser.getParameterValue = function(parameter) {
  var ret = null;

  for (var i in parser.parameter_bag) {
    if (parser.parameter_bag[i].name == parameter) {
      ret = parser.parameter_bag[i].value;
      break;
    }
  }

  return ret;
}

parser.getAll = function() {
  return { command: parser.base_command, parameters: parser.parameter_bag };
}

parser.hasParameter = function(parameter) {
  var ret = false;

  if (parser.getParameterNames().indexOf(parameter) > -1) {
    ret = true;
  }

  return ret;
}

parser.reset = function() {
  parser.command_line = null;
  parser.base_command = null;
  parser.parameter_bag = [];
}

parser.toObject = function() {
  var all = parser.getAll(),
      ret = {};

  if (all.hasOwnProperty('parameters')) {
    ret.base_command = all.command;

    for (var i in all.parameters) {
      ret[all.parameters[i].name] = all.parameters[i].value;
    }
  }

  return ret;
}