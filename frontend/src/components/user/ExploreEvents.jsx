import { useEffect, useState } from "react";

export default function ExploreEvents(){
    const [events,setEvents]=useState([]);
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")

    useEffect(()=>{
        const fetchEvents = async ()=>{
            try{
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/explore-events",{
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                const data  = await res.json();
                if(data.success){
                    setEvents(data.events)
                } else{
                    setError(data.message || "Failed to load events")
                }
            }
            catch(error){
                console.error("Error fetching events: ", error.message)
                setError("Something went wrong please try again later")
            } finally{
                setLoading(false)
            }
        }
        fetchEvents()
    },[])
    if(loading){
        <div className="flex justify-center items-center h-screen">
            <p className="text-gray-600 text-lg">Loading...</p>
        </div>
    }
    if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );

     return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-blue-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Upcoming Events
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {event.title}
            </h2>
            <p className="text-gray-600 text-sm mb-1">
              📅 <strong>Date:</strong>{" "}
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="text-gray-600 text-sm mb-3">
              📍 <strong>Location:</strong> {event.location || "TBA"}
            </p>
            <p className="text-gray-700 mb-4">
              {event.description || "No description available"}
            </p>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Register
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}