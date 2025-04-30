# KafkaBlog 📝📡

KafkaBlog is a backend project that demonstrates microservices communication using **Apache Kafka**. This project includes two independent services — Auth and Post — each with its own database, communicating asynchronously through Kafka to ensure decoupled, scalable, and maintainable architecture.

---

## 🧩 Microservices Overview

### 1. **Auth Service** (Port: `4001`)
- Handles user **signup** and **login**
- Publishes user events to Kafka (`user-signup`, `user-login` topics)
- Connects to its own MongoDB database

### 2. **Post Service** (Port: `4002`)
- Manages **blog post CRUD** operations
- Listens to Kafka topics to handle user-related events
- Has its own separate MongoDB database

---

## 🚀 Why Apache Kafka?

Apache Kafka was used to **enable asynchronous communication** between services.

### ✅ Benefits:

- **Decoupling Services**: Auth and Post services are not tightly coupled. No need for direct HTTP calls or internal API exposure.
- **Scalability**: Kafka allows services to scale independently and handle higher loads without bottlenecks.
- **Fault Tolerance**: Kafka ensures event persistence and delivery even if one service is temporarily down.
- **No CORS Issues**: No need for cross-origin API calls as services talk via Kafka topics.
- **Asynchronous Event Flow**: Events like `user signup` and `user login` are published by Auth and consumed by Post Service.

---

## 🛠️ Tech Stack

- **Node.js + Express**
- **MongoDB**
- **Apache Kafka** (via `kafkajs`)
- **Docker** (for Kafka and Redis setup)

---

## 🧪 Kafka & Redis Setup (via Docker)

Make sure Docker is running, then execute:

```bash
# Start Kafka broker
docker run -p 9092:9092 apache/kafka:3.7.1

# Start Redis (optional, if used for caching or session management)
docker run -p 6379:6379 redis
