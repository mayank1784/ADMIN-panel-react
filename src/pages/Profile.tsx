import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '../layout/DefaultLayout'
import CoverOne from '../images/cover/cover-01.png'
import userSix from '../images/user/user-06.png'

import { useAuth } from '../components/Auth/AuthContext'
import { useRef, RefObject } from 'react'
import { storage, db } from '../services/firebase'
import { doc, setDoc } from 'firebase/firestore'
import AutoComplete from '../components/Forms/SelectGroup/AutoComplete'
import { useState } from 'react'
import React from 'react'
import { toast } from 'react-toastify'

import {
	uploadBytesResumable,
	ref,
	getDownloadURL,
	deleteObject,
} from 'firebase/storage'

const Profile = () => {
	const useref = useRef<HTMLInputElement>(null)
	const textareaRef: RefObject<HTMLTextAreaElement> = useRef(null)
	const { user, adminData } = useAuth()
	const [isLoading, setIsLoading] = useState(false)
	const [selectedValue, setSelectedValue] = useState(adminData?.city || 'DL')
	const [name, setName] = useState(adminData?.adminName || 'admin')
	const [contactDetails, setContactDetails] = useState(
		adminData?.contactDetails || '98xxxxxxxx'
	)
	const [address, setAddress] = useState(adminData?.address || 'DL')
	const [uploadProgress, setUploadProgress] = useState(0)
	const handleSelect = (selectedValue: string) => {
		setSelectedValue(selectedValue)
	}

	function getFileNameFromUrl(url: string) {
		// Split the URL by '/' and decode the last part (file name)
		const parts = decodeURIComponent(url).split('/')
		return parts[parts.length - 1].split('?')[0]
	}

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		setIsLoading(true)
		if (useref.current) {
			useref.current.value = ''
		}
		if (textareaRef.current) {
			textareaRef.current.value = ''
		}

		setIsEditing(false)
		const data = {
			adminName: name.toLowerCase(),
			contactDetails: contactDetails,
			address: address.toLowerCase(),
			city: selectedValue.toLowerCase(),
		}
		const docRef = doc(db, 'admins', adminData.adminID)
		// updateDoc(docRef, data).then((docRef) => console.log('updated'))
		await setDoc(docRef, data, { merge: true })
		console.log('updated')
		setIsLoading(false)
		toast.success('Updated', {
			position: 'top-center',
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'light',
		})
	}
	// Function to handle file selection for profile image
	const handleProfileImageChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0] || new Blob()
		// Check if a file is selected
		if (file) {
			// Check file type
			const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
			if (!allowedTypes.includes(file.type)) {
				console.error(
					'Invalid file type. Please select a valid image file (JPEG, PNG, GIF).'
				)
				return
			}
			// Check file size (max size: 500 KB)
			const maxSize = 500 * 1024 // 500 KB in bytes
			if (file.size > maxSize) {
				console.error(
					'File size exceeds the limit. Please select a file smaller than 500 KB.'
				)
				return
			}
			// Perform image upload here
			// Use Firebase Storage to upload the image
			const storageRef = ref(
				storage,
				`profile_images/${user.uid}/${file.name}`
			)
			const uploadTask = uploadBytesResumable(storageRef, file)
			// Update progress during the upload
			uploadTask.on(
				'state_changed',
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100
					setUploadProgress(progress)
				},
				(error) => {
					console.error('Error uploading image:', error)
				},
				() => {
					// On successful upload, update Firestore with the new image URL
					getDownloadURL(uploadTask.snapshot.ref).then(
						(downloadURL: string) => {
							// Delete previous image if it exists
							if (adminData.profilePhoto) {
								const previousImageRef = ref(
									storage,
									`profile_images/${
										user.uid
									}/${getFileNameFromUrl(
										adminData.profilePhoto
									)}`
								)
								deleteObject(previousImageRef)
									.then(() => {
										console.log(
											'Previous image deleted successfully'
										)
									})
									.catch((error) => {
										console.error(
											'Error deleting previous image:',
											error
										)
									})
							}
							// Update Firestore data with new image URL

							// Use Firestore to update the data

							setDoc(
								doc(db, 'admins', adminData.adminID),
								{
									profilePhoto: downloadURL,
								},
								{ merge: true }
							).then(() => {
								toast.success('Image updated', {
									position: 'top-center',
									autoClose: 3000,
									hideProgressBar: false,
									closeOnClick: true,
									pauseOnHover: true,
									draggable: true,
									progress: undefined,
									theme: 'light',
								})
							})
						}
					)
				}
			)
		}
	}

	const cityList = [
		'mumbai',
		'delhi',
		'bengaluru',
		'ahmedabad',
		'hyderabad',
		'chennai',
		'kolkata',
		'pune',
		'jaipur',
		'surat',
		'lucknow',
		'kanpur',
		'nagpur',
		'patna',
		'indore',
		'thane',
		'bhopal',
		'visakhapatnam',
		'vadodara',
		'firozabad',
		'ludhiana',
		'rajkot',
		'agra',
		'siliguri',
		'nashik',
		'faridabad',
		'patiala',
		'meerut',
		'kalyan-dombivali',
		'vasai-virar',
		'varanasi',
		'srinagar',
		'dhanbad',
		'jodhpur',
		'amritsar',
		'raipur',
		'allahabad',
		'coimbatore',
		'jabalpur',
		'gwalior',
		'vijayawada',
		'madurai',
		'guwahati',
		'chandigarh',
		'hubli-dharwad',
		'amroha',
		'moradabad',
		'gurgaon',
		'aligarh',
		'solapur',
		'ranchi',
		'jalandhar',
		'tiruchirappalli',
		'bhubaneswar',
		'salem',
		'warangal',
		'mira-bhayandar',
		'thiruvananthapuram',
		'bhiwandi',
		'saharanpur',
		'guntur',
		'amravati',
		'bikaner',
		'noida',
		'jamshedpur',
		'bhilai nagar',
		'cuttack',
		'kochi',
		'udaipur',
		'bhavnagar',
		'dehradun',
		'asansol',
		'nanded-waghala',
		'ajmer',
		'jamnagar',
		'ujjain',
		'sangli',
		'loni',
		'jhansi',
		'pondicherry',
		'nellore',
		'jammu',
		'belagavi',
		'raurkela',
		'mangaluru',
		'tirunelveli',
		'malegaon',
		'gaya',
		'tiruppur',
		'davanagere',
		'kozhikode',
		'akola',
		'kurnool',
		'bokaro steel city',
		'rajahmundry',
		'ballari',
		'agartala',
		'bhagalpur',
		'latur',
		'dhule',
		'korba',
		'bhilwara',
		'brahmapur',
		'mysore',
		'muzaffarpur',
		'ahmednagar',
		'kollam',
		'raghunathganj',
		'bilaspur',
		'shahjahanpur',
		'thrissur',
		'alwar',
		'kakinada',
		'nizamabad',
		'sagar',
		'tumkur',
		'hisar',
		'rohtak',
		'panipat',
		'darbhanga',
		'kharagpur',
		'aizawl',
		'ichalkaranji',
		'tirupati',
		'karnal',
		'bathinda',
		'rampur',
		'shivamogga',
		'ratlam',
		'modinagar',
		'durg',
		'shillong',
		'imphal',
		'hapur',
		'ranipet',
		'anantapur',
		'arrah',
		'karimnagar',
		'parbhani',
		'etawah',
		'bharatpur',
		'begusarai',
		'new delhi',
		'chhapra',
		'kadapa',
		'ramagundam',
		'pali',
		'satna',
		'vizianagaram',
		'katihar',
		'hardwar',
		'sonipat',
		'nagercoil',
		'thanjavur',
		'murwara (katni)',
		'naihati',
		'sambhal',
		'nadiad',
		'yamunanagar',
		'english bazar',
		'eluru',
		'munger',
		'panchkula',
		'raayachuru',
		'panvel',
		'deoghar',
		'ongole',
		'nandyal',
		'morena',
		'bhiwani',
		'porbandar',
		'palakkad',
		'anand',
		'purnia',
		'baharampur',
		'barmer',
		'morvi',
		'orai',
		'bahraich',
		'sikar',
		'vellore',
		'singrauli',
		'khammam',
		'mahesana',
		'silchar',
		'sambalpur',
		'rewa',
		'unnao',
		'hugli-chinsurah',
		'raiganj',
		'phusro',
		'adityapur',
		'alappuzha',
		'bahadurgarh',
		'machilipatnam',
		'rae bareli',
		'jalpaiguri',
		'bharuch',
		'pathankot',
		'hoshiarpur',
		'baramula',
		'adoni',
		'jind',
		'tonk',
		'tenali',
		'kancheepuram',
		'vapi',
		'sirsa',
		'navsari',
		'mahbubnagar',
		'puri',
		'robertson pet',
		'erode',
		'batala',
		'haldwani-cum-kathgodam',
		'vidisha',
		'saharsa',
		'thanesar',
		'chittoor',
		'veraval',
		'lakhimpur',
		'sitapur',
		'hindupur',
		'santipur',
		'balurghat',
		'ganjbasoda',
		'moga',
		'proddatur',
		'srinagar',
		'medinipur',
		'habra',
		'sasaram',
		'hajipur',
		'bhuj',
		'shivpuri',
		'ranaghat',
		'shimla',
		'tiruvannamalai',
		'kaithal',
		'rajnandgaon',
		'godhra',
		'hazaribag',
		'bhimavaram',
		'mandsaur',
		'dibrugarh',
		'kolar',
		'bankura',
		'mandya',
		'dehri-on-sone',
		'madanapalle',
		'malerkotla',
		'lalitpur',
		'bettiah',
		'pollachi',
		'khanna',
		'neemuch',
		'palwal',
		'palanpur',
		'guntakal',
		'nabadwip',
		'udupi',
		'jagdalpur',
		'motihari',
		'pilibhit',
		'dimapur',
		'mohali',
		'sadulpur',
		'rajapalayam',
		'dharmavaram',
		'kashipur',
		'sivakasi',
		'darjiling',
		'chikkamagaluru',
		'gudivada',
		'baleshwar town',
		'mancherial',
		'srikakulam',
		'adilabad',
		'yavatmal',
		'barnala',
		'nagaon',
		'narasaraopet',
		'raigarh',
		'roorkee',
		'valsad',
		'ambikapur',
		'giridih',
		'chandausi',
		'purulia',
		'patan',
		'bagaha',
		'hardoi',
		'achalpur',
		'osmanabad',
		'deesa',
		'nandurbar',
		'azamgarh',
		'ramgarh',
		'firozpur',
		'baripada town',
		'karwar',
		'siwan',
		'rajampet',
		'pudukkottai',
		'anantnag',
		'tadpatri',
		'satara',
		'bhadrak',
		'kishanganj',
		'suryapet',
		'wardha',
		'ranebennuru',
		'amreli',
		'neyveli (ts)',
		'jamalpur',
		'marmagao',
		'udgir',
		'tadepalligudem',
		'nagapattinam',
		'buxar',
		'aurangabad',
		'jehanabad',
		'phagwara',
		'khair',
		'sawai madhopur',
		'kapurthala',
		'chilakaluripet',
		'aurangabad',
		'malappuram',
		'rewari',
		'nagaur',
		'sultanpur',
		'nagda',
		'port blair',
		'lakhisarai',
		'panaji',
		'tinsukia',
		'itarsi',
		'kohima',
		'balangir',
		'nawada',
		'jharsuguda',
		'jagtial',
		'viluppuram',
		'amalner',
		'zirakpur',
		'tanda',
		'tiruchengode',
		'nagina',
		'yemmiganur',
		'vaniyambadi',
		'sarni',
		'theni allinagaram',
		'margao',
		'akot',
		'sehore',
		'mhow cantonment',
		'kot kapura',
		'makrana',
		'pandharpur',
		'miryalaguda',
		'shamli',
		'seoni',
		'ranibennur',
		'kadiri',
		'shrirampur',
		'rudrapur',
		'parli',
		'najibabad',
		'nirmal',
		'udhagamandalam',
		'shikohabad',
		'jhumri tilaiya',
		'aruppukkottai',
		'ponnani',
		'jamui',
		'sitamarhi',
		'chirala',
		'anjar',
		'karaikal',
		'hansi',
		'anakapalle',
		'mahasamund',
		'faridkot',
		'saunda',
		'dhoraji',
		'paramakudi',
		'balaghat',
		'sujangarh',
		'khambhat',
		'muktsar',
		'rajpura',
		'kavali',
		'dhamtari',
		'ashok nagar',
		'sardarshahar',
		'mahuva',
		'bargarh',
		'kamareddy',
		'sahibganj',
		'kothagudem',
		'ramanagaram',
		'gokak',
		'tikamgarh',
		'araria',
		'rishikesh',
		'shahdol',
		'medininagar (daltonganj)',
		'arakkonam',
		'washim',
		'sangrur',
		'bodhan',
		'fazilka',
		'palacole',
		'keshod',
		'sullurpeta',
		'wadhwan',
		'gurdaspur',
		'vatakara',
		'tura',
		'narnaul',
		'kharar',
		'yadgir',
		'ambejogai',
		'ankleshwar',
		'savarkundla',
		'paradip',
		'virudhachalam',
		'kanhangad',
		'kadi',
		'srivilliputhur',
		'gobindgarh',
		'tindivanam',
		'mansa',
		'taliparamba',
		'manmad',
		'tanuku',
		'rayachoti',
		'virudhunagar',
		'koyilandy',
		'jorhat',
		'karur',
		'valparai',
		'srikalahasti',
		'neyyattinkara',
		'bapatla',
		'fatehabad',
		'malout',
		'sankarankovil',
		'tenkasi',
		'ratnagiri',
		'rabkavi banhatti',
		'sikandrabad',
		'chaibasa',
		'chirmiri',
		'palwancha',
		'bhawanipatna',
		'kayamkulam',
		'pithampur',
		'nabha',
		'shahabad',
		' hardoi',
		'dhenkanal',
		'uran islampur',
		'gopalganj',
		'bongaigaon city',
		'palani',
		'pusad',
		'sopore',
		'pilkhuwa',
		'tarn taran',
		'renukoot',
		'mandamarri',
		'shahabad',
		'barbil',
		'koratla',
		'madhubani',
		'arambagh',
		'gohana',
		'ladnu',
		'pattukkottai',
		'sirsi',
		'sircilla',
		'tamluk',
		'jagraon',
		'alipurdurban agglomerationr',
		'alirajpur',
		'tandur',
		'naidupet',
		'tirupathur',
		'tohana',
		'ratangarh',
		'dhubri',
		'masaurhi',
		'visnagar',
		'vrindavan',
		'nokha',
		'nagari',
		'narwana',
		'ramanathapuram',
		'ujhani',
		'samastipur',
		'laharpur',
		'sangamner',
		'nimbahera',
		'siddipet',
		'suri',
		'diphu',
		'jhargram',
		'shirpur-warwade',
		'tilhar',
		'sindhnur',
		'udumalaipettai',
		'malkapur',
		'wanaparthy',
		'gudur',
		'kendujhar',
		'mandla',
		'mandi',
		'nedumangad',
		'north lakhimpur',
		'vinukonda',
		'tiptur',
		'gobichettipalayam',
		'sunabeda',
		'wani',
		'upleta',
		'narasapuram',
		'nuzvid',
		'tezpur',
		'una',
		'markapur',
		'sheopur',
		'thiruvarur',
		'sidhpur',
		'sahaswan',
		'suratgarh',
		'shajapur',
		'rayagada',
		'lonavla',
		'ponnur',
		'kagaznagar',
		'gadwal',
		'bhatapara',
		'kandukur',
		'sangareddy',
		'unjha',
		'lunglei',
		'karimganj',
		'kannur',
		'bobbili',
		'mokameh',
		'talegaon dabhade',
		'anjangaon',
		'mangrol',
		'sunam',
		'gangarampur',
		'thiruvallur',
		'tirur',
		'rath',
		'jatani',
		'viramgam',
		'rajsamand',
		'yanam',
		'kottayam',
		'panruti',
		'dhuri',
		'namakkal',
		'kasaragod',
		'modasa',
		'rayadurg',
		'supaul',
		'kunnamkulam',
		'umred',
		'bellampalle',
		'sibsagar',
		'mandi dabwali',
		'ottappalam',
		'dumraon',
		'samalkot',
		'jaggaiahpet',
		'goalpara',
		'tuni',
		'lachhmangarh',
		'bhongir',
		'amalapuram',
		'firozpur cantt.',
		'vikarabad',
		'thiruvalla',
		'sherkot',
		'palghar',
		'shegaon',
		'jangaon',
		'bheemunipatnam',
		'panna',
		'thodupuzha',
		'kathurban agglomeration',
		'palitana',
		'arwal',
		'venkatagiri',
		'kalpi',
		'rajgarh (churu)',
		'sattenapalle',
		'arsikere',
		'ozar',
		'thirumangalam',
		'petlad',
		'nasirabad',
		'phaltan',
		'rampurhat',
		'nanjangud',
		'forbesganj',
		'tundla',
		'bhaburban agglomeration',
		'sagara',
		'pithapuram',
		'sira',
		'bhadrachalam',
		'charkhi dadri',
		'chatra',
		'palasa kasibugga',
		'nohar',
		'yevla',
		'sirhind fatehgarh sahib',
		'bhainsa',
		'parvathipuram',
		'shahade',
		'chalakudy',
		'narkatiaganj',
		'kapadvanj',
		'macherla',
		'raghogarh-vijaypur',
		'rupnagar',
		'naugachhia',
		'sendhwa',
		'byasanagar',
		'sandila',
		'gooty',
		'salur',
		'nanpara',
		'sardhana',
		'vita',
		'gumia',
		'puttur',
		'jalandhar cantt.',
		'nehtaur',
		'changanassery',
		'mandapeta',
		'dumka',
		'seohara',
		'umarkhed',
		'madhupur',
		'vikramasingapuram',
		'punalur',
		'kendrapara',
		'sihor',
		'nellikuppam',
		'samana',
		'warora',
		'nilambur',
		'rasipuram',
		'ramnagar',
		'jammalamadugu',
		'nawanshahr',
		'thoubal',
		'athni',
		'cherthala',
		'sidhi',
		'farooqnagar',
		'peddapuram',
		'chirkunda',
		'pachora',
		'madhepura',
		'pithoragarh',
		'tumsar',
		'phalodi',
		'tiruttani',
		'rampura phul',
		'perinthalmanna',
		'padrauna',
		'pipariya',
		'dalli-rajhara',
		'punganur',
		'mattannur',
		'mathura',
		'thakurdwara',
		'nandivaram-guduvancheri',
		'mulbagal',
		'manjlegaon',
		'wankaner',
		'sillod',
		'nidadavole',
		'surapura',
		'rajagangapur',
		'sheikhpura',
		'parlakhemundi',
		'kalimpong',
		'siruguppa',
		'arvi',
		'limbdi',
		'barpeta',
		'manglaur',
		'repalle',
		'mudhol',
		'shujalpur',
		'mandvi',
		'thangadh',
		'sironj',
		'nandura',
		'shoranur',
		'nathdwara',
		'periyakulam',
		'sultanganj',
		'medak',
		'narayanpet',
		'raxaul bazar',
		'rajauri',
		'pernampattu',
		'nainital',
		'ramachandrapuram',
		'vaijapur',
		'nangal',
		'sidlaghatta',
		'punch',
		'pandhurna',
		'wadgaon road',
		'talcher',
		'varkala',
		'pilani',
		'nowgong',
		'naila janjgir',
		'mapusa',
		'vellakoil',
		'merta city',
		'sivaganga',
		'mandideep',
		'sailu',
		'vyara',
		'kovvur',
		'vadalur',
		'nawabganj',
		'padra',
		'sainthia',
		'siana',
		'shahpur',
		'sojat',
		'noorpur',
		'paravoor',
		'murtijapur',
		'ramnagar',
		'sundargarh',
		'taki',
		'saundatti-yellamma',
		'pathanamthitta',
		'wadi',
		'rameshwaram',
		'tasgaon',
		'sikandra rao',
		'sihora',
		'tiruvethipuram',
		'tiruvuru',
		'mehkar',
		'peringathur',
		'perambalur',
		'manvi',
		'zunheboto',
		'mahnar bazar',
		'attingal',
		'shahbad',
		'puranpur',
		'nelamangala',
		'nakodar',
		'lunawada',
		'murshidabad',
		'mahe',
		'lanka',
		'rudauli',
		'tuensang',
		'lakshmeshwar',
		'zira',
		'yawal',
		'thana bhawan',
		'ramdurg',
		'pulgaon',
		'sadasivpet',
		'nargund',
		'neem-ka-thana',
		'memari',
		'nilanga',
		'naharlagun',
		'pakaur',
		'wai',
		'tarikere',
		'malavalli',
		'raisen',
		'lahar',
		'uravakonda',
		'savanur',
		'sirohi',
		'udhampur',
		'umarga',
		'pratapgarh',
		'lingsugur',
		'usilampatti',
		'palia kalan',
		'wokha',
		'rajpipla',
		'vijayapura',
		'rawatbhata',
		'sangaria',
		'paithan',
		'rahuri',
		'patti',
		'zaidpur',
		'lalsot',
		'maihar',
		'vedaranyam',
		'nawapur',
		'solan',
		'vapi',
		'sanawad',
		'warisaliganj',
		'revelganj',
		'sabalgarh',
		'tuljapur',
		'simdega',
		'musabani',
		'kodungallur',
		'phulabani',
		'umreth',
		'narsipatnam',
		'nautanwa',
		'rajgir',
		'yellandu',
		'sathyamangalam',
		'pilibanga',
		'morshi',
		'pehowa',
		'sonepur',
		'pappinisseri',
		'zamania',
		'mihijam',
		'purna',
		'puliyankudi',
		'shikarpur',
		' bulandshahr',
		'umaria',
		'porsa',
		'naugawan sadat',
		'fatehpur sikri',
		'manuguru',
		'udaipur',
		'pipar city',
		'pattamundai',
		'nanjikottai',
		'taranagar',
		'yerraguntla',
		'satana',
		'sherghati',
		'sankeshwara',
		'madikeri',
		'thuraiyur',
		'sanand',
		'rajula',
		'kyathampalle',
		'shahabad',
		' rampur',
		'tilda newra',
		'narsinghgarh',
		'chittur-thathamangalam',
		'malaj khand',
		'sarangpur',
		'robertsganj',
		'sirkali',
		'radhanpur',
		'tiruchendur',
		'utraula',
		'patratu',
		'vijainagar',
		' ajmer',
		'periyasemur',
		'pathri',
		'sadabad',
		'talikota',
		'sinnar',
		'mungeli',
		'sedam',
		'shikaripur',
		'sumerpur',
		'sattur',
		'sugauli',
		'lumding',
		'vandavasi',
		'titlagarh',
		'uchgaon',
		'mokokchung',
		'paschim punropara',
		'sagwara',
		'ramganj mandi',
		'tarakeswar',
		'mahalingapura',
		'dharmanagar',
		'mahemdabad',
		'manendragarh',
		'uran',
		'tharamangalam',
		'tirukkoyilur',
		'pen',
		'makhdumpur',
		'maner',
		'oddanchatram',
		'palladam',
		'mundi',
		'nabarangapur',
		'mudalagi',
		'samalkha',
		'nepanagar',
		'karjat',
		'ranavav',
		'pedana',
		'pinjore',
		'lakheri',
		'pasan',
		'puttur',
		'vadakkuvalliyur',
		'tirukalukundram',
		'mahidpur',
		'mussoorie',
		'muvattupuzha',
		'rasra',
		'udaipurwati',
		'manwath',
		'adoor',
		'uthamapalayam',
		'partur',
		'nahan',
		'ladwa',
		'mankachar',
		'nongstoin',
		'losal',
		'sri madhopur',
		'ramngarh',
		'mavelikkara',
		'rawatsar',
		'rajakhera',
		'lar',
		'lal gopalganj nindaura',
		'muddebihal',
		'sirsaganj',
		'shahpura',
		'surandai',
		'sangole',
		'pavagada',
		'tharad',
		'mansa',
		'umbergaon',
		'mavoor',
		'nalbari',
		'talaja',
		'malur',
		'mangrulpir',
		'soro',
		'shahpura',
		'vadnagar',
		'raisinghnagar',
		'sindhagi',
		'sanduru',
		'sohna',
		'manavadar',
		'pihani',
		'safidon',
		'risod',
		'rosera',
		'sankari',
		'malpura',
		'sonamukhi',
		'shamsabad',
		' agra',
		'nokha',
		'pandurban agglomeration',
		'mainaguri',
		'afzalpur',
		'shirur',
		'salaya',
		'shenkottai',
		'pratapgarh',
		'vadipatti',
		'nagarkurnool',
		'savner',
		'sasvad',
		'rudrapur',
		'soron',
		'sholingur',
		'pandharkaoda',
		'perumbavoor',
		'maddur',
		'nadbai',
		'talode',
		'shrigonda',
		'madhugiri',
		'tekkalakote',
		'seoni-malwa',
		'shirdi',
		'surban agglomerationr',
		'terdal',
		'raver',
		'tirupathur',
		'taraori',
		'mukhed',
		'manachanallur',
		'rehli',
		'sanchore',
		'rajura',
		'piro',
		'mudabidri',
		'vadgaon kasba',
		'nagar',
		'vijapur',
		'viswanatham',
		'polur',
		'panagudi',
		'manawar',
		'tehri',
		'samdhan',
		'pardi',
		'rahatgarh',
		'panagar',
		'uthiramerur',
		'tirora',
		'rangia',
		'sahjanwa',
		'wara seoni',
		'magadi',
		'rajgarh (alwar)',
		'rafiganj',
		'tarana',
		'rampur maniharan',
		'sheoganj',
		'raikot',
		'pauri',
		'sumerpur',
		'navalgund',
		'shahganj',
		'marhaura',
		'tulsipur',
		'sadri',
		'thiruthuraipoondi',
		'shiggaon',
		'pallapatti',
		'mahendragarh',
		'sausar',
		'ponneri',
		'mahad',
		'lohardaga',
		'tirwaganj',
		'margherita',
		'sundarnagar',
		'rajgarh',
		'mangaldoi',
		'renigunta',
		'longowal',
		'ratia',
		'lalgudi',
		'shrirangapattana',
		'niwari',
		'natham',
		'unnamalaikadai',
		'purqurban agglomerationzi',
		'shamsabad',
		' farrukhabad',
		'mirganj',
		'todaraisingh',
		'warhapur',
		'rajam',
		'urmar tanda',
		'lonar',
		'powayan',
		'p.n.patti',
		'palampur',
		'srisailam project (right flank colony) township',
		'sindagi',
		'sandi',
		'vaikom',
		'malda',
		'tharangambadi',
		'sakaleshapura',
		'lalganj',
		'malkangiri',
		'rapar',
		'mauganj',
		'todabhim',
		'srinivaspur',
		'murliganj',
		'reengus',
		'sawantwadi',
		'tittakudi',
		'lilong',
		'rajaldesar',
		'pathardi',
		'achhnera',
		'pacode',
		'naraura',
		'nakur',
		'palai',
		'morinda',
		' india',
		'manasa',
		'nainpur',
		'sahaspur',
		'pauni',
		'prithvipur',
		'ramtek',
		'silapathar',
		'songadh',
		'safipur',
		'sohagpur',
		'mul',
		'sadulshahar',
		'phillaur',
		'sambhar',
		'prantij',
		'nagla',
		'pattran',
		'mount abu',
		'reoti',
		'tenu dam-cum-kathhara',
		'panchla',
		'sitarganj',
		'pasighat',
		'motipur',
		"o' valley",
		'raghunathpur',
		'suriyampalayam',
		'qadian',
		'rairangpur',
		'silvassa',
		'nowrozabad (khodargama)',
		'mangrol',
		'soyagaon',
		'sujanpur',
		'manihari',
		'sikanderpur',
		'mangalvedhe',
		'phulera',
		'ron',
		'sholavandan',
		'saidpur',
		'shamgarh',
		'thammampatti',
		'maharajpur',
		'multai',
		'mukerian',
		'sirsi',
		'purwa',
		'sheohar',
		'namagiripettai',
		'parasi',
		'lathi',
		'lalganj',
		'narkhed',
		'mathabhanga',
		'shendurjana',
		'peravurani',
		'mariani',
		'phulpur',
		'rania',
		'pali',
		'pachore',
		'parangipettai',
		'pudupattinam',
		'panniyannur',
		'maharajganj',
		'rau',
		'monoharpur',
		'mandawa',
		'marigaon',
		'pallikonda',
		'pindwara',
		'shishgarh',
		'patur',
		'mayang imphal',
		'mhowgaon',
		'guruvayoor',
		'mhaswad',
		'sahawar',
		'sivagiri',
		'mundargi',
		'punjaipugalur',
		'kailasahar',
		'samthar',
		'sakti',
		'sadalagi',
		'silao',
		'mandalgarh',
		'loha',
		'pukhrayan',
		'padmanabhapuram',
		'belonia',
		'saiha',
		'srirampore',
		'talwara',
		'puthuppally',
		'khowai',
		'vijaypur',
		'takhatgarh',
		'thirupuvanam',
		'adra',
		'piriyapatna',
		'obra',
		'adalaj',
		'nandgaon',
		'barh',
		'chhapra',
		'panamattom',
		'niwai',
		'bageshwar',
		'tarbha',
		'adyar',
		'narsinghgarh',
		'warud',
		'asarganj',
		'sarsod',
	]
	const [isEditMode, setIsEditing] = useState(false)

	// Handle the edit button click
	const handleEditClick = () => {
		setIsEditing(!isEditMode)
	}
	return (
		<DefaultLayout>
			<Breadcrumb pageName="Profile" />

			<div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
				<div className="relative z-20 h-35 md:h-65">
					<img
						src={CoverOne}
						alt="profile cover"
						className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
					/>
					<div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
						<label
							htmlFor="cover"
							className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary py-1 px-2 text-sm font-medium text-white hover:bg-opacity-90 xsm:px-4">
							<input
								type="file"
								name="cover"
								id="cover"
								className="sr-only"
							/>
							<span>
								<svg
									className="fill-current"
									width="14"
									height="14"
									viewBox="0 0 14 14"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
										fill="white"
									/>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M6.99992 5.83329C6.03342 5.83329 5.24992 6.61679 5.24992 7.58329C5.24992 8.54979 6.03342 9.33329 6.99992 9.33329C7.96642 9.33329 8.74992 8.54979 8.74992 7.58329C8.74992 6.61679 7.96642 5.83329 6.99992 5.83329ZM4.08325 7.58329C4.08325 5.97246 5.38909 4.66663 6.99992 4.66663C8.61075 4.66663 9.91659 5.97246 9.91659 7.58329C9.91659 9.19412 8.61075 10.5 6.99992 10.5C5.38909 10.5 4.08325 9.19412 4.08325 7.58329Z"
										fill="white"
									/>
								</svg>
							</span>
							<span>Edit</span>
						</label>
					</div>
				</div>
				<div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
					<div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
						<div className="relative drop-shadow-2">
							<img
								src={
									adminData && adminData.profilePhoto
										? adminData.profilePhoto
										: userSix
								}
								alt="profile"
								className="rounded-full w-full h-30 object-center"
							/>
							<label
								htmlFor="profile"
								className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2">
								{/* <svg
									className="fill-current"
									width="14"
									height="14"
									viewBox="0 0 14 14"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
										fill=""
									/>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
										fill=""
									/>
								</svg> */}
								<input
									type="file"
									name="profile"
									id="profile"
									className="sr-only"
									disabled={!isEditMode}
									onChange={handleProfileImageChange}
								/>
								{uploadProgress > 0 && uploadProgress < 100 ? (
									// Show upload progress if not complete
									<div className="text-2xl z-99 text-black items-center">{`${uploadProgress.toFixed(
										2
									)}%`}</div>
								) : (
									<svg
										className="fill-current"
										width="14"
										height="14"
										viewBox="0 0 14 14"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
											fill=""
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
											fill=""
										/>
									</svg>
								)}
							</label>
						</div>
					</div>
					<div className="mt-4">
						<h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
							{adminData && adminData.profilePhoto
								? adminData.adminName
										.toLowerCase()
										.replace(
											/(?:^|\s)\w/g,
											(match: string) =>
												match.toUpperCase()
										)
								: 'Admin'}
						</h3>
						<p className="font-medium">Admin</p>

						<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
							<div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center justify-between">
								<h2 className="font-semibold text-xl text-black dark:text-white">
									Profile
								</h2>
								<button
									className="text-white bg-blue-500 px-4 py-2 rounded"
									onClick={handleEditClick}
									disabled={isEditMode}>
									{isLoading
										? 'Updating...'
										: isEditMode
										? 'Editing...'
										: 'Edit'}
								</button>
							</div>
							{/* <form action="#"> */}
							<form onSubmit={handleSubmit}>
								<div className="p-6.5">
									<div className="mb-4.5">
										<label className="mb-2.5 block text-black dark:text-white text-left">
											Name
										</label>
										<input
											type="text"
											ref={useref}
											onChange={(e) =>
												setName(e.target.value)
											}
											placeholder={
												adminData && adminData.adminName
													? adminData.adminName
													: 'Not fetched'
											}
											className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
											disabled={!isEditMode}
										/>
									</div>

									<div className="mb-4.5">
										<label className="mb-2.5 block text-black dark:text-white text-left">
											Email{' '}
											<span className="text-meta-1">
												*
											</span>
										</label>
										<input
											type="email"
											placeholder={user.email}
											className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
											disabled
										/>
									</div>

									<div className="mb-4.5">
										<label className="mb-2.5 block text-black dark:text-white text-left">
											Mobile No.
										</label>
										<input
											type="text"
											ref={useref}
											onChange={(e) =>
												setContactDetails(
													e.target.value
												)
											}
											placeholder={
												adminData &&
												adminData.contactDetails
													? adminData.contactDetails
													: 'NA'
											}
											className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
											disabled={!isEditMode}
										/>
									</div>

									<div className="mb-4.5">
										<AutoComplete
											data={cityList}
											label="City"
											onSelect={handleSelect}
											disabled={!isEditMode}
											placeholder={
												adminData && adminData.city
													? adminData.city
													: 'NA'
											}
										/>
									</div>
									<div className="mb-6">
										<label className="mb-2.5 block text-black dark:text-white text-left">
											Address
										</label>
										<textarea
											ref={textareaRef}
											onChange={(e) =>
												setAddress(e.target.value)
											}
											disabled={!isEditMode}
											rows={3}
											placeholder={
												adminData && adminData.address
													? adminData.address
													: 'NA'
											}
											className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"></textarea>
									</div>
									{isLoading && (
										<div
											className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-opacity-50 bg-gray-800"
											style={{ zIndex: 1000 }}>
											{/* You can customize the loader appearance */}
											<div
												className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
												role="status">
												<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
													Loading...
												</span>
											</div>
										</div>
									)}
									<button
										type="submit"
										className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:bg-opacity-50"
										disabled={
											!isEditMode ||
											(uploadProgress > 0 &&
												uploadProgress < 100) ||
											isLoading
										}>
										Update
									</button>
								</div>
							</form>
							{/* </form> */}
						</div>

						{/* <div className="mx-auto mt-4.5 mb-5.5 grid max-w-94 grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
							<div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
								<span className="font-semibold text-black dark:text-white">
									259
								</span>
								<span className="text-sm">Posts</span>
							</div>
							<div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
								<span className="font-semibold text-black dark:text-white">
									129K
								</span>
								<span className="text-sm">Followers</span>
							</div>
							<div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
								<span className="font-semibold text-black dark:text-white">
									2K
								</span>
								<span className="text-sm">Following</span>
							</div>
						</div>

						<div className="mx-auto max-w-180">
							<h4 className="font-semibold text-black dark:text-white">
								About Me
							</h4>
							<p className="mt-4.5">
								Lorem ipsum dolor sit amet, consectetur
								adipiscing elit. Pellentesque posuere fermentum
								urna, eu condimentum mauris tempus ut. Donec
								fermentum blandit aliquet. Etiam dictum dapibus
								ultricies. Sed vel aliquet libero. Nunc a augue
								fermentum, pharetra ligula sed, aliquam lacus.
							</p>
						</div>

						<div className="mt-6.5">
							<h4 className="mb-3.5 font-medium text-black dark:text-white">
								Follow me on
							</h4>
							<div className="flex items-center justify-center gap-3.5">
								<Link
									to="#"
									className="hover:text-primary"
									aria-label="social-icon">
									<svg
										className="fill-current"
										width="22"
										height="22"
										viewBox="0 0 22 22"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<g clipPath="url(#clip0_30_966)">
											<path
												d="M12.8333 12.375H15.125L16.0416 8.70838H12.8333V6.87504C12.8333 5.93088 12.8333 5.04171 14.6666 5.04171H16.0416V1.96171C15.7428 1.92229 14.6144 1.83337 13.4227 1.83337C10.934 1.83337 9.16663 3.35229 9.16663 6.14171V8.70838H6.41663V12.375H9.16663V20.1667H12.8333V12.375Z"
												fill=""
											/>
										</g>
										<defs>
											<clipPath id="clip0_30_966">
												<rect
													width="22"
													height="22"
													fill="white"
												/>
											</clipPath>
										</defs>
									</svg>
								</Link>
								<Link
									to="#"
									className="hover:text-primary"
									aria-label="social-icon">
									<svg
										className="fill-current"
										width="23"
										height="22"
										viewBox="0 0 23 22"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<g clipPath="url(#clip0_30_970)">
											<path
												d="M20.9813 5.18472C20.2815 5.49427 19.5393 5.69757 18.7795 5.78789C19.5804 5.30887 20.1798 4.55498 20.4661 3.66672C19.7145 4.11405 18.8904 4.42755 18.0315 4.59714C17.4545 3.97984 16.6898 3.57044 15.8562 3.43259C15.0225 3.29474 14.1667 3.43617 13.4218 3.83489C12.6768 4.2336 12.0845 4.86726 11.7368 5.63736C11.3891 6.40746 11.3056 7.27085 11.4993 8.0933C9.97497 8.0169 8.48376 7.62078 7.12247 6.93066C5.76118 6.24054 4.56024 5.27185 3.59762 4.08747C3.25689 4.67272 3.07783 5.33801 3.07879 6.01522C3.07879 7.34439 3.75529 8.51864 4.78379 9.20614C4.17513 9.18697 3.57987 9.0226 3.04762 8.72672V8.77439C3.04781 9.65961 3.35413 10.5175 3.91465 11.2027C4.47517 11.8878 5.2554 12.3581 6.12304 12.5336C5.55802 12.6868 4.96557 12.7093 4.39054 12.5996C4.63517 13.3616 5.11196 14.028 5.75417 14.5055C6.39637 14.983 7.17182 15.2477 7.97196 15.2626C7.17673 15.8871 6.2662 16.3488 5.29243 16.6212C4.31866 16.8936 3.30074 16.9714 2.29688 16.8502C4.04926 17.9772 6.08921 18.5755 8.17271 18.5735C15.2246 18.5735 19.081 12.7316 19.081 7.66522C19.081 7.50022 19.0765 7.33339 19.0691 7.17022C19.8197 6.62771 20.4676 5.95566 20.9822 5.18564L20.9813 5.18472Z"
												fill=""
											/>
										</g>
										<defs>
											<clipPath id="clip0_30_970">
												<rect
													width="22"
													height="22"
													fill="white"
													transform="translate(0.666138)"
												/>
											</clipPath>
										</defs>
									</svg>
								</Link>
								<Link
									to="#"
									className="hover:text-primary"
									aria-label="social-icon">
									<svg
										className="fill-current"
										width="23"
										height="22"
										viewBox="0 0 23 22"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<g clipPath="url(#clip0_30_974)">
											<path
												d="M6.69548 4.58327C6.69523 5.0695 6.50185 5.53572 6.15786 5.87937C5.81387 6.22301 5.34746 6.41593 4.86123 6.41569C4.375 6.41545 3.90878 6.22206 3.56513 5.87807C3.22149 5.53408 3.02857 5.06767 3.02881 4.58144C3.02905 4.09521 3.22244 3.62899 3.56643 3.28535C3.91042 2.9417 4.37683 2.74878 4.86306 2.74902C5.34929 2.74927 5.81551 2.94265 6.15915 3.28664C6.5028 3.63063 6.69572 4.09704 6.69548 4.58327ZM6.75048 7.77327H3.08381V19.2499H6.75048V7.77327ZM12.5438 7.77327H8.89548V19.2499H12.5071V13.2274C12.5071 9.87244 16.8796 9.56077 16.8796 13.2274V19.2499H20.5005V11.9808C20.5005 6.32494 14.0288 6.53577 12.5071 9.31327L12.5438 7.77327Z"
												fill=""
											/>
										</g>
										<defs>
											<clipPath id="clip0_30_974">
												<rect
													width="22"
													height="22"
													fill="white"
													transform="translate(0.333862)"
												/>
											</clipPath>
										</defs>
									</svg>
								</Link>
								<Link
									to="#"
									className="hover:text-primary"
									aria-label="social-icon">
									<svg
										className="fill-current"
										width="22"
										height="22"
										viewBox="0 0 22 22"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<g clipPath="url(#clip0_30_978)">
											<path
												d="M18.3233 10.6077C18.2481 9.1648 17.7463 7.77668 16.8814 6.61929C16.6178 6.90312 16.3361 7.16951 16.038 7.41679C15.1222 8.17748 14.0988 8.79838 13.0011 9.25929C13.1542 9.58013 13.2945 9.89088 13.4182 10.1842V10.187C13.4531 10.2689 13.4867 10.3514 13.519 10.4345C14.9069 10.2786 16.3699 10.3355 17.788 10.527C17.9768 10.5527 18.1546 10.5802 18.3233 10.6077ZM9.72038 3.77854C10.6137 5.03728 11.4375 6.34396 12.188 7.69271C13.3091 7.25088 14.2359 6.69354 14.982 6.07296C15.2411 5.8595 15.4849 5.62824 15.7117 5.38088C14.3926 4.27145 12.7237 3.66426 11 3.66671C10.5711 3.66641 10.1429 3.70353 9.72038 3.77762V3.77854ZM3.89862 9.16396C4.52308 9.1482 5.1468 9.11059 5.76863 9.05121C7.27163 8.91677 8.7618 8.66484 10.2255 8.29771C9.46051 6.96874 8.63463 5.67578 7.75046 4.42296C6.80603 4.89082 5.97328 5.55633 5.30868 6.37435C4.64409 7.19236 4.16319 8.14374 3.89862 9.16396ZM5.30113 15.6155C5.65679 15.0957 6.12429 14.5109 6.74488 13.8747C8.07771 12.5089 9.65071 11.4455 11.4712 10.8589L11.528 10.8424C11.3768 10.5087 11.2347 10.2108 11.0917 9.93029C9.40871 10.4207 7.63588 10.7269 5.86946 10.8855C5.00779 10.9634 4.23504 10.9973 3.66671 11.0028C3.66509 12.6827 4.24264 14.3117 5.30204 15.6155H5.30113ZM13.7546 17.7971C13.4011 16.0144 12.9008 14.2641 12.2586 12.5639C10.4235 13.2303 8.96138 14.2047 7.83113 15.367C7.375 15.8276 6.97021 16.3362 6.62388 16.8841C7.88778 17.8272 9.42308 18.3356 11 18.3334C11.9441 18.3347 12.8795 18.1533 13.7546 17.799V17.7971ZM15.4715 16.8117C16.9027 15.7115 17.8777 14.1219 18.2096 12.3475C17.898 12.2696 17.5029 12.1917 17.0684 12.1312C16.1023 11.9921 15.1221 11.9819 14.1534 12.101C14.6988 13.6399 15.1392 15.2141 15.4715 16.8126V16.8117ZM11 20.1667C5.93729 20.1667 1.83337 16.0628 1.83337 11C1.83337 5.93729 5.93729 1.83337 11 1.83337C16.0628 1.83337 20.1667 5.93729 20.1667 11C20.1667 16.0628 16.0628 20.1667 11 20.1667Z"
												fill=""
											/>
										</g>
										<defs>
											<clipPath id="clip0_30_978">
												<rect
													width="22"
													height="22"
													fill="white"
												/>
											</clipPath>
										</defs>
									</svg>
								</Link>
								<Link
									to="#"
									className="hover:text-primary"
									aria-label="social-icon">
									<svg
										className="fill-current"
										width="23"
										height="22"
										viewBox="0 0 23 22"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<g clipPath="url(#clip0_30_982)">
											<path
												d="M11.6662 1.83337C6.6016 1.83337 2.49951 5.93546 2.49951 11C2.49847 12.9244 3.10343 14.8002 4.22854 16.3613C5.35366 17.9225 6.94181 19.0897 8.76768 19.6974C9.22602 19.7771 9.39743 19.5021 9.39743 19.261C9.39743 19.0438 9.38552 18.3224 9.38552 17.5542C7.08285 17.9786 6.48701 16.9932 6.30368 16.4771C6.2001 16.2131 5.75368 15.4 5.3641 15.1819C5.04326 15.0105 4.58493 14.586 5.35218 14.575C6.07451 14.5631 6.58968 15.2396 6.76201 15.5146C7.58701 16.9006 8.90518 16.511 9.43135 16.2709C9.51202 15.675 9.75218 15.2745 10.0162 15.0453C7.9766 14.8161 5.84535 14.025 5.84535 10.5188C5.84535 9.52146 6.2001 8.69737 6.78493 8.05479C6.69326 7.82562 6.37243 6.88604 6.8766 5.62562C6.8766 5.62562 7.64385 5.38546 9.39743 6.56612C10.1437 6.35901 10.9147 6.25477 11.6891 6.25629C12.4683 6.25629 13.2474 6.35896 13.9808 6.56521C15.7334 5.37354 16.5016 5.62654 16.5016 5.62654C17.0058 6.88696 16.6849 7.82654 16.5933 8.05571C17.1772 8.69737 17.5329 9.51046 17.5329 10.5188C17.5329 14.037 15.3906 14.8161 13.351 15.0453C13.6829 15.3313 13.9698 15.8813 13.9698 16.7411C13.9698 17.9667 13.9579 18.9521 13.9579 19.262C13.9579 19.5021 14.1302 19.7881 14.5885 19.6965C16.4081 19.0821 17.9893 17.9126 19.1094 16.3526C20.2296 14.7926 20.8323 12.9206 20.8329 11C20.8329 5.93546 16.7308 1.83337 11.6662 1.83337Z"
												fill=""
											/>
										</g>
										<defs>
											<clipPath id="clip0_30_982">
												<rect
													width="22"
													height="22"
													fill="white"
													transform="translate(0.666138)"
												/>
											</clipPath>
										</defs>
									</svg>
								</Link>
							</div>
						</div> */}
					</div>
				</div>
			</div>
		</DefaultLayout>
	)
}

export default Profile
