import React, { useEffect, useRef, useState } from 'react'
import mainImg from './images/mainImg.jpg'
import one from './images/1.jpg'
import two from './images/2.jpg'
import three from './images/3.jpg'
import four from './images/4.jpg'
import cameraImg from './images/Camera.png'
import flagImg from './images/flag.png'
import bikiniImg from './images/bikini.jpg'
import pokerImg from './images/poker.png'
import partyImg from './images/party.png'
import toplessImg from './images/topless.png'
import notePencilImg from './images/NotePencil.png'
import deleteImg from './images/delete.png'
import './view.css'

const confidenceOptions = ['Comfortable', 'Confident', 'Very Confident']
const eventsOptions = ['0-5 events', '6-15 events', '16-30 events', '30+ events']
const confidenceToBars = {
  Comfortable: 1,
  Confident: 2,
  'Very Confident': 3
}

const countryOptions = [
  'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'China', 'Denmark', 'Egypt', 'Finland', 'France',
  'Germany', 'Greece', 'India', 'Indonesia', 'Ireland', 'Italy', 'Japan', 'Malaysia', 'Mexico', 'Netherlands',
  'New Zealand', 'Norway', 'Philippines', 'Portugal', 'Singapore', 'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland',
  'Thailand', 'Turkey', 'United Arab Emirates', 'United Kingdom', 'United States', 'Vietnam'
]

const languageOptions = [
  'Arabic', 'Bengali', 'Chinese', 'Dutch', 'English', 'French', 'German', 'Greek', 'Hindi', 'Indonesian',
  'Italian', 'Japanese', 'Korean', 'Malay', 'Mandarin', 'Portuguese', 'Punjabi', 'Russian', 'Spanish', 'Thai',
  'Turkish', 'Urdu', 'Vietnamese'
]

const bodyTypeOptions = ['Slim', 'Athletic', 'Curvy', 'Average', 'Petite', 'Tall', 'Plus Size', 'Pocket Rocket']

const availabilityDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const availabilitySlots = ['Morning', 'Afternoon', 'Evening']

const getTodayStart = () => {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth(), today.getDate())
}

const formatDateLabel = (date) =>
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

const createMonthDates = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  return Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1))
}

const readStoredValue = (key, fallback) => {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const storedValue = window.localStorage.getItem(key)

    return storedValue ? JSON.parse(storedValue) : fallback
  } catch {
    return fallback
  }
}

const writeStoredValue = (key, value) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

