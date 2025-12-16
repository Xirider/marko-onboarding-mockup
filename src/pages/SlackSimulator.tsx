import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Hash, ChevronDown, Plus, MessageSquare, 
  Search, MoreHorizontal, Smile, AtSign, Paperclip, Send,
  Bot, CheckCircle2, ExternalLink, ArrowLeft
} from "lucide-react"

type Message = {
  id: string
  sender: "marko" | "user"
  content: string
  timestamp: string
  blocks?: SlackBlock[]
}

type SlackBlock = {
  type: "section" | "actions" | "divider" | "context"
  text?: string
  accessory?: { type: "button"; text: string; style?: "primary" | "danger"; action: string }
  elements?: { type: "button"; text: string; style?: "primary" | "danger"; action: string; url?: string }[]
}

const TYPING_DELAY = 800
const MESSAGE_DELAY = 1500

const DOMAINS = [
  { id: "paid_ads", name: "Paid Ads", emoji: "📊", description: "Meta, Google Ads monitoring & optimization" },
  { id: "seo", name: "SEO", emoji: "🔍", description: "Rankings, keywords, technical audits" },
  { id: "content", name: "Content", emoji: "✍️", description: "Ideation, creation, publishing" },
  { id: "email", name: "Email Marketing", emoji: "📧", description: "Campaigns, automation, analytics" },
]

