"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Truck, Package, Upload } from "lucide-react"
import Link from "next/link"

interface VehicleOption {
  id: string
  name: string
  vehicles: string
  dimensions: {
    length: string
    width: string
    height: string
    capacity: string
  }
  basePrice: number
  baseKm: number
  additionalKmPrice: number
  loadAssistPrice: number
  oldItemRemovalPrice: number
}

const VEHICLES: VehicleOption[] = [
  {
    id: "xl",
    name: "Carrinha XL",
    vehicles: "Kangoo, Partner, Berlingo ou similar",
    dimensions: {
      length: "1,5m",
      width: "1,10m",
      height: "1,10m",
      capacity: "200kg"
    },
    basePrice: 55,
    baseKm: 20,
    additionalKmPrice: 0.70,
    loadAssistPrice: 19.90,
    oldItemRemovalPrice: 13.50
  },
  {
    id: "xxl",
    name: "Carrinha XXL",
    vehicles: "Ducato, Sprinter, Transit ou similar",
    dimensions: {
      length: "1,85m",
      width: "1,30m",
      height: "1,30m",
      capacity: "400kg"
    },
    basePrice: 75,
    baseKm: 20,
    additionalKmPrice: 0.90,
    loadAssistPrice: 29.90,
    oldItemRemovalPrice: 15.50
  }
]

export default function VehiclePage() {
  const router = useRouter()
  const [selectedVehicle, setSelectedVehicle] = useState<string>("")
  const [needLoadAssist, setNeedLoadAssist] = useState<boolean>(false)
  const [needOldItemRemoval, setNeedOldItemRemoval] = useState<boolean>(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if addresses are set
    const requestData = localStorage.getItem("speeday_request")
    if (!requestData) {
      router.push("/request/addresses")
    }
  }, [router])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("O arquivo deve ter no máximo 5MB")
        return
      }
      setUploadedFile(file)
      setError("")
    }
  }

  const handleContinue = () => {
    if (!selectedVehicle) {
      setError("Por favor, selecione um tipo de veículo")
      return
    }

    // Get existing request data
    const requestData = JSON.parse(localStorage.getItem("speeday_request") || "{}")
    
    // Add vehicle selection
    const vehicle = VEHICLES.find(v => v.id === selectedVehicle)
    const updatedData = {
      ...requestData,
      vehicle: {
        type: selectedVehicle,
        name: vehicle?.name,
        basePrice: vehicle?.basePrice,
        baseKm: vehicle?.baseKm,
        additionalKmPrice: vehicle?.additionalKmPrice
      },
      extras: {
        loadAssist: needLoadAssist ? vehicle?.loadAssistPrice : 0,
        oldItemRemoval: needOldItemRemoval ? vehicle?.oldItemRemovalPrice : 0
      },
      document: uploadedFile ? uploadedFile.name : null
    }
    
    localStorage.setItem("speeday_request", JSON.stringify(updatedData))
    
    // If file was uploaded, save it separately (in real app would upload to server)
    if (uploadedFile) {
      // For demo purposes, we'll just save the file name
      localStorage.setItem("speeday_uploaded_file", uploadedFile.name)
    }
    
    router.push("/request/summary")
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
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary">Passo 2 de 4</span>
              <span className="text-sm text-gray-600">Detalhes do Transporte</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-primary rounded-full" style={{ width: "50%" }}></div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Escolha o Tipo de Veículo</CardTitle>
              <CardDescription>
                Selecione o veículo adequado para o seu item volumoso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={selectedVehicle} onValueChange={(value) => {
                setSelectedVehicle(value)
                setError("")
              }}>
                {VEHICLES.map((vehicle) => (
                  <div key={vehicle.id} className="relative">
                    <RadioGroupItem
                      value={vehicle.id}
                      id={vehicle.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={vehicle.id}
                      className="flex flex-col p-6 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-gray-50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Truck className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{vehicle.name}</h3>
                            <p className="text-sm text-gray-600">{vehicle.vehicles}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">€{vehicle.basePrice}</p>
                          <p className="text-xs text-gray-600">{vehicle.baseKm}km incluídos</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Comprimento</p>
                          <p className="font-semibold">{vehicle.dimensions.length}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Largura</p>
                          <p className="font-semibold">{vehicle.dimensions.width}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Altura</p>
                          <p className="font-semibold">{vehicle.dimensions.height}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Carga Útil</p>
                          <p className="font-semibold">{vehicle.dimensions.capacity}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t text-xs text-gray-600">
                        +€{vehicle.additionalKmPrice}/km adicional
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Extras Section */}
              {selectedVehicle && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold text-lg">Serviços Adicionais</h3>
                  
                  {/* Load Assistance */}
                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id="loadAssist"
                      checked={needLoadAssist}
                      onCheckedChange={(checked) => setNeedLoadAssist(checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="loadAssist"
                        className="font-medium cursor-pointer flex items-center justify-between"
                      >
                        <span>Precisa de ajuda na carga e descarga?</span>
                        <span className="text-primary font-semibold">
                          +€{VEHICLES.find(v => v.id === selectedVehicle)?.loadAssistPrice}
                        </span>
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        O motorista irá auxiliar no carregamento e descarregamento do item
                      </p>
                    </div>
                  </div>

                  {/* Old Item Removal */}
                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id="oldItemRemoval"
                      checked={needOldItemRemoval}
                      onCheckedChange={(checked) => setNeedOldItemRemoval(checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="oldItemRemoval"
                        className="font-medium cursor-pointer flex items-center justify-between"
                      >
                        <span>Recolha de item usado</span>
                        <span className="text-primary font-semibold">
                          +€{VEHICLES.find(v => v.id === selectedVehicle)?.oldItemRemovalPrice}
                        </span>
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Recolhemos seu item antigo durante a entrega
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Document Upload */}
              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="document" className="text-base flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Documento de Compra (Opcional)
                </Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    id="document"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Label htmlFor="document" className="cursor-pointer">
                    {uploadedFile ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <Package className="h-5 w-5" />
                        <span className="font-medium">{uploadedFile.name}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Clique para fazer upload da fatura ou recibo
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, JPG ou PNG (máx. 5MB)
                        </p>
                      </div>
                    )}
                  </Label>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Link href="/request/addresses" className="flex-1">
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
