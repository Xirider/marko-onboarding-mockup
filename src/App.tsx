import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LandingPage } from "@/pages/LandingPage"
import { SignInWithSlack } from "@/pages/SignInWithSlack"
import { AddBotToSlack } from "@/pages/AddBotToSlack"
import { Integrations } from "@/pages/Integrations"
import { Success } from "@/pages/Success"
import { SlackSimulator } from "@/pages/SlackSimulator"
import { Billing } from "@/pages/Billing"
import { OAuthSlack } from "@/pages/OAuthSlack"
import { OAuthIntegration } from "@/pages/OAuthIntegration"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/signin" element={<SignInWithSlack />} />
        <Route path="/auth/add-bot" element={<AddBotToSlack />} />
        <Route path="/oauth/slack" element={<OAuthSlack />} />
        <Route path="/oauth/integration" element={<OAuthIntegration />} />
        <Route path="/app/integrations" element={<Integrations />} />
        <Route path="/app/success" element={<Success />} />
        <Route path="/app/billing" element={<Billing />} />
        <Route path="/slack-sim" element={<SlackSimulator />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