export function SlackSimulator() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isOnboardingFlow = searchParams.get("flow") === "onboarding"
  const connectedFromUrl = searchParams.get("connected")?.split(",").filter(Boolean) || []
  
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>(
    isOnboardingFlow ? ["meta", "hubspot", "customerio"] : connectedFromUrl
  )
  const [hasShownReturnMessage, setHasShownReturnMessage] = useState(false)
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const [domainsConfirmed, setDomainsConfirmed] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const getInitialMessages = (): Omit<Message, "id" | "timestamp">[] => {
    if (isOnboardingFlow) {
      return [
        {
          sender: "marko",
          content: "👋 Hey! Your integrations are all set up. I'm ready to start helping you with marketing.",
        },
        {
          sender: "marko",
          content: "Which areas would you like me to focus on? Select the domains you want help with:",
          blocks: [
            { type: "divider" },
            { 
              type: "actions", 
              elements: DOMAINS.map(d => ({
                type: "button" as const,
                text: `${d.emoji} ${d.name}`,
                action: `select_domain_${d.id}`,
              }))
            },
            { type: "context", text: "Click to toggle selection • Multiple domains supported" },
          ]
        },
      ]
    }
    
    return [
      {
        sender: "marko",
        content: "👋 Hey there! I'm Marko, your new AI marketing coworker. Thanks for adding me to your workspace!",
      },
      {
        sender: "marko",
        content: "Before I can start helping you with campaigns, I'll need access to your marketing tools. Click a button below to open our app and connect your integrations (you'll sign in with Slack for security).",
        blocks: [
          { type: "divider" },
          { type: "section", text: "Connect your integrations:" },
          { 
            type: "actions", 
            elements: [
              { type: "button", text: "📊 Connect Meta Ads", style: "primary", action: "connect_meta", url: "/app/integrations" },
              { type: "button", text: "🧡 Connect HubSpot", action: "connect_hubspot", url: "/app/integrations" },
              { type: "button", text: "📧 Connect Customer.io", action: "connect_customerio", url: "/app/integrations" },
            ]
          },
          { type: "context", text: "↗️ Opens app.marko.ai — Sign in with Slack required" },
        ]
      },
    ]
  }

  const messageSequence = getInitialMessages()

  const getUpdatedIntegrationMessage = (currentConnected: string[]): Omit<Message, "id" | "timestamp"> => {
    const remaining = ["meta", "hubspot", "customerio"].filter(i => !currentConnected.includes(i))
    const elements: SlackBlock["elements"] = []
    
    if (!currentConnected.includes("meta")) {
      elements.push({ type: "button", text: "📊 Connect Meta Ads", style: "primary", action: "connect_meta", url: "/app/integrations" })
    }
    if (!currentConnected.includes("hubspot")) {
      elements.push({ type: "button", text: "🧡 Connect HubSpot", action: "connect_hubspot", url: "/app/integrations" })
    }
    if (!currentConnected.includes("customerio")) {
      elements.push({ type: "button", text: "📧 Connect Customer.io", action: "connect_customerio", url: "/app/integrations" })
    }

    if (remaining.length === 0) {
      return {
        sender: "marko",
        content: "✅ All integrations connected! Now, which areas would you like me to focus on?",
        blocks: [
          { type: "divider" },
          { 
            type: "actions", 
            elements: DOMAINS.map(d => ({
              type: "button" as const,
              text: `${d.emoji} ${d.name}`,
              action: `select_domain_${d.id}`,
            }))
          },
          { type: "context", text: "Click to toggle selection • Multiple domains supported" },
        ]
      }
    }

    return {
      sender: "marko",
      content: `Great! ${currentConnected.length} integration(s) connected. ${remaining.length > 0 ? `You can still connect more:` : ""}`,
      blocks: elements.length > 0 ? [
        { type: "actions", elements },
        { type: "context", text: "↗️ Opens app.marko.ai — Sign in with Slack required" },
      ] : undefined
    }
  }

  useEffect(() => {
    if (currentStep < messageSequence.length) {
      const timer = setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          setMessages(prev => [...prev, {
            ...messageSequence[currentStep],
            id: `msg-${currentStep}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }])
          setCurrentStep(prev => prev + 1)
        }, TYPING_DELAY)
      }, currentStep === 0 ? 500 : MESSAGE_DELAY)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // Handle returning from integrations page with connected integrations
  useEffect(() => {
    if (connectedFromUrl.length > 0 && !hasShownReturnMessage && messages.length > 0) {
      setHasShownReturnMessage(true)
      
      const friendlyNames = connectedFromUrl.map(id => 
        id === "meta" ? "Meta Ads" : id === "hubspot" ? "HubSpot" : id === "customerio" ? "Customer.io" : id
      ).join(", ")

      // Add user message showing they connected
      setMessages(prev => [...prev, {
        id: `user-return-${Date.now()}`,
        sender: "user",
        content: `Connected ${friendlyNames} ✓`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])

      // Show Marko's response after a delay
      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          const updatedMsg = getUpdatedIntegrationMessage(connectedFromUrl)
          setMessages(prev => {
            // Remove old integration message with buttons
            const filtered = prev.filter(m => !m.blocks?.some(b => 
              b.type === "actions" && b.elements?.some(e => e.action?.startsWith("connect_"))
            ))
            return [...filtered, {
              ...updatedMsg,
              id: `marko-return-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]
          })
        }, TYPING_DELAY)
      }, 500)
    }
  }, [connectedFromUrl, hasShownReturnMessage, messages.length])

  const handleButtonClick = (action: string) => {
    if (action === "open_billing") {
      navigate("/app/billing")
      return
    }

    if (action.startsWith("select_domain_")) {
      const domainId = action.replace("select_domain_", "")
      setSelectedDomains(prev => 
        prev.includes(domainId) 
          ? prev.filter(d => d !== domainId)
          : [...prev, domainId]
      )
      return
    }

    if (action === "confirm_domains") {
      handleConfirmDomains()
      return
    }

    let integration = ""
    if (action === "connect_meta") integration = "meta"
    if (action === "connect_hubspot") integration = "hubspot"
    if (action === "connect_customerio") integration = "customerio"

    if (integration && !connectedIntegrations.includes(integration)) {
      // Navigate directly to sign-in with Slack, then to integrations
      navigate(`/auth/signin?integration=${integration}&flow=slack`)
    }
  }

  const handleConfirmDomains = () => {
    if (selectedDomains.length === 0) return
    
    setDomainsConfirmed(true)
    const selectedNames = selectedDomains.map(id => DOMAINS.find(d => d.id === id)?.name).filter(Boolean)
    
    setMessages(prev => [...prev, {
      id: `user-confirm-${Date.now()}`,
      sender: "user",
      content: `Let's focus on: ${selectedNames.join(", ")}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])

    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const domainDescriptions = selectedDomains.map(id => {
          const domain = DOMAINS.find(d => d.id === id)
          if (!domain) return ""
          switch(domain.id) {
            case "paid_ads": return "• **Paid Ads**: I'll monitor your Meta & Google campaigns, alert you to issues, and suggest optimizations"
            case "seo": return "• **SEO**: I'll track rankings, find keyword opportunities, and run technical audits"
            case "content": return "• **Content**: I'll help with ideation, track your content pipeline, and assist with publishing"
            case "email": return "• **Email**: I'll analyze campaign performance, suggest A/B tests, and help with automation"
            default: return ""
          }
        }).filter(Boolean)

        setMessages(prev => [...prev, {
          id: `marko-confirm-${Date.now()}`,
          sender: "marko",
          content: `Perfect! I'm now set up to help you with:\n\n${domainDescriptions.join("\n")}\n\n🚀 **I'll start by:**\n• Analyzing your current setup\n• Checking for any immediate issues\n• Preparing an initial assessment\n\nI'll message you when I find something interesting. In the meantime, feel free to ask me anything!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }])
      }, TYPING_DELAY + 300)
    }, 300)
  }

  const simulateIntegrationConnected = (integration: string) => {
    if (!connectedIntegrations.includes(integration)) {
      const newConnected = [...connectedIntegrations, integration]
      setConnectedIntegrations(newConnected)
      
      const friendlyName = integration === "meta" ? "Meta Ads" : integration === "hubspot" ? "HubSpot" : "Customer.io"
      
      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          const updatedMsg = getUpdatedIntegrationMessage(newConnected)
          setMessages(prev => {
            const newMsgs = prev.filter(m => !m.blocks?.some(b => b.type === "actions"))
            return [...newMsgs, {
              ...updatedMsg,
              id: `marko-update-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]
          })
        }, TYPING_DELAY)
      }, 500)
    }
  }

  const sendUserMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])

    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        let response: Omit<Message, "id" | "timestamp">

        if (text.toLowerCase().includes("billing") || text.toLowerCase().includes("upgrade")) {
          response = {
            sender: "marko",
            content: "You can manage your billing and subscription here:",
            blocks: [
              { 
                type: "actions", 
                elements: [
                  { type: "button", text: "💳 Open Billing", style: "primary", action: "open_billing", url: "/app/billing" }
                ]
              }
            ]
          }
        } else if (text.toLowerCase().includes("meta") || text.toLowerCase().includes("ads")) {
          response = {
            sender: "marko",
            content: connectedIntegrations.includes("meta") 
              ? "📊 **Meta Ads Summary (Last 7 days)**\n\n• Spend: $2,450 (+12% vs prev week)\n• ROAS: 3.2x (target: 3.0x) ✅\n• Impressions: 145K\n• CTR: 1.8%\n\nYour campaigns are performing well! I noticed the 'Summer Sale' ad set has a 4.1x ROAS — want me to suggest increasing its budget?"
              : "I'd love to help with Meta Ads, but I'll need you to connect that integration first! Click the button above to get started."
          }
        } else {
          response = {
            sender: "marko",
            content: "I'm here to help! I can assist with:\n\n• **Campaign monitoring** — \"How are my ads performing?\"\n• **Optimization suggestions** — \"What should I improve?\"\n• **Reports** — \"Give me a weekly summary\"\n• **Content ideas** — \"Suggest blog topics\"\n\nWhat would you like to know?"
          }
        }

        setMessages(prev => [...prev, {
          ...response,
          id: `marko-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }])
      }, TYPING_DELAY + 500)
    }, 300)
  }

  return (
    <div className="h-screen bg-[#1a1d21] flex flex-col overflow-hidden">
      <div className="bg-zinc-900 border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to app
          </Link>
          <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
            Slack Simulator — Flow B Demo
          </Badge>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/auth/signin")}
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          Try App-First Flow Instead
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <SlackSidebar />
        
        <div className="flex-1 flex flex-col bg-[#1a1d21]">
          <div className="border-b border-white/5 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">Marko</span>
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    Active
                  </span>
                </div>
                <span className="text-xs text-zinc-500">AI Marketing Coworker</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-zinc-500">
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-800">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-800">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 px-4 py-4" ref={scrollRef}>
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((msg) => (
                <MessageBubble 
                  key={msg.id} 
                  message={msg} 
                  onButtonClick={handleButtonClick}
                  selectedDomains={selectedDomains}
                  domainsConfirmed={domainsConfirmed}
                />
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-3">
                  <Avatar className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600">
                    <AvatarFallback className="rounded-lg bg-transparent">
                      <Bot className="w-4 h-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="px-3 py-2 bg-zinc-800/50 rounded-lg">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <MessageInput onSend={sendUserMessage} />
        </div>
      </div>
    </div>
  )
}

function SlackSidebar() {
  return (
    <div className="w-64 bg-[#19171d] border-r border-white/5 flex flex-col">
      <div className="p-3 border-b border-white/5">
        <button className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-white/5 rounded">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <span className="font-semibold text-white text-sm">Acme Corp</span>
          </div>
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <SidebarSection title="Channels">
          <SidebarItem icon={<Hash className="w-4 h-4" />} label="general" />
          <SidebarItem icon={<Hash className="w-4 h-4" />} label="marketing" />
          <SidebarItem icon={<Hash className="w-4 h-4" />} label="random" />
        </SidebarSection>

        <SidebarSection title="Direct Messages">
          <SidebarItem 
            icon={
              <div className="relative">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                  <Bot className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-[#19171d]" />
              </div>
            } 
            label="Marko" 
            active 
          />
          <SidebarItem 
            icon={<div className="w-4 h-4 rounded bg-orange-500 flex items-center justify-center text-[10px] text-white font-bold">J</div>} 
            label="Jane Smith" 
          />
          <SidebarItem 
            icon={<div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">M</div>} 
            label="Mike Chen" 
          />
        </SidebarSection>
      </div>
    </div>
  )
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-2 mb-2">
      <button className="w-full flex items-center gap-1 px-2 py-1 text-zinc-500 hover:text-zinc-300 text-xs font-medium">
        <ChevronDown className="w-3 h-3" />
        {title}
      </button>
      <div className="mt-1">{children}</div>
    </div>
  )
}

function SidebarItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-2 px-2 py-1 rounded text-sm ${
      active ? "bg-cyan-500/20 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"
    }`}>
      {icon}
      <span className="truncate">{label}</span>
    </button>
  )
}

function MessageBubble({ 
  message, 
  onButtonClick, 
  selectedDomains = [],
  domainsConfirmed = false 
}: { 
  message: Message
  onButtonClick: (action: string) => void
  selectedDomains?: string[]
  domainsConfirmed?: boolean
}) {
  const isMarko = message.sender === "marko"
  const hasDomainButtons = message.blocks?.some(b => 
    b.type === "actions" && b.elements?.some(e => e.action.startsWith("select_domain_"))
  )
  
  return (
    <div className={`flex items-start gap-3 ${isMarko ? "" : "flex-row-reverse"}`}>
      {isMarko ? (
        <Avatar className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 shrink-0">
          <AvatarFallback className="rounded-lg bg-transparent">
            <Bot className="w-4 h-4 text-white" />
          </AvatarFallback>
        </Avatar>
      ) : (
        <Avatar className="w-9 h-9 rounded-lg bg-purple-500 shrink-0">
          <AvatarFallback className="rounded-lg bg-transparent text-white text-sm font-bold">
            Y
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex-1 ${isMarko ? "" : "flex flex-col items-end"}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-white text-sm">
            {isMarko ? "Marko" : "You"}
          </span>
          {isMarko && (
            <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-400 border-0 text-[10px] py-0 px-1.5">
              APP
            </Badge>
          )}
          <span className="text-xs text-zinc-500">{message.timestamp}</span>
        </div>
        
        <div className={`${isMarko ? "bg-zinc-800/50" : "bg-cyan-600/20"} rounded-lg px-3 py-2 max-w-xl`}>
          <p className="text-zinc-200 text-sm whitespace-pre-wrap">{message.content}</p>
          
          {message.blocks?.map((block, i) => (
            <div key={i} className="mt-2">
              {block.type === "divider" && <hr className="border-zinc-700 my-2" />}
              {block.type === "section" && (
                <p className="text-zinc-300 text-sm" dangerouslySetInnerHTML={{ 
                  __html: block.text?.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') || "" 
                }} />
              )}
              {block.type === "actions" && (
                <div className="space-y-3 mt-3">
                  <div className="flex flex-wrap gap-2">
                    {block.elements?.map((el, j) => {
                      const isDomainButton = el.action.startsWith("select_domain_")
                      const domainId = isDomainButton ? el.action.replace("select_domain_", "") : ""
                      const isSelected = isDomainButton && selectedDomains.includes(domainId)
                      
                      if (isDomainButton && domainsConfirmed) return null
                      
                      return (
                        <Button
                          key={j}
                          size="sm"
                          onClick={() => onButtonClick(el.action)}
                          className={
                            isDomainButton 
                              ? isSelected
                                ? "bg-cyan-600 hover:bg-cyan-500 text-white ring-2 ring-cyan-400"
                                : "bg-zinc-700 hover:bg-zinc-600 text-white"
                              : el.style === "primary" 
                                ? "bg-cyan-600 hover:bg-cyan-500 text-white" 
                                : "bg-zinc-700 hover:bg-zinc-600 text-white"
                          }
                        >
                          {isDomainButton && isSelected && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {el.text}
                          {el.url && <ExternalLink className="w-3 h-3 ml-1" />}
                        </Button>
                      )
                    })}
                  </div>
                  {hasDomainButtons && selectedDomains.length > 0 && !domainsConfirmed && (
                    <Button
                      size="sm"
                      onClick={() => onButtonClick("confirm_domains")}
                      className="bg-green-600 hover:bg-green-500 text-white w-full"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Confirm Selection ({selectedDomains.length} domain{selectedDomains.length > 1 ? 's' : ''})
                    </Button>
                  )}
                </div>
              )}
              {block.type === "context" && (
                <p className="text-xs text-zinc-500 mt-2 italic">{block.text}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MessageInput({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onSend(text.trim())
      setText("")
    }
  }

  return (
    <div className="p-4 border-t border-white/5">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-zinc-800/50 rounded-lg border border-zinc-700 px-3 py-2">
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-transparent">
          <Plus className="w-5 h-5" />
        </Button>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Message Marko... (try: 'How are my ads?' or 'billing')"
          className="flex-1 bg-transparent text-white placeholder-zinc-500 text-sm outline-none"
        />
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-transparent">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-transparent">
            <Smile className="w-4 h-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-transparent">
            <AtSign className="w-4 h-4" />
          </Button>
          <Button 
            type="submit" 
            size="icon" 
            disabled={!text.trim()}
            className="h-8 w-8 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
      <p className="text-xs text-zinc-600 mt-2 text-center">
        This is a simulation. In the real app, Marko communicates through actual Slack messages.
      </p>
    </div>
  )
}

