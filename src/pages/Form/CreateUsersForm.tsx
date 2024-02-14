import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import _ from 'lodash'
import { getFunctions, httpsCallable } from 'firebase/functions'
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb'
import CheckboxFive from '../../components/Checkboxes/CheckboxFive'
import CheckboxFour from '../../components/Checkboxes/CheckboxFour'
import CheckboxOne from '../../components/Checkboxes/CheckboxOne'
import CheckboxThree from '../../components/Checkboxes/CheckboxThree'
import CheckboxTwo from '../../components/Checkboxes/CheckboxTwo'
import SwitcherFour from '../../components/Switchers/SwitcherFour'
import SwitcherOne from '../../components/Switchers/SwitcherOne'
import SwitcherThree from '../../components/Switchers/SwitcherThree'
import SwitcherTwo from '../../components/Switchers/SwitcherTwo'
import DefaultLayout from '../../layout/DefaultLayout'
import DatePickerOne from '../../components/Forms/DatePicker/DatePickerOne'
import DatePickerTwo from '../../components/Forms/DatePicker/DatePickerTwo'
import SelectGroupTwo from '../../components/Forms/SelectGroup/SelectGroupTwo'
import MultiSelect from '../../components/Forms/MultiSelect'
import GenerateQRAndPdf from '../../components/Qr/GenerateQr'
import { toast } from 'react-toastify'

