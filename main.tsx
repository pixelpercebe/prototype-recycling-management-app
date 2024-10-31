import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Menu, Map, Info, X, Trash2 } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'

// Iconos para los tipos de electrodomésticos y dispositivos electrónicos
const LargeApplianceIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M18,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V4C20,2.9,19.1,2,18,2z M18,20H6V4h12V20z M8,6h8v2H8V6z M8,10h8v2H8V10z M8,14h8v2H8V14z"/></svg>
const TVIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M21,3H3C1.9,3,1,3.9,1,5v12c0,1.1,0.9,2,2,2h5v2h8v-2h5c1.1,0,1.99-0.9,1.99-2L23,5C23,3.9,22.1,3,21,3z M21,17H3V5h18V17z"/></svg>
const LightbulbIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M9,21c0,0.55,0.45,1,1,1h4c0.55,0,1-0.45,1-1v-1H9V21z M12,2C8.14,2,5,5.14,5,9c0,2.38,1.19,4.47,3,5.74V17c0,0.55,0.45,1,1,1h6c0.55,0,1-0.45,1-1v-2.26c1.81-1.27,3-3.36,3-5.74C19,5.14,15.86,2,12,2z M14,13.7V16h-4v-2.3C8.48,12.63,7,11.53,7,9c0-2.76,2.24-5,5-5s5,2.24,5,5C17,11.53,15.52,12.63,14,13.7z"/></svg>
const ComputerIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M20,18c1.1,0,2-0.9,2-2V6c0-1.1-0.9-2-2-2H4C2.9,4,2,4.9,2,6v10c0,1.1,0.9,2,2,2H0v2h24v-2H20z M4,6h16v10H4V6z"/></svg>
const MobileIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17,1.01L7,1C5.9,1,5,1.9,5,3v18c0,1.1,0.9,2,2,2h10c1.1,0,2-0.9,2-2V3C19,1.9,18.1,1.01,17,1.01z M17,19H7V5h10V19z"/></svg>
const BatteryIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M15.67,4H14V2h-4v2H8.33C7.6,4,7,4.6,7,5.33v15.33C7,21.4,7.6,22,8.33,22h7.33c0.74,0,1.34-0.6,1.34-1.33V5.33C17,4.6,16.4,4,15.67,4z M13,18h-2v-2h2V18z M13,14h-2V9h2V14z"/></svg>

const stations = [
  { id: 1, name: "Estación Central", lat: 40.416775, lng: -3.703790 },
  { id: 2, name: "Estación Norte", lat: 40.423852, lng: -3.712247 },
  { id: 3, name: "Estación Sur", lat: 40.398857, lng: -3.691648 },
  { id: 4, name: "Estación Este", lat: 40.420085, lng: -3.676256 },
  { id: 5, name: "Estación Oeste", lat: 40.435183, lng: -3.718386 },
]

const containerTypes = [
  { id: 1, name: "Electrodomésticos Grandes", icon: LargeApplianceIcon, color: "bg-blue-500" },
  { id: 2, name: "Televisiones", icon: TVIcon, color: "bg-yellow-500" },
  { id: 3, name: "Bombillas", icon: LightbulbIcon, color: "bg-green-500" },
  { id: 4, name: "Ordenadores", icon: ComputerIcon, color: "bg-red-500" },
  { id: 5, name: "Móviles", icon: MobileIcon, color: "bg-purple-500" },
  { id: 6, name: "Pilas", icon: BatteryIcon, color: "bg-orange-500" },
]

