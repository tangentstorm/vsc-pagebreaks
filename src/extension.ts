import * as vscode from 'vscode';
import { PageBreaker } from './PageBreaker';

let onePage = true;
let pageBreaker = new PageBreaker();

export function activate(context: vscode.ExtensionContext) {

	updateEditor(pageBreaker);

	let nextPageCommand = vscode.commands.registerCommand('vsc-pagebreaks.nextPage', () => {
		pageBreaker.nextPage();
		updateEditor(pageBreaker) })

	let prevPageCommand = vscode.commands.registerCommand('vsc-pagebreaks.prevPage', () => {
		pageBreaker.prevPage();
		updateEditor(pageBreaker) })

	let toggleOnePageCommand = vscode.commands.registerCommand('vsc-pagebreaks.toggleOnePage', () => {
		onePage = !onePage;
		updateEditor(pageBreaker) })

	context.subscriptions.push(nextPageCommand);
	context.subscriptions.push(prevPageCommand);
	context.subscriptions.push(toggleOnePageCommand); }

export function deactivate() {
	onePage = false;
	updateEditor(new PageBreaker()) }

async function updateEditor(pageBreaker: PageBreaker) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) return;
	const document = editor.document;

	const hideRange = (range: vscode.Range) => {
		const selections = editor.selections;
		editor.selection = new vscode.Selection(range.start, range.end);
		vscode.commands.executeCommand('editor.createFoldingRangeFromSelection');
		editor.selections = selections; }
	const showRange = (range: vscode.Range) => {
		vscode.commands.executeCommand('editor.unfoldAll', range) }

	// first, show everything by clearing the decorations
	const fullRange = new vscode.Range(0, 0, document.lineCount, 0);
	showRange(fullRange);

	if (onePage) {
		// hide everything except the current page
		pageBreaker.findPageBreaks(document.getText())
		if (pageBreaker.hasPages) {
			const pageRange = pageBreaker.getCurrentPageRange();
			console.log('page range:', [pageRange.start.line, pageRange.end.line])
			if (pageRange.start.line > 0) {
				const prefixRange = new vscode.Range(0, 0, pageRange.start.line, 0);
				hideRange(prefixRange) }
			if (pageRange.end.line < document.lineCount) {
				const suffixRange = new vscode.Range(pageRange.end.line, 0, editor.document.lineCount, 0);
				hideRange(suffixRange) }
			const newPosition = new vscode.Position(pageRange.start.line, 0);
			editor.selection = new vscode.Selection(newPosition, newPosition);
			editor.revealRange(pageRange, vscode.TextEditorRevealType.AtTop) }}}

module.exports = { activate, deactivate }
