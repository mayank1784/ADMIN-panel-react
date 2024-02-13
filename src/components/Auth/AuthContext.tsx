// AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import {
	auth,
	signInWithEmailAndPassword as signIn,
	signOut as signOutFirebase,
	db,
} from '../../services/firebase' // Adjust the import based on your project structure
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { sendPasswordResetEmail } from 'firebase/auth'

interface AuthContextType {
	user: any // Replace 'any' with your user type if you have one
	signInWithEmailAndPasswordFunc: (
		email: string,
		password: string
	) => Promise<void>
	signOutFunc: () => Promise<void>
	sendPasswordResetEmailFunc: (email: string) => Promise<void>
	adminData: any
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<any>(null)
	const [adminData, setAdminData] = useState({})
	const fetchAdminData = async (uid: string) => {
		try {
			const adminDataRef = doc(db, 'admins', uid)

			// const adminDataSnapshot = await getDoc(adminDataRef)

			// if (adminDataSnapshot.exists()) {
			// 	// Append admin data to the user object
			// 	setAdminData(adminDataSnapshot.data())
			// }
			const unsubscribe = onSnapshot(
				adminDataRef,
				(adminDataSnapshot) => {
					if (adminDataSnapshot.exists()) {
						// Update adminData with the latest data
						setAdminData(adminDataSnapshot.data())
					}
				}
			)

			// Return the unsubscribe function to clean up the listener when necessary
			return unsubscribe
		} catch (error) {
			console.error('Error fetching admin data:', error)
		}
	}
	useEffect(() => {
		const unsubscribeAdminData = user ? fetchAdminData(user.uid) : () => {}

		// Clean up the listener when the component unmounts or when the user changes
		return () => {
			if (typeof unsubscribeAdminData === 'function') {
				unsubscribeAdminData()
			}
		}
	}, [user])

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
			if (authUser) {
				const tokenResult = await authUser?.getIdTokenResult()
				const isAdmin = !!tokenResult?.claims?.admin
				if (isAdmin) {
					setUser(authUser)
					fetchAdminData(authUser.uid)
				} else {
					setUser(null)
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
			setUser(null)
		} catch (error) {
			console.error('Error signing out:', error)
		}
	}

	const sendPasswordResetEmailFunc = async (email: string) => {
		try {
			await sendPasswordResetEmail(auth, email)
		} catch (error) {
			console.error('Error sending password reset email:', error)
		}
	}

	const value: AuthContextType = {
		user,
		signInWithEmailAndPasswordFunc,
		signOutFunc,
		adminData,
		sendPasswordResetEmailFunc,
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
