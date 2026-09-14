# Zod Validation & Role-Based Services Implementation

## 📋 Overview

This implementation provides:
- **Zod Validation Schemas** for all API inputs
- **Role-Based Access Control** (RBAC) with 4 roles: student, groupAdmin, deptAdmin, admin
- **Type-Safe Services** with automatic permission checking
- **Permission Hooks** for fine-grained access control
- **Error Handling** with validation feedback

## 🗂️ File Structure

```
src/
├── lib/
│   ├── validators/
│   │   ├── auth.validators.ts      # Login, register, password
│   │   ├── event.validators.ts     # Event CRUD operations
│   │   └── approval.validators.ts  # Approval operations
│   └── usePermissions.ts           # Permission hooks (14+ hooks)
├── types/
│   └── service.ts                  # Role-based types, feature flags
├── services/
│   ├── authService.ts              # Auth with validation
│   ├── eventService.ts             # Events with RBAC
│   └── approvalService.ts          # Approvals with RBAC
└── api/
    ├── auth.api.ts
    ├── events.api.ts
    └── approvals.api.ts
```

## 🔐 Role Hierarchy

```
Admin
├── Can do everything
└── Access to all data

DeptAdmin
├── Approve/reject events
├── View department analytics
├── Manage department users
└── View all department events

GroupAdmin
├── Create events
├── Edit own events
├── Submit for approval
├── View own analytics

Student
├── Register for events
├── View own events
└── Download certificates
```

## ✅ Validation Schemas

### Auth Validators

```typescript
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
  changePasswordSchema,
  type LoginInput,
  type RegisterInput,
} from '@/lib/validators/auth.validators';

// Usage
const validatedLogin = loginSchema.parse(formData);
const validatedRegister = registerSchema.parse(formData);
```

### Event Validators

```typescript
import {
  createEventSchema,
  updateEventSchema,
  eventFiltersSchema,
  type CreateEventInput,
  type UpdateEventInput,
} from '@/lib/validators/event.validators';

// Usage
const validatedEvent = createEventSchema.parse(eventData);
const validatedFilters = eventFiltersSchema.parse(filters);
```

### Approval Validators

```typescript
import {
  approveEventSchema,
  rejectEventSchema,
  approvalFiltersSchema,
  type ApproveEventInput,
  type RejectEventInput,
} from '@/lib/validators/approval.validators';

// Usage
const validatedApproval = approveEventSchema.parse(approvalData);
const validatedRejection = rejectEventSchema.parse(rejectionData);
```

## 🛠️ Services Usage

### Auth Service

```typescript
import { AuthService } from '@/services/authService';

// Login with validation
const result = await AuthService.login({ 
  email: 'user@example.com', 
  password: 'password123' 
});

if (result.success) {
  console.log('User:', result.data.user);
} else {
  console.error('Errors:', result.errors);
}

// Change password with validation
const pwResult = await AuthService.changePassword({
  currentPassword: 'old123',
  newPassword: 'new456',
  confirmPassword: 'new456',
});
```

### Event Service

```typescript
import { EventService } from '@/services/eventService';

// Get events with role-based filtering
const result = await EventService.getEvents(
  { page: 1, limit: 10, status: 'upcoming' },
  currentUser
);

// Create event with permission check
const createResult = await EventService.createEvent(
  {
    title: 'Tech Summit',
    description: 'Annual tech conference...',
    date: '2024-03-15',
    time: '10:00',
    mode: 'Hybrid',
    maxCapacity: 100,
    // ... other fields
  },
  currentUser
);

if (!createResult.success) {
  // Handle error or permission denied
  console.error(createResult.message);
}

// Update event with authorization check
const updateResult = await EventService.updateEvent(
  eventId,
  updatedData,
  currentUser,
  eventOwnerId
);

// Delete event with authorization check
const deleteResult = await EventService.deleteEvent(
  eventId,
  currentUser,
  eventOwnerId
);
```

