import { useState, useEffect } from "react"
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, ArrowLeft, CheckCircle2, ExternalLink, ArrowRight, MessageSquare } from "lucide-react"

type Integration = {
  id: string
  name: string
  description: string
  icon: string
  category: string
  connected: boolean
}

const initialIntegrations: Integration[] = [
  { id: "meta", name: "Meta Ads", description: "Facebook & Instagram advertising", icon: "📊", category: "Ads", connected: false },
  { id: "google-ads", name: "Google Ads", description: "Search & display advertising", icon: "🔍", category: "Ads", connected: false },
  { id: "hubspot", name: "HubSpot", description: "CRM & marketing automation", icon: "🧡", category: "CRM", connected: false },
  { id: "notion", name: "Notion", description: "Docs & knowledge base", icon: "📝", category: "Productivity", connected: false },
  { id: "customerio", name: "Customer.io", description: "Email campaigns & automation", icon: "📧", category: "Email", connected: false },
  { id: "stripe", name: "Stripe", description: "Payments & subscriptions", icon: "💳", category: "Payments", connected: false },
  { id: "moz", name: "Moz", description: "SEO analytics & research", icon: "📈", category: "SEO", connected: false },
  { id: "github", name: "GitHub", description: "Code & issue tracking", icon: "🐙", category: "Dev", connected: false },
]

