const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const path = require('path');
const nodemailer = require('nodemailer');

loadEnvFile(path.join(__dirname, '.env'));

const PORT = Number(process.env.API_PORT || 4000);
const DATA_DIR = path.join(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');
const ADMIN_PATH = path.join(DATA_DIR, 'admin.json');
const USERS_PATH = path.join(DATA_DIR, 'users.json');
const SESSION_COOKIE = 'volt_admin_session';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const USER_SESSION_COOKIE = 'volt_user_session';
const USER_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;
const MAX_BODY_BYTES = 25 * 1024 * 1024;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MS = 5 * 60 * 1000;
const HASH_ITERATIONS = 310000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sessions = new Map();
const loginLocks = new Map();
const userSessions = new Map();
const userLoginLocks = new Map();
const oauthStates = new Map();

const photo = (id, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=82`;

const images = {
  barbell: photo('1517838277536-f5f99be501cd', 900),
  weights: photo('1534438327276-14e5300c3a48', 1000),
  treadmill: photo('1540497077202-7c8a3999166f', 1000),
  class: photo('1571019613454-1cb2f99b2d8b', 1000),
  coaching: photo('1574680096145-d05b474e2155', 1000),
  yoga: photo('1518611012118-696072aa579a', 1000),
  nutrition: photo('1490645935967-10de6ba17061', 1000),
  lockers: photo('1605296867304-46d5465a13f1', 1000),
  stretch: photo('1594737625785-a6cbdabd333c', 900),
};

const defaultStore = {
  clients: [
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
  ],
  galleryItems: [
    { id: 'gallery-deadlift-floor', title: 'Deadlift Floor', type: 'image', image: images.barbell, wide: true, accent: 'cyan' },
    { id: 'gallery-sprint-lanes', title: 'Sprint Lanes', type: 'image', image: images.class, accent: 'orange' },
    { id: 'gallery-locker-suite', title: 'Locker Suite', type: 'image', image: images.lockers, accent: 'cyan' },
    { id: 'gallery-cardio-wall', title: 'Cardio Wall', type: 'image', image: images.treadmill, wide: true, accent: 'cyan' },
    { id: 'gallery-rack-zone', title: 'Rack Zone', type: 'image', image: images.weights, accent: 'orange' },
    { id: 'gallery-mobility-studio', title: 'Mobility Studio', type: 'image', image: images.yoga, accent: 'orange' },
    { id: 'gallery-coaching-pod', title: 'Coaching Pod', type: 'image', image: images.coaching, accent: 'cyan' },
    { id: 'gallery-fuel-bar', title: 'Fuel Bar', type: 'image', image: images.nutrition, wide: true, accent: 'orange' },
    { id: 'gallery-stretch-lab', title: 'Stretch Lab', type: 'image', image: images.stretch, accent: 'cyan' },
  ],
  trainers: [
    { id: 'trainer-mason-cruz', name: 'Mason Cruz', role: 'Strength', image: photo('1526506118085-60ce8714f8c5', 900), rating: '4.9', clients: '320', years: '12', accent: 'cyan' },
    { id: 'trainer-athier-knox', name: 'Athier Knox', role: 'Performance', image: photo('1605296867304-46d5465a13f1', 900), rating: '4.9', clients: '408', years: '9', accent: 'orange' },
    { id: 'trainer-ria-stone', name: 'Ria Stone', role: 'Nutrition', image: photo('1594737625785-a6cbdabd333c', 900), rating: '4.8', clients: '275', years: '8', accent: 'cyan' },
    { id: 'trainer-noah-pierce', name: 'Noah Pierce', role: 'HIIT', image: photo('1571019614242-c5c5dee9f50b', 900), rating: '4.9', clients: '360', years: '10', accent: 'orange' },
    { id: 'trainer-leah-vale', name: 'Leah Vale', role: 'Mobility', image: photo('1518611012118-696072aa579a', 900), rating: '4.8', clients: '230', years: '7', accent: 'cyan' },
    { id: 'trainer-kai-monroe', name: 'Kai Monroe', role: 'Conditioning', image: photo('1574680096145-d05b474e2155', 900), rating: '4.9', clients: '415', years: '11', accent: 'orange' },
  ],
  plans: [
    { id: 'plan-basic', name: 'Basic', monthly: '49', yearly: '39', accent: 'cyan', tag: '', summary: 'For focused solo training.', features: 'Off-peak gym access\nStandard equipment floor\n1 fitness assessment' },
    { id: 'plan-standard', name: 'Standard', monthly: '79', yearly: '63', accent: 'orange', tag: 'Recommended', summary: 'The most popular full-access plan.', features: '24/7 gym access\nAll classes included\n5 personal training sessions\nNutrition starter plan' },
    { id: 'plan-premium', name: 'Premium', monthly: '149', yearly: '119', accent: 'cyan', tag: '', summary: 'For athletes who want full support.', features: 'All Standard features\nUnlimited PT sessions\nRecovery zone access\nVIP locker and towel service' },
  ],
  programs: [
    { id: 'program-weight-training', title: 'Weight Training', body: 'Build raw strength with coached compound lifts and hypertrophy blocks.', icon: 'dumbbell', image: images.barbell, accent: 'orange' },
    { id: 'program-cardio-fitness', title: 'Cardio Fitness', body: 'Raise endurance with treadmill, rower, assault bike, and threshold sets.', icon: 'heart', image: images.treadmill, accent: 'cyan' },
    { id: 'program-personal-training', title: 'Personal Training', body: 'Get a custom plan, live feedback, and accountability that adapts weekly.', icon: 'person', image: images.coaching, accent: 'orange' },
    { id: 'program-hiit-classes', title: 'HIIT Classes', body: 'Fast, fiery intervals that combine strength, speed, and core stability.', icon: 'timer', image: images.class, accent: 'cyan' },
    { id: 'program-yoga-mobility', title: 'Yoga & Mobility', body: 'Improve flexibility, breathing mechanics, balance, and joint range.', icon: 'leaf', image: images.yoga, accent: 'orange' },
    { id: 'program-nutrition-coaching', title: 'Nutrition Coaching', body: 'Meal strategy, protein targets, and practical fuel for your training week.', icon: 'target', image: images.nutrition, accent: 'cyan' },
  ],
  testimonials: [
    { id: 'testimonial-danna-seaton', quote: 'Volt made training feel precise, intense, and finally sustainable.', name: 'Danna Seaton' },
    { id: 'testimonial-aslan-morton', quote: 'The coaches noticed the details I used to miss every single week.', name: 'Aslan Morton' },
    { id: 'testimonial-june-gable', quote: 'The classes move fast, but the coaching never feels rushed.', name: 'June Gable' },
  ],
  schedule: [
    { id: 'schedule-mon-build', day: 'Mon', time: '6:00 AM', className: 'Barbell Build', trainer: 'Mason Cruz' },
    { id: 'schedule-tue-hiit', day: 'Tue', time: '7:30 PM', className: 'Neon HIIT', trainer: 'Noah Pierce' },
    { id: 'schedule-wed-mobility', day: 'Wed', time: '6:30 AM', className: 'Mobility Reset', trainer: 'Leah Vale' },
    { id: 'schedule-thu-engine', day: 'Thu', time: '8:00 PM', className: 'Engine Room', trainer: 'Kai Monroe' },
    { id: 'schedule-sat-sweat', day: 'Sat', time: '9:00 AM', className: 'Team Sweat', trainer: 'Ria Stone' },
  ],
  settings: [
    {
      id: 'settings-main',
      gymName: 'Volt Fitness',
      phone: '+1 213 455 7980',
      email: 'hello@voltfitness.com',
      address: '88 Neon Yard, Los Angeles, CA',
      facebook: '#',
      instagram: '#',
      youtube: '#',
      heroTitle: 'Transform your body. Transform your life.',
      heroSubtitle: 'Train inside a high-energy performance club built for strength, conditioning, coaching, recovery, and visible progress.',
    },
  ],
  contactRequests: [],
  leads: [],
  attendance: [],
  payments: [],
  progress: [],
};

const resources = {
  clients: { key: 'clients', authRead: true },
  gallery: { key: 'galleryItems', authRead: false },
  trainers: { key: 'trainers', authRead: false },
  plans: { key: 'plans', authRead: false },
  programs: { key: 'programs', authRead: false },
  testimonials: { key: 'testimonials', authRead: false },
  schedule: { key: 'schedule', authRead: false },
  settings: { key: 'settings', authRead: false },
  contactRequests: { key: 'contactRequests', authRead: true, authCreate: false },
  leads: { key: 'leads', authRead: true },
  attendance: { key: 'attendance', authRead: true },
  payments: { key: 'payments', authRead: true },
  progress: { key: 'progress', authRead: true },
};

ensureDataFiles();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const commonHeaders = corsHeaders(req);

  if (req.method === 'OPTIONS') {
    sendJson(req, res, 204, {}, commonHeaders);
    return;
  }

  try {
    if (url.pathname === '/api/auth/session' && req.method === 'GET') {
      const session = getSession(req);
      sendJson(req, res, 200, session ? { authenticated: true, username: session.username } : { authenticated: false }, commonHeaders);
      return;
    }

    if (url.pathname === '/api/auth/login' && req.method === 'POST') {
      const body = await readJsonBody(req);
      const result = login(req, body.username, body.password);
      if (!result.ok) {
        sendJson(req, res, result.status || 401, { message: result.message }, commonHeaders);
        return;
      }
      sendJson(req, res, 200, { username: result.username }, {
        ...commonHeaders,
        'Set-Cookie': sessionCookie(result.token),
      });
      return;
    }

    if (url.pathname === '/api/auth/logout' && req.method === 'POST') {
      const token = getSessionToken(req);
      if (token) {
        sessions.delete(token);
      }
      sendJson(req, res, 200, { ok: true }, {
        ...commonHeaders,
        'Set-Cookie': clearSessionCookie(),
      });
      return;
    }

    if (url.pathname === '/api/auth/profile' && req.method === 'PUT') {
      const session = getSession(req);
      if (!session) {
        sendJson(req, res, 401, { message: 'Admin login required.' }, commonHeaders);
        return;
      }
      const body = await readJsonBody(req);
      const result = updateAdminProfile(body);
      sessions.clear();
      sendJson(req, res, 200, result, {
        ...commonHeaders,
        'Set-Cookie': clearSessionCookie(),
      });
      return;
    }

    if (url.pathname === '/api/auth/user-session' && req.method === 'GET') {
      const session = getUserSession(req);
      sendJson(req, res, 200, session ? { authenticated: true, user: { id: session.userId, name: session.name, email: session.email } } : { authenticated: false }, commonHeaders);
      return;
    }

    if (url.pathname === '/api/auth/register' && req.method === 'POST') {
      const body = await readJsonBody(req);
      const result = registerUser(body);
      if (!result.ok) {
        sendJson(req, res, result.status || 400, { message: result.message }, commonHeaders);
        return;
      }
      sendWelcomeEmail(result.user).catch((error) => console.error('Welcome email failed:', error.message));
      sendJson(req, res, 200, { user: sanitizeUser(result.user) }, {
        ...commonHeaders,
        'Set-Cookie': buildSessionCookie(USER_SESSION_COOKIE, result.token, USER_SESSION_TTL_MS),
      });
      return;
    }

    if (url.pathname === '/api/auth/user-login' && req.method === 'POST') {
      const body = await readJsonBody(req);
      const result = loginUser(req, body.email, body.password);
      if (!result.ok) {
        sendJson(req, res, result.status || 401, { message: result.message }, commonHeaders);
        return;
      }
      sendJson(req, res, 200, { user: sanitizeUser(result.user) }, {
        ...commonHeaders,
        'Set-Cookie': buildSessionCookie(USER_SESSION_COOKIE, result.token, USER_SESSION_TTL_MS),
      });
      return;
    }

    if (url.pathname === '/api/auth/user-logout' && req.method === 'POST') {
      const token = getCookieValue(req, USER_SESSION_COOKIE);
      if (token) {
        userSessions.delete(token);
      }
      sendJson(req, res, 200, { ok: true }, {
        ...commonHeaders,
        'Set-Cookie': buildClearCookie(USER_SESSION_COOKIE),
      });
      return;
    }

    if (url.pathname === '/api/auth/google' && req.method === 'GET') {
      handleGoogleAuthStart(req, res);
      return;
    }

    if (url.pathname === '/api/auth/google/callback' && req.method === 'GET') {
      await handleGoogleAuthCallback(req, res, url);
      return;
    }

    if (url.pathname === '/api/uploads' && req.method === 'POST') {
      if (!getSession(req)) {
        sendJson(req, res, 401, { message: 'Admin login required.' }, commonHeaders);
        return;
      }
      const body = await readJsonBody(req);
      const upload = await uploadToCloudinary(body);
      sendJson(req, res, 200, upload, commonHeaders);
      return;
    }

    if (url.pathname === '/api/chatbot' && req.method === 'POST') {
      const body = await readJsonBody(req);
      const message = body.message || '';
      // A simple echo response for now
      const reply = `I hear you! You said: "${message}"`;
      sendJson(req, res, 200, { reply }, commonHeaders);
      return;
    }

    const parts = url.pathname.split('/').filter(Boolean);
    if (parts[0] === 'api' && resources[parts[1]]) {
      await handleResource(req, res, commonHeaders, parts[1], parts[2]);
      return;
    }

    sendJson(req, res, 404, { message: 'Not found.' }, commonHeaders);
  } catch (error) {
    sendJson(req, res, error.status || 500, { message: error.message || 'Server error.' }, commonHeaders);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Secure gym API running at http://127.0.0.1:${PORT}`);
});

