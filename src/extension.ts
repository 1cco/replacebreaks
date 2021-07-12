// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "replacebreaks" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('replacebreaks.replace', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello VS Code! from ReplaceBreaks!');

		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		let doc = editor.document;
		let selections = editor.selections;
		if (selections.length === 0) {
			let startPos = new vscode.Position(0, 0);
			let endPos = new vscode.Position(doc.lineCount - 1, 10000);
			selections[0] = new vscode.Selection(startPos, endPos);
		}
		selections.forEach(selection => {
			if (!selection.isEmpty) {
				let text = doc.getText(selection);
				let paragraphs = text.split(/\n{2,}/);
				paragraphs.forEach((paragraph, i) => {
					// console.log(paragraph, i);
					paragraph = paragraph.replace(/\n/g, '<br>\n');
					let lines = paragraph.split(/\n/);
					lines.forEach((line, i) => {
						if (i !== 0) {
							line = line.replace(/^(\s*)(.*)/, '$2');
						}
						lines[i] = line;
					});
					paragraph = lines.join('');
					paragraph = paragraph.replace(/^(\s*)(.*)/m, '$1<p>$2</p>');
					paragraphs[i] = paragraph;
				});
				text = paragraphs.join('\n');
				// text = text.replace(/\n/g, "");
				editor?.edit((edit) => {
					edit.replace(selection, text);
				});
			}
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
