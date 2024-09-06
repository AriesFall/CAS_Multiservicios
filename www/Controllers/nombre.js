async function getFullNameByEmail() {
    const email = localStorage.getItem('email');

    if (!email) {
        console.error('No email found in localStorage');
        return;
    }

    try {
        const response = await fetch(allUsers_route, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const users = await response.json();
        const user = users.find(user => user.Email === email);

        if (user) {
            console.log(`Full name: ${user.FullName}`);
            return user.FullName;
        } else {
            console.log('No user found with the provided email');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}