const CreateUsersForm = () => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		watch,
	} = useForm({ mode: 'all' })
	const [isLoading, setIsLoading] = useState(false)
	const onSubmit = async (data) => {
		try {
			setIsLoading(true)
			let processedData = _.omit(data, ['confirmPassword'])

			// Convert all keys to lowercase (except 'password')
			processedData = _.mapValues(processedData, (value, key) => {
				return key === 'password' ? value : _.toLower(value)
			})

			const functions = getFunctions()

			// Call the Firestore function
			const createUsersFunction = httpsCallable(functions, 'createUsers')

			Object.assign(processedData, {
				role: 'admin',
			})
			console.log(processedData)

			const result = await createUsersFunction({
				users: [processedData],
			})

			console.log(result.data)
			setIsLoading(false)
			toast.success('User Created', {
				position: 'top-center',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'light',
			})
		} catch (error) {
			console.log(error)
			setIsLoading(false)
		}
	}
	// console.log(errors)

	return (
		<DefaultLayout>
			<Breadcrumb pageName="Create Users" />

			<div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
				{isLoading ? (
					<div>Loading...</div>
				) : (
					<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
						<div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
							<h3 className="font-medium text-black dark:text-white">
								Add Admin
							</h3>
						</div>
						<form
							autoComplete="off"
							onSubmit={handleSubmit(onSubmit)}>
							<div className="flex flex-col gap-5.5 p-6.5">
								<div>
									<label className="mb-3 block text-black dark:text-white">
										Name
									</label>
									<input
										{...register('name', {
											required: 'Name is Required...',
											minLength: {
												value: 4,
												message:
													'name must be atleast 4 characters long...',
											},
											maxLength: {
												value: 24,
												message:
													'name must be atmost 30 characters long...',
											},
										})}
										placeholder="John Doe"
										className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
									/>
									{typeof errors.name?.message ===
										'string' && (
										<span className="text-red-600">
											{errors.name?.message}
										</span>
									)}
								</div>
								<div>
									<label className="mb-3 block text-black dark:text-white">
										Email
									</label>
									<input
										{...register('email', {
											required: 'Email is Required...',
											pattern: {
												value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
												message: 'Email must be valid',
											},
										})}
										placeholder="Email"
										className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
									/>
									{typeof errors.email?.message ===
										'string' && (
										<span className="text-red-600">
											{errors.email?.message}
										</span>
									)}
								</div>

								<div>
									<label className="mb-3 block text-black dark:text-white">
										Mobile No.
									</label>
									<input
										{...register('contactDetails', {
											required: 'Mobile is Required...',
											minLength: {
												value: 10,
												message:
													'Must be 10 digits long',
											},
											maxLength: {
												value: 10,
												message:
													'Must be 10 digits long',
											},
											pattern: {
												value: /^[6-9][0-9]{9}$/,
												message:
													'Mobile Number must be valid',
											},
										})}
										placeholder="Mobile Number (10 digits without space)"
										className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
									/>
									{typeof errors.contactDetails?.message ===
										'string' && (
										<span className="text-red-600">
											{errors.contactDetails?.message}
										</span>
									)}
								</div>
								<div>
									<label className="mb-3 block text-black dark:text-white">
										Password
									</label>
									<input
										{...register('password', {
											required: 'Password is Required...',
											pattern: {
												value: /^(?=.*[0-9])(?=.*[!@#$%^&*.,])[a-zA-Z0-9!@#$%^&*.,]{6,16}$/,
												message:
													'Password Must Contain Atleast 6 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
											},
										})}
										type="password"
										placeholder="Password"
										className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
									/>
									{typeof errors.password?.message ===
										'string' && (
										<span className="text-red-600">
											{errors.password?.message}
										</span>
									)}
								</div>
								<div>
									<label className="mb-3 block text-black dark:text-white">
										Confirm Password
									</label>
									<input
										{...register('confirmPassword', {
											required: 'Password is Required...',
											validate: (val: string) => {
												if (watch('password') != val) {
													return 'Your passwords do no match'
												}
											},
										})}
										placeholder="Confirm Password"
										className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
									/>
									{typeof errors.confirmPassword?.message ===
										'string' && (
										<span className="text-red-600">
											{errors.confirmPassword?.message}
										</span>
									)}
								</div>
								<button
									type="submit"
									className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
									Submit
								</button>

								{/* <div>
							<label className="mb-3 block font-medium text-black dark:text-white">
								Disabled label
							</label>
							<input
								type="text"
								placeholder="Disabled label"
								disabled
								className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
							/>
						</div> */}
								{/* <div>
							<label className="mb-3 block text-black dark:text-white">
								Attach file
							</label>
							<input
								type="file"
								className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
							/>
						</div> */}

								{/* <div>
							<label className="mb-3 block text-black dark:text-white">
								Attach file
							</label>
							<input
								type="file"
								className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
							/>
						</div> */}
							</div>
						</form>
					</div>
				)}

				{/* <!-- Toggle switch input --> */}
				{/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
						<div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
							<h3 className="font-medium text-black dark:text-white">
								Toggle switch input
							</h3>
						</div>
						<div className="flex flex-col gap-5.5 p-6.5">
							<SwitcherOne />
							<SwitcherTwo />
							<SwitcherThree />
							<SwitcherFour />
						</div>
					</div> */}

				{/* <!-- Time and date --> */}
				{/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
						<div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
							<h3 className="font-medium text-black dark:text-white">
								Time and date
							</h3>
						</div>
						<div className="flex flex-col gap-5.5 p-6.5">
							<DatePickerOne />
							<DatePickerTwo />
						</div>
					</div> */}

				{/* <!-- File upload --> */}
				{/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
						<div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
							<h3 className="font-medium text-black dark:text-white">
								File upload
							</h3>
						</div>
						<div className="flex flex-col gap-5.5 p-6.5">
							<div>
								<label className="mb-3 block text-black dark:text-white">
									Attach file
								</label>
								<input
									type="file"
									className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
								/>
							</div>

							<div>
								<label className="mb-3 block text-black dark:text-white">
									Attach file
								</label>
								<input
									type="file"
									className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
								/>
							</div>
						</div>
					</div> */}
				{/* </div> */}

				{/* <div className="flex flex-col gap-9"> */}
				{/* <!-- Textarea Fields --> */}
				{/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
						<div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
							<h3 className="font-medium text-black dark:text-white">
								Textarea Fields
							</h3>
						</div>
						<div className="flex flex-col gap-5.5 p-6.5">
							<div>
								<label className="mb-3 block text-black dark:text-white">
									Default textarea
								</label>
								<textarea
									rows={6}
									placeholder="Default textarea"
									className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"></textarea>
							</div>

							<div>
								<label className="mb-3 block text-black dark:text-white">
									Active textarea
								</label>
								<textarea
									rows={6}
									placeholder="Active textarea"
									className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"></textarea>
							</div>

							<div>
								<label className="mb-3 block text-black dark:text-white">
									Disabled textarea
								</label>
								<textarea
									rows={6}
									disabled
									placeholder="Disabled textarea"
									className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"></textarea>
							</div>
						</div>
					</div> */}

				{/* <!-- Checkbox and radio --> */}
				{/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
						<div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
							<h3 className="font-medium text-black dark:text-white">
								Checkbox and radio
							</h3>
						</div>
						<div className="flex flex-col gap-5.5 p-6.5">
							<CheckboxOne />
							<CheckboxTwo />
							<CheckboxThree />
							<CheckboxFour />
							<CheckboxFive />
						</div>
					</div> */}

				{/* <!-- Select input --> */}
				{/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
						<div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
							<h3 className="font-medium text-black dark:text-white">
								Select input
							</h3>
						</div>
						<div className="flex flex-col gap-5.5 p-6.5">
							<SelectGroupTwo />
							<MultiSelect id="multiSelect" />
						</div>
					</div> */}
				{/* </div> */}
			</div>
			<GenerateQRAndPdf />
		</DefaultLayout>
	)
}

export default CreateUsersForm
