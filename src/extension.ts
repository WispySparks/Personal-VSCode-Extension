import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import { Uri } from 'vscode';
import * as path from 'path';

// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let templatePath: string = path.join(context.extensionPath, 'templates', 'default');
	let projectPath: Uri["fsPath"];
	let projectName: string;
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
	let disposable = vscode.commands.registerCommand('java-project-template.createProject', () => {
		vscode.window.showOpenDialog(dialogOptions).then(fileUri => {
			if (fileUri != null) {
				projectPath = fileUri[0].fsPath;
				vscode.window.showInputBox(inputOptions).then(input => {
					if (input != null) {
						projectName = input;
						let projectBase: string = path.join(projectPath, projectName);
						if (!fs.pathExistsSync(projectBase)) {
							fs.ensureDirSync(projectBase);
							fs.copySync(templatePath, projectBase);
							fs.ensureDirSync(path.join(projectBase, 'src', projectName));
							fs.copyFileSync(path.join(context.extensionPath, 'templates', 'Main.java'), path.join(projectBase, 'src', projectName, 'Main.java'));
							const openNewWindow: boolean = vscode.workspace.workspaceFolders != undefined;
							vscode.commands.executeCommand('vscode.openFolder', Uri.file(projectBase), openNewWindow);
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
