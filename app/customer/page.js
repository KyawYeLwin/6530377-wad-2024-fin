"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function CustomerPage() {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [customers, setCustomers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch customers from the API
  async function fetchCustomers() {
    try {
      const response = await fetch('/api/customer');
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  }

  // Add a new customer
  const createCustomer = async (data) => {
    try {
      const response = await fetch('/api/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Ensure the body is correctly stringified
      });
      const result = await response.json();
      console.log(result); // Log the response for debugging
      reset(); // Reset form
      fetchCustomers(); // Refresh the customer list
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  // Update an existing customer
  const updateCustomer = async (data) => {
    try {
      const response = await fetch('/api/customer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error updating customer');
      setIsEditing(false);
      reset();
      fetchCustomers(); // Refresh the customer list
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  // Delete a customer by ID
  const deleteCustomer = async (id) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      const response = await fetch(`/api/customer/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting customer');
      fetchCustomers(); // Refresh the customer list
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  // Handle edit action
  const handleEdit = (customer) => {
    setIsEditing(true);
    setValue('_id', customer._id);
    setValue('name', customer.name);
    setValue('dateOfBirth', customer.dateOfBirth.split('T')[0]); // Adjust for correct date format
    setValue('memberNumber', customer.memberNumber);
    setValue('interests', customer.interests);
  };

  // Handle form submit (for both add and update)
  const onSubmit = (data) => {
    if (isEditing) {
      updateCustomer(data);
    } else {
      createCustomer(data);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div>
      <h1 className="text-2xl">Customers</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 m-4 w-1/2">
        <input type="hidden" {...register("_id")} />
        <div>Name:</div>
        <div><input type="text" {...register("name", { required: true })} className="border border-black w-full" /></div>
        <div>Date of Birth:</div>
        <div><input type="date" {...register("dateOfBirth", { required: true })} className="border border-black w-full" /></div>
        <div>Member Number:</div>
        <div><input type="number" {...register("memberNumber", { required: true })} className="border border-black w-full" /></div>
        <div>Interests:</div>
        <div><input type="text" {...register("interests", { required: true })} className="border border-black w-full" /></div>
        <div className="col-span-2">
          <input
            type="submit"
            value={isEditing ? "Update" : "Add"}
            className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          />
        </div>
      </form>

      <div className="border m-4 bg-slate-300">
        <h1 className="text-2xl">Customer List ({customers.length})</h1>
        <ul className="list-disc ml-8">
          {customers.map((customer) => (
            <li key={customer._id}>
              <button className="border border-black p-1" onClick={() => deleteCustomer(customer._id)}>❌</button>{' '}
              <button className="font-bold" onClick={() => handleEdit(customer)}>
                {customer.name}
              </button>{' '}
              - {customer.interests}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
