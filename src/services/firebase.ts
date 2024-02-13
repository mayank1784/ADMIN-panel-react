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
import { getStorage, connectStorageEmulator } from 'firebase/storage'
const app = initializeApp(firebaseConfig)
const storage = getStorage()

const auth = getAuth(app)
auth.useDeviceLanguage()
connectAuthEmulator(auth, 'http://localhost:9099')
if (location.hostname === 'localhost') {
	// Point to the Storage emulator running on localhost.
	connectStorageEmulator(storage, '127.0.0.1', 9199)
}

const db = getFirestore(app)
connectFirestoreEmulator(db, 'localhost', 8080)

const functions = getFunctions(app)
connectFunctionsEmulator(functions, 'localhost', 5001)

export {
	app,
	auth,
	db,
	functions,
	signInWithEmailAndPassword,
	signOut,
	storage,
}
