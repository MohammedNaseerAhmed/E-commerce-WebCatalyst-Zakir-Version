import { useEffect, useState } from 'react'
import { getCart } from '../services/cart.js'
import { Link } from 'react-router-dom'

export default function Cart(){
  const [cart, setCart] = useState(null)
  useEffect(()=>{ (async()=> {
    const user = JSON.parse(localStorage.getItem('user')||'null')
    if(!user) return
    setCart(await getCart(user.id))
  })() }, [])

  const items = cart?.items || []
  const subtotal = items.reduce((s,it)=> s + (it.productId?.price || it.price || 0) * (it.quantity||1), 0)

  return (
    <div className="glass rounded-2xl p-6 border border-white/10">
      <h2 className="text-xl font-semibold text-slate-100 mb-4">Your Cart</h2>
      {items.length===0 ? (
        <div className="text-slate-400">Cart is empty.</div>
      ) : (
        <div className="space-y-4">
          {items.map((it, idx)=> (
            <div key={idx} className="flex items-center gap-4">
              <img src={it.productId?.images?.[0] || 'https://via.placeholder.com/80'} className="h-16 w-16 object-cover rounded-lg"/>
              <div className="flex-1">
                <div className="text-slate-100">{it.productId?.title || 'Item'}</div>
                <div className="text-slate-400 text-sm">Qty: {it.quantity}</div>
              </div>
              <div className="text-cyan-300">₹{(it.productId?.price || it.price || 0) * (it.quantity||1)}</div>
            </div>
          ))}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="text-slate-400">Subtotal</div>
            <div className="text-cyan-300 font-semibold">₹{subtotal}</div>
          </div>
          <div className="text-right">
            <Link to="/checkout" className="inline-block btn btn-primary">Checkout</Link>
          </div>
        </div>
      )}
    </div>
  )
}


