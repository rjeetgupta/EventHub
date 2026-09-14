# Quick Reference Guide

## 🎯 Validators Quick Start

```typescript
// Auth Validators
import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
} from '@/lib/validators/auth.validators';

const login = loginSchema.parse({ email, password });
const register = registerSchema.parse({ name, email, password, department });
const changePass = changePasswordSchema.parse({ currentPassword, newPassword });

// Event Validators
import {
  createEventSchema,
  updateEventSchema,
  eventFiltersSchema,
} from '@/lib/validators/event.validators';

const event = createEventSchema.parse({ title, description, date, mode });
const updated = updateEventSchema.parse({ title, status });
const filters = eventFiltersSchema.parse({ page, limit, status });

// Approval Validators
import {
  approveEventSchema,
  rejectEventSchema,
} from '@/lib/validators/approval.validators';

const approve = approveEventSchema.parse({ eventId, feedback });
const reject = rejectEventSchema.parse({ eventId, feedback });
```

---

## 🔐 Permission Hooks Quick Start

```typescript
// Check permissions
const canCreate = useCanCreateEvents(user);
const canApprove = useCanApproveEvent(user);
const canEdit = useCanEditEvent(user, eventOwnerId);
const canManage = useCanManageUsers(user);
const canView = useCanViewAnalytics(user);

// Get permissions
const permissions = useUserPermissions(user);
const flags = useFeatureFlags(user);
const routes = useAllowedRoutes(user);

// Check roles
const isDeptAdmin = useHasRole(user, ['deptAdmin', 'admin']);

// Conditional rendering
{canCreate && <CreateEventButton />}
{canApprove && <ApproveButton />}
```

---

## 📝 Service Methods Quick Start

### AuthService
```typescript
import { AuthService } from '@/services/authService';

await AuthService.login(credentials);
await AuthService.register(data);
await AuthService.logout();
await AuthService.getCurrentUser();
await AuthService.updateProfile(data);
await AuthService.changePassword(data);
await AuthService.forgotPassword(data);
await AuthService.resetPassword(data);
```

### EventService
```typescript
import { EventService } from '@/services/eventService';

await EventService.getEvents(filters, user);
await EventService.getEventById(id);
await EventService.createEvent(data, user);
await EventService.updateEvent(id, data, user, ownerId);
await EventService.deleteEvent(id, user, ownerId);
await EventService.registerForEvent(data);
await EventService.getMyEvents(user);
```

### ApprovalService
```typescript
import { ApprovalService } from '@/services/approvalService';

await ApprovalService.getPendingEvents(filters, user);
await ApprovalService.approveEvent(data, user);
await ApprovalService.rejectEvent(data, user);
await ApprovalService.getApprovalHistory(user);
ApprovalService.canApproveEvent(user);
ApprovalService.canViewPendingApprovals(user);
```

---

## 🎭 Role-Based Access Control

### Roles
- **student**: Can register for events, view own events
- **groupAdmin**: Can create events, edit own events
- **deptAdmin**: Can approve events, manage department
- **admin**: Can do everything

### Service Response Format
```typescript
interface Response<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;  // Validation errors
}

// Usage
const result = await AuthService.login(creds);
if (result.success) {
  // Handle success
  console.log(result.data);
} else if (result.errors) {
  // Handle validation errors
  Object.entries(result.errors).forEach(([field, error]) => {
    console.error(`${field}: ${error}`);
  });
} else {
  // Handle general error
  console.error(result.message);
}
```

---

## 🔍 Type Safety Examples

```typescript
// Type-safe form data
const formData: LoginInput = {
  email: 'user@example.com',
  password: 'password123',
};

// Type-safe event creation
const eventData: CreateEventInput = {
  title: 'Event Title',
  description: 'Event description...',
  date: '2024-03-15',
  time: '10:00',
  mode: 'Hybrid',
  maxCapacity: 100,
  registrationDeadline: '2024-03-10',
  certificateAvailable: true,
};

// Type-safe filters
const filters: EventFiltersInput = {
  page: 1,
  limit: 10,
  status: 'upcoming',
  mode: 'Online',
};
```

