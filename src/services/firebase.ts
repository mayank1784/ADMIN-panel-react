// /src/services/firebase.ts
import { initializeApp } from 'firebase/app'
import {
	getAuth,
	connectAuthEmulator,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import firebaseConfig from './firebaseConfig'

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
auth.useDeviceLanguage()
connectAuthEmulator(auth, 'http://localhost:9099')

const db = getFirestore(app)
connectFirestoreEmulator(db, 'localhost', 8080)

const functions = getFunctions(app)
connectFunctionsEmulator(functions, 'localhost', 5001)

export { app, auth, db, functions, signInWithEmailAndPassword, signOut }
