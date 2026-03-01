"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Upload, Truck, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const router = useRouter()
  const [requestData, setRequestData] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("speeday_user")
    if (!user) {
      router.push("/auth")
      return
    }
    setUserData(JSON.parse(user))

    // Load request data
    const request = localStorage.getItem("speeday_request")
    if (!request) {
      router.push("/request/addresses")
      return
    }
    setRequestData(JSON.parse(request))
  }, [router])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("O arquivo deve ter no máximo 5MB")
        return
      }
      setProofFile(file)
      setError("")
    }
  }

  const handleSubmit = () => {
    if (!paymentConfirmed) {
      setError("Por favor, confirme que realizou o pagamento")
      return
    }

    if (!proofFile) {
      setError("Por favor, faça upload do comprovativo de pagamento")
      return
    }

    // Create order
    const order = {
      id: `SPD-${Date.now()}`,
      userId: userData.id,
      userName: userData.name,
      userEmail: userData.email,
      userPhone: userData.phone,
      ...requestData,
      paymentProof: proofFile.name,
      status: "PAYMENT_SUBMITTED",
      submittedAt: new Date().toISOString()
    }

    // Save order
    const orders = JSON.parse(localStorage.getItem("speeday_orders") || "[]")
    orders.push(order)
    localStorage.setItem("speeday_orders", JSON.stringify(orders))

    // Clear request data
    localStorage.removeItem("speeday_request")

    // Redirect to order status
    router.push(`/order/${order.id}`)
  }

  if (!requestData || !userData) {
    return null
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
          <div className="text-sm">
            <span className="text-gray-600">Olá, </span>
            <span className="font-semibold">{userData.name}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary">Passo 5 de 5</span>
              <span className="text-sm text-gray-600">Pagamento</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-primary rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Pagamento por MBWay</CardTitle>
                  <CardDescription>
                    Efetue o pagamento para confirmar seu pedido
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Payment Instructions */}
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-lg">Instruções de Pagamento</h3>
                    <div className="space-y-3">
                      <p className="text-sm">
                        1. Abra a aplicação MBWay no seu telemóvel
                      </p>
                      <p className="text-sm">
                        2. Selecione a opção <strong>"Transferir"</strong>
                      </p>
                      <p className="text-sm">
                        3. Insira o número: <strong className="text-lg">912 345 678</strong>
                      </p>
                      <p className="text-sm">
                        4. Valor: <strong className="text-lg text-primary">€{requestData.totalPrice?.toFixed(2)}</strong>
                      </p>
                      <p className="text-sm">
                        5. Confirme a transferência
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Upload Proof */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Comprovativo de Pagamento</h3>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                      <input
                        type="file"
                        id="proof"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Label htmlFor="proof" className="cursor-pointer">
                        {proofFile ? (
                          <div className="flex items-center justify-center gap-2 text-green-600">
                            <CheckCircle2 className="h-6 w-6" />
                            <span className="font-medium">{proofFile.name}</span>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Upload className="h-10 w-10 mx-auto text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Clique para fazer upload do comprovativo
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Imagem ou PDF (máx. 5MB)
                              </p>
                            </div>
                          </div>
                        )}
                      </Label>
                    </div>
                  </div>

                  {/* Confirmation Checkbox */}
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Checkbox
                      id="confirm"
                      checked={paymentConfirmed}
                      onCheckedChange={(checked) => {
                        setPaymentConfirmed(checked as boolean)
                        setError("")
                      }}
                    />
                    <Label
                      htmlFor="confirm"
                      className="text-sm font-medium leading-relaxed cursor-pointer"
                    >
                      Confirmo que já realizei o pagamento de €{requestData.totalPrice?.toFixed(2)} via MBWay
                    </Label>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    onClick={handleSubmit}
                    className="w-full"
                    size="lg"
                    disabled={!paymentConfirmed || !proofFile}
                  >
                    Submeter Comprovativo
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Veículo:</span>
                      <span className="font-medium">{requestData.vehicle?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distância:</span>
                      <span className="font-medium">{requestData.distance} km</span>
                    </div>
                    {requestData.extras?.loadAssist > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ajuda carga:</span>
                        <span className="font-medium">€{requestData.extras.loadAssist.toFixed(2)}</span>
                      </div>
                    )}
                    {requestData.extras?.oldItemRemoval > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recolha item:</span>
                        <span className="font-medium">€{requestData.extras.oldItemRemoval.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">€{requestData.totalPrice?.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      <strong>Recolha:</strong>
                    </p>
                    <p className="text-sm">{requestData.pickupAddress}</p>
                    
                    <p className="text-gray-600 pt-2">
                      <strong>Entrega:</strong>
                    </p>
                    <p className="text-sm">{requestData.deliveryAddress}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
