import { useEffect, useState } from 'react'
import { getOrders } from '../services/orders'

export default function Orders(){
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const run = async ()=>{
      setLoading(true)
      try{ const res = await getOrders(); setOrders(res?.payload || res || []) }
      finally{ setLoading(false) }
    }
    run()
  }, [])

  if(loading) return <div className="text-slate-400">Loading orders…</div>
  if(!orders?.length) return <div className="text-slate-400">No orders yet.</div>

  return (
    <div className="space-y-4">
      {orders.map((o)=> (
        <div key={o._id} className="glass rounded-2xl p-4 border border-white/10">
          <div className="text-slate-100 font-semibold">Order #{o._id.slice(-6)}</div>
          <div className="text-slate-400 text-sm">Status: {o.status} • Total ₹{o.totalAmount}</div>
        </div>
      ))}
    </div>
  )
}


