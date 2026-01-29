# Fullstack Developer Challenge - FX Replay

Follow the instructions carefully and provide your solutions in a clean, organized, and efficient manner. 
You are expected to share your screen and have this new project running locally. 
You can use any resource at your disposal.

### Context: What is a Trading Order?

A **trading order** is an instruction given by a trader to either **buy** or **sell** a financial asset under specific conditions. Orders can be categorized based on their execution type:

- **Market Orders**
- **Limit Orders**
- **Stop Orders**

These orders are commonly used in stock markets, cryptocurrency exchanges, and forex trading. 
The `trade_order` model represents these orders and their attributes in a database.

---

### **Part 1: Build a RESTful API**

Using **Node.js**, create a RESTful API to manage the `trade_order` resource. The API should follow the following specifications:

1. **Database Model Specifications**:
    - **Table Name**: `trade_order`
    - **Columns**:
        - `id`: A unique, string identifier (UUID).
        - `side`: A string, possible values are `"buy"` or `"sell"`, required.
        - `type`: A string, possible values are `"limit"`, `"market"`, `"stop"`, required.
        - `amount`: A decimal number, maximum of 2 decimal places, required.
        - `price`: A decimal number, maximum of 5 decimal places, required.
        - `status`: A string, possible values are `"open"`, `"cancelled"`, `"executed"`. Default value is `"open"`.
        - `pair`: A string representing the trading pair (e.g., `BTCUSD`), required.
        - `createdAt`: A timestamp representing when the order was created.
        - `updatedAt`: A timestamp representing when the order was last updated.
2. **Endpoints**:
    - `POST /trade_orders`: Create a new order.
    - `GET /trade_orders`: Retrieve a list of all orders.
3. **Local Setup**:
    - You can choose your preferred stack to build the solution. We do have a slight preference for Express or NestJs (or anything with node).
4. **Requirements**:
    - Ensure proper error handling and status codes (e.g., `400` for bad requests, `404` for not found, `500` for server errors).
    - Write modular and clean code by organizing the project into routes, controllers, and database models.
  
---

### **Part 2: Implement Frontend**

1. Required pages:
    - /trades: On load, make a GET request to /trade_orders and display current trades
    - /trades/new: Prompt for the trade parameters and make a POST request to the /trade_orders
2. **Local Setup**:
    - You can choose your preferred stack to build the solution. We do have a slight preference for Angular (or any JS framework).
3. Requirements:
    - Use any style library (PrimeNG, Bootstrap, Material). Focus on functionality though, UI design choices are secondary.
  
---

### **Part 3: Implement Validations for Order Price**

Suppose the current prices for the trading pairs are as follows:

- **BTCUSD**: `100150.4`
- **EURUSD**: `1.035`
- **ETHUSD**: `3310`
1. **Limit Orders**:
    - If the order is a **buy** limit order, the price must be **lower than the current market price** of the pair.
    - If the order is a **sell** limit order, the price must be **higher than the current market price** of the pair.
2. **Market Orders**:
    - No price validation is needed, as market orders are executed at the current market price.
3. **Stop Orders**:
    - If the order is a **buy** stop order, the price must be **higher than the current market price** of the pair.
    - If the order is a **sell** stop order, the price must be **lower than the current market price** of the pair.
4. **Additional Validations**:
    - Ensure the `amount` is greater than `0`.
    - Validate that the `pair` exists in the current market prices (`BTCUSD`, `EURUSD`, `ETHUSD`).
    - Reject orders with an invalid `type` or `side`.

---

### Part 4: Additional bonus tasks

1. Implement unit tests in the most useful places.
2. Implement the following endpoints:
    - `GET /trade_orders/:id`: Retrieve a single order by its `id`.
    - `PUT /trade_orders/:id`: Update an existing order.
    - `DELETE /trade_orders/:id`: Delete an order.
3. Implement the UI for the new endpoints as you see fit.
4. Other tasks:
    - Add pagination to the `GET /trade_orders` endpoint.
    - Implement soft delete to the `DELETE /trade_orders/:id` endpoint.
    - Implement Swagger for API documentation.
  
---

### **Evaluation Criteria**

- Adherence to requirements and instructions.
- Code quality and organization.
- Correct implementation of validations.
- Efficient handling of database operations.
- Error handling and API responses.
