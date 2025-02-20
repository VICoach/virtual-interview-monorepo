# Virtual Interviewer API Documentation

Virtual Interviewer is an API-driven application that leverages satellite and solar observation data to generate detailed, insightful reports on various topics. It provides a real-time conversational interface powered by advanced language models, which can be extended with external tools and knowledge bases. This documentation will help developers integrate Virtual Interviewer into their projects seamlessly.

---

## 1. Overview of the App

**Purpose:**  
Virtual Interviewer is designed to deliver automated, in-depth reports by interacting with a conversational agent. The agent uses a combination of language models and external tools to process queries and return actionable insights based on satellite and solar observation data.

**Key Features:**
- **Real-Time Chat:**  
  Use a WebSocket-based endpoint for interactive communication with the agent.
- **Customizable Agent:**  
  Configure the agent using JSON-based requests that define the system prompt, model, tools, and more.
- **Tool Integration:**  
  Enable the agent to call external APIs or services through a structured tools configuration.
- **Flexible Response Handling:**  
  Stream responses back to the client, handling both synchronous and asynchronous scenarios.

**Integration:**  
Developers can integrate Virtual Interviewer into web or mobile applications by establishing a WebSocket connection, sending a configuration message, and exchanging chat messages. The API is built with FastAPI, ensuring high performance and ease of deployment.

---

## 2. API Documentation

### **Introduction**

The Virtual Interviewer API is designed for real-time conversational interactions. It offers two primary endpoints:
- **GET `/` Endpoint:** Returns a plain text ASCII art welcome message.
- **WebSocket `/chat` Endpoint:** Manages a live chat session where clients can configure an agent and exchange messages.

### **Authentication**

- **Current Status:**  
  No authentication is enforced by default.  
- **Future Considerations:**  
  Developers can implement authentication (e.g., API keys or OAuth) as needed.

---

### **Available Endpoints**

#### **1. Root Endpoint**

- **Method:** GET  
- **URL:** `/`  
- **Description:** Returns an ASCII art welcome message as plain text.
```bash 


 ██▒   █▓ ██▓    ▄████▄   ▒█████   ▄▄▄       ▄████▄   ██░ ██ 
▓██░   █▒▓██▒   ▒██▀ ▀█  ▒██▒  ██▒▒████▄    ▒██▀ ▀█  ▓██░ ██▒
 ▓██  █▒░▒██▒   ▒▓█    ▄ ▒██░  ██▒▒██  ▀█▄  ▒▓█    ▄ ▒██▀▀██░
  ▒██ █░░░██░   ▒▓▓▄ ▄██▒▒██   ██░░██▄▄▄▄██ ▒▓▓▄ ▄██▒░▓█ ░██ 
   ▒▀█░  ░██░   ▒ ▓███▀ ░░ ████▓▒░ ▓█   ▓██▒▒ ▓███▀ ░░▓█▒░██▓
   ░ ▐░  ░▓     ░ ░▒ ▒  ░░ ▒░▒░▒░  ▒▒   ▓▒█░░ ░▒ ▒  ░ ▒ ░░▒░▒
   ░ ░░   ▒ ░     ░  ▒     ░ ▒ ▒░   ▒   ▒▒ ░  ░  ▒    ▒ ░▒░ ░
     ░░   ▒ ░   ░        ░ ░ ░ ▒    ░   ▒   ░         ░  ░░ ░
      ░   ░     ░ ░          ░ ░        ░  ░░ ░       ░  ░  ░
     ░          ░                           ░                

                                                           
```

---

#### **2. WebSocket Chat Endpoint**

- **Method:** WebSocket  
- **URL:** `/chat`  
- **Description:**  
  Establishes a WebSocket connection for real-time conversation with the agent. The client first sends a configuration message to set up the agent and then exchanges chat messages.

---

### **Request & Response Structures**

#### **Configuration Message (Agent Setup)**

This JSON message initializes the agent. It conforms to the `CreateAgentRequest` schema:

