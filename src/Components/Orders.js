// src/components/dashboard/Orders.js
import React, { useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { firestore } from "../Firebaseconfig";

const Orders = ({
  orders,
  setOrders,
  isLoadingOrders,
  setIsLoadingOrders,
  orderError,
  setOrderError,
}) => {
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoadingOrders(true);
      setOrderError("");
      try {
        const q = query(collection(firestore, "cs-orders"));
        const snapshot = await getDocs(q);
        const ordersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error(error);
        setOrderError("Failed to load orders.");
      } finally {
        setIsLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [setOrders, setIsLoadingOrders, setOrderError]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-2xl font-semibold mb-6">All Orders</h3>

      {orderError && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl">
          {orderError}
        </div>
      )}

      {isLoadingOrders ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center py-12 text-gray-500">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Total (GHS)</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {order.transactionRef || order.id}
                  </td>
                  <td className="px-4 py-3">
                    {order.customer?.name || "N/A"}
                    <br />
                    <span className="text-xs text-gray-500">
                      {order.customer?.email}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    GHS {order.totalAmount?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${order.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {order.createdAt?.toDate
                      ? order.createdAt.toDate().toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
