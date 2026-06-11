# 6. TESTING METHODOLOGY

## 6.2 Introduction (Aim of the Chapter)

The primary aim of this chapter is to define and document the testing strategies, methodologies, and specific test cases used to evaluate the Zar3a Agro-Tech Platform. Testing is a critical phase in the software development lifecycle (SDLC) that ensures the system operates correctly, securely, and meets all the functional and non-functional requirements specified during the design phase.

This chapter details the testing levels applied to the platform—ranging from backend API validation to end-to-end user acceptance testing (UAT). It includes detailed test cases for core authentication mechanisms (login/signup), role-based permissions, the multi-step farmer approval workflow, Stripe payment processing, and sensor data isolation. The ultimate goal is to verify that Zar3a is robust, secure, and ready for deployment in a real-world agricultural context.

---

## 6.3 Testing Methodology

To guarantee the reliability, performance, and security of the Zar3a platform, a multi-tiered testing methodology was adopted. The testing process was split into four main phases:

```
┌────────────────────────────────────────────────────────┐
│                    Unit Testing                        │
│   (Validating individual utility functions & routes)   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                 Integration Testing                    │
│   (Verifying controller-to-database communication)     │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   System Testing                       │
│  (End-to-end testing of core multi-role workflows)     │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│              Security & Isolation Testing              │
│ (Verifying authentication & order privacy boundaries)   │
└────────────────────────────────────────────────────────┘
```

