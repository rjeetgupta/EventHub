import { Router } from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  submitForApproval,
  handleApproval,
  publishEvent,
  getDepartmentEvents,
  registerForEvent,
  cancelRegistration,
  getMyEvents,
  markAttendance,
  getEventRegistrations,
  closeRegistration,
  downloadCertificate,
} from "../controllers/event.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createEventSchema,
  updateEventSchema,
  approvalSchema,
  markAttendanceSchema,
  eventIdSchema,
  eventFiltersSchema,
  departmentEventsQuerySchema,
  myEventsQuerySchema,
} from "../validators/event.validator";
import { isAllowedToDo } from "../middlewares/isAllowed.middleware";
import { UserRole } from "../types/common.types";

const router = Router();

// ============================================================================
// SPECIFIC ROUTES (must come BEFORE /:id to avoid being caught by param)
// ============================================================================

router.get(
  "/my-events",
  verifyJWT,
  isAllowedToDo(UserRole.STUDENT),
  validate(myEventsQuerySchema),
  getMyEvents
);

router.get(
  "/department",
  verifyJWT,
  isAllowedToDo(UserRole.GROUP_ADMIN, UserRole.DEPARTMENT_ADMIN),
  validate(departmentEventsQuerySchema),
  getDepartmentEvents
);

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

router.get("/", validate(eventFiltersSchema), getEvents);
router.get("/:id", validate(eventIdSchema), getEventById);

// ============================================================================
// EVENT MANAGEMENT (GROUP ADMIN / DEPARTMENT ADMIN)
// ============================================================================

router.post(
  "/",
  verifyJWT,
  isAllowedToDo(UserRole.GROUP_ADMIN, UserRole.DEPARTMENT_ADMIN),
  validate(createEventSchema),
  createEvent
);

router.put(
  "/:id",
  verifyJWT,
  isAllowedToDo(UserRole.GROUP_ADMIN, UserRole.DEPARTMENT_ADMIN),
  validate(updateEventSchema),
  updateEvent
);

router.delete(
  "/:id",
  verifyJWT,
  isAllowedToDo(UserRole.GROUP_ADMIN, UserRole.DEPARTMENT_ADMIN),
  validate(eventIdSchema),
  deleteEvent
);

// ============================================================================
// EVENT WORKFLOW
// ============================================================================

router.post(
  "/:id/submit",
  verifyJWT,
  isAllowedToDo(UserRole.GROUP_ADMIN),
  validate(eventIdSchema),
  submitForApproval
);

router.post(
  "/:id/approval",
  verifyJWT,
  isAllowedToDo(UserRole.DEPARTMENT_ADMIN),
  validate(approvalSchema),
  handleApproval
);

router.post(
  "/:id/publish",
  verifyJWT,
  isAllowedToDo(UserRole.DEPARTMENT_ADMIN),
  validate(eventIdSchema),
  publishEvent
);

// ============================================================================
// STUDENT REGISTRATION
// ============================================================================

router.post(
  "/:id/register",
  verifyJWT,
  isAllowedToDo(UserRole.STUDENT),
  validate(eventIdSchema),
  registerForEvent
);

router.delete(
  "/:id/register",
  verifyJWT,
  isAllowedToDo(UserRole.STUDENT),
  validate(eventIdSchema),
  cancelRegistration
);

router.get(
  "/:id/certificate",
  verifyJWT,
  isAllowedToDo(UserRole.STUDENT),
  validate(eventIdSchema),
  downloadCertificate
);

// ============================================================================
// ATTENDANCE & REGISTRATION MANAGEMENT
// ============================================================================

router.get(
  "/:id/registrations",
  verifyJWT,
  isAllowedToDo(UserRole.GROUP_ADMIN, UserRole.DEPARTMENT_ADMIN),
  validate(eventIdSchema),
  getEventRegistrations
);

router.post(
  "/:id/attendance",
  verifyJWT,
  isAllowedToDo(UserRole.GROUP_ADMIN, UserRole.DEPARTMENT_ADMIN),
  validate(markAttendanceSchema),
  markAttendance
);

router.post(
  "/:id/close-registration",
  verifyJWT,
  isAllowedToDo(UserRole.GROUP_ADMIN, UserRole.DEPARTMENT_ADMIN),
  validate(eventIdSchema),
  closeRegistration
);

export default router;