async function handleResource(req, res, headers, resourceName, id) {
  const config = resources[resourceName];
  const session = getSession(req);

  const needsLogin =
    (config.authRead && req.method === 'GET') ||
    (req.method === 'POST' ? config.authCreate !== false : req.method !== 'GET');

  if (needsLogin) {
    if (!session) {
      sendJson(req, res, 401, { message: 'Admin login required.' }, headers);
      return;
    }
  }

  const store = readStore();
  const items = Array.isArray(store[config.key]) ? store[config.key] : [];

  if (req.method === 'GET') {
    sendJson(req, res, 200, { [config.key]: items }, headers);
    return;
  }

  if (req.method === 'POST') {
    const body = await readJsonBody(req);
    const item = normalizeItem(resourceName, {
      ...body,
      createdAt: body.createdAt || new Date().toISOString(),
    });
    store[config.key] = [item, ...items];
    writeStore(store);
    sendJson(req, res, 200, { [config.key]: store[config.key] }, headers);
    return;
  }

  if (req.method === 'PUT' && id) {
    const body = await readJsonBody(req);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      sendJson(req, res, 404, { message: 'Record not found.' }, headers);
      return;
    }
    const nextItems = [...items];
    nextItems[index] = normalizeItem(resourceName, { ...body, id });
    store[config.key] = nextItems;
    writeStore(store);
    sendJson(req, res, 200, { [config.key]: store[config.key] }, headers);
    return;
  }

  if (req.method === 'DELETE' && id) {
    store[config.key] = items.filter((item) => item.id !== id);
    writeStore(store);
    sendJson(req, res, 200, { [config.key]: store[config.key] }, headers);
    return;
  }

  sendJson(req, res, 405, { message: 'Method not allowed.' }, headers);
}

