# Authentication Implementation Guide

## ✅ Completed Authentication Setup

### 1. Authentication Pages

#### Login Page ([/login](src/app/(auth)/login/page.tsx))
- Email and password inputs
- "Remember me" checkbox
- Forgot password link
- Social login buttons (Google, Facebook) - UI only
- Loading states during authentication
- Error handling and display
- Redirects to `/focus` on successful login
- Uses `useAuth` hook for authentication

#### Register Page ([/register](src/app/(auth)/register/page.tsx))
- Full name, email, password, and confirm password inputs
- Password validation (minimum 8 characters)
- Terms and conditions checkbox
- Social signup buttons - UI only
- Loading states during registration
- Error handling and display
- Redirects to `/onboarding` after successful registration
- Feature highlights at the bottom

#### Onboarding Page ([/onboarding](src/app/(auth)/onboarding/page.tsx))
- Multi-step wizard (3 steps + generating state):
  1. **Welcome**: Introduction with feature highlights
  2. **Goals**: Select primary fitness goal
  3. **Experience**: Choose fitness level (beginner/intermediate/advanced)
  4. **Preferences**: Set available time and preferred activities
  5. **Generating**: Shows progress while AI creates personalized plan
- Calls `useGeneratePlan` to create user's first plan
- Redirects to `/focus` when plan is ready

### 2. Protected Routes Middleware

#### Middleware ([middleware.ts](src/middleware.ts))
- Checks for `access_token` cookie
- Protected routes: `/focus`, `/journey`, `/coach`, `/you`, `/tribe`, `/components-demo`
- Auth routes: `/login`, `/register`
- Redirects unauthenticated users to `/login` with `redirect` query param
- Redirects authenticated users away from auth pages to `/focus`
- Runs on all routes except API, static files, and Next.js internals

### 3. Token Management

#### Cookie Utilities ([lib/cookies.ts](src/lib/cookies.ts))
- `saveTokens()` - Saves tokens to both localStorage and cookies
- `clearTokens()` - Removes tokens from localStorage and cookies
- `hasValidToken()` - Checks if user has valid access token
- `setCookie()`, `getCookie()`, `deleteCookie()` - Cookie management helpers
- Tokens stored in cookies for middleware access
- Tokens also in localStorage for API client

#### Updated API Client ([lib/api-client.ts](src/lib/api-client.ts))
- Uses `saveTokens()` on successful login
- Uses `clearTokens()` on logout and failed refresh
- Automatic token refresh on 401 errors
- Saves refreshed tokens to both storage mechanisms

### 4. Dashboard Integration

#### Updated Layout ([app/(dashboard)/layout.tsx](src/app/(dashboard)/layout.tsx))
- Uses `useUser()` hook to fetch current user data
- Displays user's name and email
- Shows user initials in avatar (calculated from full_name)
- Dropdown menu with:
  - Profile & Settings link (goes to `/you`)
  - Logout button (calls `useAuth().logout()`)
- Menu closes after selection
- Loading state shows "Loading..." until user data arrives

#### Updated Home Page ([app/page.tsx](src/app/page.tsx))
- Checks authentication with `hasValidToken()`
- Auto-redirects authenticated users to `/focus`
- Beautiful landing page for non-authenticated users
- CTA buttons for "Get Started Free" and "Sign In"
- Feature highlights with glassmorphism cards

## 🔐 Authentication Flow

### Registration Flow
```
User fills register form
  ↓
Validates inputs (password match, length, terms accepted)
  ↓
Calls api.auth.register()
  ↓
Backend creates user account
  ↓
Redirects to /onboarding
  ↓
User completes onboarding wizard
  ↓
Calls api.plans.generate() to create first plan
  ↓
Redirects to /focus dashboard
```

### Login Flow
```
User fills login form
  ↓
Calls api.auth.login() with email and password
  ↓
Backend validates credentials and returns JWT tokens
  ↓
saveTokens() stores to localStorage + cookies
  ↓
useAuth invalidates user query to fetch fresh data
  ↓
Redirects to /focus dashboard
```

