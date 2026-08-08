import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import ChatbotComponent from './components/Chatbot/Chatbot';

const routes = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'programs', label: 'Programs' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
  { id: 'admin', label: 'Admin' },
];

const publicRoutes = routes.filter((route) => route.id !== 'admin');

const photo = (id, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=82`;

const images = {
  hero: photo('1517836357463-d25dfeac3438', 1800),
  barbell: photo('1517838277536-f5f99be501cd', 900),
  weights: photo('1534438327276-14e5300c3a48', 1000),
  treadmill: photo('1540497077202-7c8a3999166f', 1000),
  class: photo('1571019613454-1cb2f99b2d8b', 1000),
  coaching: photo('1574680096145-d05b474e2155', 1000),
  hiit: photo('1599058917212-d750089bc07e', 1000),
  yoga: photo('1518611012118-696072aa579a', 1000),
  nutrition: photo('1490645935967-10de6ba17061', 1000),
  lockers: photo('1605296867304-46d5465a13f1', 1000),
  stretch: photo('1594737625785-a6cbdabd333c', 900),
  studio: photo('1593079831268-3381b0db4a77', 1100),
};

const featureCards = [
  {
    title: 'Strength Training',
    body: 'Progressive barbell work, athletic accessory lifts, and smart recovery.',
    icon: 'dumbbell',
    accent: 'cyan',
  },
  {
    title: 'Cardio Fitness',
    body: 'High-output conditioning blocks with tread, bike, row, and sled work.',
    icon: 'heart',
    accent: 'orange',
  },
  {
    title: 'Personal Coaching',
    body: 'One-on-one coaching, movement checks, and weekly habit tracking.',
    icon: 'person',
    accent: 'gold',
  },
];

const defaultPrograms = [
  {
    id: 'program-weight-training',
    title: 'Weight Training',
    body: 'Build raw strength with coached compound lifts and hypertrophy blocks.',
    icon: 'dumbbell',
    image: images.barbell,
    accent: 'orange',
  },
  {
    id: 'program-cardio-fitness',
    title: 'Cardio Fitness',
    body: 'Raise endurance with treadmill, rower, assault bike, and threshold sets.',
    icon: 'heart',
    image: images.treadmill,
    accent: 'cyan',
  },
  {
    id: 'program-personal-training',
    title: 'Personal Training',
    body: 'Get a custom plan, live feedback, and accountability that adapts weekly.',
    icon: 'person',
    image: images.coaching,
    accent: 'orange',
  },
  {
    id: 'program-hiit-classes',
    title: 'HIIT Classes',
    body: 'Fast, fiery intervals that combine strength, speed, and core stability.',
    icon: 'timer',
    image: images.hiit,
    accent: 'cyan',
  },
  {
    id: 'program-yoga-mobility',
    title: 'Yoga & Mobility',
    body: 'Improve flexibility, breathing mechanics, balance, and joint range.',
    icon: 'leaf',
    image: images.yoga,
    accent: 'orange',
  },
  {
    id: 'program-nutrition-coaching',
    title: 'Nutrition Coaching',
    body: 'Meal strategy, protein targets, and practical fuel for your training week.',
    icon: 'target',
    image: images.nutrition,
    accent: 'cyan',
  },
];

const defaultTrainers = [
  {
    id: 'trainer-mason-cruz',
    name: 'Mason Cruz',
    role: 'Strength',
    image: photo('1526506118085-60ce8714f8c5', 900),
    rating: '4.9',
    clients: '320',
    years: '12',
    accent: 'cyan',
  },
  {
    id: 'trainer-athier-knox',
    name: 'Athier Knox',
    role: 'Performance',
    image: photo('1605296867304-46d5465a13f1', 900),
    rating: '4.9',
    clients: '408',
    years: '9',
    accent: 'orange',
  },
  {
    id: 'trainer-ria-stone',
    name: 'Ria Stone',
    role: 'Nutrition',
    image: photo('1594737625785-a6cbdabd333c', 900),
    rating: '4.8',
    clients: '275',
    years: '8',
    accent: 'cyan',
  },
  {
    id: 'trainer-noah-pierce',
    name: 'Noah Pierce',
    role: 'HIIT',
    image: photo('1571019614242-c5c5dee9f50b', 900),
    rating: '4.9',
    clients: '360',
    years: '10',
    accent: 'orange',
  },
  {
    id: 'trainer-leah-vale',
    name: 'Leah Vale',
    role: 'Mobility',
    image: photo('1518611012118-696072aa579a', 900),
    rating: '4.8',
    clients: '230',
    years: '7',
    accent: 'cyan',
  },
  {
    id: 'trainer-kai-monroe',
    name: 'Kai Monroe',
    role: 'Conditioning',
    image: photo('1574680096145-d05b474e2155', 900),
    rating: '4.9',
    clients: '415',
    years: '11',
    accent: 'orange',
  },
];

const defaultPricingPlans = [
  {
    id: 'plan-basic',
    name: 'Basic',
    price: { monthly: 49, yearly: 39 },
    accent: 'cyan',
    summary: 'For focused solo training.',
    features: ['Off-peak gym access', 'Standard equipment floor', '1 fitness assessment'],
  },
  {
    id: 'plan-standard',
    name: 'Standard',
    price: { monthly: 79, yearly: 63 },
    accent: 'orange',
    summary: 'The most popular full-access plan.',
    tag: 'Recommended',
    features: [
      '24/7 gym access',
      'All classes included',
      '5 personal training sessions',
      'Nutrition starter plan',
    ],
  },
  {
    id: 'plan-premium',
    name: 'Premium',
    price: { monthly: 149, yearly: 119 },
    accent: 'cyan',
    summary: 'For athletes who want full support.',
    features: [
      'All Standard features',
      'Unlimited PT sessions',
      'Recovery zone access',
      'VIP locker and towel service',
    ],
  },
];

const defaultGalleryItems = [
  { id: 'gallery-deadlift-floor', title: 'Deadlift Floor', type: 'image', image: images.barbell, wide: true, accent: 'cyan' },
  { id: 'gallery-sprint-lanes', title: 'Sprint Lanes', type: 'image', image: images.class, accent: 'orange' },
  { id: 'gallery-locker-suite', title: 'Locker Suite', type: 'image', image: images.lockers, accent: 'cyan' },
  { id: 'gallery-cardio-wall', title: 'Cardio Wall', type: 'image', image: images.treadmill, wide: true, accent: 'cyan' },
  { id: 'gallery-rack-zone', title: 'Rack Zone', type: 'image', image: images.weights, accent: 'orange' },
  { id: 'gallery-mobility-studio', title: 'Mobility Studio', type: 'image', image: images.yoga, accent: 'orange' },
  { id: 'gallery-coaching-pod', title: 'Coaching Pod', type: 'image', image: images.coaching, accent: 'cyan' },
  { id: 'gallery-fuel-bar', title: 'Fuel Bar', type: 'image', image: images.nutrition, wide: true, accent: 'orange' },
  { id: 'gallery-stretch-lab', title: 'Stretch Lab', type: 'image', image: images.stretch, accent: 'cyan' },
];

const defaultClients = [
  {
    id: 'client-aria-shaw',
    name: 'Aria Shaw',
    email: 'aria@example.com',
    phone: '+1 213 555 0144',
    plan: 'Standard',
    goal: 'Build strength and improve conditioning',
    age: '29',
    height: '5 ft 7 in',
    weight: '142 lb',
    trainer: 'Mason Cruz',
    startDate: '2026-05-01',
    notes: 'Prefers evening classes and weekly strength check-ins.',
  },
];

const stats = [
  { value: '10,000+', label: 'Members' },
  { value: '500+', label: 'Classes Weekly' },
  { value: '95%', label: 'Satisfaction' },
];

const highlights = [
  { label: 'Classes / Week', value: '86%' },
  { label: 'Programming', value: '92%' },
  { label: 'Training Floor', value: '74%' },
  { label: 'Recovery Suites', value: '66%' },
];

const defaultTestimonials = [
  {
    id: 'testimonial-danna-seaton',
    quote: 'Volt made training feel precise, intense, and finally sustainable.',
    name: 'Danna Seaton',
  },
  {
    id: 'testimonial-aslan-morton',
    quote: 'The coaches noticed the details I used to miss every single week.',
    name: 'Aslan Morton',
  },
  {
    id: 'testimonial-june-gable',
    quote: 'The classes move fast, but the coaching never feels rushed.',
    name: 'June Gable',
  },
];

const defaultWeeklySchedule = [
  { id: 'schedule-mon-build', day: 'Mon', time: '6:00 AM', className: 'Barbell Build' },
  { id: 'schedule-tue-hiit', day: 'Tue', time: '7:30 PM', className: 'Neon HIIT' },
  { id: 'schedule-wed-mobility', day: 'Wed', time: '6:30 AM', className: 'Mobility Reset' },
  { id: 'schedule-thu-engine', day: 'Thu', time: '8:00 PM', className: 'Engine Room' },
  { id: 'schedule-sat-sweat', day: 'Sat', time: '9:00 AM', className: 'Team Sweat' },
];

const defaultSettings = {
  id: 'settings-main',
  gymName: 'Volt Fitness',
  phone: '+1 213 455 7980',
  email: 'hello@voltfitness.com',
  address: '88 Neon Yard, Los Angeles, CA',
  facebook: '#',
  instagram: '#',
  youtube: '#',
  heroTitle: 'Transform your body. Transform your life.',
  heroSubtitle:
    'Train inside a high-energy performance club built for strength, conditioning, coaching, recovery, and visible progress.',
};

const kineticLines = {
  home: ['Lift Heavy', 'Move Fast', 'Recover Smart', 'Show Up', 'Level Up'],
  about: ['Coach First', 'Progress Weekly', 'No Guesswork', 'Stronger Together'],
  programs: ['Strength', 'Engine', 'Mobility', 'Nutrition', 'Performance'],
  pricing: ['More Access', 'More Coaching', 'More Momentum', 'One Club'],
  gallery: ['Iron', 'Sweat', 'Light', 'Motion', 'Recovery', 'Focus'],
  contact: ['Tour Today', 'Train Tonight', 'Meet A Coach', 'Claim A Trial'],
};

const facilityZones = [
  { title: 'Strength Deck', body: 'Racks, platforms, calibrated plates, and coach-led lift blocks.', image: images.weights },
  { title: 'Engine Room', body: 'Tread, row, ski, bike, sled, and timed conditioning stations.', image: images.treadmill },
  { title: 'Recovery Bay', body: 'Mobility work, cooldown flows, and guided recovery checkpoints.', image: images.stretch },
];

function App() {
  const location = useLocation();
  const navigateHook = useNavigate();
  const activePage = location.pathname.replace(/^\//, '') || 'home';
  const [billing, setBilling] = useState('yearly');
  const [trainerSlide, setTrainerSlide] = useState(0);
  const [trainers, setTrainers] = useState(defaultTrainers);
  const [galleryItems, setGalleryItems] = useState(defaultGalleryItems);
  const [clients, setClients] = useState(defaultClients);
  const [pricingPlans, setPricingPlans] = useState(defaultPricingPlans);
  const [programItems, setProgramItems] = useState(defaultPrograms);
  const [testimonialItems, setTestimonialItems] = useState(defaultTestimonials);
  const [testimonialSlide, setTestimonialSlide] = useState(0);
  const [scheduleItems, setScheduleItems] = useState(defaultWeeklySchedule);
  const [settings, setSettings] = useState(defaultSettings);
  const [contactRequests, setContactRequests] = useState([]);
  const [leads, setLeads] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [payments, setPayments] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  const [adminSession, setAdminSession] = useState(null);
  const [userSession, setUserSession] = useState(null);

  useEffect(() => {
    apiRequest('/api/auth/session')
      .then((data) => {
        if (data.authenticated) {
          setAdminSession({ username: data.username });
        }
      })
      .catch(() => {
        setAdminSession(null);
      });
  }, []);

  useEffect(() => {
    apiRequest('/api/auth/user-session')
      .then((data) => {
        if (data.authenticated) {
          setUserSession(data.user);
        }
      })
      .catch(() => {
        setUserSession(null);
      });
  }, []);

  useEffect(() => {
    apiRequest('/api/trainers')
      .then((data) => setTrainers(data.trainers || defaultTrainers))
      .catch(() => setTrainers(defaultTrainers));

    apiRequest('/api/gallery')
      .then((data) => setGalleryItems(data.galleryItems || defaultGalleryItems))
      .catch(() => setGalleryItems(defaultGalleryItems));

    apiRequest('/api/plans')
      .then((data) => setPricingPlans(data.plans || defaultPricingPlans))
      .catch(() => setPricingPlans(defaultPricingPlans));

    apiRequest('/api/programs')
      .then((data) => setProgramItems(data.programs || defaultPrograms))
      .catch(() => setProgramItems(defaultPrograms));

    apiRequest('/api/testimonials')
      .then((data) => setTestimonialItems(data.testimonials || defaultTestimonials))
      .catch(() => setTestimonialItems(defaultTestimonials));

    apiRequest('/api/schedule')
      .then((data) => setScheduleItems(data.schedule || defaultWeeklySchedule))
      .catch(() => setScheduleItems(defaultWeeklySchedule));

    apiRequest('/api/settings')
      .then((data) => setSettings((data.settings || [defaultSettings])[0] || defaultSettings))
      .catch(() => setSettings(defaultSettings));
  }, []);

  useEffect(() => {
    if (!adminSession) {
      setClients([]);
      setContactRequests([]);
      setLeads([]);
      setAttendance([]);
      setPayments([]);
      setProgressRecords([]);
      return;
    }

    apiRequest('/api/clients')
      .then((data) => setClients(data.clients || []))
      .catch(() => setClients([]));

    apiRequest('/api/contactRequests')
      .then((data) => setContactRequests(data.contactRequests || []))
      .catch(() => setContactRequests([]));

    apiRequest('/api/leads')
      .then((data) => setLeads(data.leads || []))
      .catch(() => setLeads([]));

    apiRequest('/api/attendance')
      .then((data) => setAttendance(data.attendance || []))
      .catch(() => setAttendance([]));

    apiRequest('/api/payments')
      .then((data) => setPayments(data.payments || []))
      .catch(() => setPayments([]));

    apiRequest('/api/progress')
      .then((data) => setProgressRecords(data.progress || []))
      .catch(() => setProgressRecords([]));
  }, [adminSession]);

  useEffect(() => {
    if (!['home', 'about'].includes(activePage) || trainers.length === 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        setTrainerSlide((current) => (current + 1) % trainers.length);
      }
    }, 5200);

    return () => window.clearInterval(timer);
  }, [activePage, trainers.length]);

  useEffect(() => {
    if (activePage !== 'home' || testimonialItems.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        setTestimonialSlide((current) => (current + 1) % testimonialItems.length);
      }
    }, 5200);

    return () => window.clearInterval(timer);
  }, [activePage, testimonialItems.length]);

  useEffect(() => {
    if (trainers.length > 0 && trainerSlide >= trainers.length) {
      setTrainerSlide(0);
    }
  }, [trainers.length, trainerSlide]);

  useEffect(() => {
    const isTestDom = window.navigator.userAgent.toLowerCase().includes('jsdom');
    if (!isTestDom && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activePage]);

  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.18 }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [activePage]);

  const navigate = useCallback(
    (pageId) => {
      const path = pageId === 'home' ? '/' : `/${pageId}`;
      navigateHook(path);
    },
    [navigateHook]
  );

  const handleAdminLogin = useCallback(async (username, password) => {
    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: { username, password },
      });
      setAdminSession({ username: data.username });
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message || 'Login failed.' };
    }
  }, []);

  const handleAdminLogout = useCallback(async () => {
    await apiRequest('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setAdminSession(null);
    setClients([]);
    setContactRequests([]);
    setLeads([]);
    setAttendance([]);
    setPayments([]);
    setProgressRecords([]);
  }, []);

  const handleUserRegister = useCallback(async (name, email, password) => {
    try {
      const data = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: { name, email, password },
      });
      setUserSession(data.user);
      navigateHook('/account');
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message || 'Registration failed.' };
    }
  }, [navigateHook]);

  const handleUserLogin = useCallback(async (email, password) => {
    try {
      const data = await apiRequest('/api/auth/user-login', {
        method: 'POST',
        body: { email, password },
      });
      setUserSession(data.user);
      navigateHook('/account');
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message || 'Login failed.' };
    }
  }, [navigateHook]);

  const handleUserLogout = useCallback(async () => {
    await apiRequest('/api/auth/user-logout', { method: 'POST' }).catch(() => {});
    setUserSession(null);
    navigateHook('/');
  }, [navigateHook]);

  const saveClientRecord = useCallback((item, editingId) => saveAdminItem('clients', item, editingId, setClients), []);
  const deleteClientRecord = useCallback((id) => deleteAdminItem('clients', id, setClients), []);
  const saveGalleryRecord = useCallback((item, editingId) => saveAdminItem('gallery', item, editingId, setGalleryItems), []);
  const deleteGalleryRecord = useCallback((id) => deleteAdminItem('gallery', id, setGalleryItems), []);
  const saveTrainerRecord = useCallback((item, editingId) => saveAdminItem('trainers', item, editingId, setTrainers), []);
  const deleteTrainerRecord = useCallback((id) => deleteAdminItem('trainers', id, setTrainers), []);
  const savePlanRecord = useCallback((item, editingId) => saveAdminItem('plans', item, editingId, setPricingPlans), []);
  const deletePlanRecord = useCallback((id) => deleteAdminItem('plans', id, setPricingPlans), []);
  const saveProgramRecord = useCallback((item, editingId) => saveAdminItem('programs', item, editingId, setProgramItems), []);
  const deleteProgramRecord = useCallback((id) => deleteAdminItem('programs', id, setProgramItems), []);
  const saveTestimonialRecord = useCallback((item, editingId) => saveAdminItem('testimonials', item, editingId, setTestimonialItems), []);
  const deleteTestimonialRecord = useCallback((id) => deleteAdminItem('testimonials', id, setTestimonialItems), []);
  const saveScheduleRecord = useCallback((item, editingId) => saveAdminItem('schedule', item, editingId, setScheduleItems), []);
  const deleteScheduleRecord = useCallback((id) => deleteAdminItem('schedule', id, setScheduleItems), []);
  const saveContactRequestRecord = useCallback((item, editingId) => saveAdminItem('contactRequests', item, editingId, setContactRequests), []);
  const deleteContactRequestRecord = useCallback((id) => deleteAdminItem('contactRequests', id, setContactRequests), []);
  const saveLeadRecord = useCallback((item, editingId) => saveAdminItem('leads', item, editingId, setLeads), []);
  const deleteLeadRecord = useCallback((id) => deleteAdminItem('leads', id, setLeads), []);
  const saveAttendanceRecord = useCallback((item, editingId) => saveAdminItem('attendance', item, editingId, setAttendance), []);
  const deleteAttendanceRecord = useCallback((id) => deleteAdminItem('attendance', id, setAttendance), []);
  const savePaymentRecord = useCallback((item, editingId) => saveAdminItem('payments', item, editingId, setPayments), []);
  const deletePaymentRecord = useCallback((id) => deleteAdminItem('payments', id, setPayments), []);
  const saveProgressRecord = useCallback((item, editingId) => saveAdminItem('progress', item, editingId, setProgressRecords), []);
  const deleteProgressRecord = useCallback((id) => deleteAdminItem('progress', id, setProgressRecords), []);
  const saveSettingsRecord = useCallback(async (item) => {
    const editingId = item.id || settings.id || 'settings-main';
    const data = await apiRequest(`/api/settings/${editingId}`, {
      method: 'PUT',
      body: { ...item, id: editingId },
    });
    setSettings((data.settings || [defaultSettings])[0] || defaultSettings);
  }, [settings.id]);
  const submitContactRequest = useCallback(async (item) => {
    await saveAdminItem('contactRequests', item, null, setContactRequests);
  }, []);
  const updateAdminProfile = useCallback(async (item) => {
    const data = await apiRequest('/api/auth/profile', {
      method: 'PUT',
      body: item,
    });
    setAdminSession(null);
    return data;
  }, []);

  const pageProps = {
    billing,
    navigate,
    setBilling,
    setTrainerSlide,
    trainerSlide,
    trainers,
    setTrainers,
    galleryItems,
    clients,
    pricingPlans,
    programs: programItems,
    testimonials: testimonialItems,
    testimonialSlide,
    setTestimonialSlide,
    scheduleItems,
    settings,
    contactRequests,
    leads,
    attendance,
    payments,
    progressRecords,
    adminSession,
    onAdminLogin: handleAdminLogin,
    onAdminLogout: handleAdminLogout,
    userSession,
    onUserLogin: handleUserLogin,
    onUserRegister: handleUserRegister,
    onUserLogout: handleUserLogout,
    googleAuthUrl: apiUrl('/api/auth/google'),
    onContactSubmit: submitContactRequest,
    updateAdminProfile,
    saveClientRecord,
    deleteClientRecord,
    saveGalleryRecord,
    deleteGalleryRecord,
    saveTrainerRecord,
    deleteTrainerRecord,
    savePlanRecord,
    deletePlanRecord,
    saveProgramRecord,
    deleteProgramRecord,
    saveTestimonialRecord,
    deleteTestimonialRecord,
    saveScheduleRecord,
    deleteScheduleRecord,
    saveSettingsRecord,
    saveContactRequestRecord,
    deleteContactRequestRecord,
    saveLeadRecord,
    deleteLeadRecord,
    saveAttendanceRecord,
    deleteAttendanceRecord,
    savePaymentRecord,
    deletePaymentRecord,
    saveProgressRecord,
    deleteProgressRecord,
  };

  return (
    <div className="app">
      <ChatbotComponent />
      <AmbientBackground />
      <div className="site-stage">
        <Header
          activePage={activePage}
          navigate={navigate}
          settings={settings}
          userSession={userSession}
          onUserLogout={handleUserLogout}
        />
        <main className="page-shell" aria-live="polite">
          <div className={`page-view page-${activePage}`} key={activePage}>
            <Routes>
              <Route path="/" element={<HomePage {...pageProps} />} />
              <Route path="/about" element={<AboutPage {...pageProps} />} />
              <Route path="/programs" element={<ProgramsPage {...pageProps} />} />
              <Route path="/pricing" element={<PricingPage {...pageProps} />} />
              <Route path="/gallery" element={<GalleryPage {...pageProps} />} />
              <Route path="/contact" element={<ContactPage {...pageProps} />} />
              <Route
                path="/login"
                element={
                  userSession ? (
                    <Navigate to="/account" replace />
                  ) : (
                    <UserLoginPage onLogin={handleUserLogin} googleAuthUrl={pageProps.googleAuthUrl} navigate={navigate} />
                  )
                }
              />
              <Route
                path="/register"
                element={
                  userSession ? (
                    <Navigate to="/account" replace />
                  ) : (
                    <UserRegisterPage onRegister={handleUserRegister} googleAuthUrl={pageProps.googleAuthUrl} navigate={navigate} />
                  )
                }
              />
              <Route
                path="/account"
                element={
                  userSession ? (
                    <UserAccountPage user={userSession} onLogout={handleUserLogout} navigate={navigate} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/admin"
                element={
                  pageProps.adminSession ? (
                    <FullAdminPage {...pageProps} adminUser={pageProps.adminSession.username} />
                  ) : (
                    <AdminLoginPage onLogin={pageProps.onAdminLogin} />
                  )
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

const Header = React.memo(function Header({ activePage, navigate, settings, userSession, onUserLogout }) {
  return (
    <header className="top-nav">
      <button className="brand" type="button" onClick={() => navigate('home')}>
        <span className="brand-mark" aria-hidden="true" />
        <span>{settings.gymName || 'Volt Fitness'}</span>
      </button>

      <nav className="nav-links" aria-label="Primary navigation">
        {publicRoutes.map((route) => (
          <button
            className="nav-link"
            data-active={activePage === route.id}
            key={route.id}
            onClick={() => navigate(route.id)}
            type="button"
          >
            {route.label}
          </button>
        ))}
        {userSession ? (
          <span className="auth-widget">
            <button className="nav-link" data-active={activePage === 'account'} type="button" onClick={() => navigate('account')}>
              {userSession.name}
            </button>
            <button className="ghost-action" type="button" onClick={onUserLogout}>Logout</button>
          </span>
        ) : (
          <button className="nav-link" data-active={activePage === 'login' || activePage === 'register'} type="button" onClick={() => navigate('login')}>
            Login
          </button>
        )}
      </nav>

      <GlowButton label="Join Now" onClick={() => navigate('contact')} />
    </header>
  );
});

const HomePage = React.memo(function HomePage({
  navigate,
  trainerSlide,
  setTrainerSlide,
  trainers,
  testimonials,
  settings,
  testimonialSlide,
  setTestimonialSlide,
}) {
  return (
    <div className="screen-grid">
      <section className="main-panel">
        <Hero navigate={navigate} settings={settings} />
        <FeatureBand navigate={navigate} />
        <KineticStrip items={kineticLines.home} />
        <BigMoment
          accent="cyan"
          image={images.studio}
          kicker="Training floor"
          title="Big-room energy with coach-level precision."
          copy="Move between strength stations, conditioning lanes, and recovery space without losing tempo. The floor is built for people who like their training sharp, loud, and measurable."
          metrics={[
            { value: '42k', label: 'sq ft floor' },
            { value: '18', label: 'coach stations' },
            { value: '4', label: 'training zones' },
          ]}
        />
        <TrainerDeck
          title="Trainers Preview"
          trainers={trainers}
          trainerSlide={trainerSlide}
          setTrainerSlide={setTrainerSlide}
        />
      </section>
      <aside className="side-panel">
        <MiniTrainerPreview trainers={trainers} trainerSlide={trainerSlide} setTrainerSlide={setTrainerSlide} />
        <MembershipHighlights />
        <Testimonials items={testimonials} testimonialSlide={testimonialSlide} setTestimonialSlide={setTestimonialSlide} />
        <FooterMini settings={settings} />
      </aside>
    </div>
  );
});

function Hero({ navigate, settings }) {
  return (
    <section className="hero reveal" style={imageStyle(images.hero)}>
      <div className="hero-copy">
        <p className="eyebrow">Premium coaching. State-of-the-art equipment.</p>
        <h1>{settings.heroTitle || defaultSettings.heroTitle}</h1>
        <p className="hero-text">
          {settings.heroSubtitle || defaultSettings.heroSubtitle}
        </p>
        <div className="hero-actions">
          <GlowButton label="Get Started" variant="orange" onClick={() => navigate('contact')} />
          <GlowButton label="Explore Programs" variant="outline" onClick={() => navigate('programs')} />
        </div>
      </div>
      <div className="hero-stat-grid" aria-label="Volt Fitness highlights">
        <Metric value="24/7" label="Gym access" />
        <Metric value="50+" label="Classes weekly" />
        <Metric value="6" label="Training zones" />
      </div>
    </section>
  );
}

function FeatureBand({ navigate }) {
  return (
    <section className="feature-band">
      {featureCards.map((card, index) => (
        <button
          className={`glass-card feature-card reveal accent-${card.accent}`}
          key={card.title}
          onClick={() => navigate(index === 2 ? 'contact' : 'programs')}
          style={{ '--delay': `${index * 100}ms` }}
          type="button"
        >
          <span className="icon-tile">
            <Icon name={card.icon} />
          </span>
          <span className="card-title">{card.title}</span>
          <span className="card-copy">{card.body}</span>
        </button>
      ))}
    </section>
  );
}

function TrainerDeck({ title, trainers, trainerSlide, setTrainerSlide, compact = false }) {
  const visibleTrainers = useMemo(
    () => loopSlice(trainers, trainerSlide, compact ? 2 : 3),
    [compact, trainerSlide, trainers]
  );
  const activeIndex = trainers.length ? trainerSlide % trainers.length : 0;

  return (
    <section className={`trainer-section ${compact ? 'compact' : ''} reveal`}>
      <SectionHeader
        eyebrow="Coach lineup"
        title={title}
        action={
          <div className="arrow-group" aria-label="Trainer controls">
            <IconButton label="Previous trainer" icon="arrowLeft" onClick={() => setTrainerSlide((current) => previousIndex(current, trainers.length))} />
            <IconButton label="Next trainer" icon="arrowRight" onClick={() => setTrainerSlide((current) => nextIndex(current, trainers.length))} />
          </div>
        }
      />
      <div className="trainer-grid">
        {visibleTrainers.length === 0 && <EmptyPanel title="No trainers yet" body="Add trainers from the admin panel." />}
        {visibleTrainers.map((trainer, index) => (
          <TrainerCard trainer={trainer} key={`${trainer.name}-${index}`} />
        ))}
      </div>
      {trainers.length > 0 && <Dots activeIndex={activeIndex} count={trainers.length} onSelect={setTrainerSlide} />}
    </section>
  );
}

function MiniTrainerPreview({ trainers, trainerSlide, setTrainerSlide }) {
  const preview = loopSlice(trainers, trainerSlide, 3);
  const activeIndex = trainers.length ? trainerSlide % trainers.length : 0;
  return (
    <section className="side-block trainer-preview reveal">
      <SectionHeader eyebrow="Live coach cards" title="Trainers Preview" />
      <div className="mini-trainer-row">
        {preview.length === 0 && <EmptyPanel title="No trainers yet" body="Create trainer cards in Admin." />}
        {preview.map((trainer, index) => (
          <button
            className={`mini-trainer accent-${trainer.accent}`}
            key={`${trainer.name}-mini-${index}`}
            onClick={() => setTrainerSlide((trainerSlide + index) % trainers.length)}
            style={imageStyle(trainer.image)}
            type="button"
          >
            <span className="mini-fade" />
            <span className="mini-meta">
              <strong>{trainer.name}</strong>
              <span>{trainer.role}</span>
            </span>
            <span className="rating">
              <Icon name="star" />
              {trainer.rating}
            </span>
          </button>
        ))}
      </div>
      {trainers.length > 0 && <Dots activeIndex={activeIndex} count={trainers.length} onSelect={setTrainerSlide} small />}
    </section>
  );
}

function MembershipHighlights() {
  return (
    <section className="side-block reveal">
      <SectionHeader eyebrow="Momentum" title="Membership Highlights" />
      <div className="highlight-grid">
        <div className="bar-stack">
          {highlights.map((item) => (
            <div className="progress-item" key={item.label}>
              <div className="progress-meta">
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
              <span className="progress-track">
                <span className="progress-fill" style={{ '--progress': item.value }} />
              </span>
            </div>
          ))}
        </div>
        <div className="number-stack">
          <Metric value="50+" label="Classes / Week" />
          <Metric value="59" label="Coach-led hours" />
          <Metric value="20+" label="Recovery tools" />
          <Metric value="50+" label="Pro sessions" />
        </div>
      </div>
    </section>
  );
}

function Testimonials({ items = defaultTestimonials, testimonialSlide, setTestimonialSlide }) {
  const visibleItems = items.length ? items : defaultTestimonials;
  const activeIndex = visibleItems.length > 0 ? testimonialSlide % visibleItems.length : 0;
  const activeTestimonial = visibleItems[activeIndex];
  return (
    <section className="side-block reveal">
      <SectionHeader eyebrow="Member voices" title="Testimonials" />
      <div className="testimonial-row">
        {activeTestimonial ? (
          <article className="testimonial-card" key={activeTestimonial.id}>
            <span className="avatar" aria-hidden="true">{activeTestimonial.name.slice(0, 1)}</span>
            <p>"{activeTestimonial.quote}"</p>
            <strong>{activeTestimonial.name}</strong>
          </article>
        ) : (
          <EmptyPanel title="No testimonials" body="No member reviews available yet." />
        )}
      </div>
      {visibleItems.length > 1 && <Dots activeIndex={activeIndex} count={visibleItems.length} onSelect={setTestimonialSlide} small />}
    </section>
  );
}

const AboutPage = React.memo(function AboutPage({ navigate, trainerSlide, setTrainerSlide, trainers }) {
  return (
    <div className="screen-grid">
      <section className="main-panel about-main">
        <section className="story-block reveal">
          <div className="story-image" style={imageStyle(images.class)} aria-hidden="true" />
          <div className="story-copy">
            <p className="eyebrow">Our story</p>
            <h1>Built for people who want the room to push back.</h1>
            <p>
              Volt Fitness started as a coaching-first training floor where the
              lights, music, programming, and coach attention all pull in the
              same direction: measurable progress.
            </p>
            <p>
              Every zone is designed for repeated use, fast transitions, and
              serious coaching. You can lift heavy, sprint hard, recover well,
              and keep your plan visible every week.
            </p>
          </div>
        </section>

        <div className="mission-grid">
          <InfoCard icon="chart" title="Mission" body="Make elite training feel clear, energetic, and repeatable." accent="orange" />
          <InfoCard icon="eye" title="Vision" body="A performance club where every member can see progress weekly." accent="cyan" />
        </div>

        <KineticStrip items={kineticLines.about} />
        <BigMoment
          accent="orange"
          image={images.studio}
          kicker="Club culture"
          title="A room that makes effort feel contagious."
          copy="The coaches keep the work specific, the music keeps the pace high, and the layout keeps everyone moving. This is a gym designed around momentum."
          metrics={stats}
        />

        <TrainerDeck
          title="Meet Our Expert Trainers"
          trainers={trainers}
          trainerSlide={trainerSlide}
          setTrainerSlide={setTrainerSlide}
        />
      </section>

      <aside className="side-panel about-side">
        <section className="side-block reveal">
          <SectionHeader eyebrow="Impact" title="Our Impact" />
          <div className="impact-grid">
            {stats.map((item) => (
              <Metric key={item.label} value={item.value} label={item.label} />
            ))}
          </div>
        </section>
        <section className="side-block reveal">
          <SectionHeader eyebrow="Method" title="How Volt Moves" />
          <div className="method-list">
            <InfoLine icon="target" title="Assess" body="Movement screen and goal mapping." />
            <InfoLine icon="calendar" title="Program" body="Weekly structure for strength and conditioning." />
            <InfoLine icon="chart" title="Progress" body="Visible metrics, coach notes, and next steps." />
          </div>
          <GlowButton label="Start Assessment" onClick={() => navigate('contact')} />
        </section>
        <TrainerDeck
          compact
          title="Coach Spotlight"
          trainers={trainers}
          trainerSlide={trainerSlide}
          setTrainerSlide={setTrainerSlide}
        />
      </aside>
    </div>
  );
});

const ProgramsPage = React.memo(function ProgramsPage({ navigate, programs, scheduleItems }) {
  const visiblePrograms = programs.length ? programs : defaultPrograms;
  return (
    <div className="screen-grid">
      <section className="main-panel">
        <PageIntro eyebrow="Services / Programs" title="Choose the training lane that fits your next goal." />
        <KineticStrip items={kineticLines.programs} />
        <div className="program-grid">
          {visiblePrograms.map((program, index) => (
            <ProgramCard
              key={program.title}
              program={program}
              onClick={() => navigate('contact')}
              style={{ '--delay': `${index * 80}ms` }}
            />
          ))}
        </div>
        <ZoneShowcase />
      </section>
      <aside className="side-panel">
        <section className="side-block reveal feature-side-card" style={imageStyle(images.coaching)}>
          <div className="feature-side-copy">
            <p className="eyebrow">Personal Training</p>
            <h2>One-on-one coaching with live form feedback.</h2>
            <GlowButton label="Learn More" variant="split" onClick={() => navigate('contact')} />
          </div>
        </section>
        <section className="side-block reveal">
          <SectionHeader eyebrow="Class pulse" title="This Week" />
          <ScheduleList items={scheduleItems} />
        </section>
        <section className="side-block reveal">
          <SectionHeader eyebrow="Quick Pick" title="Best For You" />
          <div className="method-list">
            <InfoLine icon="dumbbell" title="Build muscle" body="Start with Weight Training." />
            <InfoLine icon="timer" title="Burn fast" body="Use HIIT Classes twice weekly." />
            <InfoLine icon="leaf" title="Move better" body="Add Yoga & Mobility." />
          </div>
        </section>
      </aside>
    </div>
  );
});

const PricingPage = React.memo(function PricingPage({ billing, setBilling, navigate, pricingPlans }) {
  const visiblePlans = normalizePricingPlans(pricingPlans.length ? pricingPlans : defaultPricingPlans);
  const selectedPlan = visiblePlans[1] || visiblePlans[0] || normalizePricingPlans(defaultPricingPlans)[0];
  return (
    <div className="screen-grid">
      <section className="main-panel">
        <PageIntro eyebrow="Membership / Pricing" title="Pick your plan, then let the week start moving." />
        <BillingToggle billing={billing} setBilling={setBilling} />
        <KineticStrip items={kineticLines.pricing} />
        <div className="pricing-grid">
          {visiblePlans.map((plan, index) => (
            <PricingCard
              billing={billing}
              key={plan.name}
              onClick={() => navigate('contact')}
              plan={plan}
              style={{ '--delay': `${index * 100}ms` }}
            />
          ))}
        </div>
        <BigMoment
          accent="cyan"
          image={images.lockers}
          kicker="Membership feel"
          title="Premium access should feel obvious the second you walk in."
          copy="Every plan keeps the core training experience bold: coached classes, polished equipment, recovery support, and a floor that does not feel asleep."
          metrics={[
            { value: '24/7', label: 'access' },
            { value: '50+', label: 'classes' },
            { value: '0', label: 'boring corners' },
          ]}
        />
      </section>
      <aside className="side-panel pricing-side">
        <section className="side-block reveal">
          <PageIntro eyebrow="Pricing" title="Yearly members save 20%." compact />
          <BillingToggle billing={billing} setBilling={setBilling} compact />
        </section>
        <section className="plan-spotlight reveal">
          <p className="eyebrow">Most Popular</p>
          <h2>{selectedPlan.name}</h2>
          <div className="spotlight-price">
            <span>${selectedPlan.price[billing]}</span>
            <small>/mo</small>
          </div>
          <ul>
            {selectedPlan.features.map((feature) => (
              <li key={feature}>
                <Icon name="check" />
                {feature}
              </li>
            ))}
          </ul>
          <GlowButton label="Join Now" onClick={() => navigate('contact')} />
        </section>
      </aside>
    </div>
  );
});

const GalleryPage = React.memo(function GalleryPage({ galleryItems }) {
  const featuredItems = galleryItems.length
    ? loopSlice(galleryItems, 3, Math.min(3, galleryItems.length))
    : [];
  return (
    <div className="screen-grid gallery-layout">
      <section className="main-panel">
        <PageIntro eyebrow="Gallery" title="A moving look at the training floor." />
        <KineticStrip items={kineticLines.gallery} />
        <div className="gallery-grid">
          {galleryItems.length === 0 && <EmptyPanel title="No gallery media" body="Add images or videos in Admin." />}
          {galleryItems.map((item, index) => (
            <GalleryTile item={item} key={item.title} style={{ '--delay': `${index * 70}ms` }} />
          ))}
        </div>
        <BigMoment
          accent="orange"
          image={images.class}
          kicker="Atmosphere"
          title="Dark rooms, bright lines, and equipment that asks to be used."
          copy="The visual energy is part of the training energy: bold lighting, clean zones, deep contrast, and enough motion to make every session feel like an event."
          metrics={[
            { value: '9', label: 'photo zones' },
            { value: '6', label: 'light moods' },
            { value: '360', label: 'floor views' },
          ]}
        />
      </section>
      <aside className="side-panel gallery-side">
        {featuredItems.length === 0 && <section className="side-block reveal"><EmptyPanel title="No featured media" body="Gallery media will appear here." /></section>}
        {featuredItems.map((item) => (
          <GalleryFeature item={item} key={`feature-${item.id || item.title}`} />
        ))}
      </aside>
    </div>
  );
});

const ContactPage = React.memo(function ContactPage({ onContactSubmit, settings, scheduleItems }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', goal: 'strength', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [sending, setSending] = useState(false);

  const submitRequest = async (event) => {
    event.preventDefault();
    setSending(true);
    setFormStatus('');
    try {
      await onContactSubmit({
        ...form,
        status: 'New',
        source: 'Website',
      });
      setForm({ name: '', email: '', phone: '', goal: 'strength', message: '' });
      setFormStatus('Request sent. The team can now see it in Admin.');
    } catch (error) {
      setFormStatus(error.message || 'Could not send request.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="screen-grid">
      <section className="main-panel contact-main">
        <PageIntro eyebrow="Contact" title="Book a tour, claim a trial, or ask for a coach match." />
        <KineticStrip items={kineticLines.contact} />
        <div className="contact-grid">
          <form className="contact-form reveal" onSubmit={submitRequest}>
            <label>
              Name
              <input name="name" placeholder="Your name" required type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label>
              Email
              <input name="email" placeholder="you@example.com" required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </label>
            <label>
              Phone
              <input name="phone" placeholder="+1 555 000 0000" type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            </label>
            <label>
              Goal
              <select name="goal" value={form.goal} onChange={(event) => setForm({ ...form, goal: event.target.value })}>
                <option value="strength">Build strength</option>
                <option value="conditioning">Improve conditioning</option>
                <option value="coaching">Find a trainer</option>
                <option value="nutrition">Nutrition coaching</option>
              </select>
            </label>
            <label>
              Message
              <textarea name="message" placeholder="Tell us what you want to work on" rows="5" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
            </label>
            {formStatus && <p className="form-status">{formStatus}</p>}
            <GlowButton label={sending ? 'Sending...' : 'Send Request'} type="submit" />
          </form>

          <div className="contact-stack">
            <InfoCard icon="phone" title="Call" body={settings.phone} accent="cyan" />
            <InfoCard icon="mail" title="Email" body={settings.email} accent="orange" />
            <InfoCard icon="map" title="Visit" body={settings.address} accent="cyan" />
          </div>
        </div>
        <BigMoment
          accent="cyan"
          image={images.hero}
          kicker="First visit"
          title="Walk in for the tour. Leave with your first week mapped."
          copy="A coach will show you the floor, ask what you want to change, and point you toward the program that fits your current training life."
          metrics={[
            { value: '30m', label: 'tour slot' },
            { value: '1:1', label: 'coach match' },
            { value: '7d', label: 'trial pass' },
          ]}
        />
      </section>
      <aside className="side-panel">
        <section className="side-block reveal map-panel">
          <div className="map-grid" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="map-pin">
            <Icon name="map" />
          </div>
        </section>
        <section className="side-block reveal">
          <SectionHeader eyebrow="Class pulse" title="Next Sessions" />
          <ScheduleList items={scheduleItems} />
        </section>
        <FooterMini settings={settings} />
      </aside>
    </div>
  );
});

const AdminLoginPage = React.memo(function AdminLoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const submitLogin = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const result = await onLogin(username, password);
    setBusy(false);

    if (!result.ok) {
      setMessage(result.message);
    }
  };

  return (
    <div className="admin-layout">
      <section className="main-panel admin-main admin-login-main">
        <div className="admin-login-card">
          <p className="eyebrow">Admin Login</p>
          <h1>Secure access required.</h1>
          <p className="security-note">
            Use the admin username and password to open the management panel.
            The password is checked on the backend and is not stored in the React app.
          </p>
          <form className="admin-form login-form" onSubmit={submitLogin}>
            <AdminInput label="Username" value={username} onChange={setUsername} required />
            <AdminInput label="Password" type="password" value={password} onChange={setPassword} required />
            {message && <p className="login-error">{message}</p>}
            <div className="admin-actions">
              <GlowButton label={busy ? 'Checking...' : 'Login'} type="submit" />
            </div>
          </form>
        </div>
      </section>
    </div>
  );
});

const UserLoginPage = React.memo(function UserLoginPage({ onLogin, googleAuthUrl, navigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const submitLogin = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const result = await onLogin(email, password);
    setBusy(false);

    if (!result.ok) {
      setMessage(result.message);
    }
  };

  return (
    <div className="admin-layout">
      <section className="main-panel admin-main admin-login-main">
        <div className="admin-login-card">
          <p className="eyebrow">Member Login</p>
          <h1>Welcome back.</h1>
          <p className="security-note">Log in to view your membership and training details.</p>
          <form className="admin-form login-form" onSubmit={submitLogin}>
            <AdminInput label="Email" type="email" value={email} onChange={setEmail} required />
            <AdminInput label="Password" type="password" value={password} onChange={setPassword} required />
            {message && <p className="login-error">{message}</p>}
            <div className="admin-actions">
              <GlowButton label={busy ? 'Checking...' : 'Login'} type="submit" />
            </div>
          </form>
          <div className="auth-divider"><span>or</span></div>
          <GlowButton
            label="Continue with Google"
            variant="outline"
            onClick={() => { window.location.href = googleAuthUrl; }}
          />
          <p className="auth-switch">
            New here?{' '}
            <button className="link-button" type="button" onClick={() => navigate('register')}>Create an account</button>
          </p>
        </div>
      </section>
    </div>
  );
});

const UserRegisterPage = React.memo(function UserRegisterPage({ onRegister, googleAuthUrl, navigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const submitRegister = async (event) => {
    event.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setBusy(true);
    const result = await onRegister(name, email, password);
    setBusy(false);

    if (!result.ok) {
      setMessage(result.message);
    }
  };

  return (
    <div className="admin-layout">
      <section className="main-panel admin-main admin-login-main">
        <div className="admin-login-card">
          <p className="eyebrow">Create Account</p>
          <h1>Join Volt Fitness.</h1>
          <p className="security-note">Register with your email, or continue with Google.</p>
          <form className="admin-form login-form" onSubmit={submitRegister}>
            <AdminInput label="Full Name" value={name} onChange={setName} required />
            <AdminInput label="Email" type="email" value={email} onChange={setEmail} required />
            <AdminInput label="Password" type="password" value={password} onChange={setPassword} required />
            <AdminInput label="Confirm Password" type="password" value={confirmPassword} onChange={setConfirmPassword} required />
            {message && <p className="login-error">{message}</p>}
            <div className="admin-actions">
              <GlowButton label={busy ? 'Creating...' : 'Create Account'} type="submit" />
            </div>
          </form>
          <div className="auth-divider"><span>or</span></div>
          <GlowButton
            label="Sign up with Google"
            variant="outline"
            onClick={() => { window.location.href = googleAuthUrl; }}
          />
          <p className="auth-switch">
            Already a member?{' '}
            <button className="link-button" type="button" onClick={() => navigate('login')}>Log in</button>
          </p>
        </div>
      </section>
    </div>
  );
});

const UserAccountPage = React.memo(function UserAccountPage({ user, onLogout, navigate }) {
  return (
    <div className="admin-layout">
      <section className="main-panel admin-main admin-login-main">
        <div className="admin-login-card">
          <p className="eyebrow">My Account</p>
          <h1>Hi, {user.name}.</h1>
          <div className="admin-list">
            <article className="admin-record">
              <div>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <span>
                  Signed in with {user.provider === 'google' ? 'Google' : 'email and password'}
                  {user.createdAt ? ` / Member since ${new Date(user.createdAt).toLocaleDateString()}` : ''}
                </span>
              </div>
            </article>
          </div>
          <div className="admin-actions">
            <GlowButton label="Browse Programs" onClick={() => navigate('programs')} />
            <button className="ghost-action" type="button" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </section>
    </div>
  );
});

const FullAdminPage = React.memo(function FullAdminPage({
  clients,
  galleryItems,
  trainers,
  pricingPlans,
  programs,
  testimonials,
  scheduleItems,
  settings,
  contactRequests,
  leads,
  attendance,
  payments,
  progressRecords,
  adminUser,
  onAdminLogout,
  updateAdminProfile,
  saveClientRecord,
  deleteClientRecord,
  saveGalleryRecord,
  deleteGalleryRecord,
  saveTrainerRecord,
  deleteTrainerRecord,
  savePlanRecord,
  deletePlanRecord,
  saveProgramRecord,
  deleteProgramRecord,
  saveTestimonialRecord,
  deleteTestimonialRecord,
  saveScheduleRecord,
  deleteScheduleRecord,
  saveSettingsRecord,
  saveContactRequestRecord,
  deleteContactRequestRecord,
  saveLeadRecord,
  deleteLeadRecord,
  saveAttendanceRecord,
  deleteAttendanceRecord,
  savePaymentRecord,
  deletePaymentRecord,
  saveProgressRecord,
  deleteProgressRecord,
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminError, setAdminError] = useState('');
  const [uploadingField, setUploadingField] = useState('');
  const [clientForm, setClientForm] = useState(createClientForm());
  const [galleryForm, setGalleryForm] = useState(createGalleryForm());
  const [trainerForm, setTrainerForm] = useState(createTrainerForm());
  const [planForm, setPlanForm] = useState(createPlanForm());
  const [programForm, setProgramForm] = useState(createProgramForm());
  const [testimonialForm, setTestimonialForm] = useState(createTestimonialForm());
  const [scheduleForm, setScheduleForm] = useState(createScheduleForm());
  const [leadForm, setLeadForm] = useState(createLeadForm());
  const [attendanceForm, setAttendanceForm] = useState(createAttendanceForm());
  const [paymentForm, setPaymentForm] = useState(createPaymentForm());
  const [progressForm, setProgressForm] = useState(createProgressForm());
  const [settingsForm, setSettingsForm] = useState(createSettingsForm(settings));
  const [profileForm, setProfileForm] = useState(createProfileForm(adminUser));
  const [editingClientId, setEditingClientId] = useState(null);
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [editingTrainerId, setEditingTrainerId] = useState(null);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editingProgramId, setEditingProgramId] = useState(null);
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [editingAttendanceId, setEditingAttendanceId] = useState(null);
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [editingProgressId, setEditingProgressId] = useState(null);

  useEffect(() => {
    setSettingsForm(createSettingsForm(settings));
  }, [settings]);

  useEffect(() => {
    setProfileForm((current) => ({ ...current, username: adminUser }));
  }, [adminUser]);

  const planNames = normalizePricingPlans(pricingPlans).map((plan) => plan.name);
  const trainerNames = trainers.map((trainer) => trainer.name);
  const clientNames = clients.map((client) => client.name);
  const tabs = [
    ['dashboard', 'Dashboard'],
    ['clients', 'Clients'],
    ['leads', 'Leads'],
    ['contacts', 'Enquiries'],
    ['plans', 'Plans'],
    ['programs', 'Programs'],
    ['schedule', 'Schedule'],
    ['trainers', 'Trainers'],
    ['gallery', 'Gallery'],
    ['testimonials', 'Reviews'],
    ['settings', 'Settings'],
    ['attendance', 'Attendance'],
    ['payments', 'Payments'],
    ['progress', 'Progress'],
    ['profile', 'Profile'],
  ];

  const saveSettings = async (event) => {
    event.preventDefault();
    setAdminError('');
    try {
      await saveSettingsRecord({ ...settingsForm, id: settingsForm.id || 'settings-main' });
      setAdminError('Website settings saved.');
    } catch (error) {
      setAdminError(error.message || 'Could not save settings.');
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setAdminError('');
    try {
      await updateAdminProfile(profileForm);
    } catch (error) {
      setAdminError(error.message || 'Could not update admin profile.');
    }
  };

  const convertRequestToLead = async (request) => {
    setAdminError('');
    try {
      await saveLeadRecord({
        id: createId('lead'),
        name: request.name,
        email: request.email,
        phone: request.phone,
        source: request.source || 'Website',
        status: 'New',
        notes: `Goal: ${request.goal || 'Not listed'}
${request.message || ''}`.trim(),
      }, null);
      await saveContactRequestRecord({ ...request, status: 'Converted' }, request.id);
    } catch (error) {
      setAdminError(error.message || 'Could not convert enquiry.');
    }
  };

  return (
    <div className="admin-layout">
      <section className="main-panel admin-main">
        <div className="admin-topbar">
          <div>
            <p className="eyebrow">Logged in as</p>
            <strong>{adminUser}</strong>
          </div>
          <button className="ghost-action" type="button" onClick={onAdminLogout}>Logout</button>
        </div>
        <PageIntro eyebrow="Admin Panel" title="Run the gym website from one place." />
        {adminError && <p className="login-error admin-error">{adminError}</p>}
        <div className="admin-tabs" role="tablist" aria-label="Admin sections">
          {tabs.map(([id, label]) => (
            <button
              aria-selected={activeTab === id}
              className={activeTab === id ? 'active' : ''}
              key={id}
              onClick={() => {
                setActiveTab(id);
                setAdminError('');
              }}
              role="tab"
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <AdminDashboard
            clients={clients}
            contactRequests={contactRequests}
            leads={leads}
            payments={payments}
            trainers={trainers}
            onExport={(name, rows) => downloadCsv(name, rows)}
          />
        )}

        {activeTab === 'clients' && (
          <ManagedCrudSection
            title="Add Client"
            asideTitle="Client Records"
            items={clients}
            form={clientForm}
            setForm={setClientForm}
            createForm={createClientForm}
            editingId={editingClientId}
            setEditingId={setEditingClientId}
            idPrefix="client"
            onSaveRecord={saveClientRecord}
            onDeleteRecord={deleteClientRecord}
            onError={setAdminError}
            fields={[
              { name: 'name', label: 'Full Name', required: true },
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'phone', label: 'Phone' },
              { name: 'age', label: 'Age' },
              { name: 'height', label: 'Height' },
              { name: 'weight', label: 'Weight' },
              { name: 'plan', label: 'Plan', type: 'select', options: planNames.length ? planNames : ['Basic', 'Standard', 'Premium'] },
              { name: 'trainer', label: 'Trainer', type: 'select', options: uniqueOptions(['Unassigned', ...trainerNames]) },
              { name: 'startDate', label: 'Start Date', type: 'date' },
              { name: 'goal', label: 'Goal', wide: true },
              { name: 'notes', label: 'Full Details / Notes', type: 'textarea' },
            ]}
            getTitle={(client) => client.name}
            getBody={(client) => client.goal || client.notes}
            getMeta={(client) => `${client.plan || 'No plan'} / ${client.trainer || 'Unassigned'}`}
          />
        )}

        {activeTab === 'leads' && (
          <ManagedCrudSection
            title="Add Lead"
            asideTitle="Lead Pipeline"
            items={leads}
            form={leadForm}
            setForm={setLeadForm}
            createForm={createLeadForm}
            editingId={editingLeadId}
            setEditingId={setEditingLeadId}
            idPrefix="lead"
            onSaveRecord={saveLeadRecord}
            onDeleteRecord={deleteLeadRecord}
            onError={setAdminError}
            fields={[
              { name: 'name', label: 'Name', required: true },
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'phone', label: 'Phone' },
              { name: 'source', label: 'Source', type: 'select', options: ['Website', 'Walk-in', 'Instagram', 'Referral', 'Phone'] },
              { name: 'status', label: 'Status', type: 'select', options: ['New', 'Contacted', 'Trial booked', 'Joined', 'Lost'] },
              { name: 'notes', label: 'Lead Notes', type: 'textarea' },
            ]}
            getTitle={(lead) => lead.name}
            getBody={(lead) => lead.notes || lead.email}
            getMeta={(lead) => `${lead.status || 'New'} / ${lead.source || 'Website'}`}
          />
        )}

        {activeTab === 'contacts' && (
          <AdminInbox
            contactRequests={contactRequests}
            onExport={() => downloadCsv('enquiries.csv', contactRequests)}
            onStatus={(request, status) => saveContactRequestRecord({ ...request, status }, request.id).catch((error) => setAdminError(error.message))}
            onConvert={convertRequestToLead}
            onDelete={(id) => deleteContactRequestRecord(id).catch((error) => setAdminError(error.message))}
          />
        )}

        {activeTab === 'plans' && (
          <ManagedCrudSection
            title="Add Plan"
            asideTitle="Membership Plans"
            items={pricingPlans}
            form={planForm}
            setForm={setPlanForm}
            createForm={createPlanForm}
            toForm={planToForm}
            editingId={editingPlanId}
            setEditingId={setEditingPlanId}
            idPrefix="plan"
            onSaveRecord={savePlanRecord}
            onDeleteRecord={deletePlanRecord}
            onError={setAdminError}
            fields={[
              { name: 'name', label: 'Plan Name', required: true },
              { name: 'monthly', label: 'Monthly Price' },
              { name: 'yearly', label: 'Yearly Price' },
              { name: 'accent', label: 'Accent', type: 'select', options: ['cyan', 'orange'] },
              { name: 'tag', label: 'Tag' },
              { name: 'summary', label: 'Summary', wide: true },
              { name: 'features', label: 'Features (one per line)', type: 'textarea' },
            ]}
            getTitle={(plan) => plan.name}
            getBody={(plan) => plan.summary}
            getMeta={(plan) => `$${plan.monthly || plan.price?.monthly || 0}/mo / ${featuresToText(plan.features).split('\n').length} features`}
          />
        )}

        {activeTab === 'programs' && (
          <ManagedCrudSection
            title="Add Program"
            asideTitle="Programs / Services"
            items={programs}
            form={programForm}
            setForm={setProgramForm}
            createForm={createProgramForm}
            editingId={editingProgramId}
            setEditingId={setEditingProgramId}
            idPrefix="program"
            onSaveRecord={saveProgramRecord}
            onDeleteRecord={deleteProgramRecord}
            onError={setAdminError}
            uploadingField={uploadingField}
            setUploadingField={setUploadingField}
            fields={[
              { name: 'title', label: 'Title', required: true },
              { name: 'icon', label: 'Icon', type: 'select', options: ['dumbbell', 'heart', 'person', 'timer', 'leaf', 'target', 'chart', 'calendar'] },
              { name: 'accent', label: 'Accent', type: 'select', options: ['cyan', 'orange'] },
              { name: 'image', label: 'Image URL', wide: true },
              { name: 'upload', label: 'Upload Image', type: 'file', accept: 'image/*', target: 'image', wide: true },
              { name: 'body', label: 'Description', type: 'textarea' },
            ]}
            getPreview={(program) => <span className="admin-thumb" style={imageStyle(program.image)} />}
            getTitle={(program) => program.title}
            getBody={(program) => program.body}
            getMeta={(program) => `${program.icon || 'bolt'} / ${program.accent || 'cyan'}`}
          />
        )}

        {activeTab === 'schedule' && (
          <ManagedCrudSection
            title="Add Class"
            asideTitle="Class Schedule"
            items={scheduleItems}
            form={scheduleForm}
            setForm={setScheduleForm}
            createForm={createScheduleForm}
            editingId={editingScheduleId}
            setEditingId={setEditingScheduleId}
            idPrefix="schedule"
            onSaveRecord={saveScheduleRecord}
            onDeleteRecord={deleteScheduleRecord}
            onError={setAdminError}
            fields={[
              { name: 'day', label: 'Day', type: 'select', options: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
              { name: 'time', label: 'Time' },
              { name: 'className', label: 'Class Name', required: true },
              { name: 'trainer', label: 'Trainer', type: 'select', options: uniqueOptions(['Unassigned', ...trainerNames]) },
            ]}
            getTitle={(item) => item.className}
            getBody={(item) => item.trainer || 'Unassigned'}
            getMeta={(item) => `${item.day} / ${item.time}`}
          />
        )}

        {activeTab === 'trainers' && (
          <ManagedCrudSection
            title="Add Trainer"
            asideTitle="Trainer Cards"
            items={trainers}
            form={trainerForm}
            setForm={setTrainerForm}
            createForm={createTrainerForm}
            editingId={editingTrainerId}
            setEditingId={setEditingTrainerId}
            idPrefix="trainer"
            onSaveRecord={saveTrainerRecord}
            onDeleteRecord={deleteTrainerRecord}
            onError={setAdminError}
            uploadingField={uploadingField}
            setUploadingField={setUploadingField}
            fields={[
              { name: 'name', label: 'Name', required: true },
              { name: 'role', label: 'Specialty / Role', required: true },
              { name: 'rating', label: 'Rating' },
              { name: 'clients', label: 'Clients Transformed' },
              { name: 'years', label: 'Years Experience' },
              { name: 'accent', label: 'Accent', type: 'select', options: ['cyan', 'orange'] },
              { name: 'image', label: 'Trainer Image URL', wide: true },
              { name: 'upload', label: 'Upload Image', type: 'file', accept: 'image/*', target: 'image', wide: true },
            ]}
            getPreview={(trainer) => <span className="admin-avatar" style={imageStyle(trainer.image)} />}
            getTitle={(trainer) => trainer.name}
            getBody={(trainer) => trainer.role}
            getMeta={(trainer) => `${trainer.rating} rating / ${trainer.clients} clients / ${trainer.years} years`}
          />
        )}

        {activeTab === 'gallery' && (
          <ManagedCrudSection
            title="Add Gallery Media"
            asideTitle="Gallery Media"
            items={galleryItems}
            form={galleryForm}
            setForm={setGalleryForm}
            createForm={createGalleryForm}
            editingId={editingGalleryId}
            setEditingId={setEditingGalleryId}
            idPrefix="gallery"
            onSaveRecord={saveGalleryRecord}
            onDeleteRecord={deleteGalleryRecord}
            onError={setAdminError}
            uploadingField={uploadingField}
            setUploadingField={setUploadingField}
            preparePayload={(formValue, editingIdValue) => ({
              ...formValue,
              id: editingIdValue || createId('gallery'),
              image: formValue.image || images.studio,
              type: formValue.type || 'image',
              wide: Boolean(formValue.wide),
            })}
            fields={[
              { name: 'title', label: 'Title', required: true },
              { name: 'type', label: 'Type', type: 'select', options: ['image', 'video'] },
              { name: 'accent', label: 'Accent', type: 'select', options: ['cyan', 'orange'] },
              { name: 'image', label: 'Image / Video URL', wide: true },
              { name: 'upload', label: 'Upload Media', type: 'file', accept: 'image/*,video/*', target: 'image', mediaTypeField: 'type', wide: true },
              { name: 'wide', label: 'Wide tile', type: 'checkbox' },
            ]}
            getPreview={(item) => <AdminMediaPreview item={item} />}
            getTitle={(item) => item.title}
            getBody={(item) => item.type || 'image'}
            getMeta={(item) => `${item.wide ? 'wide' : 'normal'} / ${item.accent || 'cyan'}`}
          />
        )}

        {activeTab === 'testimonials' && (
          <ManagedCrudSection
            title="Add Testimonial"
            asideTitle="Member Reviews"
            items={testimonials}
            form={testimonialForm}
            setForm={setTestimonialForm}
            createForm={createTestimonialForm}
            editingId={editingTestimonialId}
            setEditingId={setEditingTestimonialId}
            idPrefix="testimonial"
            onSaveRecord={saveTestimonialRecord}
            onDeleteRecord={deleteTestimonialRecord}
            onError={setAdminError}
            fields={[
              { name: 'name', label: 'Member Name', required: true },
              { name: 'quote', label: 'Quote', type: 'textarea' },
            ]}
            getTitle={(item) => item.name}
            getBody={(item) => item.quote}
            getMeta={() => 'Website testimonial'}
          />
        )}

        {activeTab === 'settings' && (
          <AdminSection
            title="Website Settings"
            asideTitle="Live Website Info"
            count={1}
            form={
              <form className="admin-form" onSubmit={saveSettings}>
                <AdminInput label="Gym Name" value={settingsForm.gymName} onChange={(value) => setSettingsForm({ ...settingsForm, gymName: value })} required />
                <AdminInput label="Phone" value={settingsForm.phone} onChange={(value) => setSettingsForm({ ...settingsForm, phone: value })} />
                <AdminInput label="Email" type="email" value={settingsForm.email} onChange={(value) => setSettingsForm({ ...settingsForm, email: value })} />
                <AdminInput label="Address" value={settingsForm.address} onChange={(value) => setSettingsForm({ ...settingsForm, address: value })} />
                <AdminInput label="Facebook Link" value={settingsForm.facebook} onChange={(value) => setSettingsForm({ ...settingsForm, facebook: value })} />
                <AdminInput label="Instagram Link" value={settingsForm.instagram} onChange={(value) => setSettingsForm({ ...settingsForm, instagram: value })} />
                <AdminInput label="YouTube Link" value={settingsForm.youtube} onChange={(value) => setSettingsForm({ ...settingsForm, youtube: value })} />
                <AdminInput label="Hero Title" value={settingsForm.heroTitle} onChange={(value) => setSettingsForm({ ...settingsForm, heroTitle: value })} wide />
                <AdminTextarea label="Hero Subtitle" value={settingsForm.heroSubtitle} onChange={(value) => setSettingsForm({ ...settingsForm, heroSubtitle: value })} />
                <div className="admin-actions">
                  <GlowButton label="Save Settings" type="submit" />
                </div>
              </form>
            }
            list={
              <div className="admin-list">
                <article className="admin-record">
                  <div>
                    <h3>{settingsForm.gymName}</h3>
                    <p>{settingsForm.heroTitle}</p>
                    <span>{settingsForm.phone} / {settingsForm.email}</span>
                  </div>
                </article>
                <article className="admin-record">
                  <div>
                    <h3>Location</h3>
                    <p>{settingsForm.address}</p>
                    <span>Footer and contact page use this information.</span>
                  </div>
                </article>
              </div>
            }
          />
        )}

        {activeTab === 'attendance' && (
          <ManagedCrudSection
            title="Add Attendance"
            asideTitle="Attendance Log"
            items={attendance}
            form={attendanceForm}
            setForm={setAttendanceForm}
            createForm={createAttendanceForm}
            editingId={editingAttendanceId}
            setEditingId={setEditingAttendanceId}
            idPrefix="attendance"
            onSaveRecord={saveAttendanceRecord}
            onDeleteRecord={deleteAttendanceRecord}
            onError={setAdminError}
            fields={[
              { name: 'clientName', label: 'Client', type: 'select', options: uniqueOptions(['Walk-in', ...clientNames]) },
              { name: 'date', label: 'Date', type: 'date' },
              { name: 'status', label: 'Status', type: 'select', options: ['Present', 'Missed', 'Late', 'Trial'] },
              { name: 'notes', label: 'Notes', type: 'textarea' },
            ]}
            getTitle={(item) => item.clientName}
            getBody={(item) => item.notes}
            getMeta={(item) => `${item.status || 'Present'} / ${item.date || 'No date'}`}
          />
        )}

        {activeTab === 'payments' && (
          <ManagedCrudSection
            title="Add Payment"
            asideTitle="Payment Status"
            items={payments}
            form={paymentForm}
            setForm={setPaymentForm}
            createForm={createPaymentForm}
            editingId={editingPaymentId}
            setEditingId={setEditingPaymentId}
            idPrefix="payment"
            onSaveRecord={savePaymentRecord}
            onDeleteRecord={deletePaymentRecord}
            onError={setAdminError}
            fields={[
              { name: 'clientName', label: 'Client', type: 'select', options: uniqueOptions(['Walk-in', ...clientNames]) },
              { name: 'plan', label: 'Plan', type: 'select', options: planNames.length ? planNames : ['Basic', 'Standard', 'Premium'] },
              { name: 'amount', label: 'Amount' },
              { name: 'dueDate', label: 'Due Date', type: 'date' },
              { name: 'status', label: 'Status', type: 'select', options: ['Paid', 'Due', 'Overdue', 'Refunded'] },
              { name: 'notes', label: 'Notes', type: 'textarea' },
            ]}
            getTitle={(item) => item.clientName}
            getBody={(item) => item.notes || item.plan}
            getMeta={(item) => `${item.status || 'Due'} / $${item.amount || 0} / ${item.dueDate || 'No date'}`}
          />
        )}

        {activeTab === 'progress' && (
          <ManagedCrudSection
            title="Add Progress"
            asideTitle="Client Progress"
            items={progressRecords}
            form={progressForm}
            setForm={setProgressForm}
            createForm={createProgressForm}
            editingId={editingProgressId}
            setEditingId={setEditingProgressId}
            idPrefix="progress"
            onSaveRecord={saveProgressRecord}
            onDeleteRecord={deleteProgressRecord}
            onError={setAdminError}
            uploadingField={uploadingField}
            setUploadingField={setUploadingField}
            fields={[
              { name: 'clientName', label: 'Client', type: 'select', options: uniqueOptions(['Walk-in', ...clientNames]) },
              { name: 'date', label: 'Date', type: 'date' },
              { name: 'weight', label: 'Weight' },
              { name: 'measurements', label: 'Measurements', wide: true },
              { name: 'image', label: 'Progress Image URL', wide: true },
              { name: 'upload', label: 'Upload Image', type: 'file', accept: 'image/*', target: 'image', wide: true },
              { name: 'notes', label: 'Notes', type: 'textarea' },
            ]}
            getPreview={(item) => item.image ? <span className="admin-thumb" style={imageStyle(item.image)} /> : null}
            getTitle={(item) => item.clientName}
            getBody={(item) => item.notes || item.measurements}
            getMeta={(item) => `${item.date || 'No date'} / ${item.weight || 'No weight'}`}
          />
        )}

        {activeTab === 'profile' && (
          <AdminSection
            title="Admin Profile"
            asideTitle="Login Security"
            count={1}
            form={
              <form className="admin-form" onSubmit={saveProfile}>
                <AdminInput label="Username" value={profileForm.username} onChange={(value) => setProfileForm({ ...profileForm, username: value })} required />
                <AdminInput label="Current Password" type="password" value={profileForm.currentPassword} onChange={(value) => setProfileForm({ ...profileForm, currentPassword: value })} required />
                <AdminInput label="New Password" type="password" value={profileForm.newPassword} onChange={(value) => setProfileForm({ ...profileForm, newPassword: value })} wide />
                <div className="admin-actions">
                  <GlowButton label="Update Login" type="submit" />
                </div>
              </form>
            }
            list={
              <div className="admin-list">
                <article className="admin-record">
                  <div>
                    <h3>No signup page</h3>
                    <p>Only this username and password can access the admin panel.</p>
                    <span>After changing login details, sign in again with the new details.</span>
                  </div>
                </article>
                <article className="admin-record">
                  <div>
                    <h3>Stronger password</h3>
                    <p>Use at least 8 characters with letters, numbers, and symbols.</p>
                    <span>Backend stores only a salted PBKDF2 password hash.</span>
                  </div>
                </article>
              </div>
            }
          />
        )}
      </section>
    </div>
  );
});

const ManagedCrudSection = React.memo(function ManagedCrudSection({
  title,
  asideTitle,
  items,
  form,
  setForm,
  createForm,
  toForm,
  editingId,
  setEditingId,
  idPrefix,
  onSaveRecord,
  onDeleteRecord,
  onError,
  fields,
  getTitle,
  getBody,
  getMeta,
  getPreview,
  preparePayload,
  uploadingField = '',
  setUploadingField = () => {},
}) {
  const saveRecord = async (event) => {
    event.preventDefault();
    onError('');
    const payload = preparePayload
      ? preparePayload(form, editingId)
      : { ...form, id: editingId || createId(idPrefix) };
    try {
      await onSaveRecord(payload, editingId);
      setEditingId(null);
      setForm(createForm());
    } catch (error) {
      onError(error.message || 'Could not save record.');
    }
  };

  return (
    <AdminSection
      title={editingId ? title.replace('Add', 'Update') : title}
      asideTitle={asideTitle}
      count={items.length}
      form={
        <form className="admin-form" onSubmit={saveRecord}>
          {fields.map((field) => (
            <AdminFieldControl
              field={field}
              form={form}
              key={field.name}
              onError={onError}
              setForm={setForm}
              setUploadingField={setUploadingField}
              uploadingField={uploadingField}
            />
          ))}
          <AdminActions
            editing={Boolean(editingId)}
            onCancel={() => {
              setEditingId(null);
              setForm(createForm());
            }}
          />
        </form>
      }
      list={
        <div className={`admin-list ${getPreview ? 'media-list' : ''}`}>
          {items.length === 0 && <EmptyPanel title="Nothing here yet" body="New records will appear here." />}
          {items.map((item) => (
            <article className={`admin-record ${getPreview && getPreview(item) ? 'media-record' : ''}`} key={item.id}>
              {getPreview && getPreview(item)}
              <div>
                <h3>{getTitle(item)}</h3>
                <p>{getBody(item)}</p>
                <span>{getMeta(item)}</span>
              </div>
              <div className="record-actions">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(item.id);
                    setForm(toForm ? toForm(item) : { ...createForm(), ...item });
                  }}
                >
                  Edit
                </button>
                <button type="button" onClick={() => onDeleteRecord(item.id).catch((error) => onError(error.message))}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      }
    />
  );
});

function AdminFieldControl({ field, form, setForm, onError, uploadingField, setUploadingField }) {
  const value = form[field.name] ?? '';

  if (field.type === 'textarea') {
    return <AdminTextarea label={field.label} value={value} onChange={(nextValue) => setForm({ ...form, [field.name]: nextValue })} />;
  }

  if (field.type === 'select') {
    return <AdminSelect label={field.label} value={value} onChange={(nextValue) => setForm({ ...form, [field.name]: nextValue })} options={field.options} />;
  }

  if (field.type === 'checkbox') {
    return (
      <label className="admin-check">
        <input
          checked={Boolean(value)}
          onChange={(event) => setForm({ ...form, [field.name]: event.target.checked })}
          type="checkbox"
        />
        {field.label}
      </label>
    );
  }

  if (field.type === 'file') {
    return (
      <label className={`admin-field ${field.wide ? 'wide' : ''}`}>
        {field.label}
        <input
          accept={field.accept}
          type="file"
          onChange={(event) => handleMediaUpload(event, {
            fieldName: field.name,
            setUploadingField,
            onError,
            onLoaded: (fileData) => {
              const nextForm = {
                ...form,
                [field.target || 'image']: fileData.url,
              };
              if (field.mediaTypeField) {
                nextForm[field.mediaTypeField] = fileData.type.startsWith('video') ? 'video' : 'image';
              }
              setForm(nextForm);
            },
          })}
        />
        {uploadingField === field.name && <span className="upload-status">Uploading to Cloudinary...</span>}
      </label>
    );
  }

  return (
    <AdminInput
      label={field.label}
      required={field.required}
      type={field.type || 'text'}
      value={value}
      wide={field.wide}
      onChange={(nextValue) => setForm({ ...form, [field.name]: nextValue })}
    />
  );
}

function AdminDashboard({ clients, contactRequests, leads, payments, trainers, onExport }) {
  const duePayments = payments.filter((payment) => ['Due', 'Overdue'].includes(payment.status)).length;
  const metrics = [
    { label: 'Clients', value: clients.length },
    { label: 'New Enquiries', value: contactRequests.filter((item) => (item.status || 'New') === 'New').length },
    { label: 'Leads', value: leads.length },
    { label: 'Payments Due', value: duePayments },
    { label: 'Trainers', value: trainers.length },
  ];

  return (
    <section className="admin-dashboard">
      <div className="dashboard-grid">
        {metrics.map((item) => (
          <article className="dashboard-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>
      <div className="admin-section single">
        <div className="admin-card">
          <div className="admin-heading">
            <p className="eyebrow">Exports</p>
            <h2>Download Gym Data</h2>
          </div>
          <div className="export-row">
            <button className="ghost-action" type="button" onClick={() => onExport('clients.csv', clients)}>Clients CSV</button>
            <button className="ghost-action" type="button" onClick={() => onExport('enquiries.csv', contactRequests)}>Enquiries CSV</button>
            <button className="ghost-action" type="button" onClick={() => onExport('leads.csv', leads)}>Leads CSV</button>
            <button className="ghost-action" type="button" onClick={() => onExport('payments.csv', payments)}>Payments CSV</button>
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-heading">
            <p className="eyebrow">Fresh requests</p>
            <h2>Latest Enquiries</h2>
          </div>
          <div className="admin-list">
            {contactRequests.slice(0, 4).map((request) => (
              <article className="admin-record" key={request.id}>
                <div>
                  <h3>{request.name}</h3>
                  <p>{request.message || request.goal}</p>
                  <span>{request.status || 'New'} / {request.email}</span>
                </div>
              </article>
            ))}
            {contactRequests.length === 0 && <EmptyPanel title="No enquiries" body="Contact form requests will appear here." />}
          </div>
        </div>
      </div>
    </section>
  );
}

function AdminInbox({ contactRequests, onExport, onStatus, onConvert, onDelete }) {
  return (
    <AdminSection
      title="Website Enquiries"
      asideTitle="Request Inbox"
      count={contactRequests.length}
      form={
        <div className="admin-tool-card">
          <p className="eyebrow">Client friendly</p>
          <h2>Every contact form request lands here.</h2>
          <p>Mark enquiries as contacted, convert serious requests into leads, or export the whole inbox for follow-up.</p>
          <button className="ghost-action" type="button" onClick={onExport}>Export Enquiries CSV</button>
        </div>
      }
      list={
        <div className="admin-list">
          {contactRequests.length === 0 && <EmptyPanel title="No enquiries" body="When a visitor sends the contact form, it appears here." />}
          {contactRequests.map((request) => (
            <article className="admin-record" key={request.id}>
              <div>
                <h3>{request.name}</h3>
                <p>{request.message || request.goal}</p>
                <span>{request.status || 'New'} / {request.email} / {request.phone || 'No phone'}</span>
              </div>
              <div className="record-actions">
                <button type="button" onClick={() => onStatus(request, 'Contacted')}>Contacted</button>
                <button type="button" onClick={() => onConvert(request)}>Lead</button>
                <button type="button" onClick={() => onDelete(request.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      }
    />
  );
}

function AdminSection({ title, asideTitle, count, form, list }) {
  return (
    <section className="admin-section">
      <div className="admin-card">
        <div className="admin-heading">
          <p className="eyebrow">{title}</p>
          <h2>{title}</h2>
        </div>
        {form}
      </div>
      <div className="admin-card">
        <div className="admin-heading">
          <p className="eyebrow">{count} total</p>
          <h2>{asideTitle}</h2>
        </div>
        {list}
      </div>
    </section>
  );
}

function AdminInput({ label, value, onChange, type = 'text', required = false, wide = false }) {
  return (
    <label className={`admin-field ${wide ? 'wide' : ''}`}>
      {label}
      <input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function AdminTextarea({ label, value, onChange }) {
  return (
    <label className="admin-field wide">
      {label}
      <textarea rows="5" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function AdminSelect({ label, value, onChange, options }) {
  return (
    <label className="admin-field">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function AdminActions({ editing, onCancel }) {
  return (
    <div className="admin-actions">
      <GlowButton label={editing ? 'Update' : 'Add'} type="submit" />
      {editing && <button className="ghost-action" type="button" onClick={onCancel}>Cancel</button>}
    </div>
  );
}

function AdminMediaPreview({ item }) {
  const src = item.image || item.src;
  if ((item.type || 'image') === 'video') {
    return <video className="admin-thumb" muted playsInline src={src} />;
  }
  return <span className="admin-thumb" style={imageStyle(src)} />;
}

function EmptyPanel({ title, body }) {
  return (
    <article className="empty-panel">
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

function PageIntro({ eyebrow, title, compact = false }) {
  return (
    <section className={`page-intro reveal ${compact ? 'compact' : ''}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
    </section>
  );
}

