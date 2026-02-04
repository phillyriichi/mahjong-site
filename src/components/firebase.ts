import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCIyB4AvZO8-stX6WTkvNTgcbor-kTaE-8',
  authDomain: 'phillymahjong-4e287.firebaseapp.com',
  databaseURL: 'https://phillymahjong-4e287-default-rtdb.firebaseio.com',
  projectId: 'phillymahjong-4e287',
  appId: '1:514815436498:web:8eb06ddd2397f057fe6f0b'
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
