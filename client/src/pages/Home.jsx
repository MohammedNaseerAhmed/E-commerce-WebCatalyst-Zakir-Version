import { useEffect, useState } from 'react'
import { fetchProducts } from '../services/products.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Home(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')

  useEffect(()=>{
    const run = async ()=>{
      setLoading(true)
      try{
        const data = await fetchProducts({ q, category, sort: 'rating' })
        const list = data.items || data || []
        setItems(list)
      } finally { setLoading(false) }
    }
    run()
  }, [q, category])

  return (
    <div>
      <section className="mb-6 glass rounded-2xl p-6 border border-white/10 animate-slide-up">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1 animate-slide-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gradient animate-pulse-3d">Handmade with love</h1>
            <p className="text-slate-400 mt-1">Discover unique crafts from local artisans.</p>
          </div>
          <div className="flex-1 flex gap-3 animate-slide-right">
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products..." className="flex-1 bg-transparent outline-none px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100 hover-3d focusable"/>
            <select value={category} onChange={e=>setCategory(e.target.value)} className="bg-transparent px-3 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100 hover-3d focusable">
              <option className="bg-slate-900" value="">All</option>
              <option className="bg-slate-900" value="jewelry">Jewelry</option>
              <option className="bg-slate-900" value="decor">Wall Décor</option>
              <option className="bg-slate-900" value="paintings">Paintings</option>
              <option className="bg-slate-900" value="textiles">Textiles</option>
            </select>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="text-slate-400 animate-pulse-3d">Loading products…</div>
      ) : items.length === 0 ? (
        <div className="text-slate-400 text-center py-20 animate-float">No products found. Try a different search or category.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((p, index)=> (
            <div key={p._id} className={`animate-slide-up delay-${Math.min(index * 100, 800)}`}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


