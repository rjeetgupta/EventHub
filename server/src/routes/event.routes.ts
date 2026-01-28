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
} from "../validators/event.validator";
import { isAllowedToDo } from "../middlewares/isAllowed.middleware";
import { UserRole } from "../types/common.types";

const router = Router();


router.route("/").get(validate(eventFiltersSchema), getEvents);
router.route("/:id").get(validate(eventIdSchema), getEventById);
router
  .route("/my-events")
  .get(verifyJWT, isAllowedToDo(UserRole.STUDENT), getMyEvents);

router
  .route("/:id/register")
  .post(
    verifyJWT,
    isAllowedToDo(UserRole.STUDENT),
    validate(eventIdSchema),
    registerForEvent
  );

router
  .route("/:id/register")
  .delete(
    verifyJWT,
    isAllowedToDo(UserRole.STUDENT),
    validate(eventIdSchema),
    cancelRegistration
  );

router
  .route("/:id/certificate")
  .get(
    verifyJWT,
    isAllowedToDo(UserRole.STUDENT),
    validate(eventIdSchema),
    downloadCertificate
  );

// GROUP ADMIN & DEPARTMENT ADMIN ROUTES

// Create event
router
  .route("/")
  .post(
    verifyJWT,
    isAllowedToDo(UserRole.GROUP_ADMIN, UserRole.DEPARTMENT_ADMIN),
    validate(createEventSchema),
    createEvent
  );

// Update event
router
  .route("/:id")
  .put(
    verifyJWT,
    isAllowedToDo(UserRole.GROUP_ADMIN, UserRole.DEPARTMENT_ADMIN),
    validate(updateEventSchema),
    updateEvent
  );

// Delete event
router
  .route("/:id")
  .delete(
    verifyJWT,
    isAllowedToDo(UserRole.GROUP_ADMIN, UserRole.DEPARTMENT_ADMIN),
    validate(eventIdSchema),
    deleteEvent
  );

// Submit event for approval
router
  .route("/:id/submit")
  .post(
    verifyJWT,
    isAllowedToDo(UserRole.GROUP_ADMIN),
    validate(eventIdSchema),
    submitForApproval
  );

// Get department events
router
  .route("/department/events")
  .get(
    verifyJWT,
    isAllowedToDo(UserRole.GROUP_ADMIN, UserRole.DEPARTMENT_ADMIN),
    getDepartmentEvents
  );

// Get event registrations
router
  .route("/:id/registrations")
  .get(
    verifyJWT,
    isAllowedToDo(UserRole.GROUP_ADMIN, UserRole.DEPARTMENT_ADMIN),
    validate(eventIdSchema),
    getEventRegistrations
  );

// Mark attendance
router
  .route("/:id/attendance")
  .post(
    verifyJWT,
    isAllowedToDo(UserRole.GROUP_ADMIN, UserRole.DEPARTMENT_ADMIN),
    validate(markAttendanceSchema),
    markAttendance
  );

// Close registration
router
  .route("/:id/close-registration")
  .post(
    verifyJWT,
    isAllowedToDo(UserRole.GROUP_ADMIN, UserRole.DEPARTMENT_ADMIN),
    validate(eventIdSchema),
    closeRegistration
  );

// DEPARTMENT ADMIN ONLY ROUTES

// Approve or reject event
router
  .route("/:id/approval")
  .post(
    verifyJWT,
    isAllowedToDo(UserRole.DEPARTMENT_ADMIN),
    validate(approvalSchema),
    handleApproval
  );

// Publish event
router
  .route("/:id/publish")
  .post(
    verifyJWT,
    isAllowedToDo(UserRole.DEPARTMENT_ADMIN),
    validate(eventIdSchema),
    publishEvent
  );

export default router;