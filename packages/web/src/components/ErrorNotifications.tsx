// "use client";

// import React from "react";
// import { useError } from "contexts/ErrorContext";
// import styles from "./ErrorNotifications.module.scss";

// export function ErrorNotifications() {
//   const { errors, removeError, clearAllErrors } = useError();

//   if (errors.length === 0) return null;

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <h3 className={styles.title}>{errors.length === 1 ? "Error" : `${errors.length} Errors`}</h3>
//         {errors.length > 1 && (
//           <button type="button" onClick={clearAllErrors} className={styles.clearAll}>
//             Clear All
//           </button>
//         )}
//       </div>

//       <div className={styles.errorList}>
//         {errors.map((error) => (
//           <div key={error.id} className={`${styles.errorItem} ${styles[error.type]}`}>
//             <div className={styles.errorContent}>
//               <div className={styles.errorHeader}>
//                 <div className={styles.errorIcon}>
//                   {error.type === "error" && "⚠️"}
//                   {error.type === "warning" && "⚠️"}
//                   {error.type === "info" && "ℹ️"}
//                 </div>
//                 <div className={styles.errorMessage}>{error.message}</div>
//                 <button
//                   type="button"
//                   onClick={() => removeError(error.id)}
//                   className={styles.closeButton}
//                   aria-label="Close error"
//                 >
//                   ×
//                 </button>
//               </div>

//               {error.statusCode && <div className={styles.statusCode}>HTTP {error.statusCode}</div>}

//               {error.details && <div className={styles.errorDetails}>{error.details}</div>}

//               <div className={styles.timestamp}>{error.timestamp.toLocaleTimeString()}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
