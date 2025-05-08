## About This Repository

This project provides a **RESTful backend for a task and project management system**, similar in concept to Jira. It is designed to help **frontend and mobile developers** practice working with realistic APIs, including handling authentication, role-based access, nested resources, and file uploads.

### Core Features

- **Project Management**: Create, edit, delete projects; manage project members.  
- **Task Management**: Create, edit, delete tasks within projects; assign tasks to users; upload files.  
- **Comments**: Add comments to tasks, optionally attaching files; edit and delete your own comments.  
- **File Handling**: Upload files to tasks or comments; detach files.  
- **User Roles**: Distinction between `ADMIN` and `USER` access rights:
  - `ADMIN`: full CRUD access to all resources.
  - `USER`: limited to read and update operations within assigned projects.
- **Statuses & Types**: Manage task statuses and types (e.g. "Bug", "Feature") — full control for admins, read-only for users.

### Authentication

The backend uses **JWT tokens** for authentication. Role-based access is enforced at the route level.

---

To see all available endpoints and test them, please import the Postman collection and environment provided in this repository.
