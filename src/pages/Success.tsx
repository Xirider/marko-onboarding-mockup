import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, CheckCircle2, Sparkles, MessageSquare, Settings } from "lucide-react"

export function Success() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-cyan-950 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
      
      <div className="relative w-full max-w-lg text-center">
        <div className="mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20 animate-pulse">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          
          <Badge className="mb-4 bg-green-500/10 text-green-400 border-green-500/20">
            Setup Complete
          </Badge>
          
          <h1 className="text-4xl font-bold text-white mb-4">You're all set! 🎉</h1>
          <p className="text-xl text-zinc-400 mb-2">
            Marko is now part of your team
          </p>
          <p className="text-zinc-500">
            Head to Slack to start collaborating with your AI coworker
          </p>
        </div>

        <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">Marko is ready to help</h3>
                <p className="text-sm text-zinc-400">Find me in Slack @marko</p>
              </div>
            </div>

            <div className="space-y-3 text-left mb-6">
              <TipItem 
                icon={<MessageSquare className="w-4 h-4" />}
                title="DM or mention me"
                description="I'll respond in any channel I'm invited to"
              />
              <TipItem 
                icon={<Sparkles className="w-4 h-4" />}
                title="Ask me anything"
                description="Campaign stats, optimization ideas, content suggestions"
              />
              <TipItem 
                icon={<Settings className="w-4 h-4" />}
                title="I'll ask before acting"
                description="All changes require your approval first"
              />
            </div>

            <Button 
              size="lg"
              className="w-full bg-[#4A154B] hover:bg-[#611f69] text-white py-6 text-base font-medium"
              onClick={() => window.location.href = "/slack-sim?flow=onboarding"}
            >
              <SlackLogo className="w-5 h-5 mr-3" />
              Open Slack
            </Button>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-4 text-sm">
          <Link to="/app/integrations" className="text-zinc-500 hover:text-white transition-colors">
            Manage Integrations
          </Link>
          <span className="text-zinc-700">•</span>
          <Link to="/app/billing" className="text-zinc-500 hover:text-white transition-colors">
            Billing Settings
          </Link>
          <span className="text-zinc-700">•</span>
          <Link to="/slack-sim" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            View Slack Demo
          </Link>
        </div>

        <FlowIndicator currentStep={4} />
      </div>
    </div>
  )
}

function TipItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-medium text-white text-sm">{title}</p>
        <p className="text-xs text-zinc-500">{description}</p>
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
              ✓
            </span>
            {step}
          </div>
          {i < steps.length - 1 && (
            <div className="w-4 h-px mx-1 bg-cyan-600" />
          )}
        </div>
      ))}
    </div>
  )
}

function SlackLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.124 2.521a2.528 2.528 0 0 1 2.52-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.52V8.834zm-1.271 0a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.165 0a2.528 2.528 0 0 1 2.522 2.522v6.312zm-2.522 10.124a2.528 2.528 0 0 1 2.522 2.52A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.521-2.522v-2.52h2.521zm0-1.271a2.527 2.527 0 0 1-2.521-2.521 2.526 2.526 0 0 1 2.521-2.521h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.521h-6.313z"/>
    </svg>
  )
}

