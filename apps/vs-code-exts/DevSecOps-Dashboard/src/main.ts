import { commands, ExtensionContext, ViewColumn, window } from 'vscode'
import { Logger } from './Logger'

// On activation
export function activate(context: ExtensionContext) {
  const logger = Logger.getInstance('debug')
  logger.info('Extension "helix-logger" activated')
  logger.debug(`Context: ${context}`)

  // Register command "start"
  commands.registerCommand('start', () => {
    const panel = window.createWebviewPanel(
      'studio', // Key used to reference the panel
      'Studio', // Title display in the tab
      ViewColumn.Active, // Editor column to show the new webview panel in.
      { enableScripts: true },
    )

    panel.webview.html = 'Hello World'

    context.subscriptions.push(panel)
  })
}