const EventStaffProfile = () => {
  const [mainImageSrc, setMainImageSrc] = useState(mainImg)
  const [isRatesEditorOpen, setIsRatesEditorOpen] = useState(false)
  const [isTopSkillsEditorOpen, setIsTopSkillsEditorOpen] = useState(false)
  const [isCertificationsEditorOpen, setIsCertificationsEditorOpen] = useState(false)
  const [isAdditionalInfoEditorOpen, setIsAdditionalInfoEditorOpen] = useState(false)
  const [isAvailabilityEditorOpen, setIsAvailabilityEditorOpen] = useState(false)
  const [availabilityEditorStep, setAvailabilityEditorStep] = useState('schedule')
  const [availabilityMonthOffset, setAvailabilityMonthOffset] = useState(0)
  const [isAboutMeEditorOpen, setIsAboutMeEditorOpen] = useState(false)
  const [isLanguagePickerOpen, setIsLanguagePickerOpen] = useState(false)
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const [languageSearch, setLanguageSearch] = useState('')
  const [isPublicVisible, setIsPublicVisible] = useState(() => readStoredValue('party-hostess-public-visible', true))
  const [isInstantBook, setIsInstantBook] = useState(() => readStoredValue('party-hostess-instant-book', true))
  const [aboutMeText, setAboutMeText] = useState(() =>
    '🔥✨ I\'m an experienced event staffer who knows how to turn up the energy and keep the vibes flowing. As an atmosphere model, I\'m confident, social, and great at engaging guests — whether it\'s a classy cocktail event or a wild private party 🎉🍾\n\n💃🏆 I\'ve also worked as a golf caddy at premium events, blending professionalism with personality. I\'m organised, upbeat, and always ready with a smile (and a little charm) to keep things running smoothly 😊✨\n\n🍾🔥 As a topless waitress, I bring fun, confidence, and a polished attitude to adult-themed events. Always respectful, reliable, and easy to work with — I\'m here to help make your event unforgettable 😉✨'
  )
  const [draftAboutMeText, setDraftAboutMeText] = useState('')
  const [reviewRating, setReviewRating] = useState(() => readStoredValue('party-hostess-review-rating', 5))

  const photoInputRef = useRef(null)
  const voiceNoteInputRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const [isVoiceNoteModalOpen, setIsVoiceNoteModalOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [recordedAudio, setRecordedAudio] = useState(null)
  const [recordingTimerInterval, setRecordingTimerInterval] = useState(null)
  const [deleteConfirmImage, setDeleteConfirmImage] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [thumbnailImages, setThumbnailImages] = useState([one, two, three, four])
  const skillImageMap = {
    'Bikini/Lingerie': bikiniImg,
    'Poker Dealer': pokerImg,
    'Party Hostess': partyImg,
    'Topless Waitress': toplessImg
  }

  const [reviews] = useState([
    {
      id: 1,
      name: 'Nicole M.',
      image: one,
      stars: 5,
      message: 'Samantha is an absolute delight! Her presence elevates every event and she makes everything run smoothly.'
    },
    {
      id: 2,
      name: 'Amelia R.',
      image: one,
      stars: 5,
      message: 'Her energy and professionalism are unmatched. Samantha really knows how to engage guests and create a welcoming atmosphere.'
    },
    {
      id: 3,
      name: 'Emily Carter',
      image: one,
      stars: 5,
      message: 'Sarah was fantastic to work with! She was incredibly organized, and the entire event ran smoothly. She made sure I had everything I needed and was always available for any questions. One of the best event organizers I\'ve worked with!'
    }
  ])

  const [rateOptions, setRateOptions] = useState(() => readStoredValue('party-hostess-rate-options', [
    { id: 1, service: 'Atmosphere Model', selected: true, confidence: 'Confident', eventsRange: '6-15 events', price: 150, unit: 'hr' },
    { id: 2, service: 'DJ', selected: true, confidence: 'Confident', eventsRange: '6-15 events', price: 150, unit: 'hr' },
    { id: 3, service: 'Bikini Waitress', selected: true, confidence: 'Confident', eventsRange: '6-15 events', price: 150, unit: 'hr' },
    { id: 4, service: 'Photographer', selected: true, confidence: 'Confident', eventsRange: '6-15 events', price: 120, unit: 'hr' },
    { id: 5, service: 'Grid Girl', selected: false, confidence: 'Confident', eventsRange: '6-15 events', price: 200, unit: 'hr' },
    { id: 6, service: 'Ring Girl', selected: false, confidence: 'Confident', eventsRange: '6-15 events', price: 75, unit: 'hr' },
    { id: 7, service: 'Topless Waitress', selected: false, confidence: 'Confident', eventsRange: '6-15 events', price: 250, unit: 'hr' },
    { id: 8, service: 'Poker Dealer', selected: false, confidence: 'Confident', eventsRange: '6-15 events', price: 50, unit: 'hr' },
    { id: 9, service: 'Atmosphere model', selected: false, confidence: 'Confident', eventsRange: '6-15 events', price: 600, unit: 'day', label: 'Day Rate' }
  ]))
  const [draftRateOptions, setDraftRateOptions] = useState([])

  const [topSkillOptionsState, setTopSkillOptionsState] = useState(() => readStoredValue('party-hostess-top-skills', [
    { id: 1, name: 'Bikini/Lingerie', selected: false },
    { id: 2, name: 'Poker Dealer', selected: true },
    { id: 3, name: 'Party Hostess', selected: true },
    { id: 4, name: 'Topless Waitress', selected: true },
    { id: 5, name: 'Brand Promotion', selected: true }
  ]))
  const [draftTopSkillOptions, setDraftTopSkillOptions] = useState([])

  const [certificationOptions, setCertificationOptions] = useState(() => readStoredValue('party-hostess-certifications', [
    { id: 1, name: 'RSA - Responsible Service of Alcohol', selected: true },
    { id: 2, name: 'First Aid Certificate', selected: true },
    { id: 3, name: 'CPR Certificate', selected: true },
    { id: 4, name: 'RCG - Responsible Conduct of Gambling', selected: true },
    { id: 5, name: 'Food Handling Certificate', selected: false },
    { id: 6, name: 'Bar Operations / Hospitality Certificate', selected: false, optional: true },
    { id: 7, name: 'Manual Handling Certificate', selected: false, optional: true }
  ]))
  const [draftCertificationOptions, setDraftCertificationOptions] = useState([])

  const defaultDayAvailability = {
    Monday: ['Afternoon', 'Evening'],
    Tuesday: ['Morning', 'Afternoon', 'Evening'],
    Wednesday: ['Morning', 'Afternoon', 'Evening'],
    Thursday: ['Morning', 'Afternoon', 'Evening'],
    Friday: ['Afternoon', 'Evening'],
    Saturday: ['Evening'],
    Sunday: ['Evening']
  }

  const todayStart = getTodayStart()
  const viewedMonth = new Date(todayStart.getFullYear(), todayStart.getMonth() + availabilityMonthOffset, 1)
  const viewedMonthDates = createMonthDates(viewedMonth.getFullYear(), viewedMonth.getMonth())
  const viewedMonthFirstDay = viewedMonthDates[0]
  const viewedMonthLastDay = viewedMonthDates[viewedMonthDates.length - 1]
  const viewedMonthLabel = viewedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const [savedDayAvailability, setSavedDayAvailability] = useState(() => readStoredValue('party-hostess-day-availability', defaultDayAvailability))
  const [draftDayAvailability, setDraftDayAvailability] = useState(defaultDayAvailability)
  const [savedAvailableDateKeys, setSavedAvailableDateKeys] = useState(() => readStoredValue('party-hostess-available-dates', [todayStart.toDateString()]))
  const [draftAvailableDateKeys, setDraftAvailableDateKeys] = useState([todayStart.toDateString()])

  const [additionalInfo, setAdditionalInfo] = useState(() => readStoredValue('party-hostess-additional-info', {
    countryOfOrigin: 'Australia',
    languagesSpoken: ['English'],
    bodyType: 'Athletic'
  }))
  const [draftAdditionalInfo, setDraftAdditionalInfo] = useState({
    countryOfOrigin: 'Australia',
    languagesSpoken: ['English'],
    bodyType: 'Athletic'
  })

  const [careerHighlights] = useState([
    { number: 56, label: 'Completed Jobs', color: '#E0FFE7' },
    { number: 12, label: 'Cancelled Jobs', color: '#FFFBE0' },
    { number: 8, label: 'No Show', color: '#FFF1F2' }
  ])

  const completionRate = 94

  const rates = rateOptions
    .filter((option) => option.selected)
    .map((option) => ({
      id: option.id,
      service: option.service,
      price: `$${option.price}/${option.unit}`,
      confidence: option.confidence,
      experience: confidenceToBars[option.confidence] || 3,
      eventsText: option.eventsRange,
      accentColor: '#ef195f'
    }))

  const openRatesEditor = () => {
    setDraftRateOptions(rateOptions)
    setIsRatesEditorOpen(true)
  }

  const closeRatesEditor = () => {
    setIsRatesEditorOpen(false)
  }

  const handleDraftRateToggle = (id) => {
    setDraftRateOptions((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              selected: !item.selected
            }
          : item
      )
    )
  }

  const handleDraftRateChange = (id, field, value) => {
    setDraftRateOptions((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === 'price' ? Number(value) || 0 : value
            }
          : item
      )
    )
  }

  const saveRatesEditor = () => {
    setRateOptions(draftRateOptions)
    setIsRatesEditorOpen(false)
  }

  const openTopSkillsEditor = () => {
    setDraftTopSkillOptions(topSkillOptionsState)
    setIsTopSkillsEditorOpen(true)
  }

  const closeTopSkillsEditor = () => {
    setIsTopSkillsEditorOpen(false)
  }

  const toggleDraftTopSkill = (id) => {
    setDraftTopSkillOptions((current) => {
      const selectedCount = current.filter((item) => item.selected).length

      return current.map((item) => {
        if (item.id !== id) {
          return item
        }

        if (!item.selected && selectedCount >= 4) {
          return item
        }

        return { ...item, selected: !item.selected }
      })
    })
  }

  const saveTopSkillsEditor = () => {
    setTopSkillOptionsState(draftTopSkillOptions)
    setIsTopSkillsEditorOpen(false)
  }

  const openAboutMeEditor = () => {
    setDraftAboutMeText(aboutMeText)
    setIsAboutMeEditorOpen(true)
  }

  const closeAboutMeEditor = () => {
    setIsAboutMeEditorOpen(false)
  }

  const saveAboutMeEditor = () => {
    setAboutMeText(draftAboutMeText)
    setIsAboutMeEditorOpen(false)
  }

  const openCertificationsEditor = () => {
    setDraftCertificationOptions(certificationOptions)
    setIsCertificationsEditorOpen(true)
  }

  const closeCertificationsEditor = () => {
    setIsCertificationsEditorOpen(false)
  }

  const toggleDraftCertification = (id) => {
    setDraftCertificationOptions((current) => {
      const selectedCount = current.filter((item) => item.selected).length

      return current.map((item) => {
        if (item.id !== id) {
          return item
        }

        if (!item.selected && selectedCount >= 5) {
          return item
        }

        return { ...item, selected: !item.selected }
      })
    })
  }

  const saveCertificationsEditor = () => {
    setCertificationOptions(draftCertificationOptions)
    setIsCertificationsEditorOpen(false)
  }

  const openAdditionalInfoEditor = () => {
    setDraftAdditionalInfo(additionalInfo)
    setCountrySearch(additionalInfo.countryOfOrigin)
    setLanguageSearch('')
    setIsLanguagePickerOpen(false)
    setIsCountryDropdownOpen(false)
    setIsAdditionalInfoEditorOpen(true)
  }

  const closeAdditionalInfoEditor = () => {
    setIsAdditionalInfoEditorOpen(false)
  }

  const saveAdditionalInfoEditor = () => {
    setAdditionalInfo(draftAdditionalInfo)
    setIsAdditionalInfoEditorOpen(false)
  }

  const filteredCountries = countryOptions.filter((country) =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const filteredLanguages = languageOptions.filter((language) =>
    language.toLowerCase().includes(languageSearch.toLowerCase())
  )

  const selectDraftCountry = (country) => {
    setDraftAdditionalInfo((current) => ({
      ...current,
      countryOfOrigin: country
    }))
    setCountrySearch(country)
    setIsCountryDropdownOpen(false)
  }

  const toggleLanguagePicker = () => {
    setIsLanguagePickerOpen((current) => !current)
  }

  const selectedCertificationCount = draftCertificationOptions.filter((item) => item.selected).length

  const selectedTopSkills = topSkillOptionsState.filter((item) => item.selected)

  const availableDateRange = savedAvailableDateKeys
    .map((key) => new Date(key))
    .sort((left, right) => left - right)

  const availableStartLabel = availableDateRange[0] ? formatDateLabel(availableDateRange[0]) : formatDateLabel(todayStart)
  const availableEndLabel = availableDateRange[availableDateRange.length - 1]
    ? formatDateLabel(availableDateRange[availableDateRange.length - 1])
    : formatDateLabel(todayStart)
  const availableOpenDatesCount = savedAvailableDateKeys.length

  const addDraftLanguage = (language) => {
    setDraftAdditionalInfo((current) => {
      if (current.languagesSpoken.includes(language)) {
        return current
      }

      return {
        ...current,
        languagesSpoken: [...current.languagesSpoken, language]
      }
    })
    setLanguageSearch('')
  }

  const removeDraftLanguage = (language) => {
    setDraftAdditionalInfo((current) => ({
      ...current,
      languagesSpoken: current.languagesSpoken.filter((item) => item !== language)
    }))
  }

  const openAvailabilityEditor = () => {
    setDraftDayAvailability(savedDayAvailability)
    setDraftAvailableDateKeys(savedAvailableDateKeys)
    setAvailabilityEditorStep('schedule')
    setAvailabilityMonthOffset(0)
    setIsAvailabilityEditorOpen(true)
  }

  const closeAvailabilityEditor = () => {
    setIsAvailabilityEditorOpen(false)
    setAvailabilityEditorStep('schedule')
  }

  const toggleDraftAvailabilitySlot = (day, slot) => {
    setDraftDayAvailability((current) => {
      const selectedSlots = current[day] || []
      const nextSlots = selectedSlots.includes(slot)
        ? selectedSlots.filter((item) => item !== slot)
        : [...selectedSlots, slot]

      return {
        ...current,
        [day]: nextSlots
      }
    })
  }

  const openAvailabilityCalendar = () => {
    setAvailabilityMonthOffset(0)
    setAvailabilityEditorStep('calendar')
  }

  const goToPreviousAvailabilityMonth = () => {
    setAvailabilityMonthOffset((current) => Math.max(0, current - 1))
  }

  const goToNextAvailabilityMonth = () => {
    setAvailabilityMonthOffset((current) => current + 1)
  }

  const toggleDraftCalendarDate = (date) => {
    if (date < todayStart) {
      return
    }

    const dateKey = date.toDateString()
    setDraftAvailableDateKeys((current) =>
      current.includes(dateKey)
        ? current.filter((item) => item !== dateKey)
        : [...current, dateKey]
    )
  }

  const selectAllRemainingDates = () => {
    const remainingDateKeys = viewedMonthDates
      .filter((date) => date >= todayStart)
      .map((date) => date.toDateString())

    setDraftAvailableDateKeys(remainingDateKeys)
  }

  const saveAvailabilityEditor = () => {
    if (availabilityEditorStep === 'schedule') {
      openAvailabilityCalendar()
      return
    }

    setSavedDayAvailability(draftDayAvailability)
    setSavedAvailableDateKeys(draftAvailableDateKeys)
    setIsAvailabilityEditorOpen(false)
    setAvailabilityEditorStep('schedule')
  }

  const openPhotoPicker = () => {
    if (photoInputRef.current) {
      photoInputRef.current.click()
    }
  }

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith('image/'))

    if (!files.length) {
      return
    }

    setMainImageSrc(URL.createObjectURL(files[0]))
    event.target.value = ''
  }

  const confirmDeleteThumbnail = (imageSrc) => {
    setDeleteConfirmImage(imageSrc)
    setShowDeleteConfirm(true)
  }

  const deleteThumbnail = () => {
    if (deleteConfirmImage) {
      // Remove from thumbnail array
      setThumbnailImages(prev => prev.filter(img => img !== deleteConfirmImage))
      // If deleted image is main image, switch to first available thumbnail
      if (deleteConfirmImage === mainImageSrc) {
        const remaining = thumbnailImages.filter(img => img !== deleteConfirmImage)
        setMainImageSrc(remaining.length > 0 ? remaining[0] : one)
      }
    }
    setShowDeleteConfirm(false)
    setDeleteConfirmImage(null)
  }

  const openVoiceNoteModal = () => {
    setIsVoiceNoteModalOpen(true)
  }

  const closeVoiceNoteModal = () => {
    if (isRecording) {
      stopRecording()
    }
    setIsVoiceNoteModalOpen(false)
    setRecordingDuration(0)
    setRecordedAudio(null)
    audioChunksRef.current = []
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      setRecordingDuration(0)
      setIsRecording(true)

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setRecordedAudio(audioUrl)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()

      const timerInterval = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 30) {
            mediaRecorder.stop()
            clearInterval(timerInterval)
            setIsRecording(false)
            return prev
          }
          return prev + 1
        })
      }, 1000)

      setRecordingTimerInterval(timerInterval)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (recordingTimerInterval) {
        clearInterval(recordingTimerInterval)
        setRecordingTimerInterval(null)
      }
    }
  }

  const handleVoiceNoteUpload = (event) => {
    const files = Array.from(event.target.files || []).filter((file) => 
      file.type.startsWith('audio/') || file.type === 'audio/mpeg' || file.type === 'audio/wav' || file.type === 'audio/mp4'
    )

    if (!files.length) {
      alert('Please select a valid audio file (MP3, WAV, M4A)')
      return
    }

    if (files[0].size > 30 * 1024 * 1024) {
      alert('File size must be less than 30MB')
      return
    }

    const audioUrl = URL.createObjectURL(files[0])
    setRecordedAudio(audioUrl)
    event.target.value = ''
  }

  const saveVoiceNote = () => {
    if (recordedAudio) {
      console.log('Voice note saved:', recordedAudio)
      closeVoiceNoteModal()
    }
  }

  useEffect(() => {
    writeStoredValue('party-hostess-rate-options', rateOptions)
  }, [rateOptions])

  useEffect(() => {
    writeStoredValue('party-hostess-top-skills', topSkillOptionsState)
  }, [topSkillOptionsState])

  useEffect(() => {
    writeStoredValue('party-hostess-certifications', certificationOptions)
  }, [certificationOptions])

  useEffect(() => {
    writeStoredValue('party-hostess-day-availability', savedDayAvailability)
  }, [savedDayAvailability])

  useEffect(() => {
    writeStoredValue('party-hostess-available-dates', savedAvailableDateKeys)
  }, [savedAvailableDateKeys])

  useEffect(() => {
    writeStoredValue('party-hostess-additional-info', additionalInfo)
  }, [additionalInfo])

  useEffect(() => {
    writeStoredValue('party-hostess-public-visible', isPublicVisible)
  }, [isPublicVisible])

  useEffect(() => {
    writeStoredValue('party-hostess-instant-book', isInstantBook)
  }, [isInstantBook])

  useEffect(() => {
    writeStoredValue('party-hostess-review-rating', reviewRating)
  }, [reviewRating])

  return (
    <main className="view-container">
      <div className="split-layout">
        <section className="left-side">
          <div className="main-image-frame">
            <img src={mainImageSrc} alt="Main profile" className="main-image" />
            <button className="pill back-pill" type="button">← Back</button>
            <button className="icon-pill" type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openPhotoPicker(); }} aria-label="Camera">
              <img src={cameraImg} alt="Camera" style={{ width: '16px', height: '16px' }} />
            </button>
            <button className="voice-note-btn" type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openVoiceNoteModal(); }}>Add Voice Note 🎤</button>
          </div>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="photo-input-hidden"
          />

          <div className="thumb-slider-row">
            <div className="thumb-strip">
              {thumbnailImages.map((img, index) => (
                <div key={img} className="thumb-container">
                  <button
                    type="button"
                    className="thumb"
                    onClick={() => setMainImageSrc(img)}
                    aria-label={`Select image ${index + 1}`}
                    style={{ backgroundImage: `url(${img})` }}
                  />
                  <button
                    type="button"
                    className="thumb-delete-btn"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      confirmDeleteThumbnail(img)
                    }}
                    aria-label="Delete image"
                  >
                    <img src={deleteImg} alt="Delete" style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button type="button" className="add-photo-row" onClick={openPhotoPicker} aria-label="Add photo">
            <img src={cameraImg} alt="Add Photo" style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }} />
            Add Photo
          </button>

          <section className="reviews-card">
            <h2 className="reviews-title">
              Reviews
              <span className="reviews-rating-controls" aria-label="Set review rating">
                {Array.from({ length: 5 }, (_, index) => {
                  const starNumber = index + 1

                  return (
                    <button
                      key={starNumber}
                      type="button"
                      className={`reviews-rating-star ${reviewRating >= starNumber ? 'is-filled' : ''}`}
                      onClick={() => setReviewRating(starNumber)}
                      aria-label={`Set rating to ${starNumber}`}
                    >
                      ★
                    </button>
                  )
                })}
                <strong>{reviewRating}.0/5</strong>
              </span>
              <em>(120 Reviews)</em>
            </h2>
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <img src={review.image} alt={review.name} className="avatar" />
                <div className="review-meta">
                  <h3>{review.name}</h3>
                  <div className="review-stars" aria-label={`${review.stars} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <span key={index} className={`review-star ${review.stars >= index + 1 ? 'is-filled' : ''}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="review-message">{review.message}</p>
              </div>
            ))}
          </section>
          <button>View More</button>
        </section>

        <section className="right-side">
          <div className="rating-row">
            <span>★★★★★ 5 (120 Reviews)</span>
            <span>
              <img src={flagImg} alt="Australia" style={{ width: '25px', height: '20px', marginRight: '10px', verticalAlign: 'middle' }} />
              Sydney, NSW
            </span>
          </div>
          <h1 className="profile-name" style={{ fontWeight: 'bold' }}>Samantha L.</h1>

          <section className="profile-panel">
            <div className="panel-header">
              <h2>About Me</h2>
              <button type="button" className="rates-edit-btn" onClick={isAboutMeEditorOpen ? closeAboutMeEditor : openAboutMeEditor} aria-label="Edit about me">
                <img src={notePencilImg} alt="Edit" style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
            <div className="about-me-content">
              {aboutMeText.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            {isAboutMeEditorOpen && (
              <div className="panel-inline-editor">
                <header className="rates-editor-header">
                  <div>
                    <h3>About Me</h3>
                    <p className="editor-subtitle">Tell your story</p>
                  </div>
                  <button type="button" className="rates-editor-close" onClick={closeAboutMeEditor} aria-label="Close about me editor">
                    ×
                  </button>
                </header>

                <div className="about-me-editor-content">
                  <textarea
                    className="about-me-textarea"
                    value={draftAboutMeText}
                    onChange={(e) => setDraftAboutMeText(e.target.value)}
                    placeholder="Write your about me section..."
                  />
                  <button type="button" className="rates-save-btn about-me-save-btn" onClick={saveAboutMeEditor}>
                    save
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="profile-panel">
            <div className="panel-header">
              <h2>Top Skills</h2>
              <button type="button" className="rates-edit-btn" onClick={isTopSkillsEditorOpen ? closeTopSkillsEditor : openTopSkillsEditor} aria-label="Edit top skills">
                <img src={notePencilImg} alt="Edit" style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
            <div className="skills-grid">
              {selectedTopSkills.map((skill) => (
                <div key={skill.id} className="skill-item">
                  {skillImageMap[skill.name] && (
                    <img src={skillImageMap[skill.name]} alt={skill.name} className="skill-image" />
                  )}
                  <span className="skill-name">{skill.name}</span>
                </div>
              ))}
            </div>
            {isTopSkillsEditorOpen && (
              <div className="panel-inline-editor">
                <header className="rates-editor-header">
                  <div>
                    <h3>Top Skills</h3>
                    <p className="editor-subtitle">Select up to 4 top skills</p>
                  </div>
                  <button type="button" className="rates-editor-close" onClick={closeTopSkillsEditor} aria-label="Close top skills editor">
                    ×
                  </button>
                </header>

                <div className="rates-editor-list cert-editor-list">
                  {draftTopSkillOptions.map((skill) => (
                    <label key={skill.id} className={`cert-editor-row top-skill-row ${skill.selected ? 'is-selected' : ''}`}>
                      <input
                        type="checkbox"
                        checked={skill.selected}
                        disabled={!skill.selected && draftTopSkillOptions.filter((item) => item.selected).length >= 4}
                        onChange={() => toggleDraftTopSkill(skill.id)}
                      />
                      <span>{skill.name}</span>
                    </label>
                  ))}

                  <button type="button" className="rates-save-btn cert-save-btn" onClick={saveTopSkillsEditor}>save</button>
                </div>
              </div>
            )}
          </section>

          <section className="toggles-panel">
            <div className="toggle-row">
              <span>Profile Public Visibility</span>
              <button
                type="button"
                className={`toggle-switch ${isPublicVisible ? 'is-on' : ''}`}
                onClick={() => {
                  const newValue = !isPublicVisible
                  setIsPublicVisible(newValue)
                  console.log('Profile Public Visibility:', newValue)
                }}
                aria-pressed={isPublicVisible}
                aria-label="Toggle profile public visibility"
              >
                <span className="toggle-knob" />
              </button>
            </div>
            <div className="toggle-row">
              <span>Instant Book</span>
              <button
                type="button"
                className={`toggle-switch ${isInstantBook ? 'is-on' : ''}`}
                onClick={() => {
                  const newValue = !isInstantBook
                  setIsInstantBook(newValue)
                  console.log('Instant Book:', newValue)
                }}
                aria-pressed={isInstantBook}
                aria-label="Toggle instant book"
              >
                <span className="toggle-knob" />
              </button>
            </div>
          </section>

          <section className="profile-panel rates-panel">
            <div className="rates-head-row">
              <h2>✓ Rates and Experience</h2>
              <button type="button" className="rates-edit-btn" onClick={isRatesEditorOpen ? closeRatesEditor : openRatesEditor} aria-label="Edit rates and experience">
                <img src={notePencilImg} alt="Edit" style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
            {rates.map((rate) => (
              <article key={rate.id} className="rate-card" style={{ '--accent-color': rate.accentColor }}>
                <div className="rate-head"><span>{rate.service}</span><strong>{rate.price}</strong></div>
                <p>Experience Level: <strong>{rate.confidence}</strong></p>
                <div className="experience-labels">
                  <span>Comfortable</span>
                  <span>Confident</span>
                  <span>Very Confident</span>
                </div>
                <div className="level-track">
                  {Array.from({ length: 3 }, (_, i) => (
                    <span key={i} className={i < rate.experience ? '' : 'empty'} />
                  ))}
                </div>
                <small>{rate.confidence} • {rate.eventsText}</small>
              </article>
            ))}
            {isRatesEditorOpen && (
              <div className="panel-inline-editor">
                <header className="rates-editor-header">
                  <h3>Rates and Experience</h3>
                  <button type="button" className="rates-editor-close" onClick={closeRatesEditor} aria-label="Close rates editor">
                    ×
                  </button>
                </header>

                <div className="rates-editor-list">
                  {draftRateOptions.map((item) => (
                    <article key={item.id} className={`rates-editor-item ${item.selected ? 'is-selected' : 'is-disabled'}`}>
                      <div className="rates-editor-item-top">
                        <label className="service-check-row">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => handleDraftRateToggle(item.id)}
                          />
                          <span>{item.service}</span>
                          {item.label && <small>{item.label}</small>}
                        </label>

                        <div className="rate-input-wrap">
                          <span>$</span>
                          <input
                            type="number"
                            min="0"
                            value={item.price}
                            onChange={(event) => handleDraftRateChange(item.id, 'price', event.target.value)}
                            disabled={!item.selected}
                          />
                          <em>/{item.unit}</em>
                        </div>
                      </div>

                      {item.selected && (
                        <div className="rates-editor-controls">
                          <select
                            value={item.confidence}
                            onChange={(event) => handleDraftRateChange(item.id, 'confidence', event.target.value)}
                          >
                            {confidenceOptions.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>

                          <select
                            value={item.eventsRange}
                            onChange={(event) => handleDraftRateChange(item.id, 'eventsRange', event.target.value)}
                          >
                            {eventsOptions.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </article>
                  ))}

                  <button type="button" className="rates-see-more">see more</button>
                </div>

                <footer className="rates-editor-footer availability-footer">
                  <button type="button" className="rates-save-btn" onClick={saveRatesEditor}>save</button>
                </footer>
              </div>
            )}
          </section>

          <section className="profile-panel available-dates-panel">
            <div className="panel-header">
              <h2>Available Dates</h2>
              <button type="button" className="rates-edit-btn" onClick={isAvailabilityEditorOpen ? closeAvailabilityEditor : openAvailabilityEditor} aria-label="Edit available dates">
                <img src={notePencilImg} alt="Edit" style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
            <div className="date-range">
              <span className="date-highlight">{availableStartLabel} - {availableEndLabel}</span>
            </div>
            <p className="open-dates-text">{availableOpenDatesCount} open dates</p>

            {isAvailabilityEditorOpen && (
              <div className="availability-inline-editor">
                <header className="rates-editor-header availability-inline-header">
                  <div>
                    <h3>Available Dates</h3>
                    <p className="editor-subtitle">Select the days and time slots you are available.</p>
                  </div>
                  <button type="button" className="rates-editor-close" onClick={closeAvailabilityEditor} aria-label="Close available dates editor">
                    ×
                  </button>
                </header>

                {availabilityEditorStep === 'schedule' ? (
                  <div className="availability-grid-view">
                    <div className="availability-summary-row">
                      <span>{formatDateLabel(todayStart)} - {formatDateLabel(viewedMonthLastDay)}</span>
                      <strong>{viewedMonthDates.filter((date) => date >= todayStart).length} open dates</strong>
                    </div>

                    <div className="availability-days-list">
                      {availabilityDays.map((day) => (
                        <div key={day} className="availability-day-row">
                          <span className="availability-day-label">{day}</span>
                          <div className="availability-slot-group">
                            {availabilitySlots.map((slot) => {
                              const isActive = (draftDayAvailability[day] || []).includes(slot)

                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  className={`availability-slot-chip ${isActive ? 'is-selected' : ''}`}
                                  onClick={() => toggleDraftAvailabilitySlot(day, slot)}
                                >
                                  {slot}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <footer className="rates-editor-footer availability-footer">
                      <button type="button" className="rates-save-btn" onClick={saveAvailabilityEditor}>Save</button>
                    </footer>
                  </div>
                ) : (
                  <div className="calendar-view">
                    <div className="calendar-topbar">
                      <button type="button" className="calendar-nav-btn" aria-label="Previous month" onClick={goToPreviousAvailabilityMonth} disabled={availabilityMonthOffset === 0}>‹</button>
                      <h4>{viewedMonthLabel}</h4>
                      <button type="button" className="calendar-nav-btn" aria-label="Next month" onClick={goToNextAvailabilityMonth}>›</button>
                    </div>

                    <div className="calendar-weekdays">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                        <span key={day}>{day}</span>
                      ))}
                    </div>

                    <div className="calendar-grid">
                      {Array.from({ length: viewedMonthFirstDay.getDay() }).map((_, index) => (
                        <span key={`blank-${index}`} className="calendar-cell blank" />
                      ))}
                      {viewedMonthDates.map((date) => {
                        const dateKey = date.toDateString()
                        const isPast = date < todayStart
                        const isSelected = draftAvailableDateKeys.includes(dateKey)

                        return (
                          <button
                            key={dateKey}
                            type="button"
                            className={`calendar-cell ${isPast ? 'is-disabled' : ''} ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => toggleDraftCalendarDate(date)}
                            disabled={isPast}
                          >
                            {date.getDate()}
                          </button>
                        )
                      })}
                    </div>

                    <div className="calendar-actions-row">
                      <button type="button" className="calendar-select-all-btn" onClick={selectAllRemainingDates}>Select All ✓</button>
                    </div>

                    <footer className="rates-editor-footer availability-footer availability-calendar-footer">
                      <button type="button" className="calendar-cancel-btn" onClick={closeAvailabilityEditor}>Cancel</button>
                      <button type="button" className="rates-save-btn" onClick={saveAvailabilityEditor}>Save</button>
                    </footer>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="profile-panel certifications-panel">
            <div className="panel-header">
              <h2>Certifications</h2>
              <button type="button" className="rates-edit-btn" onClick={isCertificationsEditorOpen ? closeCertificationsEditor : openCertificationsEditor} aria-label="Edit certifications">
                <img src={notePencilImg} alt="Edit" style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
            <div className="cert-list">
              {certificationOptions.filter((cert) => cert.selected).map((cert) => (
                <div key={cert.id} className="cert-item">
                  <span className="cert-badge">✓</span>
                  <span>{cert.name}</span>
                </div>
              ))}
            </div>
            {isCertificationsEditorOpen && (
              <div className="panel-inline-editor">
                <header className="rates-editor-header">
                  <h3>Certifications</h3>
                  <button type="button" className="rates-editor-close" onClick={closeCertificationsEditor} aria-label="Close certifications editor">
                    ×
                  </button>
                </header>

                <div className="rates-editor-list cert-editor-list">
                  {draftCertificationOptions.map((cert) => (
                    <label key={cert.id} className={`cert-editor-row ${cert.selected ? 'is-selected' : ''}`}>
                      <input
                        type="checkbox"
                        checked={cert.selected}
                        disabled={!cert.selected && selectedCertificationCount >= 5}
                        onChange={() => toggleDraftCertification(cert.id)}
                      />
                      <span>{cert.name}</span>
                      {cert.optional && <small>Optional</small>}
                    </label>
                  ))}

                  <button type="button" className="rates-save-btn cert-save-btn" onClick={saveCertificationsEditor}>Save</button>
                </div>
              </div>
            )}
          </section>

          <section className="profile-panel additional-info-panel">
            <div className="panel-header">
              <h2>Additional Information</h2>
              <button type="button" className="rates-edit-btn" onClick={isAdditionalInfoEditorOpen ? closeAdditionalInfoEditor : openAdditionalInfoEditor} aria-label="Edit additional information">
                <img src={notePencilImg} alt="Edit" style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Country of Origin</label>
                <span>{additionalInfo.countryOfOrigin}</span>
              </div>
              <div className="info-item info-languages-item">
                <label>Languages Spoken</label>
                <div className="info-languages-chips">
                  {additionalInfo.languagesSpoken.map((language) => (
                    <span key={language} className="language-chip">{language}</span>
                  ))}
                </div>
              </div>
              <div className="info-item">
                <label>Body Type</label>
                <span>{additionalInfo.bodyType}</span>
              </div>
            </div>
            {isAdditionalInfoEditorOpen && (
              <div className="panel-inline-editor">
                <header className="rates-editor-header">
                  <h3>Additional Information</h3>
                  <button type="button" className="rates-editor-close" onClick={closeAdditionalInfoEditor} aria-label="Close additional information editor">
                    ×
                  </button>
                </header>

                <div className="rates-editor-list info-editor-list">
                  <div className="info-editor-block">
                    <label>Country of Origin</label>
                    <button type="button" className="dropdown-display" onClick={() => setIsCountryDropdownOpen((current) => !current)}>
                      <span>{draftAdditionalInfo.countryOfOrigin}</span>
                      <span>⌄</span>
                    </button>
                    {isCountryDropdownOpen && (
                      <div className="search-results-list dropdown-panel">
                        <input
                          type="text"
                          value={countrySearch}
                          onChange={(event) => {
                            setCountrySearch(event.target.value)
                            setDraftAdditionalInfo((current) => ({
                              ...current,
                              countryOfOrigin: event.target.value
                            }))
                          }}
                          placeholder="Search country"
                          className="info-search-input"
                        />
                        {filteredCountries.slice(0, 10).map((country) => (
                          <button key={country} type="button" className="search-result-row" onClick={() => selectDraftCountry(country)}>
                            {country}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="info-editor-block">
                    <div className="info-editor-header-row">
                      <label>Languages Spoken</label>
                      <button type="button" className="add-new-btn" onClick={toggleLanguagePicker}>Add New +</button>
                    </div>

                    <div className="selected-chip-row">
                      {draftAdditionalInfo.languagesSpoken.map((language) => (
                        <span key={language} className="language-chip language-chip-editable">
                          {language}
                          <button type="button" onClick={() => removeDraftLanguage(language)} aria-label={`Remove ${language}`}>
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    {isLanguagePickerOpen && (
                      <>
                        <input
                          type="text"
                          value={languageSearch}
                          onChange={(event) => setLanguageSearch(event.target.value)}
                          placeholder="Search language"
                          className="info-search-input"
                        />
                        <div className="search-results-list">
                          {filteredLanguages.map((language) => (
                            <button key={language} type="button" className="search-result-row" onClick={() => addDraftLanguage(language)}>
                              {language}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="info-editor-block">
                    <label>Body Type</label>
                    <select
                      className="info-select"
                      value={draftAdditionalInfo.bodyType}
                      onChange={(event) => setDraftAdditionalInfo((current) => ({
                        ...current,
                        bodyType: event.target.value
                      }))}
                    >
                      {bodyTypeOptions.map((bodyType) => (
                        <option key={bodyType} value={bodyType}>{bodyType}</option>
                      ))}
                    </select>
                  </div>

                  <button type="button" className="rates-save-btn cert-save-btn" onClick={saveAdditionalInfoEditor}>Save</button>
                </div>
              </div>
            )}
          </section>

          <section className="profile-panel career-highlights-panel">
            <div className="panel-header">
              <h2>Career Highlights</h2>
            </div>
            <div className="highlights-grid">
              {careerHighlights.map((highlight, index) => (
                <div key={index} className="highlight-card"  style={{background: `linear-gradient(110.39deg, ${highlight.color} 0.97%, #ffffff 99.03%)`}}>
                  <div className="highlight-number">{highlight.number}</div>
                  <div className="highlight-label">{highlight.label}</div>
                </div>
              ))}
            </div>
            <div className="completion-rate">
              <label>Completion Rate</label>
              <div className="rate-bar">
                <div className="rate-fill" style={{ width: `${completionRate}%` }}></div>
              </div>
              <span className="rate-percentage">{completionRate}%</span>
            </div>
          </section>
        </section>
      </div>

      {isRatesEditorOpen && (
        <div className="rates-editor-overlay" role="dialog" aria-modal="true" aria-label="Rates and Experience editor">
          <section className="rates-editor-sheet">
            <header className="rates-editor-header">
              <h3>Rates and Experience</h3>
              <button type="button" className="rates-editor-close" onClick={closeRatesEditor} aria-label="Close rates editor">
                ×
              </button>
            </header>

            <div className="rates-editor-list">
              {draftRateOptions.map((item) => (
                <article key={item.id} className={`rates-editor-item ${item.selected ? 'is-selected' : 'is-disabled'}`}>
                  <div className="rates-editor-item-top">
                    <label className="service-check-row">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleDraftRateToggle(item.id)}
                      />
                      <span>{item.service}</span>
                      {item.label && <small>{item.label}</small>}
                    </label>

                    <div className="rate-input-wrap">
                      <span>$</span>
                      <input
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={(event) => handleDraftRateChange(item.id, 'price', event.target.value)}
                        disabled={!item.selected}
                      />
                      <em>/{item.unit}</em>
                    </div>
                  </div>

                  {item.selected && (
                    <div className="rates-editor-controls">
                      <select
                        value={item.confidence}
                        onChange={(event) => handleDraftRateChange(item.id, 'confidence', event.target.value)}
                      >
                        {confidenceOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>

                      <select
                        value={item.eventsRange}
                        onChange={(event) => handleDraftRateChange(item.id, 'eventsRange', event.target.value)}
                      >
                        {eventsOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </article>
              ))}

              <button type="button" className="rates-see-more">see more</button>
            </div>

            <footer className="rates-editor-footer">
              <button type="button" className="rates-save-btn" onClick={saveRatesEditor}>save</button>
            </footer>
          </section>
        </div>
      )}

      {isAboutMeEditorOpen && (
        <div className="rates-editor-overlay" role="dialog" aria-modal="true" aria-label="About me editor">
          <section className="rates-editor-sheet about-me-editor-sheet">
            <header className="rates-editor-header">
              <div>
                <h3>About Me</h3>
                <p className="editor-subtitle">Tell your story</p>
              </div>
              <button type="button" className="rates-editor-close" onClick={closeAboutMeEditor} aria-label="Close about me editor">
                ×
              </button>
            </header>

            <div className="about-me-editor-content">
              <textarea
                className="about-me-textarea"
                value={draftAboutMeText}
                onChange={(e) => setDraftAboutMeText(e.target.value)}
                placeholder="Write your about me section..."
              />
              <button type="button" className="rates-save-btn about-me-save-btn" onClick={saveAboutMeEditor}>
                save
              </button>
            </div>
          </section>
        </div>
      )}

      {isTopSkillsEditorOpen && (
        <div className="rates-editor-overlay" role="dialog" aria-modal="true" aria-label="Top skills editor">
          <section className="rates-editor-sheet cert-editor-sheet top-skills-sheet">
            <header className="rates-editor-header">
              <div>
                <h3>Top Skills</h3>
                <p className="editor-subtitle">Select up to 4 top skills</p>
              </div>
              <button type="button" className="rates-editor-close" onClick={closeTopSkillsEditor} aria-label="Close top skills editor">
                ×
              </button>
            </header>

            <div className="rates-editor-list cert-editor-list">
              {draftTopSkillOptions.map((skill) => (
                <label key={skill.id} className={`cert-editor-row top-skill-row ${skill.selected ? 'is-selected' : ''}`}>
                  <input
                    type="checkbox"
                    checked={skill.selected}
                    disabled={!skill.selected && draftTopSkillOptions.filter((item) => item.selected).length >= 4}
                    onChange={() => toggleDraftTopSkill(skill.id)}
                  />
                  <span>{skill.name}</span>
                </label>
              ))}

              <button type="button" className="rates-save-btn cert-save-btn" onClick={saveTopSkillsEditor}>save</button>
            </div>
          </section>
        </div>
      )}

      {isCertificationsEditorOpen && (
        <div className="rates-editor-overlay" role="dialog" aria-modal="true" aria-label="Certifications editor">
          <section className="rates-editor-sheet cert-editor-sheet">
            <header className="rates-editor-header">
              <h3>Certifications</h3>
              <button type="button" className="rates-editor-close" onClick={closeCertificationsEditor} aria-label="Close certifications editor">
                ×
              </button>
            </header>

            <div className="rates-editor-list cert-editor-list">
              {draftCertificationOptions.map((cert) => (
                <label key={cert.id} className={`cert-editor-row ${cert.selected ? 'is-selected' : ''}`}>
                  <input
                    type="checkbox"
                    checked={cert.selected}
                    disabled={!cert.selected && selectedCertificationCount >= 5}
                    onChange={() => toggleDraftCertification(cert.id)}
                  />
                  <span>{cert.name}</span>
                  {cert.optional && <small>Optional</small>}
                </label>
              ))}

              <button type="button" className="rates-save-btn cert-save-btn" onClick={saveCertificationsEditor}>Save</button>
            </div>
          </section>
        </div>
      )}

      {isAdditionalInfoEditorOpen && (
        <div className="rates-editor-overlay" role="dialog" aria-modal="true" aria-label="Additional information editor">
          <section className="rates-editor-sheet info-editor-sheet">
            <header className="rates-editor-header">
              <h3>Additional Information</h3>
              <button type="button" className="rates-editor-close" onClick={closeAdditionalInfoEditor} aria-label="Close additional information editor">
                ×
              </button>
            </header>

            <div className="rates-editor-list info-editor-list">
              <div className="info-editor-block">
                <label>Country of Origin</label>
                <button type="button" className="dropdown-display" onClick={() => setIsCountryDropdownOpen((current) => !current)}>
                  <span>{draftAdditionalInfo.countryOfOrigin}</span>
                  <span>⌄</span>
                </button>
                {isCountryDropdownOpen && (
                  <div className="search-results-list dropdown-panel">
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(event) => {
                        setCountrySearch(event.target.value)
                        setDraftAdditionalInfo((current) => ({
                          ...current,
                          countryOfOrigin: event.target.value
                        }))
                      }}
                      placeholder="Search country"
                      className="info-search-input"
                    />
                    {filteredCountries.slice(0, 10).map((country) => (
                      <button key={country} type="button" className="search-result-row" onClick={() => selectDraftCountry(country)}>
                        {country}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="info-editor-block">
                <div className="info-editor-header-row">
                  <label>Languages Spoken</label>
                  <button type="button" className="add-new-btn" onClick={toggleLanguagePicker}>Add New +</button>
                </div>

                <div className="selected-chip-row">
                  {draftAdditionalInfo.languagesSpoken.map((language) => (
                    <span key={language} className="language-chip language-chip-editable">
                      {language}
                      <button type="button" onClick={() => removeDraftLanguage(language)} aria-label={`Remove ${language}`}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {isLanguagePickerOpen && (
                  <>
                    <input
                      type="text"
                      value={languageSearch}
                      onChange={(event) => setLanguageSearch(event.target.value)}
                      placeholder="Search language"
                      className="info-search-input"
                    />
                    <div className="search-results-list">
                      {filteredLanguages.map((language) => (
                        <button key={language} type="button" className="search-result-row" onClick={() => addDraftLanguage(language)}>
                          {language}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="info-editor-block">
                <label>Body Type</label>
                <select
                  value={draftAdditionalInfo.bodyType}
                  onChange={(event) => setDraftAdditionalInfo((current) => ({ ...current, bodyType: event.target.value }))}
                  className="info-select"
                >
                  {bodyTypeOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <button type="button" className="rates-save-btn cert-save-btn" onClick={saveAdditionalInfoEditor}>Save</button>
            </div>
          </section>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="rates-editor-overlay">
          <section className="rates-editor-sheet">
            <div className="modal-header">
              <h3>Delete Image?</h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowDeleteConfirm(false)}>×</button>
            </div>
            <div className="modal-body">
              {deleteConfirmImage && (
                <div style={{ marginBottom: '16px' }}>
                  <img src={deleteConfirmImage} alt="Image to delete" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                </div>
              )}
              <p style={{ marginBottom: '20px', color: '#666' }}>Are you sure you want to delete this image?</p>
            </div>
            <div className="modal-actions">
              <button type="button" className="modal-cancel-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button type="button" className="modal-delete-btn" onClick={deleteThumbnail}>Delete</button>
            </div>
          </section>
        </div>
      )}

      {/* Voice Note Modal */}
      {isVoiceNoteModalOpen && (
        <div className="rates-editor-overlay">
          <section className="rates-editor-sheet">
            <div className="modal-header">
              <h3>Record Voice Note</h3>
              <button type="button" className="modal-close-btn" onClick={closeVoiceNoteModal}>×</button>
            </div>
            <div className="modal-body">
              {!recordedAudio && !isRecording && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎤</div>
                    <p style={{ color: '#666', marginBottom: '12px' }}>Start Recording your voice note.</p>
                    <p style={{ color: '#999', fontSize: '14px' }}>Maximum duration is 30 seconds.</p>
                  </div>
                </>
              )}

              {isRecording && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }}>🎤</div>
                    <p style={{ color: '#ef195f', fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>
                      {Math.floor(recordingDuration / 60).toString().padStart(2, '0')}:{(recordingDuration % 60).toString().padStart(2, '0')}
                    </p>
                    <p style={{ color: '#666' }}>Recording...</p>
                  </div>
                </>
              )}

              {recordedAudio && !isRecording && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>▶️</div>
                    <p style={{ color: '#666', marginBottom: '16px' }}>
                      {Math.floor(recordingDuration / 60).toString().padStart(2, '0')}:{(recordingDuration % 60).toString().padStart(2, '0')} Sec
                    </p>
                    <audio controls src={recordedAudio} style={{ marginBottom: '16px', width: '100%' }} />
                  </div>
                </>
              )}

              {!recordedAudio && !isRecording && (
                <>
                  <div style={{ marginTop: '16px', padding: '20px', border: '2px dashed #ddd', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#f9f9f9' }}>
                    <p style={{ color: '#666', marginBottom: '12px' }}>Drag and drop your file here or</p>
                    <button type="button" className="rates-save-btn" onClick={() => voiceNoteInputRef.current?.click()}>
                      Select File
                    </button>
                    <input
                      ref={voiceNoteInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleVoiceNoteUpload}
                      style={{ display: 'none' }}
                    />
                    <p style={{ color: '#999', fontSize: '12px', marginTop: '12px' }}>
                      Supported formats: MP3, WAV, M4A (max 30 megabytes)
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="modal-actions">
              {!recordedAudio && !isRecording && (
                <button type="button" className="rates-save-btn" onClick={startRecording}>Record</button>
              )}
              {isRecording && (
                <button type="button" className="rates-save-btn" onClick={stopRecording}>Stop</button>
              )}
              {recordedAudio && !isRecording && (
                <>
                  <button type="button" className="modal-cancel-btn" onClick={() => { setRecordedAudio(null); setRecordingDuration(0); }}>
                    Record Again
                  </button>
                  <button type="button" className="rates-save-btn" onClick={saveVoiceNote}>Save</button>
                </>
              )}
            </div>
          </section>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </main>
  )
}

export default EventStaffProfile