function login(req, usernameInput, password) {
  const username = String(usernameInput || '').trim();
  const ip = req.socket.remoteAddress || 'unknown';
  const lock = loginLocks.get(ip) || { attempts: 0, lockedUntil: 0 };

  if (lock.lockedUntil && lock.lockedUntil > Date.now()) {
    const minutes = Math.ceil((lock.lockedUntil - Date.now()) / 60000);
    return { ok: false, status: 429, message: `Too many failed attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.` };
  }

  const admin = readAdminCredentials();
  if (username === admin.username && verifyPassword(String(password || ''), admin)) {
    loginLocks.delete(ip);
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, { username: admin.username, expiresAt: Date.now() + SESSION_TTL_MS });
    return { ok: true, token, username: admin.username };
  }

  const attempts = lock.attempts + 1;
  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    loginLocks.set(ip, { attempts: 0, lockedUntil: Date.now() + LOCK_DURATION_MS });
    return { ok: false, status: 429, message: 'Too many failed attempts. Admin login is locked for 5 minutes.' };
  }

  loginLocks.set(ip, { attempts, lockedUntil: 0 });
  return { ok: false, status: 401, message: `Invalid username or password. ${MAX_LOGIN_ATTEMPTS - attempts} attempts left.` };
}

function verifyPassword(password, admin) {
  const actual = crypto.pbkdf2Sync(password, admin.salt, admin.iterations, 32, admin.digest);
  const expected = Buffer.from(admin.passwordHash, 'hex');
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function updateAdminProfile(body) {
  const admin = readAdminCredentials();
  const currentPassword = String(body.currentPassword || '');
  const username = String(body.username || admin.username).trim();
  const newPassword = String(body.newPassword || '');

  if (!verifyPassword(currentPassword, admin)) {
    throw Object.assign(new Error('Current password is incorrect.'), { status: 401 });
  }
  if (!username) {
    throw Object.assign(new Error('Username is required.'), { status: 400 });
  }
  if (newPassword && newPassword.length < 8) {
    throw Object.assign(new Error('New password must be at least 8 characters.'), { status: 400 });
  }

  const nextAdmin = createAdminCredential(username, newPassword || currentPassword);
  writeJson(ADMIN_PATH, {
    ...nextAdmin,
    updatedAt: new Date().toISOString(),
  });
  return { username, message: 'Admin profile updated. Please log in again.' };
}

function registerUser(body) {
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!name || name.length > 80) {
    return { ok: false, status: 400, message: 'Please enter your name.' };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, status: 400, message: 'Please enter a valid email address.' };
  }
  if (password.length < 8) {
    return { ok: false, status: 400, message: 'Password must be at least 8 characters.' };
  }

  const users = readUsers();
  if (findUserByEmail(users, email)) {
    return { ok: false, status: 409, message: 'An account with this email already exists.' };
  }

  const user = {
    id: createId('user'),
    name,
    email,
    ...hashPassword(password),
    provider: 'local',
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);

  const token = crypto.randomBytes(32).toString('hex');
  userSessions.set(token, { userId: user.id, name: user.name, email: user.email, expiresAt: Date.now() + USER_SESSION_TTL_MS });
  return { ok: true, token, user };
}

