import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider } from './components/Auth/AuthContext'
// import PrivateRoute from './components/Auth/PrivateRoute'

import Loader from './common/Loader'
import PageTitle from './components/PageTitle'
import SignIn from './pages/Authentication/SignIn'
import ResetPassword from './pages/Authentication/ResetPassword'
import Calendar from './pages/Calendar'
import Chart from './pages/Chart'
import ECommerce from './pages/Dashboard/ECommerce'
import FormElements from './pages/Form/FormElements'
import CreateUsersForm from './pages/Form/CreateUsersForm'
import FormLayout from './pages/Form/FormLayout'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Tables from './pages/Tables'
import Alerts from './pages/UiElements/Alerts'
import Buttons from './pages/UiElements/Buttons'
import PrivateRoute from './components/Auth/PrivateRoute'

function App() {
	const [loading, setLoading] = useState<boolean>(true)
	const { pathname } = useLocation()
	// const { user } = useAuth()

	useEffect(() => {
		window.scrollTo(0, 0)
		// console.log('from app.jsx user: ', user)
	}, [pathname])

	useEffect(() => {
		const timer = setTimeout(() => setLoading(false), 1000)

		return () => {
			clearTimeout(timer)
		}
	}, [])

	if (loading) {
		return <Loader />
	}
	return (
		<Routes>
			<Route
				path="/"
				element={
					<PrivateRoute>
						<>
							<PageTitle title="ADI Hardwares | Dashboard" />
							<ECommerce />
						</>
					</PrivateRoute>
				}
			/>

			<Route
				path="/calendar"
				element={
					<PrivateRoute>
						<>
							<PageTitle title="Calendar | ADI Hardwares" />
							<Calendar />
						</>
					</PrivateRoute>
				}
			/>

			<Route
				path="/profile"
				element={
					<PrivateRoute>
						<>
							<PageTitle title="Profile | ADI Hardwares" />
							<Profile />
						</>
					</PrivateRoute>
				}
			/>
			<Route
				path="/forms/form-elements"
				element={
					<PrivateRoute>
						<>
							<PageTitle title="Form Elements | ADI Hardwares" />
							<FormElements />
						</>
					</PrivateRoute>
				}
			/>
			<Route
				path="/forms/createusersform"
				element={
					<PrivateRoute>
						<>
							<PageTitle title="Create Users | ADI Hardwares" />
							<CreateUsersForm />
						</>
					</PrivateRoute>
				}
			/>
			<Route
				path="/forms/form-layout"
				element={
					<PrivateRoute>
						<>
							<PageTitle title="Form Layout | ADI Hardwares" />
							<FormLayout />
						</>
					</PrivateRoute>
				}
			/>

			<Route
				path="/tables"
				element={
					<PrivateRoute>
						<>
							<PageTitle title="Tables | ADI Hardwares" />
							<Tables />
						</>
					</PrivateRoute>
				}
			/>
			<Route
				path="/settings"
				element={
					<PrivateRoute>
						<>
							<PageTitle title="Settings | ADI Hardwares" />
							<Settings />
						</>
					</PrivateRoute>
				}
			/>
			<Route
				path="/chart"
				element={
					<PrivateRoute>
						<>
							<PageTitle title="Basic Chart | ADI Hardwares" />
							<Chart />
						</>
					</PrivateRoute>
				}
			/>
			<Route
				path="/ui/alerts"
				element={
					<PrivateRoute>
						<>
							<PageTitle title="Alerts | ADI Hardwares" />
							<Alerts />
						</>
					</PrivateRoute>
				}
			/>
			<Route
				path="/ui/buttons"
				element={
					<PrivateRoute>
						<>
							<PageTitle title="Buttons | ADI Hardwares" />
							<Buttons />
						</>
					</PrivateRoute>
				}
			/>

			<Route
				path="/auth/signin"
				element={
					<>
						<PageTitle title="Signin | ADI Hardwares" />
						<SignIn />
					</>
				}
			/>
			<Route
				path="/auth/resetPassword"
				element={
					<>
						<PageTitle title="Reset Password | ADI Hardwares" />
						<ResetPassword />
					</>
				}
			/>
			<Route
				path="*"
				element={<Navigate to="/auth/signin" replace={true} />}
			/>
		</Routes>
	)
}

const AppWithAuthProvider: React.FC = () => (
	<AuthProvider>
		<App />
	</AuthProvider>
)

export default AppWithAuthProvider
