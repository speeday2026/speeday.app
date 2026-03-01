"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  
  // Register state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if request data exists
    const requestData = localStorage.getItem("speeday_request")
    if (!requestData) {
      router.push("/request/addresses")
    }

    // Check if user is already logged in
    const user = localStorage.getItem("speeday_user")
    if (user) {
      router.push("/checkout")
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!loginEmail || !loginPassword) {
      setError("Por favor, preencha todos os campos")
      return
    }

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem("speeday_users") || "[]")
    const user = users.find((u: any) => u.email === loginEmail && u.password === loginPassword)

    if (!user) {
      setError("Email ou senha incorretos")
      return
    }

    // Save current user
    localStorage.setItem("speeday_user", JSON.stringify(user))
    router.push("/checkout")
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !phone || !password) {
      setError("Por favor, preencha todos os campos")
      return
    }

    // Simple email validation
    if (!email.includes("@")) {
      setError("Email inválido")
      return
    }

    // Phone validation (simple)
    if (phone.length < 9) {
      setError("Telefone inválido")
      return
    }

    // Password validation
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("speeday_users") || "[]")
    const existingUser = users.find((u: any) => u.email === email)

    if (existingUser) {
      setError("Este email já está registrado")
      return
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      password,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    localStorage.setItem("speeday_users", JSON.stringify(users))
    localStorage.setItem("speeday_user", JSON.stringify(newUser))

    router.push("/checkout")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 h-14 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Truck className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-primary">Speeday</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="h-9">
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="max-w-md mx-auto">
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-primary">Passo 4 de 5</span>
              <span className="text-xs text-muted-foreground">Autenticação</span>
            </div>
            <div className="h-2 bg-muted rounded-full">
              <div className="h-2 bg-primary rounded-full transition-all" style={{ width: "80%" }}></div>
            </div>
          </div>

          <Card className="shadow-lg border-2">
            <CardHeader>
              <CardTitle className="text-xl">Acesse sua Conta</CardTitle>
              <CardDescription className="text-sm">
                Faça login ou crie uma conta para finalizar seu pedido
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={isLogin ? "login" : "register"} onValueChange={(v) => {
                setIsLogin(v === "login")
                setError("")
              }}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="register">Criar Conta</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-sm font-medium">Senha</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                        {error}
                      </div>
                    )}

                    <Button type="submit" className="w-full h-11 text-sm font-semibold mt-6">
                      Entrar
                    </Button>
                  </form>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Nome Completo</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="João Silva"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Telefone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+351 912 345 678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                        {error}
                      </div>
                    )}

                    <Button type="submit" className="w-full h-11 text-sm font-semibold mt-6">
                      Criar Conta e Continuar
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  Ao continuar, você concorda com os nossos Termos de Serviço e Política de Privacidade
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
