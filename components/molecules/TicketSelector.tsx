'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Lock, AlertCircle, Users, User } from 'lucide-react'
import { TicketType } from '@/types'

interface TicketSelectorProps {
  isLoggedIn: boolean
  onAddToCart: (type: TicketType, quantity: number) => void
  cartItems: Array<{ type: TicketType; quantity: number }>
  error: string | null
}

export function TicketSelector({ isLoggedIn, onAddToCart, cartItems, error }: TicketSelectorProps) {
  const [individualChild, setIndividualChild] = useState(0)
  const [individualAdult, setIndividualAdult] = useState(0)
  const [groupChild, setGroupChild] = useState(0)
  const [groupAdult, setGroupAdult] = useState(0)

  const hasIndividualTickets = cartItems.some(item => 
    item.type === 'individual_child' || item.type === 'individual_adult'
  )
  const hasGroupTickets = cartItems.some(item => 
    item.type === 'group_child' || item.type === 'group_adult'
  )

  const individualTotal = individualChild + individualAdult
  const groupTotal = groupChild + groupAdult

  const isIndividualLocked = hasGroupTickets
  const isGroupLocked = hasIndividualTickets || !isLoggedIn

  const handleAddIndividual = () => {
    if (individualChild > 0) {
      onAddToCart('individual_child', individualChild)
    }
    if (individualAdult > 0) {
      onAddToCart('individual_adult', individualAdult)
    }
    setIndividualChild(0)
    setIndividualAdult(0)
  }

  const handleAddGroup = () => {
    if (groupChild > 0) {
      onAddToCart('group_child', groupChild)
    }
    if (groupAdult > 0) {
      onAddToCart('group_adult', groupAdult)
    }
    setGroupChild(0)
    setGroupAdult(0)
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Individual Tickets Section */}
      <Card className={isIndividualLocked ? 'opacity-50' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <CardTitle>Individual Tickets</CardTitle>
            </div>
            {isIndividualLocked && <Lock className="w-5 h-5 text-gray-400" />}
          </div>
          <CardDescription>
            Purchase 1-4 individual tickets. Each ticket requires separate details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="individual-child">
              Child Tickets (1-4)
            </Label>
            <Input
              id="individual-child"
              type="number"
              min="0"
              max="4"
              value={individualChild}
              onChange={(e) => setIndividualChild(Math.min(4, Math.max(0, parseInt(e.target.value) || 0)))}
              disabled={isIndividualLocked}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="individual-adult">
              Adult Tickets (1-4)
            </Label>
            <Input
              id="individual-adult"
              type="number"
              min="0"
              max="4"
              value={individualAdult}
              onChange={(e) => setIndividualAdult(Math.min(4, Math.max(0, parseInt(e.target.value) || 0)))}
              disabled={isIndividualLocked}
            />
          </div>

          {individualTotal > 0 && (
            <div className="text-sm text-gray-600">
              Total: {individualTotal} ticket{individualTotal !== 1 ? 's' : ''}
            </div>
          )}

          <Button
            onClick={handleAddIndividual}
            disabled={isIndividualLocked || individualTotal === 0 || individualTotal > 4}
            className="w-full"
          >
            {isIndividualLocked 
              ? 'Locked (Group tickets selected)' 
              : 'Add Individual Tickets'}
          </Button>

          {isIndividualLocked && (
            <p className="text-sm text-gray-500 text-center">
              Remove group tickets to select individual tickets
            </p>
          )}
        </CardContent>
      </Card>

      {/* Group Tickets Section */}
      <Card className={isGroupLocked ? 'opacity-50' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <CardTitle>Group Tickets</CardTitle>
            </div>
            {isGroupLocked && <Lock className="w-5 h-5 text-gray-400" />}
          </div>
          <CardDescription>
            Purchase 5+ tickets as a group. Requires login. Minimum 5 tickets total.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isLoggedIn ? (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You must be logged in to purchase group tickets
                </AlertDescription>
              </Alert>
              <Button className="w-full" asChild>
                <a href="/login">Login to Purchase Group Tickets</a>
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="group-child">
                  Child Tickets
                </Label>
                <Input
                  id="group-child"
                  type="number"
                  min="0"
                  value={groupChild}
                  onChange={(e) => setGroupChild(Math.max(0, parseInt(e.target.value) || 0))}
                  disabled={isGroupLocked}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="group-adult">
                  Adult Tickets
                </Label>
                <Input
                  id="group-adult"
                  type="number"
                  min="0"
                  value={groupAdult}
                  onChange={(e) => setGroupAdult(Math.max(0, parseInt(e.target.value) || 0))}
                  disabled={isGroupLocked}
                />
              </div>

              {groupTotal > 0 && (
                <div className="text-sm text-gray-600">
                  Total: {groupTotal} ticket{groupTotal !== 1 ? 's' : ''}
                  {groupTotal < 5 && (
                    <span className="text-orange-600 ml-2">
                      (Minimum 5 required)
                    </span>
                  )}
                </div>
              )}

              <Button
                onClick={handleAddGroup}
                disabled={isGroupLocked || groupTotal < 5}
                className="w-full"
              >
                {isGroupLocked 
                  ? 'Locked (Individual tickets selected)' 
                  : groupTotal < 5
                  ? 'Add Group Tickets (Min 5)'
                  : 'Add Group Tickets'}
              </Button>

              {isGroupLocked && hasIndividualTickets && (
                <p className="text-sm text-gray-500 text-center">
                  Remove individual tickets to select group tickets
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
