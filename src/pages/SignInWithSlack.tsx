import { useNavigate, Link, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, ArrowLeft, CheckCircle2, MessageSquare } from "lucide-react"

export function SignInWithSlack() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const flow = searchParams.get("flow")
  const isFromSlack = flow === "slack"

  const handleSignIn = () => {
    if (isFromSlack) {
      navigate(`/oauth/slack?redirect=/app/integrations&flow=slack`)
    } else {
      navigate("/oauth/slack?redirect=/auth/add-bot")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-cyan-950 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
      
      <div className="relative w-full max-w-md">
        <Link 
          to={isFromSlack ? "/slack-sim" : "/"} 
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {isFromSlack ? "Back to Slack" : "Back to home"}
        </Link>

        {isFromSlack && (
          <div className="mb-6 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm font-medium text-purple-300">Coming from Slack</p>
                <p className="text-xs text-purple-400/70">Sign in to connect your integrations</p>
              </div>
            </div>
          </div>
        )}

        <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Sign in with Slack</CardTitle>
            <CardDescription className="text-zinc-400">
              {isFromSlack 
                ? "Verify your identity to connect your marketing tools"
                : "Connect your Slack account to get started with Marko"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <BenefitItem text="Securely links your Slack identity" />
              <BenefitItem text="Creates your Marko account automatically" />
              <BenefitItem text="No separate password to remember" />
            </div>

            <Button 
              size="lg"
              onClick={handleSignIn}
              className="w-full bg-[#4A154B] hover:bg-[#611f69] text-white py-6 text-base font-medium"
            >
              <SlackLogo className="w-5 h-5 mr-3" />
              Sign in with Slack
            </Button>

            <p className="text-xs text-zinc-500 text-center">
              We'll request permission to access your basic profile info and email.
              We never post without your permission.
            </p>
          </CardContent>
        </Card>

        {!isFromSlack && <FlowIndicator currentStep={1} />}
      </div>
    </div>
  )
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
      <span className="text-zinc-300 text-sm">{text}</span>
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
              {i + 1}
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

