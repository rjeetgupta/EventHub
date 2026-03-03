import { Request, Response } from "express";
import eventService from "../services/event.service";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";

// ============================================================================
// PUBLIC CONTROLLERS
// ============================================================================

/**
 * Get all events with filters
 * @route GET /api/v1/events
 * @access Public
 */
const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const result = await eventService.getEvents(
    req.query,
    req.user?.id,
    req.user?.role
  );

  res
    .status(200)
    .json(new ApiResponse(200, result, "Events fetched successfully"));
});

/**
 * Get event by ID
 * @route GET /api/v1/events/:id
 * @access Public
 */
const getEventById = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.getEventById(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, event, "Event fetched successfully"));
});

// ============================================================================
// EVENT MANAGEMENT CONTROLLERS (GROUP ADMIN / DEPT ADMIN)
// ============================================================================

/**
 * Create new event
 * @route POST /api/v1/events
 * @access Group Admin, Department Admin
 */
const createEvent = asyncHandler(async (req: Request, res: Response) => {
  console.log("Create Event data : ", req.body.data)
  const event = await eventService.createEvent(req.body, req.user!.id);

  res
    .status(201)
    .json(new ApiResponse(201, event, "Event created successfully"));
});

/**
 * Update event
 * @route PUT /api/v1/events/:id
 * @access Group Admin (own events), Department Admin
 */
const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.updateEvent(
    req.params.id,
    req.body,
    req.user!.id,
    req.user!.role
  );

  res
    .status(200)
    .json(new ApiResponse(200, event, "Event updated successfully"));
});

/**
 * Delete event
 * @route DELETE /api/v1/events/:id
 * @access Group Admin (own events), Department Admin
 */
const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  await eventService.deleteEvent(req.params.id, req.user!.id, req.user!.role);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Event deleted successfully"));
});

/**
 * Submit event for approval
 * @route POST /api/v1/events/:id/submit
 * @access Group Admin (creator only)
 */
const submitForApproval = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.submitForApproval(req.params.id, req.user!.id);

  res
    .status(200)
    .json(new ApiResponse(200, event, "Event submitted for approval successfully"));
});

// ============================================================================
// APPROVAL CONTROLLERS (DEPARTMENT ADMIN)
// ============================================================================

/**
 * Approve or reject event
 * @route POST /api/v1/events/:id/approval
 * @access Department Admin
 */
const handleApproval = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.handleApproval(
    req.params.id,
    req.body,
    req.user!.id
  );

  const action = req.body.action === "approve" ? "approved" : "rejected";
  res
    .status(200)
    .json(new ApiResponse(200, event, `Event ${action} successfully`));
});

/**
 * Publish approved event
 * @route POST /api/v1/events/:id/publish
 * @access Department Admin
 */
const publishEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.publishEvent(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, event, "Event published successfully"));
});

/**
 * Get department events
 * @route GET /api/v1/events/department/events
 * @access Department Admin, Group Admin
 */
const getDepartmentEvents = asyncHandler(async (req: Request, res: Response) => {
  const status = req.query.status as string | undefined;
  const events = await eventService.getDepartmentEvents(req.user!.id, status);

  res
    .status(200)
    .json(new ApiResponse(200, events, "Department events fetched successfully"));
});

// ============================================================================
// STUDENT REGISTRATION CONTROLLERS
// ============================================================================

/**
 * Register for event
 * @route POST /api/v1/events/:id/register
 * @access Student
 */
const registerForEvent = asyncHandler(async (req: Request, res: Response) => {
  const registration = await eventService.registerForEvent(
    req.params.id,
    req.user!.id
  );

  res
    .status(201)
    .json(new ApiResponse(201, registration, "Registered for event successfully"));
});

/**
 * Cancel registration
 * @route DELETE /api/v1/events/:id/register
 * @access Student
 */
const cancelRegistration = asyncHandler(async (req: Request, res: Response) => {
  await eventService.cancelRegistration(req.params.id, req.user!.id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Registration cancelled successfully"));
});

/**
 * Get my registered events
 * @route GET /api/v1/events/my-events
 * @access Student
 */
const getMyEvents = asyncHandler(async (req: Request, res: Response) => {
  const status = req.query.status as "upcoming" | "finished" | undefined;
  const result = await eventService.getMyEvents(req.user!.id, status);

  res
    .status(200)
    .json(new ApiResponse(200, result, "My events fetched successfully"));
});

// ============================================================================
// ATTENDANCE & REGISTRATION MANAGEMENT
// ============================================================================

/**
 * Mark attendance
 * @route POST /api/v1/events/:id/attendance
 * @access Group Admin (creator), Department Admin
 */
const markAttendance = asyncHandler(async (req: Request, res: Response) => {
  await eventService.markAttendance(req.params.id, req.body);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Attendance marked successfully"));
});

/**
 * Get event registrations
 * @route GET /api/v1/events/:id/registrations
 * @access Group Admin (creator), Department Admin
 */
const getEventRegistrations = asyncHandler(async (req: Request, res: Response) => {
  const registrations = await eventService.getEventRegistrations(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, registrations, "Registrations fetched successfully"));
});

/**
 * Download certificate
 * @route GET /api/v1/events/:id/certificate
 * @access Student (if attended)
 */
const downloadCertificate = asyncHandler(async (req: Request, res: Response) => {
  const certificate = await eventService.generateCertificate(
    req.params.id,
    req.user!.id
  );

  // Set headers for PDF download
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=certificate-${req.params.id}.pdf`
  );

  res.send(certificate);
});

/**
 * Close event registration
 * @route POST /api/v1/events/:id/close-registration
 * @access Group Admin (creator), Department Admin
 */
const closeRegistration = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.closeRegistration(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, event, "Event registration closed successfully"));
});

export {
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
  downloadCertificate,
  closeRegistration,
};