| Field                   | Type                       | Description                                                                                     | Example                                                 | Default    |
|-------------------------|----------------------------|-------------------------------------------------------------------------------------------------|---------------------------------------------------------|------------|
| **system_prompt**       | `string`                   | The prompt defining the agent’s role and behavior.                                             | `"You are an expert in solar data analysis."`           | N/A        |
| **model**               | `string`                   | Specifies the language model to use (e.g., `"gpt-4"`).                                          | `"gpt-4"`                                               | N/A        |
| **tools**               | `List[Tool]` *(optional)*  | A list of external tools the agent can use for additional data processing.                       | See Tool Configuration section below.                   | `[]`       |
| **knowledge_base_content** | `string` *(optional)*  | Additional context or reference data to aid in generating responses.                             | `"Satellite imagery and sensor data details."`          | `None`     |
| **language**            | `string`                   | The language for the conversation.                                                             | `"English"`                                             | `"English"`|

**Example Configuration Request:**

```json
{
  "system_prompt": "You are an expert in solar and satellite data analysis. Provide concise and accurate reports.",
  "model": "gpt-4",
  "tools": [],
  "knowledge_base_content": "Recent satellite observations indicate increased solar activity.",
  "language": "English"
}
```

**Successful Response:**

```json
{"status": "Agent created successfully"}
```

---

#### **Chat Message Exchange**

Once the agent is configured, the client sends chat messages, and the agent responds in chunks until a defined end-of-stream marker is reached.

**Chat Message Request Example:**

```json
{
  "message": "What is the current solar activity level?"
}
```

**Chat Message Response Example (Chunked):**

```json
{"role": "user", "content": "What is the current solar activity level?"}
```

*Response Chunks (each chunk is sent separately via WebSocket):*

```json
{"role": "agent", "content": "Current solar activity is moderate, with some fluctuations observed."}
```

**End-of-Response Marker:**

```json
"__end_of_stream__"
```

---

#### **Error Handling**

Error responses are sent in JSON format with an `error` field. These errors might occur during agent setup, message processing, or due to WebSocket disconnects.

**Error Response Example:**

```json
{"error": "Invalid request format: missing 'system_prompt'"}
```

---

### **Tool Configuration (Optional)**

Tools enable the agent to interact with external APIs. Each tool is defined as follows:

| Attribute         | Type                                       | Description                                                                                             | Example                                                    |
|-------------------|--------------------------------------------|---------------------------------------------------------------------------------------------------------|------------------------------------------------------------|
| **_id**          | `object` (e.g., `{ "$oid": "string" }`)     | Unique identifier for the tool.                                                                         | `{"$oid": "6726aa2d53d7b761be18bb61"}`                      |
| **name**          | `string`                                   | The tool's name, automatically converted to snake_case.                                               | `"geocoding_nominatim"`                                    |
| **description**   | `string`                                   | A brief description of what the tool does.                                                              | `"Retrieves geographic coordinates for a given location."` |
| **method**        | `string`                                   | HTTP method to be used (e.g., `"GET"`, `"POST"`).                                                       | `"GET"`                                                    |
| **endpoint_url**  | `string`                                   | URL for the external API endpoint.                                                                     | `"https://nominatim.openstreetmap.org/search"`             |
| **input**         | `List[InputField]` *(optional)*            | List of input fields required by the tool.                                                              | `[]`                                                       |
| **header**        | `List[Header]` *(optional)*                | List of HTTP headers.                                                                                   | `[{"key": "Content-Type", "value": "application/json"}]`   |
| **queryParams**   | `List[QueryParam]` *(optional)*            | List of query parameters for the tool.                                                                  | `[{"name": "q", "description": "search query", "example": "London,UK"}]` |
| **authentication**| `Authentication` *(optional)*              | Authentication settings for the tool.                                                                   | `{"checked": false, "location": "", "key": "", "value": ""}` |
| **timeout**       | `int`                                      | Request timeout in seconds.                                                                             | `10`                                                       |
| **execution_type**| `string` (`"synchronous"` or `"asynchronous"`) | Indicates if the tool call is synchronous or asynchronous.                                              | `"synchronous"`                                            |

---

## 3. JSON-Based Examples

### **Agent Configuration**

**Valid Request:**

