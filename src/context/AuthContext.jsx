import { createContext, useContext, useState } from "react";

// ============================================================
// MOCK USERS � ????? ???????? ?? API call ?? ??? Backend
// ============================================================

export const MOCK_USERS = [
  {
    userId: "user-ahmed",
    name: "Ahmed Nasser",
    nameAr: "???? ????",
    initials: "AN",
    role: "admin",
    email: "ahmed@wisework.io",
    avatar: null,
  },
  {
    userId: "user-sara",
    name: "Sara Ahmed",
    nameAr: "???? ????",
    initials: "SA",
    role: "admin",
    email: "sara@wisework.io",
    avatar: null,
  },
  {
    userId: "user-mostafa",
    name: "Mostafa Khalil",
    nameAr: "????? ????",
    initials: "MK",
    role: "hr",
    email: "mostafa@wisework.io",
    avatar: null,
  },
  {
    userId: "user-layla",
    name: "Layla Hassan",
    nameAr: "???? ???",
    initials: "LH",
    role: "employee",
    email: "layla@wisework.io",
    avatar: null,
  },
];

const DEFAULT_USER = MOCK_USERS[0];

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(DEFAULT_USER);

  const switchUser = (userId) => {
    const user = MOCK_USERS.find((u) => u.userId === userId);
    if (user) setCurrentUser(user);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUser,
        mockUsers: MOCK_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