### Approval Service

```typescript
import { ApprovalService } from '@/services/approvalService';

// Get pending events (deptAdmin/admin only)
const pendingResult = await ApprovalService.getPendingEvents(
  { page: 1, limit: 10 },
  currentUser
);

// Approve event (deptAdmin/admin only)
const approveResult = await ApprovalService.approveEvent(
  {
    eventId: eventId,
    feedback: 'Looks good!',
  },
  currentUser
);

// Reject event with required feedback (deptAdmin/admin only)
const rejectResult = await ApprovalService.rejectEvent(
  {
    eventId: eventId,
    feedback: 'Need more details about budget allocation...',
  },
  currentUser
);

// Check permissions
const canApprove = ApprovalService.canApproveEvent(currentUser);
```

## 🎯 Permission Hooks

### Basic Hooks

```typescript
import {
  useUserPermissions,
  useHasPermission,
  useHasRole,
  useFeatureFlags,
  useAllPermissions,
} from '@/lib/usePermissions';

// Get all permissions for user
const permissions = useUserPermissions(user);
// Returns: { canCreateEvents: true, canApproveEvents: false, ... }

// Check single permission
const canCreate = useHasPermission(user, 'canCreateEvents');

// Check if user has role
const isDeptAdmin = useHasRole(user, ['deptAdmin', 'admin']);

// Get feature flags
const flags = useFeatureFlags(user);
// Returns: { eventManagement: true, approvals: false, ... }

// Get all permissions
const allPerms = useAllPermissions(user);
```

### Resource-Based Access Control

```typescript
import {
  useCanEditEvent,
  useCanApproveEvent,
  useCanCreateEvents,
  useCanViewAnalytics,
  useCanManageUsers,
} from '@/lib/usePermissions';

// Check if user can edit specific event
const canEdit = useCanEditEvent(user, eventOwnerId);

// Check if user can approve events
const canApprove = useCanApproveEvent(user);

// Check if user can create events
const canCreate = useCanCreateEvents(user);

// Check if user can view analytics
const canViewAnalytics = useCanViewAnalytics(user);

// Check if user can manage users
const canManage = useCanManageUsers(user);
```

### Data Filtering

```typescript
import {
  useFilterEventsByRole,
  useAccessibleDepartments,
  useAllowedRoutes,
} from '@/lib/usePermissions';

// Get events visible to user
const visibleEvents = useFilterEventsByRole(user, allEvents);

// Get departments user can access
const accessibleDepts = useAccessibleDepartments(user);

// Get routes user can navigate to
const allowedRoutes = useAllowedRoutes(user);
```

## 📝 Component Examples

### Login Component with Validation

```tsx
'use client';

import { FormEvent, useState } from 'react';
import { AuthService } from '@/services/authService';
import { loginSchema, type LoginInput } from '@/lib/validators/auth.validators';
import { ZodError } from 'zod';

export default function LoginComponent() {
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const result = await AuthService.login(formData);

    if (!result.success) {
      if (result.errors) {
        setErrors(result.errors);
      } else {
        setErrors({ submit: result.message });
      }
    } else {
      // Redirect to dashboard
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      {errors.email && <p className="error">{errors.email}</p>}

      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      {errors.password && <p className="error">{errors.password}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Create Event Component with RBAC

```tsx
'use client';

import { FormEvent, useState } from 'react';
import { EventService } from '@/services/eventService';
import { useCanCreateEvents } from '@/lib/usePermissions';
import {
  createEventSchema,
  type CreateEventInput,
} from '@/lib/validators/event.validators';
import { User } from '@/types/api';

interface CreateEventComponentProps {
  currentUser: User;
}

