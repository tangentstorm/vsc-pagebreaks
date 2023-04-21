import * as vscode from 'vscode';

export class PageBreaker {
  currentPage: number = 0;
  pageBreaks: number[] = [0];

  get hasPages() { return this.pageBreaks.length > 1 }

  findPageBreaks(text: string) {
    const lines = text.split('\n');
    this.pageBreaks = [0]
    lines.forEach((line, ix) => {
      if (line.startsWith('\f')) this.pageBreaks.push(ix) })
    this.pageBreaks.push(lines.length)
    console.log('page breaks:', this.pageBreaks)}

  getCurrentPage() {
    if (!this.hasPages) return { start: 0, end: 0 }
    let start = this.pageBreaks[this.currentPage]
    if (start > 0) start += 1 // to hide the ff char
    const end = this.pageBreaks[this.currentPage + 1]
    return { start, end } }

  getCurrentPageRange() {
    const { start, end } = this.getCurrentPage()
    return new vscode.Range(start, 0, end, 0) }

  nextPage() {
    // -2 because last entry is the total number of lines
    if (this.currentPage < this.pageBreaks.length - 2) {
      this.currentPage += 1 }}

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage -= 1 }}}
