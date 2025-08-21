const BASE_URL = 'http://localhost:3456';

const fetchAllUsers = async () => {
  try {
    const res = await fetch(`${BASE_URL}/users`);

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

// console.log(await fetchAllUsers());

const createUser = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (formData, userId) => {
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};
const deleteUser = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'DELETE',
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

// console.log(
// await createUser({
//   email: 'donald@entenhausen.de',
//   firstName: 'Donald',
//   lastName: 'Duck',
// })
// );

// console.log(
//   await updateUser(
//     {
//       email: 'dagobert@entenhausen.de',
//       firstName: 'Dagobert',
//       lastName: 'Duck',
//     },
//     3
//   )
// );

console.log(await deleteUser(1));
