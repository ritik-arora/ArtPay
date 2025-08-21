export default function Profile() {
  const user = {
    name: "Ritik Arora",
    email: "ritik@example.com",
    mobile: "9999999999",
    age: 23,
    gender: "Male"
  };

  return (
    <div className="page">
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Mobile:</strong> {user.mobile}</p>
      <p><strong>Age:</strong> {user.age}</p>
      <p><strong>Gender:</strong> {user.gender}</p>
    </div>
  );
}
