import { http } from './http.js'

export async function getCart(userId){
  const res = await http.get(`/cart-api/cart/${userId}`)
  return res.data
}

export async function addToCart(payload){
  const res = await http.post('/cart-api/cart', payload)
  return res.data
}