---

## 🛡️ Common Patterns

### Pattern: Protected Component
```tsx
function ProtectedComponent({ user }: { user: User }) {
  const canAccess = useHasRole(user, ['admin', 'deptAdmin']);
  
  if (!canAccess) return <AccessDenied />;
  return <Component />;
}
```

### Pattern: Validation + API Call
```tsx
async function handleSubmit(formData: unknown) {
  try {
    const validated = loginSchema.parse(formData);
    const result = await AuthService.login(validated);
    
    if (result.success) {
      // Success
    } else if (result.errors) {
      // Validation errors
      setFieldErrors(result.errors);
    } else {
      // API error
      setErrorMessage(result.message);
    }
  } catch (error) {
    // Unexpected error
  }
}
```

### Pattern: Role-Based Filtering
```tsx
function EventsList({ user, allEvents }: Props) {
  const visibleEvents = useFilterEventsByRole(user, allEvents);
  
  return (
    <div>
      {visibleEvents.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
```

### Pattern: Permission-Based Features
```tsx
function EventCard({ event, user }: Props) {
  const canEdit = useCanEditEvent(user, event.organizerId);
  const canApprove = useCanApproveEvent(user);
  
  return (
    <div>
      <h3>{event.title}</h3>
      {canEdit && <EditButton />}
      {canApprove && <ApproveButton />}
    </div>
  );
}
```

---

## ⚠️ Error Handling

### Validation Error
```typescript
// Field-level errors
const result = await AuthService.login(creds);
if (result.errors) {
  result.errors.email;    // "Invalid email"
  result.errors.password; // "Password too short"
}
```

### Permission Error
```typescript
// Check before calling service
const canCreate = useCanCreateEvents(user);
if (!canCreate) {
  showError('You cannot create events');
  return;
}
```

### API Error
```typescript
const result = await EventService.createEvent(data, user);
if (!result.success) {
  console.error(result.message);  // "Server error"
}
```

---

## 📚 Documentation Files

1. **IMPLEMENTATION_COMPLETE.md** - Full overview
2. **ZOD_RBAC_GUIDE.md** - Detailed guide with examples
3. **This file** - Quick reference

---

## 🚀 Getting Started

1. **Import validator:**
   ```typescript
   import { loginSchema } from '@/lib/validators/auth.validators';
   ```

2. **Validate data:**
   ```typescript
   const valid = loginSchema.parse(formData);
   ```

3. **Call service:**
   ```typescript
   const result = await AuthService.login(valid);
   ```

4. **Check permission:**
   ```typescript
   const canCreate = useCanCreateEvents(user);
   ```

5. **Handle response:**
   ```typescript
   if (result.success) {
     // Success
   } else {
     // Error handling
   }
   ```

---

## 🔗 File Locations

```
src/lib/validators/
├── auth.validators.ts
├── event.validators.ts
└── approval.validators.ts

src/lib/
└── usePermissions.ts

src/types/
└── service.ts

src/services/
├── authService.ts
├── eventService.ts
└── approvalService.ts

src/api/
├── auth.api.ts
├── events.api.ts
└── approvals.api.ts
```

---

## 💡 Pro Tips

1. **Always validate before API calls**
   ```typescript
   const validated = loginSchema.parse(data);
   const result = await AuthService.login(validated);
   ```

2. **Use hooks in components**
   ```typescript
   const canCreate = useCanCreateEvents(user);
   // Auto re-computes when user changes
   ```

3. **Check permissions first**
   ```typescript
   if (!useHasRole(user, ['deptAdmin', 'admin'])) return <AccessDenied />;
   ```

4. **Handle all response cases**
   ```typescript
   if (result.success) { ... }
   else if (result.errors) { ... }
   else { ... }
   ```

5. **Reuse validators as types**
   ```typescript
   type LoginForm = z.infer<typeof loginSchema>;
   ```