export function Integrations() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [integrations, setIntegrations] = useState(initialIntegrations)
  const [justConnected, setJustConnected] = useState<string | null>(null)
  
  const connectParam = searchParams.get("connect")
  const connectedParam = searchParams.get("connected")
  const integrationParam = searchParams.get("integration") // Coming from Slack flow
  const returnTo = searchParams.get("returnTo")
  const flowParam = searchParams.get("flow")
  const isFromSlack = returnTo === "slack" || flowParam === "slack"
  
  const connectedCount = integrations.filter(i => i.connected).length

  useEffect(() => {
    // Handle legacy connect param
    if (connectParam) {
      setIntegrations(prev => prev.map(i => 
        i.id === connectParam ? { ...i, connected: true } : i
      ))
      setJustConnected(connectParam)
    }
    // Handle OAuth callback with connected param
    if (connectedParam) {
      setIntegrations(prev => prev.map(i => 
        i.id === connectedParam ? { ...i, connected: true } : i
      ))
      setJustConnected(connectedParam)
    }
  }, [connectParam, connectedParam])

  // Auto-trigger OAuth flow for integration specified in URL (coming from Slack)
  useEffect(() => {
    if (integrationParam && isFromSlack) {
      const integration = integrations.find(i => i.id === integrationParam)
      if (integration && !integration.connected) {
        // Automatically start the OAuth flow for this integration
        const returnPath = `/app/integrations?returnTo=slack&flow=slack`
        navigate(`/oauth/integration?id=${integrationParam}&returnTo=${encodeURIComponent(returnPath)}`, { replace: true })
      }
    }
  }, [integrationParam, isFromSlack])

  const handleConnect = (id: string) => {
    const integration = integrations.find(i => i.id === id)
    if (integration?.connected) {
      // Already connected, toggle off
      setIntegrations(prev => prev.map(i => 
        i.id === id ? { ...i, connected: false } : i
      ))
    } else {
      // Navigate to OAuth flow
      const returnPath = isFromSlack 
        ? `/app/integrations?returnTo=slack&flow=slack`
        : `/app/integrations`
      navigate(`/oauth/integration?id=${id}&returnTo=${encodeURIComponent(returnPath)}`)
    }
  }

  const toggleIntegration = (id: string) => {
    handleConnect(id)
  }

  const justConnectedName = justConnected 
    ? integrations.find(i => i.id === justConnected)?.name 
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-cyan-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
      
      <div className="relative">
        <nav className="border-b border-white/5 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to={isFromSlack ? "/slack-sim" : "/auth/add-bot"} 
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-white">Marko AI</span>
              </div>
            </div>
            
            {isFromSlack ? (
              <Button 
                onClick={() => {
                  const connected = integrations.filter(i => i.connected).map(i => i.id).join(",")
                  navigate(`/slack-sim?connected=${connected}`)
                }}
                className="bg-purple-600 hover:bg-purple-500 text-white"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Return to Slack
              </Button>
            ) : (
              <Button 
                onClick={() => navigate("/app/success")}
                disabled={connectedCount === 0}
                className="bg-cyan-500 hover:bg-cyan-400 text-white"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-10">
            {isFromSlack ? (
              <>
                <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  From Slack
                </Badge>
                <h1 className="text-3xl font-bold text-white mb-3">Connect Integration</h1>
                <p className="text-zinc-400 max-w-lg mx-auto">
                  Connect your integration below, then return to Slack to continue chatting with Marko.
                </p>
              </>
            ) : (
              <>
                <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                  Step 3 of 4
                </Badge>
                <h1 className="text-3xl font-bold text-white mb-3">Connect Your Tools</h1>
                <p className="text-zinc-400 max-w-lg mx-auto">
                  Give Marko access to your marketing tools so it can monitor, analyze, and help optimize your campaigns.
                </p>
              </>
            )}
          </div>

          {isFromSlack && justConnectedName && (
            <div className="mb-8 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-green-400 font-medium">{justConnectedName} connected!</p>
                    <p className="text-sm text-green-400/70">Marko will now be able to help you with this integration.</p>
                  </div>
                </div>
                <Button 
                  size="sm"
                  onClick={() => navigate("/slack-sim")}
                  className="bg-purple-600 hover:bg-purple-500 text-white"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Return to Slack
                </Button>
              </div>
            </div>
          )}

          {!isFromSlack && connectedCount > 0 && (
            <div className="mb-8 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">{connectedCount} integration{connectedCount !== 1 ? 's' : ''} connected</span>
              </div>
              <Button 
                size="sm"
                onClick={() => navigate("/app/success")}
                className="bg-green-500 hover:bg-green-400 text-white"
              >
                Continue to Slack
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card 
                key={integration.id} 
                className={`bg-zinc-900/50 border-zinc-800 backdrop-blur transition-all ${
                  integration.connected ? "ring-1 ring-cyan-500/50" : ""
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xl">
                        {integration.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{integration.name}</h3>
                        <p className="text-xs text-zinc-500">{integration.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 text-xs">
                      {integration.category}
                    </Badge>
                  </div>
                  
                  {integration.connected ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleIntegration(integration.id)}
                      className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Connected
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={() => toggleIntegration(integration.id)}
                      className="w-full bg-zinc-800 hover:bg-zinc-700 text-white"
                    >
                      Connect
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/app/success")}
              className="text-zinc-500 hover:text-white"
            >
              Skip for now — I'll add integrations later
            </Button>
          </div>

          <FlowIndicator currentStep={3} />
        </main>
      </div>
    </div>
  )
}

function FlowIndicator({ currentStep }: { currentStep: number }) {
  const steps = ["Sign In", "Add Bot", "Integrations", "Done"]
  
  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            i + 1 === currentStep 
              ? "bg-cyan-500/20 text-cyan-400" 
              : i + 1 < currentStep 
                ? "bg-cyan-500/10 text-cyan-500"
                : "bg-zinc-800/50 text-zinc-500"
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              i + 1 === currentStep 
                ? "bg-cyan-500 text-white" 
                : i + 1 < currentStep
                  ? "bg-cyan-600 text-white"
                  : "bg-zinc-700 text-zinc-400"
            }`}>
              {i + 1 < currentStep ? "✓" : i + 1}
            </span>
            {step}
          </div>
          {i < steps.length - 1 && (
            <div className={`w-4 h-px mx-1 ${i + 1 < currentStep ? "bg-cyan-600" : "bg-zinc-700"}`} />
          )}
        </div>
      ))}
    </div>
  )
}

