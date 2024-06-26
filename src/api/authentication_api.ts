import { ref } from 'vue'
import { supabase } from './supabase_client'
import type { Session, Provider } from '@supabase/gotrue-js/dist/main/lib/types'

const userSession = ref<Session | null>(null)

/*
 * Handles user login via email + password into a supabase session.
 * If not password is empty, it will send a magic link to the users email address.
 */
async function handleLogin(credentials: Credentials) {
  try {
    const { error, data } = await supabase.auth.signInWithPassword({
      email: credentials.email!,
      password: credentials.password!,
    })
    if (error) {
      alert('Error logging in: ' + error.message)
    }
    // No error throw, but no user detected so send magic link
    if (!error && !data) {
      alert('Check your email for the login link!')
    }
  } catch (error:any) {
    console.error('Error thrown:', error.message)
    alert(error.error_description || error)
  }
}

/*
 * Handles signup provided a valid credentials object.
 */
async function handleSignup(credentials: Credentials) {
  try {
    const { email, password } = credentials
    // prompt user if they have not filled populated their credentials
    if (!email || !password) {
      alert('Please provide both your email and password.')
      return
    }
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      alert(error.message)
      console.error(error, error.message)
      return
    }
    alert('Signup successful, confirmation mail should be sent soon!')
  } catch (err) {
    alert('Fatal error signing up')
    console.error('signup error', err)
  }
}

/**
 * Handles signup via Third Party Login.
 * https://supabase.com/docs/guides/auth#third-party-logins
 */
async function handleOAuthLogin(provider: Provider) {
  const { error } = await supabase.auth.signInWithOAuth({ provider })
  if (error) console.error('Error: ', error.message)
}


async function handleUpdateUser(credentials: Credentials) {
  try {
    const { error } = await supabase.auth.updateUser(credentials)
    if (error) {
      alert('Error updating user info: ' + error.message)
    } else {
      alert('Successfully updated user info!')
      window.location.href = '/'
    }
  } catch (error:any) {
    alert('Error updating user info: ' + error.message)
  }
}

/**
 * Handles logging a user out of a supabase session
 */
async function handleLogout() {
  console.log('logging out')
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      alert('Error signing out')
      console.error('Error', error)
      return
    }

    alert('You have signed out!')
  } catch (err) {
    alert('Unknown error signing out')
    console.error('Error', err)
  }
}

export {
  userSession,
  handleLogin,
  handleOAuthLogin,
  handleSignup,
  handleLogout,
  handleUpdateUser,
}