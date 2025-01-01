"use client";

import React, { useState, useEffect } from "react";
import {
    ArrowUpDown,
    Users,
    Phone,
    MapPin,
    Plus,
    Trash2,
    Edit,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface Geolocation {
    lat: string;
    long: string;
}

interface Address {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: Geolocation;
}

interface Name {
    firstname: string;
    lastname: string;
}

interface User {
    id: number;
    email: string;
    username: string;
    password: string;
    name: Name;
    address: Address;
    phone: string;
}

const initialUserForm = {
    email: "",
    username: "",
    password: "default123",
    name: { firstname: "", lastname: "" },
    address: {
        city: "",
        street: "",
        number: 0,
        zipcode: "",
        geolocation: { lat: "0", long: "0" },
    },
    phone: "",
};

const UserList = () => {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [nextId, setNextId] = useState<number>(1);
    const [limit, setLimit] = useState<number>(5);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userForm, setUserForm] = useState(initialUserForm);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [alert, setAlert] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, [limit, sortOrder]);

    useEffect(() => {
        if (users.length > 0) {
            const maxId = Math.max(...users.map((user) => user.id));
            setNextId(maxId + 1);
        }
    }, [users]);

    useEffect(() => {
        if (!token) {
            router.push("/");
        }
    }, [token, router]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://fakestoreapi.com/users?limit=${limit}&sort=${sortOrder}`
            );
            const data = await response.json();

            const uniqueUsers = data.map((user: User, index: number) => ({
                ...user,
                id: user.id || index + 1,
            }));
            setUsers(uniqueUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
            showAlert("error", "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editingUserId
                ? `https://fakestoreapi.com/users/${editingUserId}`
                : "https://fakestoreapi.com/users";

            const response = await fetch(url, {
                method: editingUserId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userForm),
            });

            const data = await response.json();

            if (editingUserId) {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === editingUserId
                            ? {
                                  ...data,
                                  id: editingUserId,
                              }
                            : user
                    )
                );
            } else {
                const newUser = {
                    ...userForm,
                    id: nextId,
                };
                setUsers((prevUsers) => [...prevUsers, newUser]);
                setNextId((prevId) => prevId + 1);
            }

            showAlert(
                "success",
                `User ${editingUserId ? "updated" : "created"} successfully`
            );
            handleCloseModal();
        } catch (error) {
            console.error("Error saving user:", error);
            showAlert("error", "Failed to save user");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            setLoading(true);
            await fetch(`https://fakestoreapi.com/users/${id}`, {
                method: "DELETE",
            });

            setUsers(users.filter((user) => user.id !== id));
            showAlert("success", "User deleted successfully");
        } catch (error) {
            console.error("Error deleting user:", error);
            showAlert("error", "Failed to delete user");
        } finally {
            setLoading(false);
            setShowDeleteDialog(false);
            setUserToDelete(null);
        }
    };

    const handleEdit = (user: User) => {
        setEditingUserId(user.id);
        setUserForm(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUserId(null);
        setUserForm(initialUserForm);
    };

    const showAlert = (type: "success" | "error", message: string) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), 3000);
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {alert && (
                <Alert
                    className={`mb-4 ${
                        alert.type === "success"
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                    }`}
                >
                    <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <Users className="h-6 w-6" />
                            User List
                        </CardTitle>
                        <div className="flex items-center gap-4">
                            <select
                                className="p-2 border rounded-md bg-white"
                                value={limit}
                                onChange={(e) =>
                                    setLimit(Number(e.target.value))
                                }
                            >
                                <option value={5}>5 users</option>
                                <option value={10}>10 users</option>
                                <option value={20}>20 users</option>
                            </select>
                            <button
                                onClick={toggleSortOrder}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            >
                                <ArrowUpDown className="h-4 w-4" />
                                Sort{" "}
                                {sortOrder === "asc"
                                    ? "Descending"
                                    : "Ascending"}
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Add User
                            </button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {users.map((user) => (
                                <Card
                                    key={`user-${user.id}`}
                                    className="overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <CardContent className="p-4">
                                        <div className="space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        {user.name.firstname}{" "}
                                                        {user.name.lastname}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        @{user.username}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(user)
                                                        }
                                                        className="p-1 hover:bg-gray-100 rounded-full"
                                                    >
                                                        <Edit className="h-4 w-4 text-blue-500" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setUserToDelete(
                                                                user.id
                                                            );
                                                            setShowDeleteDialog(
                                                                true
                                                            );
                                                        }}
                                                        className="p-1 hover:bg-gray-100 rounded-full"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-sm flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                    {user.phone}
                                                </p>
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                                                    <div className="text-sm">
                                                        <p>
                                                            {
                                                                user.address
                                                                    .street
                                                            }
                                                        </p>
                                                        <p>
                                                            {user.address.city},{" "}
                                                            {
                                                                user.address
                                                                    .zipcode
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t">
                                                <p className="text-sm text-gray-500 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* User Form Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingUserId ? "Edit User" : "Add New User"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingUserId
                                ? "Update the user information in the form below."
                                : "Fill in the form below to create a new user."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={userForm.name.firstname}
                                    onChange={(e) =>
                                        setUserForm({
                                            ...userForm,
                                            name: {
                                                ...userForm.name,
                                                firstname: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={userForm.name.lastname}
                                    onChange={(e) =>
                                        setUserForm({
                                            ...userForm,
                                            name: {
                                                ...userForm.name,
                                                lastname: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input
                                type="email"
                                value={userForm.email}
                                onChange={(e) =>
                                    setUserForm({
                                        ...userForm,
                                        email: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Username
                            </label>
                            <input
                                type="text"
                                value={userForm.username}
                                onChange={(e) =>
                                    setUserForm({
                                        ...userForm,
                                        username: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone</label>
                            <input
                                type="tel"
                                value={userForm.phone}
                                onChange={(e) =>
                                    setUserForm({
                                        ...userForm,
                                        phone: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Address
                            </label>
                            <input
                                type="text"
                                value={userForm.address.street}
                                onChange={(e) =>
                                    setUserForm({
                                        ...userForm,
                                        address: {
                                            ...userForm.address,
                                            street: e.target.value,
                                        },
                                    })
                                }
                                placeholder="Street"
                                className="w-full p-2 border rounded-md mb-2"
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    value={userForm.address.city}
                                    onChange={(e) =>
                                        setUserForm({
                                            ...userForm,
                                            address: {
                                                ...userForm.address,
                                                city: e.target.value,
                                            },
                                        })
                                    }
                                    placeholder="City"
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                                <input
                                    type="text"
                                    value={userForm.address.zipcode}
                                    onChange={(e) =>
                                        setUserForm({
                                            ...userForm,
                                            address: {
                                                ...userForm.address,
                                                zipcode: e.target.value,
                                            },
                                        })
                                    }
                                    placeholder="Zipcode"
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>
                        </div>

                        <DialogFooter className="sm:justify-start">
                            <div className="flex gap-4 w-full">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this user? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <div className="flex gap-4 w-full">
                            <button
                                onClick={() =>
                                    userToDelete && handleDelete(userToDelete)
                                }
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                disabled={loading}
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                    setUserToDelete(null);
                                }}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserList;
