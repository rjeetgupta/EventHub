/**
 * =============================================================================
 * EVENTHUB BACKEND - COMPREHENSIVE DOCUMENTATION
 * =============================================================================
 *
 * Complete backend system for event management with role-based access control
 * Built with Node.js, Express, Prisma, PostgreSQL, and TypeScript
 *
 * =============================================================================
 * TABLE OF CONTENTS
 * =============================================================================
 *
 * 1. PROJECT STRUCTURE
 * 2. CONFIGURATION & SETUP
 * 3. AUTHENTICATION & AUTHORIZATION
 * 4. MIDDLEWARE PIPELINE
 * 5. API ROUTES & ENDPOINTS
 * 6. DATABASE SCHEMA
 * 7. ERROR HANDLING
 * 8. UTILITY FUNCTIONS
 * 9. CODE STYLE & PATTERNS
 * 10. DEPLOYMENT CHECKLIST
 *
 * =============================================================================
 * 1. PROJECT STRUCTURE
 * =============================================================================
 *
 * server/
 * ├── src/
 * │   ├── app.ts                 // Express app configuration
 * │   ├── server.ts              // Server entry point
 * │   ├── config/
 * │   │   ├── db.ts              // Prisma database setup
 * │   │   └── permission.ts       // Permission mappings
 * │   ├── controllers/           // Request handlers
 * │   ├── services/              // Business logic layer
 * │   ├── middlewares/           // Express middleware
 * │   ├── routes/                // API route definitions
 * │   ├── validators/            // Zod validation schemas
 * │   ├── types/                 // TypeScript type definitions
 * │   └── utils/                 // Helper functions
 * ├── prisma/
 * │   ├── schema.prisma          // Database schema
 * │   ├── seed.ts                // Database seeding
 * │   └── migrations/            // Database migrations
 * ├── generated/
 * │   └── prisma/                // Auto-generated Prisma client
 * ├── .env                       // Environment variables
 * ├── package.json
 * ├── tsconfig.json
 * └── prisma.config.ts
 *
 * =============================================================================
 * 2. CONFIGURATION & SETUP
 * =============================================================================
 *
 * .env File Requirements:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ DATABASE_URL=postgresql://user:pass@localhost:5432/EventHub │
 * │ NODE_ENV=development                                        │
 * │ PORT=8000                                                   │
 * │ JWT_SECRET=your-secret-key                                 │
 * │ JWT_EXPIRES_IN=24h                                          │
 * │ JWT_REFRESH_SECRET=your-refresh-secret                      │
 * │ JWT_REFRESH_EXPIRES_IN=7d                                   │
 * │ SUPER_ADMIN_EMAIL=admin@example.com                         │
 * │ SUPER_ADMIN_PASSWORD=Admin@123                              │
 * │ FRONTEND_URL=http://localhost:3000                          │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Startup Process:
 * 1. npm run seed        - Seeds database with roles, permissions, departments
 * 2. npm run dev         - Starts development server with hot-reload
 * 3. npm run build       - Compiles TypeScript to JavaScript
 * 4. npm start           - Runs compiled JavaScript
 *
 * =============================================================================
 * 3. AUTHENTICATION & AUTHORIZATION
 * =============================================================================
 *
 * Authentication Flow:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                      USER LOGIN PROCESS                         │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ 1. POST /api/v1/auth/login                                      │
 * │    Request: { email, password }                                 │
 * │                                                                 │
 * │ 2. Service validates credentials against hashed password        │
 * │    JWT tokens generated:                                        │
 * │    - accessToken (15 min) - stored in httpOnly cookie          │
 * │    - refreshToken (7 days) - stored in database & cookie       │
 * │                                                                 │
 * │ 3. Response includes user profile                              │
 * │    { user: { id, email, role, departmentId, ... } }           │
 * │                                                                 │
 * │ 4. Subsequent requests use accessToken automatically           │
 * │    (from cookies or Authorization header)                      │
 * │                                                                 │
 * │ 5. When accessToken expires, use /api/v1/auth/refresh-token    │
 * │    to get new accessToken using stored refreshToken            │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Roles & Permissions:
 * ┌──────────────────┬──────────────────────────────────────────────────┐
 * │ SUPER_ADMIN      │ Full system access - can manage everything       │
 * ├──────────────────┼──────────────────────────────────────────────────┤
 * │ DEPARTMENT_ADMIN │ Manage department, events, group admins          │
 * ├──────────────────┼──────────────────────────────────────────────────┤
 * │ GROUP_ADMIN      │ Create/manage events (customizable permissions)  │
 * ├──────────────────┼──────────────────────────────────────────────────┤
 * │ STUDENT          │ Register for events, view results               │
 * └──────────────────┴──────────────────────────────────────────────────┘
 *
 * Permission Types:
 * ┌─────────────────────────┬──────────────────────────────────────────┐
 * │ CREATE_EVENT            │ Can create new events                    │
 * │ UPDATE_EVENT            │ Can edit existing events                 │
 * │ DELETE_EVENT            │ Can delete events                        │
 * │ PUBLISH_EVENT           │ Can publish events                       │
 * │ CLOSE_EVENT             │ Can close registration                   │
 * │ MARK_ATTENDANCE         │ Can mark attendance                      │
 * │ DECLARE_WINNERS         │ Can declare winners                      │
 * │ MANAGE_GROUP_ADMINS     │ Can manage group admins                  │
 * │ ASSIGN_PERMISSIONS      │ Can assign permissions to group admins   │
 * │ VIEW_REGISTRATIONS      │ Can view registration data               │
 * └─────────────────────────┴──────────────────────────────────────────┘
 *
 * =============================================================================
 * 4. MIDDLEWARE PIPELINE
 * =============================================================================
 *
 * Request Flow in app.ts:
 * ┌────────────────────────────────────────────────────────────────┐
 * │ 1. CORS Middleware          - Allow cross-origin requests      │
 * │ 2. Cookie Parser            - Parse cookies from headers       │
 * │ 3. Express JSON Parser      - Parse JSON request bodies        │
 * │ 4. Express URL-Encoded      - Parse form data                  │
 * │ 5. Route Handlers           - Route-specific logic             │
 * │    ├─ verifyJWT            - Require authentication            │
 * │    ├─ authorizeRoles       - Check user role                   │
 * │    ├─ authorizePermission  - Check specific permission         │
 * │    └─ optionalAuth         - Optional authentication           │
 * │ 6. 404 Handler              - Route not found                  │
 * │ 7. Error Handler            - Global error handling (LAST)     │
 * └────────────────────────────────────────────────────────────────┘
 *
 * Middleware Details:
 *
 * verifyJWT:
 *   - Checks: req.cookies.accessToken OR req.headers.Authorization
 *   - Sets: req.user = { id, role, departmentId }
 *   - Throws: 401 if token missing/invalid
 *
 * authorizeRoles(...roles):
 *   - Checks: req.user.role in allowed roles
 *   - Usage: authorizeRoles("SUPER_ADMIN", "DEPARTMENT_ADMIN")
 *   - Throws: 403 if role not allowed
 *
 * authorizePermission(permissionName):
 *   - For SUPER_ADMIN & DEPARTMENT_ADMIN: Auto-approved
 *   - For GROUP_ADMIN: Checks GroupAdminPermission table
 *   - For STUDENT: Throws 403
 *   - Usage: authorizePermission("CREATE_EVENT")
 *
 * optionalAuth:
 *   - Tries to authenticate but doesn't fail if token missing
 *   - Sets req.user if valid token found, undefined otherwise
 *   - Used for public endpoints with optional auth
 *
 * Error Handler:
 *   - Catches all errors (sync & async)
 *   - Handles: ApiError, ZodError, JWTError, PrismaError
 *   - Returns consistent error response
 *   - MUST be last middleware
 *
 * =============================================================================
 * 5. API ROUTES & ENDPOINTS
 * =============================================================================
 *
 * Authentication Routes (/api/v1/auth):
 * ┌──────────┬─────────────────┬────────────┬────────────────────┐
 * │ Method   │ Endpoint        │ Auth       │ Description        │
 * ├──────────┼─────────────────┼────────────┼────────────────────┤
 * │ POST     │ /register       │ None       │ Register student   │
 * │ POST     │ /login          │ None       │ Login user         │
 * │ POST     │ /refresh-token  │ None       │ Refresh JWT        │
 * │ POST     │ /logout         │ None       │ Logout user        │
 * │ POST     │ /change-pwd     │ verifyJWT  │ Change password    │
 * │ PUT      │ /update-profile │ verifyJWT  │ Update profile     │
 * └──────────┴─────────────────┴────────────┴────────────────────┘
 *
 * Event Routes (/api/v1/events):
 * ┌──────────┬──────────────┬──────────────────────┬────────────────┐
 * │ Method   │ Endpoint     │ Middleware           │ Description    │
 * ├──────────┼──────────────┼──────────────────────┼────────────────┤
 * │ POST     │ /            │ verifyJWT, perm      │ Create event   │
 * │ GET      │ /            │ optionalAuth         │ List events    │
 * │ GET      │ /:id         │ optionalAuth         │ Get event      │
 * │ PUT      │ /:id         │ verifyJWT, perm      │ Update event   │
 * │ DELETE   │ /:id         │ verifyJWT, perm      │ Delete event   │
 * └──────────┴──────────────┴──────────────────────┴────────────────┘
 *
 * Other Route Groups:
 * - /api/v1/registrations      - Student event registration
 * - /api/v1/departments        - Department management
 * - /api/v1/group-admin        - Group admin management
 * - /api/v1/students           - Student data endpoints
 * - /api/v1/permissions        - Permission management
 * - /api/v1/certificates       - Certificate handling
 * - /api/v1/results            - Event results
 * - /api/v1/winners            - Winner declaration
 * - /api/v1/leaderboard        - Leaderboard data
 *
 * =============================================================================
 * 6. DATABASE SCHEMA
 * =============================================================================
 *
 * Core Tables:
 * - User              - User accounts with roles
 * - Role              - Role definitions (SUPER_ADMIN, etc.)
 * - Permission        - Permission types
 * - RolePermission    - Role-to-Permission mapping
 * - Department        - Department organization
 * - Event             - Events with approval workflow
 * - Registration      - Student event registrations
 * - Approval          - Event approval records
 * - GroupAdminPermission - Custom permissions for group admins
 * - RefreshToken      - Token management
 *
 * Relationships:
 * - User.role -> Role (many-to-one)
 * - User.department -> Department (many-to-one)
 * - Event.creator -> User (many-to-one)
 * - Event.approver -> User (many-to-one)
 * - Event.department -> Department (many-to-one)
 * - Registration.user -> User (many-to-one)
 * - Registration.event -> Event (many-to-one)
 *
 * =============================================================================
 * 7. ERROR HANDLING
 * =============================================================================
 *
 * Error Response Format:
 * {
 *   "success": false,
 *   "statusCode": 400,
 *   "message": "Error description",
 *   "errors": [{ field: "email", message: "Invalid format" }]  // Optional
 * }
 *
 * Status Codes Used:
 * - 200: Success (GET, POST with no creation)
 * - 201: Created (POST creates new resource)
 * - 400: Bad Request (validation error)
 * - 401: Unauthorized (auth required or failed)
 * - 403: Forbidden (insufficient permissions)
 * - 404: Not Found (resource doesn't exist)
 * - 500: Internal Server Error
 *
 * Error Throwing:
 * throw new ApiError(401, "Unauthorized");
 * throw new ApiError(400, "Validation failed", errors);
 *
 * Auto-Caught Errors:
 * - Zod validation errors
 * - JWT verification errors
 * - Database errors
 * - Async promise rejections
 *
 * =============================================================================
 * 8. UTILITY FUNCTIONS
 * =============================================================================
 *
 * asyncHandler(fn):
 *   Wraps async controller functions to catch errors automatically
 *   Usage: export const handler = asyncHandler(async (req, res) => {...})
 *
 * generateAccessToken(payload):
 *   Creates JWT token (15 min expiry)
 *   Usage: const token = generateAccessToken({ userId, role, departmentId })
 *
 * generateRefreshToken():
 *   Creates random refresh token (7 day expiry)
 *   Usage: const refresh = generateRefreshToken()
 *
 * verifyAccessToken(token):
 *   Validates and decodes JWT
 *   Usage: const payload = verifyAccessToken(token)
 *
 * ApiError(statusCode, message, errors):
 *   Custom error class
 *   Usage: throw new ApiError(400, "Invalid input")
 *
 * ApiResponse(statusCode, data, message):
 *   Response formatter
 *   Usage: res.json(new ApiResponse(200, userData, "Success"))
 *
 * =============================================================================
 * 9. CODE STYLE & PATTERNS
 * =============================================================================
 *
 * Controller Pattern:
 * ┌───────────────────────────────────────────────────────────────────┐
 * │ export const handler = asyncHandler(async (req, res) => {         │
 * │   // 1. Parse & validate input (Zod)                             │
 * │   const data = schema.parse(req.body);                            │
 * │                                                                   │
 * │   // 2. Call service for business logic                          │
 * │   const result = await service.doSomething(data);                │
 * │                                                                   │
 * │   // 3. Return consistent response                               │
 * │   res.json(new ApiResponse(200, result, "Success"));             │
 * │ });                                                               │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * Service Pattern:
 * ┌───────────────────────────────────────────────────────────────────┐
 * │ export const doSomething = async (data: any) => {                │
 * │   // 1. Validate access (throw ApiError if not allowed)          │
 * │   if (!hasAccess) throw new ApiError(403, "Not authorized");     │
 * │                                                                   │
 * │   // 2. Database operations with Prisma                          │
 * │   const result = await prisma.model.action(...);                 │
 * │                                                                   │
 * │   // 3. Return clean data                                        │
 * │   return result;                                                 │
 * │ };                                                                │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * Middleware Pattern:
 * ┌───────────────────────────────────────────────────────────────────┐
 * │ export const middleware = asyncHandler(async (req, res, next) => {│
 * │   // 1. Check conditions (throw ApiError if invalid)             │
 * │   if (!condition) throw new ApiError(401, "Error");              │
 * │                                                                   │
 * │   // 2. Attach data to request                                   │
 * │   req.user = { id, role, departmentId };                         │
 * │                                                                   │
 * │   // 3. Call next middleware                                     │
 * │   next();                                                         │
 * │ });                                                               │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * =============================================================================
 * 10. DEPLOYMENT CHECKLIST
 * =============================================================================
 *
 * Before Deployment:
 * □ Set NODE_ENV=production in .env
 * □ Use strong JWT_SECRET and JWT_REFRESH_SECRET
 * □ Configure secure database URL with SSL
 * □ Set FRONTEND_URL to production domain
 * □ Run database migrations: npm run migrate
 * □ Seed initial data: npm run seed
 * □ Test all authentication flows
 * □ Test permission checks on protected routes
 * □ Set up error logging (Sentry, CloudWatch, etc.)
 * □ Enable HTTPS for all endpoints
 * □ Set httpOnly cookies in production
 * □ Configure CORS for production domain only
 * □ Run load testing to verify performance
 *
 * Production Settings in .env:
 * NODE_ENV=production
 * PORT=8000
 * FRONTEND_URL=https://yourdomain.com
 * JWT_SECRET=<strong-random-key>
 * JWT_REFRESH_SECRET=<strong-random-key>
 * DATABASE_URL=postgresql://<user>:<pass>@<host>:<port>/eventhub
 *
 * Monitoring:
 * - Monitor server logs for errors
 * - Track API response times
 * - Monitor database performance
 * - Alert on authentication failures
 * - Check token refresh success rate
 *
 * =============================================================================
 * END OF DOCUMENTATION
 * =============================================================================
 */

export const BACKEND_DOCUMENTATION = true;