function KineticStrip({ items }) {
  const repeated = [...items, ...items];
  return (
    <section className="kinetic-strip reveal" aria-label="Volt Fitness energy">
      <div className="kinetic-track">
        {repeated.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function BigMoment({ accent, image, kicker, title, copy, metrics }) {
  return (
    <section className={`big-moment reveal accent-${accent}`}>
      <div className="big-moment-media" style={imageStyle(image)} aria-hidden="true" />
      <div className="big-moment-copy">
        <p className="eyebrow">{kicker}</p>
        <h2>{title}</h2>
        <p>{copy}</p>
        <div className="big-moment-metrics">
          {metrics.map((item) => (
            <Metric key={item.label} value={item.value} label={item.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ZoneShowcase() {
  return (
    <section className="zone-showcase reveal">
      <SectionHeader eyebrow="Facility zones" title="Big spaces for big training days." />
      <div className="zone-grid">
        {facilityZones.map((zone, index) => (
          <article className={`zone-card accent-${index === 1 ? 'orange' : 'cyan'}`} key={zone.title}>
            <div className="zone-image" style={imageStyle(zone.image)} />
            <div>
              <h3>{zone.title}</h3>
              <p>{zone.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProgramCard({ program, onClick, style }) {
  return (
    <button
      className={`program-card reveal accent-${program.accent}`}
      onClick={onClick}
      style={style}
      type="button"
    >
      <span className="icon-tile">
        <Icon name={program.icon} />
      </span>
      <span className="program-copy">
        <strong>{program.title}</strong>
        <span>{program.body}</span>
        <span className="learn-more">Learn More</span>
      </span>
      <span className="program-media" style={imageStyle(program.image)} />
    </button>
  );
}

function PricingCard({ billing, plan, onClick, style }) {
  return (
    <article className={`pricing-card reveal accent-${plan.accent} ${plan.tag ? 'featured' : ''}`} style={style}>
      {plan.tag && <span className="plan-ribbon">{plan.tag}</span>}
      <h2>{plan.name}</h2>
      <p>{plan.summary}</p>
      <div className="plan-price">
        <span>${plan.price[billing]}</span>
        <small>/mo</small>
      </div>
      <ul>
        {plan.features.map((feature) => (
          <li key={feature}>
            <Icon name="check" />
            {feature}
          </li>
        ))}
      </ul>
      <GlowButton label="Join Now" variant={plan.accent === 'orange' ? 'orange' : 'cyan'} onClick={onClick} />
    </article>
  );
}

function BillingToggle({ billing, setBilling, compact = false }) {
  return (
    <div className={`billing-toggle reveal ${compact ? 'compact' : ''}`}>
      <button
        aria-pressed={billing === 'monthly'}
        className={billing === 'monthly' ? 'active' : ''}
        onClick={() => setBilling('monthly')}
        type="button"
      >
        Monthly
      </button>
      <button
        aria-pressed={billing === 'yearly'}
        className={billing === 'yearly' ? 'active' : ''}
        onClick={() => setBilling('yearly')}
        type="button"
      >
        Yearly
      </button>
      <span className="toggle-orb" data-state={billing} />
      <span className="save-pill">Save 20%</span>
    </div>
  );
}

function GalleryTile({ item, style }) {
  const mediaUrl = item.image || item.src;
  const isVideo = (item.type || 'image') === 'video';
  return (
    <button
      className={`gallery-tile reveal accent-${item.accent} ${item.wide ? 'wide' : ''}`}
      style={{ ...(isVideo ? {} : imageStyle(mediaUrl)), ...style }}
      type="button"
    >
      {isVideo && <video className="gallery-video" muted playsInline preload="metadata" src={mediaUrl} />}
      <span className="gallery-overlay" />
      <span>{item.title}</span>
      <Icon name="eye" />
    </button>
  );
}

function GalleryFeature({ item }) {
  const mediaUrl = item.image || item.src;
  const isVideo = (item.type || 'image') === 'video';
  return (
    <section className={`gallery-feature reveal accent-${item.accent}`} style={isVideo ? undefined : imageStyle(mediaUrl)}>
      {isVideo && <video className="gallery-video" muted playsInline preload="metadata" src={mediaUrl} />}
      <span className="gallery-overlay" />
      <div>
        <p className="eyebrow">{isVideo ? 'Featured Video' : 'Featured Zone'}</p>
        <h2>{item.title}</h2>
      </div>
      <span className="icon-float">
        <Icon name="eye" />
      </span>
    </section>
  );
}

function TrainerCard({ trainer }) {
  return (
    <article className={`trainer-card accent-${trainer.accent}`}>
      <div className="trainer-media" style={imageStyle(trainer.image)}>
        <span className="card-bolt">
          <Icon name="bolt" />
        </span>
        <span className="rating">
          <Icon name="star" />
          {trainer.rating}
        </span>
      </div>
      <div className="trainer-content">
        <div>
          <h3>{trainer.name}</h3>
          <p>{trainer.role}</p>
        </div>
        <span className="tag">Rating</span>
      </div>
      <div className="trainer-bars">
        <ProgressLine label="Clients Transformed" value={`${Math.min(100, trainer.clients / 5)}%`} stat={trainer.clients} />
        <ProgressLine label="Years Experience" value={`${Math.min(100, trainer.years * 7)}%`} stat={trainer.years} />
      </div>
    </article>
  );
}

function ProgressLine({ label, value, stat }) {
  return (
    <div className="progress-item thin">
      <div className="progress-meta">
        <span>{label}</span>
        <span>{stat}</span>
      </div>
      <span className="progress-track">
        <span className="progress-fill" style={{ '--progress': value }} />
      </span>
    </div>
  );
}

function InfoCard({ icon, title, body, accent }) {
  return (
    <article className={`glass-card info-card reveal accent-${accent}`}>
      <span className="icon-tile">
        <Icon name={icon} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </article>
  );
}

function InfoLine({ icon, title, body }) {
  return (
    <article className="info-line">
      <span className="mini-icon">
        <Icon name={icon} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </article>
  );
}

function ScheduleList({ items = defaultWeeklySchedule }) {
  const visibleItems = items.length ? items : defaultWeeklySchedule;
  return (
    <div className="schedule-list">
      {visibleItems.map((item) => (
        <article className="schedule-item" key={`${item.day}-${item.className}`}>
          <span>{item.day}</span>
          <div>
            <strong>{item.className}</strong>
            <small>{item.time}{item.trainer ? ` / ${item.trainer}` : ''}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

function FooterMini({ settings = defaultSettings }) {
  return (
    <footer className="footer-mini reveal">
      <div>
        <strong>Contact</strong>
        <span>{settings.phone}</span>
        <span>{settings.email}</span>
      </div>
      <div>
        <strong>Social Media</strong>
        <div className="social-row">
          <button aria-label="Facebook" type="button" onClick={() => openExternal(settings.facebook)}>f</button>
          <button aria-label="Instagram" type="button" onClick={() => openExternal(settings.instagram)}>ig</button>
          <button aria-label="YouTube" type="button" onClick={() => openExternal(settings.youtube)}>yt</button>
        </div>
      </div>
      <form className="newsletter" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="newsletter-email">Newsletter</label>
        <div>
          <input id="newsletter-email" placeholder="Enter your email" type="email" />
          <IconButton label="Submit newsletter" icon="arrowRight" />
        </div>
      </form>
    </footer>
  );
}

function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="section-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

function Metric({ value, label }) {
  return (
    <article className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

function GlowButton({ label, onClick, variant = 'cyan', type = 'button' }) {
  return (
    <button className={`glow-button ${variant}`} onClick={onClick} type={type}>
      <span>{label}</span>
    </button>
  );
}

function IconButton({ icon, label, onClick }) {
  return (
    <button className="icon-button" aria-label={label} onClick={onClick} type="button">
      <Icon name={icon} />
    </button>
  );
}

function Dots({ activeIndex, count, onSelect, small = false }) {
  return (
    <div className={`dots ${small ? 'small' : ''}`} aria-label="Carousel pagination">
      {Array.from({ length: count }).map((_, index) => (
        <button
          aria-label={`Go to item ${index + 1}`}
          className={activeIndex === index ? 'active' : ''}
          key={index}
          onClick={onSelect ? () => onSelect(index) : undefined}
          type="button"
        />
      ))}
    </div>
  );
}

function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <span className="beam beam-one" />
      <span className="beam beam-two" />
      <span className="beam beam-three" />
      <span className="scan-line" />
      <span className="grid-noise" />
    </div>
  );
}

function Icon({ name }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.8,
    viewBox: '0 0 24 24',
  };

  if (name === 'star') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path
          d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2-4.6-4.4 6.3-.9L12 2.8z"
          fill="currentColor"
        />
      </svg>
    );
  }

  const paths = {
    arrowLeft: <path d="M14.5 6 8.5 12l6 6" />,
    arrowRight: <path d="m9.5 6 6 6-6 6" />,
    bolt: <path d="M13 2 4 14h6l-1 8 11-14h-6l-1-6z" />,
    calendar: (
      <>
        <path d="M7 3v4M17 3v4M4 9h16" />
        <path d="M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
      </>
    ),
    chart: <path d="M4 17 9 12l4 4 7-9M20 7v6h-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    dumbbell: (
      <>
        <path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12M9 8v8M15 8v8" />
      </>
    ),
    eye: (
      <>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
        <path d="M12 9.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6z" />
      </>
    ),
    heart: (
      <>
        <path d="M20.2 8.3c0 4.9-8.2 10.2-8.2 10.2S3.8 13.2 3.8 8.3A4.1 4.1 0 0 1 11 5.7a4.1 4.1 0 0 1 7.2 2.6z" />
        <path d="M7.5 12h2.6l1.2-2.3 2.3 5 1.2-2.7h2.7" />
      </>
    ),
    leaf: (
      <>
        <path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14z" />
        <path d="M5 19 15 9" />
      </>
    ),
    mail: (
      <>
        <path d="M4 6h16v12H4z" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    map: (
      <>
        <path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3z" />
        <path d="M9 3v15M15 6v15" />
      </>
    ),
    person: (
      <>
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        <path d="M4 21a8 8 0 0 1 16 0" />
        <path d="M18 8h3M19.5 6.5v3" />
      </>
    ),
    phone: (
      <>
        <path d="M8 4 6 6c-.5.5-.6 1.2-.3 1.8 2.2 4.8 5.7 8.3 10.5 10.5.6.3 1.3.2 1.8-.3l2-2-3.6-3.6-1.9 1.9c-1.9-1-3.7-2.8-4.7-4.7l1.9-1.9L8 4z" />
      </>
    ),
    target: (
      <>
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
        <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
        <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      </>
    ),
    timer: (
      <>
        <path d="M9 2h6M12 8v5l3 2" />
        <path d="M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" {...common}>
      {paths[name] || paths.bolt}
    </svg>
  );
}

function loopSlice(items, start, count) {
  if (!items.length) {
    return [];
  }
  return Array.from({ length: count }).map((_, index) => items[(start + index) % items.length]);
}

function nextIndex(index, length) {
  return length ? (index + 1) % length : 0;
}

function previousIndex(index, length) {
  return length ? (index - 1 + length) % length : 0;
}

function imageStyle(url) {
  return { '--image': `url("${url}")` };
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createClientForm() {
  return {
    name: '',
    email: '',
    phone: '',
    plan: 'Standard',
    goal: '',
    age: '',
    height: '',
    weight: '',
    trainer: 'Unassigned',
    startDate: '',
    notes: '',
  };
}

function createGalleryForm() {
  return {
    title: '',
    type: 'image',
    image: '',
    accent: 'cyan',
    wide: false,
  };
}

function createTrainerForm() {
  return {
    name: '',
    role: '',
    image: '',
    rating: '4.9',
    clients: '0',
    years: '1',
    accent: 'cyan',
  };
}

function createPlanForm() {
  return {
    name: '',
    monthly: '',
    yearly: '',
    accent: 'cyan',
    tag: '',
    summary: '',
    features: '',
  };
}

function planToForm(plan) {
  return {
    ...createPlanForm(),
    ...plan,
    monthly: String(plan.monthly ?? plan.price?.monthly ?? ''),
    yearly: String(plan.yearly ?? plan.price?.yearly ?? ''),
    features: featuresToText(plan.features),
  };
}

function createProgramForm() {
  return {
    title: '',
    body: '',
    icon: 'dumbbell',
    image: '',
    accent: 'cyan',
  };
}

function createTestimonialForm() {
  return {
    name: '',
    quote: '',
  };
}

function createScheduleForm() {
  return {
    day: 'Mon',
    time: '6:00 AM',
    className: '',
    trainer: 'Unassigned',
  };
}

function createSettingsForm(settings = defaultSettings) {
  return {
    ...defaultSettings,
    ...settings,
    id: settings.id || 'settings-main',
  };
}

function createLeadForm() {
  return {
    name: '',
    email: '',
    phone: '',
    source: 'Website',
    status: 'New',
    notes: '',
  };
}

function createAttendanceForm() {
  return {
    clientName: 'Walk-in',
    date: new Date().toISOString().slice(0, 10),
    status: 'Present',
    notes: '',
  };
}

function createPaymentForm() {
  return {
    clientName: 'Walk-in',
    plan: 'Standard',
    amount: '',
    dueDate: new Date().toISOString().slice(0, 10),
    status: 'Due',
    notes: '',
  };
}

function createProgressForm() {
  return {
    clientName: 'Walk-in',
    date: new Date().toISOString().slice(0, 10),
    weight: '',
    measurements: '',
    image: '',
    notes: '',
  };
}

function createProfileForm(username = 'admin') {
  return {
    username,
    currentPassword: '',
    newPassword: '',
  };
}

function handleMediaUpload(event, { onLoaded, onError, setUploadingField, fieldName = 'media' }) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  setUploadingField(fieldName);
  reader.onload = async () => {
    try {
      const upload = await apiRequest('/api/uploads', {
        method: 'POST',
        body: {
          dataUrl: reader.result,
          fileName: file.name,
          mimeType: file.type,
        },
      });
      onLoaded({ url: upload.secureUrl, type: file.type });
    } catch (error) {
      onError(error.message || 'Upload failed.');
    } finally {
      setUploadingField('');
      event.target.value = '';
    }
  };
  reader.onerror = () => {
    onError('Could not read the selected file.');
    setUploadingField('');
  };
  reader.readAsDataURL(file);
}

async function apiRequest(path, options = {}) {
  if (typeof fetch !== 'function') {
    throw new Error('The API is not available in this environment.');
  }

  const response = await fetch(apiUrl(path), {
    method: options.method || 'GET',
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data = {};
  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  if (!response.ok) {
    const errorMessage = data.message || `Request failed with status ${response.status} (${response.statusText})`;
    throw new Error(errorMessage);
  }

  return data;
}

function apiUrl(path) {
  if (typeof window === 'undefined') {
    return path;
  }
  // When running the React development server, NODE_ENV is 'development'.
  // In this mode, we assume the API server is on port 4000.
  const isDev = process.env.NODE_ENV === 'development';
  return isDev ? `http://127.0.0.1:4000${path}` : path;
}

async function saveAdminItem(resource, item, editingId, setState) {
  const data = await apiRequest(`/api/${resource}${editingId ? `/${editingId}` : ''}`, {
    method: editingId ? 'PUT' : 'POST',
    body: item,
  });
  setState(getResourceItems(resource, data));
}

async function deleteAdminItem(resource, id, setState) {
  const data = await apiRequest(`/api/${resource}/${id}`, {
    method: 'DELETE',
  });
  setState(getResourceItems(resource, data));
}

function getResourceItems(resource, data) {
  if (resource === 'gallery') {
    return data.galleryItems || [];
  }
  return data[resource] || [];
}

function normalizePricingPlans(plans) {
  return plans.map((plan) => ({
    ...plan,
    accent: plan.accent || 'cyan',
    price: {
      monthly: Number(plan.monthly ?? plan.price?.monthly ?? 0),
      yearly: Number(plan.yearly ?? plan.price?.yearly ?? plan.monthly ?? 0),
    },
    features: Array.isArray(plan.features) ? plan.features : splitLines(plan.features),
  }));
}

function splitLines(value) {
  return String(value || '')
    .split(/\r?\n|\|/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function featuresToText(value) {
  if (Array.isArray(value)) {
    return value.join('\n');
  }
  return String(value || '');
}

function uniqueOptions(options) {
  return Array.from(new Set(options.filter(Boolean)));
}

function downloadCsv(fileName, rows) {
  const safeRows = rows.length ? rows : [{}];
  const headers = Array.from(
    safeRows.reduce((keys, row) => {
      Object.keys(row || {}).forEach((key) => keys.add(key));
      return keys;
    }, new Set())
  );
  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => `"${String(row?.[header] ?? '').replace(/"/g, '""')}"`)
        .join(',')
    ),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

function openExternal(url) {
  if (!url || url === '#') {
    return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}

export default App;