```json
{
  "system_prompt": "You are an expert in solar and satellite data analysis. Provide concise and accurate reports.",
  "model": "gpt-4",
  "tools": [
    {
      "_id": {"$oid": "6726aa2d53d7b761be18bb61"},
      "name": "geocoding_nominatim",
      "description": "Retrieves geographic coordinates for a given location.",
      "method": "GET",
      "endpoint_url": "https://nominatim.openstreetmap.org/search",
      "input": [],
      "header": [
        {"key": "User-Agent", "value": "Virtual Interviewer/1.0"}
      ],
      "queryParams": [
        {"name": "q", "description": "search query", "example": "New York, USA"}
      ],
      "authentication": {"checked": false, "location": "", "key": "", "value": ""},
      "timeout": 10,
      "execution_type": "synchronous"
    }
  ],
  "knowledge_base_content": "Latest satellite observations and solar metrics.",
  "language": "English"
}
```

**Expected Successful Response:**

```json
{"status": "Agent created successfully"}
```

---

### **Chat Message Interaction**

**Valid Chat Message:**

```json
{"message": "What are the current solar activity levels?"}
```

**Expected Agent Response (Streamed in Chunks):**

- **Chunk 1:**

  ```json
  "Current solar activity is"
  ```

- **Chunk 2:**

  ```json
  "moderate."
  ```

- **End Marker:**

  ```json
  "__end_of_stream__"
  ```

---

### **Error Case**

**Invalid Request Example (Missing `system_prompt`):**

```json
{
  "model": "gpt-4",
  "tools": [],
  "language": "English"
}
```

**Error Response:**

```json
{"error": "Invalid request format: missing 'system_prompt'"}
```

---

## 4. Best Practices & Usage Guidelines

### **Efficient API Usage**

- **Establish a Stable WebSocket Connection:**  
  Ensure that the WebSocket connection is maintained during the chat session. Reconnect if the connection is lost.

- **Single Agent Setup:**  
  Send a configuration message only once at the start of the session. Subsequent messages should contain only the chat content.

- **Stream Responses Properly:**  
  Process each chunk of the agent's response until you detect the end-of-stream marker (`"__end_of_stream__"`).

### **Rate Limits & Throttling**

- **Rate Limits:**  
  While no strict rate limits are enforced, it is recommended to limit requests (e.g., no more than 1000 messages per hour) to ensure system stability.

- **Throttling:**  
  Consider implementing client-side throttling in high-demand environments to prevent overwhelming the server.

### **Common Pitfalls & Troubleshooting**

- **JSON Format:**  
  Always validate your JSON requests. Malformed JSON will lead to errors.
- **Connection Issues:**  
  Handle WebSocket disconnects gracefully and implement retries.
- **Error Responses:**  
  Check error messages for clues. Ensure all required fields are provided and correctly formatted.

### **Error-Handling Strategies**

- **Client-Side Error Handling:**  
  Implement try/catch blocks to capture JSON parsing errors or network issues.
- **Server Feedback:**  
  Use the error messages provided by the API (e.g., missing fields or invalid formats) to adjust your requests accordingly.

---

## 5. Tables & Formatting for Clarity

For quick reference, here are tables summarizing key request parameters and error codes:

### **Agent Configuration Parameters**

| Field                   | Type       | Required | Description                                          |
|-------------------------|------------|----------|------------------------------------------------------|
| system_prompt           | string     | Yes      | Defines the agent’s behavior and role.               |
| model                   | string     | Yes      | Language model to be used (e.g., "gpt-4").           |
| tools                   | List[Tool] | No       | External tools for additional processing.          |
| knowledge_base_content  | string     | No       | Supplemental data for informed responses.          |
| language                | string     | Yes      | Language of communication (default is "English").    |

### **Error Codes & Responses**

| HTTP/WebSocket Status | Code | Meaning                   | Suggested Action                               |
|-----------------------|------|---------------------------|------------------------------------------------|
| 400                   | N/A  | Bad Request               | Verify JSON structure and required fields.     |
| 500                   | N/A  | Internal Server Error     | Retry the request or contact support if persistent. |
| N/A                   | N/A  | WebSocket Disconnect      | Re-establish connection and resend request.    |

---

This documentation should serve as a complete reference to understand, implement, and troubleshoot the Virtual Interviewer API. For further assistance, please refer to the support resources or contact our developer support team.

Happy integrating!