export default function CreateEventComponent({
  currentUser,
}: CreateEventComponentProps) {
  const canCreate = useCanCreateEvents(currentUser);
  const [formData, setFormData] = useState<CreateEventInput>({
    title: '',
    description: '',
    department: '',
    category: '',
    date: '',
    time: '',
    mode: 'Hybrid',
    maxCapacity: 100,
    registrationDeadline: '',
    certificateAvailable: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  if (!canCreate) {
    return <p>You do not have permission to create events</p>;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await EventService.createEvent(formData, currentUser);

    if (!result.success) {
      if (result.errors) {
        setErrors(result.errors);
      }
    } else {
      // Handle success
      console.log('Event created:', result.data);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Event Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      {errors.title && <p className="error">{errors.title}</p>}

      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
      {errors.description && <p className="error">{errors.description}</p>}

      <select
        value={formData.mode}
        onChange={(e) =>
          setFormData({ ...formData, mode: e.target.value as any })
        }
      >
        <option value="Online">Online</option>
        <option value="Offline">Offline</option>
        <option value="Hybrid">Hybrid</option>
      </select>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  );
}
```

### Approvals Component with Role Check

```tsx
'use client';

import { useEffect, useState } from 'react';
import { ApprovalService } from '@/services/approvalService';
import { useCanApproveEvent } from '@/lib/usePermissions';
import { User } from '@/types/api';

interface ApprovalsComponentProps {
  currentUser: User;
}

export default function ApprovalsComponent({
  currentUser,
}: ApprovalsComponentProps) {
  const canApprove = useCanApproveEvent(currentUser);
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (canApprove) {
      loadPendingEvents();
    }
  }, []);

  const loadPendingEvents = async () => {
    setIsLoading(true);
    const result = await ApprovalService.getPendingEvents(
      { page: 1, limit: 10 },
      currentUser
    );

    if (result.success) {
      setPendingEvents(result.data.events);
    }
    setIsLoading(false);
  };

  const handleApprove = async (eventId: string, feedback: string) => {
    const result = await ApprovalService.approveEvent(
      { eventId, feedback },
      currentUser
    );

    if (result.success) {
      loadPendingEvents();
    }
  };

  if (!canApprove) {
    return <p>You do not have permission to approve events</p>;
  }

  return (
    <div>
      <h2>Pending Approvals</h2>
      {pendingEvents.map((event) => (
        <div key={event.id} className="event-card">
          <h3>{event.title}</h3>
          <button
            onClick={() => handleApprove(event.id, 'Approved')}
            disabled={isLoading}
          >
            Approve
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 🔒 Role-Based Access Control Matrix

| Feature | Student | GroupAdmin | DeptAdmin | Admin |
|---------|---------|-----------|-----------|-------|
| View Events | ✅ | ✅ | ✅ | ✅ |
| Register Events | ✅ | ✅ | ✅ | ✅ |
| Create Events | ❌ | ✅ | ✅ | ✅ |
| Edit Own Events | ❌ | ✅ | ✅ | ✅ |
| Edit All Events | ❌ | ❌ | ✅ | ✅ |
| Delete Events | ❌ | ✅* | ✅ | ✅ |
| Approve Events | ❌ | ❌ | ✅ | ✅ |
| Reject Events | ❌ | ❌ | ✅ | ✅ |
| View Analytics | ❌ | ✅* | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ✅ | ✅ |

\* Own only

## ⚠️ Error Handling

All services return a consistent response format:

```typescript
interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>; // Validation errors
}
```

Usage:

```typescript
const result = await AuthService.login(credentials);

if (result.success) {
  // Handle success
  console.log(result.data);
} else {
  // Handle validation errors
  if (result.errors) {
    Object.entries(result.errors).forEach(([field, error]) => {
      console.error(`${field}: ${error}`);
    });
  } else {
    // Handle general error
    console.error(result.message);
  }
}
```

## 🎓 Best Practices

1. **Always validate input** before calling services
2. **Check permissions** before rendering sensitive UI
3. **Use typed inputs** from validators
4. **Handle errors** with user-friendly messages
5. **Filter data** on client-side after API calls
6. **Use hooks** for permission checks
7. **Never trust client-side permissions** - always verify on server
