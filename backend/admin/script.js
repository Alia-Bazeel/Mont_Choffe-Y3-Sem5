document.addEventListener('DOMContentLoaded', () => {

    const userTable = document.getElementById('userTable');

    /* FETCH USERS */

    async function fetchUsers() {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch('/api/users', {
                headers: { Authorization: 'Bearer ' + token }
            });
            const users = await res.json();
            renderUsers(users);
        } catch (error) {
            console.error(error);
        }
    }

    function renderUsers(users) {
        if (!userTable) return;
        userTable.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button onclick="editUser('${user._id}')">Edit</button>
                    <button onclick="deleteUser('${user._id}')">Delete</button>
                </td>
            `;
            userTable.appendChild(row);
        });
    }

    /* EDIT USER */

    window.editUser = function(id) {
        window.location.href = `edit-user.html?id=${id}`;
    }

    /* DELETE USER */

    window.deleteUser = async function(id) {
        if (!confirm('Are you sure to delete this user?')) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: { Authorization: 'Bearer ' + token }
            });
            if (res.ok) {
                fetchUsers();
            } else {
                const data = await res.json();
                alert(data.error);
            }
        } catch (error) {
            console.error(error);
        }
    }

    /* INITIALIZE */

    if (userTable) fetchUsers();
});
