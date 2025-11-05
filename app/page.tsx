'use client'

import { useState, useEffect, useRef } from 'react'

type Message = {
  id: string
  type: 'user' | 'bot' | 'system'
  content: string
  timestamp: Date
}

type GeneratedDApp = {
  id: string
  name: string
  type: string
  url: string
  status: 'generating' | 'ready'
  features: string[]
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to SolanaBot! I can generate Solana dApps for you. Try commands like "/create memecoin" or "/generate launchpad"',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [generatedDApps, setGeneratedDApps] = useState<GeneratedDApp[]>([])
  const [showDApps, setShowDApps] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleTwitterLogin = () => {
    setIsLoggedIn(true)
    setUsername('@CryptoBuilder' + Math.floor(Math.random() * 1000))
    addMessage('bot', `Successfully authenticated with X! Welcome ${username}. You can now generate dApps.`)
  }

  const addMessage = (type: 'user' | 'bot' | 'system', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const generateDApp = (type: string, name: string) => {
    const dapp: GeneratedDApp = {
      id: Date.now().toString(),
      name,
      type,
      url: `https://${name.toLowerCase().replace(/\s/g, '-')}.solanabot.app`,
      status: 'generating',
      features: type === 'memecoin' 
        ? ['Token Creation', 'Liquidity Pool', 'Trading Interface', 'Wallet Integration']
        : ['Project Submission', 'IDO Management', 'Vesting Schedule', 'Token Distribution']
    }
    
    setGeneratedDApps(prev => [...prev, dapp])
    
    setTimeout(() => {
      setGeneratedDApps(prev => 
        prev.map(d => d.id === dapp.id ? { ...d, status: 'ready' } : d)
      )
      addMessage('bot', `✅ Your ${type} dApp "${name}" is ready! Access it at: ${dapp.url}`)
    }, 5000)
  }

  const handleCommand = (command: string) => {
    if (!isLoggedIn) {
      addMessage('bot', '⚠️ Please login with X (Twitter) first to generate dApps.')
      return
    }

    const lowerCommand = command.toLowerCase()
    
    if (lowerCommand.includes('/create memecoin') || lowerCommand.includes('/generate memecoin')) {
      const name = 'MoonCoin Launch'
      addMessage('bot', `🚀 Generating memecoin launchpad: "${name}"... This will take a few seconds.`)
      generateDApp('memecoin', name)
    } else if (lowerCommand.includes('/create launchpad') || lowerCommand.includes('/generate launchpad')) {
      const name = 'SolPad IDO'
      addMessage('bot', `🚀 Generating IDO launchpad: "${name}"... This will take a few seconds.`)
      generateDApp('launchpad', name)
    } else if (lowerCommand.includes('/create') || lowerCommand.includes('/generate')) {
      addMessage('bot', '🤔 I can create: \n• Memecoin Launchpad (/create memecoin)\n• IDO Launchpad (/create launchpad)')
    } else if (lowerCommand.includes('/help')) {
      addMessage('bot', `Available commands:
• /create memecoin - Generate a memecoin launchpad
• /create launchpad - Generate an IDO platform
• /list - Show all your generated dApps
• /help - Show this help message`)
    } else if (lowerCommand.includes('/list')) {
      if (generatedDApps.length === 0) {
        addMessage('bot', "You haven't generated any dApps yet. Try /create memecoin")
      } else {
        setShowDApps(true)
        addMessage('bot', `You have ${generatedDApps.length} generated dApp(s). Check the sidebar!`)
      }
    } else {
      addMessage('bot', `I didn't understand that command. Try /help to see available commands.`)
    }
  }

  const handleSend = () => {
    if (!input.trim()) return

    addMessage('user', input)
    
    if (input.startsWith('/')) {
      handleCommand(input)
    } else {
      addMessage('bot', 'Use commands starting with "/" to interact with me. Type /help for available commands.')
    }
    
    setInput('')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-solana-dark via-solana-gray to-solana-dark">
      {/* Header */}
      <header className="border-b border-solana-purple/20 backdrop-blur-sm bg-solana-dark/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-solana-purple to-solana-green flex items-center justify-center glow-purple">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">SolanaBot</h1>
                <p className="text-xs text-gray-400">AI-Powered dApp Generator</p>
              </div>
            </div>
            
            {!isLoggedIn ? (
              <button
                onClick={handleTwitterLogin}
                className="flex items-center space-x-2 bg-twitter hover:bg-twitter/90 text-white px-6 py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>Login with X</span>
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-solana-gray px-4 py-2 rounded-lg border border-solana-green/30">
                  <div className="w-2 h-2 bg-solana-green rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">{username}</span>
                </div>
                <button
                  onClick={() => setShowDApps(!showDApps)}
                  className="relative bg-solana-purple hover:bg-solana-purple/80 px-4 py-2 rounded-lg font-medium transition-all"
                >
                  My dApps
                  {generatedDApps.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-solana-green text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {generatedDApps.length}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${showDApps ? 'mr-80' : ''}`}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex space-x-3 max-w-2xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-twitter' 
                        : message.type === 'bot'
                        ? 'bg-gradient-to-r from-solana-purple to-solana-green'
                        : 'bg-solana-gray'
                    }`}>
                      {message.type === 'user' ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      ) : message.type === 'bot' ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Message Content */}
                    <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-twitter text-white'
                          : message.type === 'bot'
                          ? 'bg-solana-gray border border-solana-purple/30'
                          : 'bg-solana-gray/50 border border-solana-green/20'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 px-2">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-solana-purple/20 backdrop-blur-sm bg-solana-dark/50 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isLoggedIn ? "Type a command... (try /help)" : "Login with X to start"}
                  disabled={!isLoggedIn}
                  className="flex-1 bg-solana-gray border border-solana-purple/30 rounded-lg px-4 py-3 focus:outline-none focus:border-solana-purple focus:ring-2 focus:ring-solana-purple/20 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleSend}
                  disabled={!isLoggedIn || !input.trim()}
                  className="bg-gradient-to-r from-solana-purple to-solana-green hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  Send
                </button>
              </div>
              
              {/* Quick Commands */}
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => { setInput('/create memecoin'); }}
                  className="text-xs bg-solana-gray hover:bg-solana-purple/20 border border-solana-purple/30 px-3 py-1.5 rounded-full transition-all"
                >
                  /create memecoin
                </button>
                <button
                  onClick={() => { setInput('/create launchpad'); }}
                  className="text-xs bg-solana-gray hover:bg-solana-green/20 border border-solana-green/30 px-3 py-1.5 rounded-full transition-all"
                >
                  /create launchpad
                </button>
                <button
                  onClick={() => { setInput('/list'); }}
                  className="text-xs bg-solana-gray hover:bg-twitter/20 border border-twitter/30 px-3 py-1.5 rounded-full transition-all"
                >
                  /list
                </button>
                <button
                  onClick={() => { setInput('/help'); }}
                  className="text-xs bg-solana-gray hover:bg-white/10 border border-white/20 px-3 py-1.5 rounded-full transition-all"
                >
                  /help
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Generated dApps */}
        <div className={`fixed right-0 top-16 bottom-0 w-80 bg-solana-gray border-l border-solana-purple/20 transform transition-transform duration-300 ${
          showDApps ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold gradient-text">Your dApps</h2>
              <button
                onClick={() => setShowDApps(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {generatedDApps.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-solana-dark rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">No dApps generated yet</p>
                <p className="text-gray-500 text-xs mt-1">Use /create memecoin to start</p>
              </div>
            ) : (
              <div className="space-y-3">
                {generatedDApps.map((dapp) => (
                  <div
                    key={dapp.id}
                    className="bg-solana-dark rounded-lg p-4 border border-solana-purple/30 hover:border-solana-purple/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{dapp.name}</h3>
                      {dapp.status === 'generating' ? (
                        <span className="flex items-center space-x-1 text-xs text-yellow-400">
                          <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Building...</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-xs text-solana-green">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Ready</span>
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-400 mb-3 capitalize">{dapp.type} Platform</p>
                    
                    <div className="space-y-1 mb-3">
                      {dapp.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs text-gray-300">
                          <svg className="w-3 h-3 text-solana-green" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {dapp.status === 'ready' && (
                      <div className="space-y-2">
                        <a
                          href={dapp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-gradient-to-r from-solana-purple to-solana-green hover:opacity-90 text-center py-2 rounded-lg text-xs font-semibold transition-all"
                        >
                          Open dApp
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(dapp.url)
                            addMessage('system', `Copied URL: ${dapp.url}`)
                          }}
                          className="block w-full bg-solana-gray hover:bg-solana-gray/70 text-center py-2 rounded-lg text-xs font-medium transition-all border border-solana-purple/30"
                        >
                          Copy Link
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <footer className="border-t border-solana-purple/20 backdrop-blur-sm bg-solana-dark/50 py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-solana-green rounded-full animate-pulse"></div>
                <span>Solana Mainnet</span>
              </div>
              <div>dApps Generated: <span className="text-solana-green font-semibold">{generatedDApps.length}</span></div>
            </div>
            <div className="flex items-center space-x-2">
              <span>Powered by</span>
              <span className="gradient-text font-bold">SolanaBot AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}