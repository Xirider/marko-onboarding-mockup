import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Check } from "lucide-react"

function SlackLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 127 127" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M27.2 80c0 7.3-5.9 13.2-13.2 13.2S.8 87.3.8 80s5.9-13.2 13.2-13.2h13.2V80zm6.6 0c0-7.3 5.9-13.2 13.2-13.2s13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2s-13.2-5.9-13.2-13.2V80z" fill="#E01E5A"/>
      <path d="M47 27c-7.3 0-13.2-5.9-13.2-13.2S39.7.6 47 .6s13.2 5.9 13.2 13.2V27H47zm0 6.7c7.3 0 13.2 5.9 13.2 13.2s-5.9 13.2-13.2 13.2H13.9C6.6 60.1.7 54.2.7 46.9s5.9-13.2 13.2-13.2H47z" fill="#36C5F0"/>
      <path d="M99.9 46.9c0-7.3 5.9-13.2 13.2-13.2s13.2 5.9 13.2 13.2-5.9 13.2-13.2 13.2H99.9V46.9zm-6.6 0c0 7.3-5.9 13.2-13.2 13.2s-13.2-5.9-13.2-13.2V13.8C66.9 6.5 72.8.6 80.1.6s13.2 5.9 13.2 13.2v33.1z" fill="#2EB67D"/>
      <path d="M80.1 99.8c7.3 0 13.2 5.9 13.2 13.2s-5.9 13.2-13.2 13.2-13.2-5.9-13.2-13.2V99.8h13.2zm0-6.6c-7.3 0-13.2-5.9-13.2-13.2s5.9-13.2 13.2-13.2h33.1c7.3 0 13.2 5.9 13.2 13.2s-5.9 13.2-13.2 13.2H80.1z" fill="#ECB22E"/>
    </svg>
  )
}

export function OAuthSlack() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const redirectTo = searchParams.get("redirect") || "/auth/add-bot"
  const integration = searchParams.get("integration")
  const flow = searchParams.get("flow")
  const isAddBot = searchParams.get("addBot") === "true"

  // If adding bot (user already signed in), skip to permissions
  const [step, setStep] = useState<"workspace" | "signin" | "permissions" | "authorizing">(
    isAddBot ? "permissions" : "workspace"
  )
  const [workspace, setWorkspace] = useState("acme-corp")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleWorkspaceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("signin")
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("permissions")
  }

  const handleAllow = () => {
    setStep("authorizing")
    setTimeout(() => {
      let finalRedirect = redirectTo
      if (integration) {
        finalRedirect += `?integration=${integration}`
      }
      if (flow) {
        finalRedirect += (finalRedirect.includes("?") ? "&" : "?") + `flow=${flow}`
      }
      navigate(finalRedirect)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Slack Header */}
      <header className="border-b border-gray-200 px-6 py-4">
        <SlackLogo className="w-28 h-8" />
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {step === "workspace" && (
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign in to Slack</h1>
              <p className="text-gray-600 mb-8">Enter your workspace's Slack URL</p>
              
              <form onSubmit={handleWorkspaceSubmit} className="space-y-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                  <Input
                    value={workspace}
                    onChange={(e) => setWorkspace(e.target.value)}
                    className="border-0 focus-visible:ring-0 text-lg"
                    placeholder="your-workspace"
                  />
                  <span className="px-3 text-gray-500 bg-gray-50 border-l border-gray-300 py-2.5">.slack.com</span>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#4A154B] hover:bg-[#611f69] text-white py-6 text-lg"
                >
                  Continue
                </Button>
              </form>

              <p className="text-sm text-gray-500 mt-6">
                Don't know your workspace URL? <a href="#" className="text-blue-600 hover:underline">Find your workspace</a>
              </p>
            </div>
          )}

          {step === "signin" && (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#4A154B] rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">A</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Acme Corp</h1>
              <p className="text-gray-500 text-sm mb-6">{workspace}.slack.com</p>
              
              <form onSubmit={handleSignIn} className="space-y-4 text-left">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@work-email.com"
                    className="py-5"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="py-5"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#4A154B] hover:bg-[#611f69] text-white py-5"
                >
                  Sign In
                </Button>
              </form>

              <div className="mt-6 space-y-3">
                <button className="w-full border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
                  <img src="https://www.google.com/favicon.ico" alt="" className="w-5 h-5" />
                  <span className="text-gray-700">Sign in with Google</span>
                </button>
              </div>
            </div>
          )}

          {step === "permissions" && (
            <div>
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">M</span>
                  </div>
                  <div className="text-gray-400 text-2xl">→</div>
                  <div className="w-16 h-16 bg-[#4A154B] rounded-xl flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">A</span>
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {isAddBot ? "Marko wants to access Acme Corp" : "Sign in to Marko"}
                </h1>
                <p className="text-gray-600">
                  {isAddBot 
                    ? "This will allow Marko to:" 
                    : "Marko is requesting permission to:"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                {isAddBot ? (
                  <>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Send messages as Marko</p>
                        <p className="text-sm text-gray-500">Post messages in channels and DMs</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Read messages in channels</p>
                        <p className="text-sm text-gray-500">Access messages where Marko is mentioned</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Access workspace info</p>
                        <p className="text-sm text-gray-500">View team members and channels</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">View your identity</p>
                        <p className="text-sm text-gray-500">Name, email, and profile picture</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">View your workspace</p>
                        <p className="text-sm text-gray-500">Workspace name and icon</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-start gap-2 mb-6">
                <Checkbox id="remember" defaultChecked />
                <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                  Remember this authorization
                </label>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 py-5"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-[#4A154B] hover:bg-[#611f69] text-white py-5"
                  onClick={handleAllow}
                >
                  Allow
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                By allowing, you agree to Marko's <a href="#" className="text-blue-600">Terms of Service</a> and <a href="#" className="text-blue-600">Privacy Policy</a>
              </p>
            </div>
          )}

          {step === "authorizing" && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-[#4A154B] mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Authorizing...</h2>
              <p className="text-gray-500">You'll be redirected back to Marko shortly.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-200 px-6 py-4 text-center text-sm text-gray-500">
        <a href="#" className="hover:underline">Privacy & Terms</a>
        <span className="mx-2">·</span>
        <a href="#" className="hover:underline">Contact Us</a>
      </footer>
    </div>
  )
}