function loginUser(req, emailInput, password) {
  const email = String(emailInput || '').trim().toLowerCase();
  const ip = req.socket.remoteAddress || 'unknown';
  const lock = userLoginLocks.get(ip) || { attempts: 0, lockedUntil: 0 };

  if (lock.lockedUntil && lock.lockedUntil > Date.now()) {
    const minutes = Math.ceil((lock.lockedUntil - Date.now()) / 60000);
    return { ok: false, status: 429, message: `Too many failed attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.` };
  }

  const users = readUsers();
  const user = findUserByEmail(users, email);

  if (user && !user.passwordHash) {
    return { ok: false, status: 401, message: 'This account uses Google Sign-In. Continue with Google instead.' };
  }

  if (user && verifyPassword(String(password || ''), user)) {
    userLoginLocks.delete(ip);
    const token = crypto.randomBytes(32).toString('hex');
    userSessions.set(token, { userId: user.id, name: user.name, email: user.email, expiresAt: Date.now() + USER_SESSION_TTL_MS });
    return { ok: true, token, user };
  }

  const attempts = lock.attempts + 1;
  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    userLoginLocks.set(ip, { attempts: 0, lockedUntil: Date.now() + LOCK_DURATION_MS });
    return { ok: false, status: 429, message: 'Too many failed attempts. Login is locked for 5 minutes.' };
  }

  userLoginLocks.set(ip, { attempts, lockedUntil: 0 });
  return { ok: false, status: 401, message: `Invalid email or password. ${MAX_LOGIN_ATTEMPTS - attempts} attempts left.` };
}

