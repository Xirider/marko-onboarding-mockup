import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, ArrowLeft, CheckCircle2, CreditCard, Zap } from "lucide-react"

export function Billing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-cyan-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
      
      <div className="relative">
        <nav className="border-b border-white/5 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
            <Link 
              to="/app/success" 
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
        </nav>

        <main className="max-w-2xl mx-auto px-6 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-3">Billing & Plans</h1>
            <p className="text-zinc-400">
              Manage your subscription and payment methods
            </p>
          </div>

          <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Current Plan</CardTitle>
                  <CardDescription className="text-zinc-400">Free Trial</CardDescription>
                </div>
                <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                  14 days remaining
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-zinc-300">Up to 5 team members</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-zinc-300">3 integrations</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-zinc-300">1,000 AI messages/month</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card className="bg-zinc-900/50 border-zinc-800 hover:border-cyan-500/50 transition-colors cursor-pointer">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Pro Plan</h3>
                    <p className="text-sm text-zinc-400">Unlimited team members & integrations</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">$49<span className="text-sm text-zinc-400">/mo</span></p>
                  <Button size="sm" className="mt-2 bg-cyan-500 hover:bg-cyan-400">
                    Upgrade
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Payment Method</h3>
                    <p className="text-sm text-zinc-400">No payment method on file</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300">
                  Add Card
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}


