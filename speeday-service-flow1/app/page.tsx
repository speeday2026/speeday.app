"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Truck, Package, Clock, Shield, MapPin } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [pickupAddress, setPickupAddress] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")

  const handleContinue = () => {
    if (!pickupAddress.trim() || !deliveryAddress.trim()) {
      alert("Por favor, preencha ambas as moradas")
      return
    }

    const requestData = {
      pickupAddress: pickupAddress.trim(),
      deliveryAddress: deliveryAddress.trim(),
      createdAt: new Date().toISOString()
    }
    
    localStorage.setItem("speeday_request", JSON.stringify(requestData))
    router.push("/request/vehicle")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-14 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Truck className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-primary">Speeday</span>
          </div>
          <Link href="/login">
            <Button variant="outline" size="sm" className="h-9">Entrar</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-balance leading-tight">
              Recolha e Entrega no mesmo dia para itens volumosos
            </h1>
            <p className="text-base md:text-xl opacity-95 text-pretty">
              Solicite a recolha hoje mesmo e receba em casa com conforto e rapidez
            </p>
          </div>
        </div>
      </section>

      {/* Address Input Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="p-6 md:p-8 shadow-lg border-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Solicitar Serviço</h2>
              <p className="text-sm text-muted-foreground">Informe as moradas de recolha e entrega</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pickup" className="text-base font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Morada de Recolha
                </Label>
                <Input
                  id="pickup"
                  type="text"
                  placeholder="Ex: Rua da Liberdade, 123, Lisboa"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery" className="text-base font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  Morada de Entrega
                </Label>
                <Input
                  id="delivery"
                  type="text"
                  placeholder="Ex: Avenida da República, 456, Porto"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              <Button 
                onClick={handleContinue} 
                size="lg" 
                className="w-full h-12 text-base font-semibold mt-4"
              >
                Continuar
              </Button>
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 max-w-5xl mx-auto">
          <Card className="p-4 text-center border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="font-semibold text-base mb-1">Entrega no Mesmo Dia</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Recolha e entrega rápida para suas compras volumosas
            </p>
          </Card>

          <Card className="p-4 text-center border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="font-semibold text-base mb-1">Veículos Adequados</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Carrinhas XL e XXL para diferentes necessidades
            </p>
          </Card>

          <Card className="p-4 text-center border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="font-semibold text-base mb-1">Ajuda com Carga</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Serviço opcional de carga e descarga disponível
            </p>
          </Card>

          <Card className="p-4 text-center border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="font-semibold text-base mb-1">Preço Transparente</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sem surpresas, calcule o valor antes de confirmar
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            Como Funciona
          </h2>
          <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-3">
                1
              </div>
              <h3 className="font-semibold text-base mb-2">Informe os Endereços</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Digite as moradas de recolha e entrega
              </p>
            </div>
            <div className="text-center">
              <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-3">
                2
              </div>
              <h3 className="font-semibold text-base mb-2">Escolha o Veículo</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Selecione entre XL ou XXL e adicione extras
              </p>
            </div>
            <div className="text-center">
              <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-3">
                3
              </div>
              <h3 className="font-semibold text-base mb-2">Confirme e Pague</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Revise o pedido e efetue o pagamento
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Motoristas Independentes Prontos para Ajudar
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Nossa rede de motoristas independentes com veículos comerciais está próxima das lojas e centros de distribuição, trazendo mais agilidade e conveniência para você.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">&copy; 2024 Speeday. Infraestrutura de velocidade e conveniência logística.</p>
        </div>
      </footer>
    </div>
  )
}
