---
name: database-skill
description: Design and manage databases including schema design, table creation, and migrations. Use for backend data modeling and persistence.
---

# Database Skill

## Instructions

1. **Schema design**
   - Identify entities and relationships
   - Normalize data appropriately (avoid over/under-normalization)
   - Define primary keys and foreign keys clearly
   - Choose correct data types and constraints

2. **Table creation**
   - Create tables with clear, consistent naming conventions
   - Apply NOT NULL, UNIQUE, DEFAULT, and CHECK constraints
   - Use indexes for frequently queried fields
   - Ensure referential integrity with foreign keys

3. **Migrations**
   - Create reversible migrations (upgrade and downgrade)
   - Version schema changes incrementally
   - Avoid destructive changes without data safety strategies
   - Keep migrations small and focused

4. **Performance considerations**
   - Optimize indexes based on query patterns
   - Avoid unnecessary joins
   - Plan for scalability and future growth
   - Use appropriate partitioning if needed

5. **Security & reliability**
   - Enforce least-privilege access
   - Avoid storing sensitive data in plain text
   - Use transactions for critical operations
   - Ensure data consistency and integrity

## Best Practices
- Use snake_case for table and column names
- Keep schema changes backward-compatible when possible
- Document schema decisions and relationships
- Prefer migrations over manual database changes
- Test migrations in staging before production

## Example Structure
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
