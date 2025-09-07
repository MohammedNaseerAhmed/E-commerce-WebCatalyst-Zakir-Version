import { useEffect, useState } from 'react'
import { fetchProductsByUser } from '../services/products'
import ProductCard from '../components/ProductCard'

export default function MyProducts(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const run = async ()=>{
      const user = JSON.parse(localStorage.getItem('user')||'null')
      if(!user){ setLoading(false); return }
      setLoading(true)
      try{ const res = await fetchProductsByUser(user.id); setItems(res?.payload || res || []) }
      finally { setLoading(false) }
    }
    run()
  }, [])

  if(loading) return <div className="text-slate-400">Loading…</div>
  if(!items?.length) return <div className="text-slate-400">You have not added any products yet.</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {items.map(p => <ProductCard key={p._id} product={p} />)}
    </div>
  )
}


