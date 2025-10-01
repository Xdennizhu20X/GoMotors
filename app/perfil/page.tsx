"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardBody, CardHeader, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import apiClient from '@/lib/api-client'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  avatar?: string
  createdAt: string
  preferences: {
    notifications: boolean
    newsletter: boolean
    favoritesBrands: string[]
  }
}

interface Purchase {
  _id: string
  vehicleName: string
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: number
  vehiclePrice: number
  selectedColor: string
  dealerName: string
  dealerLocation: string
  paymentMethod: 'cash' | 'financing'
  totalPrice: number
  purchaseDate: string
  status: string
  financingDetails?: {
    downPayment: number
    loanAmount: number
    loanTerms: number
    monthlyPayment: number
    interestRate: number
  }
}

function ProfilePageContent() {
  const { user, updateProfile } = useAuth()
  const searchParams = useSearchParams()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [activeTab, setActiveTab] = useState<'profile' | 'purchases'>('profile')
  const [loading, setLoading] = useState(true)
  const [purchasesLoading, setPurchasesLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure()

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: ''
  })

  const cities = [
    'Quito', 'Guayaquil', 'Cuenca', 'Santo Domingo',
    'Machala', 'Manta', 'Portoviejo', 'Ambato'
  ]

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    // Check for tab parameter in URL
    const tab = searchParams.get('tab')
    if (tab === 'purchases') {
      setActiveTab('purchases')
    }
  }, [searchParams])

  useEffect(() => {
    if (activeTab === 'purchases' && purchases.length === 0) {
      fetchPurchases()
    }
  }, [activeTab])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/users/profile')

      // Extract user data from API response
      const userData = response.data || response

      setProfile(userData)
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        location: userData.location || ''
      })
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      setError('Error al cargar el perfil')
    } finally {
      setLoading(false)
    }
  }

  const fetchPurchases = async () => {
    try {
      setPurchasesLoading(true)
      const response = await apiClient.getPurchases()

      // Extract purchases data from API response
      const purchasesData = response.data?.purchases || response.data || []

      setPurchases(purchasesData)
    } catch (error: any) {
      console.error('Error fetching purchases:', error)
      setError('Error al cargar las compras')
    } finally {
      setPurchasesLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setError(null)
    setSuccess(null)

    try {
      const updateData: any = {}

      if (formData.name !== profile?.name) updateData.name = formData.name
      if (formData.phone !== profile?.phone) updateData.phone = formData.phone
      if (formData.location !== profile?.location) updateData.location = formData.location

      if (Object.keys(updateData).length === 0) {
        setSuccess('No hay cambios para actualizar')
        return
      }

      const response = await apiClient.put('/users/profile', updateData)

      // Extract updated user data from API response
      const updatedUserData = response.data || response

      setProfile(updatedUserData)
      await updateProfile(updatedUserData)
      setSuccess('Perfil actualizado exitosamente')
    } catch (error: any) {
      console.error('Error updating profile:', error)
      setError(error.error?.message || 'Error al actualizar el perfil')
    } finally {
      setUpdating(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleViewDetails = (purchase: Purchase) => {
    setSelectedPurchase(purchase)
    onDetailsOpen()
  }

  const handleDownloadInvoice = async (purchaseId: string) => {
    try {
      console.log('Downloading invoice for purchase:', purchaseId)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases/${purchaseId}/invoice`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Error al generar la factura')
      }

      // Get the PDF blob
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `factura-${purchaseId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      console.log('Invoice downloaded successfully')
    } catch (error) {
      console.error('Error downloading invoice:', error)
      setError('Error al descargar la factura')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1341ee] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardBody className="text-center py-8">
            <p className="text-red-600 dark:text-red-400">Error al cargar el perfil</p>
            <Button
              onClick={fetchProfile}
              className="mt-4 bg-[#1341ee] text-white"
            >
              Reintentar
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mi Perfil</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Gestiona tu información personal y revisa tus compras
            </p>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 mt-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Información Personal
              </button>
              <button
                onClick={() => setActiveTab('purchases')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'purchases'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Mis Compras ({purchases.length})
              </button>
            </div>
          </div>

          {/* Profile Tab Content */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Summary Card */}
              <div className="lg:col-span-1">
                <Card className="h-fit">
                  <CardBody className="text-center py-8">
                    <div className="w-24 h-24 bg-[#1341ee] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">
                        {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {profile.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {profile.email}
                    </p>
                    <div className="mt-4 space-y-2 text-sm">
                      {profile.phone && (
                        <p className="text-gray-600 dark:text-gray-400">
                          📱 {profile.phone}
                        </p>
                      )}
                      {profile.location && (
                        <p className="text-gray-600 dark:text-gray-400">
                          📍 {profile.location}
                        </p>
                      )}
                      <p className="text-gray-600 dark:text-gray-400">
                        📅 Miembro desde {new Date(profile.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Edit Profile Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Información Personal
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                          {error}
                        </div>
                      )}

                      {success && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg">
                          {success}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          type="text"
                          label="Nombre completo"
                          placeholder="Ingresa tu nombre completo"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          required
                          classNames={{
                            inputWrapper: "!outline-none focus-within:!outline-none",
                            input: "!outline-none focus:!outline-none"
                          }}
                        />

                        <Input
                          type="email"
                          label="Correo electrónico"
                          value={profile.email}
                          disabled
                          description="El email no se puede cambiar"
                          classNames={{
                            inputWrapper: "!outline-none focus-within:!outline-none",
                            input: "!outline-none focus:!outline-none"
                          }}
                        />

                        <Input
                          type="tel"
                          label="Teléfono"
                          placeholder="+593 999 999 999"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          classNames={{
                            inputWrapper: "!outline-none focus-within:!outline-none",
                            input: "!outline-none focus:!outline-none"
                          }}
                        />

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Ubicación
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 transition-colors"
                            value={formData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                          >
                            <option value="">Selecciona tu ciudad</option>
                            {cities.map(city => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4">
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => setFormData({
                            name: profile.name || '',
                            phone: profile.phone || '',
                            location: profile.location || ''
                          })}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          className="bg-[#1341ee] text-white"
                          isLoading={updating}
                        >
                          Guardar Cambios
                        </Button>
                      </div>
                    </form>
                  </CardBody>
                </Card>
              </div>

              {/* Account Stats */}
              <div className="mt-8 lg:col-span-3">
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Preferencias
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-2xl font-bold text-[#1341ee]">
                          {profile.preferences.notifications ? 'Activas' : 'Inactivas'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Notificaciones</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-2xl font-bold text-[#1341ee]">
                          {profile.preferences.newsletter ? 'Suscrito' : 'No suscrito'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Newsletter</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-2xl font-bold text-[#1341ee]">
                          {profile.preferences.favoritesBrands.length}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Marcas favoritas</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}

          {/* Purchases Tab Content */}
          {activeTab === 'purchases' && (
            <div className="space-y-6">
              {purchasesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1341ee] mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Cargando compras...</p>
                </div>
              ) : purchases.length === 0 ? (
                <Card>
                  <CardBody className="text-center py-8">
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No tienes compras aún
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Explora nuestro catálogo de vehículos y realiza tu primera compra
                    </p>
                    <Button
                      className="bg-[#1341ee] text-white"
                      onClick={() => window.location.href = '/vehiculos'}
                    >
                      Ver Vehículos
                    </Button>
                  </CardBody>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Mis Compras ({purchases.length})
                    </h2>
                  </div>

                  {purchases.map((purchase) => (
                    <Card key={purchase._id} className="overflow-hidden">
                      <CardBody className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Vehicle Info */}
                          <div className="md:col-span-2">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                  {purchase.vehicleBrand} {purchase.vehicleModel} {purchase.vehicleYear}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                  Color: {purchase.selectedColor}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">
                                  {purchase.dealerName} - {purchase.dealerLocation}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  purchase.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                  purchase.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                }`}>
                                  {purchase.status === 'completed' ? 'Completada' :
                                   purchase.status === 'pending' ? 'Pendiente' : purchase.status}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Precio del vehículo</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {formatPrice(purchase.vehiclePrice)}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Método de pago</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {purchase.paymentMethod === 'cash' ? 'Contado' : 'Financiamiento'}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Total pagado</p>
                                <p className="font-semibold text-[#1341ee]">
                                  {formatPrice(purchase.totalPrice)}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Fecha de compra</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {formatDate(purchase.purchaseDate)}
                                </p>
                              </div>
                            </div>

                            {purchase.financingDetails && (
                              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                                  Detalles del Financiamiento
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                  <div>
                                    <p className="text-blue-700 dark:text-blue-300">Cuota inicial</p>
                                    <p className="font-semibold">
                                      {formatPrice(purchase.financingDetails.downPayment)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-blue-700 dark:text-blue-300">Monto del préstamo</p>
                                    <p className="font-semibold">
                                      {formatPrice(purchase.financingDetails.loanAmount)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-blue-700 dark:text-blue-300">Cuota mensual</p>
                                    <p className="font-semibold">
                                      {formatPrice(purchase.financingDetails.monthlyPayment)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-blue-700 dark:text-blue-300">Plazo</p>
                                    <p className="font-semibold">
                                      {purchase.financingDetails.loanTerms} meses
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col justify-start space-y-2">
                            <Button
                              size="sm"
                              variant="light"
                              className="w-full justify-start"
                              onPress={() => handleViewDetails(purchase)}
                            >
                              Ver Detalles
                            </Button>
                            <Button
                              size="sm"
                              variant="light"
                              className="w-full justify-start"
                              onPress={() => handleDownloadInvoice(purchase._id)}
                            >
                              Descargar Factura
                            </Button>
                            {purchase.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="light"
                                className="w-full justify-start text-red-600"
                              >
                                Cancelar Compra
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Purchase Details Modal */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={onDetailsClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Detalles de la Compra</h2>
            {selectedPurchase && (
              <p className="text-sm text-gray-500">
                Compra realizada el {formatDate(selectedPurchase.purchaseDate)}
              </p>
            )}
          </ModalHeader>
          <ModalBody>
            {selectedPurchase && (
              <div className="space-y-6">
                {/* Vehicle Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Información del Vehículo
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Vehículo</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {selectedPurchase.vehicleBrand} {selectedPurchase.vehicleModel} {selectedPurchase.vehicleYear}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Color seleccionado</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {selectedPurchase.selectedColor}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Precio del vehículo</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatPrice(selectedPurchase.vehiclePrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedPurchase.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        selectedPurchase.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {selectedPurchase.status === 'completed' ? 'Completada' :
                         selectedPurchase.status === 'pending' ? 'Pendiente' : selectedPurchase.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dealer Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Información del Concesionario
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Concesionario</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {selectedPurchase.dealerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Ubicación</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {selectedPurchase.dealerLocation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Información de Pago
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Método de pago</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {selectedPurchase.paymentMethod === 'cash' ? 'Contado' : 'Financiamiento'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total pagado</p>
                      <p className="font-semibold text-[#1341ee] text-lg">
                        {formatPrice(selectedPurchase.totalPrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de compra</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatDate(selectedPurchase.purchaseDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ID de compra</p>
                      <p className="font-mono text-sm text-gray-900 dark:text-white">
                        {selectedPurchase._id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Financing Details */}
                {selectedPurchase.financingDetails && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Detalles del Financiamiento
                    </h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-blue-700 dark:text-blue-300">Cuota inicial</p>
                          <p className="font-semibold text-blue-900 dark:text-blue-200">
                            {formatPrice(selectedPurchase.financingDetails.downPayment)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-blue-700 dark:text-blue-300">Monto del préstamo</p>
                          <p className="font-semibold text-blue-900 dark:text-blue-200">
                            {formatPrice(selectedPurchase.financingDetails.loanAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-blue-700 dark:text-blue-300">Cuota mensual</p>
                          <p className="font-semibold text-blue-900 dark:text-blue-200">
                            {formatPrice(selectedPurchase.financingDetails.monthlyPayment)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-blue-700 dark:text-blue-300">Plazo del préstamo</p>
                          <p className="font-semibold text-blue-900 dark:text-blue-200">
                            {selectedPurchase.financingDetails.loanTerms} meses
                          </p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-blue-200 dark:border-blue-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-blue-700 dark:text-blue-300">Tasa de interés</p>
                            <p className="font-semibold text-blue-900 dark:text-blue-200">
                              {selectedPurchase.financingDetails.interestRate}% anual
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-blue-700 dark:text-blue-300">Total a pagar</p>
                            <p className="font-semibold text-blue-900 dark:text-blue-200">
                              {formatPrice(selectedPurchase.financingDetails.monthlyPayment * selectedPurchase.financingDetails.loanTerms + selectedPurchase.financingDetails.downPayment)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={onDetailsClose}
            >
              Cerrar
            </Button>
            {selectedPurchase && (
              <Button
                className="bg-[#1341ee] text-white"
                onPress={() => {
                  handleDownloadInvoice(selectedPurchase._id)
                  onDetailsClose()
                }}
              >
                Descargar Factura
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ProfilePageContent />
    </Suspense>
  )
}