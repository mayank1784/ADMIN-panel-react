// PrivateRoute.tsx
import React from 'react'
import { Route, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

interface PrivateRouteProps {
	element: React.ReactNode
	path: string
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, path }) => {
	const { user } = useAuth()

	return user ? (
		<Route path={path} element={element} />
	) : (
		<Navigate to="/auth/signin" />
	)
}

export default PrivateRoute
