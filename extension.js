// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "python-class-generator" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "extension.createPyClass",
    async function() {
      // The code you place here will be executed every time your command is executed

      if (!vscode.workspace.workspaceFolders) {
        return vscode.window.showErrorMessage(
          "Please open a directory before creating a class."
        );
      }

      // Display a message box to the user
      const className = await vscode.window.showInputBox({
        prompt: "Class Name?"
      });

      if (!className) return;

      vscode.window.showInformationMessage(`Hello ${className}`);
      let count = 1;
      let property = await vscode.window.showInputBox({
        prompt: `Property #${count}? ('done' when finished)`
      });
      const properties = [];
      while (property != "done") {
        properties.push(property);
        count++;
        property = await vscode.window.showInputBox({
          prompt: `Property #${count}? ('done' when finished)`
        });
      }

      const classDefinition = `class ${className}:`;
      const constructorDefinition = `def __init__(self, ${properties.join(
        ", "
      )}):`;
      const constructorAssignments = properties
        .map(property => `self.${property} = ${property}\n\t\t`)
        .join("");
      const classGetters = properties
        .map(
          property =>
            `\tdef get_${property}(self):\n\t\treturn self.${property}\n\n`
        )
        .join("");
      const dunderStrString = `\tdef __str__():\n \t\treturn ${properties
        .map(
          property => '"' + property + ': "' + " + " + property + ' + " , " + '
        )
        .join("")
        .slice(0, -11)}`;

      //return "name: {0}",
      const classString = `${classDefinition}
	${constructorDefinition}
		${constructorAssignments}
${classGetters}
${dunderStrString}
`;
      console.log(classString);

      const folderPath = vscode.workspace.workspaceFolders[0].uri
        .toString()
        .split(":")[1];

      fs.writeFile(
        path.join(folderPath, `${className}.py`),
        classString,
        err => {
          if (err) {
            vscode.window.showErrorMessage("Something went wrong");
            return console.log(err);
          }
          vscode.window.showInformationMessage(`${className} Class created.`);
        }
      );
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
