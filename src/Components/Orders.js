// src/components/dashboard/Orders.js
import React, { useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { firestore } from "../Firebaseconfig";
import { FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

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
        const q = query(
          collection(firestore, "cs-orders"),
          orderBy("createdAt", "desc"),
        );
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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tight">
          Order Fulfillment Center
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-900 text-white uppercase text-[10px] tracking-[0.2em] font-black">
              <th className="px-6 py-4 rounded-tl-xl">Order Ref</th>
              <th className="px-6 py-4">Items Ordered</th>
              <th className="px-6 py-4">Customer Contact & Logistics</th>
              <th className="px-6 py-4">Financials</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 rounded-tr-xl">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 transition-all group"
              >
                {/* 1. Reference */}
                <td className="px-6 py-6 align-top">
                  <span className="font-black text-indigo-600 block">
                    {order.moolreReference || "REF-PENDING"}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">
                    ID: {order.id.slice(0, 8)}
                  </span>
                </td>

                {/* 2. PRODUCT IMAGES (NEW) */}
                <td className="px-6 py-6 align-top">
                  <div className="flex flex-col gap-4">
                    {order.cartItems?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={
                              item.image || "https://via.placeholder.com/150"
                            }
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover bg-white border border-gray-200"
                          />
                          <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex flex-col max-w-[150px]">
                          <span className="text-[11px] font-black text-gray-900 leading-tight uppercase">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold">
                            GHS {item.price?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>

                {/* 3. DETAILED CUSTOMER INFO */}
                <td className="px-6 py-6 align-top">
                  <div className="flex flex-col gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-gray-900 font-black">
                        <FaUser className="text-indigo-400" size={14} />
                        {order.customer?.name || "Guest Customer"}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
                        <FaEnvelope className="text-gray-300" size={12} />
                        {order.customer?.email}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaPhone className="text-green-500" size={12} />
                      <span
                        className={`text-xs font-bold ${!order.customer?.phone ? "text-gray-300 italic" : "text-gray-700"}`}
                      >
                        {order.customer?.phone || "No Phone Number Provided"}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 max-w-[220px]">
                      <FaMapMarkerAlt className="text-red-500 mt-1" size={12} />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                          Delivery Address:
                        </span>
                        <span
                          className={`text-xs font-medium leading-relaxed ${!order.customer?.location ? "text-gray-300 italic" : "text-gray-700"}`}
                        >
                          {order.customer?.location ||
                            "No Shipping Address Provided"}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* 4. Financials */}
                <td className="px-6 py-6 align-top">
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-gray-900">
                      GHS {(order.totalAmount || order.amount || 0).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {order.currency || "GHS"} Total
                    </span>
                  </div>
                </td>

                {/* 5. Status */}
                <td className="px-6 py-6 align-top">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                      order.status === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-2 ${order.status === "success" ? "bg-green-600" : "bg-orange-600"}`}
                    />
                    {order.status}
                  </span>
                </td>

                {/* 6. Date */}
                <td className="px-6 py-6 align-top text-xs font-bold text-gray-500">
                  {order.createdAt?.toDate
                    ? order.createdAt.toDate().toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