function sanitizeUser(user) {
  return { id: user.id, name: user.name, email: user.email, provider: user.provider || 'local', createdAt: user.createdAt };
}

function findUserByEmail(users, email) {
  return users.find((user) => user.email === email) || null;
}

function findUserByGoogleId(users, googleId) {
  if (!googleId) {
    return null;
  }
  return users.find((user) => user.googleId === googleId) || null;
}

function handleGoogleAuthStart(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    sendJson(req, res, 503, { message: 'Google Sign-In is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI on the backend.' }, {});
    return;
  }

  const state = crypto.randomBytes(16).toString('hex');
  pruneOauthStates();
  oauthStates.set(state, Date.now() + OAUTH_STATE_TTL_MS);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'online',
    prompt: 'select_account',
  });

  res.writeHead(302, { Location: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
  res.end();
}

async function handleGoogleAuthCallback(req, res, url) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const stateExpiry = state ? oauthStates.get(state) : null;
  if (state) {
    oauthStates.delete(state);
  }

  if (!code || !stateExpiry || stateExpiry < Date.now()) {
    res.writeHead(302, { Location: `${frontendUrl}/login?error=google` });
    res.end();
    return;
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || 'Google token exchange failed.');
    }

    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileResponse.json();
    if (!profileResponse.ok || !profile.email) {
      throw new Error('Could not read Google profile.');
    }

    const email = String(profile.email).toLowerCase();
    const users = readUsers();
    let user = findUserByGoogleId(users, profile.sub) || findUserByEmail(users, email);
    let isNewUser = false;

    if (!user) {
      user = {
        id: createId('user'),
        name: profile.name || email.split('@')[0],
        email,
        googleId: profile.sub,
        provider: 'google',
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      isNewUser = true;
    } else if (!user.googleId) {
      user.googleId = profile.sub;
    }
    writeUsers(users);

    if (isNewUser) {
      sendWelcomeEmail(user).catch((error) => console.error('Welcome email failed:', error.message));
    }

    const token = crypto.randomBytes(32).toString('hex');
    userSessions.set(token, { userId: user.id, name: user.name, email: user.email, expiresAt: Date.now() + USER_SESSION_TTL_MS });

    res.writeHead(302, {
      Location: `${frontendUrl}/account`,
      'Set-Cookie': buildSessionCookie(USER_SESSION_COOKIE, token, USER_SESSION_TTL_MS),
    });
    res.end();
  } catch (error) {
    console.error('Google login failed:', error.message);
    res.writeHead(302, { Location: `${frontendUrl}/login?error=google` });
    res.end();
  }
}

