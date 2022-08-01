import * as vscode from 'vscode';
import * as fs from 'fs';
import { Uri } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	const dialogOptions: vscode.OpenDialogOptions = {
		canSelectMany: false,
		openLabel: 'Select Project Location',
		canSelectFiles: false,
		canSelectFolders: true
	};
	const inputOptions: vscode.InputBoxOptions = {
		prompt: "Input a Project Name",
		validateInput(value) {
			if (value.length <= 0) {
				return "Must give a Name";
			}
			else {
				return "";
			}
		},
	}
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let path: Uri["fsPath"];
	let name: string;
	let disposable = vscode.commands.registerCommand('java-project-template.createProject', () => {
		vscode.window.showInformationMessage('Command Run');
		vscode.window.showOpenDialog(dialogOptions).then(fileUri => {
			if (fileUri != null) {
				vscode.window.showInformationMessage(fileUri[0].fsPath);
				path = fileUri[0].fsPath;
				vscode.window.showInputBox(inputOptions).then(input => {
					if (input != null) {
						vscode.window.showInformationMessage(input);
						name = input;
						if (!fs.existsSync(path + "\\" + name)) {
							fs.mkdirSync(path + "\\" + name);
							vscode.commands.executeCommand('vscode.openFolder', Uri.file(path + "\\" + name))
						}
						else {
							vscode.window.showErrorMessage("Already a Directory with that Name.");
						}
					}
				});
			}
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
