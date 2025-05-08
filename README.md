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

> ⚠️ **ATTENTION!**
>
> Images that you upload to the server are stored in the `static` directory of the same server.  
> The server only returns the `id` of the uploaded file.  
> 
> To view the image returned by the server, you need to combine the server's `baseUrl` and the `fileId`.  
> 
> For example:  
> `http://localhost:5000/{fileId}`

---

To see all available endpoints and test them, please import the Postman collection and environment provided in this repository (`attachments` folder).


## Getting Started

1. Clone the repository:
```bash
git clone https://git.epam.com/nikita_shevtsiv/jira-pet-project-backend.git
```
2. Install dependencies:
```bash
npm install
```
3. Run the project:
```bash
npm run dev
```
4. Make sure that a file called `database.sqlite` is created in the root of the project — this is your database.
5. Find the Postman collection [`attachments/Jira Pet Project (Node.js).postman_collection`] and its corresponding Env [`attachments/Jira_pet_project_node_js.postman_environment.json`].
6. Set up Postman to display the collection (`Jira Pet Project (Node.js)`) and use the Env (`Jira_pet_project_node_js`).
7. Try the `Authorization/login` endpoint. You should see a `400 - Bad Request` status with the message: `"User not found"`, as the database is still empty.

## 🔗 Reference Frontend Implementation

If you want to see an already implemented **React frontend** for this backend, check out the following repository:

👉 [React Frontend for the Jira-like App](https://git.epam.com/nikita_shevtsiv/epam-mobile-lab-react)

Read its `README.md` to find:

- Recommendations and development patterns for **React**, **React Native**, **Angular**, and **Node.js / Express**
- Suggested **testing approaches**
- Built-in interactive tutorials available inside the app (look for the ❓ icon in the top-right corner)

This frontend was designed as part of the training to help developers build scalable apps using real backend data and best practices.


## Good luck and have fun! 🚀