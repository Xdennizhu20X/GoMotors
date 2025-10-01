"use client"

import { useState, useRef } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Card, CardBody, CardHeader, Avatar } from '@heroui/react'
import { motion } from 'framer-motion'
import apiClient from '@/lib/api-client'
import { useAuth } from '@/hooks/useAuth'
import cloudinaryService from '@/lib/cloudinary'
import { useDealerTheme } from '@/hooks/useDealerTheme'

export default function AuthPage() {
  const { primaryColor } = useDealerTheme()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('Loja')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { login, register } = useAuth()

  const EyeIcon = ({ isVisible }: { isVisible: boolean }) => (
    <svg
      className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {isVisible ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
        />
      )}
    </svg>
  )

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Por favor selecciona una imagen válida (JPG, PNG o WebP)')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError('La imagen no debe superar los 5MB')
      return
    }

    setProfilePhoto(file)
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfilePhotoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const validatePassword = (pwd: string): boolean => {
    if (pwd.length < 6) return false
    if (!/[a-z]/.test(pwd)) return false
    if (!/[A-Z]/.test(pwd)) return false
    if (!/[0-9]/.test(pwd)) return false
    return true
  }

  const handleCredentialsAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validación del lado del cliente para registro
    if (!isLogin) {
      if (!validatePassword(password)) {
        setError('La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número')
        setLoading(false)
        return
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden')
        setLoading(false)
        return
      }
    }

    try {
      if (isLogin) {
        // Login with backend API
        await login(email, password)
        // Redirect handled by useAuth hook
      } else {
        let avatarUrl: string | undefined

        // Upload profile photo to Cloudinary if provided
        if (profilePhoto) {
          setUploadingPhoto(true)
          try {
            avatarUrl = await cloudinaryService.uploadProfilePhoto(profilePhoto)
          } catch (uploadError: any) {
            setError(uploadError.message || 'Error al subir la foto de perfil')
            setLoading(false)
            setUploadingPhoto(false)
            return
          }
          setUploadingPhoto(false)
        }

        // Register with backend API
        // First try without avatar to see if backend accepts it
        const registrationData: any = {
          name,
          email,
          password,
          phone: phone || undefined,
          location: location || undefined,
        }

        // Only add avatar if it exists and we want to try including it
        if (avatarUrl) {
          // Try with avatar first, but be prepared to retry without it
          registrationData.avatar = avatarUrl
        }

        try {
          await register(registrationData)
        } catch (regError: any) {
          // If registration fails with avatar, try without it
          if (avatarUrl && regError.error?.code === 'VALIDATION_ERROR') {
            delete registrationData.avatar
            await register(registrationData)
            // TODO: Update profile with avatar after successful registration
          } else {
            throw regError
          }
        }
        // Redirect handled by useAuth hook
      }
    } catch (error: any) {
      console.error('Error:', error)

      // Extraer mensajes de error específicos del backend
      let errorMessage = error.error?.message || (isLogin ? 'Error al iniciar sesión' : 'Error al registrarse')

      // Si hay detalles de validación, mostrarlos
      if (error.error?.details && Array.isArray(error.error.details)) {
        const validationErrors = error.error.details.map((detail: any) => detail.msg || detail.message)
        if (validationErrors.length > 0) {
          errorMessage = validationErrors.join('. ')
        }
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
      setUploadingPhoto(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      console.error('Error:', error)
      alert('Error al autenticar con Google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-h-[90vh] h-full flex items-center justify-center bg-white dark:bg-gray-950 px-4 py-8 overflow-hidden relative">
      <div className="absolute inset-0 opacity-50 dark:opacity-30" style={{
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            ${primaryColor}08 2px,
            ${primaryColor}08 4px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            ${primaryColor}08 2px,
            ${primaryColor}08 4px
          )
        `,
        backgroundSize: '40px 40px'
      }}></div>
      <div className="absolute top-10 left-10 w-20 h-20 border rounded-full animate-pulse" style={{ borderColor: `${primaryColor}30` }}></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 border-2 rounded-lg rotate-45 animate-bounce" style={{ borderColor: `${primaryColor}20`, animationDuration: '3s' }}></div>
      <div className="absolute top-1/3 right-10 w-6 h-6 rounded-full animate-ping" style={{ backgroundColor: `${primaryColor}10`, animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/3 left-20 w-4 h-4 rounded-full animate-ping" style={{ backgroundColor: `${primaryColor}15`, animationDelay: '2s' }}></div>
      <div className="absolute top-20 right-1/3 w-8 h-8 border rounded-sm rotate-12 animate-pulse" style={{ borderColor: `${primaryColor}25`, animationDelay: '0.5s' }}></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full max-h-[90vh] overflow-y-auto relative z-10"
      >
        <Card className="w-full backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
          <CardHeader className="flex flex-col gap-2 pb-4">
            <h1 className="text-xl font-bold text-center">
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {isLogin 
                ? 'Ingresa a tu cuenta de RUEDA YA!' 
                : 'Crea tu cuenta en RUEDA YA!'
              }
            </p>
          </CardHeader>
          
          <CardBody className="pt-0 pb-4">
            <form onSubmit={handleCredentialsAuth} className="space-y-2.5">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 py-2 rounded-lg text-sm">
                  <div className="flex items-start">
                    <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>{error}</div>
                  </div>
                </div>
              )}
              
              {!isLogin && (
                <>
                  {/* Profile Photo Upload */}
                  <div className="flex flex-col items-center space-y-1 mb-2">
                    <div
                      className="relative cursor-pointer group"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Avatar
                        src={profilePhotoPreview || undefined}
                        className="w-16 h-16 text-base"
                        showFallback
                        fallback={
                          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        }
                      />
                      <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      {profilePhoto ? profilePhoto.name : 'Foto de perfil (opcional)'}
                    </p>
                    {uploadingPhoto && (
                      <p className="text-xs" style={{ color: primaryColor }}>Subiendo foto...</p>
                    )}
                    {profilePhoto && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfilePhoto(null)
                          setProfilePhotoPreview(null)
                        }}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Quitar foto
                      </button>
                    )}
                  </div>

                  <Input
                    type="text"
                    label="Nombre completo"
                    placeholder="Ingresa tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    size="sm"
                    classNames={{
                      inputWrapper: "!outline-none focus-within:!outline-none",
                      input: "!outline-none focus:!outline-none"
                    }}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <Input
                      type="tel"
                      label="Teléfono (opcional)"
                      placeholder="+593 999 999 999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      size="sm"
                      classNames={{
                        inputWrapper: "!outline-none focus-within:!outline-none",
                        input: "!outline-none focus:!outline-none"
                      }}
                    />

                    <select
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none transition-colors h-10"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      style={{
                        // @ts-ignore
                        '--focus-border-color': primaryColor
                      }}
                      onFocus={(e) => e.target.style.borderColor = primaryColor}
                      onBlur={(e) => e.target.style.borderColor = ''}
                    >
                      <option value="">Selecciona tu ciudad</option>
                      <option value="Loja">Loja</option>
                      <option value="Quito">Quito</option>
                    </select>
                  </div>
                </>
              )}
              
              <Input
                type="email"
                label="Correo electrónico"
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                size="sm"
                classNames={{
                  inputWrapper: "!outline-none focus-within:!outline-none",
                  input: "!outline-none focus:!outline-none"
                }}
              />
              
              {!isLogin ? (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <Input
                      type={showPassword ? "text" : "password"}
                      label="Contraseña"
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      size="sm"
                      endContent={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="focus:outline-none"
                        >
                          <EyeIcon isVisible={showPassword} />
                        </button>
                      }
                      classNames={{
                        inputWrapper: "!outline-none focus-within:!outline-none",
                        input: "!outline-none focus:!outline-none"
                      }}
                    />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      label="Confirmar contraseña"
                      placeholder="Repite tu contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      size="sm"
                      endContent={
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="focus:outline-none"
                        >
                          <EyeIcon isVisible={showConfirmPassword} />
                        </button>
                      }
                      classNames={{
                        inputWrapper: "!outline-none focus-within:!outline-none",
                        input: "!outline-none focus:!outline-none"
                      }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                      <div className={password.length >= 6 ? "text-green-600 dark:text-green-400" : ""}>
                        • 6+ caracteres {password.length >= 6 && "✓"}
                      </div>
                      <div className={/[a-z]/.test(password) ? "text-green-600 dark:text-green-400" : ""}>
                        • Minúscula {/[a-z]/.test(password) && "✓"}
                      </div>
                      <div className={/[A-Z]/.test(password) ? "text-green-600 dark:text-green-400" : ""}>
                        • Mayúscula {/[A-Z]/.test(password) && "✓"}
                      </div>
                      <div className={/[0-9]/.test(password) ? "text-green-600 dark:text-green-400" : ""}>
                        • Número {/[0-9]/.test(password) && "✓"}
                      </div>
                      {confirmPassword && (
                        <div className={`col-span-2 ${password === confirmPassword ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                          • Las contraseñas coinciden {password === confirmPassword && "✓"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Contraseña"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  size="sm"
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none"
                    >
                      <EyeIcon isVisible={showPassword} />
                    </button>
                  }
                  classNames={{
                    inputWrapper: "!outline-none focus-within:!outline-none",
                    input: "!outline-none focus:!outline-none"
                  }}
                />
              )}
              
              <Button
                type="submit"
                className="w-full text-white mt-3"
                style={{ backgroundColor: primaryColor }}
                isLoading={loading}
                size="sm"
              >
                {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
              </Button>
            </form>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  O continúa con
                </span>
              </div>
            </div>
            
            <Button
              onClick={handleGoogleAuth}
              variant="bordered"
              className="w-full"
              size="sm"
              startContent={
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              }
              isLoading={loading}
            >
              Continuar con Google
            </Button>
            
            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setPassword('')
                  setConfirmPassword('')
                  setShowPassword(false)
                  setShowConfirmPassword(false)
                  setError(null)
                }}
                className="hover:underline text-sm"
                style={{ color: primaryColor }}
              >
                {isLogin
                  ? '¿No tienes cuenta? Regístrate'
                  : '¿Ya tienes cuenta? Inicia sesión'
                }
              </button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  )
}