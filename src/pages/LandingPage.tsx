import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, MessageSquare, BarChart3, Mail, Bot, ArrowRight, Sparkles } from "lucide-react"

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-cyan-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
      
      <div className="relative">
        <nav className="border-b border-white/5 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Marko AI</span>
            </div>
            <Link to="/slack-sim" className="text-zinc-400 hover:text-white text-sm transition-colors">
              View Slack Demo →
            </Link>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-6 pt-24 pb-32">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Your AI Marketing Coworker
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
              Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">Marko</span>,<br />
              your autonomous<br />marketing teammate
            </h1>
            
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Marko lives in Slack, monitors your campaigns, suggests optimizations,
              and handles routine marketing tasks—so you can focus on strategy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth/signin")}
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white shadow-lg shadow-cyan-500/25 px-8 py-6 text-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <p className="text-sm text-zinc-500">Free for teams up to 5 • No credit card required</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-24">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-cyan-500/10 text-cyan-400 border-0">Recommended</Badge>
                </div>
                <CardTitle className="text-white text-2xl">Flow A: App-First Setup</CardTitle>
                <CardDescription className="text-zinc-400">
                  Sign up in app, add bot, connect integrations—then go to Slack
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <FlowStep number={1} text="Sign up with Slack (creates your account)" />
                  <FlowStep number={2} text="Add Marko bot to your workspace" />
                  <FlowStep number={3} text="Connect your marketing integrations" />
                  <FlowStep number={4} text="Go to Slack and start collaborating" />
                </div>
                <Button 
                  className="w-full mt-4 bg-white text-zinc-900 hover:bg-zinc-100"
                  onClick={() => navigate("/auth/signin")}
                >
                  Start with App Flow
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Flow B: Slack-First Setup</CardTitle>
                <CardDescription className="text-zinc-400">
                  Add to Slack first, then onboard through chat messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <FlowStep number={1} text="Click 'Add to Slack' button" />
                  <FlowStep number={2} text="Webhook creates account from Slack data" />
                  <FlowStep number={3} text="Marko DMs you with onboarding steps" />
                  <FlowStep number={4} text="Add integrations via buttons in Slack" />
                </div>
                <Button 
                  variant="outline"
                  className="w-full mt-4 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  onClick={() => navigate("/oauth/slack?redirect=/slack-sim&addBot=true")}
                >
                  View Slack-Based Flow Demo
                  <MessageSquare className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What Marko Handles</h2>
            <p className="text-zinc-400">Connect your tools and let Marko take care of the rest</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6" />}
              title="Meta Ads"
              description="Campaign monitoring, optimization suggestions, performance reports"
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6" />}
              title="SEO"
              description="Keyword tracking, technical audits, content opportunities"
            />
            <FeatureCard 
              icon={<MessageSquare className="w-6 h-6" />}
              title="Content"
              description="Ideation, creation pipeline, scheduling & publishing"
            />
            <FeatureCard 
              icon={<Mail className="w-6 h-6" />}
              title="Email"
              description="Campaign creation, automation, analytics & list management"
            />
          </div>
        </main>
      </div>
    </div>
  )
}

function FlowStep({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-medium shrink-0">
        {number}
      </div>
      <span className="text-zinc-300 text-sm">{text}</span>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
      <CardContent className="p-5">
        <div className="w-12 h-12 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-zinc-500">{description}</p>
      </CardContent>
    </Card>
  )
}