### Auto-Refresh Flow
```
API request gets 401 Unauthorized
  ↓
API client intercepts the error
  ↓
Attempts to refresh token using refresh_token
  ↓
If refresh succeeds:
  - Saves new tokens
  - Retries original request
  - User stays logged in
  ↓
If refresh fails:
  - Clears all tokens
  - Redirects to /login
  - User must log in again
```

### Logout Flow
```
User clicks Logout in dropdown
  ↓
Calls useAuth().logout()
  ↓
clearTokens() removes from localStorage + cookies
  ↓
queryClient.clear() removes all cached data
  ↓
Redirects to /login
```

### Protected Route Flow
```
User navigates to /focus
  ↓
Middleware checks for access_token cookie
  ↓
If no token:
  - Redirects to /login?redirect=/focus
  ↓
If has token:
  - Allows navigation
  - Page loads
  - useUser() hook fetches user data
  - UI renders with user information
```

## 📝 Usage Examples

### Using Authentication Hooks

```typescript
import { useAuth, useUser, useIsAuthenticated } from '@/hooks/useUser';

function MyComponent() {
  // Login/Register/Logout
  const { login, register, logout, isLoggingIn, loginError } = useAuth();

  // Get current user
  const { data: user, isLoading } = useUser();

  // Check auth status
  const { isAuthenticated, user } = useIsAuthenticated();

  const handleLogin = async () => {
    try {
      await login({ username: 'user@example.com', password: 'password' });
      // Auto redirects and fetches user data
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return <div>Welcome {user?.full_name}</div>;
}
```

### Checking Authentication on Client

```typescript
import { hasValidToken } from '@/lib/cookies';

function MyPage() {
  useEffect(() => {
    if (!hasValidToken()) {
      router.push('/login');
    }
  }, []);
}
```

## 🔧 Configuration

### Environment Variables

Required in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

### Protected Routes

To add more protected routes, update `middleware.ts`:
```typescript
const protectedRoutes = [
  '/focus',
  '/journey',
  '/your-new-route',  // Add here
];
```

## 🎨 UI Features

### Form Validation
- Client-side validation before API calls
- Clear error messages
- Disabled buttons during loading
- Password strength requirements
- Email format validation

### Loading States
- Spinner animations during API calls
- Disabled form inputs while processing
- Loading text indicators
- Smooth transitions

### Error Handling
- Red error boxes for failed auth
- Detailed error messages from backend
- Network error fallbacks
- Auto-retry for token refresh

### Responsive Design
- Mobile-friendly layouts
- Touch-friendly buttons
- Proper spacing on all devices
- Glassmorphism effects

## 🚀 Next Steps

1. **Database Setup**: Set up PostgreSQL to enable actual registration/login
2. **Email Verification**: Add email verification flow
3. **Password Reset**: Implement forgot password functionality
4. **Social Auth**: Integrate real OAuth (Google, Facebook)
5. **Session Management**: Add "remember me" functionality
6. **Security**: Add rate limiting and CSRF protection

## 🐛 Current Limitations

- ⚠️ **Database not set up**: Auth endpoints work but database connection pending
- ⚠️ **Social login**: Buttons are UI only, no OAuth integration yet
- ⚠️ **Email verification**: Not implemented
- ⚠️ **Password reset**: Not implemented
- ⚠️ **Remember me**: Cookie but no server-side session extension

## ✅ Testing

To test the auth flow:

1. **Without Database**:
   - UI components all work
   - Forms validate properly
   - Navigation and redirects work
   - Middleware protects routes
   - Token management works (with stub tokens)

2. **With Database** (after setup):
   - Register: http://localhost:3000/register
   - Login: http://localhost:3000/login
   - Protected page: http://localhost:3000/focus
   - Logout from user menu in dashboard

## 📚 Related Files

- Authentication hooks: `src/hooks/useUser.ts`
- API client: `src/lib/api-client.ts`
- Cookie utilities: `src/lib/cookies.ts`
- Middleware: `src/middleware.ts`
- Login page: `src/app/(auth)/login/page.tsx`
- Register page: `src/app/(auth)/register/page.tsx`
- Onboarding: `src/app/(auth)/onboarding/page.tsx`
- Dashboard layout: `src/app/(dashboard)/layout.tsx`
- Home page: `src/app/page.tsx`
