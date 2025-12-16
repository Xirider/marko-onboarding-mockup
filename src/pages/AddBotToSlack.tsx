import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, ArrowLeft, CheckCircle2, Shield, MessageSquare, Zap } from "lucide-react"

export function AddBotToSlack() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-cyan-950 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
      
      <div className="relative w-full max-w-md">
        <Link 
          to="/auth/signin" 
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="text-center mb-6">
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Account Created
          </Badge>
        </div>

        <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Add Marko to Slack</CardTitle>
            <CardDescription className="text-zinc-400">
              Install Marko in your workspace to start collaborating
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-4 space-y-3">
              <p className="text-sm font-medium text-zinc-300 mb-3">Marko will be able to:</p>
              <PermissionItem 
                icon={<MessageSquare className="w-4 h-4" />}
                text="Respond when mentioned in channels"
              />
              <PermissionItem 
                icon={<Zap className="w-4 h-4" />}
                text="Send you DMs with updates and suggestions"
              />
              <PermissionItem 
                icon={<Shield className="w-4 h-4" />}
                text="Ask for approval before taking actions"
              />
            </div>

            <Button 
              size="lg"
              onClick={() => navigate("/oauth/slack?redirect=/app/integrations&addBot=true")}
              className="w-full bg-[#4A154B] hover:bg-[#611f69] text-white py-6 text-base font-medium"
            >
              <SlackLogo className="w-5 h-5 mr-3" />
              Add to Slack
            </Button>

            <p className="text-xs text-zinc-500 text-center">
              You can remove Marko from your workspace at any time from Slack settings.
            </p>
          </CardContent>
        </Card>

        <FlowIndicator currentStep={2} />
      </div>
    </div>
  )
}

function PermissionItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-cyan-400">{icon}</div>
      <span className="text-zinc-400 text-sm">{text}</span>
    </div>
  )
}

function FlowIndicator({ currentStep }: { currentStep: number }) {
  const steps = ["Sign In", "Add Bot", "Integrations", "Done"]
  
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
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

function SlackLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.124 2.521a2.528 2.528 0 0 1 2.52-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.52V8.834zm-1.271 0a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.165 0a2.528 2.528 0 0 1 2.522 2.522v6.312zm-2.522 10.124a2.528 2.528 0 0 1 2.522 2.52A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.521-2.522v-2.52h2.521zm0-1.271a2.527 2.527 0 0 1-2.521-2.521 2.526 2.526 0 0 1 2.521-2.521h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.521h-6.313z"/>
    </svg>
  )
}