export default function Component() {
  const [activeTab, setActiveTab] = useState('info')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedStation, setSelectedStation] = useState(null)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [containerStatus, setContainerStatus] = useState({})
  const [hazardousCompounds, setHazardousCompounds] = useState({})

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY"
  })

  useEffect(() => {
    // Simular la actualización del estado de los contenedores
    const interval = setInterval(() => {
      const newStatus = {}
      const newHazardous = {}
      stations.forEach(station => {
        newStatus[station.id] = {}
        newHazardous[station.id] = {}
        containerTypes.forEach(container => {
          newStatus[station.id][container.id] = Math.floor(Math.random() * 100)
          newHazardous[station.id][container.id] = {
            lead: Math.random() > 0.5,
            mercury: Math.random() > 0.5,
            cadmium: Math.random() > 0.5,
          }
        })
      })
      setContainerStatus(newStatus)
      setHazardousCompounds(newHazardous)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Verificar si algún contenedor está lleno y generar una notificación
    Object.entries(containerStatus).forEach(([stationId, containers]) => {
      Object.entries(containers).forEach(([containerId, level]) => {
        if (level > 90) {
          const station = stations.find(s => s.id === parseInt(stationId))
          const container = containerTypes.find(c => c.id === parseInt(containerId))
          const newNotification = {
            id: Date.now(),
            message: `Contenedor de ${container.name} en ${station.name} está lleno (${level}%)`
          }
          setNotifications(prev => [newNotification, ...prev])
        }
      })
    })
  }, [containerStatus])

  const emptyContainer = (stationId, containerId) => {
    setContainerStatus(prevStatus => ({
      ...prevStatus,
      [stationId]: {
        ...prevStatus[stationId],
        [containerId]: 0
      }
    }))
    const station = stations.find(s => s.id === stationId)
    const container = containerTypes.find(c => c.id === containerId)
    const newNotification = {
      id: Date.now(),
      message: `Contenedor de ${container.name} en ${station.name} ha sido vaciado`
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const renderContainerInfo = (stationId) => {
    return containerTypes.map(container => (
      <div key={container.id} className="flex items-center space-x-4 mb-4">
        <container.icon className={`h-8 w-8 ${container.color} rounded-full p-1`} />
        <div className="flex-grow">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">{container.name}</span>
            <span className="text-sm font-medium">
              {containerStatus[stationId]?.[container.id] || 0}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Progress value={containerStatus[stationId]?.[container.id] || 0} className="flex-grow" />
            <Button
              variant="outline"
              size="icon"
              onClick={() => emptyContainer(stationId, container.id)}
              title={`Vaciar contenedor de ${container.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-end mt-1 space-x-2">
  <span className={`h-6 w-6 rounded-full flex items-center justify-center ${hazardousCompounds[stationId]?.[container.id]?.lead ? 'bg-blue-500' : 'bg-gray-300'}`} title="Plomo">
    <span className="text-xs font-bold text-white">Pb</span>
  </span>
  <span className={`h-6 w-6 rounded-full flex items-center justify-center ${hazardousCompounds[stationId]?.[container.id]?.mercury ? 'bg-red-500' : 'bg-gray-300'}`} title="Mercurio">
    <span className="text-xs font-bold text-white">Hg</span>
  </span>
  <span className={`h-6 w-6 rounded-full flex items-center justify-center ${hazardousCompounds[stationId]?.[container.id]?.cadmium ? 'bg-yellow-500' : 'bg-gray-300'}`} title="Cadmio">
    <span className="text-xs font-bold text-white">Cd</span>
  </span>
</div>
        </div>
      </div>
    ))
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Monitor de Reciclaje Electrónico</h1>
        <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bell className="h-6 w-6" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="font-bold mb-2">Notificaciones</div>
            <ScrollArea className="h-[300px]">
              {notifications.map(notification => (
                <div key={notification.id} className="bg-secondary p-2 rounded mb-2">
                  <div className="text-sm">{notification.message}</div>
                </div>
              ))}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </header>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 w-64 bg-background border-r z-50"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Estaciones</h2>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <ScrollArea className="h-[calc(100vh-8rem)]">
                {stations.map(station => (
                  <Button
                    key={station.id}
                    variant="ghost"
                    className="w-full justify-start mb-2"
                    onClick={() => {
                      setSelectedStation(station)
                      setSidebarOpen(false)
                      setActiveTab('info')
                    }}
                  >
                    {station.name}
                  </Button>
                ))}
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="map">Mapa</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <Card>
            <CardContent className="p-6">
              {selectedStation ? (
                <>
                  <h2 className="text-2xl font-bold mb-4">{selectedStation.name}</h2>
                  
                  {renderContainerInfo(selectedStation.id)}
                </>
              ) : (
                <div className="text-center text-muted-foreground">
                  Selecciona una estación para ver su información
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="map">
          <Card>
            <CardContent className="p-6">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '400px' }}
                  center={{ lat: 40.416775, lng: -3.703790 }}
                  zoom={12}
                >
                  {stations.map(station => (
                    <Marker
                      key={station.id}
                      position={{ lat: station.lat, lng: station.lng }}
                      onClick={() => {
                        setSelectedStation(station)
                        setActiveTab('info')
                      }}
                    />
                  ))}
                </GoogleMap>
              ) : (
                <div>Cargando mapa...</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}