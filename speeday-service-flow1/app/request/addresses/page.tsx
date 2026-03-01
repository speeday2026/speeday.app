"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Truck } from "lucide-react"
import Link from "next/link"

export default function AddressesPage() {
  const router = useRouter()
  const [pickupAddress, setPickupAddress] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [error, setError] = useState("")

  const handleContinue = () => {
    if (!pickupAddress.trim() || !deliveryAddress.trim()) {
      setError("Por favor, preencha ambas as moradas")
      return
    }

    // Save addresses to localStorage
    const requestData = {
      pickupAddress: pickupAddress.trim(),
      deliveryAddress: deliveryAddress.trim(),
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem("speeday_request", JSON.stringify(requestData))
    
    // Navigate to vehicle selection
    router.push("/request/vehicle")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Truck className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Speeday</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary">Passo 1 de 4</span>
              <span className="text-sm text-gray-600">Moradas</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-primary rounded-full" style={{ width: "25%" }}></div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Moradas de Recolha e Entrega</CardTitle>
              <CardDescription>
                Informe onde devemos recolher e onde entregar o seu item volumoso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pickup Address */}
              <div className="space-y-2">
                <Label htmlFor="pickup" className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Morada de Recolha
                </Label>
                <Input
                  id="pickup"
                  placeholder="Ex: Rua das Flores, 123, Lisboa"
                  value={pickupAddress}
                  onChange={(e) => {
                    setPickupAddress(e.target.value)
                    setError("")
                  }}
                  className="text-base"
                />
                <p className="text-sm text-gray-600">
                  Endereço da loja ou centro de distribuição
                </p>
              </div>

              {/* Delivery Address */}
              <div className="space-y-2">
                <Label htmlFor="delivery" className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  Morada de Entrega
                </Label>
                <Input
                  id="delivery"
                  placeholder="Ex: Avenida da Liberdade, 456, Porto"
                  value={deliveryAddress}
                  onChange={(e) => {
                    setDeliveryAddress(e.target.value)
                    setError("")
                  }}
                  className="text-base"
                />
                <p className="text-sm text-gray-600">
                  Seu endereço de entrega
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> O preço será calculado automaticamente com base na distância entre as moradas.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Voltar
                  </Button>
                </Link>
                <Button onClick={handleContinue} className="flex-1">
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
