"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MapPin, Truck, Package, Calendar } from "lucide-react"
import Link from "next/link"

interface RequestData {
  pickupAddress: string
  deliveryAddress: string
  vehicle: {
    type: string
    name: string
    basePrice: number
    baseKm: number
    additionalKmPrice: number
  }
  extras: {
    loadAssist: number
    oldItemRemoval: number
  }
  document: string | null
  timestamp: string
}

export default function SummaryPage() {
  const router = useRouter()
  const [requestData, setRequestData] = useState<RequestData | null>(null)
  const [distance, setDistance] = useState(25) // Mock distance in km
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    // Load request data
    const data = localStorage.getItem("speeday_request")
    if (!data) {
      router.push("/request/addresses")
      return
    }

    const parsed: RequestData = JSON.parse(data)
    setRequestData(parsed)

    // Calculate total price
    // Mock distance calculation - in production, use geocoding API
    const mockDistance = 25 // km
    setDistance(mockDistance)

    let total = parsed.vehicle.basePrice

    // Add distance charge if over base km
    if (mockDistance > parsed.vehicle.baseKm) {
      const extraKm = mockDistance - parsed.vehicle.baseKm
      total += extraKm * parsed.vehicle.additionalKmPrice
    }

    // Add extras
    total += parsed.extras.loadAssist
    total += parsed.extras.oldItemRemoval

    setTotalPrice(total)
  }, [router])

  const handleConfirm = () => {
    if (!requestData) return

    // Save final price to request data
    const updatedData = {
      ...requestData,
      distance,
      totalPrice,
      calculatedAt: new Date().toISOString()
    }
    localStorage.setItem("speeday_request", JSON.stringify(updatedData))

    // Redirect to login/register
    router.push("/auth")
  }

  if (!requestData) {
    return null
  }

  const extraKm = Math.max(0, distance - requestData.vehicle.baseKm)
  const distanceCharge = extraKm * requestData.vehicle.additionalKmPrice

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
        <div className="max-w-3xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary">Passo 3 de 4</span>
              <span className="text-sm text-gray-600">Resumo do Serviço</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-primary rounded-full" style={{ width: "75%" }}></div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Resumo do Pedido</CardTitle>
              <CardDescription>
                Revise todos os detalhes antes de confirmar o serviço
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Route Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Percurso
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="h-3 w-3 rounded-full bg-primary mt-1 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Recolha</p>
                      <p className="font-medium">{requestData.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-600 mt-1 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Entrega</p>
                      <p className="font-medium">{requestData.deliveryAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <span className="text-sm text-gray-600">Distância estimada:</span>
                    <span className="font-semibold">{distance} km</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Vehicle Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Veículo Selecionado
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-lg">{requestData.vehicle.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Solução ideal para {requestData.vehicle.type === "xl" ? "1 item" : "itens maiores"}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Extras */}
              {(requestData.extras.loadAssist > 0 || requestData.extras.oldItemRemoval > 0) && (
                <>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      Serviços Adicionais
                    </h3>
                    <div className="space-y-2">
                      {requestData.extras.loadAssist > 0 && (
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span>Ajuda na carga e descarga</span>
                          <span className="font-semibold">€{requestData.extras.loadAssist.toFixed(2)}</span>
                        </div>
                      )}
                      {requestData.extras.oldItemRemoval > 0 && (
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span>Recolha de item usado</span>
                          <span className="font-semibold">€{requestData.extras.oldItemRemoval.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Date */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Data do Serviço
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold">Hoje - {new Date().toLocaleDateString("pt-PT", { 
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Recolha e entrega no mesmo dia
                  </p>
                </div>
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Detalhes do Preço</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Preço base ({requestData.vehicle.baseKm}km incluídos)</span>
                    <span className="font-medium">€{requestData.vehicle.basePrice.toFixed(2)}</span>
                  </div>
                  {extraKm > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Distância adicional ({extraKm.toFixed(1)}km × €{requestData.vehicle.additionalKmPrice})
                      </span>
                      <span className="font-medium">€{distanceCharge.toFixed(2)}</span>
                    </div>
                  )}
                  {requestData.extras.loadAssist > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ajuda na carga/descarga</span>
                      <span className="font-medium">€{requestData.extras.loadAssist.toFixed(2)}</span>
                    </div>
                  )}
                  {requestData.extras.oldItemRemoval > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Recolha de item usado</span>
                      <span className="font-medium">€{requestData.extras.oldItemRemoval.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center text-xl font-bold bg-primary/10 p-4 rounded-lg">
                  <span>Total</span>
                  <span className="text-primary">€{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Próximo passo:</strong> Após confirmar, você será direcionado para fazer login ou criar uma conta para finalizar o pedido.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Link href="/request/vehicle" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Voltar
                  </Button>
                </Link>
                <Button onClick={handleConfirm} className="flex-1" size="lg">
                  Confirmar Serviço
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
