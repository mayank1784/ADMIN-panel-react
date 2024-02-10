// PrivateRoute.tsx
import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

interface PrivateRouteProps {
	children: ReactNode
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
	const { user } = useAuth()
	if (!user) {
		return <Navigate to="/auth/signin" />
	}
	return <>{children}</>
}
export default PrivateRoute
