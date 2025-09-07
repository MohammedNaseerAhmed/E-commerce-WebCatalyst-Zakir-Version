import { useState } from 'react'
import { placeOrder } from '../services/orders.js'

export default function Checkout(){
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [placing, setPlacing] = useState(false)
  const [success, setSuccess] = useState(false)

  const onPlace = async ()=>{
    setPlacing(true)
    try{
      const user = JSON.parse(localStorage.getItem('user')||'null')
      if(!user){ throw new Error('Please login') }
      await placeOrder({ products: [], totalAmount: 0 })
      setSuccess(true)
    } finally { setPlacing(false) }
  }

  if(success) return (
    <div className="glass rounded-2xl p-6 border border-white/10 text-center">
      <h2 className="text-xl font-semibold text-slate-100">Order placed 🎉</h2>
      <p className="text-slate-400 mt-2">Thank you for supporting small artisans.</p>
      <div className="mt-4 inline-block p-4 rounded-xl border border-white/10">
        <div className="text-slate-400 text-sm">Mock UPI QR</div>
        <div className="h-32 w-32 bg-white/10 mt-2"></div>
      </div>
    </div>
  )

  return (
    <div className="glass rounded-2xl p-6 border border-white/10">
      <h2 className="text-xl font-semibold text-slate-100 mb-4">Checkout</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="bg-transparent outline-none px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100"/>
        <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Address" className="bg-transparent outline-none px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100"/>
      </div>
      <div className="mt-4 text-right">
        <button disabled={placing} onClick={onPlace} className="btn btn-primary disabled:opacity-60">
          {placing ? 'Placing…' : 'Place Order'}
        </button>
      </div>
    </div>
  )
}


