import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const SubscriptionContext = createContext({})

const tierBenefits = {
  free: {
    hearts: 5,
    maxHearts: 5,
    unlimitedHearts: false,
    noAds: false,
    offlineMode: false,
    maxLanguages: 2,
    allLessons: false,
  },
  premium: {
    hearts: 999,
    maxHearts: 999,
    unlimitedHearts: true,
    noAds: true,
    offlineMode: true,
    maxLanguages: 999,
    allLessons: true,
  },
  family: {
    hearts: 999,
    maxHearts: 999,
    unlimitedHearts: true,
    noAds: true,
    offlineMode: true,
    maxLanguages: 999,
    allLessons: true,
    familyMembers: 6,
  },
  enterprise: {
    hearts: 999,
    maxHearts: 999,
    unlimitedHearts: true,
    noAds: true,
    offlineMode: true,
    maxLanguages: 999,
    allLessons: true,
    customBranding: true,
    apiAccess: true,
  }
}

export function SubscriptionProvider({ children }) {
  const { user, profile } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [tier, setTier] = useState('free')
  const [benefits, setBenefits] = useState(tierBenefits.free)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchSubscription()
    } else {
      setSubscription(null)
      setTier('free')
      setBenefits(tierBenefits.free)
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (profile?.subscription_tier) {
      updateTier(profile.subscription_tier)
    }
  }, [profile?.subscription_tier])

  const fetchSubscription = async () => {
    try {
      const { data: subData } = await supabase
        .from('user_subscriptions')
        .select('*, subscription_tiers(*)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      if (subData) {
        setSubscription(subData)
        const tierName = subData.subscription_tiers?.name?.toLowerCase() || 'free'
        updateTier(tierName)
      } else {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single()

        if (profileData?.subscription_tier) {
          updateTier(profileData.subscription_tier)
        } else {
          updateTier('free')
        }
      }
    } catch (error) {
      console.log('Could not fetch subscription:', error)
      updateTier('free')
    } finally {
      setLoading(false)
    }
  }

  const updateTier = (tierName) => {
    const normalizedTier = tierName?.toLowerCase() || 'free'
    setTier(normalizedTier)
    setBenefits(tierBenefits[normalizedTier] || tierBenefits.free)
  }

  const refreshSubscription = () => {
    if (user?.id) {
      fetchSubscription()
    }
  }

  const hasBenefit = (benefitName) => {
    return benefits[benefitName] || false
  }

  const isPremium = tier !== 'free'

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      tier,
      benefits,
      loading,
      isPremium,
      hasBenefit,
      refreshSubscription,
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  return useContext(SubscriptionContext)
}

export default SubscriptionContext
