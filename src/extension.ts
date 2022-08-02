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
				return "Must give a name";
			}
			else if (value.match("[\\\\/:*?\"<>|]") != null) {
				return "Illegal Characters";
			}
			else if (fs.pathExistsSync(path.join(projectPath, value)) && value.length > 0) {
				return "Directory already exists";
			}
			else {
				return "";
			}
		},
	};
	let disposable = vscode.commands.registerCommand('java-project-template.createProject', () => {
		vscode.window.showOpenDialog(dialogOptions).then(fileUri => {
			if (fileUri == undefined) return;
			projectPath = fileUri[0].fsPath;
			vscode.window.showInputBox(inputOptions).then(input => {
				if (input == undefined) return;
				projectName = input;
				let projectBase: string = path.join(projectPath, projectName);
				fs.ensureDirSync(projectBase);
				fs.copySync(templatePath, projectBase);
				fs.ensureDirSync(path.join(projectBase, 'src', projectName));
				fs.copyFileSync(path.join(context.extensionPath, 'templates', 'Main.java'), path.join(projectBase, 'src', projectName, 'Main.java'));
				let file = fs.readFileSync(path.join(projectBase, 'src', projectName, 'Main.java'));
				fs.writeFileSync(path.join(projectBase, 'src', projectName, 'Main.java'), ("package " + projectName + ";\n" + file.toString()));
				const openNewWindow: boolean = vscode.workspace.workspaceFolders != undefined;
				vscode.commands.executeCommand('vscode.openFolder', Uri.file(projectBase), openNewWindow);
			});
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
