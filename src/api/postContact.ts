const apiUrl = import.meta.env.VITE_API_URL;

export default async function postContact(
  name: string,
  email: string,
  message: string,
) {
  const response = await fetch(`${apiUrl}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, message }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}
