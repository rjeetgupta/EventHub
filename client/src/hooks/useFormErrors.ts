// 'use client';

// import { useState, useCallback } from 'react';
// import { ZodError } from 'zod';

// interface ErrorState {
//   fieldErrors: Record<string, string>;
//   generalError: string | null;
// }

// /**
//  * Hook to handle form errors efficiently
//  * Manages both validation errors and general API errors
//  */
// export function useFormErrors() {
//   const [errors, setErrors] = useState<ErrorState>({
//     fieldErrors: {},
//     generalError: null,
//   });

//   const setFieldError = useCallback((field: string, message: string) => {
//     setErrors((prev) => ({
//       ...prev,
//       fieldErrors: {
//         ...prev.fieldErrors,
//         [field]: message,
//       },
//     }));
//   }, []);

//   const clearFieldError = useCallback((field: string) => {
//     setErrors((prev) => ({
//       ...prev,
//       fieldErrors: {
//         ...prev.fieldErrors,
//         [field]: undefined,
//       },
//     }));
//   }, []);

//   const setGeneralError = useCallback((message: string | null) => {
//     setErrors((prev) => ({
//       ...prev,
//       generalError: message,
//     }));
//   }, []);

//   const clearAllErrors = useCallback(() => {
//     setErrors({
//       fieldErrors: {},
//       generalError: null,
//     });
//   }, []);

//   const handleZodError = useCallback((error: ZodError) => {
//     clearAllErrors();
//     error.errors.forEach((err) => {
//       const path = err.path[0] as string;
//       setFieldError(path, err.message);
//     });
//   }, [clearAllErrors, setFieldError]);

//   const handleServiceError = useCallback(
//     (result: any) => {
//       if (result.errors) {
//         clearAllErrors();
//         Object.entries(result.errors).forEach(([field, message]: any) => {
//           setFieldError(field, message);
//         });
//       } else if (result.message) {
//         setGeneralError(result.message);
//       }
//     },
//     [clearAllErrors, setFieldError, setGeneralError]
//   );

//   return {
//     errors,
//     setFieldError,
//     clearFieldError,
//     setGeneralError,
//     clearAllErrors,
//     handleZodError,
//     handleServiceError,
//     hasErrors: Object.keys(errors.fieldErrors).length > 0 || !!errors.generalError,
//   };
// }
