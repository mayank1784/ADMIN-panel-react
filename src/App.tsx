import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import Loader from './common/Loader'
import PageTitle from './components/PageTitle'
import SignIn from './pages/Authentication/SignIn'
import SignUp from './pages/Authentication/SignUp'
import Calendar from './pages/Calendar'
import Chart from './pages/Chart'
import ECommerce from './pages/Dashboard/ECommerce'
import FormElements from './pages/Form/FormElements'
import FormLayout from './pages/Form/FormLayout'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Tables from './pages/Tables'
import Alerts from './pages/UiElements/Alerts'
import Buttons from './pages/UiElements/Buttons'

function App() {
	const [loading, setLoading] = useState<boolean>(true)
	const { pathname } = useLocation()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [pathname])

	useEffect(() => {
		setTimeout(() => setLoading(false), 1000)
	}, [])

	return loading ? (
		<Loader />
	) : (
		<>
			<Routes>
				<Route
					index
					element={
						<>
							<PageTitle title="ADI Hardwares | Dashboard" />
							<ECommerce />
						</>
					}
				/>
				<Route
					path="/calendar"
					element={
						<>
							<PageTitle title="Calendar | ADI Hardwares" />
							<Calendar />
						</>
					}
				/>
				<Route
					path="/profile"
					element={
						<>
							<PageTitle title="Profile | ADI Hardwares" />
							<Profile />
						</>
					}
				/>
				<Route
					path="/forms/form-elements"
					element={
						<>
							<PageTitle title="Form Elements | ADI Hardwares" />
							<FormElements />
						</>
					}
				/>
				<Route
					path="/forms/form-layout"
					element={
						<>
							<PageTitle title="Form Layout | ADI Hardwares" />
							<FormLayout />
						</>
					}
				/>
				<Route
					path="/tables"
					element={
						<>
							<PageTitle title="Tables | ADI Hardwares" />
							<Tables />
						</>
					}
				/>
				<Route
					path="/settings"
					element={
						<>
							<PageTitle title="Settings | ADI Hardwares" />
							<Settings />
						</>
					}
				/>
				<Route
					path="/chart"
					element={
						<>
							<PageTitle title="Basic Chart | ADI Hardwares" />
							<Chart />
						</>
					}
				/>
				<Route
					path="/ui/alerts"
					element={
						<>
							<PageTitle title="Alerts | ADI Hardwares" />
							<Alerts />
						</>
					}
				/>
				<Route
					path="/ui/buttons"
					element={
						<>
							<PageTitle title="Buttons | ADI Hardwares" />
							<Buttons />
						</>
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
					path="/auth/signup"
					element={
						<>
							<PageTitle title="Signup | ADI Hardwares" />
							<SignUp />
						</>
					}
				/>
			</Routes>
		</>
	)
}

export default App
