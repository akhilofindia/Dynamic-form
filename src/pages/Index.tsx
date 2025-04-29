
import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import DynamicForm from "@/components/DynamicForm";
import { User } from "@/types/form";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Dynamic Form Navigator</h1>
        
        {!user ? (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium">
                Logged in as: <span className="font-semibold">{user.name}</span> (Roll: {user.rollNumber})
              </p>
            </div>
            <DynamicForm user={user} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