function pruneOauthStates() {
  const now = Date.now();
  for (const [state, expiresAt] of oauthStates) {
    if (expiresAt < now) {
      oauthStates.delete(state);
    }
  }
}

function getMailTransport() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: { user, pass },
  });
}

async function sendWelcomeEmail(user) {
  const transport = getMailTransport();
  if (!transport) {
    console.warn(`SMTP not configured; skipped welcome email for ${user.email}.`);
    return;
  }
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const safeName = escapeHtml(user.name);
  const safeEmail = escapeHtml(user.email);
  await transport.sendMail({
    from,
    to: user.email,
    subject: 'Welcome to Volt Fitness',
    text: `Hi ${user.name},\n\nWelcome to Volt Fitness! Your account (${user.email}) is ready to go.\n\nSee you on the training floor.\n- Volt Fitness`,
    html: `<p>Hi ${safeName},</p><p>Welcome to Volt Fitness! Your account (<strong>${safeEmail}</strong>) is ready to go.</p><p>See you on the training floor.</p><p>&mdash; Volt Fitness</p>`,
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

async function uploadToCloudinary(body) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw Object.assign(new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on the backend.'), { status: 503 });
  }

  const file = String(body.dataUrl || '');
  if (!file.startsWith('data:')) {
    throw Object.assign(new Error('Upload file is missing or invalid.'), { status: 400 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = process.env.CLOUDINARY_FOLDER || 'volt-fitness';
  const publicId = createCloudinaryPublicId(body.fileName || 'media');
  const signature = signCloudinaryParams({ folder, public_id: publicId, timestamp }, apiSecret);
  const form = new FormData();
  form.append('file', file);
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  form.append('public_id', publicId);
  form.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: form,
  });
  const data = await response.json();

  if (!response.ok) {
    throw Object.assign(new Error(data.error?.message || 'Cloudinary upload failed.'), { status: 502 });
  }

  return {
    secureUrl: data.secure_url,
    publicId: data.public_id,
    resourceType: data.resource_type,
    format: data.format,
    bytes: data.bytes,
  };
}

function signCloudinaryParams(params, apiSecret) {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return crypto.createHash('sha1').update(`${toSign}${apiSecret}`).digest('hex');
}

function createCloudinaryPublicId(fileName) {
  const base = String(fileName)
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'media';
  return `${base}-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
}

function getSession(req) {
  const token = getSessionToken(req);
  if (!token) {
    return null;
  }
  const session = sessions.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session;
}

function getSessionToken(req) {
  return getCookieValue(req, SESSION_COOKIE);
}

function getUserSession(req) {
  const token = getCookieValue(req, USER_SESSION_COOKIE);
  if (!token) {
    return null;
  }
  const session = userSessions.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    userSessions.delete(token);
    return null;
  }
  return session;
}

function getCookieValue(req, name) {
  const cookies = parseCookies(req.headers.cookie || '');
  return cookies[name];
}

function parseCookies(cookieHeader) {
  return cookieHeader.split(';').reduce((cookies, cookie) => {
    const [rawName, ...rawValue] = cookie.trim().split('=');
    if (!rawName) {
      return cookies;
    }
    cookies[rawName] = decodeURIComponent(rawValue.join('='));
    return cookies;
  }, {});
}

function sessionCookie(token) {
  return buildSessionCookie(SESSION_COOKIE, token, SESSION_TTL_MS);
}

function clearSessionCookie() {
  return buildClearCookie(SESSION_COOKIE);
}

function buildSessionCookie(name, token, ttlMs) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${name}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${Math.floor(ttlMs / 1000)}${secure}`;
}

function buildClearCookie(name) {
  return `${name}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('Request body is too large.'), { status: 413 }));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(Object.assign(new Error('Invalid JSON body.'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(req, res, status, data, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
    ...headers,
  });
  if (status === 204) {
    res.end();
    return;
  }
  res.end(JSON.stringify(data));
}

function corsHeaders(req) {
  const origin = req.headers.origin;
  const allowed = ['http://localhost:3000', 'http://127.0.0.1:3000'];
  if (!origin || !allowed.includes(origin)) {
    return {};
  }
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  };
}

function ensureDataFiles() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(STORE_PATH)) {
    writeJson(STORE_PATH, defaultStore);
  } else {
    writeStore(readStore());
  }
  if (!fs.existsSync(ADMIN_PATH)) {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD;
    if (!password) {
      throw new Error('ADMIN_PASSWORD must be set before the first server start.');
    }
    writeJson(ADMIN_PATH, {
      ...createAdminCredential(username, password),
      createdAt: new Date().toISOString(),
    });
    console.log(`Created admin credential file for username "${username}". Set ADMIN_USERNAME and ADMIN_PASSWORD before first run to change defaults.`);
  }
  if (!fs.existsSync(USERS_PATH)) {
    writeJson(USERS_PATH, []);
  }
}

function readStore() {
  return normalizeStore(readJson(STORE_PATH, defaultStore));
}

function writeStore(store) {
  writeJson(STORE_PATH, normalizeStore(store));
}

function normalizeStore(store) {
  return Object.keys(defaultStore).reduce((nextStore, key) => {
    nextStore[key] = Array.isArray(store?.[key]) ? store[key] : defaultStore[key];
    return nextStore;
  }, {});
}

function readUsers() {
  const users = readJson(USERS_PATH, []);
  return Array.isArray(users) ? users : [];
}

function writeUsers(users) {
  writeJson(USERS_PATH, users);
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const digest = 'sha256';
  const passwordHash = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, 32, digest).toString('hex');
  return {
    salt,
    passwordHash,
    iterations: HASH_ITERATIONS,
    digest,
  };
}

function createAdminCredential(username, password) {
  return {
    username,
    ...hashPassword(password),
  };
}

function readAdminCredentials() {
  return readJson(ADMIN_PATH, null);
}

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return fallback;
  }
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function normalizeItem(resourceName, item) {
  return {
    ...item,
    id: item.id || createId(resourceName),
  };
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }
    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) {
      return;
    }
    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}
