// AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import {
	auth,
	signInWithEmailAndPassword as signIn,
	signOut as signOutFirebase,
} from '../../services/firebase' // Adjust the import based on your project structure

interface AuthContextType {
	user: any // Replace 'any' with your user type if you have one
	signInWithEmailAndPasswordFunc: (
		email: string,
		password: string
	) => Promise<void>
	signOutFunc: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<any>(null)

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
			setUser(authUser)
			if (authUser) {
				// Check if the user has the admin custom claim
				const tokenResult = await authUser.getIdTokenResult()
				console.log('token result: ', tokenResult.claims.admin)
				const isAdmin = !!tokenResult.claims.admin

				// Set the user only if they are an admin
				if (isAdmin) {
					setUser(authUser)
				} else {
					// If the user is not an admin, sign them out
					await signOutFirebase(auth)
					// Redirect or handle this situation differently (show an error, etc.)
					console.error('User is not an admin. Access denied.')
				}
			} else {
				setUser(null)
			}
		})

		return () => {
			unsubscribe()
		}
	}, [])

	const signInWithEmailAndPasswordFunc = async (
		email: string,
		password: string
	) => {
		try {
			await signIn(auth, email, password)
		} catch (error) {
			console.error('Error signing in with email and password:', error)
		}
	}

	const signOutFunc = async () => {
		try {
			await signOutFirebase(auth)
		} catch (error) {
			console.error('Error signing out:', error)
		}
	}

	const value: AuthContextType = {
		user,
		signInWithEmailAndPasswordFunc,
		signOutFunc,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