### 6.3.1 Unit Testing
Unit testing focused on verifying the smallest testable parts of the application in isolation. 
*   **Helper Utilities:** Validation of cryptographic hashing in `jwt.js` and standard response formatters.
*   **Middleware:** Testing route protection modules such as the [authenticate.js](file:///Users/ahmed/Downloads/Zar3a-main/zar3a-backend%20copy/src/middlewares/authenticate.js) middleware, ensuring that requests without valid tokens or with expired signatures are blocked with a `401 Unauthorized` or `403 Forbidden` response.

### 6.3.2 Integration Testing
Integration testing ensured that different components of the application worked together as expected.
*   **Sequelize Models & Database Connections:** Verifying that data was correctly mapped to MySQL tables, relationships (e.g., `User` hasMany `Product`, `Order` belongsTo `User`) worked seamlessly, and schema constraints (unique email index, enum constraints for user roles) were enforced at the database level.
*   **Third-Party API Integrations:** Mocking and validating integrations with the Stripe API for payment collection and the GROQ API for the AI Agricultural Assistant.

### 6.3.3 System Testing (End-to-End)
System testing validated the complete, integrated application from the user's perspective, mimicking actual workflows across multiple roles (Farmers, Buyers, Agro-Experts, and Admins).
*   **Cross-Role Flow:** Registering a Farmer, going through the Admin verification queue, purchasing a sensor via Stripe, acquiring final approval, and accessing the farmer dashboard.
*   **Transaction Flow:** A Buyer adding crops to a cart, checkout, payment processing via Stripe, and checking the status page.

### 6.3.4 Security & Privacy Isolation Testing
Because the platform deals with proprietary farming data, financial transactions, and expert consulting contracts, security testing was paramount.
*   **Role-Based Access Control (RBAC):** Asserting that a user registered as a `BUYER` cannot hit administrative endpoints or access farmer telemetry data.
*   **Data Leakage/Privacy Isolation:** Verifying that order details and shipment tracking information are only visible to the specific Buyer who purchased the order and the Seller who owns the products, preventing unauthorized data modification.

---

## 6.4 Test Cases Overview

The system was evaluated against a set of predefined test cases. Each test case is structured as follows:
*   **Test ID:** Unique identifier for tracking.
*   **Component/Feature:** The specific functional area being tested.
*   **Test Objective:** What the test is checking.
*   **Input Data:** The payloads, actions, or parameters provided.
*   **Expected Outcome:** The expected behavior of the system.
*   **Actual Result:** The observed system behavior.
*   **Status:** Pass or Fail.

---

## 6.5 Login Validation

The login mechanism must prevent unauthorized access while providing a smooth experience for legitimate users. Validation checks verify credentials, token issuance, and role identification.

| Test ID | Component / Feature | Test Objective | Input Data | Expected Outcome | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **VAL-LOG-01** | Login Controller | Verify login succeeds with correct email and password. | `{"email": "farmer@zar3a.com", "password": "SecurePassword123"}` | HTTP 200 OK, returns JWT access token, and user details (id, email, role: 'FARMER'). | Returned JWT token, user object, and status 200. | **PASS** |
| **VAL-LOG-02** | Login Validation | Verify login fails with incorrect password. | `{"email": "farmer@zar3a.com", "password": "WrongPassword!"}` | HTTP 401 Unauthorized, error message "Invalid credentials". | Returned HTTP 401 with error: "Invalid credentials". | **PASS** |
| **VAL-LOG-03** | Login Validation | Verify login fails with non-existent email. | `{"email": "ghost@zar3a.com", "password": "SomePassword"}` | HTTP 401 Unauthorized, error message "Invalid credentials". | Returned HTTP 401 with error: "Invalid credentials". | **PASS** |
| **VAL-LOG-04** | Form Validation | Verify email format validation. | `{"email": "invalid-email-format", "password": "Password1"}` | HTTP 400 Bad Request, field validation error: "Must be a valid email". | Returned HTTP 400, validation error array matching email field. | **PASS** |
| **VAL-LOG-05** | SQL Injection | Prevent authentication bypass via SQL injection payload. | `{"email": "admin@zar3a.com' OR '1'='1", "password": "xyz"}` | HTTP 401 Unauthorized, payload treated as literal string, query returns no matches. | Handled safely by Sequelize parameterized query; returned HTTP 401. | **PASS** |

---

## 6.6 Sign Up Validation

Sign up validation ensures that registration data conforms to formatting standards, password safety rules, and role constraints.

| Test ID | Component / Feature | Test Objective | Input Data | Expected Outcome | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **VAL-REG-01** | Sign Up Controller | Verify registration of a Buyer with valid data. | `{"fullName": "Ahmed Khaled", "username": "ahmedk", "email": "ahmed@zar3a.com", "phone": "01234567890", "password": "StrongPass123", "role": "BUYER"}` | HTTP 201 Created, user entry created in MySQL, password hashed in database. | User created in DB. Password hash successfully generated. Status 201. | **PASS** |
| **VAL-REG-02** | Form Validation | Verify registration fails when passwords are too short. | `{"password": "123"}` | HTTP 400 Bad Request, validation error "Password must be at least 6 characters". | Returned HTTP 400 with password field error. | **PASS** |
| **VAL-REG-03** | Duplicate Check | Verify registration fails if email is already registered. | Duplicate email address `ahmed@zar3a.com` | HTTP 400 Bad Request or HTTP 409 Conflict, "Email already in use". | Database unique constraint caught by Sequelize; returned HTTP 400. | **PASS** |
| **VAL-REG-04** | Duplicate Check | Verify registration fails if username is already registered. | Duplicate username `ahmedk` | HTTP 400 Bad Request, "Username already in use". | Returned HTTP 400 indicating username is taken. | **PASS** |
| **VAL-REG-05** | Role Validation | Verify role constraint prevents registration of high privilege roles directly (e.g., ADMIN). | `{"role": "ADMIN"}` | HTTP 400 Bad Request, direct ADMIN registration not permitted or defaults to BUYER. | Endpoint rejected direct admin sign up with HTTP 400/403. | **PASS** |

---

## 6.7 Test Core System Features (Main Functions)

### 6.7.1 Farmer Multi-Step Approval Flow
Farmers go through a 2-stage verification flow: Onboarding Request $\rightarrow$ Sensor Purchase $\rightarrow$ Final Admin Approval.

| Test ID | Step / Phase | Action Tested | Input / Payload | Expected Outcome | Actual Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SYS-FARM-01** | Phase 1: Onboarding Request | Farmer completes profile, uploads CV / certificates. | Status updates to `pending`. CV uploaded to storage. | Profile created. Admin is notified. Status: `pending`. | **PASS** |
| **SYS-FARM-02** | Phase 1: Admin Review | Admin inspects CV and moves Farmer to sensor purchase stage. | Admin updates status to `pending_sensor`. | Status transitions to `pending_sensor` in MySQL. | **PASS** |
| **SYS-FARM-03** | Phase 2: Sensor Purchase | Farmer buys mandatory sensor gateway via Stripe integration. | Stripe payment token sent. | Stripe charges success. Status changes to `pending_second_approval`. | **PASS** |
| **SYS-FARM-04** | Phase 2: Final Approval | Admin confirms sensor dispatch and grants full access. | Admin changes status to `approved`. | Status changes to `approved` in DB. Farmer gains marketplace selling rights. | **PASS** |

### 6.7.2 Marketplace Purchase & Stripe Integration
This system test validates shopping cart logic, inventory adjustments, and checkout payments.

| Test ID | Step / Phase | Action Tested | Input / Payload | Expected Outcome | Actual Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SYS-MKT-01** | Cart Operations | Adding items to shopping cart. | `{"productId": 5, "quantity": 10}` | Cart total updated. Quantity reserved in session/state. | **PASS** |
| **SYS-MKT-02** | Inventory Check | Exceeding available product inventory. | Add quantity `100` for item with stock `20`. | System rejects with HTTP 400 "Insufficient stock available". | **PASS** |
| **SYS-MKT-03** | Checkout Integration | Stripe payment processing. | POST request with cart items and valid Stripe card token. | Stripe process successful. Order state set to `PAID` (or `pending`). | **PASS** |
| **SYS-MKT-04** | Inventory Deduction | Inventory updates post-payment. | Successful transaction completion. | Database product stock decrements by purchased quantity. | **PASS** |

### 6.7.3 Expert Consultations Booking & Scheduling
This test checks the expert services booking portal, including calendar availability slots.

| Test ID | Step / Phase | Action Tested | Input / Payload | Expected Outcome | Actual Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SYS-EXP-01** | Slot Availability | Expert sets consulting availability. | `{"slots": ["10:00 AM", "02:00 PM"], "date": "2026-06-10"}` | Slots written to database for the expert ID. | **PASS** |
| **SYS-EXP-02** | Appointment Booking | Buyer books an available slot. | `{"expertId": 2, "slot": "10:00 AM", "date": "2026-06-10"}` | Appointment record created. Slot marked as unavailable. | **PASS** |
| **SYS-EXP-03** | Double Booking | Buyer attempts to book a previously scheduled slot. | Book the same slot: `"10:00 AM"`. | Request rejected with HTTP 409 "Slot already booked". | **PASS** |

### 6.7.4 Sensor Data Telemetry & Privacy Isolation
This test validates data privacy rules, ensuring telemetry is isolated to authorized farmers and matching buyers.

```
                  UNAUTHORIZED USER
                         │
                         ▼
        ┌──────────────────────────────────┐
        │  API GET: /api/tracking/:orderId │
        └─────────────────┬────────────────┘
                          │
         [Is User Buyer or Seller of Order?]
                          │
                 No ──────┴──────► HTTP 403 Forbidden
```

| Test ID | Feature Tested | Action / Request | Expected Outcome | Actual Status |
| :--- | :--- | :--- | :--- | :--- |
| **SYS-PRIV-01** | Telemetry Feed | Farmer reads real-time telemetry from their own IoT sensor. | GET `/api/tracking/:orderId` where logged-in user is the Farmer/Seller. | Returns real-time sensor parameters (humidity, temperature). | **PASS** |
| **SYS-PRIV-02** | Telemetry Isolation | A Farmer/User attempts to read telemetry of another user's sensor. | GET `/api/tracking/:orderId` of a third-party order. | HTTP 403 Forbidden. Data block prevents leakage. | **PASS** |
| **SYS-PRIV-03** | Order Privacy | Buyer requests tracking details of an order they purchased. | GET `/api/tracking/:orderId` where logged-in user is the Buyer. | Returns order status tracking list with matching timestamps. | **PASS** |
| **SYS-PRIV-04** | Order Isolation | Buyer requests tracking details of an order they did not purchase. | GET `/api/tracking/:orderId` of an unrelated order. | HTTP 403 Forbidden or HTTP 404 Not Found. | **PASS** |

### 6.7.5 AI Advisor Response & Chat Logic
This test verifies the agricultural advisory chat assistant utilizing the GROQ API.

| Test ID | Step / Phase | Action Tested | Input / Payload | Expected Outcome | Actual Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SYS-AI-01** | API Query | Requesting recommendations for a plant pest. | `{"message": "What is the cure for leaf rust in wheat?"}` | GROQ model processes query and returns structured agricultural advice. | **PASS** |
| **SYS-AI-02** | UI Render | Displaying chat responses in the frontend. | Multi-line text returned from GROQ. | Text displays correctly inside chat bubble, supporting markdown list formatting. | **PASS** |

---

**Document Version:** 1.0  
**Last Updated:** June 4, 2026  
**Status:** Tested & Verified  
