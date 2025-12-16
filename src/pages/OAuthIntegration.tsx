import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Check, Shield } from "lucide-react"

const INTEGRATIONS = {
  meta: {
    name: "Meta Business Suite",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/512px-Meta_Platforms_Inc._logo.svg.png",
    color: "#0668E1",
    bgColor: "#f0f2f5",
    permissions: [
      { title: "View ad accounts", desc: "Access your ad account information" },
      { title: "Manage ads", desc: "Create, edit, and view ad campaigns" },
      { title: "View insights", desc: "Access performance metrics and analytics" },
      { title: "Read audience data", desc: "View custom audiences and targeting" },
    ]
  },
  hubspot: {
    name: "HubSpot",
    logo: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
    color: "#FF7A59",
    bgColor: "#fff5f2",
    permissions: [
      { title: "Read contacts", desc: "Access contact information and properties" },
      { title: "Read deals", desc: "View deal pipeline and values" },
      { title: "Read marketing emails", desc: "Access email campaigns and metrics" },
      { title: "Read analytics", desc: "View traffic and conversion data" },
    ]
  },
  customerio: {
    name: "Customer.io",
    logo: "https://customer.io/wp-content/uploads/2019/01/customer-io-logo.png",
    color: "#FFD100",
    bgColor: "#fffbeb",
    permissions: [
      { title: "Read campaigns", desc: "Access email and push campaigns" },
      { title: "Read segments", desc: "View customer segments" },
      { title: "Read metrics", desc: "Access delivery and engagement data" },
      { title: "Read people", desc: "View customer profiles" },
    ]
  },
  google: {
    name: "Google Ads",
    logo: "https://www.gstatic.com/images/branding/product/2x/ads_48dp.png",
    color: "#4285F4",
    bgColor: "#e8f0fe",
    permissions: [
      { title: "View campaigns", desc: "Access campaign structure and settings" },
      { title: "View performance", desc: "Read metrics and conversions" },
      { title: "View budgets", desc: "Access spend and budget data" },
      { title: "View keywords", desc: "Read keyword performance" },
    ]
  },
  linkedin: {
    name: "LinkedIn Ads",
    logo: "https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg",
    color: "#0A66C2",
    bgColor: "#e8f4fc",
    permissions: [
      { title: "View ad accounts", desc: "Access campaign manager data" },
      { title: "View analytics", desc: "Read campaign performance" },
      { title: "View audiences", desc: "Access matched audiences" },
    ]
  },
  mailchimp: {
    name: "Mailchimp",
    logo: "https://mailchimp.com/release/plums/cxp/images/apple-touch-icon.png",
    color: "#FFE01B",
    bgColor: "#fffde7",
    permissions: [
      { title: "Read campaigns", desc: "Access email campaigns" },
      { title: "Read lists", desc: "View audience lists" },
      { title: "Read reports", desc: "Access campaign analytics" },
    ]
  },
  analytics: {
    name: "Google Analytics",
    logo: "https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg",
    color: "#F9AB00",
    bgColor: "#fef7e0",
    permissions: [
      { title: "Read analytics data", desc: "Access website traffic data" },
      { title: "Read reports", desc: "View pre-built and custom reports" },
      { title: "Read conversions", desc: "Access goal and conversion data" },
    ]
  },
  stripe: {
    name: "Stripe",
    logo: "https://images.stripeassets.com/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg",
    color: "#635BFF",
    bgColor: "#f4f3ff",
    permissions: [
      { title: "Read payments", desc: "Access payment and transaction data" },
      { title: "Read customers", desc: "View customer information" },
      { title: "Read subscriptions", desc: "Access subscription data" },
    ]
  },
}

export function OAuthIntegration() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState<"login" | "permissions" | "authorizing">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const integrationId = searchParams.get("id") || "meta"
  const returnTo = searchParams.get("returnTo") || "/app/integrations"
  const flow = searchParams.get("flow")
  
  const integration = INTEGRATIONS[integrationId as keyof typeof INTEGRATIONS] || INTEGRATIONS.meta

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("permissions")
  }

  const handleAllow = () => {
    setStep("authorizing")
    setTimeout(() => {
      let finalUrl = returnTo
      if (!finalUrl.includes("?")) {
        finalUrl += `?connected=${integrationId}`
      } else {
        finalUrl += `&connected=${integrationId}`
      }
      if (flow) {
        finalUrl += `&flow=${flow}`
      }
      navigate(finalUrl)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: integration.bgColor }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={integration.logo} alt="" className="w-8 h-8 object-contain" />
          <span className="font-semibold text-gray-900">{integration.name}</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          {step === "login" && (
            <div>
              <div className="text-center mb-8">
                <img src={integration.logo} alt="" className="w-16 h-16 mx-auto mb-4 object-contain" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to {integration.name}</h1>
                <p className="text-gray-500 text-sm">to continue to Marko</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="oauth-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    id="oauth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="py-5"
                  />
                </div>
                
                <div>
                  <label htmlFor="oauth-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <Input
                    id="oauth-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="py-5"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-5 text-white"
                  style={{ backgroundColor: integration.color }}
                >
                  Sign In
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button type="button" className="text-sm hover:underline" style={{ color: integration.color }}>
                  Forgot password?
                </button>
              </div>
            </div>
          )}

          {step === "permissions" && (
            <div>
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <img src={integration.logo} alt="" className="w-12 h-12 object-contain" />
                  <div className="text-gray-400 text-xl">→</div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">M</span>
                  </div>
                </div>
                
                <h1 className="text-xl font-bold text-gray-900 mb-1">Authorize Marko</h1>
                <p className="text-gray-500 text-sm">
                  Marko wants to access your {integration.name} account
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 mb-6">
                {integration.permissions.map((perm) => (
                  <div key={perm.title} className="flex items-start gap-3 p-3">
                    <Check className="w-5 h-5 mt-0.5 shrink-0" style={{ color: integration.color }} />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{perm.title}</p>
                      <p className="text-xs text-gray-500">{perm.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg mb-6">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-800">
                  Marko will only have <strong>read-only</strong> access. It cannot make changes to your account.
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 py-5"
                  onClick={() => navigate(returnTo)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 py-5 text-white"
                  style={{ backgroundColor: integration.color }}
                  onClick={handleAllow}
                >
                  Authorize
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                You can revoke access at any time from your {integration.name} settings.
              </p>
            </div>
          )}

          {step === "authorizing" && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: integration.color }} />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Connecting...</h2>
              <p className="text-gray-500">Setting up your {integration.name} integration.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 px-6 py-4 text-center text-sm text-gray-500">
        <span>Secured by {integration.name}</span>
        <span className="mx-2">·</span>
        <button type="button" className="hover:underline">Privacy Policy</button>
      </footer>
    </div>
  )
}

