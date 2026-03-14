'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DebugPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      console.log('User:', user)
      console.log('User Error:', userError)
      
      if (userError) {
        setError(userError.message)
        setLoading(false)
        return
      }
      
      setUser(user)
      
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        console.log('Profile:', profile)
        console.log('Profile Error:', profileError)
        
        if (profileError) {
          setError(profileError.message)
        }
        
        setProfile(profile)
      }
      
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Debug: Authentication Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <div>
            <h3 className="font-bold mb-2">User Status:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {user ? JSON.stringify(user, null, 2) : 'Not logged in'}
            </pre>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">Profile Status:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {profile ? JSON.stringify(profile, null, 2) : 'No profile found'}
            </pre>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">Diagnosis:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Logged in: {user ? '✅ Yes' : '❌ No'}</li>
              <li>Profile exists: {profile ? '✅ Yes' : '❌ No'}</li>
              <li>Is Admin: {profile?.role === 'admin' ? '✅ Yes' : '❌ No'}</li>
              <li>Role value: {profile?.role || 'N/A'}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
