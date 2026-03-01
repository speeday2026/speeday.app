"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Truck, Clock, CheckCircle2, MapPin, Package } from "lucide-react"
import Link from "next/link"

export default function OrderStatusPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    const orderId = params.id
    const orders = JSON.parse(localStorage.getItem("speeday_orders") || "[]")
    const foundOrder = orders.find((o: any) => o.id === orderId)

    if (!foundOrder) {
      router.push("/")
      return
    }

    setOrder(foundOrder)
  }, [params.id, router])

  if (!order) {
    return null
  }

  const statusConfig = {
    PAYMENT_SUBMITTED: {
      label: "Pagamento em Validação",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock,
      description: "Estamos a validar o seu pagamento. Receberá confirmação em breve."
    },
    PAYMENT_CONFIRMED: {
      label: "Pagamento Confirmado",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle2,
      description: "Pagamento confirmado! Estamos a procurar um motorista próximo."
    },
    DRIVER_ASSIGNED: {
      label: "Motorista Atribuído",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Truck,
      description: "Um motorista foi atribuído ao seu pedido."
    },
    IN_TRANSIT: {
      label: "Em Trânsito",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Truck,
      description: "O motorista está a caminho com o seu item."
    },
    DELIVERED: {
      label: "Entregue",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle2,
      description: "Item entregue com sucesso!"
    }
  }

  const currentStatus = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PAYMENT_SUBMITTED
  const StatusIcon = currentStatus.icon

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Truck className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Speeday</span>
          </Link>
          <Link href="/">
            <Button variant="outline">Voltar ao Início</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <div className={`h-20 w-20 rounded-full ${currentStatus.color.split(' ')[0]}/20 flex items-center justify-center`}>
                  <StatusIcon className="h-10 w-10 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl mb-2">
                {currentStatus.label}
              </CardTitle>
              <CardDescription className="text-base">
                {currentStatus.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Número do Pedido:</span>
                  <span className="font-semibold font-mono">{order.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Data:</span>
                  <span className="font-semibold">
                    {new Date(order.submittedAt).toLocaleDateString("pt-PT", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge className={currentStatus.color}>
                    {currentStatus.label}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Acompanhamento do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 w-0.5 bg-gray-300 mt-2 min-h-[40px]"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <h4 className="font-semibold">Pedido Recebido</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(order.submittedAt).toLocaleString("pt-PT")}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      order.status !== "PAYMENT_SUBMITTED" 
                        ? "bg-green-100 border-2 border-green-500" 
                        : "bg-yellow-100 border-2 border-yellow-500"
                    }`}>
                      {order.status !== "PAYMENT_SUBMITTED" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1 w-0.5 bg-gray-300 mt-2 min-h-[40px]"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <h4 className="font-semibold">Validação de Pagamento</h4>
                    <p className="text-sm text-gray-600">
                      {order.status === "PAYMENT_SUBMITTED" 
                        ? "Em análise..." 
                        : "Confirmado"}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      ["DRIVER_ASSIGNED", "IN_TRANSIT", "DELIVERED"].includes(order.status)
                        ? "bg-green-100 border-2 border-green-500"
                        : "bg-gray-100 border-2 border-gray-300"
                    }`}>
                      <Truck className={`h-5 w-5 ${
                        ["DRIVER_ASSIGNED", "IN_TRANSIT", "DELIVERED"].includes(order.status)
                          ? "text-green-600"
                          : "text-gray-400"
                      }`} />
                    </div>
                    <div className="flex-1 w-0.5 bg-gray-300 mt-2 min-h-[40px]"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <h4 className="font-semibold">Motorista Atribuído</h4>
                    <p className="text-sm text-gray-600">
                      {["DRIVER_ASSIGNED", "IN_TRANSIT", "DELIVERED"].includes(order.status)
                        ? "Motorista a caminho"
                        : "Aguardando..."}
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 border-2 border-green-500"
                        : "bg-gray-100 border-2 border-gray-300"
                    }`}>
                      <Package className={`h-5 w-5 ${
                        order.status === "DELIVERED" ? "text-green-600" : "text-gray-400"
                      }`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Entregue</h4>
                    <p className="text-sm text-gray-600">
                      {order.status === "DELIVERED" ? "Concluído" : "Aguardando..."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Recolha</p>
                    <p className="font-medium">{order.pickupAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Entrega</p>
                    <p className="font-medium">{order.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Veículo:</span>
                  <span className="font-medium">{order.vehicle?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Distância:</span>
                  <span className="font-medium">{order.distance} km</span>
                </div>
                {order.extras?.loadAssist > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ajuda na carga:</span>
                    <span className="font-medium">€{order.extras.loadAssist.toFixed(2)}</span>
                  </div>
                )}
                {order.extras?.oldItemRemoval > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recolha de item usado:</span>
                    <span className="font-medium">€{order.extras.oldItemRemoval.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Pago:</span>
                <span className="text-primary">€{order.totalPrice?.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  Precisa de ajuda com o seu pedido?
                </p>
                <Button variant="outline" className="w-full sm:w-auto">
                  Contactar Suporte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
